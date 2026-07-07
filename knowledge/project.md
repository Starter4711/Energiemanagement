# Projekt

## Kurzbeschreibung

Das Repository dokumentiert und versioniert ein privates Smart-Home- und Energiemanagement-Projekt mit ioBroker als Laufzeitumgebung. GitHub ist Referenz, Historie und Backup. ioBroker ist das Live-System.

## Fachliche Schwerpunkte

- Energiemanagement ueber drei Zaehlpunkte
- Victron-ESS/BAT-Steuerung ueber MQTT
- Batterieueberwachung mit SmartShunt, Pace-BMS und HELTEC
- Wallboxsteuerung fuer go-e-Charger
- Poolsteuerung ueber Siemens LOGO / S7
- VIS-2 fuer Batterie- und Poolansichten

## Grundstruktur

- `docs/`: Dokumentation und Analysen
- `iobroker/`: exportierte ioBroker-Bestaende, Tools und VIS-2
- `knowledge/`: dauerhafte Wissensbasis fuer zukuenftige AI-Tasks

## Projektstatus

Im Repository existieren parallel:

- ein umfangreicher Altbestand unter `iobroker/scripts/common/`
- neue, modulare Skripte unter `iobroker/scripts/energiemanagement/`
- Python-Werkzeuge fuer Backup und Deployment

## Quelle

- Primaerquelle: `docs/project_analysis.md`
