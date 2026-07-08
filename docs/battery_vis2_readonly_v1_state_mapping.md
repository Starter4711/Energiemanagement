# Battery VIS2 Read-Only V1 State-Mapping

## Zweck

Diese Datei leitet aus der freigegebenen Spezifikation fuer `Battery VIS2 Read-Only V1` die minimale State-Mapping-Tabelle ab.

Es werden ausschliesslich bestehende EOS-States unter `0_userdata.0.EOS.Battery.*` verwendet.

## Verbindliche Grundsaetze

1. Nur bestehende EOS-States werden gemappt.
2. Keine Rohquellen werden direkt verwendet.
3. Keine VIS2-Implementierung wird hier beschrieben.
4. Nicht sicher belegte Inhalte bleiben `Unklar`.

## Summary

| State-Pfad | Anzeigename | Einheit | Anzeigeart | Status |
| --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Summary.Status` | Gesamtstatus |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Summary.SOC` | Gesamt-SOC | % | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Summary.Voltage` | Gesamtspannung | V | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Summary.Current` | Gesamtstrom | A | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Summary.Power` | Gesamtleistung | W | Zahl | vorhanden |

## Communication

| State-Pfad | Anzeigename | Einheit | Anzeigeart | Status |
| --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Communication.SmartShunt` | SmartShunt |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.SmartShunt.LastUpdate` | SmartShunt letzte Aktualisierung |  | Text | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.SmartShunt.AgeSeconds` | SmartShunt Alter | s | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.SmartShunt.Status` | SmartShunt Kommunikationsstatus |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.Gobel` | Gobel / Pace BMS |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.Gobel.LastUpdate` | Gobel / Pace BMS letzte Aktualisierung |  | Text | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.Gobel.AgeSeconds` | Gobel / Pace BMS Alter | s | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.Gobel.Status` | Gobel / Pace BMS Kommunikationsstatus |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.Heltec` | Heltec |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.Heltec.LastUpdate` | Heltec letzte Aktualisierung |  | Text | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.Heltec.AgeSeconds` | Heltec Alter | s | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.Heltec.Status` | Heltec Kommunikationsstatus |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.MQTT` | MQTT |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.MQTT.LastUpdate` | MQTT letzte Aktualisierung |  | Text | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.MQTT.AgeSeconds` | MQTT Alter | s | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.MQTT.Status` | MQTT Kommunikationsstatus |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Communication.LastUpdate` | Letzte Kommunikationsbewertung |  | Text | vorhanden |

## Warnings

| State-Pfad | Anzeigename | Einheit | Anzeigeart | Status |
| --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Warnings.SmartShuntOffline` | SmartShunt offline |  | Boolean | vorhanden |
| `0_userdata.0.EOS.Battery.Warnings.GobelOffline` | Gobel / Pace BMS offline |  | Boolean | vorhanden |
| `0_userdata.0.EOS.Battery.Warnings.HeltecOffline` | Heltec offline |  | Boolean | vorhanden |
| `0_userdata.0.EOS.Battery.Warnings.MQTTOffline` | MQTT offline |  | Boolean | vorhanden |

## Health

| State-Pfad | Anzeigename | Einheit | Anzeigeart | Status |
| --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Health.Status` | Health-Status |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Health.Score` | Health-Score | % | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Health.LastUpdate` | Health letzte Bewertung |  | Text | vorhanden |
| `0_userdata.0.EOS.Battery.Health.Reasons` | Health Begruendungen |  | Liste | vorhanden |

## SmartShunt-Grundwerte

| State-Pfad | Anzeigename | Einheit | Anzeigeart | Status |
| --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.SmartShunt.SOC` | SmartShunt SOC | % | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.SmartShunt.Voltage` | SmartShunt Spannung | V | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.SmartShunt.Current` | SmartShunt Strom | A | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.SmartShunt.Power` | SmartShunt Leistung | W | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.SmartShunt.ConsumedAh` | SmartShunt Verbrauchte Ah | Ah | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.SmartShunt.DischargedEnergy` | SmartShunt Entladeenergie | Wh | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.SmartShunt.ChargedEnergy` | SmartShunt Ladeenergie | Wh | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.SmartShunt.TimeToGo` | SmartShunt Restlaufzeit | min | Zahl | vorhanden |

## Pack-Grundwerte

### Pack1

| State-Pfad | Anzeigename | Einheit | Anzeigeart | Status |
| --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Status` | Pack 1 Status |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Voltage` | Pack 1 Spannung | V | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Current` | Pack 1 Strom | A | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Power` | Pack 1 Leistung | W | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack1.TemperatureMax` | Pack 1 maximale Temperatur | °C | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack1.VDiff` | Pack 1 Spannungsdifferenz | mV | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Balancing` | Pack 1 Balancing |  | Boolean | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Communication` | Pack 1 Kommunikation |  | Status | vorhanden |

### Pack2

| State-Pfad | Anzeigename | Einheit | Anzeigeart | Status |
| --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Status` | Pack 2 Status |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Voltage` | Pack 2 Spannung | V | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Current` | Pack 2 Strom | A | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Power` | Pack 2 Leistung | W | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack2.TemperatureMax` | Pack 2 maximale Temperatur | °C | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack2.VDiff` | Pack 2 Spannungsdifferenz | mV | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Balancing` | Pack 2 Balancing |  | Boolean | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Communication` | Pack 2 Kommunikation |  | Status | vorhanden |

### Pack3

| State-Pfad | Anzeigename | Einheit | Anzeigeart | Status |
| --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Status` | Pack 3 Status |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Voltage` | Pack 3 Spannung | V | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Current` | Pack 3 Strom | A | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Power` | Pack 3 Leistung | W | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack3.TemperatureMax` | Pack 3 maximale Temperatur | °C | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack3.VDiff` | Pack 3 Spannungsdifferenz | mV | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Balancing` | Pack 3 Balancing |  | Boolean | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Communication` | Pack 3 Kommunikation |  | Status | vorhanden |

### Pack4

| State-Pfad | Anzeigename | Einheit | Anzeigeart | Status |
| --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Status` | Pack 4 Status |  | Status | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Voltage` | Pack 4 Spannung | V | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Current` | Pack 4 Strom | A | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Power` | Pack 4 Leistung | W | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack4.TemperatureMax` | Pack 4 maximale Temperatur | °C | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack4.VDiff` | Pack 4 Spannungsdifferenz | mV | Zahl | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Balancing` | Pack 4 Balancing |  | Boolean | vorhanden |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Communication` | Pack 4 Kommunikation |  | Status | vorhanden |

## Unklar

- Unklar, ob `Summary.Status` in der späteren VIS2-Ansicht eine eigene Farblogik erhält oder nur als Text erscheint.
- Unklar, ob `Communication.LastUpdate` sichtbar oder nur im Detailbereich genutzt werden soll.
- Unklar, ob `Health.Reasons` in der Ansicht als kommagetrennte Liste oder als mehrzeilige Liste dargestellt wird.

