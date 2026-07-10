# EOS Project Brain

## 1. Projektziel

EOS steht fuer `Energy Operating System` und bildet die zentrale fachliche Klammer fuer das private Smart-Home- und Energiemanagement-Projekt.

Ziel ist die robuste, ressourcenschonende und moeglichst klare Aufbereitung von Energie-, Batterie-, Verbrauchs- und Steuerinformationen auf Basis des bestehenden ioBroker-Live-Systems.

EOS existiert, weil die Anlage nicht aus Einzelwerten, sondern aus einem zusammengesetzten Betriebssystem fuer Energie verstanden werden muss:

- drei Zaehlpunkte muessen gemeinsam betrachtet werden,
- Batterie, Victron, Wallbox, Pool und Visualisierung beeinflussen sich gegenseitig,
- Schutz, Diagnose und Optimierung muessen getrennt, aber aufeinander bezogen bleiben,
- neue Logik soll dauerhaft wartbar und nicht nur punktuell funktional sein.

Das Repository dient als Referenz, Historie und Backup. ioBroker ist das Live-System.

Fachliche Kernziele:

- Batterie schuetzen.
- Energiefluesse sauber bilanzieren.
- Steuerung und Diagnose klar trennen.
- Neue Logik modular und nachvollziehbar aufbauen.
- VIS2 als klar lesbare Bedien- und Diagnoseoberflaeche pflegen.
- Entscheidungen sollen spaeter nachvollziehbar bleiben, auch wenn der alte Chat nicht mehr verfuegbar ist.
- Fachliche Wahrheit soll im Repository dauerhaft lesbar sein.

Langfristige Vision:

- EOS wird zum konsolidierten, dokumentierten Betriebssystem fuer die Energieanlage.
- Der Batteriebereich wird ueber eine stabile EOS-State-Ebene beobachtet und bewertet.
- VIS2 wird zur lesbaren Fachoberflaeche fuer Betreiber und Diagnose.
- Neue Funktionen entstehen nur dann, wenn sie in die Architektur, die Regeln und die Dokumentation passen.
- Das System soll auch in Jahren noch durch Lesen des Repositories verstehbar bleiben.

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
- Aktorische Schreibpfade werden nur mit grosser Vorsicht aendert.
- Unklare technische oder fachliche Punkte werden nicht geraten.
- GitHub ist die Single Source of Truth fuer den freigegebenen Repository-Stand.
- Live-Änderungen gehoeren nicht in Vermutungen, sondern nur in dokumentierte und gepruefte Aenderungen.
- Architektur wird nicht aus Bequemlichkeit vereinfacht, sondern bewusst in Module, Zustandsmodelle und Verantwortlichkeiten zerlegt.

Architekturprinzipien:

- Modularitaet ist Pflicht, weil die Anlage mehrere Betriebsdomänen mit unterschiedlichen Schutz- und Reaktionszeiten hat.
- Das Supervisor-Konzept sammelt, bewertet und verdichtet Quellen, statt Logik in der Visualisierung oder in unkontrollierten Einzelskripten zu verteilen.
- EOS-States sind die stabile Fachschnittstelle fuer Folgefunktionen.
- VIS2 greift ausschliesslich auf EOS-States zu.
- Visualisierung darf keine Steuerlogik enthalten.
- Rohquellen bleiben Rohquellen; fachliche Verdichtung gehoert in die EOS-Schicht.

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
- `Battery_Supervisor_V1.js`: EOS-Batteriegrundlage mit Kommunikationsueberwachung und aufbereiteter Communication-Baseline.
- `Battery_Health_V1.js`: einfache EOS-Health-Sicht auf Basis der bestehenden Batterie- und Kommunikations-States.
- `Energy_Flow_V1.js`: erste produktive EOS-Schicht fuer konsolidierte Energiefluesse, read-only Energy-Flow-States und ereignisgetriebene Verdichtung.
- `Energy_Flow_V1`-Implementierungsplanung: mehrphasige Umsetzungsplanung fuer die weitere Ausarbeitung der Energy-Flow-Baseline; Grid und Battery sind angebunden, PV/House/Wallbox bleiben aktuell `UNKNOWN`.
- `Pool_VIS2_Zeitplaene.js`: VIS-2-Zeitplan-Synchronisation mit `time-switch.0`.
- `Codex_Access_Test.js`: Deployment-Test.

