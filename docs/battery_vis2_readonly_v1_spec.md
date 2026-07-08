# Battery VIS2 Read-Only V1 Spezifikation

## Zweck

Battery VIS2 Read-Only V1 beschreibt eine spaetere VIS2-Batterieansicht, die ausschliesslich auf bereits aufbereiteten EOS-States unter `0_userdata.0.EOS.Battery.*` basiert.

Die Ansicht dient der Anzeige und Diagnose. Sie darf keine Regelinstanz sein und keine Rohquellen direkt zusammenfuehren.

## Verbindliche Grundsaetze

1. VIS2 ist Anzeige, keine Steuerung.
2. VIS2 liest nur EOS-Battery-States.
3. VIS2 greift niemals direkt auf Modbus, MQTT, Alias-Pfade oder Adapter-Rohpfade zu.
4. Keine Fachlogik gehoert in die Visualisierung.
5. Nicht sicher belegte Inhalte bleiben `Unklar`.

## Erlaubte Datenquellen

Erlaubt sind ausschliesslich bestehende EOS-Battery-States unter:

- `0_userdata.0.EOS.Battery.Summary.*`
- `0_userdata.0.EOS.Battery.Communication.*`
- `0_userdata.0.EOS.Battery.Warnings.*`
- `0_userdata.0.EOS.Battery.Health.*`
- `0_userdata.0.EOS.Battery.SmartShunt.*`
- `0_userdata.0.EOS.Battery.Packs.*`

## Verbotene Datenquellen

Direkt verboten sind:

- Modbus-Rohpfade
- MQTT-Rohpfade
- Alias-Pfade
- Adapter-Rohpfade
- direkte BMS-, Heltec- oder SmartShunt-Rohdaten ausserhalb der EOS-Battery-States

## Anzuzeigende Bereiche

Die Ansicht darf die folgenden Bereiche anzeigen:

- Summary
- Communication
- Warnings
- Health
- SmartShunt-Grundwerte
- Pack-Grundwerte

### Summary

Die Summary zeigt die verdichtete Gesamtsicht der Batterie.

### Communication

Die Communication zeigt den Kommunikationsstatus je Quelle inklusive der bereits berechneten EOS-Zustaende.

### Warnings

Die Warnings zeigen nur die bereits abgeleiteten EOS-Warnungen.

### Health

Die Health zeigt den separaten Health-Status, den Score, die letzte Bewertung und die Begruendungen.

### SmartShunt-Grundwerte

Die SmartShunt-Grundwerte zeigen die bestehenden EOS-States fuer SOC, Spannung, Strom, Leistung und weitere bereits freigegebene Basiswerte.

### Pack-Grundwerte

Die Pack-Grundwerte zeigen die bestehenden EOS-States fuer Packspannung, Packstrom, Packleistung, Temperatur, Spannungsdifferenz und Balancing, soweit sie im EOS-State-Modell vorhanden sind.

## Nicht erlaubt

Battery VIS2 Read-Only V1 darf nicht:

- eigene Berechnungen aus Rohquellen ausfuehren
- Warnungen, Health oder Status selbst neu bewerten
- Aktorik ausloesen
- MQTT-, Modbus- oder Alias-Rohdaten direkt lesen
- separate Steuerlogik enthalten
- neue EOS-States voraussetzen, die nicht bereits dokumentiert sind

## Offene Punkte

- Unklar, welche genaue visuelle Gliederung die spaetere Batterieansicht erhalten soll.
- Unklar, welche States in den Pack-Grundwerten spaeter als Hauptanzeige und welche nur als Detail angezeigt werden.
- Unklar, ob die Health-Gruppe in der VIS2-Hauptansicht oder nur in einer Detailansicht erscheinen soll.
- Unklar, ob es fuer Battery VIS2 Read-Only V1 eine eigene Unterseite oder eine Einbindung in eine bestehende VIS2-Struktur geben soll.

