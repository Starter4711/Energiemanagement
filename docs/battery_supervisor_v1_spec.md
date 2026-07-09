# Battery Supervisor V1

## Status

Freigegeben als fachliches Modul von Battery Monitoring V1.

Diese Spezifikation beschreibt das Soll-Verhalten des Moduls und den technischen Implementierungsvertrag für Codex. Die JavaScript-Implementierung darf sich ändern, solange die hier definierte Funktion, die Eingänge und die Ausgänge erfüllt bleiben.

## Zweck

Battery Supervisor V1 ist die zentrale Datendrehscheibe für den Batteriebereich.

Das Modul sammelt relevante Batteriedaten aus den vorhandenen technischen Quellen, vereinheitlicht sie und stellt sie als stabile EOS-States unter `0_userdata.0.EOS.Battery.*` bereit.

Nachgelagerte Module wie Battery Health, Battery Status View, Energy Flow und VIS2 sollen nicht direkt auf Rohquellen wie Alias-, MQTT-, Modbus- oder Adapterpfade zugreifen müssen. Sie lesen ausschließlich die vom Battery Supervisor bereitgestellten EOS-States.

## Verantwortung

Battery Supervisor V1 ist verantwortlich für:

- Bereitstellung einer stabilen, hardwareunabhängigen Batterieschnittstelle
- Übernahme der wichtigsten SmartShunt-Werte
- Übernahme packbezogener Werte aus Gobel/Pace und Heltec
- Bewertung der Kommunikationsaktualität je Quelle
- Veröffentlichung von Kommunikationswarnungen
- Bereitstellung von Settings für Kommunikations-Timeouts

Battery Supervisor V1 ist nicht verantwortlich für:

- Steuerung von Victron, Cerbo, ESS, Wallbox oder anderen Aktoren
- Lade-/Entladeentscheidungen
- Empfehlungen
- Health-Bewertung
- VIS2-Darstellung
- Historie, Statistik oder Langzeittrends

## ioBroker-Script

| Eigenschaft | Wert |
|---|---|
| Scriptdatei | `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js` |
| Script-ID | `script.js.energiemanagement.Battery_Supervisor_V1` |
| Objektdatei | `iobroker/objects/energiemanagement.Battery_Supervisor_V1.json` |
| Manifest-Eintrag | `iobroker/manifest.json` |
| Engine | `Javascript/js` |
| Standardzustand | `enabled: false` |
| Root-Ausgabe | `0_userdata.0.EOS.Battery` |

## Datenfluss

```text
SmartShunt / Gobel-Pace / Heltec / MQTT
        │
        ▼
Battery Supervisor V1
        │
        ▼
0_userdata.0.EOS.Battery.*
        │
        ├── Battery Health V1
        ├── Battery Status View V1
        ├── Energy Flow V1
        └── VIS2 Battery
```

## Eingänge

Die folgenden Eingänge sind der technische Vertrag für Codex. Wenn sich reale ioBroker-Pfade im System ändern, muss diese Tabelle zuerst angepasst werden.

### SmartShunt / Gesamtbatterie

| Information | Eingangspfad | Datentyp | Einheit | Ziel im EOS |
|---|---|---:|---|---|
| SOC | `alias.0.Gobel.Soc SmartShunt` | number | % | `Summary.SOC`, `SmartShunt.SOC` |
| Spannung | `alias.0.Gobel.Voltage_SmartShunt` | number | V | `Summary.Voltage`, `SmartShunt.Voltage` |
| Strom | `alias.0.Gobel.Current` | number | A | `Summary.Current`, `SmartShunt.Current` |
| Leistung | `alias.0.Gobel.Power` | number | W | `Summary.Power`, `SmartShunt.Power` |
| Entnommene Ah | `alias.0.Gobel.ConsumedAh` | number | Ah | `SmartShunt.ConsumedAh` |
| Entladene Energie | `alias.0.Gobel.DischargedEnergy` | number | Wh | `SmartShunt.DischargedEnergy` |
| Geladene Energie | `alias.0.Gobel.ChargedEnergy` | number | Wh | `SmartShunt.ChargedEnergy` |
| Restzeit | `alias.0.Gobel.TimeToGo` | number | min | `SmartShunt.TimeToGo` |

