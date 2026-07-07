# Projektanalyse

## 1. Kurzbeschreibung des Projekts

Das Repository dokumentiert und versioniert ein privates Smart-Home- und Energiemanagement-Projekt mit Fokus auf ioBroker als Laufzeitumgebung. GitHub ist laut vorhandener Dokumentation die Referenz, Historie und Backup-Ebene, waehrend ioBroker das Live-System ist.

Eine strukturierte Komponentenuebersicht ist zusaetzlich in [docs/system_components.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/docs/system_components.md) dokumentiert.
Die Knowledge Base startet in [knowledge/README.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/knowledge/README.md).
Die Dokumentations-Governance ist in [knowledge/documentation_governance.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/knowledge/documentation_governance.md) festgehalten.
Die zentrale Architekturuebersicht liegt in [knowledge/system_architecture.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/knowledge/system_architecture.md).
Die Referenz fuer den exportierten ioBroker-Skriptbestand ist [knowledge/iobroker_manifest_reference.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/knowledge/iobroker_manifest_reference.md).
Weitere vertiefende Architektur- und Strategiedokumente liegen unter `knowledge/`, insbesondere zu Hardware-Topologie, Batteriearchitektur, Victron-/Venus-Struktur, Regelungshierarchie, Energiestrategie und Design Principles.

Der fachliche Schwerpunkt liegt auf:

- Energiemanagement ueber drei Zaehlpunkte
- Victron-ESS/BAT-Steuerung ueber MQTT
- Batterieueberwachung auf Basis von SmartShunt, Pace-BMS und HELTEC-Balancern
- Wallboxsteuerung fuer go-e-Charger
- Poolsteuerung ueber Siemens LOGO / S7
- VIS-2-Oberflaechen fuer Batterie- und Poolansichten

Der Repository-Stand zeigt eine Mischlandschaft aus:

- bestehendem Altbestand unter `iobroker/scripts/common/`
- neuen, modulareren Energiemanagement-Skripten unter `iobroker/scripts/energiemanagement/`
- Python-Werkzeugen fuer Deployment und Backup
- projektspezifischer Dokumentation unter `docs/`

## 2. Verzeichnisstruktur

Top-Level-Struktur:

```text
.
├── README.md
├── PROJECT_MEMORY.md
├── docs/
├── iobroker/
├── outputs/
└── work/
```

Relevante Unterstruktur:

```text
docs/
├── bekannte-probleme.md
├── decisions.md
├── energiemanagement-architektur.md
├── energiemanagement-manifest.md
├── go-e-ansteuerung.md
├── iobroker-integration.md
├── ressourcenschonung.md
└── todo.md

iobroker/
├── README.md
├── manifest.json
├── backups/
├── objects/
├── scripts/
│   ├── common/
│   └── energiemanagement/
├── tools/
│   ├── deploy_vis2.py
│   └── sync_iobroker.py
└── vis-2/
    ├── build_vis.py
    └── main/
        ├── dashboard.html
        ├── battery.html
        ├── pool.html
        ├── pool-controls.html
        ├── vis-user.css
        └── vis-views.json
```

Beobachtungen:

- `docs/` enthaelt Architektur-, Betriebs- und Fachwissen.
- `iobroker/scripts/common/` enthaelt den exportierten Altbestand, ueberwiegend Blockly-generierten JavaScript-Code.
- `iobroker/scripts/energiemanagement/` enthaelt neue Skripte in handgeschriebenem JavaScript.
- `iobroker/objects/` enthaelt exportierte ioBroker-Objektdefinitionen als JSON.
- `iobroker/backups/` enthaelt lokale Ruecksicherungen von Live-Objekten.
- `iobroker/vis-2/` enthaelt versionierte VIS-2-Quellen.
- `work/` enthaelt lokale Arbeitsmittel und Secrets. Inhalt und Vollstaendigkeit sind fachlich nicht dokumentiert.

## 3. Hauptmodule und deren Aufgaben

### Dokumentations- und Projektsteuerungsmodul

- `README.md`: sehr kurze Projektbeschreibung.
- `PROJECT_MEMORY.md`: dauerhaftes Projektgedaechtnis und Grundregeln.
- `docs/*.md`: technische Leitlinien, Architektur, Manifest, Risiken, Integrationsregeln.

### ioBroker-Skriptbestand Alt (`iobroker/scripts/common/`)

