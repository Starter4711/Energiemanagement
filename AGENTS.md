# AGENTS.md

## Zweck

Diese Datei ist der verbindliche Einstieg fuer zukuenftige Codex-Tasks in diesem Repository. Sie definiert die Reihenfolge des Einlesens, die Arbeitsregeln fuer Aenderungen und die Grenzen fuer sichere Eingriffe in ein produktives Smart-Home- und Energiemanagement-System.

## Pflichtablauf fuer jeden neuen Task

1. Immer zuerst `AGENTS.md` lesen.
2. Danach `knowledge/README.md` als Einstieg in die Knowledge Base lesen.
3. Danach `docs/project_analysis.md` lesen.
4. Danach die fuer den Task relevanten Dateien unter `knowledge/` lesen, insbesondere die dort als fuehrend markierten Themen- und Detaildateien.
5. Bei Skript-, Aktivierungs- oder ioBroker-Bestandsfragen zusaetzlich `iobroker/manifest.json` als Referenz pruefen.
6. Erst dann Code, Objekte, VIS-2 oder Deployment-Werkzeuge oeffnen oder aendern.
7. Vor jeder Aenderung `knowledge/engineering_process.md` pruefen.
8. Vor live-nahen Aenderungen `knowledge/backup_and_rollback.md` pruefen.
9. Bei neuen oder geaenderten Skripten `knowledge/script_logging_policy.md` pruefen.
10. Relevante Aenderungen muessen `CHANGELOG.md` aktualisieren.
11. Architektur-Review durch ChatGPT ist das Gate vor fachlicher Freigabe.

Mindestens diese Wissensdateien sind vor inhaltlichen Aenderungen zu pruefen:

1. `knowledge/project.md`
2. `knowledge/architecture.md`
3. `knowledge/modules.md`
4. `knowledge/coding_rules.md`
5. `knowledge/open_questions.md`

Je nach Thema zusaetzlich:

- `knowledge/mqtt.md` bei MQTT-, Victron-, Wallbox- oder Datenpunktarbeit
- `knowledge/iobroker.md` bei States, Objekten, Skripten oder Deployment
- `knowledge/victron.md` bei ESS, BAT, Cerbo, SmartShunt oder Batterie
- `knowledge/docker.md` bei SSH-, Docker- oder Synology-Bezug
- `knowledge/hardware.md` bei Hardware- oder Messpunktbezug
- `knowledge/decisions.md` vor Architektur- oder Verhaltensaenderungen

## Projektkontext in Kurzform

- GitHub ist Referenz, Historie und Backup.
- ioBroker ist das Live-System.
- Das Repository enthaelt Altbestand unter `iobroker/scripts/common/` und neue Logik unter `iobroker/scripts/energiemanagement/`.
- Ressourcenschonung hat Vorrang.
- Unklare Informationen duerfen nicht geraten werden.

## Verbindliche Arbeitsregeln

- Bestehende Skripte unter `iobroker/scripts/common/` nicht inhaltlich aendern, sofern dies nicht ausdruecklich gefordert ist.
- Neue Energiemanagement-Logik nur unter `iobroker/scripts/energiemanagement/` anlegen oder erweitern.
- Kleine, eng begrenzte Aenderungen gegenueber grossen Umbauten bevorzugen.
- Keine neuen Features bauen, wenn der Task nur Analyse, Dokumentation oder gezielte Korrektur verlangt.
- Bestehende MQTT-Topics, ioBroker-States, Objekt-IDs, Alias-Pfade, Device-IDs, Adapterinstanzen und Hardware-Zuordnungen nicht ohne ausdrueckliche Freigabe aendern.
- Keine Platzhalter einbauen.
- Keine TODO-Dummyfunktionen, Scheinimplementierungen oder leeren Handler anlegen.
- Keine Informationen raten. Wenn etwas nicht belegt ist: `Unklar`.
- Vor Live-Aenderungen Backups anlegen.
- Vor jedem Commit `git diff` pruefen.
- Bei jeder relevanten Aenderung die passende Dokumentation in `knowledge/`, `AGENTS.md` oder `docs/project_analysis.md` mitpflegen, sofern sich der dokumentierte Stand aendert.

## Besondere Vorsichtspunkte

- MQTT-Steuerpfade koennen Live-Wirkung auf Victron-Systeme haben.
- go-e-Steuerung und HTTP-Phasenumschaltung koennen reale Lasten schalten.
- Pool-Steuerung arbeitet mit Siemens LOGO / S7 und ist produktiv gekoppelt.
- Falsche Alias-, Modbus-, MQTT- oder S7-Pfade koennen direkt auf das Live-System wirken.

## Wichtige Arbeitsbereiche

- `docs/`: Projektwissen, Analysen, Fach- und Betriebsdokumentation
- `knowledge/`: dauerhafte AI-Knowledge-Base fuer neue Codex-Sitzungen
- `iobroker/manifest.json`: Referenz fuer den exportierten ioBroker-Skriptbestand
- `iobroker/scripts/common/`: exportierter Altbestand, ueberwiegend Blockly
- `iobroker/scripts/energiemanagement/`: neuer modularer JavaScript-Code
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

## Technische Einstiege

- Skript-Deployment: `iobroker/tools/sync_iobroker.py`
- VIS-2-Deployment: `iobroker/tools/deploy_vis2.py`
- VIS-2-Build: `iobroker/vis-2/build_vis.py`

## Dokumentationsregel

Wenn neue gesicherte Erkenntnisse entstehen, sollen sie an passender Stelle in der Wissensbasis nachgetragen werden. Wenn ein Punkt weiterhin nicht gesichert ist, bleibt die Kennzeichnung `Unklar` bestehen.

## Hinweis zum Erkenntnisstand

Diese Wissensbasis basiert primaer auf `docs/project_analysis.md`. Informationen, die dort als `Unklar` markiert sind oder sich aus dem Repository nicht sicher belegen lassen, duerfen in Folgearbeiten nicht als geklaert behandelt werden.
