# Energy Flow V1 Implementierungsplanung

## Ziel

Energy Flow V1 wird in klar getrennten Implementierungsphasen aufgebaut, damit die erste produktive EOS-Ebene fuer konsolidierte Energiefluesse robust, read-only und pruefbar entsteht.

## Phase 1

### Inhalt

- Basis-States unter `0_userdata.0.EOS.EnergyFlow`
- minimale Konsolidierung fuer Battery, Summary und Communication
- robuste Behandlung fehlender Werte mit `UNKNOWN`
- rein lesende Nutzung der freigegebenen EOS-Quellen

### Reihenfolge

1. State-Geruest erzeugen
2. Battery-Eingang anbinden
3. Summary bilden
4. Communication-Basis schreiben

### Zuerst entstehende EOS-States

- `0_userdata.0.EOS.EnergyFlow.Battery.Power`
- `0_userdata.0.EOS.EnergyFlow.Battery.SOC`
- `0_userdata.0.EOS.EnergyFlow.Battery.Status`
- `0_userdata.0.EOS.EnergyFlow.Summary.Status`
- `0_userdata.0.EOS.EnergyFlow.Summary.PowerBalance`
- `0_userdata.0.EOS.EnergyFlow.Communication.Status`
- `0_userdata.0.EOS.EnergyFlow.Communication.LastUpdate`
- `0_userdata.0.EOS.EnergyFlow.Communication.AgeSeconds`

### Zuerst angebundene Eingänge

- `0_userdata.0.EOS.Battery.Summary.Power`
- `0_userdata.0.EOS.Battery.Summary.SOC`
- `0_userdata.0.EOS.Battery.Summary.Status`
- `0_userdata.0.EOS.Battery.Communication.Status`

### Zuerst erzeugte Ausgänge

- Battery-Sicht
- Summary-Sicht
- Communication-Sicht

### Zwingende Tests nach Phase 1

- `git diff --check`
- Pruefung der erzeugten States im Objektbaum
- Pruefung auf read-only Setzung aller neuen States
- Pruefung fehlender Eingänge mit `UNKNOWN`
- Sichtkontrolle auf keine TODOs, Dummyfunktionen oder Platzhalter

### Risiken nach Phase 1

- Battery-Quelle ist noch die einzige fachliche Eingangsbasis
- Summary kann bei fehlenden Domänen noch zu grob sein
- Communication kann zu aggregiert bleiben

### Abnahmekriterien

- Alle Phase-1-States sind vorhanden.
- Keine Rueckschreibung auf Quellen oder Aktoren.
- Fehlende Batteriewerte werden ohne Fehler als `UNKNOWN` oder Null-Default verarbeitet.
- `git diff --check` ist sauber.

## Phase 2

### Inhalt

- Grid, PV, House und Wallbox anbinden
- Domänenwerte in die Energy-Flow-Sicht aufnehmen
- Summary auf die vollstaendige Energieflusslage erweitern
- Communication je Domäne sichtbar machen

### Reihenfolge

1. Grid anbinden
2. PV anbinden
3. House anbinden
4. Wallbox anbinden
5. Summary konsolidieren
6. Communication je Domäne vervollstaendigen

### Zuerst entstehende EOS-States

- `0_userdata.0.EOS.EnergyFlow.Grid.Power`
- `0_userdata.0.EOS.EnergyFlow.Grid.Import`
- `0_userdata.0.EOS.EnergyFlow.Grid.Export`
- `0_userdata.0.EOS.EnergyFlow.PV.Power`
- `0_userdata.0.EOS.EnergyFlow.House.Power`
- `0_userdata.0.EOS.EnergyFlow.Wallbox.Power`

### Zuerst angebundene Eingänge

- freigegebene Grid-States
- freigegebene PV-States
- freigegebene House-States
- freigegebene Wallbox-States

### Zuerst erzeugte Ausgänge

- Grid-Sicht
- PV-Sicht
- House-Sicht
- Wallbox-Sicht
- vervollstaendigte Summary

### Zwingende Tests nach Phase 2

- `git diff --check`
- Vollstaendigkeit aller Domänen-States
- Plausibilitaet der Summen- und Richtungsableitung
- Pruefung auf doppelte oder unnötige States
- Pruefung auf unerwuenschte direkte Quellenzugriffe

