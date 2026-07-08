# Energy Flow Architecture Review V1

## Gepruefte Unterlagen

- `docs/energy_flow_v1_spec.md`
- `docs/energy_flow_v1_state_model.md`
- `knowledge/project_brain.md`

## Architekturbewertung

Die Spezifikation bildet eine saubere EOS-Schicht fuer die konsolidierte Energiesicht.
Die Rollen sind klar getrennt: Energy Flow wertet bestehende EOS- und Freigabequellen aus, schreibt nur eigene read-only States und greift nicht in Aktorik oder Regelung ein.

Die Schichtenidee ist fachlich stimmig:

- Datenquellen liefern Roh- oder Vorverdichtungswerte.
- Battery Supervisor und Battery Health stellen die Batterieperspektive bereit.
- Energy Flow konsolidiert die Gesamtenergieperspektive.

Damit ist die Architektur in sich schluessig und passt zur bisherigen EOS-Strategie.

## Schichtenarchitektur

Positiv:

- Die Spezifikation vermeidet Rueckkopplungen.
- Es gibt keine direkte Steuerlogik.
- Energy Flow bleibt eine Konsolidierungs- und Leseschicht.
- Die Trennung von Battery Supervisor, Battery Health und Energy Flow ist fachlich nachvollziehbar.

Risiko:

- Die Grenze zwischen "EOS-States" und "bereits freigegebene ioBroker-Readout-Quellen" ist noch zu breit formuliert.
- Damit bleibt im Implementierungsfall Interpretationsspielraum, welche Quellen fuer die Energy-Flow-Schicht wirklich zulässig sind.

## Zuständigkeiten

Positiv:

- Energy Flow ist klar als verdichtende Schicht definiert.
- Die Batterie bleibt Datenquelle und wird nicht als Regelinstanz missbraucht.
- Recommendation und Automation sind explizit ausgeschlossen.

Risiko:

- Die Spezifikation beschreibt die fachliche Abgrenzung gut, aber noch nicht die konkrete Verantwortungsfolge zwischen Grid, PV, House, Wallbox und Battery im Fehlerfall.
- Ohne diese Folge-Regel kann die spaetere Implementierung bei konkurrierenden Quellen uneinheitlich werden.

## State-Modell

Positiv:

- Der State-Baum ist eindeutig benannt.
- Die Top-Level-Gruppen `Grid`, `PV`, `Battery`, `House`, `Wallbox`, `Summary` und `Communication` sind fachlich passend.
- Alle dokumentierten States sind read-only.
- Die `Communication`-Gruppe ist sinnvoll als technische Querschnittssicht.

Risiken:

- `Summary.Direction` ist aktuell offen und fachlich noch nicht operationalisiert.
- In `Communication` sind die per-Bereich-States ebenfalls offen; fuer die spaetere Implementierung ist zu klaeren, ob ein einheitliches Statusmodell oder bereichsspezifische Statusworte verwendet werden.
- Bei `Grid`, `PV`, `House` und `Wallbox` fehlen teilweise noch finale Statusbegriffe fuer fehlerhafte oder unvollstaendige Datenlagen.

## Datenquellen

Positiv:

- Die Spezifikation erlaubt bevorzugt bestehende EOS-States und bereits freigegebene Batterie-EOS-States.
- Direkte Schreibziele sind ausgeschlossen.
- Rohpfade sind nur dann denkbar, wenn sie bereits als reine Lesequelle dokumentiert sind.

Risiko:

- Die Formulierung "bereits freigegebene ioBroker-Readout-Quellen" ist noch zu generisch.
- Fuer eine robuste Implementierung sollte je Quelle festgelegt werden, ob sie wirklich EOS-intern, ioBroker-lesend oder bereits verdichtet ist.
- Ohne diese Feinspezifikation besteht die Gefahr, dass Energy Flow erneut zu nah an Rohdaten gerät.

## Erweiterbarkeit

### Recommendation V1

Die Spezifikation ist als Basis geeignet, weil sie:

- nur lesende Konsolidierung vorsieht,
- Domänen klar trennt,
- die Energy-Flow-Schicht von Steuerung entkoppelt,
- und damit spaeter eine fachliche Empfehlungsschicht aufsetzen kann.

Einschraenkung:

- Fuer Recommendation V1 braucht es spaeter eine explizit definierte Bewertungslogik, die nicht Teil dieser Spezifikation ist.
- Die aktuelle Spezifikation legt dafuer die Datenbasis an, aber noch keine Entscheidungsmatrix.

### Automation V1

Die Spezifikation ist ebenfalls als Basis geeignet, weil sie:

- keine Aktorik enthaelt,
- keine Rueckwirkung erlaubt,
- und konsolidierte Zustände als Grundlage fuer spaetere Automationsregeln bereitstellen kann.

Einschraenkung:

- Automation V1 braucht eine noch schärfer definierte Grenzziehung zwischen Beobachtung, Empfehlung und Aktion.
- Diese Grenzziehung ist hier angedeutet, aber nicht final dokumentiert.

## Festgestellte Risiken

- Zu breite Quellenformulierung im Eingangsbereich.
- Noch offene Statussemantik bei Teilbereichen und Kommunikationsdetails.
- Kein finaler Definitionseintrag fuer die Prioritaet bei konkurrierenden Energiequellen.
- Spätere Erweiterungen koennen ohne klare Bewertungsreihenfolge uneinheitlich werden.

## Offene Punkte

- Welche konkreten EOS-States oder Lesequellen sind fuer jede Domäne verbindlich?
- Welche Statuswerte sind fuer `Summary.Direction` und die Bereichs-Status final?
- Wie soll bei unvollstaendigen oder widerspruechlichen Quellen priorisiert werden?
- Welche minimalen Zusatz-States werden fuer Recommendation V1 tatsaechlich benoetigt?

## Konkrete Verbesserungsvorschlaege

1. Die erlaubten Datenquellen je Domäne in einer Folge-Spezifikation oder Mapping-Datei eindeutig festlegen.
2. Die Statussemantik fuer `Summary` und `Communication` vor Implementierung final definieren.
3. Die Prioritaetsregel fuer konkurrierende Quellen dokumentieren, bevor Implementierung beginnt.
4. Die Trennung zwischen Energy Flow, Recommendation und Automation als dauerhaftes Architekturprinzip festhalten.

## Entscheidung

Spezifikation freigeben.

Begruendung:

- Die Architektur ist klar genug fuer die erste Implementierung.
- Die Rueckwirkung ist sauber ausgeschlossen.
- Die State-Struktur ist konsistent und passend fuer EOS.
- Die offenen Punkte sind wichtig, blockieren die Implementierung aber nicht, solange sie in der Umsetzung bewusst und eng gefuehrt behandelt werden.
