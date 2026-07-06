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
    [`${ROOT}.Config.PV_Fronius_Haus_10kW_Leistung_ID`, 'alias.0.Fronius.AC-Power_10kW', 'string', 'state'],
    [`${ROOT}.Config.PV_Fronius_Halle_27kW_Leistung_ID`, 'alias.0.Fronius.AC-Power', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Gesamt_SOC_ID`, 'alias.0.Gobel.SOC', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Gesamt_Spannung_ID`, 'alias.0.Gobel.Voltage', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Gesamt_Strom_ID`, 'alias.0.Gobel.Current', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Gesamt_Leistung_ID`, 'alias.0.Gobel.Power', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Pack1_SOC_ID`, 'alias.0.Gobel_Master.SOC', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Pack2_SOC_ID`, 'alias.0.Gobel_Slave1.SOC', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Pack3_SOC_ID`, 'alias.0.Gobel_Slave2.SOC', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Pack4_SOC_ID`, 'alias.0.Gobel_Slave3.SOC', 'string', 'state'],
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
