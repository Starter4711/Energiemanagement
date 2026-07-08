// ioBroker object: script.js.energiemanagement.Battery_Health_V1
// name: Battery_Health_V1
// engineType: Javascript/js
// enabled: False

'use strict';

const ROOT = '0_userdata.0.EOS.Battery';
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

const PACKS = [1, 2, 3, 4];

const STATES = [
    {
        id: `${ROOT}.Health.Status`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Einfacher Batteriezustand auf Basis der EOS-Battery-States',
        defaultValue: CONFIG.defaults.string,
    },
    {
        id: `${ROOT}.Health.Score`,
        type: 'number',
        role: 'value',
        unit: '%',
        desc: 'Einfacher Health-Score von 0 bis 100',
        defaultValue: CONFIG.defaults.number,
    },
    {
        id: `${ROOT}.Health.LastUpdate`,
        type: 'string',
        role: 'date',
        unit: '',
        desc: 'Zeitpunkt der letzten Health-Bewertung',
        defaultValue: '',
    },
    {
        id: `${ROOT}.Health.Reasons`,
        type: 'string',
        role: 'text',
        unit: '',
        desc: 'Nachvollziehbare Begründung der aktuellen Health-Bewertung',
        defaultValue: '',
    },
];

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
    log(`Battery_Health_V1: ${message}`, level);
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
            write: false,
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

function formatIso(timestamp) {
    if (!Number.isFinite(timestamp)) return '';
    return new Date(timestamp).toISOString();
}

function mapCommunicationStatus(status) {
    if (!status) return 'UNKNOWN';
    return String(status).toUpperCase();
}

function collectReasons() {
    const reasons = [];

    const communicationChecks = [
        ['SmartShunt', 'SmartShunt'],
        ['Gobel', 'Gobel'],
        ['Heltec', 'Heltec'],
        ['MQTT', 'MQTT'],
    ];

    for (const [label, prefix] of communicationChecks) {
        const status = mapCommunicationStatus(readString(`${ROOT}.Communication.${prefix}.Status`));
        if (status === 'OFFLINE') {
            reasons.push(`${label}: OFFLINE`);
        } else if (status === 'WARN') {
            reasons.push(`${label}: WARN`);
        } else if (status === 'UNKNOWN') {
            reasons.push(`${label}: UNKNOWN`);
        }
    }

    let maxVDiff = null;
    for (const pack of PACKS) {
        const value = readNumber(`${ROOT}.Packs.Pack${pack}.VDiff`);
        if (value === null) {
            continue;
        }
        if (maxVDiff === null || value > maxVDiff) {
            maxVDiff = value;
        }
    }

    if (maxVDiff !== null) {
        if (maxVDiff >= 100) {
            reasons.push(`MaxVDiff ${maxVDiff} mV`);
        } else if (maxVDiff >= 50) {
            reasons.push(`MaxVDiff ${maxVDiff} mV`);
        }
    }

    return { reasons, maxVDiff };
}

function calculateHealth() {
    const smartShuntSoc = readNumber(`${ROOT}.SmartShunt.SOC`);
    const smartShuntVoltage = readNumber(`${ROOT}.SmartShunt.Voltage`);
    const smartShuntCurrent = readNumber(`${ROOT}.SmartShunt.Current`);

    if (smartShuntSoc === null || smartShuntVoltage === null || smartShuntCurrent === null) {
        return {
            status: 'UNKNOWN',
            score: 0,
            reasons: ['Missing SmartShunt base values'],
        };
    }

    const { reasons, maxVDiff } = collectReasons();
    let score = 100;
    let status = 'OK';

    for (const reason of reasons) {
        if (reason.includes('OFFLINE')) {
            score -= 40;
            status = 'CRITICAL';
        } else if (reason.includes('WARN')) {
            score -= 20;
            if (status === 'OK') {
                status = 'WARN';
            }
        } else if (reason.startsWith('MaxVDiff')) {
            if (maxVDiff >= 100) {
                score -= 30;
                status = 'CRITICAL';
            } else if (maxVDiff >= 50) {
                score -= 15;
                if (status === 'OK') {
                    status = 'WARN';
                }
            }
        } else if (reason.includes('UNKNOWN') && status === 'OK') {
            status = 'UNKNOWN';
        }
    }

    if (reasons.some(reason => reason.includes('UNKNOWN')) && !reasons.some(reason => reason.includes('OFFLINE') || reason.includes('WARN') || reason.startsWith('MaxVDiff'))) {
        status = 'UNKNOWN';
        score = Math.min(score, 50);
    }

    score = Math.max(0, Math.min(100, score));

    if (status === 'OK' && score < 80) {
        status = 'WARN';
    }
    if (score === 0) {
        status = 'CRITICAL';
    }

    return {
        status,
        score,
        reasons: reasons.length > 0 ? reasons : ['All base values available'],
    };
}

function updateBatteryHealth() {
    const result = calculateHealth();
    writeChanged(`${ROOT}.Health.Status`, result.status);
    writeChanged(`${ROOT}.Health.Score`, result.score);
    writeChanged(`${ROOT}.Health.LastUpdate`, formatIso(Date.now()));
    writeChanged(`${ROOT}.Health.Reasons`, result.reasons.join('; '));
}

try {
    for (const state of STATES) {
        createBatteryState(state);
    }

    updateBatteryHealth();
    setInterval(updateBatteryHealth, REFRESH_INTERVAL_MS);

    emit('info', `Version ${CONFIG.version} geladen.`);
    emit('info', `Erzeugte States: ${STATES.length}.`);
} catch (error) {
    log(`Battery_Health_V1 Fehler: ${error.message}`, 'warn');
}
