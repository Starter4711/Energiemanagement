# Knowledge Base

## Zweck

Diese Knowledge Base ist die dauerhaft gepflegte Engineering-Dokumentation fuer neue Codex-Sitzungen im Repository `Starter4711/Energiemanagement`.
Sie dient als navigierbarer Einstieg in Architektur, Hardware, Victron, MQTT, ioBroker, Energiestrategie und Projektregeln.

## Pflichtreihenfolge

1. Immer zuerst `AGENTS.md` lesen.
2. Danach `knowledge/README.md` lesen.
3. Danach die fuer die konkrete Aufgabe relevanten Detaildateien in `knowledge/` lesen.
4. Bei Architektur- oder Systemfragen zusaetzlich `docs/project_analysis.md` und `docs/system_components.md` lesen.

## Fuehrende Dokumente nach Thema

- Projektkontext und Grundregeln: `project.md`
- Architekturuebersicht: `architecture.md`
- Moduluebersicht: `modules.md`
- Coding- und Arbeitsregeln: `coding_rules.md`
- Offene Fragen: `open_questions.md`
- Entscheidungen: `decisions.md`
- Hardware-Referenz: `hardware.md`
- Hardware-Topologie und Zaehlpunkte: `hardware_topology.md`
- Batteriearchitektur: `battery_architecture.md`
- Regelungshierarchie: `control_hierarchy.md`
- Energiestrategie: `energy_strategy.md`
- Docker und Deployment: `docker.md`
- ioBroker-Rolle und Struktur: `iobroker.md`
- MQTT-Struktur: `mqtt.md`
- Victron-Grundlage: `victron.md`
- Victron- und Venus-Topologie: `victron_venus_structure.md`
- Software-Stack: `software.md`
- Entwicklungs- und Stilprinzipien: `design_principles.md`
- Roadmap und naechste Schritte: `roadmap.md`

## Ueberschneidungen und fuehrende Dateien

### `hardware.md` vs `hardware_topology.md`

- Fuehrend fuer die reine Geraete- und Inventaruebersicht: `hardware.md`
- Fuehrend fuer physische und logische Anordnung der Gesamtanlage: `hardware_topology.md`
- Ergaenzung: `hardware.md` benoemt die Komponenten, `hardware_topology.md` ordnet sie den Zaehlpunkten und Pfaden zu

### `victron.md` vs `victron_venus_structure.md`

- Fuehrend fuer die kompakte Victron-Grunduebersicht: `victron.md`
- Fuehrend fuer die topologische Victron-/Venus-Struktur: `victron_venus_structure.md`
- Ergaenzung: `victron.md` fasst Rolle, Skriptfamilien und Leitregeln zusammen, `victron_venus_structure.md` beschreibt die System- und Gateway-Aufteilung

### `architecture.md` vs `control_hierarchy.md` vs `energy_strategy.md`

- Fuehrend fuer die Gesamtarchitektur: `architecture.md`
- Fuehrend fuer die Regelungs- und Verantwortungshierarchie: `control_hierarchy.md`
- Fuehrend fuer die fachliche Energie- und Batteriestrategie: `energy_strategy.md`
- Ergaenzung: `architecture.md` beschreibt den Systemzuschnitt, `control_hierarchy.md` ordnet Regler und Bruecken ein, `energy_strategy.md` beschreibt die Betriebsziele und Prioritaeten

### `decisions.md` vs `docs/decisions.md`

- Fuehrend fuer dauerhafte Wissensentscheidungen in der Knowledge Base: `knowledge/decisions.md`
- `docs/decisions.md` ist ein separates, projektbezogenes Dokument mit aelteren bzw. begleitenden Entscheidungen
- Ergaenzung: Neue gesicherte Entscheidungen mit dauerhaftem Wissenswert fuer Codex sollen hier dokumentiert werden, waehrend `docs/decisions.md` den Dokumentationskontext in `docs/` abbildet

## Kurzbeschreibungen aller Knowledge-Dateien

- `project.md`: kompakter Projektueberblick, Fachschwerpunkte und Grundstruktur
- `architecture.md`: Gesamtarchitektur, Hauptbereiche und grobe Daten- und Steuerpfade
- `battery_architecture.md`: gemeinsame Batteriearchitektur, Rollen und Risiken
- `coding_rules.md`: verbindliche Arbeits-, Architektur- und Deployment-Regeln
- `control_hierarchy.md`: Prioritaet von Hardware, Cerbo, ioBroker, MQTT, Node-RED und VIS2
- `decisions.md`: gesicherte Entscheidungen, Entscheidungsformat und Entscheidungstagebuch
- `design_principles.md`: uebergeordnete Architekturprinzipien und Schutzregeln
- `docker.md`: Docker- und Deployment-Rahmen mit Host-, Container- und Backup-Hinweisen
- `energy_strategy.md`: Energie- und Batteriestrategie, Ladephilosophie und Schutzbezug
- `hardware.md`: Hardwareinventar und referenzierte Geraetegruppen
- `hardware_topology.md`: Zaehlpunkte, physische Topologie und topologische Kernaussagen
- `iobroker.md`: ioBroker-Rolle, sichtbare Bausteine und relevante Objektraeume
- `modules.md`: gruppierte Sicht auf Dokumentations-, Altbestand-, Neu- und Tool-Module
- `mqtt.md`: MQTT-Rolle, Instanzen, Topic-Familien und bekannte Nutzungen
- `open_questions.md`: gesammelte ungeklaerte Punkte und noch fehlende Dokumentation
- `roadmap.md`: naechste Dokumentations- und Analyse-Schritte
- `software.md`: verwendete Technologien, sichtbare Softwarestruktur und Integrationen
- `victron.md`: kompakte Victron-Grundlage mit Skriptfamilien und Leitregeln
- `victron_venus_structure.md`: Victron-, Cerbo- und Venus-Topologie mit Gateway-Rolle

## Arbeitsregel

Wenn eine Aufgabe ueberlappende Inhalte beruehrt, wird nicht geloescht oder umbenannt, sondern zuerst die fuehrende Datei bestimmt und die ergaenzenden Details dort per Verweis oder Struktur eingeordnet.
