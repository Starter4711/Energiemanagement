# ioBroker Integration

## Schnellstart fuer neue Chats

1. Zuerst lesen: `AGENTS.md`
2. Dann lesen: `knowledge/project_brain.md`
3. Dann lesen: `knowledge/README.md`
4. Dann lesen: `docs/project_analysis.md`
5. Dann lesen: `knowledge/iobroker.md`
6. Fuer Live-Deploy nur noch den festen Helper benutzen:
   `IOBROKER_SUDO_PASSWORD='...' bash iobroker/tools/deploy_eos_live.sh`

Merke:

- Host: `192.168.0.20`
- SSH-User: `Richard`
- SSH-Key: `work/secrets/synology_iobroker_key_live`
- Container: `iobroker-iobroker-1-1-1-1`
- Passwoerter nie ins Repository schreiben
- Private Keys nie ins Repository schreiben
- Wenn ein Live-Objekt fehlt, legt der Helper es selbst minimal an und setzt danach die EOS-Eigenschaften

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

## Operative Referenz fuer wiederkehrende Codex-Deployments

Damit ein neuer Codex-Chat nicht wieder nach den gleichen Details suchen muss, sind hier die aktuell benoetigten Bausteine knapp zusammengefasst.

### Live-Zugriff

- Host: `192.168.0.20`
- SSH-Zugang: `work/secrets/synology_iobroker_key_live`
- Bekannte Benutzer aus den bisherigen Versuchen:
  - `Richard`
  - `admin`
- ioBroker-Container: `iobroker-iobroker-1-1-1-1`
- `Richard` muss auf der Synology per SSH anmelden koennen und Docker per `sudo` ausfuehren duerfen.
- Das fuer `sudo` benoetigte Passwort gehoert nicht ins Repository, sondern nur in den lokalen Passwortmanager oder eine lokale Notiz.
- Der Live-Container akzeptiert fuer Docker-Aufrufe in diesem Setup den Weg `echo '$IOBROKER_SUDO_PASSWORD' | sudo -S /usr/local/bin/docker exec -i ...`.
- Der bisherige `sudo -n`-Weg war fuer VIS2 nicht robust genug und fuehrte dazu, dass Deployments zwar lokal liefen, aber im Live-System keine gueltige Schreiboperation ausgeloest wurde.

Der Zugriff funktioniert nur, wenn SSH-Schluessel und Benutzer auf der Synology wirklich zusammenpassen und `sudo` fuer Docker erlaubt ist. Ohne diesen funktionierenden SSH-/Sudo-Schritt kann weder der ioBroker-Container noch das VIS2-Deployment erreicht werden.

### Skript-Deployment

Fuer ioBroker werden die JavaScript-Dateien aus `iobroker/scripts/energiemanagement/` deployt. Das bisherige Werkzeug `iobroker/tools/sync_iobroker.py` bleibt als Referenz erhalten, aber der robuste Live-Pfad ist jetzt `iobroker/tools/deploy_eos_live.sh`.

Der praktische Lauf sieht so aus:

```bash
IOBROKER_SUDO_PASSWORD='lokal-im-passwortmanager' bash iobroker/tools/deploy_eos_live.sh
```

Dabei gelten diese festen Umgebungsvariablen:

```text
IOBROKER_HOST=Richard@192.168.0.20
IOBROKER_SSH_KEY=work/secrets/synology_iobroker_key_live
IOBROKER_CONTAINER=iobroker-iobroker-1-1-1-1
IOBROKER_SUDO_PASSWORD=...nur lokal...
```

### JSON- und Objektdateien

Die folgenden Repository-Dateien sind fuer den Abgleich wichtig:

- `iobroker/manifest.json` als Skriptinventar
- `iobroker/objects/*.json` als exportierte ioBroker-Objekte und Sollstand
- `iobroker/scripts/energiemanagement/*.js` als fuehrende Logik
- `iobroker/tools/deploy_eos_live.sh` als robuster Live-Deploy-Helper

Wenn der Objektbaum im Live-System wieder falsch aufgebaut wird, reicht das Repo alleine nicht; dann muss die Live-Version der Skripte und Objekt-Eigenschaften neu deployt werden.

Wichtige Live-Erkenntnis:

- Der reine Repository-Stand reicht nicht aus, wenn ein Script im Kopf `// enabled: False` traegt.
- In diesem Fall existiert die Datei zwar im Repo, aber der ioBroker-Objektstatus startet nicht aktiv.
- Genau das war bei `Battery_Supervisor_V1`, `Battery_Health_V1` und `Energy_Flow_V1` der Grund fuer `undefined` in VIS2.
- Fuer produktive EOS-Views muessen diese Kernskripte aktiv sein, damit `0_userdata.0.EOS.*` tatsaechlich befuellt wird.

