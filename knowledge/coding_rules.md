# Coding-Regeln

## Harte Projektregeln

- Bestehende Skripte unter `iobroker/scripts/common/` nicht inhaltlich aendern, sofern nicht explizit verlangt.
- Neue Energiemanagement-Logik nur unter `iobroker/scripts/energiemanagement/` anlegen.
- GitHub ist Referenz und Backup.
- ioBroker ist das Live-System.
- Vor Live-Aenderungen Backups anlegen.
- Keine Informationen raten. Bei fehlenden Informationen `Unklar` schreiben.
- Kleine, lokal begrenzte Aenderungen gegenueber breiten Umbauten bevorzugen.
- Bestehende MQTT-Topics, ioBroker-States, Alias-Pfade, Objekt-IDs, Device-IDs und Adapterinstanzen nicht ohne ausdrueckliche Freigabe aendern.
- Keine Platzhalter anlegen.
- Keine TODO-Dummyfunktionen, Scheinimplementierungen oder leeren Codepfade einbauen.
- Vor jedem Commit `git diff` pruefen.
- Bei jeder relevanten Verhaltens-, Struktur- oder Betriebsaenderung die zugehoerige Dokumentation aktualisieren.

## Ressourcenschonung

Aus der Projektanalyse abgeleitete verbindliche Regeln:


- Ressourcenschonung hat Vorrang.
- Reaktionszeit passend zur Funktion waehlen.
- Daten nicht unnoetig duplizieren.
- Nur abgeleitete Werte, Status und Alarme speichern, wenn sinnvoll.
- Datenpunkte nur bei Wertaenderung schreiben.
- Dauerfehler nicht in Logflut ausarten lassen.
- Bestehende Messwerte zentral aufbereiten, wenn mehrere Module sie brauchen.
- Polling-, Trigger- und Schreibfrequenzen moeglichst knapp an den fachlichen Bedarf anpassen.
- Keine unnoetigen Spiegelobjekte oder redundanten Berechnungen erzeugen.
- Logging im Produktivpfad sparsam einsetzen.

## Architekturregeln

- Altbestand und neue Logik sauber trennen.
- Das neue Energiemanagement soll modular aufgebaut sein.
- Alias-Objekte bevorzugen.
- MQTT-Rohobjekte nur dort direkt lesen, wo es fachlich notwendig ist.
- SmartShunt-Werte sind fuer Gesamt-SOC und DC-Spannung fuehrend.
- Der Gobel-SOC ist nicht als fuehrende Gesamtgroesse zu verwenden.
- go-e-Steuerung soll bestehende Adapterobjekte und die dokumentierte HTTP-Phasenumschaltung respektieren.
- Schutz- und Grenzlogik darf nicht stillschweigend auf andere Datenquellen umgebogen werden.

## Aenderungsregeln fuer Live-nahe Pfade

- Aktorische Schreibpfade sind besonders kritisch und nur eng begrenzt zu aendern.
- Dazu gehoeren insbesondere MQTT-Steuerthemen, go-e-Steuerobjekte, go-e-HTTP-Aufrufe, S7-Pfade und Datenpunkte unter `0_userdata.0.Energiemanagement.*`.
- Wenn ein bestehender Schreibpfad fachlich fraglich wirkt, zuerst dokumentieren und als `Unklar` markieren, statt ihn ohne Freigabe umzubauen.

## Deployment-Regeln

- Deployment neuer Skripte ueber `iobroker/tools/sync_iobroker.py`
- VIS-2-Deployment ueber `iobroker/tools/deploy_vis2.py`
- Vor Deployments Ruecksicherungen anlegen
- Nur die fuer den Task benoetigten Dateien deployen oder committen.
- Dokumentationsaenderungen duerfen keinen unbeabsichtigten Code- oder Objektchange mitziehen.

## Dokumentationsregeln

- `AGENTS.md` ist der Einstieg fuer neue Codex-Sitzungen und bei veraenderten Arbeitsregeln mitzupflegen.
- `knowledge/open_questions.md` enthaelt offene technische und betriebliche Punkte und ist bei neuen Unsicherheiten zu aktualisieren.
- `knowledge/decisions.md` dokumentiert gesicherte Entscheidungen und deren Begruendung.
- `docs/project_analysis.md` bleibt die technische Primaerquelle, solange keine belastbarere projektspezifische Quelle vorliegt.

## Zahlen- und Einheitenformat

- Dokumentation und fachliche Texte verwenden Deutsch oesterreichischer Prägung.
- Tausendertrennzeichen ist der Punkt.
- Dezimaltrennzeichen ist der Beistrich.
- Zahlen mit Einheiten werden mit geschuetztem oder normalem Leerzeichen zwischen Zahl und Einheit geschrieben.
- Beispiele:
  - `1.000 W`
  - `5,76 kWp`
  - `15,0 kWh`
  - `53,2 V`
  - `100,5 A`

## Unklar

- Weitere nicht dokumentierte Team- oder Stilregeln ausserhalb der vorhandenen Analyse sind `Unklar`.
