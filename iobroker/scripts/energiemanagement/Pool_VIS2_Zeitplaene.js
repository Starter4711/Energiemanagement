// ioBroker object: script.js.energiemanagement.Pool_VIS2_Zeitplaene
// name: Pool_VIS2_Zeitplaene
// engineType: Javascript/js
// enabled: True

'use strict';

const ROOT = 'PoolVIS2';
const schedules = [
    { source: 'time-switch.0.onoff.4.data', prefix: `${ROOT}.Zeitplan1` },
    { source: 'time-switch.0.onoff.5.data', prefix: `${ROOT}.Zeitplan2` },
];
let initialized = false;

for (const item of schedules) {
    createState(`${item.prefix}.Start`, '00:00', { type: 'string', role: 'value.time', read: true, write: true });
    createState(`${item.prefix}.Ende`, '00:00', { type: 'string', role: 'value.time', read: true, write: true });
}

function formatTime(trigger) {
    return `${String(trigger.hour).padStart(2, '0')}:${String(trigger.minute).padStart(2, '0')}`;
}

function parseTime(value) {
    const match = /^(\d{2}):(\d{2})$/.exec(String(value));
    if (!match) return null;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    return hour <= 23 && minute <= 59 ? { hour, minute } : null;
}

function readSchedule(source) {
    try {
        return JSON.parse(getState(source).val);
    } catch (error) {
        log(`Pool VIS2: Zeitplan ${source} ungueltig: ${error.message}`, 'warn');
        return null;
    }
}

function syncFromSource(item) {
    const schedule = readSchedule(item.source);
    if (!schedule) return;
    const onTrigger = schedule.triggers.find(trigger => trigger.action && trigger.action.name === 'On');
    const offTrigger = schedule.triggers.find(trigger => trigger.action && trigger.action.name === 'Off');
    if (!onTrigger || !offTrigger) return;

    const start = formatTime(onTrigger);
    const end = formatTime(offTrigger);
    if (getState(`javascript.0.${item.prefix}.Start`).val !== start) {
        setState(`javascript.0.${item.prefix}.Start`, start, true);
    }
    if (getState(`javascript.0.${item.prefix}.Ende`).val !== end) {
        setState(`javascript.0.${item.prefix}.Ende`, end, true);
    }
}

function syncToSource(item) {
    if (!initialized) return;
    const start = parseTime(getState(`javascript.0.${item.prefix}.Start`).val);
    const end = parseTime(getState(`javascript.0.${item.prefix}.Ende`).val);
    const schedule = readSchedule(item.source);
    if (!start || !end || !schedule) return;

    const onTrigger = schedule.triggers.find(trigger => trigger.action && trigger.action.name === 'On');
    const offTrigger = schedule.triggers.find(trigger => trigger.action && trigger.action.name === 'Off');
    if (!onTrigger || !offTrigger) return;

    onTrigger.hour = start.hour;
    onTrigger.minute = start.minute;
    offTrigger.hour = end.hour;
    offTrigger.minute = end.minute;
    const value = JSON.stringify(schedule);
    if (getState(item.source).val !== value) setState(item.source, value, false);
}

for (const item of schedules) {
    on({ id: item.source, change: 'ne' }, () => syncFromSource(item));
    on({
        id: [`javascript.0.${item.prefix}.Start`, `javascript.0.${item.prefix}.Ende`],
        change: 'ne',
    }, () => syncToSource(item));
}

setTimeout(() => {
    schedules.forEach(syncFromSource);
    initialized = true;
}, 1000);
