# ioBroker

## Rolle

ioBroker ist das Live-System des Projekts.

## Sichtbare Bausteine

- JavaScript-Skripte unter `script.js.*`
- exportierte Objekte unter `iobroker/objects/`
- Manifest unter `iobroker/manifest.json`
- VIS-2-Projekt unter `iobroker/vis-2/`

## Relevante Objektraeume

- `alias.0`
- `javascript.0`
- `0_userdata.0`
- `mqtt.x`
- `go-e.x`
- `modbus.1`
- `s7.0`
- `telegram.0`

## Manifest-Stand

Laut `iobroker/manifest.json`:

- `70` Objekte
- `67` Skripte
- `2` Channels
- `1` Device

Engine-Typen:

- `55` Blockly
- `12` `Javascript/js`

## Schlussfolgerung

- Der Altbestand dominiert deutlich.
- Neues Energiemanagement wird als handgeschriebenes JavaScript aufgebaut.

## Wichtige Hilfsdateien

- `iobroker/README.md`
- `iobroker/tools/sync_iobroker.py`
- `iobroker/tools/deploy_vis2.py`

## Unklar

- Welche Skripte im Live-System aktuell exakt aktiv sind, ist aus dem Repository allein nicht vollstaendig ableitbar.
