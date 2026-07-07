# Coding-Regeln

## Harte Projektregeln

- Bestehende Skripte unter `iobroker/scripts/common/` nicht inhaltlich aendern, sofern nicht explizit verlangt.
- Neue Energiemanagement-Logik nur unter `iobroker/scripts/energiemanagement/` anlegen.
- GitHub ist Referenz und Backup.
- ioBroker ist das Live-System.
- Vor Live-Aenderungen Backups anlegen.
- Keine Informationen raten. Bei fehlenden Informationen `Unklar` schreiben.

## Ressourcenschonung

Aus der Projektanalyse abgeleitete verbindliche Regeln:

- Ressourcenschonung hat Vorrang.
- Reaktionszeit passend zur Funktion waehlen.
- Daten nicht unnoetig duplizieren.
- Nur abgeleitete Werte, Status und Alarme speichern, wenn sinnvoll.
- Datenpunkte nur bei Wertaenderung schreiben.
- Dauerfehler nicht in Logflut ausarten lassen.
- Bestehende Messwerte zentral aufbereiten, wenn mehrere Module sie brauchen.

## Architekturregeln

- Altbestand und neue Logik sauber trennen.
- Das neue Energiemanagement soll modular aufgebaut sein.
- Alias-Objekte bevorzugen.
- MQTT-Rohobjekte nur dort direkt lesen, wo es fachlich notwendig ist.

## Deployment-Regeln

- Deployment neuer Skripte ueber `iobroker/tools/sync_iobroker.py`
- VIS-2-Deployment ueber `iobroker/tools/deploy_vis2.py`
- Vor Deployments Ruecksicherungen anlegen

## Unklar

- Weitere nicht dokumentierte Team- oder Stilregeln ausserhalb der vorhandenen Analyse sind `Unklar`.
