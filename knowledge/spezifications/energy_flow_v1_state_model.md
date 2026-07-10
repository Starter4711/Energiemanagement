# Energy Flow V1 State Model

Version: 1.0

Status: Approved Architecture Contract

## Zweck

Dieses Dokument definiert die öffentliche State-Struktur des Moduls
**Energy Flow V1**.

Alle States befinden sich unter:

`0_userdata.0.EOS.EnergyFlow`

Die allgemeinen Konventionen sind in
`knowledge/architecture/eos_state_conventions.md` definiert.

------------------------------------------------------------------------

# Struktur

    0_userdata.0.EOS.EnergyFlow
    ├── Grid
    ├── PV
    ├── Battery
    ├── House
    ├── Wallbox
    ├── Summary
    └── Communication

## Grid

  State        Typ      Einheit   Beschreibung
  ------------ -------- --------- ----------------------------------------
  Power        Number   W         Netzleistung (+ Bezug / - Einspeisung)
  Status       String   \-        Kommunikationsstatus
  LastUpdate   Number   ms        Unix Timestamp

## PV

  State        Typ      Einheit   Beschreibung
  ------------ -------- --------- ----------------------
  Power        Number   W         Aktuelle PV-Leistung
  Status       String   \-        Kommunikationsstatus
  LastUpdate   Number   ms        Unix Timestamp

## Battery

  State        Typ      Einheit   Beschreibung
  ------------ -------- --------- -----------------------
  Power        Number   W         \+ Laden / - Entladen
  SOC          Number   \%        Ladezustand
  Status       String   \-        Kommunikationsstatus
  LastUpdate   Number   ms        Unix Timestamp

## House

  State        Typ      Einheit   Beschreibung
  ------------ -------- --------- -------------------------
  Power        Number   W         Aktueller Hausverbrauch
  Status       String   \-        Kommunikationsstatus
  LastUpdate   Number   ms        Unix Timestamp

## Wallbox

  State        Typ       Einheit   Beschreibung
  ------------ --------- --------- -----------------------
  Power        Number    W         Aktuelle Ladeleistung
  Active       Boolean   \-        Ladevorgang aktiv
  Status       String    \-        Kommunikationsstatus
  LastUpdate   Number    ms        Unix Timestamp

## Summary

  State        Typ      Einheit   Beschreibung
  ------------ -------- --------- ------------------------------------
  Status       String   \-        Gesamtstatus
  LastUpdate   Number   ms        Letzte erfolgreiche Aktualisierung

## Communication

  State           Typ      Einheit   Beschreibung
  --------------- -------- --------- -------------------------
  OverallStatus   String   \-        Kommunikationszustand
  TimeoutCount    Number   \-        Anzahl aktiver Timeouts
  LastUpdate      Number   ms        Unix Timestamp

## Statuswerte

-   Initializing
-   OK
-   Warning
-   Error
-   Unknown
-   Invalid

## Regeln

-   Keine Arrays
-   Keine JSON-Objekte
-   Feste Datentypen
-   Öffentliche States sind nach Freigabe abwärtskompatibel.
-   Neue Informationen werden ausschließlich durch zusätzliche States
    erweitert.