Status:

- Das neue Energiemanagement ist modular aufgebaut.
- `Battery_Supervisor_V1` ist der zentrale EOS-Baustein fuer die Batterieebene.
- Der Supervisor ist eine aufbereitende, nicht-aktorische Sicht auf Batterie und Kommunikation.
- `Battery_Supervisor_V1` ist als freigegebene Communication-Baseline dokumentiert.
- `Battery_Health_V1` ist der separate, nicht-aktorische Health-Baustein auf Basis der EOS-Battery-States.
- `Energy_Flow_V1` ist als erster produktiver EOS-Baustein fuer die Energiefluss-Ebene implementiert und bleibt read-only.
- `Battery VIS2 Read-Only V1` ist als implementierter, weiterhin read-only VIS2-Baustein dokumentiert.
- `Battery VIS2 Read-Only V1 State-Mapping` ist dokumentiert und dient als Grundlage fuer die VIS2-Ansicht.
- Die freigegebene Battery VIS2 Read-Only V1-Ansicht zeigt Summary, Communication, Warnings, Health, SmartShunt und Pack-States und bleibt ohne eigene Fachlogik.
- `battery.html` ist die fuehrende Pflegequelle fuer die Battery-VIS2-Ansicht; `vis-views.json` ist das generierte Exportartefakt.
- `Battery V1 Release Status` dokumentiert den freigegebenen Stand der Batteriekomponenten und den naechsten fachlichen Freigabeschritt.
- `Energy Flow V1` ist als erster produktiver EOS-Baustein implementiert und bleibt read-only.
- `Energy Flow V1` nutzt fuer Grid die dokumentierte EOS-interne Bilanzsicht und bleibt von Rohpfaden getrennt.
- Grid und Battery sind aktiv angebunden; PV, House und Wallbox bleiben aktuell `UNKNOWN`, bis freigegebene EOS-interne Quellen dafuer dokumentiert sind.
- `Energy_Flow_V1` arbeitet ereignisgetrieben, vermeidet Polling und verwendet fuer `LastUpdate` Millisekunden-Timestamps.
- Der Repository-Stand allein erzeugt keine sichtbaren ioBroker-Objekte; fuer Sichtbarkeit ist ein Import- oder Deployment-Schritt erforderlich.
- `docs/iobroker_deployment_v1.md` dokumentiert den manuellen Importweg und die Sichtpruefung im ioBroker.
- `tools/iobroker/deploy_repository_to_iobroker.sh` fuehrt den lesenden Dry-Run und den optionalen `--apply`-Import fuer Repository-Artefakte aus.
- `tools/iobroker/list_repository_assets.sh` und `tools/iobroker/verify_iobroker_import.sh` sind die read-only Hilfsscripte fuer Inventar und Importkontrolle.
- `tools/iobroker/run_iobroker_deployment.sh` ist der reproduzierbare Codex-Wrapper fuer Inventar, Dry-Run, optionales Apply und Verifikation.
- Einige kuenftige Modulgrenzen bleiben noch `Unklar`.
- New-Workflow-Module werden nur dort angelegt, wo die Architektur sie vorsieht.
- Das Modul-Set ist bewusst klein gehalten, um neue Logik nicht in verstreuten Einzeldateien zu verlieren.

### VIS-2-Module

- `dashboard.html`: Hauptansicht.
- `battery.html`: Batteriedetails.
- `pool.html`: Pooldetails.
- `pool-controls.html`: Pool-Bedienkopf.
- `vis-user.css`: Styling.
- `build_vis.py`: Build-Logik.

Status:

