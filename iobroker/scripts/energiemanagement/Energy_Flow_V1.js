// ioBroker object: script.js.energiemanagement.Energy_Flow_V1
// name: Energy_Flow_V1
// engineType: Javascript/js
// enabled: True

'use strict';

const ROOT = '0_userdata.0.EOS.EnergyFlow';
const BATTERY_ROOT = '0_userdata.0.EOS.Battery';
const BILANZ_ROOT = '0_userdata.0.Energiemanagement.Bilanz';
const WALLBOX_ROOT = '0_userdata.0.EOS.Wallbox';

const CONFIG = {
    version: '1.2.2',
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
        id: `${ROOT}.Grid.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Konsolidierte Netzleistung',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Status der Netzsicht',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Grid.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Grid-Bewertung',
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

function readGridSnapshot() {
    const gridPower = readNumber(`${BILANZ_ROOT}.Summe_W`);
    const gridValidState = existsState(`${BILANZ_ROOT}.Gueltig`)
        ? getState(`${BILANZ_ROOT}.Gueltig`)
        : null;
    const gridValid = Boolean(gridValidState && gridValidState.val === true);
    const gridError = normalizeStatus(readString(`${BILANZ_ROOT}.Fehler`));

    let status = 'UNKNOWN';
    if (gridValid) {
        status = 'OK';
    } else if (gridError !== 'UNKNOWN' && gridError !== '') {
        status = 'ERROR';
    } else if (isKnownNumber(gridPower)) {
        status = 'WARNING';
    }

    return {
        power: gridPower,
        status,
        lastUpdate: gridValidState && Number.isFinite(Number(gridValidState.ts))
            ? Number(gridValidState.ts)
            : Date.now(),
        communication: status,
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
    const grid = readGridSnapshot();
    const battery = readBatterySnapshot();
    const wallbox = readWallboxSnapshot();

    updateGroup('Grid', {
        status: grid.status,
        power: grid.power,
        lastUpdate: grid.lastUpdate,
    });

    updateGroup('PV', {
        status: 'UNKNOWN',
        power: null,
        lastUpdate: Date.now(),
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
        grid.communication,
        battery.communication,
        'UNKNOWN',
        'UNKNOWN',
        wallbox.communication,
    ]
        .filter(status => normalizeStatus(status) !== 'OK')
        .length;

    writeChanged(`${ROOT}.Summary.Status`, buildCompositeStatus([grid.status, battery.status, wallbox.status]));
    writeChanged(`${ROOT}.Summary.LastUpdate`, Date.now());
    writeChanged(`${ROOT}.Communication.OverallStatus`, buildCommunicationStatus([grid.communication, battery.communication, wallbox.communication]));
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
        `${BILANZ_ROOT}.Summe_W`,
        `${BILANZ_ROOT}.Gueltig`,
        `${BILANZ_ROOT}.Fehler`,
        `${BATTERY_ROOT}.Summary.Power`,
        `${BATTERY_ROOT}.Summary.SOC`,
        `${BATTERY_ROOT}.Summary.Status`,
        `${BATTERY_ROOT}.Communication.Status`,
        `${BATTERY_ROOT}.Communication.SmartShunt.Status`,
        `${BATTERY_ROOT}.Communication.Gobel.Status`,
        `${BATTERY_ROOT}.Communication.Heltec.Status`,
        `${BATTERY_ROOT}.Communication.MQTT.Status`,
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
