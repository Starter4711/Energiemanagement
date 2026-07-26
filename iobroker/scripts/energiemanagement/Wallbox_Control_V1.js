// ioBroker object: script.js.energiemanagement.Wallbox_Control_V1
// name: Wallbox_Control_V1
// engineType: Javascript/js
// enabled: True

'use strict';

const ROOT = '0_userdata.0.EOS.Wallbox.Control';

const WALLBOXES = [
    {
        key: 'Wallbox1_Freigabe',
        source: 'go-e.0.allow_charging',
        name: 'Wallbox 1 Freigabe',
    },
    {
        key: 'Wallbox2_Freigabe',
        source: 'go-e.1.allow_charging',
        name: 'Wallbox 2 Freigabe',
    },
];

function createBoolState(id, name) {
    createState(id, false, {
        name,
        type: 'boolean',
        role: 'switch',
        read: true,
        write: true,
    });
}

function toBool(value) {
    return value === true || value === 1 || value === '1' || value === 'true';
}

function toNumber01(value) {
    return toBool(value) ? 1 : 0;
}

function syncFromSource(item) {
    const sourceState = getState(item.source);
    const value = sourceState ? toBool(sourceState.val) : false;
    setState(item.id, value, true);
}

try {
    for (const item of WALLBOXES) {
        item.id = `${ROOT}.${item.key}`;
        createBoolState(item.id, item.name);

        const current = getState(item.source);
        if (current) {
            setState(item.id, toBool(current.val), true);
        }

        on({ id: item.id, change: 'ne' }, obj => {
            const nextValue = toBool(obj.state.val);
            setState(item.source, toNumber01(nextValue), false);
        });

        if (existsState(item.source)) {
            on({ id: item.source, change: 'ne' }, () => syncFromSource(item));
        }
    }

    emit('info', 'Wallbox_Control_V1 aktiv.');
} catch (error) {
    log(`Wallbox_Control_V1 Fehler: ${error.message}`, 'warn');
}
