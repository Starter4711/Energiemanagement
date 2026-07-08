# ioBroker Deployment V1

## Zweck

Dieses Dokument beschreibt, wie der Repository-Stand in einen echten ioBroker ueberfuehrt und anschliessend geprueft wird.

Wichtig:

- GitHub allein macht im ioBroker nichts sichtbar.
- Erst ein Import- oder Deployment-Schritt legt Objekte und Skripte im Live-System an.
- Diese Anleitung bleibt bewusst auf den dokumentierten Repository-Stand `ai-foundation` bezogen.

## Repository-Struktur

### Skripte

Die EOS-Skripte liegen unter:

- `iobroker/scripts/energiemanagement/`

Aktuell vorhandene Skripte:

- `Batterie_BMS_Heltec_Vergleich.js`
- `Batterie_Zellspannungen.js`
- `Battery_Health_V1.js`
- `Battery_Supervisor_V1.js`
- `Bilanz_Zaehlpunkte.js`
- `Codex_Access_Test.js`
- `Config.js`
- `Debug.js`
- `Energy_Flow_V1.js`
- `Pool_VIS2_Zeitplaene.js`

### Objektdefinitionen

Die exportierten ioBroker-Objektdefinitionen liegen unter:

- `iobroker/objects/`

Wichtige Projektobjekte fuer das neue Energiemanagement:

- `energiemanagement.Batterie_BMS_Heltec_Vergleich.json`
- `energiemanagement.Batterie_Zellspannungen.json`
- `energiemanagement.Battery_Health_V1.json`
- `energiemanagement.Codex_Access_Test.json`
- `energiemanagement.Config.json`
- `energiemanagement.Energy_Flow_V1.json`
- `energiemanagement.Pool_VIS2_Zeitplaene.json`

Weitere exportierte Objektdateien im Repository gehoeren zu Altbestand oder globalen Containern und werden nur bei Bedarf separat importiert.

## Warum GitHub allein nicht reicht

Das Repository ist Referenz, Backup und Dokumentation.
Der ioBroker sieht davon noch nichts, solange die Inhalte nicht importiert oder deployed wurden.

Praktisch heisst das:

1. Datei im Repository vorhanden
2. Objektdatei im Repository vorhanden
3. Noch kein Effekt im ioBroker
4. Erst nach Import oder Deployment sichtbar im Objektbaum

## Manueller Importweg

1. Repository-Stand auf `ai-foundation` aktualisieren.
2. Die gewuenschten JSON-Objekte in den ioBroker importieren.
3. Die Skriptdateien im Javascript-Adapter anlegen oder aus der Objektdefinition uebernehmen.
4. Den Import im ioBroker Admin kontrollieren.
5. Die Skripte im Javascript-Adapter aktivieren, falls sie deaktiviert importiert wurden.

## Praktischer Import

### Empfohlene Reihenfolge

1. Zuerst Objektdefinitionen importieren.
2. Danach die zugehoerigen Skripte anlegen oder synchronisieren.
3. Anschliessend die Sichtbarkeit und den Aktivierungszustand pruefen.

### Automatisiertes Deployment-Script

Das Repository enthaelt ein defensives Deployment-Script:

- `tools/iobroker/deploy_repository_to_iobroker.sh`

Verwendung:

```bash
# nur anzeigen, was passieren wuerde
tools/iobroker/deploy_repository_to_iobroker.sh

# echte Aenderungen ausfuehren
tools/iobroker/deploy_repository_to_iobroker.sh --apply
```

Das Script:

- liest `iobroker/manifest.json`
- importiert bzw. aktualisiert die dort referenzierten Objektdateien
- schreibt die Skriptinhalte aus `iobroker/scripts/...` in die zugehoerigen Script-Objekte
- ruft danach `verify_iobroker_import.sh` auf
- bricht mit klarer Meldung ab, wenn die ioBroker-CLI fehlt
- faehrt im Dry-Run ohne Aenderung fort

### Kontrollhilfe vor dem Deployment

Vor einem Import kann das Inventarscript ausgefuehrt werden:

```bash
tools/iobroker/list_repository_assets.sh
```

### Zielbild fuer die sichtbaren Skripte

- `script.js.energiemanagement.Battery_Supervisor_V1`
- `script.js.energiemanagement.Battery_Health_V1`
- `script.js.energiemanagement.Energy_Flow_V1`

### Erwartete EOS-Roots

- `0_userdata.0.EOS.Battery`
- `0_userdata.0.EOS.EnergyFlow`
- `0_userdata.0.Energiemanagement`

## Pruefkommandos im ioBroker-Container

Die folgenden Pruefungen sind lesend gedacht:

```bash
iobroker object get script.js.energiemanagement.Battery_Supervisor_V1
iobroker object get script.js.energiemanagement.Battery_Health_V1
iobroker object get script.js.energiemanagement.Energy_Flow_V1
iobroker object get 0_userdata.0.EOS.Battery
iobroker object get 0_userdata.0.EOS.EnergyFlow
```

Wenn die ioBroker-CLI nicht verfuegbar ist, muss das als Fehler gemeldet werden und der Importpfad ist anders zu waehlen.

## Sichtpruefung in ioBroker Admin

Nach dem Import im Admin pruefen:

- Gibt es die drei Energiemanagement-Skripte unter den Javascript-Skripten?
- Sind die erwarteten Objektbaeume unter `0_userdata.0.EOS.*` sichtbar?
- Sind die Skripte aktiv oder bewusst deaktiviert?
- Werden keine unerwarteten Rohpfade importiert?

## Aktivierung der Skripte

- `Battery_Supervisor_V1` nur aktivieren, wenn die Batteriedatenquelle fachlich konsistent ist.
- `Battery_Health_V1` nur aktivieren, wenn die EOS-Battery-States vorhanden sind.
- `Energy_Flow_V1` nur aktivieren, wenn die freigegebenen Lesequellen importiert und sichtbar sind.

## Fehlerdiagnose bei fehlenden Objekten

Wenn nichts sichtbar ist:

1. Pruefen, ob der Import wirklich ausgefuehrt wurde.
2. Pruefen, ob die JSON-Dateien im ioBroker-Import gelandet sind.
3. Pruefen, ob das Javascript-Adapterziel korrekt ist.
4. Pruefen, ob die ioBroker-CLI vorhanden und erreichbar ist.
5. Pruefen, ob der Datenpunktbaum im Admin nur gefiltert und nicht verborgen ist.

Wenn nur Teile fehlen:

- zuerst die Objektdefinitionen kontrollieren,
- dann die Skripte,
- dann die Aktivierung.

## Kurzfassung

GitHub dokumentiert den Stand.
Import oder Deployment macht ihn erst im ioBroker sichtbar.
