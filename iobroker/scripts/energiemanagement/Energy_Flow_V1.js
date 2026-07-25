// ioBroker object: script.js.energiemanagement.Energy_Flow_V1
// name: Energy_Flow_V1
// engineType: Javascript/js
// enabled: True

'use strict';

const ROOT = '0_userdata.0.EOS.EnergyFlow';
const BATTERY_ROOT = '0_userdata.0.EOS.Battery';
const GRID_ROOT = '0_userdata.0.EOS.Grid';
const WALLBOX_ROOT = '0_userdata.0.EOS.Wallbox';
const PV_ROOT = '0_userdata.0.EOS.PV';

const CONFIG = {
    version: '1.4.0',
    logLevel: 'info',
    debugEnabled: false,
    refreshDebounceMs: 50,
    defaults: {
        string: 'UNKNOWN',
        number: 0,
        boolean: false,
        text: '',
    },
};

const LEVEL_PRIORITY = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const STATES = [
    {
        id: `${ROOT}.Grid.Grid40.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Netzleistung Grid40',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Grid40.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Status der Netzsicht Grid40',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Grid.Grid40.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Bewertung Grid40',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Grid41.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Netzleistung Grid41',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Grid41.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Status der Netzsicht Grid41',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Grid.Grid41.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Bewertung Grid41',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Grid43.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Netzleistung Grid43',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Grid43.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Status der Netzsicht Grid43',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Grid.Grid43.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Bewertung Grid43',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.PV.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Konsolidierte PV-Leistung',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.PV.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Status der PV-Sicht',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.PV.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten PV-Bewertung',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Battery.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Batterieleistung aus der EOS-Batteriesicht',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Battery.SOC`,
        type: 'number',
        role: 'value',
        unit: '%',
        desc: 'Batterie-SOC aus der EOS-Batteriesicht',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Battery.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Status der Batteriesicht',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Battery.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Battery-Bewertung',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.House.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Konsolidierte Hauslast',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.House.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Status der Haussicht',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.House.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten House-Bewertung',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Wallbox.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Konsolidierte Wallbox-Leistung',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Wallbox.Active`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'Aktivitaetsstatus der Wallbox-Sicht',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Wallbox.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Status der Wallbox-Sicht',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Wallbox.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Wallbox-Bewertung',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Summary.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Gesamtstatus der Energy-Flow-Sicht',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Summary.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Gesamtbewertung',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Communication.OverallStatus`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Gesamtstatus der technischen Aktualitaet',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Communication.TimeoutCount`,
        type: 'number',
        role: 'value',
        unit: '',
        desc: 'Anzahl der aktuell ungueltigen oder fehlenden Teilbereiche',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Communication.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Energy-Flow-Kommunikationsbewertung',
        defaultValue: CONFIG.defaults.number,
    },
];

function shouldLog(level) {
    return LEVEL_PRIORITY[level] <= LEVEL_PRIORITY[CONFIG.logLevel] || (level === 'debug' && CONFIG.debugEnabled);
}

function emit(level, message) {
    if (!shouldLog(level)) {
        return;
    }
    log(`Energy_Flow_V1: ${message}`, level);
}

function createEnergyState(definition) {
    createState(
        definition.id,
        definition.defaultValue,
        {
            name: definition.id.split('.').pop(),
            type: definition.type,
            role: definition.role,
            unit: definition.unit,
            desc: definition.desc,
            read: true,
            write: false,
        }
    );
}

function writeChanged(id, value) {
    const current = getState(id);
    if (!current || current.val !== value) {
        setState(id, value, true);
    }
}

function getStateValue(id) {
    if (!existsState(id)) {
        return null;
    }
    const state = getState(id);
    return state && state.val !== undefined ? state.val : null;
}

function readNumber(id) {
    const value = getStateValue(id);
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function readString(id) {
    const value = getStateValue(id);
    if (value === null || value === undefined) {
        return null;
    }
    return String(value);
}

function readBoolean(id) {
    const value = getStateValue(id);
    if (value === null || value === undefined || value === '') {
        return null;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        return value !== 0;
    }
    const normalized = String(value).trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'on') {
        return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'off') {
        return false;
    }
    return null;
}

function normalizeStatus(value) {
    if (value === null || value === undefined || value === '') {
        return 'UNKNOWN';
    }
    const normalized = String(value).trim().toUpperCase();
    if (normalized === 'INITIALIZING' || normalized === 'OK' || normalized === 'WARNING' || normalized === 'ERROR' || normalized === 'INVALID') {
        return normalized;
    }
    if (normalized === 'WARN' || normalized === 'DEGRADED' || normalized === 'STALE') {
        return 'WARNING';
    }
    if (normalized === 'OFFLINE') {
        return 'ERROR';
    }
    return normalized;
}

function isKnownNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

