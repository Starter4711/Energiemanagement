# Battery Supervisor V1 – State Model

## 1. Zweck

Dieses Dokument ist der technische Implementierungsvertrag für den Battery Supervisor V1.

Es definiert:

- welche echten ioBroker-Quellen gelesen werden,
- welche EOS-States erzeugt werden,
- Datentypen und Einheiten,
- Aktualisierung und Fehlerverhalten,
- welche States von Health, Energy Flow und VIS2 genutzt werden.

Der Supervisor verwendet bevorzugt die echten MQTT-/Modbus-Quellen. Bestehende Alias-Objekte sind nur Referenz und nicht die führende Datenquelle.

---

## 2. Script

| Eigenschaft | Wert |
|---|---|
| Scriptdatei | `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js` |
| ioBroker Script-ID | `script.js.energiemanagement.Battery_Supervisor_V1` |
| Objektdatei | `iobroker/objects/energiemanagement.Battery_Supervisor_V1.json` |
| EOS-Root | `0_userdata.0.EOS.Battery` |
| Betriebsart | read-only Datenkonsolidierung |
| Aktualisierung | ereignisgetrieben plus 30-Sekunden-Kommunikationsprüfung |

---

## 3. Verbindliche Originalquellen

### 3.1 SmartShunt am Cerbo ESS

Portal-ID: `c0619ab336ed`  
MQTT-Instanz: `mqtt.1`  
Victron-Batterieservice: `battery.279`

| Information | Originalobjekt | Typ | Einheit | Auswertung |
|---|---|---:|---:|---|
| SOC | `mqtt.1.N.c0619ab336ed.battery.279.Soc` | JSON/String | % | `JSON.parse(value).value` |
| Spannung | `mqtt.1.N.c0619ab336ed.battery.279.Dc.0.Voltage` | JSON/String | V | `JSON.parse(value).value` |
| Strom | `mqtt.1.N.c0619ab336ed.battery.279.Dc.0.Current` | JSON/String | A | `JSON.parse(value).value` |
| Leistung | `mqtt.1.N.c0619ab336ed.battery.279.Dc.0.Power` | JSON/String | W | `JSON.parse(value).value` |
| Verbrauchte Ah | `mqtt.1.N.c0619ab336ed.battery.279.ConsumedAmphours` | JSON/String | Ah | `JSON.parse(value).value` |
| Geladene Energie | `mqtt.1.N.c0619ab336ed.battery.279.History.ChargedEnergy` | JSON/String | kWh laut Victron-Quelle | `JSON.parse(value).value` |
| Entladene Energie | `mqtt.1.N.c0619ab336ed.battery.279.History.DischargedEnergy` | JSON/String | kWh laut Victron-Quelle | `JSON.parse(value).value` |
| Restlaufzeit | `mqtt.1.N.c0619ab336ed.battery.279.TimeToGo` | JSON/String | s laut Victron-Quelle | `JSON.parse(value).value` |

Hinweis: Die bisher verwendeten Alias-Objekte dürfen zur Kontrolle bestehen bleiben, sind aber nicht die führende Quelle.

### 3.2 Gobel/Pace BMS – vier Packs

Modbus-Instanz: `modbus.1`

| Pack | Strom | Spannung | SOC | Temperatur |
|---|---|---|---|---|
| Pack 1 / Master | `modbus.1.holdingRegisters.1.40001_Ampere` | `modbus.1.holdingRegisters.1.40002_Volt` | `modbus.1.holdingRegisters.1.40003_SOC` | `modbus.1.holdingRegisters.1.40032_Cell_temperature_1` |
| Pack 2 / Slave 1 | `modbus.1.holdingRegisters.2.40001_Ampere` | `modbus.1.holdingRegisters.2.40002_Volt` | `modbus.1.holdingRegisters.2.40003_SOC` | `modbus.1.holdingRegisters.2.40032_Cell_temperature_1` |
| Pack 3 / Slave 2 | `modbus.1.holdingRegisters.3.40001_Ampere` | `modbus.1.holdingRegisters.3.40002_Volt` | `modbus.1.holdingRegisters.3.40003_SOC` | `modbus.1.holdingRegisters.3.40032_Cell_temperature_1` |
| Pack 4 / Slave 3 | `modbus.1.holdingRegisters.4.40001_Ampere` | `modbus.1.holdingRegisters.4.40002_Volt` | `modbus.1.holdingRegisters.4.40003_SOC` | `modbus.1.holdingRegisters.4.40032_Cell_temperature_1` |

Weitere relevante Register, insbesondere Warnungen, MOSFET-Temperaturen und Schutzstatus, werden erst aufgenommen, wenn ihre fachliche Verwendung im Battery Monitoring definiert ist.

