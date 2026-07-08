# CHANGELOG

## 2026-07-08
- Changed
  - `knowledge/project_brain.md` um die veraltete Battery-VIS2-State-Mapping-Nachfolgeaussage bereinigt und Energy Flow V1 als aktuelle Spezifikationsphase bestaetigt

## 2026-07-08
- Changed
  - `knowledge/project_brain.md` auf den freigegebenen Battery-Abschluss und die Energy-Flow-Spezifikationsphase nach `e2f538f` aktualisiert

## 2026-07-08
- Added
  - `docs/energy_flow_v1_spec.md` als Spezifikation fuer EOS Energy Flow V1 ergaenzt
  - `docs/energy_flow_v1_state_model.md` als State-Modell fuer EOS Energy Flow V1 ergaenzt
- Changed
  - `knowledge/project_brain.md` um die Spezifikationsphase von Energy Flow V1 ergaenzt

## 2026-07-08
- Added
  - `docs/battery_v1_release_status.md` als kompakten Abschlussstatus fuer Battery V1 ergaenzt
- Changed
  - `knowledge/project_brain.md` um den freigegebenen Battery-V1-Gesamtstatus ergaenzt

## 2026-07-08
- Changed
  - `iobroker/vis-2/main/battery.html` und `iobroker/vis-2/main/vis-views.json` gegen die dokumentierte Battery-VIS2-Health-Ansicht verifiziert: Health-Bereich vorhanden, nur EOS-Health-States verwendet, keine Buttons oder Eingaben im Batterie-Block

## 2026-07-08
- Changed
  - `docs/battery_vis2_readonly_v1_spec.md` um den read-only Health-Anzeigebereich fuer Battery VIS2 Read-Only V1 ergaenzt
  - `docs/vis2_source_of_truth.md` um die Einordnung von Health als Battery-View bei reinen EOS-Health-States ergaenzt
  - `knowledge/project_brain.md` um die explizite Battery-VIS2-Sicht auf Health ergaenzt

## 2026-07-08
- Added
  - `docs/battery_vis2_documentation_check_v1.md` als reinen Konsistenzcheck fuer die Battery-VIS2-Dokumentation ergaenzt

## 2026-07-08
- Added
  - `docs/vis2_source_of_truth.md` als Fuehrungsdokument fuer `battery.html` und `vis-views.json` bei Battery VIS2 Read-Only V1 ergaenzt
- Changed
  - `knowledge/project_brain.md` um die fuehrende Pflegequelle und das Exportartefakt fuer die Battery-VIS2-Ansicht praezisiert

## 2026-07-08
- Changed
  - `docs/battery_supervisor_v1_spec.md` auf die freigegebene Communication-Baseline reduziert, ohne Recommendation-Gruppe und mit Settings nur fuer `CommunicationWarningTimeout_s` und `CommunicationOfflineTimeout_s`
  - `docs/battery_vis2_readonly_v1_spec.md` auf den implementierten, weiterhin read-only Status von Battery VIS2 Read-Only V1 und die EOS-Battery-States praezisiert
  - `knowledge/project_brain.md` um den implementierten read-only VIS2-Stand und die freigegebene Supervisor-Baseline praezisiert

## 2026-07-08
- Added
  - `docs/battery_architecture_review_v1.md` als Architektur- und Integritaetspruefung der EOS-Battery-Kette ergaenzt
- Changed
  - `iobroker/vis-2/main/vis-views.json` um die Batterie-Main-Kachel auf EOS-Battery-States umgestellt und Rohpfade entfernt
- Added
  - `iobroker/vis-2/main/battery.html` als read-only Batterieansicht fuer die EOS-Battery-States umgesetzt
- Changed
  - `iobroker/vis-2/main/vis-user.css` um die responsiven Layoutbausteine fuer die neue Batterieansicht erweitert
- Changed
  - `knowledge/project_brain.md` um den implementierten Battery VIS2 Read-Only V1-Stand und das State-Mapping aktualisiert
