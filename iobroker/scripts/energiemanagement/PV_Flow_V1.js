// ioBroker object: script.js.energiemanagement.PV_Flow_V1
// name: PV_Flow_V1
// engineType: Javascript/js
// enabled: False

'use strict';

const ROOT = '0_userdata.0.EOS.PV';
const CONFIG = {
    version: '1.0.1',
    activeThresholdW: 1,
    staleAfterSeconds: 30,
    offlineAfterSeconds: 120,
    ageCheckIntervalMs: 60000,
};

const SOURCES = [
    { name: 'FroniusHalle', group: 'AC', id: 'alias.0.Fronius.AC-Power' },
    { name: 'FroniusHaus', group: 'AC', id: 'alias.0.Fronius.AC-Power_10kW' },
    { name: 'SMA', group: 'AC', id: 'alias.0.SMA.Power' },
    { name: 'SolarEdge', group: 'AC', id: 'alias.0.SE.Power' },
    { name: 'RS450String1', group: 'DC', id: 'alias.0.MPPT RS450/100.P String1' },
    { name: 'RS450String2', group: 'DC', id: 'alias.0.MPPT RS450/100.P String2' },
];

const DEFINITIONS = [
    { id: `${ROOT}.Summary.TotalPower`, type: 'number', role: 'value.power', unit: 'W', value: 0 },
    { id: `${ROOT}.Summary.ACPower`, type: 'number', role: 'value.power', unit: 'W', value: 0 },
    { id: `${ROOT}.Summary.DCPower`, type: 'number', role: 'value.power', unit: 'W', value: 0 },
    { id: `${ROOT}.Summary.Active`, type: 'boolean', role: 'indicator', unit: '', value: false },
    { id: `${ROOT}.Summary.Status`, type: 'string', role: 'text', unit: '', value: 'UNKNOWN' },
    { id: `${ROOT}.Summary.LastUpdate`, type: 'number', role: 'value.time', unit: 'ms', value: 0 },
];

for (const source of SOURCES) {
    const base = `${ROOT}.Sources.${source.name}`;
    DEFINITIONS.push(
        { id: `${base}.Power`, type: 'number', role: 'value.power', unit: 'W', value: 0 },
        { id: `${base}.Status`, type: 'string', role: 'text', unit: '', value: 'UNKNOWN' },
        { id: `${base}.LastUpdate`, type: 'number', role: 'value.time', unit: 'ms', value: 0 },
        { id: `${base}.AgeSeconds`, type: 'number', role: 'value.interval', unit: 's', value: 0 }
    );
}

const snapshots = new Map();
const previousStatuses = new Map();

function createPVState(definition) {
    createState(definition.id, definition.value, {
        name: definition.id.split('.').pop(),
        type: definition.type,
        role: definition.role,
        unit: definition.unit,
        read: true,
        write: false,
    });
}

function writeChanged(id, value) {
    const current = existsState(id) ? getState(id) : null;
    if (!current || current.val !== value) {
        setState(id, value, true);
        return true;
    }
    return false;
}

function evaluate(source, state, now) {
    if (!state) {
        return { name: source.name, group: source.group, power: 0, status: 'UNKNOWN', lastUpdate: 0, ageSeconds: 0 };
    }

    const timestamp = Number(state.ts);
    const hasTimestamp = Number.isFinite(timestamp) && timestamp > 0;
    const ageSeconds = hasTimestamp ? Math.max(0, Math.floor((now - timestamp) / 1000)) : 0;

    if (typeof state.val !== 'number' || !Number.isFinite(state.val) || state.val < 0) {
        return { name: source.name, group: source.group, power: 0, status: 'ERROR', lastUpdate: hasTimestamp ? timestamp : 0, ageSeconds };
    }
    if (!hasTimestamp) {
        return { name: source.name, group: source.group, power: 0, status: 'UNKNOWN', lastUpdate: 0, ageSeconds: 0 };
    }
    if (state.val === 0) {
        return { name: source.name, group: source.group, power: 0, status: 'STANDBY', lastUpdate: timestamp, ageSeconds };
    }

    let status = 'OK';
    if (ageSeconds > CONFIG.offlineAfterSeconds) {
        status = 'OFFLINE';
    } else if (ageSeconds > CONFIG.staleAfterSeconds) {
        status = 'STALE';
    }

    return {
        name: source.name,
        group: source.group,
        power: status === 'OK' ? Math.round(state.val) : 0,
        status,
        lastUpdate: timestamp,
        ageSeconds,
    };
}

