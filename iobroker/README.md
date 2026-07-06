# ioBroker Skripte

Dieser Ordner enthaelt die Repository-Version der ioBroker-JavaScript-Skripte.

## Struktur

- `scripts/`: versionierte Skripte, die nach ioBroker deployt werden koennen.
- `backups/`: lokale Sicherungen aus dem Live-System, nicht fuer Git gedacht.

## Grundsatz

GitHub ist Referenz und Backup. ioBroker ist das Live-System. Vor jedem Deployment wird der aktuelle Live-Stand gesichert.

Bestehende ioBroker-Skripte werden nicht inhaltlich veraendert. Das neue Energiemanagement lebt in neuen Skripten unter `iobroker/scripts/energiemanagement/`. Bestehende Skripte duerfen bei Bedarf nur aktiviert oder deaktiviert werden.

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
python3 iobroker/tools/sync_iobroker.py deploy iobroker/scripts/energiemanagement/Beispiel.js
python3 iobroker/tools/sync_iobroker.py backup script.js.common.Victron_INIT
python3 iobroker/tools/sync_iobroker.py set-enabled script.js.common.Victron_INIT false
python3 iobroker/tools/sync_iobroker.py delete script.js.energiemanagement.Beispiel
```

## Sicherheitsverhalten

- Vor jedem Deploy wird das aktuelle Live-Objekt als JSON unter `iobroker/backups/` gesichert.
- Nur neue Skripte unter `iobroker/scripts/energiemanagement/` duerfen per Deploy inhaltlich erstellt oder aktualisiert werden.
- Bestehende Skripte werden ueber `set-enabled` nur an- oder ausgeschaltet.
