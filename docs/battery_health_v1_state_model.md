# Battery Health V1 – State Model

## 1. Zweck

Dieses Dokument definiert den technischen State-Vertrag für Battery Health V1.

Battery Health V1 liest ausschließlich bereits konsolidierte EOS-Battery-States und veröffentlicht daraus eine einfache Gesundheitsbewertung für VIS2 und spätere Auswertungen.

---

## 2. Modulreferenz

| Eigenschaft | Wert |
|---|---|
| Scriptdatei | `iobroker/scripts/energiemanagement/Battery_Health_V1.js` |
| ioBroker Script-ID | `script.js.energiemanagement.Battery_Health_V1` |
| Objektdatei | `iobroker/objects/energiemanagement.Battery_Health_V1.json` |
| Eingangsbereich | `0_userdata.0.EOS.Battery.*` |
| Ausgangsbereich | `0_userdata.0.EOS.Battery.Health.*` |
| Aktualisierung | beim Start und alle 30 Sekunden |
| Schreibmodus | nur bei Änderung |
| Aktorik | keine |

---

## 3. Eingangsstates

### 3.1 SmartShunt-Basiswerte

| State | Typ | Einheit | Verwendung |
|---|---:|---:|---|
| `0_userdata.0.EOS.Battery.SmartShunt.SOC` | number | % | Plausibilitäts- und Verfügbarkeitsprüfung |
| `0_userdata.0.EOS.Battery.SmartShunt.Voltage` | number | V | Plausibilitäts- und Verfügbarkeitsprüfung |
| `0_userdata.0.EOS.Battery.SmartShunt.Current` | number | A | Plausibilitäts- und Verfügbarkeitsprüfung |

Fehlt einer dieser Werte oder ist er nicht numerisch auswertbar, wird der Gesundheitszustand als `UNKNOWN` bewertet.

### 3.2 Kommunikationsstatus

| Quelle | State | Erwartete Werte |
|---|---|---|
| SmartShunt | `0_userdata.0.EOS.Battery.Communication.SmartShunt.Status` | `OK`, `WARN`, `WARNING`, `OFFLINE`, `UNKNOWN` |
| Gobel/Pace | `0_userdata.0.EOS.Battery.Communication.Gobel.Status` | `OK`, `WARN`, `WARNING`, `OFFLINE`, `UNKNOWN` |
| Heltec | `0_userdata.0.EOS.Battery.Communication.Heltec.Status` | `OK`, `WARN`, `WARNING`, `OFFLINE`, `UNKNOWN` |
| MQTT | `0_userdata.0.EOS.Battery.Communication.MQTT.Status` | `OK`, `WARN`, `WARNING`, `OFFLINE`, `UNKNOWN` |

### 3.3 Pack-Zellspannungsdifferenzen

Für Pack 1 bis Pack 4:

```text
0_userdata.0.EOS.Battery.Packs.Pack<N>.VDiff
```

| Eigenschaft | Wert |
|---|---|
| Typ | number |
| Einheit | mV |
| Verwendung | größte verfügbare Pack-Differenz bestimmt die Health-Bewertung |

---

## 4. Ausgangsstates

### 4.1 Status

```text
0_userdata.0.EOS.Battery.Health.Status
```

| Eigenschaft | Wert |
|---|---|
| Typ | string |
| Einheit | – |
| Schreibbar | nein |
| Schreibendes Script | `Battery_Health_V1.js` |
| Gelesen von | VIS2 Battery Übersicht, VIS2 Health |
| Aktualisierung | beim Start und alle 30 Sekunden |

Erlaubte Werte:

- `OK`
- `WARN`
- `CRITICAL`
- `UNKNOWN`

### 4.2 Score

```text
0_userdata.0.EOS.Battery.Health.Score
```

| Eigenschaft | Wert |
|---|---|
| Typ | number |
| Einheit | % |
| Wertebereich | 0 bis 100 |
| Schreibbar | nein |
| Schreibendes Script | `Battery_Health_V1.js` |
| Gelesen von | VIS2 Battery Übersicht, VIS2 Health |
| Aktualisierung | beim Start und alle 30 Sekunden |

### 4.3 Reasons

```text
0_userdata.0.EOS.Battery.Health.Reasons
```

| Eigenschaft | Wert |
|---|---|
| Typ | string |
| Einheit | – |
| Format | semikolon-getrennte Klartexte |
| Schreibbar | nein |
| Schreibendes Script | `Battery_Health_V1.js` |
| Gelesen von | VIS2 Battery Übersicht, VIS2 Health |
| Aktualisierung | beim Start und alle 30 Sekunden |

