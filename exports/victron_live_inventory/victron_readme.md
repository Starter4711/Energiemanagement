# Victron Live Inventory

- Exportzeitpunkt: 2026-07-09T16:35:35.712487+00:00
- Cerbo/Venus OS Version falls verfügbar: null
- MQTT erreichbar: ja
- DBus erreichbar: nur indirekt über live MQTT-Mirror, kein direkter DBus-Zugriff aus dieser Umgebung verifiziert
- Anzahl Topics: 7020
- Anzahl DBus-Pfade: 6368
- Anzahl Control Candidates: 3948
- Anzahl SAFE_RUNTIME: 7
- Anzahl CAUTION: 278
- Anzahl FORBIDDEN: 2817

## Erzeugte Dateien

- victron_mqtt_topics_full.json
- victron_dbus_paths_full.json
- victron_control_candidates.json
- victron_safe_runtime_candidates.json
- victron_forbidden_or_caution_paths.json
- victron_ess_control_inventory.json
- victron_services_inventory.json
- victron_readme.md

## Fehler / Hinweise

- `iob state list` ist in ioBroker 7.2.2 nicht verfügbar; darum wurden die Live-Werte aus `states.jsonl` gelesen.
- DBus wurde nicht direkt per dbus-CLI abgefragt; die DBus-Pfade sind aus dem live verfügbaren Venus-MQTT-Mirror abgeleitet.
- Alles wurde nur lesend erzeugt.
- Kein Publish auf `W/...` wurde ausgeführt.
