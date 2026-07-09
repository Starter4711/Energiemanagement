# System Inventory Export

- Erzeugt am: 2026-07-09T15:14:25.863741+00:00
- System: Darwin 24.6.0 auf MacBookPro.localdomain
- Repo: /Users/richardnussdorfer/Documents/GitHub/Energiemanagement
- Live-iobroker-CLI: nicht verfuegbar in dieser Umgebung

## Enthaltene Exporte

- `iobroker_objects_full.json`: Repository-Export der vorhandenen Objektdateien aus `iobroker/objects/`
- `iobroker_objects_mqtt.json`: gefilterte Referenzliste fuer MQTT-nahe Eintraege
- `iobroker_objects_modbus.json`: gefilterte Referenzliste fuer Modbus-nahe Eintraege
- `iobroker_objects_javascript.json`: gefilterte Referenzliste fuer JavaScript-nahe Eintraege
- `iobroker_objects_userdata.json`: gefilterte Referenzliste fuer `0_userdata.0`
- `iobroker_objects_alias.json`: gefilterte Referenzliste fuer `alias.0`
- `iobroker_objects_vis2.json`: gefilterte Referenzliste fuer VIS2-nahe Eintraege
- `state_snapshot_mqtt.json`: repository-derivierter Referenzstand, kein Live-Snapshot
- `state_snapshot_modbus.json`: repository-derivierter Referenzstand, kein Live-Snapshot
- `state_snapshot_userdata.json`: repository-derivierter Referenzstand, kein Live-Snapshot
- `state_snapshot_javascript.json`: repository-derivierter Referenzstand, kein Live-Snapshot
- `state_snapshot_alias.json`: repository-derivierter Referenzstand, kein Live-Snapshot
- `scripts_inventory.json`: Skriptinventar aus `iobroker/manifest.json`
- `victron_relations.json`: belegbare Zuordnung der Victron-/Venus-/MQTT-Komponenten und IDs
- `victron_inventory_missing.md`: Dokumentation des fehlenden Live-Zugriffs
- `vis2/`: Kopie der versionierten VIS2-Dateien aus `iobroker/vis-2/main/`

## Gefundene Namespaces

- `script`
- `alias`
- `javascript`
- `mqtt`
- `modbus`
- `0_userdata`
- `vis`

## Vollstaendig / unvollstaendig

- Vollstaendig im Sinne des Repository-Exports: `scripts_inventory.json`, `vis2/`, `iobroker_objects_full.json` als lokale Objektdatei-Sammlung
- Teilweise nur referenziell: die gefilterten Objektlisten
- Nicht live verfuegbar: alle `state_snapshot_*.json` sind nur repository-derivierte Referenzen
- Victron / VRM / Venus: nicht live exportierbar, Details in `victron_inventory_missing.md`

## Arbeitsvereinbarung

- Von dir erzeugte ioBroker-Objekte im `mqtt` sind fuer diesen Kontext vorerst nicht relevant.
- Wenn Kommunikationsvariablen zum Cerbo benoetigt werden, pruefen wir zuerst, ob sie bereits existieren.
- Neue Cerbo-Kommunikationsvariablen werden nur nach gemeinsamer Entscheidung angelegt.

## Wichtige Einschraenkung

Die ioBroker-CLI war in dieser Umgebung nicht installiert, deshalb konnte kein echter Live-Export per `iob object list`, `iob object get` oder `iob state get` ausgefuehrt werden.
