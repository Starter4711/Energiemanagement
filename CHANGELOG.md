# CHANGELOG

## 2026-07-25
- Changed
  - Energy-Flow-Spezifikation und State-Modell von einem einzelnen Grid auf getrennte Bereiche Grid 40, Grid 41 und Grid 43 umgestellt
  - exaktes Mapping auf `0_userdata.0.EOS.Grid.Sources.Grid40|Grid41|Grid43.*` festgelegt
- Removed from target model
  - `EnergyFlow.Grid.Power`, `.Status` und `.LastUpdate` als fachlich ungueltige Einzel-Grid-Sicht
- Notes
  - keine Grid-Summierung, Grid 42 ausgeschlossen und RS450 keinem Grid zugeordnet
  - reine Dokumentationsaenderung; kein Code- oder Live-Deployment

## 2026-07-25
- Deployed
  - korrigiertes `Grid_Flow_V1` 1.0.2 mit createState-basierter Selbstheilung live eingespielt und aktiv belassen
- Tested
  - `Grid40.AgeSeconds` kontrolliert gelöscht und innerhalb des 60-Sekunden-Zyklus automatisch wieder angelegt
  - wiederangelegter State unmittelbar mit numerischem Wert `0` befüllt
- Verified
  - Grid 40, 41 und 43 jeweils `OK`; keine Summary-Objekte und keine neuen Grid-Fehler
- Backup
  - `/opt/iobroker/backups/eos/20260725T195907Z_Grid_Flow_V1_before_createState_test.json`

## 2026-07-25
- Added
  - `Grid_Flow_V1` 1.0.2 mit createState-basierter Wiederanlage fehlender Grid-State-Objekte im bestehenden 60-Sekunden-Zyklus neu implementiert
  - Lösch- und Wiederanlagetest für alle definierten Grid-States ergänzt
- Verified
  - produktive Sandbox unterstützt `createState`; deren Implementierung prüft den realen Objektbestand und erzeugt die benötigte Ordnerstruktur automatisch
  - Tests bestanden; `setObjectNotExists` und Summary-Logik sind nicht enthalten
- Notes
  - Neuimplementierung noch nicht live deployt

## 2026-07-25
- Rolled back
  - `Grid_Flow_V1` 1.0.2 nach fehlgeschlagenem Selbstheilungs-Livetest auf 1.0.1 zurückgesetzt
  - GitHub-Skript, Objekt, Test und Spezifikation auf den sicheren 1.0.1-Stand zurückgesetzt
- Root cause
  - `setObjectNotExists` ist in der produktiven javascript.0-Sandbox nicht definiert; 1.0.2 startete deshalb nicht
- Verified
  - Live-Skript 1.0.1 aktiv; gelöschter Test-State `Grid40.AgeSeconds` nach Skriptneustart wieder vorhanden
- Backup
  - `/opt/iobroker/backups/eos/20260725T194700Z_Grid_Flow_V1_before_selfheal_test.json`
- Notes
  - keine manuelle Objektlöschung erforderlich; Selbstheilung bleibt erneut zu implementieren

## 2026-07-25
- Added
  - `Grid_Flow_V1` 1.0.2 um Selbstheilung des vollständigen Root-, Channel- und State-Baums im bestehenden 60-Sekunden-Zyklus erweitert
  - automatisierten Lösch- und Wiederanlagetest für Grid 40, 41 und 43 ergänzt
- Verified
  - wiederangelegte States werden unmittelbar aus den aktuellen Quellen befüllt
  - Summary-Objekte werden auch bei der Selbstheilung nicht erzeugt
- Notes
  - noch kein Live-Deployment dieser Version

## 2026-07-25
- Deployed
  - `Grid_Flow_V1` 1.0.1 ohne Summary live eingespielt und aktiv validiert
- Removed
  - `0_userdata.0.EOS.Grid.Summary.Power`, `.Status`, `.LastUpdate` und leerer Summary-Kanal aus ioBroker entfernt
- Verified
  - Grid 40, 41 und 43 weiterhin `OK`; keine Summary-Definition oder Laufzeitstate mehr vorhanden
