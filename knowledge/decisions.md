# Entscheidungen

## Grundsatzentscheidungen laut Analyse

- GitHub ist Referenz, Historie und Backup.
- ioBroker ist das Live-System.
- Neue Energiemanagement-Logik soll modular unter `script.js.energiemanagement.*` entstehen.
- Bestehende Common-Skripte sollen grundsaetzlich nicht inhaltlich veraendert werden.
- Backups vor Live-Aenderungen sind Teil des vorgesehenen Workflows.
- Ressourcenschonung ist eine verbindliche Architekturregel.
- Der Engineering-Prozess mit Review-Gate ist verbindlich eingefuehrt.
- Backup und Rollback sind vor Live-Aenderungen verpflichtend.
- `CHANGELOG.md` ist als laufende Aenderungshistorie eingefuehrt.
- Zuschaltbare Logebene ist Standardanforderung fuer neue produktive Skripte.

## Betriebsentscheidungen

- Deployment erfolgt per SSH und `docker exec` auf die Synology/den ioBroker-Container.
- VIS-2 wird versioniert im Repository gepflegt und gesondert deployt.

## Fachliche Entscheidungen

- SmartShunt ist fuehrend fuer Gesamt-SOC und DC-Spannung.
- Der Gobel-SOC ist nicht fuehrend fuer Gesamtregelung.
- Neues Energiemanagement soll Altlogik schrittweise ersetzen, nicht ungeordnet ueberschreiben.

## 2026-07-07 - Komponentenuebersicht als zentrale Systemdokumentation

- Status: beschlossen
- Bereich: Dokumentation
- Kontext: Die technische Projektanalyse beschreibt viele Systemteile, aber keine eigenstaendige zentrale Komponentenuebersicht je Systembereich.
- Entscheidung: `docs/system_components.md` wird als zentrale Komponentenuebersicht fuer die dokumentierten bzw. geplanten Systembereiche eingefuehrt.
- Begruendung: Die Komponentenlandschaft soll fuer neue Codex-Tasks und kuenftige Pflegefaelle schneller erfassbar sein, ohne bestehende technische Entscheidungen zu aendern.
- Betroffene Dateien/Pfade: `docs/system_components.md`, `docs/project_analysis.md`
- Auswirkungen: Zukuenftige Dokumentationsarbeit zu Systembereichen soll diese Komponentenuebersicht mitberuecksichtigen und bei relevanten Aenderungen aktualisieren.
- Offene Punkte: Unklar, ob kuenftig weitere systemspezifische Teiluebersichten unter `docs/` oder `knowledge/` ergaenzt werden sollen.

## 2026-07-07 - Drei-Zaehlpunkt-System als fachliche Grundlage

- Status: beschlossen
- Bereich: Architektur
- Kontext: Die Gesamtanlage besteht aus Wohnung / altem Haus, Haus / neuem Haus und Halle als getrennten Netzanschluessen beziehungsweise Zaehlpunkten.
- Entscheidung: Das Energiemanagement wird auf einem Drei-Zaehlpunkt-System mit bilanzieller Gesamtsicht aufgebaut.
- Begruendung: Einspeisung und Bezug werden rechnerisch ueber die Zaehlpunkte gegengerechnet und im Energiegemeinschaftsmodell gemeinsam betrachtet.
- Betroffene Dateien/Pfade: `knowledge/hardware_topology.md`, `knowledge/energy_strategy.md`
- Auswirkungen: Strategien, Bilanzen und Ueberschusslogik muessen die gekoppelten Zaehlpunkte gemeinsam bewerten.
- Offene Punkte: Unklar, ob weitere formale Abrechnungsregeln ausserhalb der OeMAG-Verrechnung dokumentiert werden sollen.

## 2026-07-07 - Zwei Victron-Systeme mit gemeinsamer DC-Batterie

- Status: beschlossen
- Bereich: Architektur
- Kontext: Haus und Halle verwenden getrennte Cerbo-/MultiPlus-Systeme, teilen sich jedoch eine gemeinsame DC-Batterieanlage.
- Entscheidung: Cerbo ESS und Cerbo BAT werden als zwei Victron-Systeme mit gemeinsamer DC-Batteriearchitektur dokumentiert und betrachtet.
- Begruendung: Diese Kopplung praegt Schutzlogik, Bilanzierung, Ladeverhalten und Gesamtstrategie.
- Betroffene Dateien/Pfade: `knowledge/battery_architecture.md`, `knowledge/victron_venus_structure.md`, `knowledge/hardware_topology.md`
- Auswirkungen: Aenderungen an einem Victron-Teilbereich muessen die gemeinsame Batteriearchitektur mitberuecksichtigen.
- Offene Punkte: Unklar, ob kuenftig weitere entkoppelnde oder priorisierende Zwischenlogiken dokumentiert werden.