- VIS-2 ist versioniert und wird als Ziel-UI gepflegt.
- VIS2 soll keine rohe Quellfragmentierung zeigen, sondern verdichtete, nachvollziehbare Fachzustaende.
- UI-Werte sollen lesbar, ruhig und fachlich klar sein, nicht maximal bunt oder datenueberladen.
- VIS2 ist Zieloberflaeche fuer Batterie- und Poolansichten, VIS1 bleibt der produktive Altbestand, solange nicht anders freigegeben.
- VIS2 ist Anzeige- und Bedienoberflaeche, nicht Regelinstanz.
- Keine Fachlogik gehoert in die Visualisierung.

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
- GitHub ist die Single Source of Truth und damit der massgebliche Referenzpunkt fuer freigegebene Aenderungen.
- Jeder Commit wird fachlich reviewt, bevor er als weiterverarbeitet gilt.
- `knowledge/project_brain.md` wird nach jedem freigegebenen Commit aktualisiert, wenn sich der dauerhafte Projektstand geaendert hat.
- ChatGPT fuehrt den Entwicklungsprozess, Codex setzt ihn im Repository um.
- Nach jedem Review muss unmittelbar der naechste passende Codex-Auftrag entstehen, damit der Arbeitsfluss nicht abreisst.
- Wiederholungen werden vermieden, wenn der notwendige Kontext bereits in der Wissensbasis steht.
- Rueckfragen sind nur sinnvoll, wenn eine Entscheidung sonst nicht belastbar getroffen werden kann.

## 4a. Entwicklungs- und Reviewprozess

### Entwicklungsprozess

1. ChatGPT definiert Architektur, Spezifikation und Abnahmekriterien.
2. Codex implementiert nicht nur die Aufgabe, sondern fuehrt vor jedem Commit ein verpflichtendes Selbstaudit durch.
3. Das Selbstaudit umfasst mindestens:
   - vollstaendige Pruefung gegen `knowledge/project_brain.md`
   - Pruefung gegen alle referenzierten Spezifikationen
   - Pruefung gegen den aktuellen Codex-Auftrag
   - `git diff --check`
   - Kontrolle auf TODOs, Dummyfunktionen, Platzhalter und unerwuenschte Erweiterungen
   - Pruefung aller geaenderten Dateien auf Vollstaendigkeit und Konsistenz
4. Erst nach erfolgreichem Selbstaudit darf committet und gepusht werden.
5. ChatGPT fuehrt anschliessend einen unabhaengigen Architektur- und Code-Review durch.
6. Dabei gilt:
   - jede geaenderte Datei wird vollstaendig gelesen
   - jede Aenderung wird mit Auftrag, `knowledge/project_brain.md` und den Spezifikationen verglichen
   - Entscheidungen werden ausschliesslich anhand des tatsaechlichen Inhalts getroffen
   - Vermutungen oder Interpretationen sind unzulaessig
7. Erst danach erfolgt die Entscheidung:
   - Freigeben
   - Korrektur erforderlich

### Verbindliche Prioritaet

- Repositoryinhalt hat Vorrang vor Commitbeschreibung oder Zusammenfassungen.
- Architekturentscheidungen werden ausschliesslich anhand des tatsaechlichen Dateiinhalts getroffen.

Ressourcenschonung:

- Nur abgeleitete Werte, Status und Alarme speichern, wenn sinnvoll.
- Datenpunkte nur bei Wertaenderung schreiben.
- Logging im Produktivpfad sparsam einsetzen.
- Polling, Trigger und Schreibfrequenzen auf den fachlichen Bedarf begrenzen.

State-Regeln fuer neue EOS-Skripte:

- Berechnete EOS-States sind read-only.
- Nur Settings-States duerfen `writable: true` tragen.
- In `createBatteryState()` wird `write: definition.writable === true` verwendet.
- Schreibbare States sind Konfigurations- oder Einstellwerte, keine berechneten Fachresultate.

Supervisor-Philosophie:

- Der Supervisor beobachtet, bewertet und strukturiert.
- Er ersetzt keine Hardware-Schutzfunktionen.
- Er liefert die freigegebene Communication-Baseline ohne Recommendation-Gruppe.
- Er speichert nur die fachlich notwendigen abgeleiteten Stati.
- Seine Aufgabe ist Verdichtung, nicht Steuerungsersatz.
- Er soll Zustandswechsel sichtbar machen, ohne das System mit Nebenlogik zu ueberfrachten.

Battery-Supervisor-Konzept:

