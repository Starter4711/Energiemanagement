// ioBroker object: script.js.energiemanagement.Debug
// name: Debug
// engineType: Javascript/js
// enabled: True

'use strict';

const ROOT = '0_userdata.0.EOS.Debug';

try {
    createState(`${ROOT}.Aktiv`, true, {
        name: 'Debug-Ausgaben aktiv',
        type: 'boolean',
        role: 'switch.enable',
        read: true,
        write: true,
    });
    createState(`${ROOT}.Letzter_Heartbeat`, '', {
        name: 'Letzter Heartbeat',
        type: 'string',
        role: 'date',
        read: true,
        write: false,
    });
    createState(`${ROOT}.Letzte_Meldung`, '', {
        name: 'Letzte Meldung',
        type: 'string',
        role: 'text',
        read: true,
        write: false,
    });

    schedule('*/1 * * * *', () => {
        try {
            const timestamp = new Date().toISOString();
            setState(`${ROOT}.Letzter_Heartbeat`, timestamp, true);
            setState(`${ROOT}.Letzte_Meldung`, 'Debug-Skript arbeitet normal.', true);
        } catch (error) {
            log(`Debug Heartbeat Fehler: ${error.message}`, 'warn');
        }
    });

    log('EOS-Debug ist gestartet.', 'info');
} catch (error) {
    log(`Debug Fehler: ${error.message}`, 'warn');
}