- Added
  - `docs/battery_vis2_readonly_v1_state_mapping.md` als minimale State-Mapping-Tabelle fuer Battery VIS2 Read-Only V1 ergaenzt
- Changed
  - `knowledge/project_brain.md` um den Dokumentationsschritt `Battery VIS2 Read-Only V1 State-Mapping` ergaenzt
- Added
  - `docs/battery_vis2_readonly_v1_spec.md` als reine Spezifikation fuer eine spaetere read-only Battery-VIS2-Ansicht ergaenzt
- Changed
  - `knowledge/project_brain.md` um `Battery VIS2 Read-Only V1` als naechsten spezifizierten, aber noch nicht implementierten Schritt ergaenzt
- Changed
  - `knowledge/project_brain.md` um den naechsten Klaerungspunkt vor weiterer Implementierung ergaenzt
- Changed
  - `knowledge/project_brain.md` auf den freigegebenen Stand nach `638aa9f82c83cf015c9def452c686ddf254280fb` aktualisiert
- Changed
  - `iobroker/scripts/energiemanagement/Battery_Health_V1.js` auf dem aktuellen Remote-Stand verifiziert: mehrzeilig, `use strict` auf eigener Zeile, Objekt und Manifest vorhanden
- Changed
  - `iobroker/scripts/energiemanagement/Battery_Health_V1.js` technisch neu umbrochen, ohne die Health-Logik zu aendern
- Changed
  - `iobroker/objects/energiemanagement.Battery_Health_V1.json` und `iobroker/manifest.json` um `script.js.energiemanagement.Battery_Health_V1` ergaenzt
- Added
  - `iobroker/scripts/energiemanagement/Battery_Health_V1.js` als separaten, nicht-aktorischen EOS-Baustein fuer eine einfache Battery-Health-Sicht ergaenzt
- Changed
  - `knowledge/project_brain.md` um `Battery_Health_V1` und den naechsten Entwicklungsstand ergaenzt
- Changed
  - `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js` gegen die freigegebene Communication-Baseline verifiziert; keine fachlichen Reste ausserhalb der Kommunikationsueberwachung vorhanden
- Changed
  - `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js` auf dem freigegebenen Remote-Stand bestaetigt: echte LF-Zeilenumbrueche, 712 Zeilen, keine fachliche Aenderung erforderlich
- Changed
  - `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js` technisch repariert, als echtes JavaScript lauffaehig gemacht und mit sparsamem Kommunikations-Refresh versehen
- Changed
  - `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js` auf die Kommunikations-Basissicht reduziert und auf reine Offline-Warnungen fuer SmartShunt, Gobel / Pace BMS, Heltec und MQTT beschraenkt
- Added
  - `knowledge/project_brain.md` um Bootstrap-Abschluss und Projektleitung erweitert
  - `knowledge/project_brain.md` um Startup Checklist und Rollen erweitert
  - `AGENTS.md` um die ChatGPT Startup Sequence ergaenzt
  - `knowledge/project_brain.md` um Startup-Procedure und Projektpflege erweitert
  - `docs/battery_supervisor_v1_spec.md` als Spezifikation fuer den ersten EOS-Baustein im Batteriebereich ergaenzt
  - `docs/battery_supervisor_v1_state_model.md` als finale EOS-State-Spezifikation fuer Battery Supervisor V1 ergaenzt
  - `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js`
    als Architektur-Grundgeruest fuer die EOS-Batteriestruktur unter
    `0_userdata.0.EOS.Battery.*` ergaenzt
- Changed
  - `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js` um die Kommunikationsueberwachung fuer SmartShunt, Gobel / Pace BMS, Heltec und MQTT mit `LastUpdate`, `AgeSeconds` und `Status` erweitert
  - `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js` um die Settings `CommunicationWarningTimeout_s` und `CommunicationOfflineTimeout_s` erweitert
  - `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js` um die Statuswerte `OK`, `WARN`, `OFFLINE` und `UNKNOWN` fuer die Kommunikationsbewertung erweitert