Hauptgruppen aus Dateinamen und Inhalt:

- `Victron_*`: Initialisierung, Limits, Informationen, Betriebsmodi, Ladegrenzen, MQTT-Kommunikation.
- `go-E_*`: Wallbox-Ladefreigabe, Stromregelung, Phasenumschaltung, Verriegelung, Limits, Debug, Ueberwachung.
- `Gobel_*`: Zellspannungsdiagnose, Modbus-/HELTEC-Aufbereitung und Vergleich.
- `Pool*`: Pooltemperaturen, PV-Ueberschusslogik, Siemens-LOGO-Anbindung, Winter-/Sommerlogik.
- `Grid-*`, `Wolken-*`, `Priority_Management`: Hilfs- und Regelungslogik fuer Netz/PV/Prioritaeten.
- weitere Smart-Home-Skripte wie `Garage.js`, `Hallentore.js`, `Bewässerung.js`, `Rasen.js`, `SmartPlug.js`, `Werkstatt_Hzg.js`, `Smart_BadHzg.js`.

### Neues Energiemanagement (`iobroker/scripts/energiemanagement/`)

- `Config.js`: legt zentrale Konfigurations-Datenpunkte unter `0_userdata.0.Energiemanagement.Config` an.
- `Debug.js`: einfacher Heartbeat und Debug-Zustand.
- `Bilanz_Zaehlpunkte.js`: liest konfigurierte Netzleistungs-IDs und bildet eine saldierte Bilanz.
- `Batterie_Zellspannungen.js`: berechnet je Pack Min/Max, Zellspreizung, Trend und Alarmzustaende.
- `Batterie_BMS_Heltec_Vergleich.js`: vergleicht Pace-BMS-Zellwerte mit HELTEC-Daten je Pack.
- `Pool_VIS2_Zeitplaene.js`: synchronisiert VIS2-Zeitfelder mit `time-switch.0`-Zeitplaenen.
- `Codex_Access_Test.js`: minimales Testskript fuer Deployment.

### VIS-2-Modul

- `build_vis.py`: generiert `vis-views.json` aus HTML-Bausteinen.
- `dashboard.html`: Hauptansicht fuer Netz, PV, Batterie und Pool.
- `battery.html`: Detailansicht fuer Batterie/Zellueberwachung.
- `pool.html`: Detailansicht fuer Poolstatus.
- `pool-controls.html`: Header fuer Pool-Bedienansicht.
- `vis-user.css`: Layout und responsive Gestaltung.

### Deployment- und Backup-Tools

- `sync_iobroker.py`: Deployment, Backup, Enable/Disable und Delete einzelner ioBroker-Skriptobjekte.
- `deploy_vis2.py`: Backup und Deployment der VIS-2-Dateien in den ioBroker-Dateispeicher.

## 4. Verwendete Technologien

Im Repository direkt erkennbar:

- JavaScript fuer ioBroker-Skripte
- Python 3 fuer lokale Verwaltungs- und Deployment-Tools
- JSON fuer ioBroker-Objekte und Manifest
- HTML/CSS fuer VIS-2
- SSH als Fernzugriffspfad
- Docker als Containerlaufzeit fuer ioBroker
- MQTT als zentraler Kommunikationsbus zu Victron-/VenusOS-Systemen und Balancern
- S7 als Schnittstelle zur Siemens LOGO
- ioBroker JavaScript-Adapter als Skriptlaufzeit
- ioBroker VIS-2 als UI-Laufzeit

Nicht als eigene Quelltechnologie im Repository vorhanden:

- kein Node.js-Projektsetup
- keine `package.json`
- keine `requirements.txt`
- kein `Dockerfile`
- kein `docker-compose.yml`

## 5. Python-Komponenten

### `iobroker/tools/sync_iobroker.py`

Aufgabe:

- SSH-Verbindung zur Synology
- `docker exec` in den ioBroker-Container
- Deployment einzelner Skripte
- Backup vorhandener Live-Objekte
- Aktivieren/Deaktivieren vorhandener Skripte
- Loeschen verwalteter Energiemanagement-Skripte
- Pflege von `iobroker/manifest.json`

Wichtige Eigenschaften:

