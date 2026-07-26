# Energy Flow V1 Spezifikation

## Ziel des Moduls

Energy Flow V1 ist die EOS-Schicht zur konsolidierten Sicht auf die dokumentierten Energieflüsse des Systems.
Sie übernimmt freigegebene EOS-Quellen und stellt sie als read-only Energy-Flow-States bereit.
V1 arbeitet ereignisgesteuert.

Konsolidierung bedeutet fachliche Zusammenführung in einer gemeinsamen Sicht. Physisch getrennte Netz-Zählpunkte werden dabei nicht rechnerisch summiert.

## Aufgaben

- Energieflüsse in einer gemeinsamen EOS-Sicht darstellen
- Eingangsdaten ohne Änderung ihrer fachlichen Bedeutung übernehmen
- Status und Teilbereiche lesbar aufbereiten
- nachgelagerte Anzeige auf stabilen EOS-States ermöglichen

## Abgrenzung

- keine Aktorik
- keine Regelung
- keine Recommendation
- keine Prognose
- keine Optimierungslogik
- keine direkte Nutzung in der Steuerung
- keine Summierung physisch getrennter Netz-Zählpunkte
- keine 15-Minuten-Abrechnung oder wirtschaftliche Saldierung

## Eingänge

- getrennte EOS-Grid-Sichten:
  - Grid 40, alte Wohnung: `0_userdata.0.EOS.Grid.Sources.Grid40.*`
  - Grid 41, Halle: `0_userdata.0.EOS.Grid.Sources.Grid41.*`
  - Grid 43, Haus: `0_userdata.0.EOS.Grid.Sources.Grid43.*`
- EOS-Batteriesicht unter `0_userdata.0.EOS.Battery.*`
- EOS-Wallbox-Summary unter `0_userdata.0.EOS.Wallbox.Summary.*`
- EOS-PV-Summary unter `0_userdata.0.EOS.PV.Summary.*`; `PV.Power` ist ein Anzeigewert aus AC plus RS450-DC
- zukünftige freigegebene EOS-Lesesicht für House
- Kommunikations- und Frischestatus der vorhandenen Quellen

Grid 42 ist kein Netz-Zählpunkt und darf nicht in Energy Flow aufgenommen werden. Der RS450 gehört zur DC-PV-/Batterieseite und wird keinem Grid zugeordnet.

## Grid-Modell

Die bisherige einzelne Sicht unter `0_userdata.0.EOS.EnergyFlow.Grid.Power|Status|LastUpdate` ist fachlich ungültig und wird im Zielmodell nicht weitergeführt.

Stattdessen enthält `EnergyFlow.Grid` drei getrennte Bereiche:

- `Grid40`: alte Wohnung
- `Grid41`: Halle
- `Grid43`: Haus

Jeder Bereich übernimmt ausschließlich:

- `Power`: numerische Leistung in W
- `Status`: String
- `LastUpdate`: numerischer Millisekunden-Zeitstempel

Vorzeichen bleiben unverändert:

- positiv = Netzbezug
- negativ = Netzeinspeisung

Es gibt innerhalb von `EnergyFlow.Grid` keinen Gesamtleistungswert und keine Summary der drei Zähler.

## Ausgänge

- EOS-States unter `0_userdata.0.EOS.EnergyFlow.*`
- getrennte Grid-Bereiche für Grid 40, Grid 41 und Grid 43
- verdichtete Teilbereiche für PV, Battery, House und Wallbox
- Summary ausschließlich als Gesamtstatus der Energy-Flow-Sicht, ohne Grid-Leistungssumme
- Communication für die technische Sicht auf Aktualität und Erreichbarkeit

## Erlaubte Datenquellen

- bestehende, freigegebene EOS-States
- bereits freigegebene Batterie-EOS-States
- dokumentierte read-only Quellen

## Verbotene Datenquellen

- rohe Steuerpfade
- Aktor- oder Schaltpfade
- direkte Schreibziele
- nicht dokumentierte Rohquellen
- direkte Alias-, MQTT-, Modbus- oder Adapter-Rohpfade, sofern eine freigegebene EOS-Sicht vorhanden ist

## State-Struktur

Die Energy-Flow-Schicht stellt ihre Ergebnisse unter `0_userdata.0.EOS.EnergyFlow.*` bereit.
Das verbindliche Mapping ist in `docs/energy_flow_v1_state_model.md` festgelegt.

## Update-Konzept

- ausschließlich lesende Aufnahme
- ausschließlich ereignisbasierte Verdichtung
- Schreiben nur bei Änderung oder fachlich notwendigem Refresh
- keine Rückwirkung auf Quellen oder Aktoren

## Fehlerverhalten

- Leistungswerte bleiben numerisch; bei ungültiger Quelle wird `0 W` ausgegeben
- der zugehörige Status verhindert die Interpretation als bestätigte Nulllast
- Kommunikationsprobleme werden je Grid getrennt abgebildet
- der Ausfall eines Grid-Zählers verändert nicht den Leistungswert eines anderen Grid-Zählers
- fehlende Quellen führen nicht zu Steuerreaktionen

## Ausdrückliche Ausschlüsse

- keine Grid-Summierung
- keine Aktorik
- keine Regelung
- keine Recommendation
- Implementierung in `Energy_Flow_V1` 1.4.0 erfolgt; noch kein Live-Deployment
