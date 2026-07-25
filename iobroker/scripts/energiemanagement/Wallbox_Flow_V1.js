// ioBroker object: script.js.energiemanagement.Wallbox_Flow_V1
// name: Wallbox_Flow_V1
// engineType: Javascript/js
// enabled: True

'use strict';

const ROOT = '0_userdata.0.EOS.Wallbox';

const CONFIG = {
    version: '1.0.0',
    logLevel: 'info',
    debugEnabled: false,
    activeThresholdW: 100,
    staleAfterSeconds: 30,
    offlineAfterSeconds: 120,
    ageCheckIntervalMs: 60000,
};

const LEVEL_PRIORITY = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const SOURCES = [
    { name: 'Wallbox1', id: 'alias.0.go-E.powerV3' },
    { name: 'Wallbox2', id: 'alias.0.go-E.powerV4' },
    { name: 'Wallbox3', id: 'alias.0.go-E.go-E-V4-Halle' },
];

const STATE_DEFINITIONS = [
    { id: `${ROOT}.Summary.Power`, type: 'number', role: 'value.power', unit: 'W', defaultValue: 0 },
    { id: `${ROOT}.Summary.Active`, type: 'boolean', role: 'indicator', unit: '', defaultValue: false },
    { id: `${ROOT}.Summary.Status`, type: 'string', role: 'text', unit: '', defaultValue: 'UNKNOWN' },
    { id: `${ROOT}.Summary.LastUpdate`, type: 'number', role: 'value.time', unit: 'ms', defaultValue: 0 },
];

for (const source of SOURCES) {
    const sourceRoot = `${ROOT}.Sources.${source.name}`;
    STATE_DEFINITIONS.push(
        { id: `${sourceRoot}.Power`, type: 'number', role: 'value.power', unit: 'W', defaultValue: 0 },
        { id: `${sourceRoot}.Active`, type: 'boolean', role: 'indicator', unit: '', defaultValue: false },
        { id: `${sourceRoot}.Status`, type: 'string', role: 'text', unit: '', defaultValue: 'UNKNOWN' },
        { id: `${sourceRoot}.LastUpdate`, type: 'number', role: 'value.time', unit: 'ms', defaultValue: 0 },
        { id: `${sourceRoot}.AgeSeconds`, type: 'number', role: 'value.interval', unit: 's', defaultValue: 0 }
    );
}

const snapshots = new Map();
const lastStatuses = new Map();

function shouldLog(level) {
    return LEVEL_PRIORITY[level] <= LEVEL_PRIORITY[CONFIG.logLevel]
        || (level === 'debug' && CONFIG.debugEnabled);
}

function emit(level, message) {
    if (shouldLog(level)) {
        log(`Wallbox_Flow_V1: ${message}`, level);
    }
}

function createWallboxState(definition) {
    createState(definition.id, definition.defaultValue, {
        name: definition.id.split('.').pop(),
        type: definition.type,
        role: definition.role,
        unit: definition.unit,
        read: true,
        write: false,
    });
}

function writeChanged(id, value) {
    const current = getState(id);
    if (!current || current.val !== value) {
        setState(id, value, true);
        return true;
    }
    return false;
}

function evaluateSource(source, state, now) {
    if (!state) {
        return {
            name: source.name,
            power: 0,
            active: false,
            status: 'UNKNOWN',
            lastUpdate: 0,
            ageSeconds: 0,
        };
    }

    const timestamp = Number(state.ts);
    const hasTimestamp = Number.isFinite(timestamp) && timestamp > 0;
    const ageSeconds = hasTimestamp
        ? Math.max(0, Math.floor((now - timestamp) / 1000))
        : 0;

    if (typeof state.val !== 'number' || !Number.isFinite(state.val) || state.val < 0) {
        return {
            name: source.name,
            power: 0,
            active: false,
            status: 'ERROR',
            lastUpdate: hasTimestamp ? timestamp : 0,
            ageSeconds,
        };
    }

    if (!hasTimestamp) {
        return {
            name: source.name,
            power: 0,
            active: false,
            status: 'UNKNOWN',
            lastUpdate: 0,
            ageSeconds: 0,
        };
    }

    let status = 'OK';
    if (ageSeconds > CONFIG.offlineAfterSeconds) {
        status = 'OFFLINE';
    } else if (ageSeconds > CONFIG.staleAfterSeconds) {
        status = 'STALE';
    }

    const power = status === 'OK' ? Math.round(state.val * 1000) : 0;

    return {
        name: source.name,
        power,
        active: status === 'OK' && power > CONFIG.activeThresholdW,
        status,
        lastUpdate: timestamp,
        ageSeconds,
    };
}

