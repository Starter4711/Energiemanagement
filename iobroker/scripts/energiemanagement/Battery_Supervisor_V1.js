// ioBroker object: script.js.energiemanagement.Battery_Supervisor_V1
// name: Battery_Supervisor_V1
// engineType: Javascript/js
// enabled: True

'use strict';

const ROOT = '0_userdata.0.EOS.Battery';

const CONFIG = {
    version: '1.0.1',
    logLevel: 'info',
    debugLevel: 0,
    communicationWarningTimeoutSeconds: 120,
    communicationOfflineTimeoutSeconds: 300,
    defaults: {
        string: 'unknown',
        number: 0,
        boolean: false,
    },
};

const LEVEL_PRIORITY = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const PACKS = [1, 2, 3, 4];
const HELTEC_MAX_CELLS = 16;
const COMMUNICATION_REFRESH_INTERVAL_MS = 30_000;

function ensureBatteryRootState() {
    const id = `${ROOT}.Summary.Status`;
    if (!existsState(id)) {
        createState(
            id,
            CONFIG.defaults.string,
            {
                name: 'Status',
                type: 'string',
                role: 'text',
                unit: '',
                desc: 'Gesamtstatus der Batterie',
                read: true,
                write: false,
            }
        );
    }
}

const STATES = [
    {
        id: `${ROOT}.Summary.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Gesamtstatus der Batterie',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Summary.SOC`,
        type: 'number',
        role: 'value',
        unit: '%',
        desc: 'Aufbereiteter Gesamt-SOC fuer VIS2',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Summary.Voltage`,
        type: 'number',
        role: 'value.voltage',
        unit: 'V',
        desc: 'Gesamt-Batteriespannung',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Summary.Current`,
        type: 'number',
        role: 'value.current',
        unit: 'A',
        desc: 'Gesamt-Batteriestrom',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Summary.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Berechnete Batterieleistung',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.SmartShunt.SOC`,
        type: 'number',
        role: 'value',
        unit: '%',
        desc: 'Fuehrender Gesamt-SOC',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.SmartShunt.Voltage`,
        type: 'number',
        role: 'value.voltage',
        unit: 'V',
        desc: 'Gesamtspannung der Batterie',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.SmartShunt.Current`,
        type: 'number',
        role: 'value.current',
        unit: 'A',
        desc: 'Batteriestrom',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.SmartShunt.Power`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Berechnete Leistung aus Strom und Spannung',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.SmartShunt.ConsumedAh`,
        type: 'number',
        role: 'value',
        unit: 'Ah',
        desc: 'Entnommene oder gespeicherte Kapazitaet in Ah',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.SmartShunt.DischargedEnergy`,
        type: 'number',
        role: 'value.energy',
        unit: 'Wh',
        desc: 'Bisher entladene Energie',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.SmartShunt.ChargedEnergy`,
        type: 'number',
        role: 'value.energy',
        unit: 'Wh',
        desc: 'Bisher geladene Energie',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.SmartShunt.TimeToGo`,
        type: 'number',
        role: 'value',
        unit: 'min',
        desc: 'Verbleibende Zeit bis zur Entladung',
        defaultValue: CONFIG.defaults.number,
    },
];

for (let pack = 1; pack <= 4; pack += 1) {
    STATES.push(
        {
            id: `${ROOT}.Packs.Pack${pack}.Status`,
            type: 'string',
            role: 'text',
            unit: '',
            desc: `Packstatus von Pack ${pack}`,
            defaultValue: CONFIG.defaults.string,
        },
        {
            id: `${ROOT}.Packs.Pack${pack}.Voltage`,
            type: 'number',
            role: 'value.voltage',
            unit: 'V',
            desc: `Packspannung von Pack ${pack}`,
            defaultValue: CONFIG.defaults.number,
        },
        {
            id: `${ROOT}.Packs.Pack${pack}.Current`,
            type: 'number',
            role: 'value.current',
            unit: 'A',
            desc: `Packstrom von Pack ${pack}`,
            defaultValue: CONFIG.defaults.number,
        },
        {
            id: `${ROOT}.Packs.Pack${pack}.Power`,
            type: 'number',
            role: 'value.power',
            unit: 'W',
            desc: `Berechnete Packleistung von Pack ${pack}`,
            defaultValue: CONFIG.defaults.number,
        },
        {
            id: `${ROOT}.Packs.Pack${pack}.TemperatureMax`,
            type: 'number',
            role: 'value.temperature',
            unit: '°C',
            desc: `Maximale Temperatur innerhalb von Pack ${pack}`,
            defaultValue: CONFIG.defaults.number,
        },
        {
            id: `${ROOT}.Packs.Pack${pack}.VDiff`,
            type: 'number',
            role: 'value',
            unit: 'mV',
            desc: `Spannungsdifferenz innerhalb von Pack ${pack}`,
            defaultValue: CONFIG.defaults.number,
        },
        {
            id: `${ROOT}.Packs.Pack${pack}.Balancing`,
            type: 'boolean',
            role: 'indicator',
            unit: '',
            desc: `Balancing-Status von Pack ${pack}`,
            defaultValue: CONFIG.defaults.boolean,
        },
        {
            id: `${ROOT}.Packs.Pack${pack}.Communication`,
            type: 'string',
            role: 'text',
            unit: '',
            desc: `Kommunikationsstatus von Pack ${pack}`,
            defaultValue: CONFIG.defaults.string,
        }
    );
}

STATES.push(
    {
        id: `${ROOT}.Communication.SmartShunt`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Kommunikationsstatus des SmartShunt',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Communication.SmartShunt.LastUpdate`,
        type: 'string',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten SmartShunt-Kommunikation',
        defaultValue: '',
    },
    {
        id: `${ROOT}.Communication.SmartShunt.AgeSeconds`,
        type: 'number',
        role: 'value',
        unit: 's',
        desc: 'Alter der SmartShunt-Kommunikation in Sekunden',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Communication.SmartShunt.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Bewerteter Kommunikationsstatus des SmartShunt',
        defaultValue: 'UNKNOWN',
    },
    {
        id: `${ROOT}.Communication.Gobel`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Kommunikationsstatus von Gobel / Pace BMS',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Communication.Gobel.LastUpdate`,
        type: 'string',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Gobel / Pace BMS-Kommunikation',
        defaultValue: '',
    },
    {
        id: `${ROOT}.Communication.Gobel.AgeSeconds`,
        type: 'number',
        role: 'value',
        unit: 's',
        desc: 'Alter der Gobel / Pace BMS-Kommunikation in Sekunden',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Communication.Gobel.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Bewerteter Kommunikationsstatus von Gobel / Pace BMS',
        defaultValue: 'UNKNOWN',
    },
    {
        id: `${ROOT}.Communication.Heltec`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Kommunikationsstatus von Heltec',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Communication.Heltec.LastUpdate`,
        type: 'string',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Heltec-Kommunikation',
        defaultValue: '',
    },
    {
        id: `${ROOT}.Communication.Heltec.AgeSeconds`,
        type: 'number',
        role: 'value',
        unit: 's',
        desc: 'Alter der Heltec-Kommunikation in Sekunden',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Communication.Heltec.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Bewerteter Kommunikationsstatus von Heltec',
        defaultValue: 'UNKNOWN',
    },
    {
        id: `${ROOT}.Communication.MQTT`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Kommunikationsstatus der relevanten MQTT-Strecke',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Communication.MQTT.LastUpdate`,
        type: 'string',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten MQTT-Kommunikation',
        defaultValue: '',
    },
    {
        id: `${ROOT}.Communication.MQTT.AgeSeconds`,
        type: 'number',
        role: 'value',
        unit: 's',
        desc: 'Alter der MQTT-Kommunikation in Sekunden',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Communication.MQTT.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Bewerteter Kommunikationsstatus der MQTT-Strecke',
        defaultValue: 'UNKNOWN',
    },
    {
        id: `${ROOT}.Communication.LastUpdate`,
        type: 'string',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten erfolgreichen Kommunikationsbewertung',
        defaultValue: '',
    }
);