function logStatus(name, status) {
    const previous = previousStatuses.get(name);
    previousStatuses.set(name, status);
    if (previous === undefined || previous === status) {
        return;
    }
    const operational = new Set(['OK', 'STANDBY']);
    if (operational.has(previous) && operational.has(status)) {
        return;
    }
    log(`PV_Flow_V1: ${name} Status ${status}.`, operational.has(status) ? 'info' : 'warn');
}

function writeSnapshot(snapshot) {
    const base = `${ROOT}.Sources.${snapshot.name}`;
    writeChanged(`${base}.Power`, snapshot.power);
    writeChanged(`${base}.Status`, snapshot.status);
    writeChanged(`${base}.LastUpdate`, snapshot.lastUpdate);
    writeChanged(`${base}.AgeSeconds`, snapshot.ageSeconds);
    logStatus(snapshot.name, snapshot.status);
}

function summaryStatus(values, totalPower) {
    const statuses = values.map(value => value.status);
    const validCount = statuses.filter(status => status === 'OK' || status === 'STANDBY').length;
    if (validCount === SOURCES.length) {
        return totalPower > 0 ? 'OK' : 'STANDBY';
    }
    if (validCount > 0) {
        return 'DEGRADED';
    }
    for (const status of ['ERROR', 'STALE', 'OFFLINE', 'UNKNOWN']) {
        if (statuses.includes(status)) {
            return status;
        }
    }
    return 'UNKNOWN';
}

function refreshSummary(now) {
    const values = SOURCES.map(source => snapshots.get(source.name)).filter(Boolean);
    const acPower = values.filter(value => value.group === 'AC' && value.status === 'OK').reduce((sum, value) => sum + value.power, 0);
    const dcPower = values.filter(value => value.group === 'DC' && value.status === 'OK').reduce((sum, value) => sum + value.power, 0);
    const totalPower = acPower + dcPower;
    const status = summaryStatus(values, totalPower);
    const changed = [
        writeChanged(`${ROOT}.Summary.TotalPower`, totalPower),
        writeChanged(`${ROOT}.Summary.ACPower`, acPower),
        writeChanged(`${ROOT}.Summary.DCPower`, dcPower),
        writeChanged(`${ROOT}.Summary.Active`, totalPower >= CONFIG.activeThresholdW),
        writeChanged(`${ROOT}.Summary.Status`, status),
    ].some(Boolean);
    if (changed) {
        writeChanged(`${ROOT}.Summary.LastUpdate`, now);
    }
    logStatus('Summary', status);
}

function refreshSource(source, state, now) {
    const snapshot = evaluate(source, state, now);
    snapshots.set(source.name, snapshot);
    writeSnapshot(snapshot);
}

function refreshAll() {
    const now = Date.now();
    for (const source of SOURCES) {
        refreshSource(source, existsState(source.id) ? getState(source.id) : null, now);
    }
    refreshSummary(now);
}

for (const definition of DEFINITIONS) {
    createPVState(definition);
}

for (const source of SOURCES) {
    if (existsState(source.id)) {
        on({ id: source.id, change: 'any' }, event => {
            const now = Date.now();
            refreshSource(source, event && event.state ? event.state : getState(source.id), now);
            refreshSummary(now);
        });
    }
}

setTimeout(refreshAll, 1000);
const ageTimer = setInterval(refreshAll, CONFIG.ageCheckIntervalMs);
if (typeof onStop === 'function') {
    onStop(() => clearInterval(ageTimer), 1000);
}

log(`PV_Flow_V1: Version ${CONFIG.version} read-only gestartet.`, 'info');
