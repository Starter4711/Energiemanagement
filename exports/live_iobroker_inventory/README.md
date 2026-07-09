# Live ioBroker Inventory

- Exportzeitpunkt: 2026-07-09T15:54:07.204235+00:00
- Host/System: 192.168.0.20 / ioBroker-Container auf Synology
- ioBroker-Version: 7.2.2
- Anzahl Objekte gesamt: 17621
- Anzahl MQTT-Objekte: 9042
- Anzahl Modbus-Objekte: 142
- Anzahl JavaScript-Objekte: 556
- Anzahl Userdata-Objekte: 461
- Anzahl Alias-Objekte: 101

## Erfolgte Exporte
- iobroker_objects_full.json
- iobroker_objects_mqtt.json
- iobroker_objects_modbus.json
- iobroker_objects_javascript.json
- iobroker_objects_userdata.json
- iobroker_objects_alias.json
- iobroker_objects_vis2.json
- state_snapshot_mqtt.json
- state_snapshot_modbus.json
- state_snapshot_javascript.json
- state_snapshot_userdata.json
- state_snapshot_alias.json
- scripts_inventory.json
- adapter_inventory.json
- vis2_inventory.json
- victron_inventory_notes.md

## Fehlgeschlagene Exporte
- `iob state list` ist in ioBroker 7.2.2 nicht verfuegbar; die State-Exporte wurden stattdessen aus `states.jsonl` des Live-Systems gelesen.

## Verwendete Quellen
- `/opt/iobroker/iobroker-data/objects.jsonl`
- `/opt/iobroker/iobroker-data/states.jsonl`
- `/opt/iobroker/iobroker-data/files/vis-2.0`
