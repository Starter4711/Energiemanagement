# Systemkomponenten

## Zweck des Dokuments

Diese Datei beschreibt die technische Komponentenlandschaft des Smart-Home- und Energiemanagement-Projekts auf Basis der im Repository dokumentierten Informationen. Sie dient als zentrale Uebersicht ueber Systembereiche, Schnittstellen, Datenpfade, Risiken und offene Punkte.

Vertiefende Fachsichten liegen ergaenzend unter `knowledge/`, insbesondere in `hardware_topology.md`, `battery_architecture.md`, `victron_venus_structure.md`, `control_hierarchy.md`, `energy_strategy.md` und `design_principles.md`.

## 1. ioBroker auf Synology Docker

### Zweck

ioBroker ist das Live-System des Projekts. Es fuehrt die produktiven Skripte aus, haelt Objekte und States vor, hostet VIS-2 und bildet die zentrale Integrationsschicht zwischen Energie-, Wallbox-, Batterie- und Poolsystemen.

### Bekannte Schnittstellen

- SSH-Zugriff auf die Synology
- `docker exec` in den ioBroker-Container
- ioBroker-CLI fuer Objekt- und Skriptverwaltung
- ioBroker-Dateispeicher fuer VIS-2-Dateien
- Adapterobjekte unter anderem aus `alias.0`, `javascript.0`, `0_userdata.0`, `mqtt.x`, `go-e.x`, `modbus.1`, `s7.0`, `telegram.0`

### Bekannte Datenpfade

- `iobroker/scripts/common/`
- `iobroker/scripts/energiemanagement/`
- `iobroker/objects/`
- `iobroker/manifest.json`
- `iobroker/vis-2/`
- Repository-Backups unter `iobroker/backups/<timestamp>/`

### Bekannte Risiken

- Falsche Objekt-, Alias- oder Adapterpfade wirken direkt auf das Live-System.
- Deployment erfolgt gegen ein produktives System.
- Der Altbestand ist stark Blockly-gepraegt und dadurch schwerer wartbar.
- Welche Skripte im Live-System aktuell exakt aktiv sind, ist aus dem Repository allein nicht vollstaendig ableitbar.

### Offene Punkte

- Vollstaendige Containerlandschaft auf der Synology ist `Unklar`.
- Vollstaendige Liste aller produktiven ioBroker-Adapter inklusive Versionen ist `Unklar`.
- Formale Betriebsanleitung fuer Notfall / Rollback ist laut Analyse nicht vollstaendig dokumentiert.

## 2. MQTT

### Zweck

MQTT ist das zentrale Integrationsmedium fuer Victron-/VenusOS-Daten, Steuerwerte und HELTEC-Balancer-Daten.

### Bekannte Schnittstellen

- `mqtt.0`: HELTEC-Balancer und teilweise go-e-bezogene Altobjekte
- `mqtt.1`: Cerbo Haus / Victron ESS
- `mqtt.2`: Cerbo Halle / Victron BAT
- `mqtt.3`: Raspi VenusOS fuer dritten Zaehlpunkt und SolarEdge
- `mqtt.4`: Keepalive-Pfad laut `Keep_Alive.js`

### Bekannte Datenpfade

- `N/<serial>/...`
- `R/<serial>/...`
- `ioBroker/...`
- `mqtt.0.HELTEC_1` bis `mqtt.0.HELTEC_4`
- MQTT-nahe Steuerdatenpunkte fuer Victron unter `mqtt.x.ioBroker.*`

### Bekannte Risiken

- Falsche MQTT-Pfade koennen direkt auf Live-Steuerung wirken.
- MQTT-Steuerpfade greifen in Victron-nahe Systeme ein.
- Die vollstaendige produktive Topic-Liste ist nicht separat dokumentiert.

### Offene Punkte

- Vollstaendige Topic-Liste aller produktiv verwendeten MQTT-Pfade ist `Unklar`.
- Vollstaendige Abgrenzung zwischen direkt gelesenen Rohobjekten und bevorzugten Alias-Pfaden ist nicht als eigene Gesamtdoku vorhanden.

## 3. Raspberry Pi / BLE / Heltec Balancer

### Zweck

Der Raspberry-Pi-/VenusOS-Bereich ist laut Repository an der Datenbereitstellung fuer den dritten Zaehlpunkt und SolarEdge beteiligt. HELTEC-Balancer liefern Zellspannungsdaten fuer die Batterieueberwachung.

### Bekannte Schnittstellen

- `mqtt.3`: Raspi VenusOS fuer dritten Zaehlpunkt und SolarEdge
- `mqtt.0`: HELTEC-Balancer-Daten

### Bekannte Datenpfade

