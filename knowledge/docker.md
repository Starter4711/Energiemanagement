# Docker

## Rolle

ioBroker laeuft laut Repository nicht lokal im Projektordner, sondern in einem Docker-Container auf einer Synology.

## Sichtbare Deployment-Struktur

- Zugriff per SSH auf den Host
- anschliessend `docker exec` in den ioBroker-Container

## Standardwerte aus den Python-Tools

- Host: `192.168.0.20`
- User: `Richard`
- Container: `iobroker-iobroker-1-1-1-1`

## Deployment-Pfade

- Skripte: ueber ioBroker-CLI im Container
- VIS-2: ueber ioBroker-Dateispeicher im Container

## Backup-Struktur

- lokale Skript-Backups: `iobroker/backups/<timestamp>/`
- VIS-2-Live-Backups: `vis-2.0/backups/main-<timestamp>.json`

## Nicht vorhanden

- kein `Dockerfile`
- kein `docker-compose.yml`
- keine dokumentierte Container-Build-Konfiguration

## Unklar

- Vollstaendige Containerlandschaft auf der Synology ist im Repository nicht dokumentiert.
