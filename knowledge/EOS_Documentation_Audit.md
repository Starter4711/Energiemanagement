# EOS Documentation Audit

## Zweck

Dieses Dokument bewertet den aktuellen Stand der EOS-Dokumentation gegen die verbindlichen Architektur-, Modul-, State-, Schnittstellen-, Deployment-, Test- und Traceability-Anforderungen. Es trennt abgeschlossene Grundlagen von offenen fachlichen und technischen Punkten und dient als Gate vor der Erstellung weiterer Codex-Aufträge.

Nicht belegte Punkte bleiben `Unklar`.

## Geprüfte Dokumentationsbereiche

Folgende zentrale Dokumentationsbausteine sind vorhanden:

- `knowledge/EOS_Master_Architecture.md`
- `knowledge/EOS_Module_Dependencies.md`
- `knowledge/EOS_Communication_Matrix.md`
- `knowledge/EOS_Interface_Contract.md`
- `knowledge/EOS_Recovery_Concept.md`
- `knowledge/EOS_Deployment_Release_Rollback.md`
- `knowledge/EOS_Test_Review_Acceptance.md`
- `knowledge/EOS_Traceability_Matrix.md`
- `knowledge/EOS_Roadmap.md`
- `knowledge/project_brain.md`
- `knowledge/requirements.md`
- `knowledge/decisions.md`
- `knowledge/open_questions.md`
- `knowledge/modules.md`
- relevante Spezifikationen unter `docs/`

## Gesamtbewertung

Die übergreifende EOS-Architektur ist dokumentiert. Die Dokumentation ist jedoch nicht als vollständig abgeschlossen zu bewerten, solange offene fachliche Grenzen, fehlende Detailverträge und noch nicht freigegebene Zielmodule bestehen.

Status:

- Masterarchitektur: dokumentiert
- Schichten- und Rollenmodell: dokumentiert
- State-Grundregeln: dokumentiert
- Modulabhängigkeiten: dokumentiert
- Kommunikationsarchitektur: dokumentiert
- Schnittstellenvertrag: dokumentiert
- Recovery- und Degradationskonzept: dokumentiert
- Deployment-, Release- und Rollback-Prozess: dokumentiert
- Test-, Review- und Abnahmestrategie: dokumentiert
- Traceability-Rahmen: dokumentiert
- Roadmap und Versionsgates: dokumentiert
- vollständige fachliche Umsetzung aller Zielmodule: nicht abgeschlossen

## Abgeschlossene Dokumentationsbereiche

### Battery V1

Für den freigegebenen V1-Umfang sind folgende Bausteine dokumentiert:

- Battery Supervisor V1 Communication-Baseline
- Battery Health V1
- Battery VIS2 Read-Only V1
- State-Modell und Read-only-Regeln
- Führungsrollen SmartShunt, Gobel / Pace BMS und HELTEC
- Kommunikations- und Fehlerverhalten
- Freigabe- und Review-Grundlage

Bewertung: für den freigegebenen V1-Umfang abgeschlossen.

### Energy Flow V1 Phase 2

Dokumentiert sind:

- read-only Fachschicht
- ereignisgetriebene Verarbeitung
- Grid- und Battery-Anbindung
- Status- und Kommunikationsmodell
- Verbot von Rückschreibungen in Battery
- Abgrenzung zu Regelung und Recommendation

Bewertung: für den freigegebenen Phase-2-Umfang dokumentiert; PV, House und Wallbox bleiben fachlich unvollständig und `UNKNOWN`.

### Übergreifende Architektur

Dokumentiert sind:

- GitHub als Single Source of Truth
- ioBroker als Live-, Strategie- und Koordinationsebene
- Cerbo als Echtzeitregler
- BMS und Hardware als höchste Schutzinstanz
- Node-RED als Kommunikationsbrücke
- VIS2 ohne Fachlogik
- EOS-States als stabile interne Fachschnittstelle
- Trennung von Telemetrie, Fachzustand, Settings, Sollwerten und Aktorik

Bewertung: strukturell abgeschlossen.

## Offene Dokumentationslücken

