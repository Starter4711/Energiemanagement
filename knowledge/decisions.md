# Entscheidungen

## Grundsatzentscheidungen laut Analyse

- GitHub ist Referenz, Historie und Backup.
- ioBroker ist das Live-System.
- Neue Energiemanagement-Logik soll modular unter `script.js.energiemanagement.*` entstehen.
- Bestehende Common-Skripte sollen grundsaetzlich nicht inhaltlich veraendert werden.
- Backups vor Live-Aenderungen sind Teil des vorgesehenen Workflows.
- Ressourcenschonung ist eine verbindliche Architekturregel.

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

## Unklar

- Eine vollstaendige ADR-Struktur oder nummerierte Entscheidungsserie ist im Repository nicht vorhanden.