- `Battery_Supervisor_V1` bildet die erste EOS-Ebene fuer den Batteriebereich.
- Er sammelt SmartShunt, Gobel / Pace BMS, Heltec und MQTT zu einer konsolidierten Sicht.
- SmartShunt bleibt fuehrend fuer Gesamt-SOC und DC-Spannung.
- Gobel / Pace BMS bleibt fuehrend fuer Schutz und Plausibilisierung.
- Heltec bleibt Diagnoseebene fuer Zellspannungen.
- Kommunikationszustand, LastUpdate, AgeSeconds und Status werden als eigene EOS-Sicht aufbereitet.
- Die EOS-Batteriesicht ist die fachliche Wahrheitsschicht fuer Batterie, nicht die Rohdatenebene.
- Der Supervisor ist bewusst nicht als Aktor aufgebaut, weil Schutz- und Echtzeitfunktionen auf der vorgesehenen Hardware bleiben muessen.

EOS-State-Modell:

- Das EOS-State-Modell ist die stabile interne API fuer nachgelagerte Logik und VIS2.
- Neue Funktionen sollen auf bestehenden EOS-States aufsetzen statt Rohquellen direkt zu verknuepfen.
- Zustandsnamen, Rollen und Schreibrechte muessen zur fachlichen Bedeutung passen.
- Berechnete Fachzustände sind read-only.
- Konfigurierbare Grenz- und Steuerwerte sind Settings-States.
- VIS2 liest nur aus dem EOS-State-Modell, nicht aus willkuerlichen Rohquellen.

LiFePO4-Grundlagen:

- LiFePO4 wird im Projekt als Batteriechemie mit hohem Schutzbedarf und klaren Betriebsgrenzen behandelt.
- Schonung, Temperaturgrenzen und saubere Ladefuehrung haben Vorrang vor maximaler Ausnutzung.
- Volle Ladezustands- oder Zellspannungsbewertung darf nicht ohne Kontext aus Diagnosewerten abgeleitet werden.
- Schutzinstanzen und reale Hardwaregrenzen haben Vorrang vor Optimierungszielen.
- Batteriedaten werden deshalb immer im Zusammenspiel von SmartShunt, BMS und Diagnoseebenen interpretiert.
- Zellspannungen allein sind keine hinreichende Gesamtbewertung.
- LiFePO4 ist im Projekt kein starres System, sondern ein in Betrieb, Temperatur und Ladezustand wechselndes Schutzsystem.
- Spannung, SOC, Temperatur und BMS-Zustaende beeinflussen gemeinsam die erlaubte Ladeleistung.
- Starre Grenzwerte ohne Kontext sind fachlich unzureichend.
- Bewertung muss deshalb kontextabhängig erfolgen und die aktuelle Systemlage beruecksichtigen.

Qualitaetsziele:

- klare technische Antworten statt vager Formulierungen,
- keine stillschweigende Umdeutung offener Punkte,
- keine redundante Logik,
- geringe Komplexitaet im Produktivpfad,
- nachvollziehbare Doku statt implizitem Wissen,
- konsistente Begriffe ueber alle Dokumente hinweg.

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
- Das Repository ist nicht der Realbetrieb, sondern die referenzierte Entwicklungs- und Wissensbasis.
- GitHub speichert die freigegebene Wahrheit; lokale Zustandsaenderungen ohne Commit sind kein dokumentierter Projektstand.
- Das Repository soll den Projektstand so dokumentieren, dass ein neuer Chat ohne Vorwissen weiterarbeiten kann.

## 6. Aktueller Entwicklungsstand

Aktuell liegt der Fokus auf der Batterie als abgeschlossenem EOS-Teil und auf dem implementierten Energy Flow V1, dessen Phase 2 freigegeben ist.
Weitere fachlich freigegebene Schritte sind in der aktuellen Dokumentation nicht abschliessend benannt.

Bekannte Lage:

