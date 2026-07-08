# Battery Supervisor V1 Spezifikation

## Zweck

Battery Supervisor V1 ist der erste echte EOS-Baustein fuer den Batteriebereich.
Er fasst die fuer den Betrieb relevanten Batterieinformationen zusammen und stellt daraus die freigegebene Communication-Baseline fuer VIS2 und nachgelagerte Auswertungen bereit.

V1 ist bewusst als Beobachtungs- und Bewertungsebene definiert.
Sie schafft eine gemeinsame, konsolidierte Sicht auf Batterie, Packs und Kommunikationszustand, ohne selbst Steuerungsentscheidungen an Victron, Cerbo oder andere Aktoren zu schreiben.

## Abgrenzung

Battery Supervisor V1 macht keine:

- direkte Steuerung
- Prognose
- Lebensdaueranalyse
- Ersatz fuer Cerbo-Echtzeitregelung
- Ersatz fuer Gobel / Pace BMS als Schutzinstanz

V1 liefert nur aufbereitete EOS-Daten und eine kontextbezogene Bewertung.
Spätere Versionen koennen auf dieser Grundlage um aktive Empfehlungen, verfeinerte Diagnose oder strategische Automatisierung erweitert werden.

## Eingangsdaten

Battery Supervisor V1 verarbeitet folgende Eingangsdatenquellen:

- SmartShunt
  - fuehrende Quelle fuer Gesamt-SOC, Batteriespannung und Batteriestrom
- Gobel / Pace BMS
  - fuehrende Schutz- und Grenzquelle fuer die Batterie
- Heltec
  - Diagnoseebene fuer Zellspannungen und Packvergleich
- vorhandene Batterie-Skripte
  - vor allem bereits aufbereitete Daten aus dem Batterie- und Vergleichsbereich
  - bestehende Diagnose- und Statuswerte sollen weitergenutzt werden, wenn sie fachlich passen

## Ausgangsdaten unter `0_userdata.0.EOS.Battery.*`

Battery Supervisor V1 stellt seine Ergebnisse als EOS-Daten unter `0_userdata.0.EOS.Battery.*` bereit.
Die Datenstruktur ist in Gruppen gegliedert, damit VIS2 und spaetere Auswertungen nur aufbereitete Daten lesen und keine Rohquellen direkt zusammenfuehren muessen.

Die geplante Struktur ist:

- `0_userdata.0.EOS.Battery.Summary.*`
- `0_userdata.0.EOS.Battery.SmartShunt.*`
- `0_userdata.0.EOS.Battery.Packs.*`
- `0_userdata.0.EOS.Battery.Communication.*`
- `0_userdata.0.EOS.Battery.Warnings.*`
- `0_userdata.0.EOS.Battery.Settings.*`

## EOS-State-Gruppen

### Summary

Die Summary-Gruppe liefert die komprimierte Gesamtsicht auf den Batteriezustand.
Typische Inhalte sind:

- Gesamtstatus
- zusammengefasste Warnstufe
- zusammengefasste Kommunikationslage
- zentrale Betriebsindikatoren

### SmartShunt

Die SmartShunt-Gruppe fuehrt die wesentlichen Messwerte der Gesamtbatterie:

- Gesamt-SOC
- Batteriespannung
- Batteriestrom
- Lade- und Entladesicht

### Packs

Die Packs-Gruppe sammelt packbezogene Sichtwerte:

- Packstatus
- Packtemperaturen
- Zellspannungsabweichungen
- Balance- und Auffaelligkeitsindikatoren je Pack

### Communication

Die Communication-Gruppe dokumentiert die technische Erreichbarkeit und Aktualitaet der Quellen:

- SmartShunt erreichbar
- BMS erreichbar
- Heltec erreichbar
- Datenalter
- Teilstaende

### Warnings

Die Warnings-Gruppe enthaelt aufbereitete Beobachtungen und Warnungen.
Unklare oder nur teilweise belastbare Zustaende sollen hier zuerst als Beobachtung erscheinen, nicht sofort als harter Fehler.

### Settings

Die Settings-Gruppe dokumentiert ausschliesslich die fuer die Kommunikationsbewertung verwendeten Schwellenwerte.
So bleibt fuer VIS2 und spaetere Diagnose nachvollziehbar, mit welchen Parametern der Supervisor die Communication-Baseline bildet.

## Wichtige Settings

Folgende Einstellungen sind fuer V1 relevant:

- `CommunicationWarningTimeout_s`
- `CommunicationOfflineTimeout_s`

Die Settings dienen der Nachvollziehbarkeit und der Kommunikationsbewertung.
Sie sind keine eigenstaendige Steuerungslogik.

## VIS2-Nutzung

VIS2 liest nur aufbereitete EOS-Daten.
Die Batterieseite zeigt dabei:

- Status
- SmartShunt
- Packs
- Communication
- Warnings
- Communication-Settings

Zellvergleich und Grafana bleiben in Unterseiten und Detailansichten.
Die Hauptseite soll bewusst kompakt bleiben und nur die freigegebene Supervisor-Baseline anzeigen.

## Abgrenzung zu spaeteren Versionen

V1 ist die erste stabile Beobachtungs- und Bewertungsebene fuer EOS-Batteriedaten.
Spaetere Versionen koennen ergaenzen:

- feinere Diagnose
- strategische Ableitungen
- eventuell weitere Visualisierungsebenen

Diese Erweiterungen duerfen die hier festgehaltene Abgrenzung von V1 nicht aufweichen.
