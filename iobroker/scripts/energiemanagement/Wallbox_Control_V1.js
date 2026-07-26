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
        phasesSource: 'go-e.0.phases',
        name: 'Wallbox 1 Freigabe',
    },
    {
        key: 'Wallbox2_Freigabe',
        source: 'go-e.1.allow_charging',
        phasesSource: 'go-e.1.phases',
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

function phaseLabel(value) {
    const code = String(value ?? '').trim();
    if (code === '57') return '1P';
    if (code === '63') return '3P Auto laden';
    if (code === '56') return 'kein Auto';
    return code || 'unbekannt';
}

try {
    for (const item of WALLBOXES) {
        item.id = `${ROOT}.${item.key}`;
        item.phaseId = `${ROOT}.${item.key.replace('_Freigabe', '')}_PhasenText`;
        createBoolState(item.id, item.name);
        createState(item.phaseId, 'unbekannt', {
            name: `${item.name} Phasenanzeige`,
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        });

        const current = getState(item.source);
        if (current) {
            setState(item.id, toBool(current.val), true);
        }

        const phaseCurrent = getState(item.phasesSource);
        if (phaseCurrent) {
            setState(item.phaseId, phaseLabel(phaseCurrent.val), true);
        }

        on({ id: item.id, change: 'ne' }, obj => {
            const nextValue = toBool(obj.state.val);
            setState(item.source, toNumber01(nextValue), false);
        });

        if (existsState(item.source)) {
            on({ id: item.source, change: 'ne' }, () => syncFromSource(item));
        }

        if (existsState(item.phasesSource)) {
            on({ id: item.phasesSource, change: 'ne' }, obj => {
                setState(item.phaseId, phaseLabel(obj.state.val), true);
            });
        }
    }

    emit('info', 'Wallbox_Control_V1 aktiv.');
} catch (error) {
    log(`Wallbox_Control_V1 Fehler: ${error.message}`, 'warn');
}
