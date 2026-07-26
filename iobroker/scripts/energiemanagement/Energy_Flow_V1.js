// ioBroker object: script.js.energiemanagement.Energy_Flow_V1
// name: Energy_Flow_V1
// engineType: Javascript/js
// enabled: True

'use strict';

const ROOT = '0_userdata.0.EOS.EnergyFlow';
const BATTERY_ROOT = '0_userdata.0.EOS.Battery';
const GRID_ROOT = '0_userdata.0.EOS.Bilanz';
const CONFIG_ROOT = '0_userdata.0.EOS.Config';
const PV_SOURCE = '0_userdata.0.Victron.SUMME_PV';
const HOUSE_SOURCE = '0_userdata.0.Victron.SUMME_Verbrauch';

const CONFIG = {
    version: '1.5.0',
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
        id: `${ROOT}.Grid.Grid40.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Netzleistung Zaehlpunkt 40',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Grid40.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Status Zaehlpunkt 40',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Grid.Grid40.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Bewertung von Zaehlpunkt 40',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Grid41.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Netzleistung Zaehlpunkt 41',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Grid41.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Status Zaehlpunkt 41',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Grid.Grid41.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Bewertung von Zaehlpunkt 41',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Grid43.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Netzleistung Zaehlpunkt 43',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Grid43.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Status Zaehlpunkt 43',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Grid.Grid43.LastUpdate`,
        type: 'number',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Bewertung von Zaehlpunkt 43',
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

const STATE_DEFINITIONS = new Map(STATES.map(state => [state.id, state]));

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
    if (existsState(definition.id)) {
        return;
    }
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

function ensureEnergyState(id) {
    const definition = STATE_DEFINITIONS.get(id);
    if (definition && !existsState(id)) {
        createEnergyState(definition);
    }
}

function writeChanged(id, value) {
    ensureEnergyState(id);
    const current = getState(id);
    if (!current || current.val !== value) {
        setState(id, value, true);
    }
}

function getStateValue(id) {
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
    if (normalized === 'WARN') {
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
        writeChanged(`${ROOT}.${name}.Active`, isKnownBoolean(payload.active) ? payload.active : false);
    }
    writeChanged(`${ROOT}.${name}.LastUpdate`, Number.isFinite(payload.lastUpdate) ? payload.lastUpdate : Date.now());
}

function readGridMeterSnapshot(name) {
    const sourceId = name === 'Grid40'
        ? readString(`${CONFIG_ROOT}.Zaehlpunkt_Haus_Leistung_ID`)
        : name === 'Grid41'
            ? readString(`${CONFIG_ROOT}.Zaehlpunkt_Halle_Leistung_ID`)
            : readString(`${CONFIG_ROOT}.Zaehlpunkt_Alte_Wohnung_Leistung_ID`);
    const bilanzId = name === 'Grid40' ? `${GRID_ROOT}.Haus_W`
        : name === 'Grid41' ? `${GRID_ROOT}.Halle_W`
            : `${GRID_ROOT}.Alte_Wohnung_W`;
    const power = readNumber(sourceId) ?? readNumber(bilanzId);
    const status = Number.isFinite(power) ? 'OK' : 'UNKNOWN';
    const state = getState(sourceId) || getState(bilanzId);
    const lastUpdate = state && Number.isFinite(Number(state.ts))
        ? Number(state.ts)
        : Date.now();

    return {
        power,
        status,
        lastUpdate,
        communication: status,
    };
}

function readGridSnapshot() {
    const meters = {
        Grid40: readGridMeterSnapshot('Grid40'),
        Grid41: readGridMeterSnapshot('Grid41'),
        Grid43: readGridMeterSnapshot('Grid43'),
    };
    const meterValues = Object.values(meters);
    const status = buildCompositeStatus(meterValues.map(meter => meter.status));
    const lastUpdate = meterValues
        .map(meter => meter.lastUpdate)
        .filter(value => Number.isFinite(value))
        .reduce((max, value) => Math.max(max, value), 0) || Date.now();

    return {
        meters,
        status,
        lastUpdate,
        communication: buildCommunicationStatus(meterValues.map(meter => meter.communication)),
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

    return {
        power,
        soc,
        status: summaryStatus,
        communication: buildCommunicationStatus(batteryCommunicationSources),
        lastUpdate: getState(`${BATTERY_ROOT}.Summary.Power`) && Number.isFinite(Number(getState(`${BATTERY_ROOT}.Summary.Power`).ts))
            ? Number(getState(`${BATTERY_ROOT}.Summary.Power`).ts)
            : Date.now(),
    };
}

function readPowerSnapshot(sourceId, factor = 1) {
    const sourcePower = readNumber(sourceId);
    const state = getState(sourceId);
    const power = Number.isFinite(sourcePower)
        ? Math.round(Math.max(0, sourcePower * factor) * 10) / 10
        : null;

    return {
        power,
        status: Number.isFinite(power) ? 'OK' : 'UNKNOWN',
        communication: Number.isFinite(power) ? 'OK' : 'UNKNOWN',
        lastUpdate: state && Number.isFinite(Number(state.ts))
            ? Number(state.ts)
            : Date.now(),
    };
}

function readWallboxSnapshot() {
    const sourceIds = [
        readString(`${CONFIG_ROOT}.Wallbox1_V3_Leistung_ID`),
        readString(`${CONFIG_ROOT}.Wallbox2_V4_Leistung_ID`),
        readString(`${CONFIG_ROOT}.Wallbox3_Halle_Leistung_ID`),
    ];
    const sources = sourceIds.map(id => readPowerSnapshot(id, 1000));
    const knownPowers = sources
        .map(source => source.power)
        .filter(power => Number.isFinite(power));
    const power = knownPowers.length === sources.length
        ? Math.round(knownPowers.reduce((sum, value) => sum + value, 0) * 10) / 10
        : null;

    return {
        power,
        active: Number.isFinite(power) && power > 100,
        status: Number.isFinite(power) ? 'OK' : 'UNKNOWN',
        communication: buildCommunicationStatus(sources.map(source => source.communication)),
        lastUpdate: sources
            .map(source => source.lastUpdate)
            .reduce((max, value) => Math.max(max, value), 0) || Date.now(),
    };
}

function refresh() {
    const grid = readGridSnapshot();
    const battery = readBatterySnapshot();
    const pv = readPowerSnapshot(PV_SOURCE);
    const house = readPowerSnapshot(HOUSE_SOURCE);
    const wallbox = readWallboxSnapshot();

    updateGroup('Grid', {
        status: grid.status,
        lastUpdate: grid.lastUpdate,
    });

    updateGroup('Grid.Grid40', grid.meters.Grid40);
    updateGroup('Grid.Grid41', grid.meters.Grid41);
    updateGroup('Grid.Grid43', grid.meters.Grid43);

    updateGroup('PV', pv);

    updateGroup('Battery', {
        status: battery.status,
        power: battery.power,
        soc: battery.soc,
        lastUpdate: battery.lastUpdate,
    });

    updateGroup('House', house);
    updateGroup('Wallbox', wallbox);

    const timeoutCount = [
        grid.communication,
        battery.communication,
        pv.communication,
        house.communication,
        wallbox.communication,
    ]
        .filter(status => normalizeStatus(status) !== 'OK')
        .length;

    writeChanged(`${ROOT}.Summary.Status`, buildCompositeStatus([
        grid.status,
        battery.status,
        pv.status,
        house.status,
        wallbox.status,
    ]));
    writeChanged(`${ROOT}.Summary.LastUpdate`, Date.now());
    writeChanged(`${ROOT}.Communication.OverallStatus`, buildCommunicationStatus([
        grid.communication,
        battery.communication,
        pv.communication,
        house.communication,
        wallbox.communication,
    ]));
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
        readString(`${CONFIG_ROOT}.Zaehlpunkt_Haus_Leistung_ID`),
        readString(`${CONFIG_ROOT}.Zaehlpunkt_Halle_Leistung_ID`),
        readString(`${CONFIG_ROOT}.Zaehlpunkt_Alte_Wohnung_Leistung_ID`),
        `${GRID_ROOT}.Haus_W`,
        `${GRID_ROOT}.Halle_W`,
        `${GRID_ROOT}.Alte_Wohnung_W`,
        `${BATTERY_ROOT}.Summary.Power`,
        `${BATTERY_ROOT}.Summary.SOC`,
        `${BATTERY_ROOT}.Summary.Status`,
        `${BATTERY_ROOT}.Communication.Status`,
        `${BATTERY_ROOT}.Communication.SmartShunt.Status`,
        `${BATTERY_ROOT}.Communication.Gobel.Status`,
        `${BATTERY_ROOT}.Communication.Heltec.Status`,
        `${BATTERY_ROOT}.Communication.MQTT.Status`,
        PV_SOURCE,
        HOUSE_SOURCE,
        readString(`${CONFIG_ROOT}.Wallbox1_V3_Leistung_ID`),
        readString(`${CONFIG_ROOT}.Wallbox2_V4_Leistung_ID`),
        readString(`${CONFIG_ROOT}.Wallbox3_Halle_Leistung_ID`),
    ];

    for (const id of sourceIds) {
        if (id && existsState(id)) {
            on({ id, change: 'ne' }, scheduleRefresh);
        }
    }
}

try {
    for (const state of STATES) {
        createEnergyState(state);
    }

    subscribeToSources();
    scheduleRefresh();

    emit('info', `Version ${CONFIG.version} geladen.`);
    emit('info', `Erzeugte States: ${STATES.length}.`);
    emit('info', 'Energy Flow V1 ist read-only und ereignisgetrieben aktiv.');
} catch (error) {
    log(`Energy_Flow_V1 Fehler: ${error.message}`, 'warn');
}