- `mqtt.0.HELTEC_1`
- `mqtt.0.HELTEC_2`
- `mqtt.0.HELTEC_3`
- `mqtt.0.HELTEC_4`
- Nutzung der HELTEC-Daten in `iobroker/scripts/energiemanagement/Batterie_Zellspannungen.js`
- Nutzung der HELTEC-Daten in `iobroker/scripts/energiemanagement/Batterie_BMS_Heltec_Vergleich.js`

### Bekannte Risiken

- Historische Fehlzuordnungen im HELTEC/BMS-Vergleich sind laut Projektanalyse dokumentiert.
- Falsche Pack-Zuordnung wuerde zu fehlerhafter Zellbewertung fuehren.

### Offene Punkte

- BLE-Bezug ist als eigene technische Schicht im Repository nicht separat dokumentiert und damit `Unklar`.
- Detaillierte Rolle des Raspberry Pi ausserhalb des Hinweises auf VenusOS, dritten Zaehlpunkt und SolarEdge ist `Unklar`.

## 4. Gobel BMS / Modbus

### Zweck

Gobel-Packs und Pace-BMS liefern Zell- und Batteriedaten. Diese Daten werden fuer Zellspannungsdiagnose, Vergleich mit HELTEC-Daten und Batterieueberwachung genutzt.

### Bekannte Schnittstellen

- `modbus.1`
- `modbus.1.holdingRegisters`
- Altbestand unter `iobroker/scripts/common/Gobel_*`
- neue Skripte unter `iobroker/scripts/energiemanagement/`

### Bekannte Datenpfade

- `modbus.1.holdingRegisters.<pack>.*`
- Ergebnisse des Vergleichs unter `0_userdata.0.Energiemanagement.Batterie.*`

### Bekannte Risiken

- Der Gobel-SOC ist laut Projektdokumentation nicht als fuehrende Gesamtgroesse zu verwenden.
- Fehlerhafte Zuordnung von Modbus-Registern wuerde Diagnose und Schutzlogik verfaelschen.

### Offene Punkte

- Vollstaendige Register- und Signalbeschreibung des Pace-BMS im Repository ist `Unklar`.
- Vollstaendige Migrationsbeschreibung der alten `Gobel_*`-Skripte in das neue Energiemanagement ist `Unklar`.

## 5. Victron Cerbo GX / VRM

### Zweck

Victron ist ein zentrales Fachmodul des Projekts. Die Cerbo-Systeme liefern Messdaten und empfangen Steuerwerte fuer ESS, BAT und weitere Betriebslogik. SmartShunt ist fuehrend fuer Gesamt-SOC und DC-Spannung.

### Bekannte Schnittstellen

- `mqtt.1`: Cerbo Haus / Victron ESS
- `mqtt.2`: Cerbo Halle / Victron BAT
- MQTT-Themen `N/<serial>/...`, `R/<serial>/...`, `ioBroker/...`
- Common-Skripte `Victron_*`

### Bekannte Datenpfade

- Steuerung ueber MQTT-nahe `ioBroker`-Datenpunkte
- Datenfluss Cerbo / VenusOS -> `mqtt.1` / `mqtt.2` / `mqtt.3` -> Alias- und Skriptlogik -> Steuerwerte an `mqtt.x.ioBroker.*`

### Bekannte Risiken

- Falsche Steuerwerte koennen direkt in ESS-/BAT-Verhalten eingreifen.
- Schutz- und Grenzlogik darf nicht stillschweigend auf andere Datenquellen umgebogen werden.
- Der direkte produktive Wirkungspfad ueber MQTT ist sicherheitsrelevant.

### Offene Punkte

- Direkter VRM-API-Zugriff ist im Repository nicht sichtbar.
- Ob VRM ausserhalb des Repositories produktiv verwendet wird, ist `Unklar`.
- Vollstaendige Dokumentation des Verhaeltnisses zwischen Cerbo, VenusOS und drittem Zaehlpunkt ist laut Analyse unvollstaendig.

## 6. VIS2 Dashboards

### Zweck

VIS-2 stellt die mobile und browserbasierte Bedien- und Beobachtungsoberflaeche des Projekts bereit. Dokumentiert sind insbesondere Hauptansicht sowie Batterie- und Poolansichten.

### Bekannte Schnittstellen

- ioBroker VIS-2
- Build-Skript `iobroker/vis-2/build_vis.py`
- Deployment-Skript `iobroker/tools/deploy_vis2.py`

### Bekannte Datenpfade

- `iobroker/vis-2/main/dashboard.html`
- `iobroker/vis-2/main/battery.html`
- `iobroker/vis-2/main/pool.html`
- `iobroker/vis-2/main/pool-controls.html`
- generierte Konfiguration `iobroker/vis-2/main/vis-views.json`
- Styling ueber `iobroker/vis-2/main/vis-user.css`

### Bekannte Risiken

