// ioBroker object: script.js.energiemanagement.Battery_Morning_View_V1
// name: Battery_Morning_View_V1
// engineType: Javascript/js
// enabled: False

'use strict';

const ROOT = '0_userdata.0.EOS.Battery';
const MORNING_ROOT = `${ROOT}.Morning`;
const REFRESH_INTERVAL_MS = 30_000;

const CONFIG = {
    version: '1.0.0',
    defaults: {
        string: 'UNKNOWN',
        number: 0,
    },
};

const STATES = [
    { id: `${MORNING_ROOT}.Status`, type: 'string', role: 'text', unit: '', desc: 'Morgenstatus', def: CONFIG.defaults.string },
    { id: `${MORNING_ROOT}.Score`, type: 'number', role: 'value', unit: '%', desc: 'Morgen-Score', def: CONFIG.defaults.number },
    { id: `${MORNING_ROOT}.SOC`, type: 'number', role: 'value', unit: '%', desc: 'Morgen-SOC', def: CONFIG.defaults.number },
    { id: `${MORNING_ROOT}.Power`, type: 'number', role: 'value.power', unit: 'W', desc: 'Aktuelle Batterieleistung', def: CONFIG.defaults.number },
    { id: `${MORNING_ROOT}.Direction`, type: 'string', role: 'text', unit: '', desc: 'Leistungsrichtung', def: CONFIG.defaults.string },
    { id: `${MORNING_ROOT}.Voltage`, type: 'number', role: 'value.voltage', unit: 'V', desc: 'Batteriespannung', def: CONFIG.defaults.number },
    { id: `${MORNING_ROOT}.Current`, type: 'number', role: 'value.current', unit: 'A', desc: 'Batteriestrom', def: CONFIG.defaults.number },
    { id: `${MORNING_ROOT}.HealthStatus`, type: 'string', role: 'text', unit: '', desc: 'Healthstatus', def: CONFIG.defaults.string },
    { id: `${MORNING_ROOT}.HealthScore`, type: 'number', role: 'value', unit: '%', desc: 'Healthscore', def: CONFIG.defaults.number },
    { id: `${MORNING_ROOT}.CommunicationStatus`, type: 'string', role: 'text', unit: '', desc: 'Kommunikationsstatus', def: CONFIG.defaults.string },
    { id: `${MORNING_ROOT}.Reasons`, type: 'string', role: 'text', unit: '', desc: 'Wesentliche Gründe', def: CONFIG.defaults.string },
    { id: `${MORNING_ROOT}.LastUpdate`, type: 'string', role: 'date', unit: '', desc: 'Letzte Aktualisierung', def: '' },
];

function ensureState(definition) {
    if (!existsState(definition.id)) {
        createState(definition.id, definition.def, {
            name: definition.id.split('.').pop(),
            type: definition.type,
            role: definition.role,
            unit: definition.unit,
            desc: definition.desc,
            read: true,
            write: false,
        });
    }
}

function readNumber(id) {
    const state = getState(id);
    if (!state || state.val === null || state.val === undefined || state.val === '') return null;
    const value = Number(state.val);
    return Number.isFinite(value) ? value : null;
}

function readString(id) {
    const state = getState(id);
    if (!state || state.val === null || state.val === undefined) return null;
    return String(state.val);
}

function normalizeStatus(value) {
    if (!value) return 'UNKNOWN';
    return String(value).toUpperCase();
}

function writeChanged(id, value) {
    const current = getState(id);
    if (!current || current.val !== value) {
        setState(id, value, true);
    }
}

function determineDirection(power, current) {
    const source = Number.isFinite(power) ? power : current;
    if (!Number.isFinite(source) || Math.abs(source) < 20) return 'IDLE';
    return source > 0 ? 'CHARGING' : 'DISCHARGING';
}

