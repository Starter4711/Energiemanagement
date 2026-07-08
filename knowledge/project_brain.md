# EOS Project Brain

## 1. Projektziel

EOS steht fuer `Energy Operating System` und bildet die zentrale fachliche Klammer fuer das private Smart-Home- und Energiemanagement-Projekt.

Ziel ist die robuste, ressourcenschonende und moeglichst klare Aufbereitung von Energie-, Batterie-, Verbrauchs- und Steuerinformationen auf Basis des bestehenden ioBroker-Live-Systems.

Das Repository dient als Referenz, Historie und Backup. ioBroker ist das Live-System.

## 2. Architekturuebersicht

Die Architektur trennt bewusst zwischen Referenz und Laufzeit:

- GitHub ist die dokumentierte Referenz und das Backup des Stands.
- ioBroker ist das produktive Live-System.
- `iobroker/scripts/common/` enthaelt den produktionsnahen Altbestand.
- `iobroker/scripts/energiemanagement/` enthaelt die neue modulare EOS-Logik.
- `iobroker/objects/` spiegelt exportierte ioBroker-Objekte.
- `iobroker/tools/` enthaelt Deployment- und Backup-Werkzeuge.
- `iobroker/vis-2/` enthaelt versionierte VIS-2-Quellen.

Wesentliche Daten- und Steuerpfade:

- Victron- und VenusOS-Daten kommen ueber MQTT.
- Batterie-Rohdaten kommen ueber Modbus und HELTEC-MQTT.
- Pool-Aktoren und Sensoren kommen ueber S7.
- go-e-Steuerung erfolgt ueber Adapterobjekte und HTTP-Phasenumschaltung.

Grundsatz:

- Neue Logik soll modular unter `script.js.energiemanagement.*` entstehen.
- Bestehende Common-Skripte bleiben grundsaetzlich unveraendert.

## 3. Module und Status

### Dokumentation und Projektwissen

- `README.md`: kurze Projekteinstiegsebene.
- `PROJECT_MEMORY.md`: historisches Projektgedaechtnis.
- `docs/`: Fachwissen, Architektur, Analysen und Betriebsdokumentation.

### Altbestand unter `iobroker/scripts/common/`

Wichtige Modulgruppen:

- `Victron_*`: MQTT, Limits, Betriebsmodi, Ladegrenzen und Informationen.
- `go-E_*`: Wallbox-Freigabe, Stromregelung, Phasenumschaltung und Verriegelung.
- `Gobel_*`: Zellspannungsdiagnose und Vergleiche.
- `Pool*`: Pooltemperaturen, Ueberschusslogik und S7-/LOGO-Anbindung.
- `Grid-*`, `Wolken-*`, `Priority_Management`: Netz-, PV- und Prioritaetslogik.

Status:

- Der Altbestand ist umfangreich und produktionsnah.
- Seine vollstaendige Abhaengigkeitenkarte ist nicht separat dokumentiert und bleibt teilweise `Unklar`.

### Neues Energiemanagement unter `iobroker/scripts/energiemanagement/`

Aktuelle Module:

- `Config.js`: zentrale Konfigurations-Datenpunkte.
- `Debug.js`: Heartbeat und Debug-Zustand.
- `Bilanz_Zaehlpunkte.js`: saldierte Netzbilanz.
- `Batterie_Zellspannungen.js`: Zellspreizung, Trend und Alarm je Pack.
- `Batterie_BMS_Heltec_Vergleich.js`: BMS-/HELTEC-Vergleich je Pack.
- `Battery_Supervisor_V1.js`: EOS-Batteriegrundlage mit Kommunikationsueberwachung und aufbereiteter Batterie-Sicht.
- `Pool_VIS2_Zeitplaene.js`: VIS-2-Zeitplan-Synchronisation mit `time-switch.0`.
- `Codex_Access_Test.js`: Deployment-Test.

Status:

- Das neue Energiemanagement ist modular aufgebaut.
- `Battery_Supervisor_V1` ist der zentrale EOS-Baustein fuer die Batterieebene.
- Einige kuenftige Modulgrenzen bleiben noch `Unklar`.

### VIS-2-Module

- `dashboard.html`: Hauptansicht.
- `battery.html`: Batteriedetails.
- `pool.html`: Pooldetails.
- `pool-controls.html`: Pool-Bedienkopf.
- `vis-user.css`: Styling.
- `build_vis.py`: Build-Logik.

Status:

- VIS-2 ist versioniert und wird als Ziel-UI gepflegt.

### Tool-Module

- `sync_iobroker.py`: Skriptobjekte sichern, deployen, aktivieren, deaktivieren und loeschen.
- `deploy_vis2.py`: VIS-2-Backup und Deployment.

Status:

- Die Tools sind produktionsnah und besonders vorsichtig zu verwenden.

## 4. Engineering-Standard

Verbindliche Arbeitsregeln:

- Immer zuerst `AGENTS.md` lesen.
- Danach `knowledge/project_brain.md` lesen.
- Danach die fuer die Aufgabe relevanten Knowledge-Dateien lesen.
- Vor jeder Aenderung den Engineering-Prozess und die relevanten Sicherheitsregeln pruefen.
- Kleine, eng begrenzte Aenderungen bevorzugen.
- Keine Informationen raten.
- Keine Platzhalter, TODO-Dummyfunktionen oder Scheinimplementierungen.
- Keine ungefragten Aenderungen an MQTT-Topics, ioBroker-States, Alias-Pfaden, Objekt-IDs oder Adapterinstanzen.
- Vor jedem Commit `git diff` pruefen.
- Relevante Aenderungen in `CHANGELOG.md` dokumentieren.