- `Battery_Supervisor_V1` bildet die zentrale Batterie- und Kommunikationssicht.
- `Battery_Supervisor_V1` ist als Communication-Baseline freigegeben.
- SmartShunt ist die fuehrende Quelle fuer Gesamt-SOC und DC-Spannung.
- Gobel / Pace BMS und HELTEC liefern Ergaenzungs- und Vergleichsdaten.
- Kommunikationsueberwachung ist im Skript angelegt.
- Die Batteriedaten werden unter `0_userdata.0.EOS.Battery.*` als aufbereitete Fachsicht bereitgestellt.
- `Battery_Health_V1` ist als separater, nicht-aktorischer Health-Baustein Teil des freigegebenen Batterie-Umfangs.
- `Energy_Flow_V1` ist als erste produktive EOS-Schicht fuer konsolidierte Energiefluesse implementiert und bleibt read-only.
- `Battery VIS2 Read-Only V1` ist implementiert und bleibt weiterhin read-only.
- Health, Empfehlungen, Analytics, Historian, Trigger, Timer und VIS gehoeren nicht in diesen Entwicklungsstand, wenn sie nicht ausdruecklich beauftragt sind.
- Der freigegebene Battery-V1-Stand umfasst Supervisor, Health und die read-only Battery-VIS2-Ansicht als abgeschlossenen Batterieumfang.
- Die Kommunikationsueberwachung arbeitet mit LastUpdate, AgeSeconds und Status je Quelle.
- Bekannte Quellen sind SmartShunt, Gobel / Pace BMS, Heltec und MQTT.
- `Battery_Supervisor_V1` ist der erste echte EOS-Baustein fuer die Batterieebene.
- `Battery_Supervisor_V1` soll Batterie- und Kommunikationszustand verdichten, nicht aktorisch steuern.
- Die langfristige Entwicklungsrichtung ist der Aufbau weiterer EOS-Module auf derselben State- und Doku-Grundlage.
- VIS2 soll spaeter moeglichst nur verdichtete EOS-States anzeigen.
- Der letzte freigegebene Commit ist `273b4f13e51b88237c58d7247326eb34cc0b2c89`.
- Die neue VIS2-Batterieansicht ist implementiert und bleibt read-only.
- Das State-Mapping fuer Battery VIS2 Read-Only V1 ist dokumentiert und die Visualisierung selbst bleibt read-only.
- Aenderungen an der Battery-VIS2-Ansicht werden in `battery.html` begonnen und danach nach `vis-views.json` exportiert.
- Health gehoert zur Battery-VIS2-Ansicht, wenn ausschliesslich `0_userdata.0.EOS.Battery.Health.*` verwendet wird.
- `Energy Flow V1` ist als erster produktiver EOS-Baustein implementiert und bleibt read-only.

Offene oder nicht sicher belegte Punkte bleiben `Unklar`, insbesondere dort, wo die Dokumentation bewusst nicht den Produktionsstand vollstaendig inventarisiert.

Roadmap:

- EOS-Batterieschicht weiter verdichten.
- Kommunikations- und Statussicht stabil halten.
- Weitere fachliche Verdichtung nur dann ergaenzen, wenn sie zur Architektur passt und dokumentierbar ist.
- VIS2-Sichten an EOS-States anbinden, nicht an Rohquellen.
- Offene Fragen in `knowledge/open_questions.md` und den fachlichen Entscheidungsdokumenten weiter reduzieren.

## 7. Letzter freigegebener Commit

Letzter freigegebener Commit:

- `273b4f13e51b88237c58d7247326eb34cc0b2c89`

Energy Flow V1 Phase 2 ist freigegeben.

## 8. Naechster Entwicklungsschritt

Der naechste fachliche Schritt ist nicht in dieser Datei zu erraten.

Stattdessen gilt:

- Nur die konkret freigegebene Aufgabe bearbeiten.
- Keine neuen Features ohne Auftrag bauen.
- Nur den minimal benoetigten Ausschnitt aendern.
- Neue Arbeit startet immer mit `AGENTS.md` und `knowledge/project_brain.md`.
- Die Roadmap ist dokumentationsgetrieben: offene Fragen zuerst klaeren, dann gezielt in Module oder Doku ueberfuehren.
- Wenn kein Auftrag vorliegt, bleibt der naechste Entwicklungsschritt offen.
- Der naechste Entwicklungsschritt ergibt sich aus der dokumentierten Roadmap, nicht aus spontaner Annahme.

Wenn kein weiterer Auftrag vorliegt, ist der naechste Schritt `Unklar`.

## 8a. Naechster Klärungspunkt

Vor weiteren fachlichen Erweiterungen muss die naechste freigegebene EOS-Modulgrenze eindeutig benannt werden.
Solange diese Freigabe nicht dokumentiert ist, bleiben neue Module `Unklar`.

## 8b. Battery VIS2 Read-Only V1

Die read-only Batterieansicht ist implementiert.