- verwaltet nur Skripte mit Prefix `script.js.energiemanagement.`
- sichert vor Live-Aenderungen das aktuelle Objekt als JSON unter `iobroker/backups/<timestamp>/`
- schreibt lokale Objekt-JSON-Dateien und Manifest-Eintraege
- nutzt Standardbibliothek: `argparse`, `json`, `os`, `re`, `shlex`, `subprocess`, `sys`, `datetime`, `pathlib`

CLI-Kommandos:

- `deploy`
- `backup`
- `delete`
- `set-enabled`

### `iobroker/tools/deploy_vis2.py`

Aufgabe:

- Backup des bestehenden VIS-2-Projekts im ioBroker-Dateispeicher
- Deployment von `vis-views.json` und `vis-user.css`

Wichtige Eigenschaften:

- nutzt SSH plus `sudo -n /usr/local/bin/docker exec`
- legt Backup unter `vis-2.0/backups/main-<timestamp>.json` an
- setzt Besitzrechte auf dem Backup-Verzeichnis im Container

### `iobroker/vis-2/build_vis.py`

Aufgabe:

- Build-Skript fuer die VIS-2-Ansichten
- Zusammensetzen mehrerer HTML-Fragmente in ein `vis-views.json`

Wichtige Eigenschaften:

- keine externen Bibliotheken
- erzeugt Views `Main`, `Batterie`, `Pool`, `Pool_Bedienung`
- erzeugt fuer die Pool-Bedienung ein Material-Widget `tplMaterial2Switches`

## 6. Docker-/Deployment-Struktur

Aus dem Repository ableitbar:

- ioBroker laeuft nicht lokal im Repository, sondern in einem Docker-Container auf einer Synology.
- Deployment erfolgt per SSH auf einen Host und anschliessend per `docker exec` in den Container.
- Standard-Containername in den Python-Tools: `iobroker-iobroker-1-1-1-1`
- Standard-Zielhost in den Python-Tools: `192.168.0.20`
- Standard-SSH-User in `sync_iobroker.py`: `Richard`

Deployment-Pfade:

- JavaScript-Skripte: ueber ioBroker-CLI (`iobroker object extend/set/del`)
- VIS-2: ueber ioBroker-Dateispeicher (`iobroker file read/write`)

Backup-Struktur:

- Repository-seitig: `iobroker/backups/<timestamp>/...json`
- VIS-2 im Live-System: `vis-2.0/backups/main-<timestamp>.json`

Nicht vorhanden:

- kein beschreibendes Container-Setup im Repo
- kein Compose- oder Stack-File
- keine reproduzierbare Docker-Build-Konfiguration

## 7. MQTT-Struktur

Im Repository ist MQTT ein zentrales Integrationsmedium.

### MQTT-Instanzen

- `mqtt.0`: HELTEC-Balancer und teilweise go-e-bezogene Altobjekte
- `mqtt.1`: Cerbo Haus / Victron ESS
- `mqtt.2`: Cerbo Halle / Victron BAT
- `mqtt.3`: Raspi VenusOS fuer dritten Zaehlpunkt und SolarEdge
- `mqtt.4`: Keepalive-Pfad wird in `Keep_Alive.js` verwendet

### Erkennbare Topic-Familien

- `N/<serial>/...`: eingehende Victron-/VenusOS-Nutzdaten
- `R/<serial>/...`: Anfrage-/Refresh-Themen, z. B. `system/0/Serial`
- `ioBroker/...`: aus ioBroker an Cerbo gesendete Steuer- und Grenzwerte

### Konkrete MQTT-Nutzungen

- Victron-Abfrage/Refresh in `common/Victron_Mqtt.js`
- Steuerwerte fuer ESS/BAT in `common/Victron_INIT.js` und `common/Victron_BAT.js`
- HELTEC-Packdaten in `mqtt.0.HELTEC_1` bis `mqtt.0.HELTEC_4`
- Pace-BMS-Rohdaten indirekt via Modbus, nicht via MQTT
- Pool-Grafik selbst nicht via MQTT, sondern als externes Grafana-URL eingebunden

### Strukturmerkmale

- Das neue Energiemanagement bevorzugt Alias-Objekte und liest MQTT-Rohobjekte nur dort direkt, wo es laut Manifest ressourcenschonend sinnvoll ist.
- Steuerung Richtung Victron erfolgt ueber `mqtt.x.ioBroker.*`-Datenpunkte.

## 8. ioBroker-Bezug

Der gesamte technische Kern des Projekts ist auf ioBroker ausgerichtet.

Sichtbare ioBroker-Bausteine:

