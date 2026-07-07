# VIS Live-Sync Report

## Zeitpunkt des Exports

- Live-Export erstellt am `2026-07-07T18:00:00Z`
- Lokale Auswertung im Zeitzonen-Kontext `Europe/Vienna` am `2026-07-07`

## Verwendeter Host und Container

- Host: `Richard@192.168.0.20`
- ioBroker-Container: `iobroker-iobroker-1-1-1-1`

## Gefundene VIS-Instanzen

- `system.adapter.vis.0`
  - Adapter: `vis`
  - Version: `1.5.6`
  - Status: installiert und aktiviert
- `system.adapter.vis-2.0`
  - Adapter: `vis-2`
  - Version: `2.13.8`
  - Status: installiert und aktiviert

## Exportpfade

- Live-Export VIS1: `iobroker/backups/20260707T180000Z/vis1.vis-views.json`
- Live-Export VIS2: `iobroker/backups/20260707T180000Z/vis2.vis-views.json`
- Live-Export VIS2 CSS: `iobroker/backups/20260707T180000Z/vis2.vis-user.css`
- VIS1 CSS im Live-System nicht gefunden

## Vorhandene VIS1-Projekte und Views

- Live-Datei: `/vis.0/main/vis-views.json`
- Gefundene Views:
  - `Bewässerung`
  - `diesel`
  - `garage`
  - `go-e`
  - `go-e_V4`
  - `grid`
  - `grid_caddy`
  - `Grid_Home`
  - `Humi_ESP`
  - `humidor`
  - `main`
  - `menue`
  - `menue_goE`
  - `menue_goE_V4`
  - `menue_grid`
  - `menue_grid_caddy`
  - `menue_zoe`
  - `plugs`
  - `pool`
  - `pv_caddy`
  - `pv_home`
  - `Victron`
  - `zoe`

## Vorhandene VIS2-Projekte und Views

- Live-Datei: `/vis-2.0/main/vis-views.json`
- Gefundene Views:
  - `Main`
  - `Batterie`
  - `Pool`
  - `Pool_Bedienung`

## Unterschied Live vs Repository

- VIS2:
  - Die Live-Dateien `vis-views.json` und `vis-user.css` stimmen mit dem Repository-Stand unter `iobroker/vis-2/main/` ueberein.
  - Kein inhaltlicher Unterschied festgestellt.
- VIS1:
  - Fuer VIS1 liegt im Repository kein entsprechender Projektstand unter `iobroker/vis-1/` oder einem anderen dokumentierten VIS1-Pfad vor.
  - Ein direkter Live-vs-Repository-Vergleich ist daher fuer VIS1 nur eingeschraenkt moeglich.

## Produktive VIS-Version

- VIS1 ist die alte und aktuell produktive Visualisierung.
- VIS2 ist die neue Ziel-Visualisierung.
- VIS2 ist Entwicklungsziel, aber nicht als allein produktive Visualisierung zu behandeln.
- VIS1 darf nicht veraendert werden.
- VIS1 muss vor jeder VIS-Arbeit gesichert werden.
- Die Migration von VIS1 nach VIS2 erfolgt schrittweise und nicht per Big Bang.

## Risiken

- VIS1 bleibt als produktive Alt-Visualisierung zu sichern und nur lesend zu behandeln.
- Der Export ist eine Momentaufnahme; Live-Inhalte koennen sich nach dem Export jederzeit aendern.
- Fuer VIS1 wurde kein `vis-user.css`-Dateistand gefunden, daher ist unklar, ob dort eine separate Stilpflege verwendet wird.

## Offene Punkte

- Ob fuer VIS1 ein Repository-Pfad existieren sollte, ist `Unklar`.
- Ob VIS1 absichtlich ohne separat exportierte `vis-user.css` betrieben wird, ist `Unklar`.

## Empfohlene naechste Schritte

1. Klaeren, ob VIS1 weiter gepflegt werden soll oder nur als Altbestand dokumentiert bleibt.
2. Falls VIS1 noch relevant ist, einen dokumentierten Repository-Pfad fuer den VIS1-Stand anlegen.
3. Den VIS2-Live-Abgleich bei kuenftigen Aenderungen mit demselben Backup-Pfad fortsetzen.
