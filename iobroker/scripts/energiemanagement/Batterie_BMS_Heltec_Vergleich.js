// ioBroker object: script.js.energiemanagement.Batterie_BMS_Heltec_Vergleich
// name: Batterie_BMS_Heltec_Vergleich
// engineType: Javascript/js
// enabled: True

'use strict';

const ROOT = '0_userdata.0.EOS.Batterie';
const CONFIG = '0_userdata.0.EOS.Config';
const PACKS = [1, 2, 3, 4];
const CELLS = 16;
const invalidReported = { 1: false, 2: false, 3: false, 4: false };

function createOutputStates() {
    for (const pack of PACKS) {
        const base = `${ROOT}.Pack${pack}.BMS_Heltec_Vergleich`;
        createState(`${base}.Alarm`, true, stateCommon('BMS-/HELTEC-Vergleichsalarm', 'boolean', 'indicator.alarm'));
        createState(`${base}.Daten_Gueltig`, false, stateCommon('Alle Vergleichsdaten gueltig', 'boolean', 'indicator'));
        createState(`${base}.Gueltige_Zellen`, 0, stateCommon('Anzahl gueltiger Vergleiche', 'number', 'value'));
        createState(`${base}.Alarm_Zellen`, '', stateCommon('Zellen mit Abweichungsalarm', 'string', 'text'));
        createState(`${base}.Max_Differenz_mV`, 0, stateCommon('Maximale BMS-/HELTEC-Abweichung', 'number', 'value', 'mV'));
        createState(`${base}.Letzte_Aktualisierung`, '', stateCommon('Letzte Aktualisierung', 'string', 'date'));

        for (let cell = 1; cell <= CELLS; cell++) {
            const cellBase = `${base}.Zelle${cell}`;
            createState(`${cellBase}.Differenz_mV`, 0, stateCommon(`Zelle ${cell} Abweichung`, 'number', 'value', 'mV'));
            createState(`${cellBase}.Alarm`, true, stateCommon(`Zelle ${cell} Abweichungsalarm`, 'boolean', 'indicator.alarm'));
        }
    }
}

function stateCommon(name, type, role, unit) {
    const common = { name, type, role, read: true, write: false };
    if (unit) common.unit = unit;
    return common;
}

function configNumber(id, fallback) {
    const state = getState(`${CONFIG}.${id}`);
    const value = state && Number(state.val);
    return Number.isFinite(value) ? value : fallback;
}

function writeChanged(id, value) {
    const current = getState(id);
    if (!current || current.val !== value) setState(id, value, true);
}

function readFreshNumber(id, maxAgeMs) {
    const state = getState(id);
    const value = state && Number(state.val);
    if (!state || !Number.isFinite(value) || value <= 0 || Date.now() - state.ts > maxAgeMs) return null;
    return { value, ts: state.ts };
}

function readHeltecPack(pack, maxAgeMs) {
    const state = getState(`mqtt.0.HELTEC_${pack}.data`);
    if (!state || typeof state.val !== 'string' || Date.now() - state.ts > maxAgeMs) return null;

    try {
        const payload = JSON.parse(state.val);
        if (!payload || !Array.isArray(payload.cells) || payload.cells.length !== CELLS) return null;

        const cells = Array(CELLS).fill(null);
        for (const item of payload.cells) {
            const cell = Number(item && item.cell);
            const voltage = Number(item && item.voltage);
            if (cell >= 1 && cell <= CELLS && Number.isFinite(voltage) && voltage > 0) {
                cells[cell - 1] = voltage;
            }
        }
        return cells.every(value => value !== null) ? { cells, ts: state.ts } : null;
    } catch (error) {
        return null;
    }
}

function updatePack(pack, alarmLimitMv, maxAgeMs) {
    const base = `${ROOT}.Pack${pack}.BMS_Heltec_Vergleich`;
    const alarmCells = [];
    let validCells = 0;
    let maxDiffMv = 0;
    let latestSourceTs = 0;
    const heltecPack = readHeltecPack(pack, maxAgeMs);

    for (let cell = 1; cell <= CELLS; cell++) {
        const register = 40015 + cell;
        const paceId = `modbus.1.holdingRegisters.${pack}.${register}_Cell_Voltage_${cell}`;
        const paceState = readFreshNumber(paceId, maxAgeMs);
        const heltecV = heltecPack && heltecPack.cells[cell - 1];
        const cellBase = `${base}.Zelle${cell}`;

        if (paceState === null || heltecV === null) {
            writeChanged(`${cellBase}.Alarm`, true);
            alarmCells.push(cell);
            continue;
        }

        const paceV = paceState.value / 1000;
        const diffMv = Math.abs(paceV - heltecV) * 1000;
        const alarm = diffMv > alarmLimitMv;
        validCells++;
        latestSourceTs = Math.max(latestSourceTs, paceState.ts, heltecPack.ts);
        maxDiffMv = Math.max(maxDiffMv, diffMv);
        if (alarm) alarmCells.push(cell);

        writeChanged(`${cellBase}.Differenz_mV`, Math.round(diffMv));
        writeChanged(`${cellBase}.Alarm`, alarm);
    }

    const complete = validCells === CELLS;
    writeChanged(`${base}.Gueltige_Zellen`, validCells);
    writeChanged(`${base}.Daten_Gueltig`, complete);
    writeChanged(`${base}.Alarm_Zellen`, alarmCells.join(','));
    writeChanged(`${base}.Max_Differenz_mV`, Math.round(maxDiffMv));
    writeChanged(`${base}.Alarm`, !complete || alarmCells.length > 0);
    if (latestSourceTs > 0) writeChanged(`${base}.Letzte_Aktualisierung`, new Date(latestSourceTs).toISOString());

    if (!complete) {
        if (!invalidReported[pack]) {
            log(`Batterie_BMS_Heltec_Vergleich: Pack ${pack} hat nur ${validCells} von ${CELLS} gueltigen Vergleichen.`, 'warn');
            invalidReported[pack] = true;
        }
    } else {
        invalidReported[pack] = false;
    }
}

function updateAll() {
    try {
        const alarmLimitMv = configNumber('Batterie_BMS_Heltec_Alarm_mV', 50);
        const maxAgeMs = configNumber('Batterie_Zelldaten_Max_Alter_Sekunden', 300) * 1000;
        for (const pack of PACKS) updatePack(pack, alarmLimitMv, maxAgeMs);
    } catch (error) {
        log(`Batterie_BMS_Heltec_Vergleich Fehler: ${error.message}`, 'warn');
    }
}

createOutputStates();
schedule('*/30 * * * * *', updateAll);
log('Batterie-BMS-/HELTEC-Vergleich ist gestartet.', 'info');
