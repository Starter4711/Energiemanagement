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
    ['0_userdata.0.EOS.Grid.Sources.Grid40.Power', { val: 1200, ts: now }],
    ['0_userdata.0.EOS.Grid.Sources.Grid40.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Grid.Sources.Grid40.LastUpdate', { val: now, ts: now }],
    ['0_userdata.0.EOS.Grid.Sources.Grid41.Power', { val: -800, ts: now }],
    ['0_userdata.0.EOS.Grid.Sources.Grid41.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Grid.Sources.Grid41.LastUpdate', { val: now, ts: now }],
    ['0_userdata.0.EOS.Grid.Sources.Grid43.Power', { val: 300, ts: now }],
    ['0_userdata.0.EOS.Grid.Sources.Grid43.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Grid.Sources.Grid43.LastUpdate', { val: now, ts: now }],
    ['0_userdata.0.EOS.Battery.Summary.Power', { val: 0, ts: now }],
    ['0_userdata.0.EOS.Battery.Summary.SOC', { val: 50, ts: now }],
    ['0_userdata.0.EOS.Battery.Summary.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Battery.Communication.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Battery.Communication.SmartShunt.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Battery.Communication.Gobel.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Battery.Communication.Heltec.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.Battery.Communication.MQTT.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.PV.Summary.TotalPower', { val: 6200, ts: now }],
    ['0_userdata.0.EOS.PV.Summary.Status', { val: 'OK', ts: now }],
    ['0_userdata.0.EOS.PV.Summary.LastUpdate', { val: now, ts: now }],
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
        return null;
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
assert.strictEqual(value(`${root}.Grid.Grid40.Power`), 1200);
assert.strictEqual(value(`${root}.Grid.Grid40.Status`), 'OK');
assert.strictEqual(value(`${root}.Grid.Grid40.LastUpdate`), now);
assert.strictEqual(value(`${root}.Grid.Grid41.Power`), -800);
assert.strictEqual(value(`${root}.Grid.Grid41.Status`), 'OK');
assert.strictEqual(value(`${root}.Grid.Grid41.LastUpdate`), now);
assert.strictEqual(value(`${root}.Grid.Grid43.Power`), 300);
assert.strictEqual(value(`${root}.Grid.Grid43.Status`), 'OK');
assert.strictEqual(value(`${root}.Grid.Grid43.LastUpdate`), now);
assert.strictEqual(definitions.has(`${root}.Grid.Power`), false);
assert.strictEqual(definitions.has(`${root}.Grid.Status`), false);
assert.strictEqual(definitions.has(`${root}.Grid.LastUpdate`), false);
assert.strictEqual(subscriptions.has('0_userdata.0.EOS.Grid.Sources.Grid40.Power'), true);
assert.strictEqual(subscriptions.has('0_userdata.0.EOS.Grid.Sources.Grid41.Power'), true);
assert.strictEqual(subscriptions.has('0_userdata.0.EOS.Grid.Sources.Grid43.Power'), true);
assert.strictEqual([...subscriptions.keys()].some(id => id.includes('Grid42')), false);
assert.strictEqual([...subscriptions.keys()].some(id => id.includes('Energiemanagement.Bilanz')), false);
assert.strictEqual(value(`${root}.PV.Power`), 6200);
assert.strictEqual(value(`${root}.PV.Status`), 'OK');
assert.strictEqual(value(`${root}.PV.LastUpdate`), now);
assert.strictEqual(value(`${root}.Wallbox.Power`), 3500);
assert.strictEqual(value(`${root}.Wallbox.Active`), true);
assert.strictEqual(value(`${root}.Wallbox.Status`), 'OK');
assert.strictEqual(value(`${root}.Wallbox.LastUpdate`), now);
assert.strictEqual(value(`${root}.Summary.Status`), 'OK');
assert.strictEqual(value(`${root}.Communication.OverallStatus`), 'OK');
assert.strictEqual(value(`${root}.Communication.TimeoutCount`), 1);

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
assert.strictEqual(value(`${root}.Communication.TimeoutCount`), 2);

setRaw('0_userdata.0.EOS.Wallbox.Summary.Status', 'DEGRADED');
assert.strictEqual(value(`${root}.Wallbox.Status`), 'WARNING');
assert.strictEqual(value(`${root}.Communication.OverallStatus`), 'WARNING');

setRaw('0_userdata.0.EOS.PV.Summary.TotalPower', 0);
setRaw('0_userdata.0.EOS.PV.Summary.Status', 'STANDBY');
assert.strictEqual(value(`${root}.PV.Power`), 0);
assert.strictEqual(value(`${root}.PV.Status`), 'STANDBY');
assert.strictEqual(value(`${root}.Communication.OverallStatus`), 'WARNING');
assert.strictEqual(value(`${root}.Communication.TimeoutCount`), 2);

console.log('Energy_Flow_V1 Grid, PV and Wallbox integration tests passed.');