function isKnownBoolean(value) {
    return typeof value === 'boolean';
}

function buildCompositeStatus(statuses) {
    const filtered = statuses
        .map(normalizeStatus)
        .filter(status => status !== 'UNKNOWN');

    if (filtered.length === 0) {
        return 'UNKNOWN';
    }
    if (filtered.some(status => status === 'ERROR')) {
        return 'ERROR';
    }
    if (filtered.some(status => status === 'WARNING')) {
        return 'WARNING';
    }
    if (filtered.every(status => status === 'OK')) {
        return 'OK';
    }
    return filtered[0] || 'UNKNOWN';
}

function isCommunicationOK(status) {
    const normalized = normalizeStatus(status);
    return normalized === 'OK' || normalized === 'STANDBY';
}

function buildCommunicationStatus(statuses) {
    const normalized = statuses.map(normalizeStatus);
    if (normalized.some(status => status === 'ERROR')) {
        return 'ERROR';
    }
    if (normalized.some(status => status === 'WARNING')) {
        return 'WARNING';
    }
    if (normalized.some(status => status === 'UNKNOWN')) {
        return 'UNKNOWN';
    }
    return 'OK';
}

function updateGroup(name, payload) {
    writeChanged(`${ROOT}.${name}.Status`, payload.status || 'UNKNOWN');
    if (Object.prototype.hasOwnProperty.call(payload, 'power')) {
        writeChanged(`${ROOT}.${name}.Power`, isKnownNumber(payload.power) ? payload.power : null);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'soc')) {
        writeChanged(`${ROOT}.${name}.SOC`, isKnownNumber(payload.soc) ? payload.soc : null);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'active')) {
        writeChanged(`${ROOT}.${name}.Active`, isKnownBoolean(payload.active) ? payload.active : null);
    }
    writeChanged(`${ROOT}.${name}.LastUpdate`, Number.isFinite(payload.lastUpdate) ? payload.lastUpdate : Date.now());
}

function readGridSnapshot(name) {
    const power = readNumber(`${GRID_ROOT}.Sources.${name}.Power`);
    const status = normalizeStatus(readString(`${GRID_ROOT}.Sources.${name}.Status`));
    const lastUpdate = readNumber(`${GRID_ROOT}.Sources.${name}.LastUpdate`);

    return {
        power: isKnownNumber(power) ? power : 0,
        status,
        communication: status,
        lastUpdate: isKnownNumber(lastUpdate) ? lastUpdate : Date.now(),
    };
}

function readBatterySnapshot() {
    const power = readNumber(`${BATTERY_ROOT}.Summary.Power`);
    const soc = readNumber(`${BATTERY_ROOT}.Summary.SOC`);
    const summaryStatus = normalizeStatus(readString(`${BATTERY_ROOT}.Summary.Status`));
    const communicationStatus = normalizeStatus(readString(`${BATTERY_ROOT}.Communication.Status`));
    const batteryCommunicationSources = [
        normalizeStatus(readString(`${BATTERY_ROOT}.Communication.SmartShunt.Status`)),
        normalizeStatus(readString(`${BATTERY_ROOT}.Communication.Gobel.Status`)),
        normalizeStatus(readString(`${BATTERY_ROOT}.Communication.Heltec.Status`)),
        normalizeStatus(readString(`${BATTERY_ROOT}.Communication.MQTT.Status`)),
        communicationStatus,
    ];

    const powerState = existsState(`${BATTERY_ROOT}.Summary.Power`)
        ? getState(`${BATTERY_ROOT}.Summary.Power`)
        : null;

    return {
        power,
        soc,
        status: summaryStatus,
        communication: buildCommunicationStatus(batteryCommunicationSources),
        lastUpdate: powerState && Number.isFinite(Number(powerState.ts))
            ? Number(powerState.ts)
            : Date.now(),
    };
}

function readPVSnapshot() {
    const power = readNumber(`${PV_ROOT}.Summary.TotalPower`);
    const status = normalizeStatus(readString(`${PV_ROOT}.Summary.Status`));
    const lastUpdate = readNumber(`${PV_ROOT}.Summary.LastUpdate`);

    return {
        power,
        status,
        communication: status,
        lastUpdate: isKnownNumber(lastUpdate) ? lastUpdate : Date.now(),
    };
}

function readWallboxSnapshot() {
    const power = readNumber(`${WALLBOX_ROOT}.Summary.Power`);
    const active = readBoolean(`${WALLBOX_ROOT}.Summary.Active`);
    const status = normalizeStatus(readString(`${WALLBOX_ROOT}.Summary.Status`));
    const lastUpdate = readNumber(`${WALLBOX_ROOT}.Summary.LastUpdate`);

    return {
        power,
        active,
        status,
        communication: status,
        lastUpdate: isKnownNumber(lastUpdate) ? lastUpdate : Date.now(),
    };
}

