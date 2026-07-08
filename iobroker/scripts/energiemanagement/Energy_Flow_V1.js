// ioBroker object: script.js.energiemanagement.Energy_Flow_V1
// name: Energy_Flow_V1
// engineType: Javascript/js
// enabled: False

'use strict';

const ROOT = '0_userdata.0.EOS.EnergyFlow';
const BATTERY_ROOT = '0_userdata.0.EOS.Battery';
const BILANZ_ROOT = '0_userdata.0.Energiemanagement.Bilanz';
const REFRESH_INTERVAL_MS = 30_000;

const CONFIG = {
    version: '1.0.0',
    logLevel: 'info',
    debugLevel: 0,
    defaults: {
        string: 'UNKNOWN',
        number: 0,
    },
};

const LEVEL_PRIORITY = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const GROUPS = ['Grid', 'PV', 'Battery', 'House', 'Wallbox'];

function ensureEnergyFlowRoots() {
    const rootStates = [
        [
            `${ROOT}.Grid.Status`,
            'Status der Netzsicht',
        ],
        [
            `${BATTERY_ROOT}.Summary.Status`,
            'Gesamtstatus der Batterie',
        ],
    ];

    for (const [id, desc] of rootStates) {
        if (!existsState(id)) {
            createState(
                id,
                CONFIG.defaults.string,
                {
                    name: 'Status',
                    type: 'string',
                    role: 'text',
                    unit: '',
                    desc,
                    read: true,
                    write: false,
                }
            );
        }
    }
}

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
        id: `${ROOT}.Grid.Import`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Konsolidierter Netzbezug',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Grid.Export`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Konsolidierte Netzeinspeisung',
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
        id: `${ROOT}.Wallbox.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Konsolidierte Wallbox-Leistung',
        defaultValue: CONFIG.defaults.number,
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
        id: `${ROOT}.Summary.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Gesamtstatus der Energy-Flow-Sicht',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Summary.PowerBalance`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Konsolidierte Energiebilanz',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Communication.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Gesamtstatus der technischen Aktualitaet',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Communication.LastUpdate`,
        type: 'string',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Energy-Flow-Bewertung',
        defaultValue: '',
    },
    {
        id: `${ROOT}.Communication.AgeSeconds`,
        type: 'number',
        role: 'value',
        unit: 's',
        desc: 'Alter der Energy-Flow-Bewertung in Sekunden',
        defaultValue: CONFIG.defaults.number,
    },
];

for (const group of GROUPS) {
    STATES.push({
        id: `${ROOT}.Communication.${group}`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: `Kommunikationsstatus fuer ${group}`,
        defaultValue: CONFIG.defaults.string,
    });
}

function shouldLog(level) {
    return LEVEL_PRIORITY[level] <= LEVEL_PRIORITY[CONFIG.logLevel] || level === 'debug';
}

function emit(level, message) {
    if (level === 'debug' && CONFIG.debugLevel <= 0) {
        return;
    }
    if (level !== 'debug' && !shouldLog(level)) {
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

function readBatteryNumber(suffix) {
    return readNumber(`${BATTERY_ROOT}.${suffix}`);
}

function readBatteryString(suffix) {
    return readString(`${BATTERY_ROOT}.${suffix}`);
}

function readBilanzNumber(suffix) {
    return readNumber(`${BILANZ_ROOT}.${suffix}`);
}

function readBilanzString(suffix) {
    return readString(`${BILANZ_ROOT}.${suffix}`);
}

function normalizeStatus(value) {
    if (value === null || value === undefined || value === '') {
        return 'UNKNOWN';
    }
    return String(value).toUpperCase();
}

function isKnownNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

function updateGroup(name, payload) {
    const status = payload.status || 'UNKNOWN';
    writeChanged(`${ROOT}.${name}.Status`, status);
    if (Object.prototype.hasOwnProperty.call(payload, 'power')) {
        writeChanged(`${ROOT}.${name}.Power`, isKnownNumber(payload.power) ? payload.power : null);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'import')) {
        writeChanged(`${ROOT}.${name}.Import`, isKnownNumber(payload.import) ? payload.import : null);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'export')) {
        writeChanged(`${ROOT}.${name}.Export`, isKnownNumber(payload.export) ? payload.export : null);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'soc')) {
        writeChanged(`${ROOT}.${name}.SOC`, isKnownNumber(payload.soc) ? payload.soc : null);
    }
}

function updateCommunication(name, status) {
    writeChanged(`${ROOT}.Communication.${name}`, status);
}

