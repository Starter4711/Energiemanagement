// ioBroker object: script.js.energiemanagement.Bilanz_Zaehlpunkte
// name: Bilanz_Zaehlpunkte
// engineType: Javascript/js
// enabled: True

'use strict';

const ROOT = '0_userdata.0.EOS';
const CONFIG = `${ROOT}.Config`;
const OUTPUT = `${ROOT}.Bilanz`;

const meters = [
    ['Haus', `${CONFIG}.Zaehlpunkt_Haus_Leistung_ID`],
    ['Halle', `${CONFIG}.Zaehlpunkt_Halle_Leistung_ID`],
    ['Alte_Wohnung', `${CONFIG}.Zaehlpunkt_Alte_Wohnung_Leistung_ID`],
];

function createOutputStates() {
    for (const [name] of meters) {
        createState(`${OUTPUT}.${name}_W`, 0, {
            name: `${name} Netzleistung`,
            type: 'number',
            role: 'value.power',
            unit: 'W',
            read: true,
            write: false,
        });
    }
    createState(`${OUTPUT}.Summe_W`, 0, {
        name: 'Saldierte Netzleistung',
        type: 'number',
        role: 'value.power',
        unit: 'W',
        read: true,
        write: false,
    });
    createState(`${OUTPUT}.Gueltig`, false, {
        name: 'Bilanz vollständig und gültig',
        type: 'boolean',
        role: 'indicator',
        read: true,
        write: false,
    });
    createState(`${OUTPUT}.Letzte_Aktualisierung`, '', {
        name: 'Letzte Aktualisierung',
        type: 'string',
        role: 'date',
        read: true,
        write: false,
    });
    createState(`${OUTPUT}.Fehler`, '', {
        name: 'Letzter Bilanzfehler',
        type: 'string',
        role: 'text',
        read: true,
        write: false,
    });
}

function readNumber(id) {
    const state = getState(id);
    if (!state || state.val === null || state.val === '' || !Number.isFinite(Number(state.val))) {
        throw new Error(`Kein gültiger Zahlenwert: ${id}`);
    }
    return Number(state.val);
}

function updateBalance() {
    try {
        const sign = readNumber(`${CONFIG}.Vorzeichen_Netzbezug`);
        let total = 0;

        for (const [name, configId] of meters) {
            const configuredIdState = getState(configId);
            const sourceId = configuredIdState && String(configuredIdState.val || '').trim();
            if (!sourceId || !sourceId.startsWith('alias.0.')) {
                throw new Error(`Alias-ID fehlt oder ist ungültig: ${configId}`);
            }

            const power = readNumber(sourceId) * sign;
            total += power;
            setState(`${OUTPUT}.${name}_W`, Math.round(power), true);
        }

        setState(`${OUTPUT}.Summe_W`, Math.round(total), true);
        setState(`${OUTPUT}.Gueltig`, true, true);
        setState(`${OUTPUT}.Letzte_Aktualisierung`, new Date().toISOString(), true);
        setState(`${OUTPUT}.Fehler`, '', true);
    } catch (error) {
        setState(`${OUTPUT}.Gueltig`, false, true);
        setState(`${OUTPUT}.Fehler`, error.message, true);
        log(`Bilanz_Zaehlpunkte Fehler: ${error.message}`, 'warn');
    }
}

try {
    createOutputStates();
    updateBalance();

    const configuredInterval = getState(`${CONFIG}.Aktualisierung_Sekunden`);
    const seconds = Math.max(5, Number(configuredInterval && configuredInterval.val) || 10);
    schedule(`*/${seconds} * * * * *`, updateBalance);

    log(`Zählpunktbilanz ist gestartet (Intervall ${seconds} s).`, 'info');
} catch (error) {
    log(`Bilanz_Zaehlpunkte Startfehler: ${error.message}`, 'warn');
}