## 2026-07-07 - Knowledge Base README als zentrale Navigation

- Status: beschlossen
- Bereich: Dokumentation
- Kontext: Die Knowledge Base enthielt mehrere thematisch ueberlappende Detaildateien ohne zentrale Startseite.
- Entscheidung: `knowledge/README.md` wird als zentrale Navigationsseite der Knowledge Base eingefuehrt.
- Begruendung: Neue Codex-Sitzungen sollen schneller zu den fuehrenden Dokumenten und den ergaenzenden Detailseiten finden.
- Betroffene Dateien/Pfade: `knowledge/README.md`, `AGENTS.md`, `docs/project_analysis.md`
- Auswirkungen: Kuenftige Wissensarbeit soll zuerst ueber die README in die Knowledge Base einsteigen und dann die fuehrenden Fachdateien heranziehen.
- Offene Punkte: Unklar, ob weitere thematische Einstiegsseiten unter `docs/` oder `knowledge/` spaeter sinnvoll sind.

## 2026-07-07 - SmartShunt als fuehrende Gesamtquelle

- Status: beschlossen
- Bereich: Datenquelle
- Kontext: Mehrere Quellen liefern Batterie- und SOC-bezogene Informationen.
- Entscheidung: SmartShunt ist fuehrende Quelle fuer Gesamt-SOC, DC-Spannung und Batteriestrom.
- Begruendung: Die Gesamtbatteriesicht soll nicht auf dem nicht fuehrenden Gobel-SOC basieren.
- Betroffene Dateien/Pfade: `knowledge/battery_architecture.md`, `knowledge/victron_venus_structure.md`, `knowledge/design_principles.md`
- Auswirkungen: Neue Regelungslogik darf fuer die Gesamtsteuerung keine andere Hauptquelle an Stelle des SmartShunt setzen.
- Offene Punkte: Unklar, welche Plausibilisierungs- oder Sekundaerquellen zusaetzlich dauerhaft dokumentiert werden sollen.

## 2026-07-07 - Gobel-Pace als fuehrende Batterieschutzinstanz

- Status: beschlossen
- Bereich: Sicherheit
- Kontext: Die Batterie benoetigt eine klare Trennung zwischen Gesamtmessung, Diagnose und Schutz.
- Entscheidung: Gobel / Pace BMS ist fuehrende Schutzinstanz der Batterie.
- Begruendung: Schutzfunktionen muessen auf der dafuer vorgesehenen BMS-Ebene verankert bleiben.
- Betroffene Dateien/Pfade: `knowledge/battery_architecture.md`, `knowledge/design_principles.md`
- Auswirkungen: Optimierungs- und Diagnoseebenen duerfen Batterieschutzlogik nicht ersetzen.
- Offene Punkte: Notabschaltungsszenarien sind noch zu definieren.

## 2026-07-07 - Node-RED als MQTT- und D-Bus-Bruecke

- Status: beschlossen
- Bereich: Architektur
- Kontext: Node-RED laeuft auf den Cerbos im Venus OS Large Image und verarbeitet von ioBroker kommende Werte weiter.
- Entscheidung: Node-RED wird als Kommunikationsbruecke dokumentiert, nicht als fuehrende Entscheidungsinstanz.
- Begruendung: Die Fuehrungslogik bleibt bei Cerbo fuer Echtzeit und bei ioBroker fuer Strategie.
- Betroffene Dateien/Pfade: `knowledge/control_hierarchy.md`, `knowledge/victron_venus_structure.md`, `knowledge/design_principles.md`
- Auswirkungen: Zukuenftige Architekturarbeit darf Node-RED nicht stillschweigend zur Hauptregelinstanz aufwerten.
- Offene Punkte: Unklar, welche konkreten Flows produktiv im Detail aktiv sind.

## 2026-07-07 - Batterie als primaeres Schutz- und Optimierungsziel