function refresh() {
    const grid40 = readGridSnapshot('Grid40');
    const grid41 = readGridSnapshot('Grid41');
    const grid43 = readGridSnapshot('Grid43');
    const battery = readBatterySnapshot();
    const pv = readPVSnapshot();
    const wallbox = readWallboxSnapshot();

    updateGroup('Grid.Grid40', {
        status: grid40.status,
        power: grid40.power,
        lastUpdate: grid40.lastUpdate,
    });

    updateGroup('Grid.Grid41', {
        status: grid41.status,
        power: grid41.power,
        lastUpdate: grid41.lastUpdate,
    });

    updateGroup('Grid.Grid43', {
        status: grid43.status,
        power: grid43.power,
        lastUpdate: grid43.lastUpdate,
    });

    updateGroup('PV', {
        status: pv.status,
        power: pv.power,
        lastUpdate: pv.lastUpdate,
    });

    updateGroup('Battery', {
        status: battery.status,
        power: battery.power,
        soc: battery.soc,
        lastUpdate: battery.lastUpdate,
    });

    updateGroup('House', {
        status: 'UNKNOWN',
        power: null,
        lastUpdate: Date.now(),
    });

    updateGroup('Wallbox', {
        status: wallbox.status,
        power: wallbox.power,
        active: wallbox.active,
        lastUpdate: wallbox.lastUpdate,
    });

    const timeoutCount = [
        grid40.communication,
        grid41.communication,
        grid43.communication,
        battery.communication,
        pv.communication,
        'UNKNOWN',
        wallbox.communication,
    ]
        .filter(status => !isCommunicationOK(status))
        .length;

    writeChanged(`${ROOT}.Summary.Status`, buildCompositeStatus([grid40.status, grid41.status, grid43.status, pv.status, battery.status, wallbox.status]));
    writeChanged(`${ROOT}.Summary.LastUpdate`, Date.now());
    writeChanged(`${ROOT}.Communication.OverallStatus`, buildCommunicationStatus([grid40.communication, grid41.communication, grid43.communication, pv.communication, battery.communication, wallbox.communication]));
    writeChanged(`${ROOT}.Communication.TimeoutCount`, timeoutCount);
    writeChanged(`${ROOT}.Communication.LastUpdate`, Date.now());
}

let refreshTimer = null;

function scheduleRefresh() {
    if (refreshTimer !== null) {
        return;
    }
    refreshTimer = setTimeout(() => {
        refreshTimer = null;
        refresh();
    }, CONFIG.refreshDebounceMs);
}

function subscribeToSources() {
    const sourceIds = [
        `${GRID_ROOT}.Sources.Grid40.Power`,
        `${GRID_ROOT}.Sources.Grid40.Status`,
        `${GRID_ROOT}.Sources.Grid40.LastUpdate`,
        `${GRID_ROOT}.Sources.Grid41.Power`,
        `${GRID_ROOT}.Sources.Grid41.Status`,
        `${GRID_ROOT}.Sources.Grid41.LastUpdate`,
        `${GRID_ROOT}.Sources.Grid43.Power`,
        `${GRID_ROOT}.Sources.Grid43.Status`,
        `${GRID_ROOT}.Sources.Grid43.LastUpdate`,
        `${BATTERY_ROOT}.Summary.Power`,
        `${BATTERY_ROOT}.Summary.SOC`,
        `${BATTERY_ROOT}.Summary.Status`,
        `${BATTERY_ROOT}.Communication.Status`,
        `${BATTERY_ROOT}.Communication.SmartShunt.Status`,
        `${BATTERY_ROOT}.Communication.Gobel.Status`,
        `${BATTERY_ROOT}.Communication.Heltec.Status`,
        `${BATTERY_ROOT}.Communication.MQTT.Status`,
        `${PV_ROOT}.Summary.TotalPower`,
        `${PV_ROOT}.Summary.Status`,
        `${PV_ROOT}.Summary.LastUpdate`,
        `${WALLBOX_ROOT}.Summary.Power`,
        `${WALLBOX_ROOT}.Summary.Active`,
        `${WALLBOX_ROOT}.Summary.Status`,
        `${WALLBOX_ROOT}.Summary.LastUpdate`,
    ];

    for (const id of sourceIds) {
        if (existsState(id)) {
            on({ id, change: 'ne' }, scheduleRefresh);
        }
    }
}

try {
    for (const state of STATES) {
        createEnergyState(state);
    }

    subscribeToSources();
    setTimeout(scheduleRefresh, 1000);

    emit('info', `Version ${CONFIG.version} geladen.`);
    emit('info', `Erzeugte States: ${STATES.length}.`);
    emit('info', 'Energy Flow V1 ist read-only und ereignisgetrieben aktiv.');
} catch (error) {
    log(`Energy_Flow_V1 Fehler: ${error.message}`, 'warn');
}