### Gobel / Pace BMS pro Pack

Es gibt vier Batteriepacks. Pack 1 ist `Gobel_Master`, Pack 2 bis 4 sind `Gobel_Slave1` bis `Gobel_Slave3`.

| Pack | Strom-Eingang | Temperatur-Eingang | EOS-Ziel |
|---:|---|---|---|
| 1 | `alias.0.Gobel_Master.Ampere` | `alias.0.Gobel_Master.Gobel_Master_Tmp` | `Packs.Pack1.*` |
| 2 | `alias.0.Gobel_Slave1.Ampere` | `alias.0.Gobel_Slave1.Gobel_Slave1_Tmp` | `Packs.Pack2.*` |
| 3 | `alias.0.Gobel_Slave2.Ampere` | `alias.0.Gobel_Slave2.Gobel_Slave2_Tmp` | `Packs.Pack3.*` |
| 4 | `alias.0.Gobel_Slave3.Ampere` | `alias.0.Gobel_Slave3.Gobel_Slave3_Tmp` | `Packs.Pack4.*` |

Für die Kommunikationsbewertung von Gobel/Pace werden zusätzlich die folgenden SOC-Pfade verwendet:

- `alias.0.Gobel_Master.SOC`
- `alias.0.Gobel_Slave1.SOC`
- `alias.0.Gobel_Slave2.SOC`
- `alias.0.Gobel_Slave3.SOC`

### Heltec / Zellinformationen pro Pack

| Pack | Eingangspfad | Erwartetes Format | EOS-Ziel |
|---:|---|---|---|
| 1 | `mqtt.0.HELTEC_1.data` | JSON mit `cells[]` | `Packs.Pack1.Voltage`, `Packs.Pack1.VDiff` |
| 2 | `mqtt.0.HELTEC_2.data` | JSON mit `cells[]` | `Packs.Pack2.Voltage`, `Packs.Pack2.VDiff` |
| 3 | `mqtt.0.HELTEC_3.data` | JSON mit `cells[]` | `Packs.Pack3.Voltage`, `Packs.Pack3.VDiff` |
| 4 | `mqtt.0.HELTEC_4.data` | JSON mit `cells[]` | `Packs.Pack4.Voltage`, `Packs.Pack4.VDiff` |

Erwartetes Heltec-JSON:

```json
{
  "cells": [
    { "cell": 1, "voltage": 3.321 },
    { "cell": 2, "voltage": 3.319 }
  ]
}
```

Das Script berechnet daraus:

- Packspannung als Summe der Zellspannungen
- `VDiff` in mV als Differenz zwischen höchster und niedrigster Zellspannung

### MQTT-Kommunikation

| Information | Eingangspfad |
|---|---|
| MQTT-Verbindung | `mqtt.0.info.connection` |
| MQTT-Verbindung alternativ | `mqtt.0.info.connection.state` |

## Ausgänge

Alle Ausgänge werden unter `0_userdata.0.EOS.Battery.*` angelegt. Berechnete States sind `read: true`, `write: false`. Nur die Settings-States sind beschreibbar.

### Summary

| State | Typ | Einheit | Quelle/Logik | Bedeutung |
|---|---:|---|---|---|
| `0_userdata.0.EOS.Battery.Summary.Status` | string | - | Supervisor | Gesamtstatus, initial `unknown` |
| `0_userdata.0.EOS.Battery.Summary.SOC` | number | % | SmartShunt | Gesamt-SOC |
| `0_userdata.0.EOS.Battery.Summary.Voltage` | number | V | SmartShunt | Batteriespannung |
| `0_userdata.0.EOS.Battery.Summary.Current` | number | A | SmartShunt | Batteriestrom |
| `0_userdata.0.EOS.Battery.Summary.Power` | number | W | SmartShunt | Batterieleistung |

### SmartShunt

