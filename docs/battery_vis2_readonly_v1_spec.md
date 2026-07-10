# Battery VIS2 V1 – Spezifikation

## 1. Zweck

Battery VIS2 V1 ist die visuelle Oberfläche des Battery Monitoring V1.

Das primäre Ziel ist:

> Den Gesundheitszustand der gesamten Batterie auf einen Blick erkennen.

Die Hauptansicht zeigt nur die wichtigsten Informationen. Detaillierte Analyse, Diagnose und Einstellungen erfolgen auf eigenen Unterseiten.

Die Visualisierung verwendet ausschließlich aufbereitete EOS-States. Direkte Zugriffe auf MQTT-, Modbus-, Alias- oder Adapter-Rohobjekte sind nicht vorgesehen.

---

## 2. Benutzerziel

Beim Öffnen der Batterieansicht muss sofort erkennbar sein:

- Ist die Batterie insgesamt in Ordnung?
- Gibt es eine Warnung oder einen kritischen Zustand?
- Wie hoch ist der aktuelle SOC?
- Wird die Batterie geladen, entladen oder befindet sie sich im Leerlauf?
- Wie hoch sind aktuelle Leistung, Spannung und Strom?
- Sind alle Datenquellen erreichbar?
- Welcher Pack oder welche Zelle verursacht eine Auffälligkeit?
- Wann wurde der Zustand zuletzt aktualisiert?

Die Hauptansicht darf nicht mit Detailwerten überladen werden. Detailinformationen werden über Unterseiten erreichbar gemacht.

---

## 3. Technische Dateien

| Zweck | Repository-Datei |
|---|---|
| Führende Pflegequelle der Batterieansicht | `iobroker/vis-2/main/battery.html` |
| VIS2 Export-/Importartefakt | `iobroker/vis-2/main/vis-views.json` |
| Gemeinsame Styles | `iobroker/vis-2/main/vis-user.css` |

Änderungen beginnen in `battery.html`. Danach wird die entsprechende View konsistent in `vis-views.json` übernommen.

---

## 4. Datenquelle

Battery VIS2 V1 liest ausschließlich EOS-States unter:

```text
0_userdata.0.EOS.Battery.*
```

Für die Batterieansicht werden insbesondere verwendet:

```text
0_userdata.0.EOS.Battery.Summary.*
0_userdata.0.EOS.Battery.Health.*
0_userdata.0.EOS.Battery.Communication.*
0_userdata.0.EOS.Battery.Warnings.*
0_userdata.0.EOS.Battery.SmartShunt.*
0_userdata.0.EOS.Battery.Packs.*
0_userdata.0.EOS.Battery.Settings.*
```

Energy-Flow-Werte dürfen nur in einer klar getrennten Zusatzsektion oder einer eigenen Energy-Flow-Seite erscheinen. Sie sind nicht Bestandteil der fachlichen Gesundheitsbewertung der Batterie.

---

## 5. Navigationsstruktur

Battery VIS2 V1 besteht aus einer Hauptansicht und mehreren Unterseiten.

```text
Batterie
├── Übersicht
├── Health
├── Packs
├── Zellanalyse
├── Kommunikation
└── Einstellungen
```

Historie und Trends können später als eigene Unterseite ergänzt werden, sobald eine verbindliche Historienquelle definiert ist.

---

## 6. Hauptansicht „Übersicht“

### 6.1 Gesamtstatus

Der Gesamtstatus ist das wichtigste Element der Ansicht und muss visuell dominant dargestellt werden.

Verwendeter State:

```text
0_userdata.0.EOS.Battery.Health.Status
```

Erlaubte Anzeigen:

- `OK`
- `WARNING`
- `CRITICAL`
- `UNKNOWN`

Darstellung:

| Status | Bedeutung | Darstellung |
|---|---|---|
| OK | Kein relevanter Fehler erkannt | grün |
| WARNING | Auffälligkeit oder eingeschränkte Datenqualität | gelb/orange |
| CRITICAL | kritischer Batterie- oder Kommunikationszustand | rot |
| UNKNOWN | Zustand nicht zuverlässig bestimmbar | grau |