- Backup
  - `/opt/iobroker/backups/eos/20260725T193841Z_Grid_Flow_V1_before_summary_removal.json`

## 2026-07-25
- Fixed
  - fachlich ungueltige Momentansumme der drei physisch getrennten Grid-Zaehlpunkte aus `Grid_Flow_V1` entfernt
  - `EOS.Grid.Summary.*` aus Skript, Objekt, Test und Spezifikation entfernt
- Notes
  - Grid 40, 41 und 43 bleiben ausschließlich getrennte read-only Zaehlersichten

## 2026-07-25
- Activated
  - `Grid_Flow_V1` nach Backup kontrolliert aktiviert und dauerhaft aktiv belassen
- Verified
  - Grid 40, 41 und 43 liefern numerische Leistungen mit Status `OK` und korrekter Vorzeichenuebernahme
  - rechnerischer Momentansaldo ist aktiv; Grid 42 erzeugt keinen EOS-State
  - keine Grid-Flow-Fehler im kontrollierten Test festgestellt
- Backup
  - `/opt/iobroker/backups/eos/20260725T192951Z_Grid_Flow_V1_before_activation.json`
- Notes
  - `Energy_Flow_V1` blieb unveraendert und nutzt die neue Grid-Sicht noch nicht

## 2026-07-25
- Deployed
  - `Grid_Flow_V1` aus dem GitHub-Stand kontrolliert als deaktiviertes ioBroker-Skriptobjekt importiert
- Verified
  - Live-Objekt ist `enabled: false` und enthaelt ausschließlich Grid 40, 41 und 43
  - Grid 42 ist nicht enthalten; wegen deaktiviertem Skript wurden noch keine EOS-Grid-Laufzeitstates erzeugt
- Notes
  - kein vorheriges Live-Objekt vorhanden; daher war kein Objekt-Backup moeglich oder erforderlich
  - `Energy_Flow_V1` blieb unveraendert

## 2026-07-25
- Added
  - `Grid_Flow_V1` als read-only EOS-Verdichtung fuer Victron Grid 40, 41 und 43 implementiert
  - getrennte numerische Leistungen, Status, Aktualitaet und rechnerischen Momentansaldo unter `0_userdata.0.EOS.Grid.*` ergaenzt
  - automatisierten Test fuer Vorzeichen, DeviceInstances, Aktualitaet und Ausschluss von Grid 42 ergaenzt
- Notes
  - Grid 40 = alte Wohnung, Grid 41 = Halle, Grid 43 = Haus; Grid 42 ist kein Netz-Zaehlpunkt
  - Modul bleibt bis Live-Test und Freigabe deaktiviert; `Energy_Flow_V1` wurde noch nicht umgeschaltet

## 2026-07-25
- Fixed
  - PV-Status `STANDBY` aus `EnergyFlow.Communication.TimeoutCount` ausgeschlossen
- Verified
  - Live-Zähler von 4 auf korrekt 3 reduziert; offen sind Grid, Battery und House
  - erwartete Grid-Bilanz- und EOS-Battery-Eingangsstates fehlen live und bleiben `UNKNOWN`
  - Energy Flow 1.3.1 aktiv; Backup von 1.3.0 vorhanden

## 2026-07-25
- Deployed
  - `PV_Flow_V1` 1.0.1 und `Energy_Flow_V1` 1.3.0 nach Freigabe live aktiviert
  - PV-AC, PV-DC, Gesamtleistung und `STANDBY` bis Energy Flow erfolgreich validiert
- Changed
  - PV-Skriptobjekt und Manifest auf `enabled: true` synchronisiert
- Backup
  - vorherige PV- und Energy-Flow-Skriptobjekte unter `/opt/iobroker/backups/eos/20260725T210000Z_*_before_pv_integration.json` gesichert

## 2026-07-25
- Added
  - `Energy_Flow_V1` 1.3.0 read-only an `0_userdata.0.EOS.PV.Summary.*` angebunden
  - PV in Summary, Communication und TimeoutCount aufgenommen
  - bestehenden Integrationstest um PV-Leistung und `STANDBY` erweitert