### 3.3 Heltec-Balancer

MQTT-Instanz: `mqtt.0`

Für Pack `1..4`:

| Information | Originalobjekt |
|---|---|
| Balancing | `mqtt.0.HELTEC_<PACK>.balancing` |
| Zellspannung 1..16 | `mqtt.0.HELTEC_<PACK>.cell_<CELL>.voltage` |
| Sammeldatensatz, falls vorhanden | `mqtt.0.HELTEC_<PACK>.data` |

Die Zellspannungsdifferenz wird aus Minimum und Maximum der 16 Zellspannungen berechnet, sofern kein verlässlicher direkter Differenzwert vorhanden ist.

---

## 4. EOS-Ausgänge

Alle nachfolgenden States sind read-only, außer den ausdrücklich als Einstellung markierten States.

### 4.1 Summary

| EOS-State | Typ | Einheit | Quelle/Berechnung | Verwendung |
|---|---:|---:|---|---|
| `0_userdata.0.EOS.Battery.Summary.Status` | string | – | Kommunikations-Baseline | VIS2 Hauptstatus |
| `0_userdata.0.EOS.Battery.Summary.SOC` | number | % | SmartShunt SOC | VIS2, Health, Energy Flow |
| `0_userdata.0.EOS.Battery.Summary.Voltage` | number | V | SmartShunt Spannung | VIS2, Diagnose |
| `0_userdata.0.EOS.Battery.Summary.Current` | number | A | SmartShunt Strom | VIS2, Energy Flow |
| `0_userdata.0.EOS.Battery.Summary.Power` | number | W | SmartShunt Leistung | VIS2, Energy Flow |

### 4.2 SmartShunt

| EOS-State | Typ | Einheit | Originalquelle |
|---|---:|---:|---|
| `0_userdata.0.EOS.Battery.SmartShunt.SOC` | number | % | `mqtt.1.N.c0619ab336ed.battery.279.Soc` |
| `0_userdata.0.EOS.Battery.SmartShunt.Voltage` | number | V | `mqtt.1.N.c0619ab336ed.battery.279.Dc.0.Voltage` |
| `0_userdata.0.EOS.Battery.SmartShunt.Current` | number | A | `mqtt.1.N.c0619ab336ed.battery.279.Dc.0.Current` |
| `0_userdata.0.EOS.Battery.SmartShunt.Power` | number | W | `mqtt.1.N.c0619ab336ed.battery.279.Dc.0.Power` |
| `0_userdata.0.EOS.Battery.SmartShunt.ConsumedAh` | number | Ah | `mqtt.1.N.c0619ab336ed.battery.279.ConsumedAmphours` |
| `0_userdata.0.EOS.Battery.SmartShunt.ChargedEnergy` | number | kWh | `mqtt.1.N.c0619ab336ed.battery.279.History.ChargedEnergy` |
| `0_userdata.0.EOS.Battery.SmartShunt.DischargedEnergy` | number | kWh | `mqtt.1.N.c0619ab336ed.battery.279.History.DischargedEnergy` |
| `0_userdata.0.EOS.Battery.SmartShunt.TimeToGo` | number | s | `mqtt.1.N.c0619ab336ed.battery.279.TimeToGo` |

### 4.3 Packs

Für `Pack1` bis `Pack4`:

| EOS-State-Muster | Typ | Einheit | Quelle/Berechnung |
|---|---:|---:|---|
| `0_userdata.0.EOS.Battery.Packs.Pack<N>.Status` | string | – | Pack- und Kommunikationsstatus |
| `0_userdata.0.EOS.Battery.Packs.Pack<N>.Voltage` | number | V | Gobel/Pace Modbus |
| `0_userdata.0.EOS.Battery.Packs.Pack<N>.Current` | number | A | Gobel/Pace Modbus |
| `0_userdata.0.EOS.Battery.Packs.Pack<N>.Power` | number | W | `Voltage × Current` |
| `0_userdata.0.EOS.Battery.Packs.Pack<N>.TemperatureMax` | number | °C | Gobel/Pace, später max. aller relevanten Sensoren |
| `0_userdata.0.EOS.Battery.Packs.Pack<N>.VDiff` | number | mV | Heltec Zellmaximum minus Zellminimum |
| `0_userdata.0.EOS.Battery.Packs.Pack<N>.Balancing` | boolean | – | Heltec `balancing` |
| `0_userdata.0.EOS.Battery.Packs.Pack<N>.Communication` | string | – | kombinierter Gobel-/Heltec-Status |

Aktueller Implementierungsstand:

