# AGENTS.md

## Zweck

Diese Datei ist der Einstieg fuer zukuenftige Codex-Tasks in diesem Repository. Sie verweist auf die dauerhafte Wissensbasis unter `knowledge/` und auf die technische Primäranalyse in `docs/project_analysis.md`.

## Primärquellen

Bei neuen Tasks zuerst diese Dateien lesen:

1. `docs/project_analysis.md`
2. `knowledge/project.md`
3. `knowledge/architecture.md`
4. `knowledge/modules.md`
5. `knowledge/coding_rules.md`
6. `knowledge/open_questions.md`

## Harte Projektregeln

- Bestehende Skripte unter `iobroker/scripts/common/` nicht inhaltlich aendern, sofern nicht explizit angefordert.
- Neue Energiemanagement-Logik nur unter `iobroker/scripts/energiemanagement/` anlegen.
- GitHub ist Referenz und Backup.
- ioBroker ist das Live-System.
- Vor Live-Aenderungen Backups anlegen.
- Keine Hardware-, Objekt- oder Adapterzuordnungen raten.
- Wenn Information fehlt: `Unklar` schreiben.
- Ressourcenschonung hat Vorrang.

## Wichtige Arbeitsbereiche

- `docs/`: Projektwissen und Analysen
- `knowledge/`: dauerhafte AI-Knowledge-Base
- `iobroker/scripts/common/`: exportierter Altbestand
- `iobroker/scripts/energiemanagement/`: neuer Code
- `iobroker/objects/`: exportierte ioBroker-Objekte
- `iobroker/tools/`: Deployment- und Backup-Werkzeuge
- `iobroker/vis-2/`: versionierte VIS-2-Quellen

## Wissensbasis

- Projektueberblick: `knowledge/project.md`
- Architektur: `knowledge/architecture.md`
- Module: `knowledge/modules.md`
- Hardware: `knowledge/hardware.md`
- Software und Technologien: `knowledge/software.md`
- MQTT: `knowledge/mqtt.md`
- ioBroker: `knowledge/iobroker.md`
- Victron: `knowledge/victron.md`
- Docker und Deployment: `knowledge/docker.md`
- Coding-Regeln: `knowledge/coding_rules.md`
- Entscheidungen: `knowledge/decisions.md`
- Roadmap: `knowledge/roadmap.md`
- Offene Fragen: `knowledge/open_questions.md`

## Empfohlene Reihenfolge fuer neue Analysen oder Implementierungen

1. `docs/project_analysis.md` lesen
2. `knowledge/open_questions.md` auf Unsicherheiten pruefen
3. relevanten Fachbereich in `knowledge/*.md` lesen
4. erst danach Dateien im Codebereich oeffnen oder aendern

## Technische Einstiege

- Skript-Deployment: `iobroker/tools/sync_iobroker.py`
- VIS-2-Deployment: `iobroker/tools/deploy_vis2.py`
- VIS-2-Build: `iobroker/vis-2/build_vis.py`

## Hinweis zum Erkenntnisstand

Diese Wissensbasis basiert primaer auf `docs/project_analysis.md`. Wenn Informationen dort als `Unklar` markiert sind, sollen sie auch in Folgearbeiten nicht als geklaert behandelt werden.