STATES.push(
    {
        id: `${ROOT}.Warnings.SmartShuntOffline`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'SmartShunt ist nicht oder nicht ausreichend erreichbar',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Warnings.GobelOffline`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'Gobel / Pace BMS ist nicht oder nicht ausreichend erreichbar',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Warnings.HeltecOffline`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'Heltec ist nicht oder nicht ausreichend erreichbar',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Warnings.MQTTOffline`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'Relevante MQTT-Kommunikation ist gestoert',
        defaultValue: CONFIG.defaults.boolean,
    }
);

STATES.push(
    {
        id: `${ROOT}.Settings.CommunicationWarningTimeout_s`,
        type: 'number',
        role: 'value',
        unit: 's',
        desc: 'Timeout in Sekunden bis zur Warnstufe der Kommunikationsueberwachung',
        defaultValue: CONFIG.communicationWarningTimeoutSeconds,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.CommunicationOfflineTimeout_s`,
        type: 'number',
        role: 'value',
        unit: 's',
        desc: 'Timeout in Sekunden bis zur Offline-Stufe der Kommunikationsueberwachung',
        defaultValue: CONFIG.communicationOfflineTimeoutSeconds,
        writable: true,
    }
);

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
    log(`Battery_Supervisor_V1: ${message}`, level);
}