- Notes
  - `EnergyFlow.PV.Power` ist ein Anzeigewert aus AC plus RS450-DC und keine Aussage ueber Netzeinspeisefaehigkeit
  - keine Live-Aenderung; ioBroker bleibt bis zur Freigabe auf Energy Flow 1.2.2

## 2026-07-25
- Fixed
  - Logwechsel zwischen den normalen PV-Zustaenden `OK` und `STANDBY` unterdrückt
- Tested
  - `PV_Flow_V1` 1.0.1 kontrolliert live mit vier AC- und zwei RS450-Quellen validiert
  - AC-, DC- und Gesamtleistung numerisch sowie erwarteter Nacht-`STANDBY` bestätigt
  - Modul nach dem Test wieder deaktiviert

## 2026-07-25
- Added
  - `PV_Flow_V1` als deaktiviertes read-only Modul fuer vier AC-Wechselrichter und zwei RS450-Strings implementiert
  - getrennte `ACPower`, `DCPower` und reine Anzeige `TotalPower` sowie sechs Einzelquellen ergänzt
  - Spezifikation, State-Modell und Regressionstest ergänzt
- Changed
  - `0 W` mit altem Timestamp als erwarteten Wechselrichterzustand `STANDBY` festgelegt
- Notes
  - RS450 lädt ausschließlich DC-seitig die Batterie; aus `TotalPower` folgt keine Netzeinspeisefähigkeit
  - kein Live-Deployment und noch keine Anbindung an `Energy_Flow_V1`

## 2026-07-25
- Fixed
  - abgeschnittenen Pool-Bereich nach Einbau der Wallboxen auf der Handyansicht korrigiert
  - Main-View fuer Handy auf 2.400 px und fuer MacBook ab 1.000 px auf 1.400 px festgelegt
- Deployed
  - korrigierte View und CSS live ausgerollt und im ioBroker-Dateispeicher verifiziert
- Backup
  - vorheriger Stand unter `vis-2.0/backups/main-20260725T204300Z.json` und `vis-user-20260725T204300Z.css` gesichert

## 2026-07-25
- Deployed
  - VIS2-Main-View und CSS mit der Wallbox-Uebersicht live ausgerollt
  - Handy-Darstellung einspaltig und MacBook-Darstellung dreispaltig im Live-Dateispeicher verifiziert
- Backup
  - vorherige Main-View unter `vis-2.0/backups/main-20260725T203000Z.json` gesichert
  - vorheriges CSS unter `vis-2.0/backups/vis-user-20260725T203000Z.css` gesichert

## 2026-07-25
- Added
  - bestehendes VIS2-Main-Dashboard um eine read-only Wallbox-Uebersicht erweitert
  - Summary sowie go-e V3, go-e V4 und go-e V4 Halle mit Leistung, Aktivitaet, Status und Alter eingebunden
- Changed
  - vorhandenes Kartenlayout und responsive Darstellung fuer den Wallbox-Block weiterverwendet
  - `vis-views.json` mit 15 eindeutigen EOS-Wallbox-Bindings neu erzeugt
- Notes
  - ausschliesslich `0_userdata.0.EOS.Wallbox.*`; keine Buttons, Rohquellen oder Steuerpfade
  - Live-Deployment bleibt bis zum Review offen

## 2026-07-25
- Changed
  - `Wallbox_Flow_V1` und `Energy_Flow_V1` nach ausdruecklicher Betriebsfreigabe dauerhaft aktiviert
  - Skriptobjekte und Manifest auf `enabled: true` synchronisiert
- Verified
  - beide Live-Skripte aktiv, Wallbox-Status jeweils `OK`, keine neuen Warnungen oder Fehler im Startlog
  - Ruecksicherungsstaende beider Skriptobjekte im ioBroker-Container vorhanden

## 2026-07-25
- Fixed
  - initialen Energy-Flow-Refresh um 1 Sekunde verzögert, damit neue ioBroker-States vor dem ersten Schreibzugriff existieren
  - fehlende Grid- und Battery-Quellen vor `getState()` mit `existsState()` abgesichert, um Warn-Stacktraces zu vermeiden
