# EOS State Conventions

Version: 1.0

Status: Approved Architecture Standard

## Zweck

Dieses Dokument definiert den verbindlichen Standard für alle
öffentlichen EOS-States.

## Namespace

Alle öffentlichen EOS-States befinden sich unter:

`0_userdata.0.EOS`

## Namenskonvention

-   PascalCase
-   Beispiele:
    -   `Battery.Power`
    -   `Battery.SOC`
    -   `Grid.Power`

## Datentypen

-   Number
-   Boolean
-   String

Nicht zulässig: - Arrays - JSON-Objekte - Dynamische Typwechsel

## Einheiten

  Größe        Einheit
  ------------ ---------
  Leistung     W
  Energie      Wh
  Spannung     V
  Strom        A
  Temperatur   °C
  SOC          \%
  Zeit         ms

## Zeitformat

Alle `LastUpdate`-States verwenden Unix-Timestamp in Millisekunden
(`Date.now()`).

## Vorzeichenregeln

-   `Grid.Power`
    -   0 = Netzbezug

    -   \< 0 = Netzeinspeisung
-   `Battery.Power`
    -   0 = Laden

    -   \< 0 = Entladen
-   `PV.Power`
    -   0 = PV-Erzeugung
-   Verbraucher (`House.Power`, `Wallbox.Power`) werden positiv
    angegeben.

## Statuswerte

-   Initializing
-   OK
-   Warning
-   Error
-   Unknown
-   Invalid

## Source of Truth

Jeder öffentliche EOS-State besitzt genau einen Owner.

## Kompatibilität

Nach Freigabe dürfen öffentliche States nicht umbenannt, gelöscht oder
im Datentyp bzw. der Bedeutung geändert werden. Erweiterungen erfolgen
ausschließlich durch neue States.

## VIS2

VIS2 liest ausschließlich öffentliche EOS-States und enthält keine
Geschäftslogik.

## Architekturprinzipien

Alle Module arbeiten:

-   deterministisch
-   idempotent
-   nebenwirkungsfrei
-   reproduzierbar
