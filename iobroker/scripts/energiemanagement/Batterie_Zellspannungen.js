// ioBroker object: script.js.energiemanagement.Batterie_Zellspannungen
// name: Batterie_Zellspannungen
// engineType: Javascript/js
// enabled: False

'use strict';

const ROOT = '0_userdata.0.Energiemanagement.Batterie';
const CONFIG = '0_userdata.0.Energiemanagement.Config';
const PACKS = [1, 2, 3, 4];
const CELLS = 16;
const HISTORY_LENGTH = 5;
const TREND_THRESHOLD_MV = 3;
const diffHistory = { 1: [], 2: [], 3: [], 4: [] };
const invalidReported = { 1: false, 2: false, 3: false, 4: false };

function createOutputStates() {
    for (const pack of PACKS) {
        const base = `${ROOT}.Pack${pack}.Zellspannung`;
        createState(`${base}.Min_V`, 0, stateCommon('Minimale Zellspannung', 'number', 'value.voltage', 'V'));
        createState(`${base}.Max_V`, 0, stateCommon('Maximale Zellspannung', 'number', 'value.voltage', 'V'));
        createState(`${base}.Differenz_mV`, 0, stateCommon('Zellspannungsdifferenz', 'number', 'value', 'mV'));
        createState(`${base}.Durchschnitt_mV`, 0, stateCommon('Geglaettete Zellspannungsdifferenz', 'number', 'value', 'mV'));
        createState(`${base}.Alarm`, true, stateCommon('Zellspannungsalarm', 'boolean', 'indicator.alarm'));
        createState(`${base}.Daten_Gueltig`, false, stateCommon('Alle Zelldaten gueltig', 'boolean', 'indicator'));
        createState(`${base}.Gueltige_Zellen`, 0, stateCommon('Anzahl gueltiger Zellen', 'number', 'value'));
        createState(`${base}.Trend`, 0, stateCommon('Trend der Zellspannungsdifferenz', 'number', 'value.direction'));
        createState(`${base}.Trend_Text`, 'stabil', stateCommon('Trend als Text', 'string', 'text'));
        createState(`${base}.Letzte_Aktualisierung`, '', stateCommon('Letzte Aktualisierung', 'string', 'date'));
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

function readPaceCell(pack, cell, maxAgeMs) {
    const register = 40015 + cell;
    const id = `modbus.1.holdingRegisters.${pack}.${register}_Cell_Voltage_${cell}`;
    const state = getState(id);
    const value = state && Number(state.val);
    if (!state || !Number.isFinite(value) || value <= 0 || Date.now() - state.ts > maxAgeMs) return null;
    return { value, ts: state.ts };
}

function updatePack(pack, alarmLimitMv, maxAgeMs) {
    const base = `${ROOT}.Pack${pack}.Zellspannung`;
    const cells = [];

    for (let cell = 1; cell <= CELLS; cell++) {
        const cellState = readPaceCell(pack, cell, maxAgeMs);
        if (cellState !== null) cells.push(cellState);
    }

    const complete = cells.length === CELLS;
    const latestSourceTs = cells.reduce((latest, cell) => Math.max(latest, cell.ts), 0);
    writeChanged(`${base}.Gueltige_Zellen`, cells.length);
    writeChanged(`${base}.Daten_Gueltig`, complete);
    if (latestSourceTs > 0) writeChanged(`${base}.Letzte_Aktualisierung`, new Date(latestSourceTs).toISOString());

    if (!complete) {
        writeChanged(`${base}.Alarm`, true);
        if (!invalidReported[pack]) {
            log(`Batterie_Zellspannungen: Pack ${pack} hat nur ${cells.length} von ${CELLS} gueltigen Zellen.`, 'warn');
            invalidReported[pack] = true;
        }
        return;
    }
    invalidReported[pack] = false;

    const values = cells.map(cell => cell.value);
    const minMv = Math.min(...values);
    const maxMv = Math.max(...values);
    const diffMv = maxMv - minMv;
    const history = diffHistory[pack];
    history.push(diffMv);
    if (history.length > HISTORY_LENGTH) history.shift();

    const averageMv = history.reduce((sum, value) => sum + value, 0) / history.length;
    let trend = 0;
    if (history.length >= 2) {
        const delta = history[history.length - 1] - history[history.length - 2];
        if (delta > TREND_THRESHOLD_MV) trend = 1;
        if (delta < -TREND_THRESHOLD_MV) trend = -1;
    }

    writeChanged(`${base}.Min_V`, Math.round(minMv) / 1000);
    writeChanged(`${base}.Max_V`, Math.round(maxMv) / 1000);
    writeChanged(`${base}.Differenz_mV`, Math.round(diffMv));
    writeChanged(`${base}.Durchschnitt_mV`, Math.round(averageMv));
    writeChanged(`${base}.Alarm`, diffMv > alarmLimitMv);
    writeChanged(`${base}.Trend`, trend);
    writeChanged(`${base}.Trend_Text`, trend > 0 ? 'steigend' : trend < 0 ? 'fallend' : 'stabil');
}

function updateAll() {
    try {
        const alarmLimitMv = configNumber('Batterie_Zellspreizung_Alarm_mV', 50);
        const maxAgeMs = configNumber('Batterie_Zelldaten_Max_Alter_Sekunden', 300) * 1000;
        for (const pack of PACKS) updatePack(pack, alarmLimitMv, maxAgeMs);
    } catch (error) {
        log(`Batterie_Zellspannungen Fehler: ${error.message}`, 'warn');
    }
}

createOutputStates();
schedule('*/15 * * * * *', updateAll);
log('Batterie-Zellspannungsueberwachung ist gestartet.', 'info');