- Tested
  - Wallbox-Anbindung mit `Energy_Flow_V1` 1.2.2 kontrolliert im ioBroker validiert
  - Wallbox-Summary und Energy-Flow-Wallbox stimmen bei 0 W, `Active=false` und Status `OK` überein
  - beide Module nach dem Test wieder deaktiviert; Backup des vorherigen Energy-Flow-Objekts im ioBroker-Container abgelegt

## 2026-07-25
- Added
  - `Energy_Flow_V1` read-only an `0_userdata.0.EOS.Wallbox.Summary.*` angebunden
  - Regressionstest fuer Leistung, Aktivitaet, Status, Summary und Communication ergänzt
- Changed
  - Wallbox-Status `DEGRADED` und `STALE` wird als `WARNING`, `OFFLINE` als `ERROR` eingeordnet
  - fehlerhaften bestehenden Testerwartungswert von 3.500 W auf die korrekte Summe 3.600 W korrigiert
- Notes
  - kein Live-Deployment; Energy-Flow-Skriptobjekt bleibt standardmaessig deaktiviert

## 2026-07-25
- Tested
  - `Wallbox_Flow_V1` kontrolliert im produktiven ioBroker mit drei erreichbaren 0-kW-Quellen getestet
  - alle 19 EOS-Zielobjekte read-only erzeugt; Leistung numerisch, Status als String, keine Modulfehler im Log
  - Live-Quellcode per SHA-256 gegen GitHub verifiziert und Skript nach dem Test wieder deaktiviert

## 2026-07-25
- Added
  - `Wallbox_Flow_V1.js` als read-only Verdichtung der drei belegten Wallbox-Leistungsquellen implementiert
  - ioBroker-Skriptobjekt und eigenstaendigen Test fuer Leistung, Aktivitaet, Status, Teilausfall und Offline-Verhalten ergänzt
- Changed
  - `iobroker/manifest.json` um das standardmaessig deaktivierte Modul erweitert
  - Spezifikation, State-Modell, Roadmap und Projektkontext auf `Implementiert – Review und Deployment offen` aktualisiert

## 2026-07-25
- Changed
  - zentralen Alterstimer fuer `Wallbox_Flow_V1` auf ein ressourcenschonendes Intervall von 60 Sekunden festgelegt
  - Statusprioritaet bei gleichzeitig unterschiedlichen Quellfehlern eindeutig definiert

## 2026-07-25
- Added
  - Requirement, Architekturentscheidung, Spezifikation und State-Modell fuer `Wallbox_Flow_V1` ergänzt
  - positive Wallboxleistung als Energiefluss ins Auto, Aktivschwelle 100 W sowie 30/120-Sekunden-Aktualitaetsgrenzen festgelegt
  - Leistungswerte ausschliesslich numerisch und Statuswerte als Strings definiert
- Changed
  - Roadmap und Projektkontext um den spezifizierten, noch nicht implementierten Wallbox-Baustein ergänzt

## 2026-07-25
- Changed
  - EOS-Dokumentationsbaseline auf den aktuellen GitHub-Stand konsolidiert
  - tote und veraltete Dokumentverweise korrigiert
  - Gate 1 als abgeschlossen und weitere Codegenerierung als modulbezogen freigabepflichtig gekennzeichnet

## 2026-07-25
- Added
  - repositorybasierte Quellenanalyse für PV, House und Wallbox ergänzt
  - keine produktive Logik geändert
  - keine Quelle ohne belastbaren Nachweis freigegeben

## 2026-07-10
- Changed
  - `iobroker/scripts/energiemanagement/Energy_Flow_V1.js` auf eine ereignisgetriebene, read-only V1-Baseline umgestellt; `setInterval(...)` und die nicht freigegebenen Zusatzstates wurden entfernt
  - `docs/energy_flow_v1_spec.md`, `docs/energy_flow_v1_state_model.md` und `knowledge/project_brain.md` an die aktuelle Energy-Flow-V1-Architektur mit Millisekunden-`LastUpdate` angepasst
  - `Energy_Flow_V1` nutzt weiterhin die EOS-Batteriesicht und die EOS-Bilanzsicht als belegte Eingangsquellen; `PV`, `House` und `Wallbox` bleiben mangels freigegebener EOS-Quellen `UNKNOWN`