function buildCommunicationStatus(statuses) {
    if (statuses.some(status => status === 'OFFLINE')) {
        return 'OFFLINE';
    }
    if (statuses.some(status => status === 'WARN')) {
        return 'WARN';
    }
    if (statuses.some(status => status === 'UNKNOWN')) {
        return 'UNKNOWN';
    }
    if (statuses.every(status => status === 'OK')) {
        return 'OK';
    }
    return 'UNKNOWN';
}

function buildCompositeStatus(statuses) {
    const filtered = statuses
        .map(normalizeStatus)
        .filter(status => status !== 'UNKNOWN');

    if (filtered.length === 0) {
        return 'UNKNOWN';
    }
    if (filtered.some(status => status === 'OFFLINE')) {
        return 'OFFLINE';
    }
    if (filtered.some(status => status === 'WARN')) {
        return 'WARN';
    }
    if (filtered.every(status => status === 'OK')) {
        return 'OK';
    }
    return filtered[0] || 'UNKNOWN';
}

function splitPowerBalance(power) {
    if (!isKnownNumber(power)) {
        return { import: null, export: null };
    }

    if (power >= 0) {
        return { import: power, export: 0 };
    }

    return { import: 0, export: Math.abs(power) };
}

function refresh() {
    const batterySummaryStatus = normalizeStatus(readBatteryString('Summary.Status'));
    const batteryPower = readBatteryNumber('Summary.Power');
    const batterySoc = readBatteryNumber('Summary.SOC');
    const batteryCommunication = normalizeStatus(readBatteryString('Communication.Status'));
    const gridPower = readBilanzNumber('Summe_W');
    const gridValidState = getState(`${BILANZ_ROOT}.Gueltig`);
    const gridValid = Boolean(gridValidState && gridValidState.val === true);
    const gridError = normalizeStatus(readBilanzString('Fehler'));
    const gridSplit = splitPowerBalance(gridPower);
    const gridCommunication = gridValid
        ? 'OK'
        : gridError !== 'UNKNOWN' && gridError !== ''
            ? 'OFFLINE'
            : isKnownNumber(gridPower)
                ? 'WARN'
                : 'UNKNOWN';
    const gridStatus = gridCommunication;

    updateGroup('Battery', {
        status: batterySummaryStatus,
        power: batteryPower,
        soc: batterySoc,
    });

    updateGroup('Grid', {
        status: gridStatus,
        power: gridPower,
        import: gridSplit.import,
        export: gridSplit.export,
    });

    updateGroup('PV', {
        status: 'UNKNOWN',
        power: null,
    });

    updateGroup('House', {
        status: 'UNKNOWN',
        power: null,
    });

    updateGroup('Wallbox', {
        status: 'UNKNOWN',
        power: null,
    });

    const groupStatuses = {
        Grid: gridStatus,
        PV: 'UNKNOWN',
        Battery: batterySummaryStatus,
        House: 'UNKNOWN',
        Wallbox: 'UNKNOWN',
    };

    for (const [group, status] of Object.entries(groupStatuses)) {
        updateCommunication(group, status);
    }

    writeChanged(`${ROOT}.Communication.Grid`, gridCommunication);
    writeChanged(`${ROOT}.Communication.LastUpdate`, new Date().toISOString());
    writeChanged(`${ROOT}.Communication.AgeSeconds`, 0);

    const overallCommunication = buildCommunicationStatus([
        gridCommunication,
        normalizeStatus(readBatteryString('Communication.SmartShunt.Status')),
        normalizeStatus(readBatteryString('Communication.Gobel.Status')),
        normalizeStatus(readBatteryString('Communication.Heltec.Status')),
        normalizeStatus(readBatteryString('Communication.MQTT.Status')),
        batteryCommunication,
    ]);

    const knownPowerValues = [
        isKnownNumber(gridPower) ? gridPower : null,
        isKnownNumber(batteryPower) ? batteryPower : null,
    ].filter(value => value !== null);

    const powerBalance = knownPowerValues.length > 0 ? knownPowerValues.reduce((sum, value) => sum + value, 0) : null;

    writeChanged(`${ROOT}.Summary.Status`, buildCompositeStatus([gridStatus, batterySummaryStatus]));
    writeChanged(`${ROOT}.Summary.PowerBalance`, powerBalance);
    writeChanged(`${ROOT}.Communication.Status`, overallCommunication);
}

try {
    ensureEnergyFlowRoots();
    for (const state of STATES) {
        createEnergyState(state);
    }

    refresh();
    setInterval(refresh, REFRESH_INTERVAL_MS);

    emit('info', `Version ${CONFIG.version} geladen.`);
    emit('info', `Erzeugte States: ${STATES.length}.`);
} catch (error) {
    log(`Energy_Flow_V1 Fehler: ${error.message}`, 'warn');
}