### Risiken nach Phase 2

- uneinheitliche Statussemantik zwischen den Domänen
- doppelte Bilanzierung bei unklarer Eingangszuordnung
- zu fruehe Ableitung von Richtungszuständen

### Abnahmekriterien

- Alle vorgesehenen Domänen sind als read-only States vorhanden.
- Keine direct-to-source Logik ausserhalb freigegebener EOS-Quellen.
- Summary ist konsistent ueber alle eingebundenen Domänen.

## Phase 3

### Inhalt

- Feinschliff der Communication-Sicht
- Fehler- und Grenzfaelle stabilisieren
- Minimalbasis fuer spaetere Erweiterungen vorbereiten
- Konsistenz mit Architekturreview und State-Modell sicherstellen

### Reihenfolge

1. Communication verfeinern
2. Fehlerfaelle stabilisieren
3. Statusbegriffe finalisieren
4. minimale Erweiterungspunkte dokumentieren

### Zuerst entstehende EOS-States

- `0_userdata.0.EOS.EnergyFlow.Summary.Direction`
- `0_userdata.0.EOS.EnergyFlow.Communication.Grid`
- `0_userdata.0.EOS.EnergyFlow.Communication.PV`
- `0_userdata.0.EOS.EnergyFlow.Communication.Battery`
- `0_userdata.0.EOS.EnergyFlow.Communication.House`
- `0_userdata.0.EOS.EnergyFlow.Communication.Wallbox`

### Zuerst angebundene Eingänge

- bestehende EOS-Communication-States
- bestehende Battery-Communication-States
- dokumentierte Lesequellen fuer Grid, PV, House und Wallbox

### Zuerst erzeugte Ausgänge

- vollstaendige Communication-Sicht
- stabilisierte Summary.Direction
- dokumentierte Minimalbasis fuer spaetere Module

### Zwingende Tests nach Phase 3

- `git diff --check`
- Konsistenz mit `docs/energy_flow_v1_spec.md`
- Konsistenz mit `docs/energy_flow_v1_state_model.md`
- Konsistenz mit `docs/energy_flow_architecture_review_v1.md`
- Negative Pruefung auf Aktorik, Steuerlogik und Recommendation

### Risiken nach Phase 3

- Statussemantik bleibt zu grob
- spaetere Erweiterungen koennen ohne klare Quellprioritaet wieder zerfasern
- Kommunikationsdetails koennen zu viel technischem Rauschen fuehren

### Abnahmekriterien

- Alle dokumentierten States sind umgesetzt.
- Alle States bleiben read-only.
- Keine Rueckwirkung auf Quellen oder Aktoren.
- Die Architektur bleibt mit Spezifikation und Review konsistent.

## Reihenfolge der Umsetzung

1. Phase 1
2. Phase 2
3. Phase 3

## Definition des ersten minimal lauffaehigen Energy Flow V1

Das erste minimal lauffaehige Energy Flow V1 besteht aus:

- einem erzeugten `0_userdata.0.EOS.EnergyFlow`-State-Baum
- einer read-only Battery-Sicht
- einer read-only Summary-Sicht
- einer read-only Communication-Sicht
- robuster Behandlung fehlender Eingänge mit `UNKNOWN`
- keinerlei Rueckschreibung auf Quellen oder Aktoren

## Rollbackstrategie

- Vor jeder Phase bleibt der letzte freigegebene Commit der Ruecksprungpunkt.
- Bei fachlicher Abweichung wird die betroffene Phase vollstaendig zurueckgenommen.
- Bereits freigegebene, unveraenderte Dokumentation bleibt erhalten.
- Implementierung wird nur dann weitergefuehrt, wenn Phase und Dokumentation wieder konsistent sind.

## Abnahmeregel

Eine Phase gilt erst dann als abgeschlossen, wenn:

- der Inhalt vollstaendig umgesetzt ist,
- die Tests aus der Phase bestanden sind,
- `git diff --check` sauber ist,
- und der Abgleich mit Spezifikation, State-Modell und Architekturreview keine Abweichung zeigt.