## 2026-07-09
- Added
  - `exports/live_inventory/eos_variables_compact.json` als verdichtete EOS-Variablenansicht aus dem Live-Inventar ergaenzt

## 2026-07-09
- Added
  - `exports/live_iobroker_inventory/` als echter Live-Export aus dem laufenden ioBroker-Container ergaenzt

## 2026-07-09
- Added
  - `exports/system_inventory/victron_relations.json` als belegbare Zuordnung der im Repository sichtbaren Victron-/Venus-/MQTT-Komponenten und IDs ergaenzt

## 2026-07-08
- Added
  - `iobroker/scripts/energiemanagement/Battery_Morning_View_V1.js` wieder entfernt
  - das zugehoerige Scriptobjekt `script.js.energiemanagement.Battery_Morning_View_V1` aus dem laufenden Stand herausgenommen
- Changed
  - `iobroker/vis-2/main/battery.html`, `iobroker/vis-2/main/vis-views.json` und `iobroker/vis-2/main/vis-user.css` um die visuelle Morgenblick-Kachel erweitert

## 2026-07-08
- Added
  - `iobroker/objects/energiemanagement.Battery_Supervisor_V1.json` als echtes ioBroker-Scriptobjekt fuer `script.js.energiemanagement.Battery_Supervisor_V1` ergaenzt
- Changed
  - `iobroker/objects/energiemanagement.Battery_Health_V1.json` und `iobroker/objects/energiemanagement.Energy_Flow_V1.json` auf vollstaendige Scriptobjekte mit `common.source` aktualisiert
  - `iobroker/manifest.json` um `script.js.energiemanagement.Battery_Supervisor_V1` erweitert
  - `iobroker/vis-2/main/battery.html` und `iobroker/vis-2/main/vis-views.json` um sichtbare EnergyFlow-Kacheln in der Batterie-Ansicht erweitert

## 2026-07-08
- Changed
  - `iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js`, `iobroker/scripts/energiemanagement/Battery_Health_V1.js` und `iobroker/scripts/energiemanagement/Energy_Flow_V1.js` um defensive Root-Anlage fuer die EOS-States ergaenzt
  - `iobroker/tools/deploy_vis2.py` auf env-basierte VIS2-Parameter ohne fest verdrahtete Host-, Container- oder Key-Defaults umgestellt
  - `tools/iobroker/install_eos_to_iobroker.sh` auf die notwendigen VIS2-Umgebungsvariablen fuer den echten Apply-Lauf abgesichert

## 2026-07-08
- Added
  - `tools/iobroker/install_eos_to_iobroker.sh` als Installationspaket fuer Repository-Inhalte und VIS2-Deployment ergaenzt

## 2026-07-08
- Added
  - `docs/iobroker_deployment_v1.md` als praktische Import- und Deployment-Anleitung fuer den ioBroker ergaenzt
  - `tools/iobroker/deploy_repository_to_iobroker.sh` als defensives ioBroker-Deployment-Script mit Dry-Run und `--apply` ergaenzt
  - `tools/iobroker/list_repository_assets.sh` als read-only Inventarscript fuer Repository-Artefakte ergaenzt
  - `tools/iobroker/verify_iobroker_import.sh` als read-only Pruefscript fuer den ioBroker-Import ergaenzt
- Changed
  - `knowledge/project_brain.md` um den notwendigen Import-/Deployment-Schritt fuer die Sichtbarkeit im ioBroker ergaenzt

## 2026-07-08
- Added
  - `tools/iobroker/run_iobroker_deployment.sh` als reproduzierbaren Wrapper fuer Inventar, Dry-Run, Apply und Verifikation ergaenzt
- Changed
  - `docs/iobroker_deployment_v1.md` um den Codex-gesteuerten Wrapper-Lauf als fuehrenden Einstieg ergaenzt
  - `knowledge/project_brain.md` um den reproduzierbaren Codex-Wrapper fuer ioBroker-Deployment ergaenzt