Beispiele:

```text
All base values available
SmartShunt: OFFLINE
Gobel: WARN
MaxVDiff 84 mV
Missing SmartShunt base values
```

### 4.4 LastUpdate

```text
0_userdata.0.EOS.Battery.Health.LastUpdate
```

| Eigenschaft | Wert |
|---|---|
| Typ | string |
| Einheit | ISO-8601 |
| Schreibbar | nein |
| Schreibendes Script | `Battery_Health_V1.js` |
| Gelesen von | VIS2 Battery Übersicht, VIS2 Health |
| Aktualisierung | bei jeder Health-Bewertung |

---

## 5. Bewertungsmatrix

### 5.1 Basiszustand

Bei vollständigen SmartShunt-Basiswerten:

```text
Status = OK
Score = 100
```

### 5.2 Kommunikationsbewertung

| Eingang | Score-Abzug | Status |
|---|---:|---|
| `OK` | 0 | unverändert |
| `WARN` / `WARNING` | 20 | mindestens `WARN` |
| `OFFLINE` | 40 | `CRITICAL` |
| `UNKNOWN` | 0 | `UNKNOWN`, sofern kein schwererer Zustand vorliegt |

### 5.3 Zellspannungsdifferenz

| größte VDiff | Score-Abzug | Status |
|---|---:|---|
| kleiner 50 mV | 0 | unverändert |
| 50 bis kleiner 100 mV | 15 | mindestens `WARN` |
| ab 100 mV | 30 | `CRITICAL` |

### 5.4 Schlussregeln

- Score wird auf 0 bis 100 begrenzt.
- `Status = OK` bei Score kleiner 80 wird zu `WARN`.
- Score 0 wird zu `CRITICAL`.
- Nur `UNKNOWN`-Kommunikationswerte ohne weitere Auffälligkeit ergeben maximal Score 50 und Status `UNKNOWN`.
- Fehlende SmartShunt-Basiswerte ergeben Status `UNKNOWN`, Score 0 und Reason `Missing SmartShunt base values`.

---

## 6. Fehlerverhalten

| Fehlerfall | Verhalten |
|---|---|
| Eingang fehlt | als unbekannt behandeln |
| Eingang nicht numerisch | als fehlend behandeln |
| Kommunikationsstate fehlt | `UNKNOWN` |
| VDiff fehlt | Pack bei Maximalwertbildung überspringen |
| Hauptfehler im Script | Warnlog schreiben, Script nicht hart abbrechen |
| fehlende Objektstruktur | Health-Ausgänge trotzdem anlegen |

---

## 7. VIS2-Mapping

| Anzeige | State | Darstellung |
|---|---|---|
| Gesamtstatus | `0_userdata.0.EOS.Battery.Health.Status` | Statuskarte |
| Health Score | `0_userdata.0.EOS.Battery.Health.Score` | Zahl/Gauge |
| Gründe | `0_userdata.0.EOS.Battery.Health.Reasons` | Text/Liste |
| Letzte Bewertung | `0_userdata.0.EOS.Battery.Health.LastUpdate` | Zeitstempel |

VIS2 berechnet keine Health-Logik selbst.

---

## 8. Noch nicht enthalten

Folgende Health-Faktoren sind in V1 noch nicht Bestandteil des State-Vertrags:

- SOC-Warn- oder Kritischgrenzen,
- absolute Zellspannungen,
- Packstrom-Abweichungen,
- Temperaturbewertung,
- Gobel/Pace Schutzstatus,
- Balancerwirkung,
- SOH,
- Zyklenzahl,
- Historie und Trends.

Diese Punkte werden erst ergänzt, wenn Quellen, Grenzwerte und Bewertungsregeln fachlich festgelegt sind.

---

## 9. Abnahmekriterien für Codex

Eine Implementierung entspricht diesem State-Modell, wenn:

- ausschließlich die dokumentierten EOS-Eingänge gelesen werden,
- alle vier Health-Ausgänge automatisch angelegt werden,
- alle vier Ausgänge read-only sind,
- Statuswerte nur `OK`, `WARN`, `CRITICAL`, `UNKNOWN` verwenden,
- Score immer im Bereich 0 bis 100 liegt,
- Reasons die tatsächlichen Bewertungsursachen enthält,
- LastUpdate bei jeder Bewertung aktualisiert wird,
- fehlende Inputs nicht als echte Nullwerte interpretiert werden,
- die Bewertung beim Start und danach alle 30 Sekunden läuft,
- keine Rohobjekte direkt gelesen oder beschrieben werden,
- keine Aktorik, Recommendation oder VIS2-Logik enthalten ist.
