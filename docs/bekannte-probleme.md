# Bekannte Probleme im Altbestand

## Gobel Vergleich BMS / HELTEC

Das inzwischen deaktivierte Common-Skript `script.js.common.Gobel_Vergleich_BMS_Heltec` behandelt `HELTEC_1` bis `HELTEC_4` als Pack 1 bis Pack 4. Beim Lesen der Pace-BMS-Zellspannung verwendet es jedoch fuer alle Packs fest den Pfad `modbus.1.holdingRegisters.1`.

Dadurch wurden die HELTEC-Werte von Pack 2 bis Pack 4 vermutlich gegen die Modbuswerte von Pack 1 verglichen. Das bestehende Skript blieb inhaltlich unveraendert und wurde nach erfolgreichem Live-Test des korrigierten Ersatzskripts deaktiviert. `script.js.energiemanagement.Batterie_BMS_Heltec_Vergleich` ordnet Pack 1 bis 4 korrekt `holdingRegisters.1` bis `.4` zu.
