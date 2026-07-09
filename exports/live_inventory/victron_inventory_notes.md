# Victron / Venus / VRM Hinweise

Erzeugt am: 2026-07-09T16:24:54.947601+00:00

## Belegte Live-Zuordnung

- Cerbo ESS: `192.168.0.191` -> `mqtt.1`
- Cerbo BAT: `192.168.0.195` -> `mqtt.2`
- Raspi Venus OS: `192.168.0.153` -> `mqtt.3`
- `mqtt.4`: laut Benutzer nicht verwendet

## Hinweise

- VRM wird fuer ESS und BAT verwendet.
- Die exakten VRM Portal-/Anlagen-IDs wurden aus dieser Umgebung nicht ausgelesen.
- Von dir erzeugte MQTT-Objekte sind fuer diesen Export nicht relevant.
- Cerbo-Kommunikationsvariablen werden nur dann neu angelegt, wenn wir gemeinsam bestaetigen, dass sie noch fehlen.
- Dieser Export ist rein lesend aus dem laufenden ioBroker-System erzeugt worden.
