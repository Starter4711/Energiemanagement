// ioBroker object: script.js.energiemanagement.Grid_Flow_V1
// name: Grid_Flow_V1
// engineType: Javascript/js
// enabled: True

'use strict';

const ROOT = '0_userdata.0.EOS.Grid';

const CONFIG = {
    version: '1.0.2',
    logLevel: 'info',
    debugEnabled: false,
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
    {
        name: 'Grid40',
        deviceInstance: 40,
        location: 'Alte_Wohnung',
        id: 'alias.0.EM24 Old Grid.Power Old Grid',
    },
    {
        name: 'Grid41',
        deviceInstance: 41,
        location: 'Halle',
        id: 'alias.0.EM24 Hall Grid.Power',
    },
    {
        name: 'Grid43',
        deviceInstance: 43,
        location: 'Haus',
        id: 'alias.0.EM24 New Grid.Power',
    },
];

const STATE_DEFINITIONS = [];

for (const source of SOURCES) {
    const sourceRoot = `${ROOT}.Sources.${source.name}`;
    STATE_DEFINITIONS.push(
        { id: `${sourceRoot}.DeviceInstance`, type: 'number', role: 'value', unit: '', defaultValue: source.deviceInstance },
        { id: `${sourceRoot}.Location`, type: 'string', role: 'text', unit: '', defaultValue: source.location },
        { id: `${sourceRoot}.Power`, type: 'number', role: 'value.power', unit: 'W', defaultValue: 0 },
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
        log(`Grid_Flow_V1: ${message}`, level);
    }
}

function createGridState(definition) {
    createState(definition.id, definition.defaultValue, {
        name: definition.id.split('.').pop(),
        type: definition.type,
        role: definition.role,
        unit: definition.unit,
        read: true,
        write: false,
    });
}

function ensureStates() {
    for (const definition of STATE_DEFINITIONS) {
        createGridState(definition);
    }
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

    if (typeof state.val !== 'number' || !Number.isFinite(state.val)) {
        return {
            name: source.name,
            power: 0,
            status: 'ERROR',
            lastUpdate: hasTimestamp ? timestamp : 0,
            ageSeconds,
        };
    }

    if (!hasTimestamp) {
        return {
            name: source.name,
            power: 0,
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

    return {
        name: source.name,
        power: status === 'OK' ? Math.round(state.val) : 0,
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

    emit(status === 'OK' ? 'info' : 'warn', `${name} Status ${status}.`);
}

function writeSourceSnapshot(snapshot) {
    const sourceRoot = `${ROOT}.Sources.${snapshot.name}`;
    writeChanged(`${sourceRoot}.Power`, snapshot.power);
    writeChanged(`${sourceRoot}.Status`, snapshot.status);
    writeChanged(`${sourceRoot}.LastUpdate`, snapshot.lastUpdate);
    writeChanged(`${sourceRoot}.AgeSeconds`, snapshot.ageSeconds);
    logStatusChange(snapshot.name, snapshot.status);
}

function refreshSource(source, state, now) {
    const snapshot = evaluateSource(source, state, now);
    snapshots.set(source.name, snapshot);
    writeSourceSnapshot(snapshot);
}

function refreshAll() {
    ensureStates();
    const now = Date.now();
    for (const source of SOURCES) {
        refreshSource(source, getState(source.id), now);
    }
}

function subscribeToSources() {
    for (const source of SOURCES) {
        on({ id: source.id, change: 'any' }, obj => {
            const now = Date.now();
            refreshSource(source, obj && obj.state ? obj.state : getState(source.id), now);
        });
    }
}

let ageTimer = null;

try {
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
    log(`Grid_Flow_V1 Fehler: ${error.message}`, 'error');
}
