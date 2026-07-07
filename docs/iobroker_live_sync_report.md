# ioBroker Live-Sync Report

## Zeitpunkt des Abgleichs

- Frischer Live-Export am 2026-07-07T17:54:47.083662+00:00 laut aktualisiertem `iobroker/manifest.json`
- Lokale Auswertung im Kontext `Europe/Vienna` am 2026-07-07

## Verwendeter ioBroker-Container

- `iobroker-iobroker-1-1-1-1`

## Repository-Stand

- Branch: `ai-foundation`
- Commit: `2669fe8`
- Hinweis: Der lokale Branch war zu Beginn des Abgleichs auf `origin/ai-foundation` synchron.

## Bestandszahlen

- Skripte live gesamt im frischen Export: `65`
- Skripte im Repository im Geltungsbereich `script.js.common.*` und `script.js.energiemanagement.*`: `67`
- Zusätzliche Repository-Skripte ausserhalb des geforderten Geltungsbereichs: `2` (`script.js.Keep_Alive`, `script.js.Skript_1`)

## Aktive common-Skripte

- `script.js.common.Grid-PV`
- `script.js.common.Grid-PVHalle`
- `script.js.common.Hallentore`
- `script.js.common.Pool`
- `script.js.common.Pool_Steuerung`
- `script.js.common.Sonne`
- `script.js.common.Victron_Alarms`
- `script.js.common.Victron_BAT`
- `script.js.common.Victron_DiffV`
- `script.js.common.Victron_EM24`
- `script.js.common.Victron_Hzg`
- `script.js.common.Victron_INIT`
- `script.js.common.Victron_Infos`
- `script.js.common.Victron_Limits`
- `script.js.common.Victron_Mode`
- `script.js.common.Victron_Mqtt`
- `script.js.common.Victron_OldGrid`
- `script.js.common.Victron_Shunt_LastFullCharge`
- `script.js.common.Victron_TOP-Balancing`
- `script.js.common.Werkstatt_Hzg`
- `script.js.common.Wolken-PV_Halle`
- `script.js.common.Wolken-PV_Home`
- `script.js.common.go-E_V3_Charger`
- `script.js.common.go-E_V3_Control`
- `script.js.common.go-E_V3_Debug`
- `script.js.common.go-E_V3_Error`
- `script.js.common.go-E_V3_GridOffset`
- `script.js.common.go-E_V3_Init`
- `script.js.common.go-E_V3_LED`
- `script.js.common.go-E_V3_Limits`
- `script.js.common.go-E_V3_Phasen`
- `script.js.common.go-E_V3_Verriegelung`
- `script.js.common.go-E_V3_Überschuss`
- `script.js.common.go-E_V3_Überwachung`
- `script.js.common.go-E_V4_Charger_Neu`
- `script.js.common.go-E_V4_Control`
- `script.js.common.go-E_V4_Debug`
- `script.js.common.go-E_V4_Error`
- `script.js.common.go-E_V4_GridOffset`
- `script.js.common.go-E_V4_Halle`
- `script.js.common.go-E_V4_Init`
- `script.js.common.go-E_V4_LED`
- `script.js.common.go-E_V4_Limits`
- `script.js.common.go-E_V4_Phasen`
- `script.js.common.go-E_V4_Verriegelung`
- `script.js.common.go-E_V4_kWh`
- `script.js.common.go-E_V4_Überwachung`
- `script.js.common.go-E_WB-Halle_Ladungen`

## Deaktivierte common-Skripte

- `script.js.common.Bewässerung`
- `script.js.common.EBikeLader`
- `script.js.common.Garage`
- `script.js.common.Gobel_VDIFF`
- `script.js.common.Gobel_Vergleich_BMS_Heltec`
- `script.js.common.Gobel_Zellspannungen`
- `script.js.common.Gobel_einzelne_Zellspannungen`
- `script.js.common.Priority_Management`
- `script.js.common.Rasen`
- `script.js.common.SmartPlug`
- `script.js.common.Smart_BadHzg`
- `script.js.common.Sonnenstand`

## Aktive energiemanagement-Skripte

- `script.js.energiemanagement.Batterie_BMS_Heltec_Vergleich`
- `script.js.energiemanagement.Batterie_Zellspannungen`
- `script.js.energiemanagement.Pool_VIS2_Zeitplaene`

## Deaktivierte energiemanagement-Skripte

- `script.js.energiemanagement.Codex_Access_Test`
- `script.js.energiemanagement.Config`

## Erkannte Unterschiede Live vs Repository

- Für alle 65 Skripte im frischen Export wurden im Repository keine Abweichungen bei `enabled`, `engineType`, `scriptFile` oder `objectFile` festgestellt.
- Im Repository liegen zwei Skripte im geforderten Geltungsbereich, die im frischen Live-Export nicht vorhanden sind: `script.js.energiemanagement.Bilanz_Zaehlpunkte` und `script.js.energiemanagement.Debug`.
- Im Repository existieren zusätzlich die Skripte `script.js.Keep_Alive` und `script.js.Skript_1`; diese liegen ausserhalb des explizit geforderten Vergleichsbereichs.
- Keine ioBroker-Objekte wurden im Rahmen dieses Abgleichs geändert.

## Risiken

- Der Abgleich basiert auf einem frischen Live-Export aus dem ioBroker-Container; zwischen Export und Dokumentation kann sich der Live-Stand theoretisch bereits wieder geändert haben.
- Die Vollständigkeit der Live-Umgebung ausserhalb des exportierten Skriptbestands bleibt `Unklar`.
- Für die nicht zum Vergleichsbereich gehoerenden Skripte `script.js.Keep_Alive` und `script.js.Skript_1` liegt hier keine explizite Live-GitHub-Gegenueberstellung vor.

## Empfohlene naechste Schritte

1. Pruefen, ob `script.js.energiemanagement.Bilanz_Zaehlpunkte` und `script.js.energiemanagement.Debug` bewusst nur im Repository liegen oder ob der Live-Stand sie noch aufnehmen soll.
2. Die beiden ausserhalb des Vergleichsbereichs liegenden Skripte getrennt dokumentieren, falls sie fuer den Betriebsabgleich relevant sind.
3. Bei kuenftigen Aenderungen an produktiven Skripten den frischen Live-Export als Rueckfallebene behalten.

## Unklar

- Ob die zwei nur im Repository vorhandenen Energiemanagement-Skripte absichtlich nicht live existieren, ist `Unklar`.
- Ob `script.js.Keep_Alive` und `script.js.Skript_1` bewusst ausserhalb des Vergleichsbereichs gehalten werden sollen, ist `Unklar`.
