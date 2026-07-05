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

## Moegliche Zugriffsmethoden

### Option A: ioBroker CLI im Docker-Container

Wenn Codex per SSH auf die Synology oder direkt in den Container zugreifen darf, koennen Skripte ueber die ioBroker-CLI verwaltet werden.

Vorteile:

- Nahe am ioBroker-System.
- Gut fuer Backup, Restore und Adapter-Checks.

Offene Punkte:

- SSH-Zugang zur Synology.
- Containername oder Docker-Compose-Service.
- Verfuegbare ioBroker-CLI-Befehle im Container.

### Option B: ioBroker Admin/API

Wenn ioBroker Admin erreichbar ist und eine passende API bereitsteht, koennen Skripte ueber HTTP verwaltet werden.

Vorteile:

- Kein direkter SSH-Zugriff noetig.
- Gut automatisierbar.

Offene Punkte:

- URL und Port.
- Authentifizierung.
- Aktivierte Adapter und API-Endpunkte.

### Option C: Dateisystem- oder Volume-Sync

Wenn die Skripte in einem Docker-Volume oder gemounteten Pfad liegen, koennen sie ueber Dateien synchronisiert werden.

Vorteile:

- Git-nahe Arbeitsweise.
- Einfache Backups.

Offene Punkte:

- Pfadstruktur im Container/Volume.
- Ob ioBroker Dateiaenderungen live erkennt oder ein Adapter-Neustart noetig ist.

## Naechster sicherer Schritt

1. Verbindungsmethode festlegen.
2. Nur lesend pruefen, ob ioBroker erreichbar ist.
3. Vorhandene Skripte sichern und ins Repository importieren.
4. Ein kleines Testskript aus dem Repository nach ioBroker deployen.
5. Danach den normalen Workflow fuer Anlegen, Aendern und Loeschen definieren.