- JavaScript-Skripte (`script.js.*`)
- exportierte Objekte unter `iobroker/objects/`
- Versionsmanifest `iobroker/manifest.json`
- VIS-2-Projekt unter `iobroker/vis-2/`
- Adapterobjekte aus:
  - `alias.0`
  - `javascript.0`
  - `0_userdata.0`
  - `mqtt.x`
  - `go-e.x`
  - `modbus.1`
  - `s7.0`
  - `telegram.0`
  - weitere Altadapter wie `renault.0`, `shelly.0`, `fritzdect.0`, `life360.0`, `places.0`

Manifest-Zustand laut `iobroker/manifest.json`:

- `70` Objekte
- `67` Skripte
- `2` Channels
- `1` Device
- Engine-Typen:
  - `55` Blockly
  - `12` `Javascript/js`

Das zeigt:

- Altbestand dominiert klar in Blockly
- neues Energiemanagement entsteht als handgeschriebenes JavaScript

## 9. Victron-/VRM-/Cerbo-GX-Bezug

Victron ist ein zentrales Fachmodul des Repositories.

Erkennbarer Bezug:

- zwei Cerbo-basierte Victron-Systeme: Haus (`mqtt.1`) und Halle (`mqtt.2`)
- VEBus-/ESS-/BAT-Steuerung ueber MQTT-Topics `ioBroker/...`
- SmartShunt als fuehrende Quelle fuer Gesamt-SOC und DC-Spannung laut Dokumentation
- RS450/100 als DC-Solar-Charger

Direkt erkennbare Skriptfamilien:

- `Victron_INIT`
- `Victron_BAT`
- `Victron_Mqtt`
- `Victron_Limits`
- `Victron_Infos`
- `Victron_Mode`
- `Victron_TOP-Balancing`
- `Victron_Shunt_LastFullCharge`
- `Victron_OldGrid`
- `Victron_DiffV`
- `Victron_EM24`
- `Victron_Hzg`
- `Victron_Alarms`

VRM-spezifischer Bezug:

- `VRM` als Begriff kommt in den relevanten Projektdateien nicht als eigenes Modul oder API vor.
- Ein direkter VRM-API-Zugriff ist im Repository nicht sichtbar.
- Bewertung: `Unklar`, ob VRM ausserhalb des Repositories verwendet wird.

## 10. Hardware-/Gerätebezug

Aus den vorhandenen Dateien klar erkennbar:

### Energieerzeuger

- Fronius 27 kW
- Fronius 10 kW
- SMA 4,7 kW
- SolarEdge 17 kW
- Victron RS450/100

### Speicher / DC-System

- SmartShunt 1000 A
- vier Gobel-Packs
- Pace BMS
- HELTEC-Balancer

### Netz-/Messgeraete

- EM24 New Grid
- EM24 Hall Grid
- EM24 Old Grid
- EM24 Hall 40A

### Victron-/Gateway-Hardware

- Cerbo Haus
- Cerbo Halle
- Raspi VenusOS fuer dritten Zaehlpunkt / SolarEdge

### Verbraucher und Aktoren

- go-e V3 Wallbox
- go-e V4 Wallbox
- go-e Halle Wallbox
- Poolpumpe
- Pool-Waermepumpe
- Pool-Elektrolyse / Salz-pH
- Siemens LOGO

### Weitere Smart-Home-Hardware im Altbestand

- Shelly
- FritzDECT
- Renault-Adapter-Bezug
- Life360 / Places / IFTTT-bezogene Integrationen

## 11. Konfigurationsdateien

Vorhandene oder funktional relevante Konfigurationsdateien:

- `iobroker/manifest.json`
  - Referenz auf verwaltete Objekte und Skripte
- `iobroker/objects/*.json`
  - exportierte ioBroker-Objekte
- `iobroker/scripts/energiemanagement/Config.js`
  - fachliche Laufzeitkonfiguration als ioBroker-Datenpunkte
- `iobroker/vis-2/main/vis-views.json`
  - generierte VIS-2-Konfiguration
- `docs/energiemanagement-manifest.md`
  - fachliche Soll- und Systembeschreibung
- `PROJECT_MEMORY.md`
  - Projektregeln und Grundsatzentscheidungen

Nicht vorhanden:

- keine `.env.example`
- keine zentrale YAML-/JSON-Konfigurationsdatei fuer das Gesamtprojekt
- keine formale Adapterinventarliste