| State | Typ | Einheit | Quelle |
|---|---:|---|---|
| `0_userdata.0.EOS.Battery.SmartShunt.SOC` | number | % | `alias.0.Gobel.Soc SmartShunt` |
| `0_userdata.0.EOS.Battery.SmartShunt.Voltage` | number | V | `alias.0.Gobel.Voltage_SmartShunt` |
| `0_userdata.0.EOS.Battery.SmartShunt.Current` | number | A | `alias.0.Gobel.Current` |
| `0_userdata.0.EOS.Battery.SmartShunt.Power` | number | W | `alias.0.Gobel.Power` |
| `0_userdata.0.EOS.Battery.SmartShunt.ConsumedAh` | number | Ah | `alias.0.Gobel.ConsumedAh` |
| `0_userdata.0.EOS.Battery.SmartShunt.DischargedEnergy` | number | Wh | `alias.0.Gobel.DischargedEnergy` |
| `0_userdata.0.EOS.Battery.SmartShunt.ChargedEnergy` | number | Wh | `alias.0.Gobel.ChargedEnergy` |
| `0_userdata.0.EOS.Battery.SmartShunt.TimeToGo` | number | min | `alias.0.Gobel.TimeToGo` |

### Packs

Für jedes Pack `Pack1` bis `Pack4` werden diese States angelegt:

| State-Muster | Typ | Einheit | Quelle/Logik |
|---|---:|---|---|
| `0_userdata.0.EOS.Battery.Packs.PackX.Status` | string | - | reservierter Packstatus, initial `unknown` |
| `0_userdata.0.EOS.Battery.Packs.PackX.Voltage` | number | V | Heltec-Zellspannungssumme |
| `0_userdata.0.EOS.Battery.Packs.PackX.Current` | number | A | Gobel/Pace Packstrom |
| `0_userdata.0.EOS.Battery.Packs.PackX.Power` | number | W | reserviert, initial `0` |
| `0_userdata.0.EOS.Battery.Packs.PackX.TemperatureMax` | number | °C | Gobel/Pace Temperatur |
| `0_userdata.0.EOS.Battery.Packs.PackX.VDiff` | number | mV | Heltec max-min Zellspannung |
| `0_userdata.0.EOS.Battery.Packs.PackX.Balancing` | boolean | - | reserviert, initial `false` |
| `0_userdata.0.EOS.Battery.Packs.PackX.Communication` | string | - | reserviert, initial `unknown` |

### Communication

Für jede Quelle `SmartShunt`, `Gobel`, `Heltec`, `MQTT` werden diese States angelegt:

| State-Muster | Typ | Einheit | Bedeutung |
|---|---:|---|---|
| `0_userdata.0.EOS.Battery.Communication.<Quelle>` | string | - | Kurzstatus der Quelle |
| `0_userdata.0.EOS.Battery.Communication.<Quelle>.LastUpdate` | string | ISO-8601 | letzter erkannter Zeitstempel |
| `0_userdata.0.EOS.Battery.Communication.<Quelle>.AgeSeconds` | number | s | Alter der letzten Aktualisierung |
| `0_userdata.0.EOS.Battery.Communication.<Quelle>.Status` | string | - | `OK`, `WARN`, `OFFLINE`, `UNKNOWN` |

Zusätzlich:

| State | Typ | Einheit | Bedeutung |
|---|---:|---|---|
| `0_userdata.0.EOS.Battery.Communication.LastUpdate` | string | ISO-8601 | letzter erkannter Zeitstempel über alle Quellen |

### Warnings

| State | Typ | Bedeutung |
|---|---:|---|
| `0_userdata.0.EOS.Battery.Warnings.SmartShuntOffline` | boolean | SmartShunt-Kommunikation ist `OFFLINE` |
| `0_userdata.0.EOS.Battery.Warnings.GobelOffline` | boolean | Gobel/Pace-Kommunikation ist `OFFLINE` |
| `0_userdata.0.EOS.Battery.Warnings.HeltecOffline` | boolean | Heltec-Kommunikation ist `OFFLINE` |
| `0_userdata.0.EOS.Battery.Warnings.MQTTOffline` | boolean | MQTT-Kommunikation ist `OFFLINE` |

### Settings

