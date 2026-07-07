# Architektur

## Zielbild

Das Projekt trennt zwischen:

- GitHub als Referenz und Backup
- ioBroker als Live-System

## Hauptbereiche

- Dokumentation und Projektwissen
- ioBroker-Skripte Altbestand
- neue Energiemanagement-Skripte
- VIS-2-Oberflaechen
- Python-Deployment-Tools

## Wichtige Architekturbausteine

- `iobroker/scripts/common/`: produktionsnaher Altbestand, ueberwiegend Blockly
- `iobroker/scripts/energiemanagement/`: neuer, modularer JavaScript-Code
- `iobroker/tools/sync_iobroker.py`: Backup und Deployment einzelner Skripte
- `iobroker/tools/deploy_vis2.py`: Backup und Deployment des VIS-2-Projekts
- `iobroker/vis-2/build_vis.py`: Build-Schritt fuer `vis-views.json`

## Daten- und Steuerpfade

- Victron-/VenusOS-Daten kommen ueber MQTT
- Batterie-Rohdaten kommen ueber Modbus und HELTEC-MQTT
- Pool-Aktoren und Sensoren kommen ueber S7
- Wallboxsteuerung erfolgt ueber go-e-Adapterobjekte und HTTP-API fuer Phasenumschaltung

## Grundsatz

Neue Logik soll modular unter `script.js.energiemanagement.*` entstehen. Bestehende Common-Skripte bleiben laut Dokumentation grundsaetzlich unveraendert.

## Unklar

- Vollstaendiges Sollbild aller kuenftigen Module ist noch nicht abschliessend dokumentiert.