## 12. Externe Abhaengigkeiten

### Direkt aus dem Code erkennbar

- Python-Standardbibliothek
- ioBroker-JavaScript-Laufzeitfunktionen
- ioBroker-CLI im Container
- SSH-Client
- Docker CLI auf der Synology

### Adapter- und Integrationsabhaengigkeiten

- MQTT-Adapter
- S7-Adapter
- Modbus-Adapter
- go-e-Adapter
- Telegram-Adapter
- VIS-2
- vermutlich Javascript-Adapter

### Weitere im Altbestand referenzierte Adapter

- `renault.0`
- `shelly.0`
- `fritzdect.0`
- `life360.0`
- `places.0`
- `iot.0`
- `admin.0`

### Node-/Python-Pakete

- keine Drittbibliotheken im Python-Code
- kein npm- oder pip-Abhaengigkeitssystem im Repository

## 13. Startpunkte / Entry Points

### Menschliche Startpunkte

- [README.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/README.md)
- [PROJECT_MEMORY.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/PROJECT_MEMORY.md)
- [docs/energiemanagement-manifest.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/docs/energiemanagement-manifest.md)
- [iobroker/README.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/iobroker/README.md)

### Technische Entry Points

- `iobroker/tools/sync_iobroker.py`
- `iobroker/tools/deploy_vis2.py`
- `iobroker/vis-2/build_vis.py`

### Laufzeit-Entry Points in ioBroker

Alle aktivierten Skripte in `iobroker/manifest.json` bzw. `iobroker/objects/*.json` sind potenzielle Laufzeit-Entry Points. Besonders relevant:

- `script.js.common.Victron_INIT`
- `script.js.common.Victron_Mqtt`
- `script.js.common.Victron_BAT`
- `script.js.common.Pool`
- `script.js.common.Pool_Steuerung`
- `script.js.common.go-E_V4_Charger_Neu`
- `script.js.common.go-E_V4_Phasen`
- `script.js.energiemanagement.Batterie_Zellspannungen`
- `script.js.energiemanagement.Batterie_BMS_Heltec_Vergleich`
- `script.js.energiemanagement.Pool_VIS2_Zeitplaene`

## 14. Datenfluesse

### Hauptfluss 1: Live-System nach Repository

```text
ioBroker Live-Objekt
-> sync_iobroker.py backup
-> iobroker/backups/<timestamp>/
-> versionierte Analyse/Referenz im Repository
```

### Hauptfluss 2: Repository nach ioBroker

```text
Repository-JS
-> sync_iobroker.py deploy
-> SSH
-> docker exec
-> ioBroker object extend/set
-> Live-Skriptobjekt
```

### Hauptfluss 3: VIS-2-Deployment

```text
HTML/CSS/build_vis.py
-> vis-views.json
-> deploy_vis2.py
-> ioBroker file write
-> VIS-2 Live-Projekt
```

### Hauptfluss 4: Victron-Daten

```text
Cerbo / VenusOS
-> MQTT Topics mqtt.1 / mqtt.2 / mqtt.3
-> alias.0 / mqtt.x / javascript.0
-> Common-Skripte und neue Energiemanagement-Skripte
-> Steuerwerte an mqtt.x.ioBroker.*
-> Victron-Systeme
```

### Hauptfluss 5: Batterieueberwachung

```text
modbus.1.holdingRegisters.<pack>.* Zellwerte
+ mqtt.0.HELTEC_<pack>.data
-> Batterie_Zellspannungen.js / Batterie_BMS_Heltec_Vergleich.js
-> 0_userdata.0.Energiemanagement.Batterie.*
-> VIS-2 Batterieansicht
```

### Hauptfluss 6: Pool

```text
s7.0 DB/I/Q
-> common/Pool.js und common/Pool_Steuerung.js
-> javascript.0.Pool.*
-> VIS-2 Poolansicht

time-switch.0.onoff.4/5
<-> Pool_VIS2_Zeitplaene.js
<-> javascript.0.PoolVIS2.Zeitplan*
-> VIS-2 Bedienung
```

### Hauptfluss 7: Wallbox

```text
alias.0 / go-e.1 / Renault-Adapter
-> go-E_V4_Charger_Neu.js
-> go-e.1.allow_charging / go-e.1.amperePV
-> go-e Wallbox

go-e.1.phases + HTTP psm API
-> go-E_V4_Phasen.js
-> http://192.168.11.21/api/set?psm=1|2
```