Sie darf ausschliesslich bestehende EOS-Battery-States lesen und keine Rohquellen, Steuerlogik oder Aktorik verwenden.

## 8c. Battery VIS2 Read-Only V1 State-Mapping

Das State-Mapping fuer die read-only Batterieansicht ist dokumentiert und dient als Grundlage fuer die VIS2.
Die Umsetzung bleibt weiterhin auf die freigegebenen EOS-Battery-States beschraenkt.

## 9. Dauerhafte Architekturentscheidungen

- GitHub ist Referenz, Historie und Backup.
- ioBroker ist das Live-System.
- Neue Energiemanagement-Logik gehoert unter `iobroker/scripts/energiemanagement/`.
- Bestehende Common-Skripte bleiben grundsaetzlich unveraendert.
- SmartShunt ist fuehrend fuer Gesamt-SOC und DC-Spannung.
- `Battery_Supervisor_V1` bleibt die freigegebene Communication-Baseline.
- `Battery_Health_V1` bleibt ein separater, nicht-aktorischer Health-Baustein.
- `Battery V1 Release Status` dokumentiert den freigegebenen Gesamtstatus der Batterieebene.
- `Battery V1` ist als abgeschlossen dokumentiert.
- `Energy_Flow_V1` ist als erste produktive EOS-Schicht implementiert und bleibt read-only.
- `e2f538f` und `7cb51af` sind die freigegebenen Energy-Flow-Spezifikationsstaende.
- `273b4f13e51b88237c58d7247326eb34cc0b2c89` implementiert die freigegebene Phase-2-Erweiterung von Energy Flow V1 und ist der letzte freigegebene Commit.
- Gobel-SOC ist nicht als fuehrende Gesamtgroesse zu verwenden.
- Aktorische Schreibpfade sind besonders kritisch.
- MQTT-Steuerpfade, go-e-Pfade und S7-Pfade gelten als live-nah und sensibel.
- Ressourcenschonung hat Vorrang.
- Unklare Punkte werden dokumentiert, nicht geraten.
- Berechnete EOS-States sind read-only.
- Nur Settings-States duerfen writebar sein.
- VIS2 soll verdichtet, ruhig und fachlich lesbar bleiben.
- VIS2 darf nicht zum Rohdaten-Dashboard werden, sondern soll Fachzustand verdichten.
- LiFePO4-Schutz und Batterielebensdauer haben Vorrang vor Ausnutzungsmaximierung.
- Keine gezielte Batterieentladung ins Netz.
- Schwarzstartfaehigkeit darf nicht verschlechtert werden.
- Die Batterie wird als Schutz- und Versorgungsressource behandelt, nicht als Verbrauchsreserve fuer fremde Optimierungsziele.
- Vor jeder Aenderung sind Backups und Impact auf Live-Pfade mitzudenken.
- Dokumentation ist Teil der Architektur, nicht Nachtrag.

## 10. Arbeitsweise zwischen ChatGPT und Codex

Arbeitsaufteilung:

- ChatGPT dient als fachliches Review-Gate und als Steuerung fuer Klarheit, Struktur und Architektur.
- Codex setzt die beauftragte Aenderung im Repository um.
- Vor fachlicher Arbeit werden die relevanten Wissensquellen gelesen.
- Vor dem finalen Commit wird `git diff` geprueft.
- Nach relevanten Aenderungen werden Dokumentation und Changelog gepflegt.
- GitHub speichert und verteilt den freigegebenen Stand.
- Die Wissensbasis soll fuer einen neuen Chat den Projektstand ohne Nachfragen rekonstruierbar machen.
- Reviews sichern, dass Architektur, Regeln und bestehende Entscheidungen nicht stillschweigend aufgeweicht werden.
- Der Reviewprozess ist kein Formalismus, sondern die Sicherung gegen unbeabsichtigte architektonische Drift.
- ChatGPT macht die fachliche Einordnung, Codex setzt um, GitHub konserviert.
- Nach jedem freigegebenen Commit wird der dauerhafte Projektkontext aktualisiert, damit die Wissensbasis mit dem Stand Schritt haelt.

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
6. Bei Batterie-, Victron- oder MQTT-Arbeit zusaetzlich die entsprechenden fachlichen Dokumente heranziehen.
7. Danach nur den minimal benoetigten, dokumentierten Arbeitsumfang umsetzen.
8. Nach dem Review den naechsten Codex-Auftrag festziehen, statt den Kontext offen zu lassen.