- Status: beschlossen
- Bereich: Architektur
- Kontext: Das System versorgt verschiedene Verbraucher und Erzeuger, die Batterie ist jedoch die kritischste gemeinsame Ressource.
- Entscheidung: Die Batterie ist primaeres Schutz- und Optimierungsziel der Gesamtstrategie.
- Begruendung: Versorgungssicherheit, Schonung und Ersatzstromfaehigkeit haben Vorrang vor aggressiver Verbrauchs- oder Einspeiseoptimierung.
- Betroffene Dateien/Pfade: `knowledge/energy_strategy.md`, `knowledge/design_principles.md`, `knowledge/battery_architecture.md`
- Auswirkungen: Wallbox-, Pool- und Ueberschusslogiken muessen sich an Batteriezustand und Schutzprinzipien orientieren.
- Offene Punkte: Unklar, welche feingranularen Prioritaetsregeln kuenftig je Verbrauchergruppe gelten sollen.

## 2026-07-07 - MPPT RS 450 als strategische DC-PV- und Schwarzstartquelle

- Status: beschlossen
- Bereich: Hardware
- Kontext: Der MPPT RS 450 ist direkt am Lynx und damit am gemeinsamen DC-System angebunden.
- Entscheidung: Der MPPT RS 450 wird als strategische DC-PV- und Schwarzstartquelle behandelt.
- Begruendung: Er ist wichtig fuer schonende DC-seitige Ladung und fuer Schwarzstartfaehigkeit bei leerer Batterie und PV-Produktion.
- Betroffene Dateien/Pfade: `knowledge/victron_venus_structure.md`, `knowledge/energy_strategy.md`
- Auswirkungen: Aenderungen duerfen seine Rolle fuer Schwarzstart und DC-seitige Batterieladung nicht verschlechtern.
- Offene Punkte: Unklar, wie kuenftige Prognosemodelle den MPPT-Tagesertrag konkret beruecksichtigen werden.

## 2026-07-07 - Keine gezielte Batterieentladung ins Netz

- Status: beschlossen
- Bereich: Datenquelle
- Kontext: Die Batterie dient primär Versorgungssicherheit, Schonung und lokaler Optimierung.
- Entscheidung: Es darf keine gezielte Batterieentladung ins Netz geben.
- Begruendung: Die Batterie ist nicht als primaeres Einspeiseasset gedacht, sondern als Schutz- und Versorgungsressource.
- Betroffene Dateien/Pfade: `knowledge/energy_strategy.md`, `knowledge/design_principles.md`
- Auswirkungen: Strategien und Sollwerte duerfen keine aktive Netzentladung der Batterie als Optimierungsziel vorsehen.
- Offene Punkte: Unklar, welche dokumentierten Ausnahmen fuer Sonder- oder Testfaelle gegebenenfalls spaeter definiert werden.

## Entscheidungstagebuch-Format

Zukuenftige gesicherte Entscheidungen sollen in diesem Format dokumentiert werden:

```text
## YYYY-MM-DD - Kurztitel

- Status: beschlossen | ersetzt | verworfen
- Bereich: Architektur | Datenquelle | Deployment | VIS-2 | MQTT | ioBroker | Hardware | Sicherheit | Dokumentation
- Kontext:
- Entscheidung:
- Begruendung:
- Betroffene Dateien/Pfade:
- Auswirkungen:
- Offene Punkte:
```

## Regeln fuer neue Eintraege

- Nur gesicherte Entscheidungen eintragen.
- Keine Vermutungen dokumentieren.
- Wenn ein Punkt noch nicht abschliessend entschieden ist, gehoert er nach `knowledge/open_questions.md`.
- Bestehende Entscheidungen nicht stillschweigend ueberschreiben. Stattdessen einen neuen Eintrag mit Status `ersetzt` oder `verworfen` anlegen.
- Wenn eine Entscheidung MQTT-Topics, ioBroker-States, Alias-Pfade, Device-IDs oder Aktor-Schreibpfade betrifft, muss die Auswirkung klar beschrieben werden.
- Wenn eine Entscheidung Code- oder Betriebsverhalten aendert, ist die passende Fachdokumentation mitzuaktualisieren.

## Beispiel fuer kuenftige Eintraege

```text
## 2026-07-07 - SmartShunt als fuehrende SOC-Quelle

- Status: beschlossen
- Bereich: Datenquelle
- Kontext: Mehrere Quellen liefern SOC-Werte fuer die Batterie.
- Entscheidung: Gesamt-SOC und DC-Spannung werden fuehrend vom SmartShunt gelesen.
- Begruendung: Laut Projektdokumentation ist der Gobel-SOC nicht verlaesslich genug.
- Betroffene Dateien/Pfade: knowledge/victron.md, knowledge/coding_rules.md
- Auswirkungen: Neue Regelungslogik darf den Gobel-SOC nicht als Hauptquelle verwenden.
- Offene Punkte: Unklar, ob weitere Sekundaerquellen fuer Plausibilisierung dokumentiert werden sollen.
```

