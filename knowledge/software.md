# Software

## Verwendete Technologien

- JavaScript fuer ioBroker-Skripte
- Python 3 fuer Deployment- und Backup-Tools
- JSON fuer Objekt- und Manifestdaten
- HTML/CSS fuer VIS-2
- SSH fuer Fernzugriff
- Docker als Laufzeit fuer ioBroker
- MQTT als Kommunikationsbus
- S7 fuer Siemens-LOGO-Kommunikation
- ioBroker JavaScript-Adapter
- ioBroker VIS-2

## Sichtbare Softwarestruktur

- kein Node.js-Projektsetup
- keine `package.json`
- keine `requirements.txt`
- kein `Dockerfile`
- kein `docker-compose.yml`

## Python-Komponenten

- `iobroker/tools/sync_iobroker.py`
- `iobroker/tools/deploy_vis2.py`
- `iobroker/vis-2/build_vis.py`

## Adapter- und Integrationsabhaengigkeiten

- MQTT-Adapter
- S7-Adapter
- Modbus-Adapter
- go-e-Adapter
- Telegram-Adapter
- VIS-2
- vermutlich Javascript-Adapter

## Weitere im Altbestand referenzierte Adapter

- `renault.0`
- `shelly.0`
- `fritzdect.0`
- `life360.0`
- `places.0`
- `iot.0`
- `admin.0`

## Unklar

- Vollstaendige Versionen aller Adapter und Laufzeiten sind im Repository nicht dokumentiert.
