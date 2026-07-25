'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync(
    'iobroker/scripts/energiemanagement/Grid_Flow_V1.js',
    'utf8'
);

const now = Date.now();
const rawStates = new Map([
    ['alias.0.EM24 Old Grid.Power Old Grid', { val: 1200, ts: now }],
    ['alias.0.EM24 Hall Grid.Power', { val: -800, ts: now }],
    ['alias.0.EM24 New Grid.Power', { val: 300, ts: now }],
]);
const eosStates = new Map();
const definitions = new Map();
const subscriptions = new Map();
let intervalCallback = null;

const context = {
    Date,
    Number,
    Math,
    Map,
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
    on(options, callback) {
        subscriptions.set(options.id, callback);
    },
    setInterval(callback, delay) {
        assert.strictEqual(delay, 60000);
        intervalCallback = callback;
        return 1;
    },
    clearInterval() {},
    onStop() {},
    log() {},
};

vm.runInNewContext(source, context, { filename: 'Grid_Flow_V1.js' });

function value(id) {
    const state = eosStates.get(id);
    return state ? state.val : undefined;
}

function setRaw(id, val, ts) {
    rawStates.set(id, { val, ts });
    const callback = subscriptions.get(id);
    assert.ok(callback, `subscription missing for ${id}`);
    callback({ state: rawStates.get(id) });
}

const root = '0_userdata.0.EOS.Grid';
assert.strictEqual(value(`${root}.Sources.Grid40.DeviceInstance`), 40);
assert.strictEqual(value(`${root}.Sources.Grid41.DeviceInstance`), 41);
assert.strictEqual(value(`${root}.Sources.Grid43.DeviceInstance`), 43);
assert.strictEqual(value(`${root}.Sources.Grid40.Location`), 'Alte_Wohnung');
assert.strictEqual(value(`${root}.Sources.Grid41.Location`), 'Halle');
assert.strictEqual(value(`${root}.Sources.Grid43.Location`), 'Haus');
assert.strictEqual(value(`${root}.Sources.Grid40.Power`), 1200);
assert.strictEqual(value(`${root}.Sources.Grid41.Power`), -800);
assert.strictEqual(value(`${root}.Sources.Grid43.Power`), 300);
assert.strictEqual(subscriptions.has('alias.0.EM24 Old Grid.Power Old Grid'), true);
assert.strictEqual(subscriptions.has('alias.0.EM24 Hall Grid.Power'), true);
assert.strictEqual(subscriptions.has('alias.0.EM24 New Grid.Power'), true);
assert.strictEqual(subscriptions.has('mqtt.3.N.b827eb7fd855.grid.42.Ac.Power'), false);
assert.strictEqual([...definitions.keys()].some(id => id.includes('.Summary.')), false);

for (const [id, common] of definitions) {
    assert.strictEqual(common.read, true, `${id} must be readable`);
    assert.strictEqual(common.write, false, `${id} must be read-only`);
}
for (const id of definitions.keys()) {
    if (id.endsWith('.Power')) {
        assert.strictEqual(typeof value(id), 'number', `${id} must stay numeric`);
    }
    if (id.endsWith('.Status')) {
        assert.strictEqual(typeof value(id), 'string', `${id} must stay a string`);
    }
}

setRaw('alias.0.EM24 Hall Grid.Power', 'invalid', Date.now());
assert.strictEqual(value(`${root}.Sources.Grid41.Power`), 0);
assert.strictEqual(value(`${root}.Sources.Grid41.Status`), 'ERROR');

const old = Date.now() - 121000;
for (const id of rawStates.keys()) {
    rawStates.set(id, { val: 0, ts: old });
}
assert.ok(intervalCallback, 'central age timer missing');
intervalCallback();

for (const id of [...definitions.keys()]) {
    if (id.startsWith(root + ".")) {
        definitions.delete(id);
        eosStates.delete(id);
    }
}
intervalCallback();

assert.strictEqual(value(root + ".Sources.Grid40.DeviceInstance"), 40);
assert.strictEqual(value(root + ".Sources.Grid41.DeviceInstance"), 41);
assert.strictEqual(value(root + ".Sources.Grid43.DeviceInstance"), 43);
assert.strictEqual(value(root + ".Sources.Grid40.Status"), 'OFFLINE');
assert.strictEqual(value(root + ".Sources.Grid41.Status"), 'OFFLINE');
assert.strictEqual(value(root + ".Sources.Grid43.Status"), 'OFFLINE');
assert.strictEqual([...definitions.keys()].some(id => id.includes('.Summary.')), false);

console.log('Grid_Flow_V1 tests passed.');