### 6.2 Health Score

Verwendeter State:

```text
0_userdata.0.EOS.Battery.Health.Score
```

Darstellung:

- groß und gut lesbar,
- Wertebereich 0 bis 100,
- zusätzlich zum Status, nicht als Ersatz dafür.

### 6.3 Hauptmesswerte

| Anzeige | EOS-State | Einheit |
|---|---|---|
| SOC | `0_userdata.0.EOS.Battery.Summary.SOC` | % |
| Leistung | `0_userdata.0.EOS.Battery.Summary.Power` | W |
| Spannung | `0_userdata.0.EOS.Battery.Summary.Voltage` | V |
| Strom | `0_userdata.0.EOS.Battery.Summary.Current` | A |

### 6.4 Ladezustand

Die Anzeige „Laden / Entladen / Leerlauf / Unbekannt“ wird aus der Batterieleistung abgeleitet.

Vorgesehene Darstellung:

- positive Leistung: Laden,
- negative Leistung: Entladen,
- Betrag innerhalb einer kleinen Totzone: Leerlauf,
- fehlender oder ungültiger Wert: Unbekannt.

Die Totzone muss in der Script-Spezifikation definiert werden. VIS2 selbst berechnet diesen Zustand nicht.

Dafür ist ein eigener EOS-State vorgesehen:

```text
0_userdata.0.EOS.Battery.Summary.Direction
```

Erlaubte Werte:

- `CHARGING`
- `DISCHARGING`
- `IDLE`
- `UNKNOWN`

### 6.5 Kommunikationsstatus

Die Hauptseite zeigt einen verdichteten Kommunikationsstatus.

Vorgesehener State:

```text
0_userdata.0.EOS.Battery.Communication.Status
```

Falls dieser State noch nicht existiert, muss er durch das zuständige Battery-Script erzeugt werden. VIS2 darf ihn nicht selbst berechnen.

Zusätzlich wird angezeigt, ob einzelne Quellen gestört sind:

- SmartShunt
- Gobel/Pace BMS
- Heltec
- MQTT

### 6.6 Wichtigste Gründe und Warnungen

Verwendete States:

```text
0_userdata.0.EOS.Battery.Health.Reasons
0_userdata.0.EOS.Battery.Warnings.*
```

Die Hauptansicht zeigt nur aktive oder relevante Gründe. Wenn keine Auffälligkeit besteht, wird ein kurzer Klartext angezeigt, beispielsweise:

```text
Keine Warnungen
```

### 6.7 Aktualität

Verwendeter State:

```text
0_userdata.0.EOS.Battery.Health.LastUpdate
```

Die Hauptseite zeigt den Zeitpunkt der letzten Health-Bewertung.

---

## 7. Unterseite „Health“

Die Health-Unterseite erklärt den Gesamtzustand.

Anzeigen:

- Health Status
- Health Score
- letzte Bewertung
- vollständige Liste der Bewertungsgründe
- aktive Kommunikationswarnungen
- auffällige Packs
- auffällige Zellspannungsdifferenzen
- auffällige Temperaturen

Verwendete State-Gruppen:

```text
0_userdata.0.EOS.Battery.Health.*
0_userdata.0.EOS.Battery.Warnings.*
0_userdata.0.EOS.Battery.Packs.*
```

Die konkrete Health-Logik wird nicht in VIS2 implementiert. VIS2 zeigt nur die bereits berechneten Ergebnisse.

---

## 8. Unterseite „Packs“

Für Pack 1 bis Pack 4 wird jeweils eine eigene Karte angezeigt.

Pro Pack:

| Anzeige | EOS-State-Muster |
|---|---|
| Status | `0_userdata.0.EOS.Battery.Packs.Pack<N>.Status` |
| Spannung | `0_userdata.0.EOS.Battery.Packs.Pack<N>.Voltage` |
| Strom | `0_userdata.0.EOS.Battery.Packs.Pack<N>.Current` |
| Leistung | `0_userdata.0.EOS.Battery.Packs.Pack<N>.Power` |
| maximale Temperatur | `0_userdata.0.EOS.Battery.Packs.Pack<N>.TemperatureMax` |
| Zellspannungsdifferenz | `0_userdata.0.EOS.Battery.Packs.Pack<N>.VDiff` |
| Balancing | `0_userdata.0.EOS.Battery.Packs.Pack<N>.Balancing` |
| Kommunikation | `0_userdata.0.EOS.Battery.Packs.Pack<N>.Communication` |