function createBatteryState(definition) {
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
            write: definition.writable === true,
        }
    );
}

function getRawState(id) {
    const state = getState(id);
    return state && state.val !== undefined ? state : null;
}

function readNumber(id) {
    const state = getRawState(id);
    if (!state) return null;
    const value = Number(state.val);
    return Number.isFinite(value) ? value : null;
}

function readString(id) {
    const state = getRawState(id);
    if (!state) return null;
    if (typeof state.val === 'string') return state.val;
    return String(state.val);
}

function writeChanged(id, value) {
    const current = getState(id);
    if (!current || current.val !== value) {
        setState(id, value, true);
    }
}

function formatIsoFromTimestamp(timestamp) {
    if (!Number.isFinite(timestamp)) return '';
    return new Date(timestamp).toISOString();
}

function readLatestTimestamp(ids) {
    let latest = null;

    for (const id of ids) {
        const state = getRawState(id);
        if (!state) continue;
        const timestamp = Number(state.ts);
        if (!Number.isFinite(timestamp)) continue;
        if (latest === null || timestamp > latest) {
            latest = timestamp;
        }
    }

    return latest;
}

function getCommunicationStatus(ageSeconds) {
    if (!Number.isFinite(ageSeconds)) {
        return 'UNKNOWN';
    }
    const warningTimeout =
        readNumber(`${ROOT}.Settings.CommunicationWarningTimeout_s`) ??
        CONFIG.communicationWarningTimeoutSeconds;
    const offlineTimeout =
        readNumber(`${ROOT}.Settings.CommunicationOfflineTimeout_s`) ??
        CONFIG.communicationOfflineTimeoutSeconds;

    if (ageSeconds <= warningTimeout) {
        return 'OK';
    }
    if (ageSeconds <= offlineTimeout) {
        return 'WARN';
    }
    return 'OFFLINE';
}

function updateCommunicationSource(prefix, sourceIds) {
    const latestTimestamp = readLatestTimestamp(sourceIds);
    const lastUpdate = formatIsoFromTimestamp(latestTimestamp);
    const ageSeconds = latestTimestamp === null
        ? null
        : Math.max(0, Math.floor((Date.now() - latestTimestamp) / 1000));
    let status = getCommunicationStatus(ageSeconds);

    if (prefix === 'MQTT') {
        const connectionState =
            getRawState('mqtt.0.info.connection') ||
            getRawState('mqtt.0.info.connection.state');
        if (connectionState && connectionState.val === false) {
            status = 'OFFLINE';
        }
    }

    writeChanged(`${ROOT}.Communication.${prefix}.LastUpdate`, lastUpdate);
    writeChanged(`${ROOT}.Communication.${prefix}.AgeSeconds`, ageSeconds === null ? CONFIG.defaults.number : ageSeconds);
    writeChanged(`${ROOT}.Communication.${prefix}.Status`, status);
    writeChanged(`${ROOT}.Communication.${prefix}`, status);

    return {
        lastUpdate,
        ageSeconds,
        status,
    };
}