- Changed
  - `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js`
    um die erste Rohdatenaufnahme von SmartShunt, Gobel BMS und Heltec ergaenzt
- Changed
  - `knowledge/requirements.md` um den Requirements-Eintrag fuer
    Battery Supervisor V1 ergaenzt
  - `knowledge/decisions.md` um den Beschluss fuer Battery Supervisor V1
    ergaenzt
  - `knowledge/decisions.md` um das finale EOS-State-Modell fuer Battery
    Supervisor V1 ergaenzt
- Notes
  - Die Spezifikation beschreibt nur Beobachtung, Bewertung und aufbereitete
    EOS-Daten unter `0_userdata.0.EOS.Battery.*`.
  - Die State-Spezifikation ist als stabile API dokumentiert und wird nach
    Veröffentlichung nur um neue States erweitert.

## 2026-07-07
- Added
  - `docs/migration_matrix.md` als Migrationsmatrix vom ioBroker-common-Altbestand zum modularen Energiemanagement ergaenzt
- Changed
  - `knowledge/open_questions.md` um unklare Skriptrollen und Abgrenzungen erweitert
- Notes
  - Die Matrix fasst alle Skripte aus `iobroker/manifest.json` zusammen und markiert produktive Schreibpfade sowie bereits ersetzte Gobel-Skripte

## 2026-07-07
- Added
  - `docs/vis_live_sync_report.md` fuer den Live-Abgleich von VIS1 und VIS2 ergaenzt
  - Live-Backups von VIS1 und VIS2 unter `iobroker/backups/20260707T180000Z/` abgelegt
- Changed
  - VIS1 als aktuell produktive Visualisierung und VIS2 als Ziel-Visualisierung dokumentiert
  - `docs/vis_live_sync_report.md` auf den geklaerten Produktivstatus von VIS1 und die Zielrolle von VIS2 aktualisiert
  - `knowledge/open_questions.md` um weiterhin offene VIS1-Fragen bereinigt und praezisiert
- Notes
  - VIS2 stimmt mit dem Repository-Stand unter `iobroker/vis-2/main/` ueberein
  - VIS1 ist die produktive Alt-Visualisierung und bleibt vor VIS-Arbeiten zu sichern

## 2026-07-07
- Added
  - Frischer Live-Export aus dem ioBroker-Container gezogen und `iobroker/manifest.json` aktualisiert
- Changed
  - `docs/iobroker_live_sync_report.md` auf den frischen Live-Export umgestellt
  - Repository und Live-Stand erneut fuer `script.js.common.*` und `script.js.energiemanagement.*` abgeglichen
- Notes
  - Im frischen Export fehlen `script.js.energiemanagement.Bilanz_Zaehlpunkte` und `script.js.energiemanagement.Debug` gegenueber dem Repository

## 2026-07-07
- Added
  - `docs/iobroker_live_sync_report.md` fuer den Live-Abgleich zwischen ioBroker und Repository ergaenzt
- Changed
  - Live-Stand aus ioBroker gegen den Repository-Stand fuer `script.js.common.*` und `script.js.energiemanagement.*` verglichen
  - Keine produktiven Skripte, ioBroker-Objekte oder Enabled-Status geaendert
- Notes
  - Der exportierte Stand war fuer den Vergleich inhaltlich konsistent

## 2026-07-07
- Added
  - AI-Knowledge-Base eingefuehrt
  - Requirements-Struktur eingefuehrt
  - Knowledge-Navigation und Governance weiter verdichtet
  - Oesterreichisches Zahlenformat als Dokumentationsstandard ergaenzt
- Changed
  - Hardware-Topologie dokumentiert
  - Batteriearchitektur dokumentiert
  - Design Principles eingefuehrt
  - Knowledge-Base-Governance eingefuehrt
  - Requirements-Markdown lesbarer formatiert
- Notes
  - Review-/Engineering-Prozess wird eingefuehrt
