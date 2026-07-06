# Ressourcenschonung

Ressourcenschonung ist eine verbindliche Architekturregel fuer alle neuen Energiemanagement-Skripte.

## Regeln

- Reaktionszeit passend zur Funktion waehlen: Schutz schnell, Regelung moderat, Diagnose langsam.
- Keine Daten kopieren, die bereits verlaesslich in ioBroker vorhanden sind.
- Nur abgeleitete Werte, Status und Alarme in `0_userdata.0.Energiemanagement` speichern.
- Datenpunkte nur schreiben, wenn sich der Wert geaendert hat.
- Dauerfehler einmal melden und erst nach Zustandswechsel erneut loggen.
- Bestehende Messwerte zentral aufbereiten, wenn mehrere Module sie benoetigen.
- Keine externen Bibliotheken laden, wenn native ioBroker-Funktionen ausreichen.
- Skripte modular halten, aber keine Module ohne eigenstaendige fachliche Aufgabe erzeugen.

## Batterieueberwachung

- Pace-Zellspreizung wird alle 15 Sekunden berechnet.
- Pace-/HELTEC-Vergleich wird alle 30 Sekunden berechnet.
- Die 128 vorhandenen Rohspannungen werden nicht dupliziert.
- Gespeichert werden nur Min/Max, Spreizung, Trend, Gueltigkeit, Alarme und Zellabweichungen.
- Quellzeitstempel werden uebernommen; es wird kein kuenstlicher Aktualisierungszeitstempel pro Zyklus geschrieben.
