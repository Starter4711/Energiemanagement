# Battery Supervisor V1 Spezifikation

## Zweck

Battery Supervisor V1 ist der erste echte EOS-Baustein fuer den Batteriebereich.
Er fasst die fuer den Betrieb relevanten Batterieinformationen zusammen, bewertet sie im Kontext und stellt daraus aufbereitete Zustands-, Warn- und Empfehlungssignale fuer VIS2 und nachgelagerte Auswertungen bereit.

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
- `0_userdata.0.EOS.Battery.Health.*`
- `0_userdata.0.EOS.Battery.Packs.*`
- `0_userdata.0.EOS.Battery.Communication.*`
- `0_userdata.0.EOS.Battery.Warnings.*`
- `0_userdata.0.EOS.Battery.Recommendation.*`
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

### Health

Die Health-Gruppe beschreibt den fachlichen Gesundheits- und Plausibilitaetszustand.
Sie soll keine Lebensdaueranalyse ersetzen, sondern nur den aktuellen Bewertungszustand abbilden.

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

### Recommendation

Die Recommendation-Gruppe fasst nicht-aktorische Empfehlungen fuer den weiteren Betrieb zusammen.
Sie ist bewusst von einer echten Steuerung getrennt und darf keine direkten Schreibpfade ersetzen.

### Settings

Die Settings-Gruppe dokumentiert die fuer die Bewertung verwendeten Schwellen und Zielwerte.
So bleibt fuer VIS2 und spaetere Diagnose nachvollziehbar, mit welchen Parametern der Supervisor arbeitet.

## Wichtige Settings

Folgende Einstellungen sind fuer V1 relevant:

- `VDiff-Warnung normal`
- `VDiff-kritisch normal`
- `VDiff-Warnung Balancing/hoher SOC`
- `VDiff-kritisch Balancing/hoher SOC`
- `Temperatur-Warnung`
- `Temperatur-kritisch`
- `Min-SOC`
- `Max-SOC`
- `MaxChargeCurrent_A`
- `MaxDischargeCurrent_A`
- `WallboxSupportMaxPower_W`
- `WallboxSupportMinSoc_Percent`
- `TargetVoltageSummer_V` ca. `53,6 V`
- `TargetVoltageWinter_V` ca. `54,4 V`

Die Settings dienen der Nachvollziehbarkeit und der kontextbezogenen Bewertung.
Sie sind keine eigenstaendige Steuerungslogik.

## Bewertungslogik V1

Battery Supervisor V1 bewertet den Kontext, nicht einzelne Werte isoliert.

- VDiff bis ca. `100 mV` kann bei hohem SOC und aktivem Balancing normal sein.
- Bei niedrigerem SOC ohne Balancing wird dieselbe Abweichung strenger bewertet.
- Unklare Zustaende sollen als Beobachtung oder Warnung behandelt werden, nicht sofort als Fehler.
- Die Batterieaufnahme haengt von SOC, Spannung, Temperatur und BMS-Limits ab.
- Eine nicht erreichte Soll-Ladeleistung ist nicht automatisch ein Fehler.

Die Bewertung orientiert sich damit an Betriebszustand, Quelle und erwartbarem Verhalten der Batterie.

## VIS2-Nutzung

VIS2 liest spaeter nur aufbereitete EOS-Daten.
Die Batterieseite zeigt dabei:

- Status
- SmartShunt
- Health
- Packs
- wichtige Settings

Zellvergleich und Grafana bleiben in Unterseiten und Detailansichten.
Die Hauptseite soll bewusst kompakt bleiben und nur die wesentlichen Supervisor-Ergebnisse anzeigen.

## Abgrenzung zu spaeteren Versionen

V1 ist die erste stabile Beobachtungs- und Bewertungsebene fuer EOS-Batteriedaten.
Spaetere Versionen koennen ergaenzen:

- feinere Diagnose
- differenziertere Empfehlungen
- strategische Ableitungen
- eventuell weitere Visualisierungsebenen

Diese Erweiterungen duerfen die hier festgehaltene Abgrenzung von V1 nicht aufweichen.