Wenn Informationen nicht sicher belegt sind, bleibt der Status `Unklar`.

## Startup Checklist

Vor jeder fachlichen Arbeit gilt zwingend folgende Reihenfolge:

1. Lies `knowledge/project_brain.md` vollständig.
2. Lies alle in `project_brain.md` referenzierten Dokumente rekursiv.
3. Wenn eine referenzierte Datei fehlt oder nicht gelesen werden kann:
   - stoppe nach dem Einlesen,
   - liste ausschließlich die fehlenden Dateien auf,
   - beginne keine fachliche Arbeit.
4. Prüfe anschließend den aktuellen GitHub-Stand.
5. Prüfe den zuletzt freigegebenen GitHub-Commit fachlich und technisch.
6. Prüfe, ob `knowledge/project_brain.md` den aktuellen Stand widerspiegelt.
7. Erst danach Architekturentscheidungen treffen.
8. Erst danach Codex-Aufträge erzeugen.
9. Keine Projektphase überspringen.
10. Immer den aktuell freigegebenen Entwicklungsstand fortsetzen.
11. Während des Bootstraps keinen Codex-Auftrag erzeugen.

## Rollen

ChatGPT:

- Projektarchitekt
- GitHub-Review
- Architekturentscheidungen
- Priorisierung
- Erzeugt Codex-Aufträge

Codex:

- Implementiert ausschließlich freigegebene Aufgaben.
- Bewertet keine eigenen Commits.
- Führt keine Architekturentscheidungen aus.

GitHub:

- Single Source of Truth.

## Projektpflege

Nach jedem freigegebenen Commit sind mindestens zu pruefen und bei Bedarf zu aktualisieren:

- `knowledge/project_brain.md`
- `knowledge/decisions.md`
- `knowledge/roadmap.md`
- `CHANGELOG.md`

Diese Pflege ist notwendig, damit der dauerhafte Projektkontext nach jeder freigegebenen Aenderung konsistent bleibt und ein neuer Chat nicht mit veraltetem Wissen startet.

## ChatGPT Startup Procedure

Vor jeder fachlichen Arbeit muss ChatGPT:

1. `knowledge/project_brain.md` aus dem GitHub-Repository lesen.
2. Alle in `project_brain.md` referenzierten Dokumente rekursiv einlesen.
3. Die erfolgreich gelesenen Dateien auflisten.
4. Fehlende oder nicht lesbare Dateien separat auflisten.
5. Erst nach erfolgreichem Einlesen mit der fachlichen Arbeit beginnen.
6. Während des gesamten Chats gilt ausschließlich der eingelesene Projektkontext als Arbeitsgrundlage.
7. Nach jedem freigegebenen Review sofort den nächsten vollständigen Codex-Auftrag liefern.
8. Antworten enden immer mit:
   - `➡️ In Codex (neuer Chat)` oder `➡️ In Codex (bestehender Chat)`
   - vollständiger Codex-Auftrag
   - `Ich warte auf:` mit der exakt erwarteten Rückmeldung

Ziel dieses Ablaufs ist, dass ein neuer Chat nach dem Einlesen ohne weitere Erklärungen unmittelbar die Projektleitung übernehmen kann.

Nach erfolgreichem Einlesen aller erforderlichen Dokumente endet der Bootstrap mit:

Projektkontext erfolgreich übernommen.

Aktueller Fokus:
<aktuelles Modul>

Nächster Schritt:
Prüfung des zuletzt freigegebenen GitHub-Commits und Architektur-Review.

Bereit für die fachliche Arbeit.

Es gilt dabei:

- Kein Codex-Auftrag während des Bootstraps.
- Keine Rückfrage nach der nächsten Aufgabe.
- Kein `Ich warte auf die nächste Aufgabe`.
- Nach abgeschlossenem Bootstrap übernimmt ChatGPT automatisch die Projektleitung.
- Der erste fachliche Schritt ist immer:
  1. Prüfung des letzten freigegebenen GitHub-Commits.
  2. Architektur-Review.
  3. Entscheidung (Freigabe/Korrektur).
  4. Sofortiger vollständiger Codex-Auftrag.