function batteryMessages() {
    const messages = [];
    const comm = {
        SmartShunt: normalizeStatus(readString(`${ROOT}.Communication.SmartShunt.Status`)),
        Gobel: normalizeStatus(readString(`${ROOT}.Communication.Gobel.Status`)),
        Heltec: normalizeStatus(readString(`${ROOT}.Communication.Heltec.Status`)),
        MQTT: normalizeStatus(readString(`${ROOT}.Communication.MQTT.Status`)),
    };
    const healthStatus = normalizeStatus(readString(`${ROOT}.Health.Status`));
    const healthScore = readNumber(`${ROOT}.Health.Score`);
    const summaryStatus = normalizeStatus(readString(`${ROOT}.Summary.Status`));
    const soc = readNumber(`${ROOT}.Summary.SOC`);
    const power = readNumber(`${ROOT}.Summary.Power`);
    const voltage = readNumber(`${ROOT}.Summary.Voltage`);
    const current = readNumber(`${ROOT}.Summary.Current`);
    const warnings = {
        SmartShuntOffline: Boolean(getState(`${ROOT}.Warnings.SmartShuntOffline`)?.val),
        GobelOffline: Boolean(getState(`${ROOT}.Warnings.GobelOffline`)?.val),
        HeltecOffline: Boolean(getState(`${ROOT}.Warnings.HeltecOffline`)?.val),
        MQTTOffline: Boolean(getState(`${ROOT}.Warnings.MQTTOffline`)?.val),
    };

    let status = 'UNKNOWN';
    if ([comm.SmartShunt, comm.Gobel, comm.Heltec, comm.MQTT].includes('OFFLINE') || summaryStatus === 'CRITICAL' || healthStatus === 'CRITICAL') {
        status = 'CRITICAL';
    } else if (summaryStatus === 'WARN' || healthStatus === 'WARN' || Object.values(warnings).some(Boolean) || (Number.isFinite(soc) && soc < 20)) {
        status = 'WARN';
    } else if (summaryStatus === 'OK' || healthStatus === 'OK') {
        status = 'OK';
    }

    if (comm.SmartShunt === 'OFFLINE') messages.push('Kommunikation SmartShunt offline');
    if (comm.Gobel === 'OFFLINE') messages.push('Kommunikation Gobel offline');
    if (comm.Heltec === 'OFFLINE') messages.push('Kommunikation Heltec offline');
    if (comm.MQTT === 'OFFLINE') messages.push('Kommunikation MQTT offline');
    if (healthStatus === 'UNKNOWN') messages.push('Health unbekannt');
    if (Number.isFinite(soc) && soc < 20) messages.push('SOC niedrig');
    if (Number.isFinite(power) && Math.abs(power) >= 20) messages.push(power > 0 ? 'Batterie lädt' : 'Batterie entlädt');
    if (!messages.length) messages.push('Keine Warnungen');

    const direction = determineDirection(power, current);
    const baseScore = Number.isFinite(healthScore) ? healthScore : 0;
    let score = baseScore;
    if (Number.isFinite(soc)) {
        if (soc < 10) score -= 30;
        else if (soc < 20) score -= 15;
    }
    if (Object.values(warnings).some(Boolean)) score -= 20;
    if (comm.SmartShunt === 'OFFLINE') score -= 20;
    score = Math.max(0, Math.min(100, score));

    return {
        status,
        score,
        soc: Number.isFinite(soc) ? soc : null,
        power: Number.isFinite(power) ? power : null,
        direction,
        voltage: Number.isFinite(voltage) ? voltage : null,
        current: Number.isFinite(current) ? current : null,
        healthStatus,
        healthScore: Number.isFinite(healthScore) ? healthScore : null,
        communicationStatus: [comm.SmartShunt, comm.Gobel, comm.Heltec, comm.MQTT].includes('OFFLINE')
            ? 'OFFLINE'
            : (Object.values(warnings).some(Boolean) ? 'WARN' : (healthStatus === 'UNKNOWN' ? 'UNKNOWN' : 'OK')),
        reasons: messages,
    };
}

function updateMorningView() {
    const result = batteryMessages();
    writeChanged(`${MORNING_ROOT}.Status`, result.status);
    writeChanged(`${MORNING_ROOT}.Score`, result.score);
    writeChanged(`${MORNING_ROOT}.SOC`, result.soc);
    writeChanged(`${MORNING_ROOT}.Power`, result.power);
    writeChanged(`${MORNING_ROOT}.Direction`, result.direction);
    writeChanged(`${MORNING_ROOT}.Voltage`, result.voltage);
    writeChanged(`${MORNING_ROOT}.Current`, result.current);
    writeChanged(`${MORNING_ROOT}.HealthStatus`, result.healthStatus);
    writeChanged(`${MORNING_ROOT}.HealthScore`, result.healthScore);
    writeChanged(`${MORNING_ROOT}.CommunicationStatus`, result.communicationStatus);
    writeChanged(`${MORNING_ROOT}.Reasons`, result.reasons.join('\n'));
    writeChanged(`${MORNING_ROOT}.LastUpdate`, new Date().toISOString());
}

try {
    for (const definition of STATES) {
        ensureState(definition);
    }

    updateMorningView();
    setInterval(updateMorningView, REFRESH_INTERVAL_MS);
} catch (error) {
    log(`Battery_Morning_View_V1 Fehler: ${error.message}`, 'warn');
}
