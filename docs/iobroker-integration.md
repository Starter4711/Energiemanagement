# ioBroker Integration

## Ziel

Dieses Projekt soll ioBroker-JavaScript-Skripte verwalten. GitHub ist Referenz und Backup, ioBroker ist das Live-System.

## Zielbild

```text
Repository -> Pruefung -> Deployment -> ioBroker JavaScript Adapter
     ^                                      |
     |                                      v
     +----------- Ruecksicherung/Abgleich --+
```

## Sicherheitsregeln

- Keine Passwoerter, Tokens oder privaten URLs im Repository speichern.
- Live-Aenderungen erst nach einem Lesetest und einem kleinen Testskript durchfuehren.
- Loeschoperationen nur mit expliziter Bestaetigung.
- Vor groesseren Aenderungen Live-Skripte aus ioBroker sichern.
- Bestehende ioBroker-Skripte werden nicht inhaltlich veraendert.
- Vorhandene Skripte duerfen nur aktiviert oder deaktiviert werden, wenn das betrieblich noetig ist.
- Neue Energiemanagement-Logik entsteht in eigenen Skripten unter `script.js.energiemanagement.*`.

## Gewaehlte Zugriffsmethode

### SSH auf Synology plus ioBroker CLI im Docker-Container

Codex greift per SSH auf die Synology zu und fuehrt ioBroker-Befehle anschliessend im Docker-Container aus.

Vorteile:

- Nahe am ioBroker-System.
- Gut fuer Backup, Restore und Adapter-Checks.
- Keine Abhaengigkeit von einer zusaetzlichen Admin/API-Konfiguration.
- Geeignet, um vorhandene Skripte zuerst aus dem Live-System zu sichern.
- Docker- und Adapterzustand koennen vor einem Deployment geprueft werden.

Offene Punkte:

- SSH-Zugang zur Synology.
- Containername oder Docker-Compose-Service.
- Verfuegbare ioBroker-CLI-Befehle im Container.

## Projektstruktur fuer Skripte

```text
iobroker/
  scripts/          Repository-Version der ioBroker-JavaScript-Skripte
  backups/          lokale Live-Backups, nicht fuer Git gedacht
  README.md         Hinweise zum Skript-Workflow
```

## Geplanter Workflow

1. Live-Skripte aus ioBroker lesen und lokal sichern.
2. Relevante Skripte nach `iobroker/scripts/` importieren.
3. Neue Energiemanagement-Skripte im Repository unter `iobroker/scripts/energiemanagement/` bearbeiten und committen.
4. Vor dem Deployment aktuellen Live-Stand erneut sichern.
5. Skript nach ioBroker uebertragen.
6. ioBroker JavaScript-Adapter oder betroffenes Skript pruefen.
7. Ergebnis und naechste Optimierung dokumentieren.

## Lokale Konfiguration

Verbindungsdaten werden lokal gehalten, zum Beispiel in `.env.local`, und bleiben durch `.gitignore` ausserhalb des Repositories.

Beispielwerte:

```text
SYNOLOGY_HOST=192.168.1.10
SYNOLOGY_SSH_USER=admin
IOBROKER_CONTAINER=iobroker
```

## Naechster sicherer Schritt

1. SSH-Verbindung zur Synology testen.
2. Docker-Container fuer ioBroker identifizieren.
3. Nur lesend pruefen, ob ioBroker erreichbar ist.
4. Vorhandene Skripte sichern und ins Repository importieren.
5. Ein kleines Testskript aus dem Repository nach ioBroker deployen.
6. Danach den normalen Workflow fuer Anlegen, Aendern und Loeschen automatisieren.
