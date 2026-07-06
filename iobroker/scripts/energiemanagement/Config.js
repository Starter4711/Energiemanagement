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
    [`${ROOT}.Config.PV_SMA_Haus_4_7kW_Leistung_ID`, 'alias.0.SMA.Power', 'string', 'state'],
    [`${ROOT}.Config.PV_Fronius_Halle_27kW_Leistung_ID`, 'alias.0.Fronius.AC-Power', 'string', 'state'],
    [`${ROOT}.Config.PV_SolarEdge_Alte_Wohnung_Leistung_ID`, 'alias.0.SE.Power', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Gesamt_SOC_ID`, 'alias.0.Gobel.Soc SmartShunt', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Gesamt_Spannung_ID`, 'alias.0.Gobel.Voltage_SmartShunt', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Gesamt_Strom_ID`, 'alias.0.Gobel.Current', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Gesamt_Leistung_ID`, 'alias.0.Gobel.Power', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Pack1_SOC_ID`, 'alias.0.Gobel_Master.SOC', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Pack2_SOC_ID`, 'alias.0.Gobel_Slave1.SOC', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Pack3_SOC_ID`, 'alias.0.Gobel_Slave2.SOC', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Pack4_SOC_ID`, 'alias.0.Gobel_Slave3.SOC', 'string', 'state'],
    [`${ROOT}.Config.Batterie_Zellspreizung_Alarm_mV`, 50, 'number', 'value'],
    [`${ROOT}.Config.Batterie_BMS_Heltec_Alarm_mV`, 50, 'number', 'value'],
    [`${ROOT}.Config.Batterie_Zelldaten_Max_Alter_Sekunden`, 300, 'number', 'value'],
    [`${ROOT}.Config.Victron_BAT_DC_Leistung_ID`, 'alias.0.MP-BAT.DC-Power', 'string', 'state'],
    [`${ROOT}.Config.Victron_BAT_DC_Strom_ID`, 'alias.0.MP-BAT.DC-Current', 'string', 'state'],
    [`${ROOT}.Config.Victron_BAT_DC_Spannung_ID`, 'alias.0.MP-BAT.DC-Voltage', 'string', 'state'],
    [`${ROOT}.Config.Victron_BAT_ActiveSocLimit_ID`, 'alias.0.MP-BAT.BAT_ActiveSocLimit', 'string', 'state'],
    [`${ROOT}.Config.Victron_BAT_Verbrauch_L1_ID`, 'alias.0.MP-BAT.BAT_Consumption_L1', 'string', 'state'],
    [`${ROOT}.Config.Victron_BAT_Verbrauch_L2_ID`, 'alias.0.MP-BAT.BAT_Consumption_L2', 'string', 'state'],
    [`${ROOT}.Config.Victron_BAT_Verbrauch_L3_ID`, 'alias.0.MP-BAT.BAT_Consumption_L3', 'string', 'state'],
    [`${ROOT}.Config.Victron_ESS_DC_Leistung_ID`, 'alias.0.MP-ESS.DC-Power', 'string', 'state'],
    [`${ROOT}.Config.Victron_ESS_DC_Strom_ID`, 'alias.0.MP-ESS.DC-Current', 'string', 'state'],
    [`${ROOT}.Config.Victron_ESS_DC_Spannung_ID`, 'alias.0.MP-ESS.DC-Voltage', 'string', 'state'],
    [`${ROOT}.Config.Victron_ESS_Verbrauch_L1_ID`, 'alias.0.MP-ESS.ESS_Consumption_L1', 'string', 'state'],
    [`${ROOT}.Config.Victron_ESS_Verbrauch_L2_ID`, 'alias.0.MP-ESS.ESS_Consumption_L2', 'string', 'state'],
    [`${ROOT}.Config.Victron_ESS_Verbrauch_L3_ID`, 'alias.0.MP-ESS.ESS_Consumption_L3', 'string', 'state'],
    [`${ROOT}.Config.RS450_DC_Strom_ID`, 'alias.0.MPPT RS450/100.DC-Current', 'string', 'state'],
    [`${ROOT}.Config.RS450_DC_Spannung_ID`, 'alias.0.MPPT RS450/100.DC-Voltage', 'string', 'state'],
    [`${ROOT}.Config.RS450_PV_String1_Leistung_ID`, 'alias.0.MPPT RS450/100.P String1', 'string', 'state'],
    [`${ROOT}.Config.RS450_PV_String2_Leistung_ID`, 'alias.0.MPPT RS450/100.P String2', 'string', 'state'],
    [`${ROOT}.Config.Wallbox1_V3_Leistung_ID`, 'alias.0.go-E.powerV3', 'string', 'state'],
    [`${ROOT}.Config.Wallbox2_V4_Leistung_ID`, 'alias.0.go-E.powerV4', 'string', 'state'],
    [`${ROOT}.Config.Wallbox3_Halle_Leistung_ID`, 'alias.0.go-E.go-E-V4-Halle', 'string', 'state'],
    [`${ROOT}.Config.Wallbox1_Ladefreigabe_ID`, '', 'string', 'state'],
    [`${ROOT}.Config.Wallbox1_Ladestrom_PV_ID`, '', 'string', 'state'],
    [`${ROOT}.Config.Wallbox1_HTTP_Basis_URL`, 'http://192.168.11.20', 'string', 'state'],
    [`${ROOT}.Config.Wallbox2_Ladefreigabe_ID`, '', 'string', 'state'],
    [`${ROOT}.Config.Wallbox2_Ladestrom_PV_ID`, '', 'string', 'state'],
    [`${ROOT}.Config.Wallbox2_HTTP_Basis_URL`, 'http://192.168.11.21', 'string', 'state'],
    [`${ROOT}.Config.Hallenabgang_40A_L1_Strom_ID`, 'alias.0.EM24 Hall 40A.L1_A', 'string', 'state'],
    [`${ROOT}.Config.Hallenabgang_40A_L2_Strom_ID`, 'alias.0.EM24 Hall 40A.L2_A', 'string', 'state'],
    [`${ROOT}.Config.Hallenabgang_40A_L3_Strom_ID`, 'alias.0.EM24 Hall 40A.L3_A', 'string', 'state'],
    [`${ROOT}.Config.Hallenabgang_40A_Leistung_ID`, 'alias.0.EM24 Hall 40A.Power Hall 40A', 'string', 'state'],
    [`${ROOT}.Config.Hallenabgang_Max_Strom_A`, 40, 'number', 'value'],
    [`${ROOT}.Config.Hausanschluss_L1_Strom_ID`, '', 'string', 'state'],
    [`${ROOT}.Config.Hausanschluss_L2_Strom_ID`, '', 'string', 'state'],
    [`${ROOT}.Config.Hausanschluss_L3_Strom_ID`, '', 'string', 'state'],
    [`${ROOT}.Config.Hausanschluss_Max_Strom_A`, 40, 'number', 'value'],
    [`${ROOT}.Config.Halle_Max_Netzeinspeisung_W`, 27000, 'number', 'value'],
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