## 2026-07-08
- Changed
  - `knowledge/project_brain.md` auf den freigegebenen Commit `273b4f13e51b88237c58d7247326eb34cc0b2c89` und den freigegebenen Phase-2-Stand von Energy Flow V1 aktualisiert
  - `knowledge/project_brain.md` um die aktuelle Domänenlage von Grid, PV, House und Wallbox im Energy-Flow-Kontext ergaenzt

## 2026-07-08
- Changed
  - `iobroker/scripts/energiemanagement/Energy_Flow_V1.js` fuer nicht belegte Phase-2-Domänen auf `null`/`UNKNOWN` statt Null-Defaults angepasst
  - `knowledge/project_brain.md` auf den nicht freigegebenen Phase-2-Review-Status von Energy Flow V1 korrigiert

## 2026-07-08
- Changed
  - `iobroker/scripts/energiemanagement/Energy_Flow_V1.js` um die Phase-2-Anbindung der EOS-internen Grid-Bilanzsicht erweitert; Grid wird nun aus der verdichteten Bilanzsicht gelesen, die Energy-Flow-Sicht bleibt read-only
  - `knowledge/project_brain.md` um den dauerhaft erweiterten Phase-2-Stand von Energy Flow V1 aktualisiert

## 2026-07-08
- Changed
  - `iobroker/scripts/energiemanagement/Energy_Flow_V1.js` auf die Phase-1-Baseline ohne aktive `Summary.Direction`-Semantik reduziert

## 2026-07-08
- Added
  - `docs/energy_flow_v1_implementation_review.md` als Review der Energy-Flow-Baseline mit Entscheidung `Korrektur erforderlich` ergaenzt

## 2026-07-08
- Changed
  - `knowledge/project_brain.md` um die Kennzeichnung von `Energy_Flow_V1` als in Implementierungsplanung befindlich ergaenzt

## 2026-07-08
- Changed
  - `knowledge/project_brain.md` um den dauerhaften Entwicklungs- und Reviewprozess samt Vorrang des tatsaechlichen Repositoryinhalts ergaenzt

## 2026-07-08
- Changed
  - `knowledge/project_brain.md` auf `f809eac` als letzten freigegebenen Commit und auf die implementierte Energy-Flow-Baseline aktualisiert

## 2026-07-08
- Added
  - `iobroker/scripts/energiemanagement/Energy_Flow_V1.js` als ersten produktiven, read-only EOS-Baustein fuer konsolidierte Energiefluesse ergaenzt
  - `iobroker/objects/energiemanagement.Energy_Flow_V1.json` und `iobroker/manifest.json` um `script.js.energiemanagement.Energy_Flow_V1` ergaenzt
- Changed
  - `knowledge/project_brain.md` um die Implementierung von `Energy_Flow_V1` als erste produktive EOS-Ebene ergaenzt

## 2026-07-08
- Added
  - `docs/energy_flow_architecture_review_v1.md` als Architekturreview der Energy-Flow-Spezifikation mit Freigabeempfehlung ergaenzt

## 2026-07-08
- Changed
  - `knowledge/project_brain.md` vollstaendig von alten Battery-VIS2-, Battery-Health- und Commit-Referenzen bereinigt und auf `e291134` als letzten freigegebenen Commit konsolidiert

## 2026-07-08
- Changed
  - `knowledge/project_brain.md` um die Beschreibung von `7cb51af` als Korrektur des Projektkontexts nach dem Start von Energy Flow V1 praezisiert

## 2026-07-08
- Changed
  - `knowledge/project_brain.md` um die freigegebenen Energy-Flow-Spezifikationsstaende `e2f538f` und `7cb51af` sowie den letzten freigegebenen Commit `7cb51af` praezisiert

## 2026-07-08
- Changed
  - `knowledge/project_brain.md` um `e2f538f` und `7cb51af` als freigegebene Energy-Flow-Spezifikationsstaende sowie den letzten freigegebenen Commit `7cb51af` aktualisiert

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

