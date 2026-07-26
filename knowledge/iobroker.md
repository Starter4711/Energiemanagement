# ioBroker

## Rolle

ioBroker ist das Live-System des Projekts.

## Sichtbare Bausteine

- JavaScript-Skripte unter `script.js.*`
- exportierte Objekte unter `iobroker/objects/`
- Manifest unter `iobroker/manifest.json`
- VIS-2-Projekt unter `iobroker/vis-2/`

## Relevante Objektraeume

- `alias.0`
- `javascript.0`
- `0_userdata.0`
- `mqtt.x`
- `go-e.x`
- `modbus.1`
- `s7.0`
- `telegram.0`

## Manifest-Stand

Laut `iobroker/manifest.json`:

- `70` Objekte
- `67` Skripte
- `2` Channels
- `1` Device

Engine-Typen:

- `55` Blockly
- `12` `Javascript/js`

## Schlussfolgerung

- Der Altbestand dominiert deutlich.
- Neues Energiemanagement wird als handgeschriebenes JavaScript aufgebaut.

## Wichtige Hilfsdateien

- `iobroker/README.md`
- `iobroker/tools/sync_iobroker.py`
- `iobroker/tools/deploy_vis2.py`
- `iobroker/tools/deploy_eos_live.sh`
- `docs/iobroker-integration.md`

## Operative Referenz

- Host: `192.168.0.20`
- Container: `iobroker-iobroker-1-1-1-1`
- SSH-Schluessel: `work/secrets/synology_iobroker_key_live`
- Bekannte SSH-Benutzer: `Richard`, `admin`
- Live-Deploy-Helper: `iobroker/tools/deploy_eos_live.sh`
- Benoetigt lokal: `IOBROKER_SUDO_PASSWORD` im Passwortmanager oder in einer lokalen Notiz, nie im Repo
- Deployment-Reihenfolge: SSH -> Container -> fehlende Script-Objekte anlegen -> `common.source`/`common.enabled`/`common.name`/`common.engineType` setzen -> VIS2 schreiben -> Live pruefen
- VIS2-Dateien werden im ioBroker-Dateispeicher unter `/opt/iobroker/iobroker-data/files/vis-2.0/main/` erwartet.
- Der reparierte VIS2-Helper nutzt `IOBROKER_VIS2_HOST`, `IOBROKER_VIS2_CONTAINER`, `IOBROKER_VIS2_SSH_KEY` und lokal `IOBROKER_SUDO_PASSWORD`.
- Wenn VIS2 `undefined` zeigt, zuerst die Aktivierung der EOS-Kernskripte pruefen.
- `Energy_Flow_V1` nutzt live die drei in `EOS.Config` hinterlegten EM24-Zaehlpunkt-Aliasse, `0_userdata.0.Victron.SUMME_PV`, `0_userdata.0.Victron.SUMME_Verbrauch` und die drei konfigurierten go-e-Leistungsaliasse. go-e-Leistungen werden von kW nach W normiert.

## Live-Deploy-Merkpunkte

- `script.js.energiemanagement.Debug` musste im Live-System neu angelegt werden
- der Full-JSON-Transport war im Live-Container zu fehleranfaellig
- der robuste Weg ist jetzt der Helper `deploy_eos_live.sh`
- fuer eine schnelle Einzelaktualisierung kann der Repository-Pfad eines Skripts als Argument uebergeben werden, zum Beispiel `deploy_eos_live.sh iobroker/scripts/energiemanagement/Energy_Flow_V1.js`
- VIS2 wird mit den gepflegten HTML- und CSS-Dateien aktualisiert
- keine Passwoerter und keine privaten Keys ins Repository schreiben
- neue Chats sollen zuerst `AGENTS.md`, `knowledge/project_brain.md`, `knowledge/README.md`, `docs/project_analysis.md` und dann `knowledge/iobroker.md` lesen

## Unklar

- Welche Skripte im Live-System aktuell exakt aktiv sind, ist aus dem Repository allein nicht vollstaendig ableitbar.
