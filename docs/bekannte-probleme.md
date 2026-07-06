# Bekannte Probleme im Altbestand

## Gobel Vergleich BMS / HELTEC

Das bestehende, aktive Common-Skript `script.js.common.Gobel_Vergleich_BMS_Heltec` behandelt `HELTEC_1` bis `HELTEC_4` als Pack 1 bis Pack 4. Beim Lesen der Pace-BMS-Zellspannung verwendet es jedoch fuer alle Packs fest den Pfad `modbus.1.holdingRegisters.1`.

Dadurch werden die HELTEC-Werte von Pack 2 bis Pack 4 vermutlich gegen die Modbuswerte von Pack 1 verglichen. Das bestehende Skript bleibt gemaess Projektvorgabe unveraendert. Das neue Modul `script.js.energiemanagement.Batterie_Pack_Überwachung` muss Pack 1 bis 4 korrekt auf `holdingRegisters.1` bis `.4` abbilden und eigene Diagnosewerte verwenden.
