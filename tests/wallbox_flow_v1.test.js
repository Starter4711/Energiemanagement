'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync(
    'iobroker/scripts/energiemanagement/Wallbox_Flow_V1.js',
    'utf8'
);

const now = Date.now();
const rawStates = new Map([
    ['alias.0.go-E.powerV3', { val: 1.5, ts: now }],
    ['alias.0.go-E.powerV4', { val: 0.1, ts: now }],
    ['alias.0.go-E.go-E-V4-Halle', { val: 2, ts: now }],
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

vm.runInNewContext(source, context, { filename: 'Wallbox_Flow_V1.js' });

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

assert.strictEqual(value('0_userdata.0.EOS.Wallbox.Summary.Power'), 3600);
assert.strictEqual(value('0_userdata.0.EOS.Wallbox.Summary.Active'), true);
assert.strictEqual(value('0_userdata.0.EOS.Wallbox.Summary.Status'), 'OK');
assert.strictEqual(value('0_userdata.0.EOS.Wallbox.Sources.Wallbox2.Power'), 100);
assert.strictEqual(value('0_userdata.0.EOS.Wallbox.Sources.Wallbox2.Active'), false);

for (const [id, common] of definitions) {
    assert.strictEqual(common.read, true, `${id} must be readable`);
    assert.strictEqual(common.write, false, `${id} must be read-only`);
}
for (const id of definitions.keys()) {
    if (id.endsWith('.Power')) {
        assert.strictEqual(typeof value(id), 'number', `${id} must stay numeric`);
    }
    if (id.endsWith('.Status')) {
        assert.strictEqual(typeof value(id), 'string', `${id} status must stay a string`);
    }
}

setRaw('alias.0.go-E.powerV3', -1, Date.now());
assert.strictEqual(value('0_userdata.0.EOS.Wallbox.Sources.Wallbox1.Power'), 0);
assert.strictEqual(value('0_userdata.0.EOS.Wallbox.Sources.Wallbox1.Status'), 'ERROR');
assert.strictEqual(value('0_userdata.0.EOS.Wallbox.Summary.Status'), 'DEGRADED');

const old = Date.now() - 121000;
rawStates.set('alias.0.go-E.powerV3', { val: 1, ts: old });
rawStates.set('alias.0.go-E.powerV4', { val: 1, ts: old });
rawStates.set('alias.0.go-E.go-E-V4-Halle', { val: 1, ts: old });
assert.ok(intervalCallback, 'central age timer missing');
intervalCallback();

assert.strictEqual(value('0_userdata.0.EOS.Wallbox.Summary.Power'), 0);
assert.strictEqual(value('0_userdata.0.EOS.Wallbox.Summary.Active'), false);
assert.strictEqual(value('0_userdata.0.EOS.Wallbox.Summary.Status'), 'OFFLINE');

console.log('Wallbox_Flow_V1 tests passed.');