## 2026-07-07 - Trennung von docs/ und knowledge/

- Status: beschlossen
- Bereich: Dokumentation
- Kontext: Die bestehenden Dokumente mischen Analyse, Detailwissen und dauerhafte Engineering-Festlegungen teilweise in einer Ebene.
- Entscheidung: `docs/` und `knowledge/` erhalten getrennte Rollen.
- Begruendung: Analyse, Fachdetails und historische Projektdokumentation sollen von verdichtetem, dauerhaftem Engineering-Wissen getrennt bleiben.
- Betroffene Dateien/Pfade: `knowledge/documentation_governance.md`, `knowledge/README.md`, `docs/project_analysis.md`
- Auswirkungen: Zukuenftige Dokumentation soll Inhalte nur dort pflegen, wo die jeweilige Rolle fuehrend ist.
- Offene Punkte: Unklar, ob einzelne bestehende Dokumente spaeter noch inhaltlich umsortiert werden sollen.

## 2026-07-07 - PROJECT_MEMORY.md ist historisch

- Status: beschlossen
- Bereich: Dokumentation
- Kontext: `PROJECT_MEMORY.md` enthaelt zwar Projektgedaechtnis, ist aber keine aktuelle Engineering-Leitquelle.
- Entscheidung: `PROJECT_MEMORY.md` wird als historisches Projektgedaechtnis behandelt.
- Begruendung: Fuehrende Architektur- und Engineering-Wahrheit soll in `AGENTS.md`, `knowledge/README.md` und `knowledge/` liegen.
- Betroffene Dateien/Pfade: `PROJECT_MEMORY.md`, `knowledge/documentation_governance.md`
- Auswirkungen: Neue Entscheidungen und aktuelle Festlegungen sollen nicht mehr primaer in `PROJECT_MEMORY.md` gepflegt werden.
- Offene Punkte: Unklar, ob aeltere Eintraege spaeter in Fuehrungsdokumente uebertragen werden sollen.

## 2026-07-07 - iobroker/manifest.json als Exportreferenz

- Status: beschlossen
- Bereich: ioBroker
- Kontext: Der Repository-Stand enthaelt einen exportierten ioBroker-Skriptbestand mit Objekt- und Skriptdateien.
- Entscheidung: `iobroker/manifest.json` ist technische Referenz fuer den exportierten Skriptbestand.
- Begruendung: Aktivierungsstatus, Engine-Typ und die Zuordnung von Objektdatei zu Skriptdatei sollen zentral nachvollziehbar bleiben.
- Betroffene Dateien/Pfade: `iobroker/manifest.json`, `knowledge/iobroker_manifest_reference.md`, `AGENTS.md`
- Auswirkungen: Skript-, Aktivierungs- und Bestandsfragen sollen gegen das Manifest geprueft werden.
- Offene Punkte: Unklar, ob kuenftig weitere Exportformate als Referenz dokumentiert werden sollen.

## 2026-07-07 - system_architecture.md als Architekturuebersicht

- Status: beschlossen
- Bereich: Dokumentation
- Kontext: Die Architektur war ueber mehrere Dateien verteilt, aber nicht in einer kompakten Uebersichtsseite gebuendelt.
- Entscheidung: `knowledge/system_architecture.md` wird als zentrale Architekturuebersicht eingefuehrt.
- Begruendung: Neue Sitzungen sollen das Gesamtsystem schnell erfassen koennen, ohne die Detaildokumente zu ersetzen.
- Betroffene Dateien/Pfade: `knowledge/system_architecture.md`, `knowledge/README.md`, `docs/project_analysis.md`
- Auswirkungen: Die Seite dient als Einstieg fuer Diagramm, Hauptfluesse und Regelungshierarchie.
- Offene Punkte: Unklar, ob spaeter weitere subsystembezogene Uebersichten noetig werden.

## 2026-07-07 - Engineering-Prozess mit Review-Gate eingefuehrt

