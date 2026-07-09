# Live Inventory

- Exportzeitpunkt: 2026-07-09T16:24:54.949364+00:00
- Host/System: iobroker-iobroker-1-1-1-1 / ioBroker-Container auf Synology
- ioBroker-Version: 7.2.2
- Node-Version: v22.23.1
- JavaScript-Adapter-Version: 9.0.18
- VIS2-Version: 2.13.8
- MQTT-Version: 6.1.4
- Modbus-Version: 8.0.3
- Anzahl Objekte gesamt: 17824
- Anzahl MQTT-Objekte: 9073
- Anzahl Modbus-Objekte: 142
- Anzahl JavaScript-Objekte: 556
- Anzahl Userdata-Objekte: 461
- Anzahl Alias-Objekte: 101

## Erfolgte Exporte
- system_info.json
- adapter_inventory.json
- iobroker_objects_full.json
- iobroker_objects_userdata.json
- iobroker_objects_mqtt.json
- iobroker_objects_modbus.json
- iobroker_objects_alias.json
- iobroker_objects_javascript.json
- iobroker_objects_vis.json
- iobroker_objects_vis2.json
- iobroker_objects_system.json
- iobroker_objects_enum.json
- state_snapshot_userdata.json
- state_snapshot_mqtt.json
- state_snapshot_modbus.json
- state_snapshot_alias.json
- state_snapshot_javascript.json
- enum_inventory.json
- scripts_inventory.json
- vis2_inventory.json
- mqtt_inventory.json
- modbus_inventory.json
- victron_inventory_notes.md
- object_relations.json

## Fehlgeschlagene Exporte
- `iob state list` ist in ioBroker 7.2.2 nicht verfuegbar.
- Exakte Fehlersituation: die `iob state --help` Ausgabe enthaelt keine `list`-Funktion, sondern nur `get`, `getPlain`, `getValue`, `set`, `del`, `setDBVersion` und `getDBVersion`.
- Konsequenz: die State-Exporte wurden stattdessen rein lesend aus `/opt/iobroker/iobroker-data/states.jsonl` des Live-Systems gelesen.

## Verwendete Quellen
- `/opt/iobroker/iobroker-data/objects.jsonl`
- `/opt/iobroker/iobroker-data/states.jsonl`
- `/opt/iobroker/iobroker-data/files/vis-2.0`
