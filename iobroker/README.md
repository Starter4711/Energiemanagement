# ioBroker Skripte

Dieser Ordner enthaelt die Repository-Version der ioBroker-JavaScript-Skripte.

## Struktur

- `scripts/`: versionierte Skripte, die nach ioBroker deployt werden koennen.
- `backups/`: lokale Sicherungen aus dem Live-System, nicht fuer Git gedacht.

## Grundsatz

GitHub ist Referenz und Backup. ioBroker ist das Live-System. Vor jedem Deployment wird der aktuelle Live-Stand gesichert.

## Status

Die technische Verbindung zur Synology wird als Naechstes eingerichtet:

1. SSH-Verbindung testen.
2. ioBroker-Docker-Container identifizieren.
3. JavaScript-Adapter und vorhandene Skripte nur lesend pruefen.
4. Live-Skripte importieren.
5. Erstes Testskript deployen.