function readSmartShunt() {
    const soc = readNumber('alias.0.Gobel.Soc SmartShunt');
    const voltage = readNumber('alias.0.Gobel.Voltage_SmartShunt');
    const current = readNumber('alias.0.Gobel.Current');
    const power = readNumber('alias.0.Gobel.Power');
    const consumedAh = readNumber('alias.0.Gobel.ConsumedAh');
    const dischargedEnergy = readNumber('alias.0.Gobel.DischargedEnergy');
    const chargedEnergy = readNumber('alias.0.Gobel.ChargedEnergy');
    const timeToGo = readNumber('alias.0.Gobel.TimeToGo');

    return {
        soc,
        voltage,
        current,
        power,
        consumedAh,
        dischargedEnergy,
        chargedEnergy,
        timeToGo,
    };
}

function readHeltecPack(pack) {
    const state = getRawState(`mqtt.0.HELTEC_${pack}.data`);
    if (!state || typeof state.val !== 'string') return null;

    try {
        const payload = JSON.parse(state.val);
        if (!payload || !Array.isArray(payload.cells) || payload.cells.length === 0) return null;

        const cells = [];
        for (const item of payload.cells) {
            const cell = Number(item && item.cell);
            const voltage = Number(item && item.voltage);
            if (Number.isFinite(cell) && cell >= 1 && cell <= HELTEC_MAX_CELLS && Number.isFinite(voltage)) {
                cells.push({ cell, voltage });
            }
        }

        if (cells.length === 0) return null;
        const voltages = cells.map(entry => entry.voltage);
        const minVoltage = Math.min(...voltages);
        const maxVoltage = Math.max(...voltages);
        const voltageSum = voltages.reduce((sum, value) => sum + value, 0);

        return {
            cells,
            minVoltage,
            maxVoltage,
            voltageSum,
            vDiff: Math.round((maxVoltage - minVoltage) * 1000),
        };
    } catch (error) {
        return null;
    }
}

function readPackCurrent(pack) {
    return readNumber(`alias.0.Gobel_${pack === 1 ? 'Master' : `Slave${pack - 1}`}.Ampere`);
}

function readPackTemperature(pack) {
    return readNumber(`alias.0.Gobel_${pack === 1 ? 'Master' : `Slave${pack - 1}`}.Gobel_${pack === 1 ? 'Master' : `Slave${pack - 1}`}_Tmp`);
}

function evaluatePackStatus(heltec, packCurrent, packTemperature) {
    if (!heltec && packCurrent === null && packTemperature === null) {
        return 'UNKNOWN';
    }
    return 'OK';
}