- Status: beschlossen
- Bereich: Dokumentation
- Kontext: Fuehrende Arbeitsablaeufe waren in mehreren Regeln verteilt, aber nicht als einzelner Prozess festgehalten.
- Entscheidung: Der Engineering-Prozess mit Architektur-Review-Gate wird als verbindlicher Standard dokumentiert.
- Begruendung: Aenderungen sollen erst nach geprueftem Ist-Zustand, Backup-Pruefung und Architektur-Review fachlich freigegeben werden.
- Betroffene Dateien/Pfade: `knowledge/engineering_process.md`, `AGENTS.md`, `knowledge/README.md`
- Auswirkungen: Relevante Aenderungen muessen diesen Ablauf aktiv beachten.
- Offene Punkte: Unklar, ob spaeter noch ein formalisiertes Review-Template benoetigt wird.

## 2026-07-07 - Backup und Rollback als Pflicht vor Live-Aenderungen bestaetigt

- Status: beschlossen
- Bereich: Deployment
- Kontext: Vor Live-Aenderungen bestand bereits eine Backup-Erwartung, aber noch keine explizite Baseline-Datei.
- Entscheidung: Backup und Rollback werden vor Live-Aenderungen als Pflicht festgehalten.
- Begruendung: Ein rueckholbarer Zustand ist fuer produktive Smart-Home- und Energiemanagement-Aenderungen erforderlich.
- Betroffene Dateien/Pfade: `knowledge/backup_and_rollback.md`, `AGENTS.md`, `knowledge/README.md`
- Auswirkungen: Live-nahe Aenderungen duerfen nur mit beschriebenem Rueckweg geplant werden.
- Offene Punkte: Unklar, wie die Aufbewahrung und der Rollback-Testprozess genau standardisiert werden.

## 2026-07-07 - CHANGELOG.md als laufende Aenderungshistorie eingefuehrt

- Status: beschlossen
- Bereich: Dokumentation
- Kontext: Relevante Aenderungen sollten nachvollziehbar und mit Datum dokumentiert werden.
- Entscheidung: `CHANGELOG.md` wird als laufende Aenderungshistorie gefuehrt.
- Begruendung: Dokumentations-, Deployment- und Engineering-Arbeit sollen chronologisch nachvollziehbar bleiben.
- Betroffene Dateien/Pfade: `CHANGELOG.md`, `knowledge/changelog_policy.md`
- Auswirkungen: Relevante Aenderungen muessen das Changelog mitpflegen.
- Offene Punkte: Unklar, ob zusaetzlich eine strengere Release- oder Versionslogik benoetigt wird.

## 2026-07-07 - Zuschaltbare Logebene fuer neue produktive Skripte

- Status: beschlossen
- Bereich: Architektur
- Kontext: Produktive Skripte sollen ressourcenschonend arbeiten und Logging nicht ueberfrachten.
- Entscheidung: Neue produktive Skripte muessen eine zuschaltbare Logebene unterstuetzen.

- Begruendung: Minimales Standard-Logging, kontrollierbares Debugging und begrenztes Logwachstum sind fuer den Betrieb wichtig.
- Betroffene Dateien/Pfade: `knowledge/script_logging_policy.md`, `knowledge/coding_rules.md`
- Auswirkungen: Neue Skripte muessen Logging bewusst und konfigurierbar auslegen.
- Offene Punkte: Unklar, wie eine gemeinsame Logging-Hilfsfunktion fuer neue ioBroker-JavaScript-Skripte genau aussehen soll.

## 2026-07-07 - Sprechende Requirement-IDs als Projektstandard

- Status: beschlossen
- Bereich: Dokumentation
- Kontext: Fachliche Anforderungen wurden bislang nicht als zentrale, strukturierte Requirements-Datei mit sprechenden IDs gefuehrt.
- Entscheidung: Sprechende Requirement-IDs werden als Projektstandard eingefuehrt und in `knowledge/requirements.md` zentral gepflegt.
- Begruendung: Anforderungen sollen fuer Menschen ohne Nachschlagetabelle direkt lesbar, referenzierbar und in Features oder Aenderungen eindeutig verknuepfbar sein.
- Betroffene Dateien/Pfade: `knowledge/requirements.md`, `knowledge/README.md`, `CHANGELOG.md`
- Auswirkungen: Zukuenftige Anforderungen, Features und relevante Aenderungen sollen auf die passenden Requirement-IDs verweisen.
- Offene Punkte: Unklar, ob weitere Namenskonventionen fuer Unteranforderungen oder Abhaengigkeiten spaeter noetig werden.

## Unklar

- Eine vollstaendige ADR-Struktur oder nummerierte Entscheidungsserie ist im Repository nicht vorhanden.
