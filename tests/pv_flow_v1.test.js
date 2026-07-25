'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('iobroker/scripts/energiemanagement/PV_Flow_V1.js', 'utf8');
const now = Date.now();
const ids = {
    froniusHalle: 'alias.0.Fronius.AC-Power',
    froniusHaus: 'alias.0.Fronius.AC-Power_10kW',
    sma: 'alias.0.SMA.Power',
    solarEdge: 'alias.0.SE.Power',
    rs1: 'alias.0.MPPT RS450/100.P String1',
    rs2: 'alias.0.MPPT RS450/100.P String2',
};
const raw = new Map([
    [ids.froniusHalle, { val: 1000, ts: now }],
    [ids.froniusHaus, { val: 2000, ts: now }],
    [ids.sma, { val: 500, ts: now }],
    [ids.solarEdge, { val: 1500, ts: now }],
    [ids.rs1, { val: 300, ts: now }],
    [ids.rs2, { val: 200, ts: now }],
]);
const states = new Map();
const definitions = new Map();
const subscriptions = new Map();
let ageCallback = null;

const context = {
    Date, Number, Math, Map, Object, Boolean, String, console,
    createState(id, value, common) {
        definitions.set(id, common);
        if (!states.has(id)) states.set(id, { val: value, ts: now });
    },
    existsState(id) { return raw.has(id) || states.has(id); },
    getState(id) { return raw.get(id) || states.get(id) || null; },
    setState(id, value) { states.set(id, { val: value, ts: Date.now() }); },
    on(options, callback) { subscriptions.set(options.id, callback); },
    setTimeout(callback) { callback(); return null; },
    setInterval(callback, delay) {
        assert.strictEqual(delay, 60000);
        ageCallback = callback;
        return 1;
    },
    clearInterval() {}, onStop() {}, log() {},
};

vm.runInNewContext(source, context, { filename: 'PV_Flow_V1.js' });
const root = '0_userdata.0.EOS.PV';
const value = id => states.get(id).val;

assert.strictEqual(value(`${root}.Summary.ACPower`), 5000);
assert.strictEqual(value(`${root}.Summary.DCPower`), 500);
assert.strictEqual(value(`${root}.Summary.TotalPower`), 5500);
assert.strictEqual(value(`${root}.Summary.Active`), true);
assert.strictEqual(value(`${root}.Summary.Status`), 'OK');

for (const [id, common] of definitions) {
    assert.strictEqual(common.read, true, `${id} must be readable`);
    assert.strictEqual(common.write, false, `${id} must be read-only`);
}

const old = Date.now() - 300000;
raw.set(ids.sma, { val: 0, ts: old });
ageCallback();
assert.strictEqual(value(`${root}.Sources.SMA.Power`), 0);
assert.strictEqual(value(`${root}.Sources.SMA.Status`), 'STANDBY');
assert.strictEqual(value(`${root}.Summary.Status`), 'OK');

raw.set(ids.froniusHalle, { val: 1000, ts: old });
ageCallback();
assert.strictEqual(value(`${root}.Sources.FroniusHalle.Power`), 0);
assert.strictEqual(value(`${root}.Sources.FroniusHalle.Status`), 'OFFLINE');
assert.strictEqual(value(`${root}.Summary.Status`), 'DEGRADED');
assert.strictEqual(value(`${root}.Summary.ACPower`), 4000);
assert.strictEqual(value(`${root}.Summary.TotalPower`), 4500);

raw.set(ids.rs1, { val: -1, ts: Date.now() });
subscriptions.get(ids.rs1)({ state: raw.get(ids.rs1) });
assert.strictEqual(value(`${root}.Sources.RS450String1.Power`), 0);
assert.strictEqual(value(`${root}.Sources.RS450String1.Status`), 'ERROR');
assert.strictEqual(value(`${root}.Summary.DCPower`), 200);

console.log('PV_Flow_V1 tests passed.');