function updateBatterySupervisor() {
    const smartShunt = readSmartShunt();
    const healthStatus = readString(`${ROOT}.Health.Status`) || CONFIG.defaults.string;

    if (smartShunt.soc !== null) {
        writeChanged(`${ROOT}.Summary.SOC`, smartShunt.soc);
        writeChanged(`${ROOT}.SmartShunt.SOC`, smartShunt.soc);
    }
    if (smartShunt.voltage !== null) {
        writeChanged(`${ROOT}.Summary.Voltage`, smartShunt.voltage);
        writeChanged(`${ROOT}.SmartShunt.Voltage`, smartShunt.voltage);
    }
    if (smartShunt.current !== null) {
        writeChanged(`${ROOT}.Summary.Current`, smartShunt.current);
        writeChanged(`${ROOT}.SmartShunt.Current`, smartShunt.current);
    }
    if (smartShunt.power !== null) {
        writeChanged(`${ROOT}.Summary.Power`, smartShunt.power);
        writeChanged(`${ROOT}.SmartShunt.Power`, smartShunt.power);
    }
    if (smartShunt.consumedAh !== null) {
        writeChanged(`${ROOT}.SmartShunt.ConsumedAh`, smartShunt.consumedAh);
    }
    if (smartShunt.dischargedEnergy !== null) {
        writeChanged(`${ROOT}.SmartShunt.DischargedEnergy`, smartShunt.dischargedEnergy);
    }
    if (smartShunt.chargedEnergy !== null) {
        writeChanged(`${ROOT}.SmartShunt.ChargedEnergy`, smartShunt.chargedEnergy);
    }
    if (smartShunt.timeToGo !== null) {
        writeChanged(`${ROOT}.SmartShunt.TimeToGo`, smartShunt.timeToGo);
    }

    writeChanged(`${ROOT}.Summary.Status`, healthStatus);

    const communicationResults = [
        updateCommunicationSource('SmartShunt', [
            'alias.0.Gobel.Soc SmartShunt',
            'alias.0.Gobel.Voltage_SmartShunt',
            'alias.0.Gobel.Current',
            'alias.0.Gobel.Power',
            'alias.0.Gobel.ConsumedAh',
            'alias.0.Gobel.DischargedEnergy',
            'alias.0.Gobel.ChargedEnergy',
            'alias.0.Gobel.TimeToGo',
        ]),
        updateCommunicationSource('Gobel', [
            'alias.0.Gobel_Master.SOC',
            'alias.0.Gobel_Slave1.SOC',
            'alias.0.Gobel_Slave2.SOC',
            'alias.0.Gobel_Slave3.SOC',
            'alias.0.Gobel_Master.Ampere',
            'alias.0.Gobel_Slave1.Ampere',
            'alias.0.Gobel_Slave2.Ampere',
            'alias.0.Gobel_Slave3.Ampere',
            'alias.0.Gobel_Master.Gobel_Master_Tmp',
            'alias.0.Gobel_Slave1.Gobel_Slave1_Tmp',
            'alias.0.Gobel_Slave2.Gobel_Slave2_Tmp',
            'alias.0.Gobel_Slave3.Gobel_Slave3_Tmp',
        ]),
        updateCommunicationSource('Heltec', [
            'mqtt.0.HELTEC_1.data',
            'mqtt.0.HELTEC_2.data',
            'mqtt.0.HELTEC_3.data',
            'mqtt.0.HELTEC_4.data',
        ]),
        updateCommunicationSource('MQTT', [
            'mqtt.0.info.connection',
            'mqtt.0.info.connection.state',
        ]),
    ];

    const latestCommunicationTimestamp = communicationResults
        .map(result => result.lastUpdate)
        .filter(Boolean)
        .reduce((latest, value) => {
            const timestamp = Date.parse(value);
            if (!Number.isFinite(timestamp)) return latest;
            return latest === null || timestamp > latest ? timestamp : latest;
        }, null);

    writeChanged(`${ROOT}.Communication.LastUpdate`, formatIsoFromTimestamp(latestCommunicationTimestamp));
    writeChanged(`${ROOT}.Warnings.SmartShuntOffline`, communicationResults[0].status === 'OFFLINE');
    writeChanged(`${ROOT}.Warnings.GobelOffline`, communicationResults[1].status === 'OFFLINE');
    writeChanged(`${ROOT}.Warnings.HeltecOffline`, communicationResults[2].status === 'OFFLINE');
    writeChanged(`${ROOT}.Warnings.MQTTOffline`, communicationResults[3].status === 'OFFLINE');

    for (const pack of PACKS) {
        const heltec = readHeltecPack(pack);
        const packCurrent = readPackCurrent(pack);
        const packTemperature = readPackTemperature(pack);
        const packBase = `${ROOT}.Packs.Pack${pack}`;
        const packStatus = evaluatePackStatus(heltec, packCurrent, packTemperature);

        if (heltec) {
            writeChanged(`${packBase}.Voltage`, Math.round(heltec.voltageSum * 1000) / 1000);
            writeChanged(`${packBase}.VDiff`, heltec.vDiff);
        }
        if (packCurrent !== null) {
            writeChanged(`${packBase}.Current`, packCurrent);
        }
        if (packTemperature !== null) {
            writeChanged(`${packBase}.TemperatureMax`, packTemperature);
        }
        writeChanged(`${packBase}.Status`, packStatus);
        writeChanged(`${packBase}.Power`, heltec && packCurrent !== null
            ? Math.round((heltec.voltageSum * packCurrent) * 10) / 10
            : 0);
        writeChanged(`${packBase}.Balancing`, heltec ? heltec.vDiff <= 50 : false);
        writeChanged(`${packBase}.Communication`, packStatus);
    }
}

try {
    ensureBatteryRootState();
    for (const state of STATES) {
        createBatteryState(state);
    }

    updateBatterySupervisor();
    setInterval(updateBatterySupervisor, COMMUNICATION_REFRESH_INTERVAL_MS);

    emit('info', `Version ${CONFIG.version} geladen.`);
    emit('info', `Erzeugte States: ${STATES.length}.`);
    emit('info', 'Rohdatenaufnahme abgeschlossen.');
} catch (error) {
    log(`Battery_Supervisor_V1 Fehler: ${error.message}`, 'warn');
}
