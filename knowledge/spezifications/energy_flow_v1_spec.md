# Energy Flow V1 Specification

Version: 1.0

Status: Approved Architecture Specification

## Ziel

Energy Flow V1 stellt den aktuellen Energiefluss des Gesamtsystems
ausschließlich lesend dar.

Das Modul besitzt keinerlei Steuerfunktion.

## Verantwortungsbereich

Das Modul aggregiert freigegebene EOS-States und erzeugt ausschließlich
öffentliche States unter:

`0_userdata.0.EOS.EnergyFlow`

Domänen:

-   Grid
-   PV
-   Battery
-   House
-   Wallbox
-   Summary
-   Communication

## Out of Scope

-   Optimierung
-   Regelung
-   Lastmanagement
-   Prognosen
-   Preisoptimierung
-   Peak Shaving
-   Batteriesteuerung
-   Empfehlungen

## Qualitätsregeln

-   Read Only
-   Deterministisch
-   Idempotent
-   Nebenwirkungsfrei

Das Modul verändert niemals Fremdobjekte.

## Source of Truth

Es dürfen ausschließlich freigegebene EOS-States verwendet werden.

Direkte Zugriffe auf Adapter, MQTT, Modbus oder Alias-Strukturen sind
innerhalb des Moduls nicht zulässig.

## Fehlerverhalten

Fehlende Eingangsdaten führen nicht zu Schätzungen.

Der Status ist stattdessen `Unknown` oder `Invalid`.

## Performance

-   Ereignisgesteuert
-   Keine Polling-Schleifen
-   Keine unnötigen State-Schreibvorgänge

## VIS2-Vertrag

VIS2 liest ausschließlich:

`0_userdata.0.EOS.EnergyFlow.*`

VIS2 enthält keinerlei Geschäftslogik.

## Logging

Standardbetrieb erzeugt kein permanentes Logging.

Warnungen erfolgen ausschließlich bei Kommunikationsfehlern, ungültigen
Daten oder inkonsistenten Zuständen.

## Architektur

Die allgemeinen Regeln für State-Namen, Datentypen, Einheiten und
Kompatibilität sind im Dokument
`knowledge/architecture/eos_state_conventions.md` definiert und
verbindlich.