## 15. Sicherheitsrelevante Punkte

Im Repository sichtbar sicherheitsrelevant:

- Deployment greift per SSH auf einen produktiven Host zu.
- Deployment fuehrt privilegierte Docker-Kommandos per `sudo -n` aus.
- `work/secrets` ist im Arbeitsbaum vorhanden; Inhalte sind im Repository-Kontext nicht bewertet.
- lokale IP-Adressen und Infrastrukturpfade sind mehrfach in Code und Doku enthalten.
- Steuerlogik greift aktiv in Live-Energie- und Wallboxsysteme ein.
- VIS-2 bindet ein internes Grafana per HTTP ein.
- mehrere Alt-Skripte schreiben direkt in `/opt/iobroker/log/` via `require('fs').appendFileSync(...)`.
- Telegram-Benachrichtigungen werden aus mehreren Betriebs- und Fehlerfaellen gesendet.

Positiv sichtbar:

- neues Deployment-Tool beschraenkt inhaltliche Live-Aenderungen auf `script.js.energiemanagement.*`
- vor Deployments werden Backups angelegt
- bestehende Skripte sollen laut Doku nicht inhaltlich veraendert werden

## 16. Schwachstellen / Risiken

### Technische Risiken

- Altbestand ist stark Blockly-gepraegt und dadurch schwer wartbar.
- sehr viele produktive Parameter sind hart in Skripten verdrahtet.
- interne IP-Adressen sind nicht abstrahiert.
- Live-Steuerung und Dokumentation liegen nebeneinander, aber nicht vollstaendig formalisiert.
- kein automatisiertes Testsystem vorhanden.
- kein statisches Linting oder Syntax-Check fuer den Altbestand sichtbar.
- keine reproduzierbare Container-/Umgebungsdefinition im Repo.

### Betriebsrisiken

- falsche MQTT-/Alias-/Modbus-ID kann direkt in Live-Steuerung wirken.
- `httpGet`-Steuerung fuer go-e-Phasenwechsel greift ohne zusaetzliche Sicherung direkt auf Aktoren zu.
- `sendTo('mqtt.x', 'sendMessage2Client', ...)` sendet Live-Steuerkommandos an Victron-nahe Systeme.
- Logging mit `appendFileSync` kann im Fehlerfall blockierend wirken.

### Datenqualitaetsrisiken

- Doku benennt den Gobel-SOC explizit als unzuverlaessig.
- bekannte historische Fehlzuordnung im alten HELTEC/BMS-Vergleich ist dokumentiert.
- einige Schutzmodule sind laut Manifest noch von fehlenden Aliasen abhaengig.

### Repository-Risiken

- `work/` und `outputs/` sind strukturell vorhanden, aber nicht dokumentiert.
- `outputs/` ist im sichtbaren Repo-Inhalt fachlich unklar.

## 17. Fehlende Dokumentation

Im aktuellen Repository fehlen oder sind unvollstaendig:

- vollstaendige Uebersicht aller aktiven ioBroker-Adapter
- klare Trennung zwischen Altbestand, Referenzbestand und produktivem Zielzustand
- Dokumentation der Namenskonventionen fuer `alias.0`, `0_userdata.0` und `javascript.0`
- Beschreibung aller Datenpunkte, die das neue Energiemanagement bereits selbst erzeugt
- Beschreibung der Abhaengigkeiten zwischen einzelnen Common-Skripten
- Uebersicht, welche Common-Skripte aktuell aktiv oder bewusst deaktiviert sein sollen
- formale Betriebsanleitung fuer Notfall / Rollback
- Dokumentation des Verhaeltnisses zwischen Cerbo, VenusOS und dritten Zaehlern
- Dokumentation der `work/`- und `outputs/`-Ordner
- Dokumentation der noetigen Rechte auf der Synology fuer Deployment

## 18. Vorschlag fuer AGENTS.md

Ein sinnvolles `AGENTS.md` koennte folgende Bereiche enthalten:

```text
# AGENTS.md

## Projektzweck
- Smart-Home- und Energiemanagement auf Basis von ioBroker
- GitHub ist Referenz und Backup
- ioBroker ist Live-System

## Harte Regeln
- Bestehende Skripte unter iobroker/scripts/common/ nicht inhaltlich aendern
- Neue Logik nur unter iobroker/scripts/energiemanagement/ anlegen
- Vor jedem Deployment Backup anlegen
- Nur Alias-Objekte verwenden, ausser dort, wo Rohobjekte ausdruecklich vorgesehen sind
- Ressourcenschonung hat Vorrang

## Wichtige Pfade
- iobroker/scripts/common/
- iobroker/scripts/energiemanagement/
- iobroker/objects/
- iobroker/tools/
- iobroker/vis-2/
- docs/

## Deployment
- JS: python3 iobroker/tools/sync_iobroker.py deploy <script>
- VIS2: python3 iobroker/tools/deploy_vis2.py

## Verbotene Annahmen
- Keine neuen Objekt-IDs raten
- Keine Hardware-Zuordnungen raten
- Bei Unklarheiten "Unklar" dokumentieren

## Analysefokus
- Datenquellen
- Schutzgrenzen
- Aktor-Schreibpfade
- Abhaengigkeiten zwischen alten und neuen Skripten
```

## 19. Vorschlag fuer `knowledge/`-Struktur

Sinnvolle Struktur fuer langfristiges Projektwissen:

```text
knowledge/
├── overview/
│   ├── projektziel.md
│   ├── systemlandschaft.md
│   └── begriffe.md
├── architecture/
│   ├── datenfluesse.md
│   ├── modulkarte.md
│   ├── naming-konventionen.md
│   └── schutzlogiken.md
├── iobroker/
│   ├── adapter-inventar.md
│   ├── objektraeume.md
│   ├── deployment-workflow.md
│   └── rollback.md
├── hardware/
│   ├── zaehlpunkte.md
│   ├── victron.md
│   ├── batterie.md
│   ├── wallboxen.md
│   └── pool.md
├── modules/
│   ├── common-altbestand.md
│   ├── energiemanagement-neu.md
│   ├── vis2.md
│   └── python-tools.md
├── risks/
│   ├── bekannte-fehler.md
│   ├── sicherheit.md
│   └── offene-punkte.md
└── decisions/
    └── adr-0001-github-als-referenz.md
```

## 20. Konkrete naechste Schritte

Konkrete, aus dem Ist-Zustand ableitbare naechste Schritte:

1. Ein `AGENTS.md` mit den vorhandenen Projektregeln anlegen.
2. Eine Adapter- und Objektinventar-Doku aus `manifest.json`, `objects/` und den relevanten Skripten erstellen.
3. Den Altbestand unter `iobroker/scripts/common/` fachlich in Domainen gruppieren und aktiv/inaktiv dokumentieren.
4. Die Datenpunktvertraege des neuen Energiemanagements unter `0_userdata.0.Energiemanagement.*` dokumentieren.
5. Die Schreibpfade an Aktoren separat inventarisieren:
   - Victron MQTT-Steuerthemen
   - go-e `allow_charging` / `amperePV`
   - go-e HTTP-Phasenumschaltung
   - Siemens LOGO / `s7.0.DBs.DB1.*`
6. Die offenen Alias-Luecken aus dem Manifest dokumentiert schliessen. Laut Repository ist mindestens der Hausanschluss-Phasenstrom noch unvollstaendig.
7. Eine klare Migrationsmatrix Altbestand -> neues Energiemanagement anlegen.
8. Fuer Python-Tools eine kleine Betriebsdoku mit Beispielkommandos, Backup-Strategie und Rollback verfassen.
9. Die `work/`- und `outputs/`-Ordner dokumentieren oder aus der Projektanalyse explizit als lokal/nicht fachlich markieren.
10. Die bisherige VIS-2-Struktur fuer Main/Batterie/Pool in einer separaten UI-Doku festhalten.

## Unklare Punkte aus Repository-Sicht

Die folgenden Punkte sind anhand des Repositories allein nicht sicher aufloesbar:

- ob `outputs/` fachlich genutzt wird oder nur lokaler Arbeitsrest ist
- welche Common-Skripte im Live-System aktuell tatsaechlich aktiviert sind, sofern dies nicht explizit in Doku genannt ist
- ob `work/secrets/` im Git-Tracking enthalten ist oder nur lokal vorhanden ist
- ob VRM ausserhalb des Repositories produktiv verwendet wird
- welche Backup-Staende in `iobroker/backups/` bewusst langfristig aufbewahrt werden sollen
