# Victron Live Inventory - Hinweise

Erzeugt am: 2026-07-09T16:35:35.714184+00:00

## Was direkt live belegt ist

- MQTT-Livezugriff auf den ioBroker-Container ist vorhanden.
- Victron-/Venus-Mirror-Daten aus `mqtt.1`, `mqtt.2` und `mqtt.3` sind lesbar.
- VM / Cerbo ESS und BAT sind im Topic-Mirror erkennbar.

## Was nicht direkt verifiziert wurde

- Direktes DBus-Reading aus Victron OS wurde aus dieser Umgebung nicht aufgerufen.
- Die DBus-Pfade in diesem Export sind aus dem MQTT-Mirror abgeleitet.
- Exakte VRM Portal-/Anlagen-IDs wurden nicht live ausgelesen.

## Sicherheitsrahmen

- Keine Writes.
- Keine `W/...` Publishes.
- Keine persistenten Settings geändert.