| State | Typ | Einheit | Schreibbar | Standard | Bedeutung |
|---|---:|---|---:|---:|---|
| `0_userdata.0.EOS.Battery.Settings.CommunicationWarningTimeout_s` | number | s | ja | 120 | ab diesem Alter wird Kommunikation `WARN` |
| `0_userdata.0.EOS.Battery.Settings.CommunicationOfflineTimeout_s` | number | s | ja | 300 | ab diesem Alter wird Kommunikation `OFFLINE` |

## Kommunikationslogik

Für jede Quelle wird der jüngste Zeitstempel der definierten Eingangs-States gelesen.

| Bedingung | Status |
|---|---|
| kein gültiger Zeitstempel | `UNKNOWN` |
| Alter <= `CommunicationWarningTimeout_s` | `OK` |
| Alter <= `CommunicationOfflineTimeout_s` | `WARN` |
| Alter > `CommunicationOfflineTimeout_s` | `OFFLINE` |

Bei MQTT gilt zusätzlich: Wenn `mqtt.0.info.connection` oder `mqtt.0.info.connection.state` den Wert `false` liefert, ist MQTT `OFFLINE`.

## Update-Verhalten

- Beim Scriptstart werden alle definierten States angelegt.
- Beim Scriptstart wird einmal aktualisiert.
- Danach läuft eine zyklische Aktualisierung alle 30 Sekunden.
- Es wird nur geschrieben, wenn sich ein Wert geändert hat (`writeChanged`).
- Fehlende Eingänge führen nicht zu einem Scriptfehler.
- Fehlende numerische Werte bleiben unverändert oder auf Initialwert, bis gültige Werte eintreffen.

## VIS2-Nutzung

Battery Supervisor V1 erzeugt keine VIS2-Ansicht. VIS2 darf aber diese Supervisor-States anzeigen.

Für die Hauptübersicht sind mindestens geeignet:

- `Summary.Status`
- `Summary.SOC`
- `Summary.Power`
- `Summary.Voltage`
- `Summary.Current`
- `Communication.SmartShunt.Status`
- `Communication.Gobel.Status`
- `Communication.Heltec.Status`
- `Communication.MQTT.Status`
- `Warnings.*Offline`

Detaillierte Health-Bewertung und Gesamtampel gehören nicht in den Supervisor, sondern in Battery Health bzw. Battery Status View.

## Abnahmekriterien für Codex

Codex muss bei Änderungen am Battery Supervisor prüfen:

1. `Battery_Supervisor_V1.js` existiert und ist syntaktisch gültig.
2. `energiemanagement.Battery_Supervisor_V1.json` existiert und enthält das Scriptobjekt `script.js.energiemanagement.Battery_Supervisor_V1`.
3. `iobroker/manifest.json` enthält einen passenden Eintrag mit `objectFile` und `scriptFile`.
4. Alle in dieser Spezifikation genannten Ausgangs-States werden beim Scriptstart angelegt.
5. Alle berechneten States sind read-only.
6. Nur die beiden Communication-Settings sind beschreibbar.
7. Es gibt keine Steuerung, keine Empfehlung, keine Aktorik und keine VIS2-Logik im Script.
8. Es werden keine Health-, Recommendation-, Statistics- oder Historian-States durch den Supervisor erzeugt.
9. Fehlende Eingangs-States führen nicht zum Scriptabbruch.
10. Die Kommunikationszustände werden beim Start und danach zyklisch aktualisiert.

## Offene fachliche Prüfpunkte

Diese Punkte müssen fachlich im realen ioBroker kontrolliert werden:

- Sind alle Alias-Pfade für SmartShunt korrekt und dauerhaft stabil?
- Sind die Gobel/Pace-Pfade für alle vier Packs korrekt?
- Liefert `mqtt.0.HELTEC_X.data` tatsächlich das dokumentierte JSON-Format?
- Soll `Summary.Status` im Supervisor gesetzt werden oder erst durch Battery Status View?
- Soll Pack `Power` aus Spannung und Strom berechnet werden oder reserviert bleiben?
- Soll `PackX.Communication` aktiv gesetzt werden oder weiterhin reserviert bleiben?
