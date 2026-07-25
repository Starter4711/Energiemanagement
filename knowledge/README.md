# Knowledge Base

## Zweck

Diese Knowledge Base sammelt verdichtetes, dauerhaftes Engineering-Wissen fuer neue Codex-Sitzungen im Repository `Starter4711/Energiemanagement`.
Sie ist die zentrale Navigationsseite fuer Architektur, Hardware, Victron, MQTT, ioBroker, Energiestrategie und Entscheidungen.

## Verbindliche Lesereihenfolge

1. Immer zuerst `AGENTS.md` lesen.
2. Danach `knowledge/project_brain.md` lesen.
3. Danach `knowledge/README.md` lesen.
4. Danach `docs/project_analysis.md` lesen.
5. Danach die fuer die konkrete Aufgabe relevanten Dateien unter `knowledge/` lesen.
6. Bei Skript-, Aktivierungs- oder ioBroker-Bestandsfragen zusaetzlich `iobroker/manifest.json` lesen.

## Fuehrende Quellen

- `AGENTS.md`: verbindlicher Einstieg und Arbeitsreihenfolge
- `knowledge/project_brain.md`: verbindlicher Projektkontext, freigegebener Stand und Entwicklungsprozess
- `knowledge/README.md`: zentrale Navigation der Knowledge Base
- `knowledge/eos_documentation_status.md`: Abschlussstatus der EOS-Dokumentationsphase
- `knowledge/decisions.md`: gesicherte Entscheidungen und dauerhafte Engineering-Festlegungen
- `knowledge/open_questions.md`: offene oder noch nicht gesicherte Punkte
- `docs/project_analysis.md`: Analyse- und Kontextgrundlage

## Kurzbeschreibungen der Knowledge-Dateien

- `project_brain.md`: verbindlicher Gesamtprojektkontext fuer ChatGPT und Codex
- `eos_documentation_status.md`: Abschluss, Reichweite und Grenzen der EOS-Dokumentation
- `project.md`: kompakter Projektueberblick, Fachschwerpunkte und Grundstruktur
- `architecture.md`: Gesamtarchitektur, Hauptbereiche und grobe Daten- und Steuerpfade
- `battery_architecture.md`: gemeinsame Batteriearchitektur, Rollen und Risiken
- `coding_rules.md`: verbindliche Arbeits-, Architektur-, Deployment- und Zahlenformat-Regeln
- `control_hierarchy.md`: Prioritaet von Hardware, Cerbo, ioBroker, MQTT, Node-RED und VIS2
- `decisions.md`: gesicherte Entscheidungen und Entscheidungstagebuch
- `engineering_process.md`: verbindlicher Standardablauf fuer Aenderungen
- `backup_and_rollback.md`: Backup- und Rollback-Grundsaetze
- `changelog_policy.md`: Regelwerk fuer `CHANGELOG.md` und Dokumentationshistorie
- `design_principles.md`: uebergeordnete Architekturprinzipien und Schutzregeln
- `docker.md`: Docker- und Deployment-Rahmen mit Host-, Container- und Backup-Hinweisen
- `energy_strategy.md`: Energie- und Batteriestrategie, Ladephilosophie und Schutzbezug
- `hardware.md`: Hardwareinventar und referenzierte Geraetegruppen
- `hardware_topology.md`: Zaehlpunkte, physische Topologie und topologische Kernaussagen
- `iobroker.md`: ioBroker-Rolle, sichtbare Bausteine und relevante Objektraeume
- `modules.md`: gruppierte Sicht auf Dokumentations-, Altbestand-, Neu- und Tool-Module
- `mqtt.md`: MQTT-Rolle, Instanzen, Topic-Familien und bekannte Nutzungen
- `open_questions.md`: gesammelte ungeklaerte Punkte und noch fehlende Live-System-Nachweise
- `roadmap.md`: abgeschlossene Dokumentationsphase und modulbezogener Folgeprozess
- `script_logging_policy.md`: Logging-Grundsaetze fuer neue produktive Skripte
- `software.md`: verwendete Technologien, sichtbare Softwarestruktur und Integrationen
- `victron.md`: kompakte Victron-Grundlage mit Skriptfamilien und Leitregeln
- `victron_venus_structure.md`: Victron-, Cerbo- und Venus-Topologie mit Gateway-Rolle
- `requirements.md`: zentrale fachliche Requirements mit sprechenden IDs und Struktur

## Dokumentationsstandard

- Fachtexte und Requirements verwenden Deutsch mit oesterreichischem Zahlenformat.
- Tausendertrennzeichen ist der Punkt.
- Dezimaltrennzeichen ist der Beistrich.
- Einheitenbeispiele: `1.000 W`, `5,76 kWp`, `15,0 kWh`, `53,2 V`, `100,5 A`.

## Fuehrende Datei je Thema

- Gesamtprojektkontext und freigegebener Stand: `project_brain.md`
- Abschlussstatus der Dokumentationsphase: `eos_documentation_status.md`
- Projektueberblick: `project.md`
- Architekturuebersicht: `architecture.md`
- Moduluebersicht: `modules.md`
- Coding- und Arbeitsregeln: `coding_rules.md`
- Offene Fragen: `open_questions.md`
- Entscheidungen: `decisions.md`
- Engineering-Prozess: `engineering_process.md`
- Backup und Rollback: `backup_and_rollback.md`
- Changelog-Regeln: `changelog_policy.md`
- Hardware-Referenz: `hardware.md`
- Hardware-Topologie und Zaehlpunkte: `hardware_topology.md`
- Batteriearchitektur: `battery_architecture.md`
- Regelungshierarchie: `control_hierarchy.md`
- Energiestrategie: `energy_strategy.md`
- Requirements: `requirements.md`
- Docker und Deployment: `docker.md`
- ioBroker-Rolle und Struktur: `iobroker.md`
- MQTT-Struktur: `mqtt.md`
- Victron-Grundlage: `victron.md`
- Victron- und Venus-Topologie: `victron_venus_structure.md`
- Software-Stack: `software.md`
- Entwicklungs- und Stilprinzipien: `design_principles.md`
- Roadmap und naechste Schritte: `roadmap.md`
- Logging-Regeln fuer neue Skripte: `script_logging_policy.md`

## Rollenabgrenzung

- `docs/` enthaelt Analyse, Fachdetails, Betriebsdokumente und historische oder ausfuehrliche Projektdokumentation.
- `knowledge/` enthaelt verdichtetes, dauerhaftes Engineering-Wissen fuer Architektur, Codex und zukuenftige Entscheidungen.
- `knowledge/requirements.md` ist die zentrale fachliche Anforderungsdatei. Neue Features und relevante Aenderungen sollen darauf verweisen.
- `PROJECT_MEMORY.md` ist historisches Projektgedaechtnis und keine fuehrende Quelle mehr.

## Arbeitsregel

Wenn Informationen zwischen mehreren Dateien ueberschneiden, wird die ergaenzende Datei nicht zur Doppelpflege genutzt, sondern verweist auf die fuehrende Datei.

Offene Punkte in `knowledge/open_questions.md` verhindern den Abschluss der Dokumentationsphase nicht. Sie werden nur bei konkretem fachlichem Bedarf bearbeitet und duerfen nicht als automatische Implementierungsfreigabe interpretiert werden.
