# Offene Fragen

## Laut Analyse offene oder unklare Punkte

- `outputs/`: fachliche Nutzung oder nur lokaler Arbeitsrest ist `Unklar`.
- `work/secrets/`: fachliche Rolle im Git-Kontext ist `Unklar`.
- Vollstaendige Containerlandschaft auf der Synology ist `Unklar`.
- Direkter VRM-Einsatz ausserhalb des Repositories ist `Unklar`.
- Welche Common-Skripte im Live-System exakt aktiv sein sollen, ist nicht vollstaendig dokumentiert.
- Vollstaendige Topic-Liste aller produktiven MQTT-Pfade ist `Unklar`.
- Vollstaendige Liste aller produktiven ioBroker-Adapter inklusive Versionen ist `Unklar`.
- Vollstaendige Abhaengigkeitenkarte zwischen allen Common-Skripten ist `Unklar`.
- Umfang und Aufbewahrungsregel fuer vorhandene Backups ist `Unklar`.
- Vollstaendiges Sollbild aller kuenftigen Energiemanagement-Module ist `Unklar`.
- Welche Common-Skripte im Live-System tatsaechlich aktiviert sind, ist aus dem Repository allein nicht vollstaendig ableitbar.
- Vollstaendige Inventarliste aller produktiven Endgeraete ausserhalb der im Repository referenzierten Geraete ist `Unklar`.
- Zeitliche Priorisierung der Roadmap ausserhalb der dokumentierten Liste ist `Unklar`.
- Weitere nicht dokumentierte Team-, Stil- oder Betriebsregeln ausserhalb der vorhandenen Analyse sind `Unklar`.

## Laut Projektanalyse fehlende Dokumentation

- Vollstaendige Uebersicht aller aktiven ioBroker-Adapter
- Klare Trennung zwischen Altbestand, Referenzbestand und produktivem Zielzustand
- Dokumentation der Namenskonventionen fuer `alias.0`, `0_userdata.0` und `javascript.0`
- Beschreibung aller Datenpunkte, die das neue Energiemanagement bereits selbst erzeugt
- Beschreibung der Abhaengigkeiten zwischen einzelnen Common-Skripten
- Uebersicht, welche Common-Skripte aktuell aktiv oder bewusst deaktiviert sein sollen
- Formale Betriebsanleitung fuer Notfall / Rollback
- Dokumentation des Verhaeltnisses zwischen Cerbo, VenusOS und dritten Zaehlern
- Dokumentation der `work/`- und `outputs/`-Ordner
- Dokumentation der noetigen Rechte auf der Synology fuer Deployment

## Noch zu dokumentieren

- Adapterinventar
- Objekt- und Alias-Konventionen
- Migrationsmatrix Altbestand -> neues Energiemanagement
- Aktor-Schreibpfade
- Rollback-Prozess

## Arbeitsregel fuer neue Unklarheiten

- Wenn ein Punkt aus Repository und Dokumentation nicht sicher belegbar ist, bleibt er hier mit `Unklar` stehen.
- Offene Fragen werden nicht durch Annahmen in Code oder Doku aufgeloest.
