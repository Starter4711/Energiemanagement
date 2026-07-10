# Energy Flow V1 Spezifikation

## Ziel des Moduls

Energy Flow V1 ist die EOS-Schicht zur konsolidierten Sicht auf alle Energiefluesse des Systems.
Sie fasst vorhandene Energie- und Leistungsinformationen aus den freigegebenen Quellen zusammen und stellt sie als aufbereitete EOS-States bereit.
V1 bleibt strikt read-only und arbeitet ereignisgetrieben.

## Aufgaben

- Energiefluesse konsolidieren
- Eingangsdaten verdichten
- systemweite Energiesicht bereitstellen
- Status und Teilbereiche lesbar aufbereiten
- nachgelagerte Auswertung auf EOS-States ermoeglichen

## Abgrenzung

- keine Aktorik
- keine Regelung
- keine Recommendation
- keine Prognose
- keine Optimierungslogik
- keine direkte Nutzung in der Steuerung

## Eingänge

- EOS-Batteriesicht unter `0_userdata.0.EOS.Battery.*`
- EOS-Bilanzsicht fuer Grid unter `0_userdata.0.Energiemanagement.Bilanz.*`
- zukuenftige freigegebene EOS-Lesesichten fuer PV, House und Wallbox
- Kommunikations- und Frischestatus der vorhandenen Quellen

## Ausgänge

- EOS-States unter `0_userdata.0.EOS.EnergyFlow.*`
- verdichtete Teilbereiche je Domäne
- Summary fuer die Gesamtsicht
- Communication fuer die technische Sicht auf Aktualitaet und Erreichbarkeit

## Erlaubte Datenquellen

- bestehende EOS-States
- bereits freigegebene Batterie-EOS-States
- bereits freigegebene ioBroker-Readout-Quellen, sofern sie nur lesend genutzt werden
- vorhandene, dokumentierte Verbrauchs- und Netzwerte

## Verbotene Datenquellen

- rohe Steuerpfade
- Aktor- oder Schaltpfade
- direkte Schreibziele
- nicht dokumentierte Rohquellen
- Alias-/MQTT-/Modbus-/Adapter-Rohpfade, sofern sie nicht ausdruecklich als reine Lesequelle dokumentiert sind

## State-Struktur

Die Energy-Flow-Schicht stellt ihre Ergebnisse unter `0_userdata.0.EOS.EnergyFlow.*` bereit.

## Update-Konzept

- ausschliesslich lesende Aufnahme
- ausschliesslich ereignisbasierte Verdichtung
- Schreiben nur bei Aenderung oder fachlich notwendigem Refresh
- keine Rueckwirkung auf Quellen oder Aktoren

## Fehlerverhalten

- unbekannte Werte bleiben `UNKNOWN`
- Kommunikationsprobleme werden als Status abgebildet
- fehlende Quellen fuehren nicht zu Steuerreaktionen
- Teilbereiche duerfen separat `UNKNOWN` bleiben

## Zukuenftige Erweiterungen

- feinere Domänenverdichtung
- weitere Detail-States
- separate Diagnoseableitungen
- spaetere Visualisierung auf Basis der EOS-States

## Ausdrueckliche Ausschlüsse

- keine Aktorik
- keine Regelung
- keine Recommendation
