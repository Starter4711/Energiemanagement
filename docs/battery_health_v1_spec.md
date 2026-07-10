# Battery Health V1 – Spezifikation

## 1. Zweck

Battery Health V1 bewertet den Gesundheitszustand der Batterie auf Basis der bereits aufbereiteten EOS-Battery-States.

Das Modul beantwortet die zentrale Frage:

> Ist die Batterie insgesamt in Ordnung, auffällig, kritisch oder nicht zuverlässig bewertbar?

Battery Health V1 greift nicht direkt auf MQTT-, Modbus-, Alias- oder Victron-Rohobjekte zu. Es liest ausschließlich States unter:

```text
0_userdata.0.EOS.Battery.*
```

Die Ergebnisse werden für VIS2 und spätere Diagnosefunktionen bereitgestellt.

---

## 2. Script

| Eigenschaft | Wert |
|---|---|
| Scriptdatei | `iobroker/scripts/energiemanagement/Battery_Health_V1.js` |
| ioBroker Script-ID | `script.js.energiemanagement.Battery_Health_V1` |
| Objektdatei | `iobroker/objects/energiemanagement.Battery_Health_V1.json` |
| EOS-Root | `0_userdata.0.EOS.Battery.Health` |
| Betriebsart | read-only Bewertung |
| Aktualisierung | beim Start und alle 30 Sekunden |

---

## 3. Verantwortungsbereich

Battery Health V1:

- bewertet die Verfügbarkeit der Batteriegrundwerte,
- bewertet Kommunikationszustände,
- bewertet die größte Zellspannungsdifferenz der vier Packs,
- bildet daraus einen Health-Status,
- bildet daraus einen Health-Score von 0 bis 100,
- liefert nachvollziehbare Bewertungsgründe,
- stellt den Zeitpunkt der letzten Bewertung bereit.

Battery Health V1:

- steuert keine Geräte,
- schreibt keine MQTT-, Modbus-, Victron- oder BMS-Rohobjekte,
- verändert keine Batterieparameter,
- berechnet keine Lade- oder Entladefreigaben,
- erzeugt keine Recommendation,
- enthält keine VIS2-Logik.

---

## 4. Eingänge

### 4.1 Verbindliche Basiswerte

| EOS-State | Typ | Einheit | Zweck |
|---|---:|---:|---|
| `0_userdata.0.EOS.Battery.SmartShunt.SOC` | number | % | Prüft, ob ein gültiger Gesamt-SOC vorhanden ist |
| `0_userdata.0.EOS.Battery.SmartShunt.Voltage` | number | V | Prüft, ob eine gültige Batteriespannung vorhanden ist |
| `0_userdata.0.EOS.Battery.SmartShunt.Current` | number | A | Prüft, ob ein gültiger Batteriestrom vorhanden ist |

Fehlt einer dieser drei Basiswerte oder ist er nicht numerisch auswertbar, wird die Health-Bewertung:

```text
Status = UNKNOWN
Score = 0
Reason = Missing SmartShunt base values
```

### 4.2 Kommunikationsstatus

| Quelle | EOS-State |
|---|---|
| SmartShunt | `0_userdata.0.EOS.Battery.Communication.SmartShunt.Status` |
| Gobel/Pace | `0_userdata.0.EOS.Battery.Communication.Gobel.Status` |
| Heltec | `0_userdata.0.EOS.Battery.Communication.Heltec.Status` |
| MQTT | `0_userdata.0.EOS.Battery.Communication.MQTT.Status` |

Erwartete Eingangswerte:

- `OK`
- `WARNING` oder `WARN`
- `OFFLINE`
- `UNKNOWN`

Battery Health V1 normalisiert die Werte auf Großschreibung.

### 4.3 Zellspannungsdifferenz

Für Pack 1 bis Pack 4:

```text
0_userdata.0.EOS.Battery.Packs.Pack<N>.VDiff
```

Datentyp:

```text
number
```

Einheit:

```text
mV
```

Die Bewertung verwendet die größte verfügbare Zellspannungsdifferenz aller vier Packs.

---

## 5. Ausgänge

Alle Ausgänge sind read-only.

| EOS-State | Typ | Einheit | Inhalt |
|---|---:|---:|---|
| `0_userdata.0.EOS.Battery.Health.Status` | string | – | `OK`, `WARN`, `CRITICAL` oder `UNKNOWN` |
| `0_userdata.0.EOS.Battery.Health.Score` | number | % | Health-Score von 0 bis 100 |
| `0_userdata.0.EOS.Battery.Health.LastUpdate` | string | ISO-8601 | Zeitpunkt der letzten Bewertung |
| `0_userdata.0.EOS.Battery.Health.Reasons` | string | – | Semikolon-getrennte Liste der Bewertungsgründe |

---

## 6. Bewertungslogik

### 6.1 Ausgangswert

Wenn alle Basiswerte vorhanden sind:

```text
Score = 100
Status = OK
```

### 6.2 Kommunikationsbewertung

Für jede Quelle:

