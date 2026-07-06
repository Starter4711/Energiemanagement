// ioBroker object: script.js.energiemanagement.Config
// name: Config
// engineType: Javascript/js
// enabled: False

'use strict';

const ROOT = '0_userdata.0.Energiemanagement';

const states = [
    [`${ROOT}.Config.Zaehlpunkt_Haus_Leistung_ID`, 'alias.0.EM24 New Grid.Power', 'string', 'state'],
    [`${ROOT}.Config.Zaehlpunkt_Halle_Leistung_ID`, 'alias.0.EM24 Hall Grid.Power', 'string', 'state'],
    [`${ROOT}.Config.Zaehlpunkt_Alte_Wohnung_Leistung_ID`, 'alias.0.EM24 Old Grid.Power Old Grid', 'string', 'state'],
    [`${ROOT}.Config.Vorzeichen_Netzbezug`, 1, 'number', 'value'],
    [`${ROOT}.Config.Aktualisierung_Sekunden`, 10, 'number', 'value'],
    [`${ROOT}.Config.Halle_Max_Netzbezug_W`, 15000, 'number', 'value'],
];

try {
    for (const [id, value, type, role] of states) {
        createState(id, value, {
            name: id.split('.').pop(),
            type,
            role,
            read: true,
            write: true,
        });
    }
    log('Energiemanagement-Konfiguration ist angelegt.', 'info');
} catch (error) {
    log(`Config Fehler: ${error.message}`, 'warn');
}