- Falsches Deployment kann produktive VIS-2-Ansichten ueberschreiben.
- VIS-2 bindet laut Analyse ein internes Grafana per HTTP ein.

### Offene Punkte

- Vollstaendige UI-Dokumentation aller Views und Widgets ist `Unklar`.
- Detaillierte Dokumentation der responsiven Logik fuer verschiedene Geraetetypen ist `Unklar`.

## 7. Wallbox / go-e Charger

### Zweck

Die go-e-Charger werden in die Ueberschuss- und Ladefreigabelogik des Projekts eingebunden. Dazu gehoeren Ladefreigabe, Stromregelung und Phasenumschaltung.

### Bekannte Schnittstellen

- `go-e.x`
- `alias.0`
- HTTP-API fuer die Phasenumschaltung
- Altbestand unter `iobroker/scripts/common/go-E_*`

### Bekannte Datenpfade

- `go-e.1.allow_charging`
- `go-e.1.amperePV`
- `go-e.1.phases`
- `http://192.168.11.21/api/set?psm=1|2`

### Bekannte Risiken

- Wallboxsteuerung greift direkt auf reale Lasten zu.
- Die HTTP-Phasenumschaltung ist laut Analyse ein direkter Aktorpfad ohne zusaetzlich dokumentierte Sicherung.
- Falsche Adapter- oder Alias-Pfade koennen zu Fehlsteuerungen fuehren.

### Offene Punkte

- Vollstaendige Dokumentation aller produktiven go-e-Instanzen und ihrer exakten Objektpfade ist `Unklar`.
- Vollstaendige Migrationsbeschreibung der `go-E_*`-Altlogik in neue Module ist `Unklar`.

## 8. Energiemanagement-Logik

### Zweck

Die Energiemanagement-Logik verknuepft Messdaten, Batterieinformationen, Netzbilanz, Wallboxen, Pool und Victron-Systeme zu einer steuernden Gesamtlogik ueber mehrere Zaehlpunkte.

### Bekannte Schnittstellen

- `iobroker/scripts/common/` als Altbestand
- `iobroker/scripts/energiemanagement/` als neue modulare Logik
- Datenquellen aus MQTT, Modbus, Alias-Objekten und S7
- Zielpfade unter `0_userdata.0.Energiemanagement.*`

### Bekannte Datenpfade

- `0_userdata.0.Energiemanagement.Config`
- `0_userdata.0.Energiemanagement.Batterie.*`
- `time-switch.0.onoff.4/5` <-> `javascript.0.PoolVIS2.Zeitplan*`
- saldierte Bilanzbildung ueber konfigurierte Netzleistungs-IDs in `Bilanz_Zaehlpunkte.js`

### Bekannte Risiken

- Falsche Datenquellen oder IDs koennen direkt Regelverhalten verfaelschen.
- Altbestand und neue Logik laufen parallel und muessen sauber getrennt bleiben.
- Kein automatisiertes Testsystem ist im Repository sichtbar.

### Offene Punkte

- Vollstaendiges Sollbild aller kuenftigen Energiemanagement-Module ist `Unklar`.
- Vollstaendige Migrationsmatrix Altbestand -> neues Energiemanagement ist `Unklar`.
- Vollstaendige Beschreibung aller vom neuen Energiemanagement erzeugten Datenpunkte ist laut Analyse noch nicht vorhanden.

## 9. GitHub / Codex / AI-Knowledge-Base

### Zweck

GitHub ist Referenz, Historie und Backup des Projekts. Codex nutzt das Repository zusammen mit `AGENTS.md`, `docs/project_analysis.md` und `knowledge/` als dauerhafte Wissens- und Arbeitsgrundlage.

### Bekannte Schnittstellen

- Git-Repository `Starter4711/Energiemanagement`
- `AGENTS.md`
- `docs/project_analysis.md`
- `knowledge/`

### Bekannte Datenpfade

- Dokumentation unter `docs/`
- dauerhafte Wissensbasis unter `knowledge/`
- Projektgedaechtnis unter `PROJECT_MEMORY.md`

### Bekannte Risiken

- Wenn Dokumentation nicht mit dem realen Projektstand mitgepflegt wird, entsteht Drift zwischen Repository-Wissen und Live-System.
- Unklare Punkte duerfen nicht durch Annahmen in Doku oder spaeterem Code ersetzt werden.

### Offene Punkte

- Wie weit `PROJECT_MEMORY.md` kuenftig gegenueber `AGENTS.md` und `knowledge/` noch fuehrend sein soll, ist `Unklar`.
- Vollstaendige Arbeitsabgrenzung zwischen historischer Doku in `docs/` und dauerhafter Wissensbasis in `knowledge/` ist noch nicht als eigenes Governance-Dokument beschrieben.