Die Packansicht muss einen direkten Vergleich der vier Packs ermöglichen.

---

## 9. Unterseite „Zellanalyse“

Die Zellanalyse dient der genauen Diagnose der 16 Zellen je Pack.

Erforderliche Informationen pro Pack:

- Zellspannung Zelle 1 bis 16,
- niedrigste Zellspannung,
- höchste Zellspannung,
- Zellspannungsdifferenz,
- Nummer der niedrigsten Zelle,
- Nummer der höchsten Zelle,
- Balancing aktiv/inaktiv,
- Zeitstempel der letzten Aktualisierung.

Dafür wird folgende EOS-Struktur benötigt:

```text
0_userdata.0.EOS.Battery.Packs.Pack<N>.Cells.Cell01.Voltage
...
0_userdata.0.EOS.Battery.Packs.Pack<N>.Cells.Cell16.Voltage

0_userdata.0.EOS.Battery.Packs.Pack<N>.Cells.MinimumVoltage
0_userdata.0.EOS.Battery.Packs.Pack<N>.Cells.MaximumVoltage
0_userdata.0.EOS.Battery.Packs.Pack<N>.Cells.Difference
0_userdata.0.EOS.Battery.Packs.Pack<N>.Cells.MinimumCell
0_userdata.0.EOS.Battery.Packs.Pack<N>.Cells.MaximumCell
0_userdata.0.EOS.Battery.Packs.Pack<N>.Cells.LastUpdate
```

Diese States müssen durch ein Battery-Script erzeugt werden. VIS2 liest keine Heltec-MQTT-Rohobjekte direkt.

Darstellung:

- Tabelle oder Balkendarstellung der 16 Zellspannungen,
- Minimum und Maximum deutlich markieren,
- Packauswahl oder vier getrennte Packbereiche,
- Differenz in mV hervorheben,
- auffällige Zellen farblich kennzeichnen.

Die Grenzwerte für Auffälligkeiten werden nicht in VIS2 festgelegt, sondern als EOS-Einstellungen bereitgestellt.

---

## 10. Unterseite „Kommunikation“

Die Kommunikationsseite zeigt für jede Quelle:

- Status,
- Alter der letzten gültigen Aktualisierung,
- Zeitstempel der letzten gültigen Aktualisierung,
- Offline-Warnung.

Quellen:

- SmartShunt
- Gobel/Pace BMS
- Heltec
- MQTT

Verwendete States:

```text
0_userdata.0.EOS.Battery.Communication.SmartShunt.*
0_userdata.0.EOS.Battery.Communication.Gobel.*
0_userdata.0.EOS.Battery.Communication.Heltec.*
0_userdata.0.EOS.Battery.Communication.MQTT.*
0_userdata.0.EOS.Battery.Warnings.*
```

---

## 11. Unterseite „Einstellungen“

Die Einstellungen sind die einzige beschreibbare Battery-VIS2-Unterseite.

V1 zeigt mindestens:

| Einstellung | EOS-State | Einheit |
|---|---|---|
| Kommunikationswarnung nach | `0_userdata.0.EOS.Battery.Settings.CommunicationWarningTimeout_s` | s |
| Kommunikation offline nach | `0_userdata.0.EOS.Battery.Settings.CommunicationOfflineTimeout_s` | s |

Für Health und Zellanalyse werden später zusätzliche Einstellungen benötigt, beispielsweise:

```text
0_userdata.0.EOS.Battery.Settings.SocWarningPercent
0_userdata.0.EOS.Battery.Settings.SocCriticalPercent
0_userdata.0.EOS.Battery.Settings.CellDifferenceWarning_mV
0_userdata.0.EOS.Battery.Settings.CellDifferenceCritical_mV
0_userdata.0.EOS.Battery.Settings.TemperatureWarning_C
0_userdata.0.EOS.Battery.Settings.TemperatureCritical_C
```

Diese zusätzlichen Einstellungen sind erst umzusetzen, wenn ihre Grenzwerte fachlich gemeinsam festgelegt wurden.

Schreibbare Eingaben müssen:

- klar als Einstellung gekennzeichnet sein,
- nur in die dokumentierten EOS-Settings schreiben,
- Wertebereiche validieren,
- keine MQTT-, Modbus-, Victron- oder BMS-Rohobjekte direkt beschreiben.

---

## 12. SmartShunt-Detailwerte

Die SmartShunt-Grundwerte können auf der Übersicht oder in einer Detailsektion angezeigt werden:

| Anzeige | EOS-State |
|---|---|
| SOC | `0_userdata.0.EOS.Battery.SmartShunt.SOC` |
| Spannung | `0_userdata.0.EOS.Battery.SmartShunt.Voltage` |
| Strom | `0_userdata.0.EOS.Battery.SmartShunt.Current` |
| Leistung | `0_userdata.0.EOS.Battery.SmartShunt.Power` |
| verbrauchte Ah | `0_userdata.0.EOS.Battery.SmartShunt.ConsumedAh` |
| geladene Energie | `0_userdata.0.EOS.Battery.SmartShunt.ChargedEnergy` |
| entladene Energie | `0_userdata.0.EOS.Battery.SmartShunt.DischargedEnergy` |
| Restlaufzeit | `0_userdata.0.EOS.Battery.SmartShunt.TimeToGo` |

---

## 13. Layoutanforderungen

- Desktop und Tablet müssen ohne horizontales Scrollen nutzbar sein.
- Hauptstatus, SOC und Leistung stehen im ersten sichtbaren Bereich.
- Kritische Zustände müssen ohne Öffnen einer Unterseite erkennbar sein.
- Detailwerte dürfen die Hauptansicht nicht überladen.
- Packkarten müssen untereinander vergleichbar sein.
- UNKNOWN darf nicht wie ein fehlerfreier Wert aussehen.
- Fehlende Zahlenwerte werden als `–` oder `nicht verfügbar` angezeigt.
- Zeitstempel sollen lesbar formatiert werden.
- Die Farbcodierung ist in allen Unterseiten konsistent.

---

## 14. Abnahmekriterien für Codex

Battery VIS2 V1 ist fachlich vollständig, wenn:

- der Gesundheitszustand auf der Hauptseite sofort erkennbar ist,
- Status, Health Score, SOC, Leistung, Richtung und Kommunikation sichtbar sind,
- aktive Gründe und Warnungen angezeigt werden,
- Unterseiten für Health, Packs, Zellanalyse, Kommunikation und Einstellungen existieren,
- alle Anzeigen ausschließlich EOS-States verwenden,
- keine MQTT-, Modbus-, Alias- oder Adapter-Rohobjekte direkt gebunden sind,
- die Zellanalyse alle 16 Zellen je Pack darstellen kann,
- Einstellungen ausschließlich dokumentierte EOS-Settings schreiben,
- `battery.html` und `vis-views.json` inhaltlich übereinstimmen,
- `vis-views.json` gültiges JSON ist,
- fehlende Werte eindeutig als unbekannt angezeigt werden,
- keine fachliche Berechnung in VIS2 erfolgt.

---

## 15. Noch fachlich festzulegen

Vor Umsetzung der vollständigen Health- und Zellanalyse müssen gemeinsam festgelegt werden:

- SOC-Warn- und Kritischgrenze,
- Zellspannungsdifferenz Warnung/Kritisch,
- Temperatur Warnung/Kritisch,
- Totzone für Laden/Entladen/Leerlauf,
- ob einzelne Zellspannungen dauerhaft oder nur bei geöffneter Detailseite aktualisiert werden,
- gewünschte Darstellung der Zellspannungen: Tabelle, Balken oder kombiniert.
