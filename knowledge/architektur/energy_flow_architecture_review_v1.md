# Energy Flow V1 Architecture Review

Version: 1.0

Status: Approved

## Ziel

Dieses Dokument beschreibt die Architekturentscheidung für das Modul
**Energy Flow V1**.

Es dokumentiert den fachlichen Umfang, die Modulgrenzen und die Freigabe
für die Implementierung.

------------------------------------------------------------------------

# Architekturentscheidung

Energy Flow V1 ist ein reines Read-Only-Modul.

Es stellt den aktuellen Energiefluss des Gesamtsystems dar und besitzt
keinerlei Steuer- oder Optimierungsfunktion.

------------------------------------------------------------------------

# Verantwortlichkeiten

Das Modul:

-   aggregiert freigegebene EOS-States
-   berechnet den aktuellen Energiefluss
-   schreibt ausschließlich eigene States
-   stellt Daten für VIS2 bereit

Das Modul übernimmt ausdrücklich **nicht**:

-   Lastmanagement
-   Batterieregelung
-   Wallbox-Steuerung
-   Prognosen
-   Tarifoptimierung
-   Handlungsempfehlungen

------------------------------------------------------------------------

# Abhängigkeiten

Energy Flow V1 liest ausschließlich freigegebene öffentliche EOS-States.

Direkte Zugriffe auf Adapter (Modbus, MQTT, Alias usw.) sind nicht
Bestandteil des Moduls.

------------------------------------------------------------------------

# Öffentliche Schnittstelle

Alle Ausgaben erfolgen unter:

`0_userdata.0.EOS.EnergyFlow`

Diese Schnittstelle gilt nach Freigabe als stabil.

------------------------------------------------------------------------

# VIS2

VIS2 verwendet ausschließlich die öffentliche State-Struktur.

Es findet keinerlei Berechnung innerhalb von VIS2 statt.

------------------------------------------------------------------------

# Fehlerverhalten

Kommunikationsprobleme dürfen nicht zu falschen Berechnungen führen.

Ungültige Zustände werden über definierte Statuswerte signalisiert.

------------------------------------------------------------------------

# Erweiterbarkeit

Weitere Funktionen werden ausschließlich in späteren Versionen ergänzt.

Beispiele:

-   Energy Flow V2
-   Optimizer
-   Forecast
-   Scheduler

Die öffentliche Schnittstelle von V1 bleibt dabei kompatibel.

------------------------------------------------------------------------

# Freigabe

Mit diesem Dokument ist die Architektur von Energy Flow V1 vollständig
definiert.

Die Implementierung kann auf Basis der Spezifikation, des State Models
und der allgemeinen EOS State Conventions erfolgen.
