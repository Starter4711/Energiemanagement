# Offene Fragen

## Hardware

- Vollstaendige Inventarliste aller produktiven Endgeraete ausserhalb der im Repository referenzierten Geraete ist `Unklar`.

## Netzwerk / Docker / Synology

- Vollstaendige Containerlandschaft auf der Synology ist `Unklar`.
- Dokumentation der noetigen Rechte auf der Synology fuer Deployment ist `Unklar`.

## ioBroker / Adapter / Objekte

- Vollstaendige Liste aller produktiven ioBroker-Adapter inklusive Versionen ist `Unklar`.
- Vollstaendige Uebersicht aller aktiven ioBroker-Adapter ist `Unklar`.
- Ob fuer VIS1 ein eigener Repository-Pfad unter `iobroker/vis-1/` oder einem anderen dokumentierten Ort existieren soll, ist `Unklar`.
- Ob VIS1 absichtlich ohne separate `vis-user.css` betrieben wird, ist `Unklar`.
- Welche VIS1-Views zuerst nach VIS2 migriert werden sollen, ist `Unklar`.
- Welche Common-Skripte im Live-System exakt aktiv sein sollen, ist nicht vollstaendig dokumentiert.
- Welche Common-Skripte im Live-System tatsaechlich aktiviert sind, ist aus dem Repository allein nicht vollstaendig ableitbar.
- Vollstaendige Abhaengigkeitenkarte zwischen allen Common-Skripten ist `Unklar`.
- Beschreibung der Abhaengigkeiten zwischen einzelnen Common-Skripten ist `Unklar`.
- Klare Trennung zwischen Altbestand, Referenzbestand und produktivem Zielzustand ist `Unklar`.
- Ob die Skripte `script.js.energiemanagement.Bilanz_Zaehlpunkte` und `script.js.energiemanagement.Debug` absichtlich nur im Repository existieren, ist `Unklar`.
- Die exakte fachliche Rolle von `script.js.common.Grid-PV` und `script.js.common.Grid-PVHalle` ist nur aus dem Namen ableitbar und nicht separat dokumentiert.
- Die exakte fachliche Rolle von `script.js.common.Sonne`, `script.js.common.Sonnenstand` und `script.js.common.Wolken-PV_*` ist nur teilweise belegt.
- Die Abgrenzung zwischen `script.js.common.Pool`, `script.js.common.Pool_Steuerung` und `script.js.energiemanagement.Pool_VIS2_Zeitplaene` ist nicht vollstaendig dokumentiert.
- Die genaue Zielrolle der go-e-V3- und go-e-V4-Skripte im neuen Energiemanagement ist noch nicht konsolidiert.
- Ob `Wallbox_Flow_V1` ueber die aktuelle Quellenanalyse hinaus als naechste Spezifikation freigegeben wird, ist `Unklar`.

## MQTT / Datenpunkte

- Vollstaendige Topic-Liste aller produktiven MQTT-Pfade ist `Unklar`.
- Dokumentation der Namenskonventionen fuer `alias.0`, `0_userdata.0` und `javascript.0` ist `Unklar`.
- Beschreibung aller Datenpunkte, die das neue Energiemanagement bereits selbst erzeugt, ist `Unklar`.
- Aktor-Schreibpfade sind noch nicht vollstaendig inventarisiert.

## Victron / Venus / VRM

- Direkter VRM-Einsatz ausserhalb des Repositories ist `Unklar`.
- Dokumentation des Verhaeltnisses zwischen Cerbo, VenusOS und dritten Zaehlern ist `Unklar`.
- Welche konkreten Node-RED-Flows auf den Cerbos produktiv im Detail aktiv sind, ist `Unklar`.
- Detaillierte Eskalationslogik bei Kommunikationsausfall zwischen BMS, Heltec, Raspberry Pi, MQTT und ioBroker ist `Unklar`.

## Batterie / Sicherheit

- Notabschaltungsszenarien der Batterie sind `Unklar`.
- Dokumentierte Kommunikationsausfall-Reaktionen sind `Unklar`.

## Energiestrategie / Prognose

- Vollstaendiges Sollbild aller kuenftigen Energiemanagement-Module ist `Unklar`.
- Konkrete operative Umschaltkriterien zwischen Sommer- und Winterstrategie sind `Unklar`, soweit sie nicht an anderer Stelle bereits formell dokumentiert sind.
- Prognoselogik fuer Wetter, PV und MPPT-Tagesertrag ist `Unklar`.

## Betrieb / Rollback

- Konkrete Logfile-Pfade sind `Unklar`.
- Log-Rotation und Aufbewahrung sind `Unklar`.
- Einheitliche Logging-Hilfsfunktion fuer neue Skripte ist `Unklar`.
- Genaue Backup-Aufbewahrungsdauer ist `Unklar`.
- Formaler Rollback-Testprozess ist `Unklar`.

## Dokumentation / Repository

- `outputs/`: fachliche Nutzung oder nur lokaler Arbeitsrest ist `Unklar`.
- `work/secrets/`: fachliche Rolle im Git-Kontext ist `Unklar`.
- Zeitliche Priorisierung der Roadmap ausserhalb der dokumentierten Liste ist `Unklar`.
- Weitere nicht dokumentierte Team-, Stil- oder Betriebsregeln ausserhalb der vorhandenen Analyse sind `Unklar`.

## Arbeitsregel fuer neue Unklarheiten

- Wenn ein Punkt aus Repository und Dokumentation nicht sicher belegbar ist, bleibt er hier mit `Unklar` stehen.
- Offene Fragen werden nicht durch Annahmen in Code oder Doku aufgeloest.
