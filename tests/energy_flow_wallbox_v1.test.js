'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync(
    'iobroker/scripts/energiemanagement/Energy_Flow_V1.js',
    'utf8'
);

const now = Date.now();
const rawStates = new Map([
    ['0_userdata.0.Energiemanagement.Bilanz.Summe_W', { val: 0, ts: now }],
    ['0_userdata.0.Energiemanagement.Bilanz.Gueltig', { val: true, ts: now }],
    ['0_userdata.0.Energiemanagement.Bilanz.Fehler', { val: '', ts: now }],
    ['0_userdata.0.EOS.Battery.Summary.Power', { val: 0, ts: now }],
    ['0_userdata.0.EOS.Battery.Summary.SOC', { val: 50, ts: now }],
    ['0_userdata.0.EOS.Battery.Summary.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Battery.Communication.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Battery.Communication.SmartShunt.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Battery.Communication.Gobel.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Battery.Communication.Heltec.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Battery.Communication.MQTT.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Wallbox.Summary.Power', { val: 3500, ts: now }],
    ['0_userdata.0.EOS.Wallbox.Summary.Active', { val: true, ts: now }],
    ['0_userdata.0.EOS.Wallbox.Summary.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Wallbox.Summary.LastUpdate', { val: now, ts: now }],
]);
const eosStates = new Map();
const definitions = new Map();
const subscriptions = new Map();

const context = {
    Date,
    Number,
    Object,
    String,
    Boolean,
    console,
    createState(id, value, common) {
        definitions.set(id, common);
        if (!eosStates.has(id)) {
            eosStates.set(id, { val: value, ts: now });
        }
    },
    getState(id) {
        return rawStates.get(id) || eosStates.get(id) || null;
    },
    setState(id, value) {
        eosStates.set(id, { val: value, ts: Date.now() });
    },
    existsState(id) {
        return rawStates.has(id);
    },
    on(options, callback) {
        subscriptions.set(options.id, callback);
    },
    setTimeout(callback) {
        callback();
        return 1;
    },
    log() {},
};

vm.runInNewContext(source, context, { filename: 'Energy_Flow_V1.js' });

function value(id) {
    const state = eosStates.get(id);
    return state ? state.val : undefined;
}

function setRaw(id, val) {
    rawStates.set(id, { val, ts: Date.now() });
    const callback = subscriptions.get(id);
    assert.ok(callback, `subscription missing for ${id}`);
    callback({ state: rawStates.get(id) });
}

const root = '0_userdata.0.EOS.EnergyFlow';
assert.strictEqual(value(`${root}.Wallbox.Power`), 3500);
assert.strictEqual(value(`${root}.Wallbox.Active`), true);
assert.strictEqual(value(`${root}.Wallbox.Status`), 'OK');
assert.strictEqual(value(`${root}.Wallbox.LastUpdate`), now);
assert.strictEqual(value(`${root}.Summary.Status`), 'OK');
assert.strictEqual(value(`${root}.Communication.OverallStatus`), 'OK');
assert.strictEqual(value(`${root}.Communication.TimeoutCount`), 2);

for (const [id, common] of definitions) {
    assert.strictEqual(common.read, true, `${id} must be readable`);
    assert.strictEqual(common.write, false, `${id} must be read-only`);
}

setRaw('0_userdata.0.EOS.Wallbox.Summary.Power', 0);
setRaw('0_userdata.0.EOS.Wallbox.Summary.Active', false);
setRaw('0_userdata.0.EOS.Wallbox.Summary.Status', 'OFFLINE');

assert.strictEqual(value(`${root}.Wallbox.Power`), 0);
assert.strictEqual(value(`${root}.Wallbox.Active`), false);
assert.strictEqual(value(`${root}.Wallbox.Status`), 'ERROR');
assert.strictEqual(value(`${root}.Summary.Status`), 'ERROR');
assert.strictEqual(value(`${root}.Communication.OverallStatus`), 'ERROR');
assert.strictEqual(value(`${root}.Communication.TimeoutCount`), 3);

setRaw('0_userdata.0.EOS.Wallbox.Summary.Status', 'DEGRADED');
assert.strictEqual(value(`${root}.Wallbox.Status`), 'WARNING');
assert.strictEqual(value(`${root}.Communication.OverallStatus`), 'WARNING');

console.log('Energy_Flow_V1 Wallbox integration tests passed.');