Wichtig fuer die Objekt-Logik:

- fehlende Script-Objekte werden im Live-Deploy-Helper minimal neu angelegt
- anschliessend werden `common.source`, `common.enabled`, `common.name` und `common.engineType` direkt gesetzt
- `script.js.energiemanagement.Debug` wurde im Live-System erst nachtraeglich neu angelegt
- der reine Full-JSON-Transport war im Live-Test zu fehleranfaellig, deshalb bleibt der Helper auf die direkte Property-/Source-Variante
- komplette Objektbloecke werden in der Doku und im Repo behalten, fuer den Live-Pfad wird aber der geringere, robuste Schreibweg verwendet

### VIS2

VIS2 liegt als HTML/CSS/JSON im Repo:

- `iobroker/vis-2/main/dashboard.html`
- `iobroker/vis-2/main/battery.html`
- `iobroker/vis-2/main/pool.html`
- `iobroker/vis-2/main/vis-user.css`
- `iobroker/vis-2/main/vis-views.json`

Die Pflegequelle ist die jeweilige HTML-Datei; `vis-views.json` ist das generierte Exportartefakt. Wenn `vis-views.json` nach einer Aenderung nicht mehr parsebar ist, zuerst den HTML-Inhalt und dann die JSON-Syntax pruefen.

Der Live-Deploy fuer VIS2 schreibt:

- `iobroker/vis-2/main/vis-views.json` nach `/opt/iobroker/iobroker-data/files/vis-2.0/main/vis-views.json`
- `iobroker/vis-2/main/vis-user.css` nach `/opt/iobroker/iobroker-data/files/vis-2.0/main/vis-user.css`

Der stabile Deploy-Pfad fuer VIS2 ist `iobroker/tools/deploy_vis2.py` mit diesen festen lokalen Parametern:

```text
IOBROKER_VIS2_HOST=Richard@192.168.0.20
IOBROKER_VIS2_CONTAINER=iobroker-iobroker-1-1-1-1
IOBROKER_VIS2_SSH_KEY=work/secrets/synology_iobroker_key_live
IOBROKER_SUDO_PASSWORD=...nur lokal...
```

Der Helper muss den Live-Schreibweg ueber Docker und sudo verwenden. Nur so landet das Projekt im ioBroker-Dateispeicher und nicht nur im lokalen Container-Filesystem.

Das heisst praktisch:

- die HTML-Dateien bleiben die Pflegequelle
- `vis-views.json` ist der versionierte Exportstand
- VIS2 wird nur auf EOS-States ausgerichtet, nicht auf Rohquellen
- keine Steuerlogik in VIS2

### Aktuelle Ursache fuer `undefined` in VIS2

Wenn VIS2 laedt, aber Werte als `undefined` zeigt, ist der erste Pruefpunkt nicht das Layout, sondern der Live-Objektbaum:

1. Ist `script.js.energiemanagement.Battery_Supervisor_V1` aktiv?
2. Ist `script.js.energiemanagement.Battery_Health_V1` aktiv?
3. Ist `script.js.energiemanagement.Energy_Flow_V1` aktiv?
4. Werden die EOS-States unter `0_userdata.0.EOS.Battery.*` und `0_userdata.0.EOS.EnergyFlow.*` wirklich befuellt?

In diesem Projekt war die konkrete Ursache: Die Skripte waren im Live-Stand vorhanden, aber mit deaktiviertem Header exportiert. Dadurch blieb VIS2 sichtbar, aber mehrere Werte waren leer.

### JSON-/HTML-Werkzeuge

- JSON im Repo immer mit valider Syntax pruefen, bevor deployt wird.
- HTML-Ansichten in VIS2 sollten nur auf EOS-States zeigen, nicht auf Rohquellen.
- Keine Steuerlogik in VIS2 einbauen.
- Bei Vue/JS gibt es hier nichts zu suchen; das Projekt nutzt fuer VIS2 einfache HTML-basierte Views.

### Merksatz fuer den naechsten Chat

Wenn EOS in ioBroker „nicht live“ wirkt, ist die Reihenfolge immer:

1. SSH-Zugang pruefen
2. Container erreichen
3. Skripte und ihre Live-Eigenschaften deployen
4. Fehlende Script-Objekte im Live-System neu anlegen
5. VIS2 deployen
6. Objektbaum und Anzeige im Live-System pruefen