### Fachliche Quellen und Abhängigkeiten

Weiterhin offen:

- freigegebene EOS-interne Quellen für PV, House und Wallbox
- vollständige Abhängigkeitskarte des produktionsnahen Altbestands
- formale Bilanz- und Abrechnungsregeln des Drei-Zählpunkt-Systems
- verbindliche Prioritäten je Verbrauchergruppe

### Aktorische Schnittstellen

Weiterhin offen:

- vollständige Liste produktiver MQTT-, D-Bus-, HTTP-, Adapter- und S7-Schreibpfade
- Ablaufzeiten, Fallbackwerte und Rückmeldeverträge je Sollwert
- Quittierungsmodell für zukünftige EOS-Aktorik
- konkrete Notabschaltungs- und Wiederanlaufszenarien

### Zielmodule

Nur als nicht freigegebenes Zielbild dokumentiert:

- Generation
- Consumption
- Wallbox
- Pool
- zentrale Communication- und Health-Domänen
- Historian
- Notification
- Scheduler
- Forecast
- Optimizer

Für diese Module fehlen bis zur Freigabe jeweils mindestens:

- eigene Requirements
- Architekturentscheidung
- Spezifikation
- State-Modell
- Sicherheitsabgrenzung
- Test- und Abnahmekriterien
- Deployment- und Rollback-Nachweis

### Betrieb und Verifikation

Weiterhin offen:

- vollständiger produktiver Systeminventar-Nachweis
- automatisierte Konsistenzprüfung aller Dokumentverweise
- standardisierter Release-Nachweis je produktivem Modul
- formaler Nachweis des Live-Stands gegenüber dem Repository-Stand

## Vollständigkeitskriterium für EOS-Gesamtdokumentation

Die EOS-Gesamtdokumentation gilt erst dann als vollständig, wenn:

1. jede freigegebene Domäne eine vollständige Spezifikation und ein State-Modell besitzt,
2. alle produktiven Daten- und Schreibpfade inventarisiert sind,
3. alle Abhängigkeiten und Führungsrollen eindeutig dokumentiert sind,
4. jeder aktorische Pfad einen Sicherheits-, Fallback- und Rückmeldevertrag besitzt,
5. Deployment, Test, Review und Rollback je Modul nachweisbar sind,
6. Requirements, Entscheidungen, Implementierung und Freigaben vollständig traceable sind,
7. offene Punkte entweder beschlossen, verworfen oder bewusst als zukünftiges Zielbild abgegrenzt sind,
8. `knowledge/project_brain.md`, `knowledge/decisions.md`, `knowledge/roadmap.md` und `CHANGELOG.md` den aktuellen Stand widerspruchsfrei wiedergeben.

## Entscheidung für den Übergang zu Codex-Aufträgen

Die übergreifende Dokumentationsbasis ist ausreichend, um neue Codex-Aufträge strukturiert zu definieren. Codex darf jedoch nur Aufgaben erhalten, die:

- auf einen ausdrücklich freigegebenen Dokumentationspunkt verweisen,
- einen eng begrenzten Umfang besitzen,
- keine offenen fachlichen Entscheidungen vorwegnehmen,
- keine nicht inventarisierten Live-Schreibpfade verändern,
- klare Abnahmekriterien und einen erwarteten Commit-Nachweis enthalten.

## Nächster sinnvoller Codex-Auftrag

Vor weiteren neuen EOS-Modulen ist zuerst ein dokumentations- und read-only-orientierter Repository-Audit sinnvoll:

- alle aktuell vorhandenen EOS-Dokumente und Referenzen inventarisieren,
- tote oder fehlende Verweise erkennen,
- `knowledge/project_brain.md`, `knowledge/README.md`, `knowledge/modules.md`, `knowledge/roadmap.md` und `CHANGELOG.md` mit den neuen EOS-Dokumenten synchronisieren,
- keine produktiven Skripte oder Live-Pfade ändern.

Dieser Auftrag dient der Konsolidierung der Dokumentationsbasis und ist Voraussetzung für die belastbare Auswahl der nächsten fachlichen Modulgrenze.
