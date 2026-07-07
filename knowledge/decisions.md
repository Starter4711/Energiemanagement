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

## Unklar

- Eine vollstaendige ADR-Struktur oder nummerierte Entscheidungsserie ist im Repository nicht vorhanden.
