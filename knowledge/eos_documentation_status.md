# EOS Dokumentationsstatus

## Status

Die EOS-Projektdokumentation ist fuer die weitere modulare Entwicklung abgeschlossen und freigegeben.

Abgeschlossen bedeutet:

- ein neuer Codex-Chat kann den Projektkontext ohne alten Chat einlesen,
- Arbeitsreihenfolge, Sicherheitsgrenzen und Reviewprozess sind dokumentiert,
- die bestehende Architektur und die freigegebenen Module sind nachvollziehbar,
- offene, nicht belegte Betriebsdetails sind bewusst als `Unklar` dokumentiert,
- neue Features werden nicht aus offenen Punkten abgeleitet, sondern nur nach konkreter Freigabe umgesetzt.

Die Dokumentation ist kein vollstaendiger Export des produktiven Live-Systems. GitHub bleibt die Single Source of Truth fuer den freigegebenen Repository-Stand; ioBroker bleibt das Live-System.

## Verbindliche Quellenhierarchie

1. `AGENTS.md`
2. `knowledge/project_brain.md`
3. `knowledge/README.md`
4. `docs/project_analysis.md`
5. fuer die Aufgabe relevante fuehrende Knowledge-Dateien und Fachspezifikationen
6. tatsaechlicher Repository-Inhalt

Bei Widerspruechen hat der tatsaechliche Repository-Inhalt Vorrang vor Committexten, Zusammenfassungen oder Chat-Aussagen.

## Dokumentierte Architekturgrundlagen

- Trennung von Hardware-Schutz, Cerbo-Echtzeitregelung, ioBroker-Strategie, EOS-Fachschicht und VIS2.
- Neue EOS-Logik entsteht modular unter `iobroker/scripts/energiemanagement/`.
- Bestehender produktionsnaher Altbestand unter `iobroker/scripts/common/` bleibt ohne ausdrueckliche Freigabe unveraendert.
- EOS-States bilden die stabile fachliche Schnittstelle fuer Folgefunktionen und VIS2.
- Berechnete EOS-States sind read-only; nur Settings-States duerfen schreibbar sein.
- VIS2 enthaelt keine Fachlogik.
- Ressourcenschonende, ereignisgetriebene Verarbeitung wird bevorzugt.
- Nicht belegte Werte, Pfade oder Systemzustaende werden nicht geraten.

## Freigegebener fachlicher Stand

### Battery V1

Abgeschlossen und dokumentiert:

- `Battery_Supervisor_V1.js` als nicht-aktorische Communication-Baseline,
- `Battery_Health_V1.js` als separater nicht-aktorischer Health-Baustein,
- Battery VIS2 Read-Only V1,
- SmartShunt als fuehrende Quelle fuer Gesamt-SOC und DC-Spannung,
- Gobel / Pace BMS als Schutz- und Plausibilisierungsquelle,
- HELTEC als Diagnoseebene fuer Zellspannungen.

### Energy Flow V1

Abgeschlossen und dokumentiert:

- read-only EOS-Energieflussschicht,
- ereignisgetriebene Verarbeitung,
- Grid und Battery als belegte Quellen,
- PV, House und Wallbox bleiben `UNKNOWN`, bis freigegebene EOS-interne Quellen dokumentiert sind,
- keine Regelung, Recommendation oder Rueckschreibung in die Batterieebene.

### VIS2 und Deployment

Dokumentiert:

- VIS2 liest verdichtete EOS-States,
- `battery.html` ist die fuehrende Pflegequelle der Battery-Ansicht,
- `vis-views.json` ist das Exportartefakt,
- Repository-Aenderungen werden erst nach kontrolliertem Import oder Deployment im Live-System wirksam,
- Deployment- und Verifikationswerkzeuge sind dokumentiert und vorsichtig zu verwenden.

## Bewusst offene Punkte

`knowledge/open_questions.md` enthaelt reale, noch nicht belegte Details des Live-Systems. Diese Punkte verhindern den Abschluss der Projektdokumentation nicht.

Sie werden erst bearbeitet, wenn sie fuer einen konkret freigegebenen Entwicklungsschritt erforderlich sind. Beispiele:

- vollstaendiges Live-Adapter- und Containerinventar,
- vollstaendige Common-Skript-Abhaengigkeiten,
- alle produktiven MQTT- und Aktor-Schreibpfade,
- spaetere Prognose-, Optimierungs- oder Automatikmodule,
- detaillierte Notabschaltungs- und Rollback-Tests.

## Entwicklungsfreigabe

Die Dokumentationsphase ist abgeschlossen. Die weitere Arbeit erfolgt wieder modulbezogen:

1. ChatGPT definiert Architektur, Auftrag und Abnahmekriterien.
2. Codex implementiert im Repository und fuehrt das verpflichtende Selbstaudit durch.
3. ChatGPT prueft den tatsaechlichen Commitinhalt.
4. Entscheidung: `Freigeben` oder `Korrektur erforderlich`.
5. Erst danach beginnt der naechste Entwicklungsschritt.

Keine neue Funktion, kein neues Modul und keine aktorische Erweiterung ist allein durch dieses Dokument freigegeben.