| Zustand | Score-Abzug | Statuswirkung |
|---|---:|---|
| `OFFLINE` | 40 Punkte | `CRITICAL` |
| `WARN` / `WARNING` | 20 Punkte | mindestens `WARN` |
| `UNKNOWN` | kein fester Abzug | `UNKNOWN`, sofern kein schwererer Zustand vorliegt |
| `OK` | 0 Punkte | keine Verschlechterung |

Begründungsformat:

```text
<Quelle>: OFFLINE
<Quelle>: WARN
<Quelle>: UNKNOWN
```

### 6.3 Zellspannungsdifferenz

Es gilt die größte verfügbare `VDiff` aller vier Packs.

| größte VDiff | Score-Abzug | Statuswirkung |
|---|---:|---|
| kleiner 50 mV | 0 Punkte | keine Verschlechterung |
| 50 bis kleiner 100 mV | 15 Punkte | mindestens `WARN` |
| ab 100 mV | 30 Punkte | `CRITICAL` |

Begründungsformat:

```text
MaxVDiff <Wert> mV
```

### 6.4 UNKNOWN-Regel

Wenn ausschließlich `UNKNOWN`-Kommunikationszustände vorliegen und kein `OFFLINE`, kein `WARN` und keine auffällige VDiff erkannt wird:

```text
Status = UNKNOWN
Score maximal 50
```

### 6.5 Score-Grenzen

Der Score wird immer auf den Bereich 0 bis 100 begrenzt.

```text
Score < 0   → 0
Score > 100 → 100
```

Zusatzregeln:

- `Status = OK` und `Score < 80` wird zu `WARN`.
- `Score = 0` wird zu `CRITICAL`.

### 6.6 Keine Auffälligkeit

Wenn keine Auffälligkeit gefunden wird:

```text
Status = OK
Score = 100
Reasons = All base values available
```

---

## 7. Aktualisierung

Battery Health V1 wird aktualisiert:

1. einmal beim Scriptstart,
2. danach alle 30 Sekunden.

Die Ausgabe wird nur geschrieben, wenn sich der jeweilige Wert geändert hat.

`LastUpdate` wird bei jeder Bewertung auf den aktuellen ISO-Zeitstempel gesetzt.

---

## 8. Fehlerverhalten

- Fehlende Basiswerte führen zu `UNKNOWN`.
- Fehlende Pack-VDiff-Werte werden übersprungen.
- Fehlende Kommunikationsstates werden als `UNKNOWN` behandelt.
- Ungültige numerische Werte werden wie fehlende Werte behandelt.
- Das Script darf bei fehlenden Inputs nicht abbrechen.
- Ein Fehler im Hauptablauf wird als ioBroker-Warnmeldung protokolliert.

---

## 9. VIS2-Verwendung

Battery Health V1 liefert die zentralen States für die Batterie-Hauptübersicht.

### Hauptanzeige

| Anzeige | EOS-State |
|---|---|
| Gesamtstatus | `0_userdata.0.EOS.Battery.Health.Status` |
| Health Score | `0_userdata.0.EOS.Battery.Health.Score` |
| Gründe | `0_userdata.0.EOS.Battery.Health.Reasons` |
| letzte Bewertung | `0_userdata.0.EOS.Battery.Health.LastUpdate` |

VIS2 darf diese Werte nur anzeigen. Die Bewertung selbst erfolgt ausschließlich im Battery-Health-Script.

---

## 10. Noch nicht Bestandteil von V1

Battery Health V1 bewertet aktuell noch nicht:

- niedrigen oder hohen SOC,
- absolute Zellspannung,
- Zellnummer von Minimum oder Maximum,
- Batterie- oder MOSFET-Temperaturen,
- Packstrom-Abweichungen,
- Schutzstatus des Gobel/Pace BMS,
- Lade- oder Entladeleistung,
- Trendverläufe,
- historische Verschlechterung,
- Restkapazität oder SOH,
- Zyklenzahl,
- BMS-Alarme,
- Balancerwirkung.

Diese Punkte dürfen erst ergänzt werden, wenn ihre Quellen, Grenzwerte und Bewertung gemeinsam festgelegt sind.

---

## 11. Abnahmekriterien für Codex

Eine Implementierung erfüllt Battery Health V1, wenn:

- ausschließlich EOS-Battery-States gelesen werden,
- keine Rohobjekte direkt gelesen oder beschrieben werden,
- alle vier Health-States automatisch angelegt werden,
- alle Health-States read-only sind,
- die Bewertung beim Start und alle 30 Sekunden erfolgt,
- Kommunikationszustände gemäß Abschnitt 6 bewertet werden,
- die größte VDiff der vier Packs bewertet wird,
- fehlende Basiswerte zuverlässig `UNKNOWN` erzeugen,
- Score und Status den definierten Regeln entsprechen,
- Reasons nachvollziehbare Klartexte enthalten,
- keine Aktorik, Recommendation oder VIS2-Logik enthalten ist,
- das Script bei fehlenden Eingangsstates stabil weiterläuft.