Ressourcenschonung:

- Nur abgeleitete Werte, Status und Alarme speichern, wenn sinnvoll.
- Datenpunkte nur bei Wertaenderung schreiben.
- Logging im Produktivpfad sparsam einsetzen.
- Polling, Trigger und Schreibfrequenzen auf den fachlichen Bedarf begrenzen.

State-Regeln fuer neue EOS-Skripte:

- Berechnete EOS-States sind read-only.
- Nur Settings-States duerfen `writable: true` tragen.
- In `createBatteryState()` wird `write: definition.writable === true` verwendet.

## 5. Repository

Repository:

- `Starter4711/Energiemanagement`

Branch:

- `ai-foundation`

Wichtige Wurzeln:

- `AGENTS.md`: verbindliche Arbeitsreihenfolge und Sicherheitsregeln.
- `docs/project_analysis.md`: technische Primaerquelle.
- `knowledge/`: dauerhafte Wissensbasis.
- `iobroker/manifest.json`: Referenz fuer den exportierten Skriptbestand.

Charakter des Repositories:

- Es ist eine Mischlandschaft aus Altbestand, neuer Modulstruktur, Werkzeugen und Doku.
- Keine vollstaendige Reproduktion des Live-Systems wird im Repository selbst angestrebt.

## 6. Aktueller Entwicklungsstand

Aktuell liegt der Fokus auf dem EOS-Batteriemodul, insbesondere auf der Beobachtung und Aufbereitung von Batterie- und Kommunikationszustand.

Bekannte Lage:

- `Battery_Supervisor_V1` bildet die zentrale Batterie- und Kommunikationssicht.
- SmartShunt ist die fuehrende Quelle fuer Gesamt-SOC und DC-Spannung.
- Gobel / Pace BMS und HELTEC liefern Ergaenzungs- und Vergleichsdaten.
- Kommunikationsueberwachung ist im Skript angelegt.
- Health, Empfehlungen, Analytics, Historian, Trigger, Timer und VIS gehoeren nicht in diesen Entwicklungsstand, wenn sie nicht ausdruecklich beauftragt sind.

Offene oder nicht sicher belegte Punkte bleiben `Unklar`, insbesondere dort, wo die Dokumentation bewusst nicht den Produktionsstand vollstaendig inventarisiert.

## 7. Letzter freigegebener Commit

Letzter freigegebener Commit:

- `26c5cc5` `Format battery supervisor script`

Dieser Commit hat die Batterie-Supervisor-Datei formal bereinigt und die bestehende Schreibrechte-Logik beibehalten.

## 8. Naechster Entwicklungsschritt

Der naechste fachliche Schritt ist nicht in dieser Datei zu erraten.

Stattdessen gilt:

- Nur die konkret freigegebene Aufgabe bearbeiten.
- Keine neuen Features ohne Auftrag bauen.
- Nur den minimal benoetigten Ausschnitt aendern.

Wenn kein weiterer Auftrag vorliegt, ist der naechste Schritt `Unklar`.

## 9. Dauerhafte Architekturentscheidungen

- GitHub ist Referenz, Historie und Backup.
- ioBroker ist das Live-System.
- Neue Energiemanagement-Logik gehoert unter `iobroker/scripts/energiemanagement/`.
- Bestehende Common-Skripte bleiben grundsaetzlich unveraendert.
- SmartShunt ist fuehrend fuer Gesamt-SOC und DC-Spannung.
- Gobel-SOC ist nicht als fuehrende Gesamtgroesse zu verwenden.
- Aktorische Schreibpfade sind besonders kritisch.
- MQTT-Steuerpfade, go-e-Pfade und S7-Pfade gelten als live-nah und sensibel.
- Ressourcenschonung hat Vorrang.
- Unklare Punkte werden dokumentiert, nicht geraten.

## 10. Arbeitsweise zwischen ChatGPT und Codex

Arbeitsaufteilung:

- ChatGPT dient als fachliches Review-Gate und als Steuerung fuer Klarheit, Struktur und Architektur.
- Codex setzt die beauftragte Aenderung im Repository um.
- Vor fachlicher Arbeit werden die relevanten Wissensquellen gelesen.
- Vor dem finalen Commit wird `git diff` geprueft.
- Nach relevanten Aenderungen werden Dokumentation und Changelog gepflegt.

Arbeitsprinzip:

- Erst verstehen, dann klein aendern, dann prüfen, dann committen, dann pushen.
- Keine stille Umdeutung offener Punkte.
- Keine Erweiterung ohne konkreten Auftrag.

## 11. Startanweisung fuer neue ChatGPT-Chats

1. `AGENTS.md` lesen.
2. `knowledge/project_brain.md` lesen.
3. `knowledge/project.md`, `knowledge/architecture.md`, `knowledge/modules.md`, `knowledge/coding_rules.md` und `knowledge/open_questions.md` lesen.
4. Danach die fuer den aktuellen Auftrag relevanten Themen- und Detaildateien lesen.
5. Erst dann die beauftragte Aenderung oder Analyse beginnen.

Wenn Informationen nicht sicher belegt sind, bleibt der Status `Unklar`.