- Pack-States werden für `Pack1` bis `Pack4` vollständig erzeugt.
- `Status`, `Power`, `Balancing` und `Communication` werden jetzt explizit geschrieben.
- `Power` wird, sofern möglich, aus Zellspannungssumme und Packstrom abgeleitet.
- Fehlen alle relevanten Eingangswerte, bleibt der Pack-Status `UNKNOWN`.

### 4.4 Communication

Für `SmartShunt`, `Gobel`, `Heltec` und `MQTT`:

| EOS-State-Muster | Typ | Einheit | Bedeutung |
|---|---:|---:|---|
| `0_userdata.0.EOS.Battery.Communication.<Quelle>.LastUpdate` | string | ISO-8601 | Zeitpunkt der letzten gültigen Quellaktualisierung |
| `0_userdata.0.EOS.Battery.Communication.<Quelle>.AgeSeconds` | number | s | Alter der letzten gültigen Quellaktualisierung |
| `0_userdata.0.EOS.Battery.Communication.<Quelle>.Status` | string | – | `OK`, `WARN`, `OFFLINE`, `UNKNOWN` |

Zusätzlich:

| EOS-State | Typ | Bedeutung |
|---|---:|---|
| `0_userdata.0.EOS.Battery.Communication.LastUpdate` | string | Zeitpunkt der letzten Supervisor-Auswertung |

### 4.5 Warnings

| EOS-State | Typ | Aktiv wenn |
|---|---:|---|
| `0_userdata.0.EOS.Battery.Warnings.SmartShuntOffline` | boolean | SmartShunt `OFFLINE` |
| `0_userdata.0.EOS.Battery.Warnings.GobelOffline` | boolean | Gobel/Pace `OFFLINE` |
| `0_userdata.0.EOS.Battery.Warnings.HeltecOffline` | boolean | Heltec `OFFLINE` |
| `0_userdata.0.EOS.Battery.Warnings.MQTTOffline` | boolean | MQTT-Verbindung `OFFLINE` |

VIS2-Umsetzung:

- Die Warnungs-Kacheln werden als `OK` dargestellt, solange der jeweilige Boolean `false` ist.
- Ist ein Boolean `true`, wird die Kachel als rotes, fettes `FEHLER` angezeigt.

### 4.6 Settings

Nur diese States sind beschreibbar:

| EOS-State | Typ | Einheit | Standard |
|---|---:|---:|---:|
| `0_userdata.0.EOS.Battery.Settings.CommunicationWarningTimeout_s` | number | s | 120 |
| `0_userdata.0.EOS.Battery.Settings.CommunicationOfflineTimeout_s` | number | s | 300 |

---

## 5. Aktualisierungslogik

1. Gültige Quelländerungen aktualisieren die zugehörigen EOS-Werte sofort.
2. Alle 30 Sekunden werden Kommunikationsalter, Status und Offline-Warnungen neu bewertet.
3. `WARNING`, wenn das Alter größer als `CommunicationWarningTimeout_s` ist.
4. `OFFLINE`, wenn das Alter größer als `CommunicationOfflineTimeout_s` ist.
5. Ein Eingang gilt nur dann als gültig, wenn er vorhanden, parsebar und numerisch plausibel ist.
6. Ungültige oder fehlende Eingänge dürfen nicht als reale Messwerte `0` vortäuschen.
7. Unbekannte Zahlenwerte sollen als `null` oder technisch eindeutig unbekannt behandelt werden; Statuswerte verwenden `UNKNOWN`.
8. Schreiben der EOS-States erfolgt nur bei tatsächlicher Änderung.

---

## 6. Abgrenzung

Battery Supervisor V1 erzeugt:

- konsolidierte Messwerte,
- Pack-Grundwerte,
- Kommunikationszustände,
- Kommunikationswarnungen.

Battery Supervisor V1 erzeugt nicht:

- Health Score,
- fachliche Gesundheitsbewertung,
- Empfehlungen,
- Steuerbefehle,
- VIS2-Logik,
- Historienauswertungen.

Diese Funktionen gehören in separate Module.

---

## 7. Abnahmekriterien für Codex

Eine Implementierung ist fachlich vollständig, wenn:

- alle in Abschnitt 3 genannten Originalquellen verwendet werden,
- keine Alias-Objekte als führende Quelle benötigt werden,
- die EOS-States aus Abschnitt 4 automatisch angelegt werden,
- Datentypen und Einheiten stimmen,
- Kommunikationsstatus fortlaufend aktualisiert werden,
- fehlende Daten nicht als echte Nullwerte erscheinen,
- alle berechneten States read-only sind,
- nur die beiden Settings beschreibbar sind,
- keine Health-, Recommendation-, Steuer- oder VIS2-Logik enthalten ist,
- der Scriptstart ohne fehlende Quellobjekte abstürzt.
