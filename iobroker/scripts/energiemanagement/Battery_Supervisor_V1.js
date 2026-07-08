// ioBroker object: script.js.energiemanagement.Battery_Supervisor_V1
// name: Battery_Supervisor_V1
// engineType: Javascript/js
// enabled: False

'use strict';

const ROOT = '0_userdata.0.EOS.Battery';

const CONFIG = {
    version: '1.0.0',
    logLevel: 'info',
    debugLevel: 0,
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

const STATES = [
    {
        id: `${ROOT}.Summary.HealthScore`,
        type: 'number',
        role: 'value',
        unit: '%',
        desc: 'Zusammengefasster Gesundheitswert der Batterie',
        defaultValue: CONFIG.defaults.number,
    },
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
        id: `${ROOT}.Summary.MaxVDiff`,
        type: 'number',
        role: 'value',
        unit: 'mV',
        desc: 'Maximale Spannungsdifferenz ueber alle bekannten Packs',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Summary.MaxTemperature`,
        type: 'number',
        role: 'value.temperature',
        unit: '°C',
        desc: 'Hoechste relevante Batterietemperatur',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Summary.ActiveWarnings`,
        type: 'number',
        role: 'value',
        unit: '',
        desc: 'Anzahl aktuell aktiver Warnungen',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Summary.Recommendation`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Kurztext der aktuell wichtigsten Handlungsempfehlung',
        defaultValue: '',
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
    {
        id: `${ROOT}.Health.Score`,
        type: 'number',
        role: 'value',
        unit: '%',
        desc: 'Bewerteter Gesundheitswert der Batterie',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Health.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Fachlicher Gesundheitsstatus',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Health.Reason`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Kurzbegruendung fuer den aktuellen Health-Status',
        defaultValue: '',
    },
    {
        id: `${ROOT}.Health.LastUpdate`,
        type: 'string',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Health-Bewertung',
        defaultValue: '',
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
        },
        {
            id: `${ROOT}.Packs.Pack${pack}.WarningCount`,
            type: 'number',
            role: 'value',
            unit: '',
            desc: `Anzahl aktiver Pack-Warnungen von Pack ${pack}`,
            defaultValue: CONFIG.defaults.number,
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
        id: `${ROOT}.Communication.Gobel`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Kommunikationsstatus von Gobel / Pace BMS',
        defaultValue: CONFIG.defaults.string,
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
        id: `${ROOT}.Communication.MQTT`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Kommunikationsstatus der relevanten MQTT-Strecke',
        defaultValue: CONFIG.defaults.string,
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
    },
    {
        id: `${ROOT}.Warnings.LowSOC`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'SOC liegt unterhalb der definierten Untergrenze',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Warnings.HighSOC`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'SOC liegt oberhalb der definierten Obergrenze',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Warnings.HighTemperature`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'Temperatur hat Warnschwelle erreicht oder ueberschritten',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Warnings.CriticalTemperature`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'Kritische Temperaturgrenze erreicht oder ueberschritten',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Warnings.HighVDiffNormal`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'Spannungsdifferenz im normalen Zustand ueber Warnschwelle',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Warnings.CriticalVDiffNormal`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'Spannungsdifferenz im normalen Zustand ueber kritischer Schwelle',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Warnings.HighVDiffBalancing`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'Spannungsdifferenz waehrend Balancing ueber Warnschwelle',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Warnings.CriticalVDiffBalancing`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'Spannungsdifferenz waehrend Balancing ueber kritischer Schwelle',
        defaultValue: CONFIG.defaults.boolean,
    },
    {
        id: `${ROOT}.Warnings.BMSWarning`,
        type: 'boolean',
        role: 'indicator',
        unit: '',
        desc: 'BMS meldet eine allgemeine Schutz- oder Warnlage',
        defaultValue: CONFIG.defaults.boolean,
    }
);

STATES.push(
    {
        id: `${ROOT}.Recommendation.Text`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Textuelle Handlungsempfehlung fuer den aktuellen Betriebszustand',
        defaultValue: '',
    },
    {
        id: `${ROOT}.Recommendation.Level`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Empfehlungsstufe',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Recommendation.Reason`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Kurzbegruendung fuer die Empfehlung',
        defaultValue: '',
    },
    {
        id: `${ROOT}.Settings.MinSOC`,
        type: 'number',
        role: 'value',
        unit: '%',
        desc: 'Untere SOC-Grenze fuer Bewertung und Warnlogik',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.MaxSOC`,
        type: 'number',
        role: 'value',
        unit: '%',
        desc: 'Obere SOC-Grenze fuer Bewertung und Warnlogik',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.MaxChargeCurrent`,
        type: 'number',
        role: 'value.current',
        unit: 'A',
        desc: 'Maximal zulaessiger Ladestrom',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.MaxDischargeCurrent`,
        type: 'number',
        role: 'value.current',
        unit: 'A',
        desc: 'Maximal zulaessiger Entladestrom',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.WallboxSupportMaxPower`,
        type: 'number',
        role: 'value.power',
        unit: 'W',
        desc: 'Maximale Batterieleistung fuer Wallbox-Unterstuetzung',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.WallboxSupportMinSOC`,
        type: 'number',
        role: 'value',
        unit: '%',
        desc: 'Untere SOC-Grenze fuer Wallbox-Unterstuetzung',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.TargetVoltageSummer`,
        type: 'number',
        role: 'value.voltage',
        unit: 'V',
        desc: 'Zielspannung fuer sommerliche Ladebewertung',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.TargetVoltageWinter`,
        type: 'number',
        role: 'value.voltage',
        unit: 'V',
        desc: 'Zielspannung fuer winterliche Ladebewertung',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.TemperatureWarning`,
        type: 'number',
        role: 'value.temperature',
        unit: '°C',
        desc: 'Temperatur-Warnschwelle',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.TemperatureCritical`,
        type: 'number',
        role: 'value.temperature',
        unit: '°C',
        desc: 'Temperatur-Kritischschwelle',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.VDiffWarningNormal`,
        type: 'number',
        role: 'value',
        unit: 'mV',
        desc: 'VDiff-Warnschwelle fuer normalen Betrieb',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.VDiffCriticalNormal`,
        type: 'number',
        role: 'value',
        unit: 'mV',
        desc: 'VDiff-Kritischschwelle fuer normalen Betrieb',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.VDiffWarningBalancing`,
        type: 'number',
        role: 'value',
        unit: 'mV',
        desc: 'VDiff-Warnschwelle waehrend Balancing',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Settings.VDiffCriticalBalancing`,
        type: 'number',
        role: 'value',
        unit: 'mV',
        desc: 'VDiff-Kritischschwelle waehrend Balancing',
        defaultValue: CONFIG.defaults.number,
        writable: true,
    },
    {
        id: `${ROOT}.Statistics.Today`,
        type: 'number',
        role: 'value',
        unit: '',
        desc: 'Platzhalter fuer Tagesstatistik',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Statistics.Week`,
        type: 'number',
        role: 'value',
        unit: '',
        desc: 'Platzhalter fuer Wochenstatistik',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Statistics.Month`,
        type: 'number',
        role: 'value',
        unit: '',
        desc: 'Platzhalter fuer Monatsstatistik',
        defaultValue: CONFIG.defaults.number,
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

try {
    for (const state of STATES) {
        createBatteryState(state);
    }

    emit('info', `Version ${CONFIG.version} geladen.`);
    emit('info', `Erzeugte States: ${STATES.length}.`);
    emit('info', 'Initialisierung abgeschlossen.');
} catch (error) {
    log(`Battery_Supervisor_V1 Fehler: ${error.message}`, 'warn');
}
