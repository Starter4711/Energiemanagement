# ioBroker Skripte

Dieser Ordner enthaelt die Repository-Version der ioBroker-JavaScript-Skripte.

## Struktur

- `scripts/`: versionierte Skripte, die nach ioBroker deployt werden koennen.
- `backups/`: lokale Sicherungen aus dem Live-System, nicht fuer Git gedacht.

## Grundsatz

GitHub ist Referenz und Backup. ioBroker ist das Live-System. Vor jedem Deployment wird der aktuelle Live-Stand gesichert.

## Status

Die Grundverbindung steht bereits:

1. SSH zur Synology funktioniert.
2. Der ioBroker-Docker-Container ist identifiziert.
3. Die vorhandenen Live-Skripte sind nach GitHub exportiert.

## Werkzeuge

Das wichtigste Repo-Werkzeug liegt hier:

- `iobroker/tools/sync_iobroker.py`

Beispiele:

```bash
python3 iobroker/tools/sync_iobroker.py deploy iobroker/scripts/common/Victron_INIT.js
python3 iobroker/tools/sync_iobroker.py backup script.js.common.Victron_INIT
python3 iobroker/tools/sync_iobroker.py delete script.js.common.Codex_Access_Test
```

## Sicherheitsverhalten

- Vor jedem Deploy wird das aktuelle Live-Objekt als JSON unter `iobroker/backups/` gesichert.
- Neue Skripte koennen mit Header-Metadaten direkt aus dem Repo erzeugt werden.
- Das Beispiel `Codex_Access_Test.js` ist standardmaessig deaktiviert und eignet sich zum pruefen des Schreibzugriffs.
