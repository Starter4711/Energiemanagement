# Backup and Rollback

## Grundsatz

- Vor Live-Aenderungen muss ein Backup vorhanden sein.
- Keine Live-Aenderung ohne Rueckweg.
- Rollback muss vor kritischen Aenderungen beschrieben sein.

## Technische Referenzen

- ioBroker-Skripte: Backup ueber `iobroker/tools/sync_iobroker.py`
- VIS2: Backup ueber `iobroker/tools/deploy_vis2.py`

## Einordnung von `manifest.json`

- `iobroker/manifest.json` dokumentiert den exportierten Stand.
- Das Manifest ersetzt keine Live-Pruefung.

## Unklar

- Konkrete Backup-Aufbewahrungsregeln sind noch nicht dokumentiert.
- Der formale Rollback-Testprozess ist noch nicht festgelegt.