function logStatusChange(name, status) {
    const previous = lastStatuses.get(name);
    lastStatuses.set(name, status);

    if (previous === undefined || previous === status) {
        return;
    }

    if (status === 'OK') {
        emit('info', `${name} wieder OK.`);
    } else {
        emit('warn', `${name} Status ${status}.`);
    }
}

function writeSourceSnapshot(snapshot) {
    const sourceRoot = `${ROOT}.Sources.${snapshot.name}`;

    writeChanged(`${sourceRoot}.Power`, snapshot.power);
    writeChanged(`${sourceRoot}.Active`, snapshot.active);
    writeChanged(`${sourceRoot}.Status`, snapshot.status);
    writeChanged(`${sourceRoot}.LastUpdate`, snapshot.lastUpdate);
    writeChanged(`${sourceRoot}.AgeSeconds`, snapshot.ageSeconds);

    logStatusChange(snapshot.name, snapshot.status);
}

function buildSummaryStatus(sourceSnapshots) {
    const statuses = sourceSnapshots.map(snapshot => snapshot.status);
    const okCount = statuses.filter(status => status === 'OK').length;

    if (okCount === SOURCES.length) {
        return 'OK';
    }
    if (okCount > 0) {
        return 'DEGRADED';
    }
    if (statuses.includes('ERROR')) {
        return 'ERROR';
    }
    if (statuses.includes('STALE')) {
        return 'STALE';
    }
    if (statuses.includes('OFFLINE')) {
        return 'OFFLINE';
    }
    return 'UNKNOWN';
}

function refreshSummary(now) {
    const sourceSnapshots = SOURCES.map(source => snapshots.get(source.name))
        .filter(snapshot => snapshot !== undefined);

    const power = sourceSnapshots
        .filter(snapshot => snapshot.status === 'OK')
        .reduce((sum, snapshot) => sum + snapshot.power, 0);
    const active = sourceSnapshots.some(snapshot => snapshot.status === 'OK' && snapshot.active);
    const status = buildSummaryStatus(sourceSnapshots);

    const changed = [
        writeChanged(`${ROOT}.Summary.Power`, power),
        writeChanged(`${ROOT}.Summary.Active`, active),
        writeChanged(`${ROOT}.Summary.Status`, status),
    ].some(Boolean);

    if (changed) {
        writeChanged(`${ROOT}.Summary.LastUpdate`, now);
    }

    logStatusChange('Summary', status);
}

function refreshSource(source, state, now) {
    const snapshot = evaluateSource(source, state, now);
    snapshots.set(source.name, snapshot);
    writeSourceSnapshot(snapshot);
}

function refreshAll() {
    const now = Date.now();

    for (const source of SOURCES) {
        refreshSource(source, getState(source.id), now);
    }

    refreshSummary(now);
}

function subscribeToSources() {
    for (const source of SOURCES) {
        on({ id: source.id, change: 'any' }, obj => {
            const now = Date.now();
            refreshSource(source, obj && obj.state ? obj.state : getState(source.id), now);
            refreshSummary(now);
        });
    }
}

let ageTimer = null;

try {
    for (const definition of STATE_DEFINITIONS) {
        createWallboxState(definition);
    }

    subscribeToSources();
    refreshAll();

    ageTimer = setInterval(refreshAll, CONFIG.ageCheckIntervalMs);

    if (typeof onStop === 'function') {
        onStop(() => {
            if (ageTimer !== null) {
                clearInterval(ageTimer);
                ageTimer = null;
            }
        }, 1000);
    }

    emit('info', `Version ${CONFIG.version} read-only gestartet.`);
} catch (error) {
    log(`Wallbox_Flow_V1 Fehler: ${error.message}`, 'error');
}
