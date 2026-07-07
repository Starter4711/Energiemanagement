# Victron- und Venus-Struktur

## Zweck

Diese Datei beschreibt die dokumentierte Victron-, Cerbo- und Venus-Topologie sowie die Rollen der beteiligten Systeme.

## Victron-Systeme

### Cerbo ESS

- Standort: Haus / neues Haus
- IP `192.168.0.191`
- VRM-ID `c0619ab336ed`
- MQTT in ioBroker: `mqtt.1`
- `3x MultiPlus-II 5000 3P` mit Bezeichnung `ESS`

### Cerbo BAT

- Standort: Halle
- IP `192.168.0.195`
- VRM-ID `c0619ab4bea6`
- MQTT in ioBroker: `mqtt.2`
- `3x MultiPlus-II 5000 3P` mit Bezeichnung `BAT`
- MQTT Battery / SerialBattery

## Venus-Gateway

- Dokumentationsname: `Venus-Gateway`
- Raspberry Pi vermutlich `2B+`
- IP `192.168.0.153`
- Venus OS `v3.66`
- VRM-ID `b827eb7fd855`
- MQTT in ioBroker: `mqtt.3`
- Aufgabe: Mess- und Daten-Gateway

## Funktionsverteilung

- Cerbo ESS und Cerbo BAT bleiben die primaeren Echtzeitregler.
- ioBroker setzt Strategie, Sollwerte, Limits und Parameter.
- MQTT dient als Transport.
- Node-RED laeuft auf den Cerbos im Venus OS Large Image.
- Node-RED ist Kommunikationsbruecke, keine fuehrende Entscheidungsinstanz.
- Node-RED schreibt per MQTT vom ioBroker empfangene Werte auf Cerbo-, D-Bus- und Victron-Parameter.

## Relevante Datenquellen im Venus-Umfeld

- Alle EM24 sind per Modbus TCP am Venus-Gateway angebunden.
- Das Venus-Gateway erfasst:
  - EM24 Old Grid
  - EM24 40A
  - SolarEdge per Modbus TCP

## MPPT RS 450

- `5,76 kWp`
- Haengt direkt am Victron Lynx
- Speist maximal ca. `100 A` direkt in das gemeinsame DC-System
- Darf nicht aktiv ueber Victron ESS ins Netz druecken
- Ist wichtig fuer Schwarzstartfaehigkeit bei leerer Batterie und PV-Produktion

## Strategische Kernaussagen

- SmartShunt ist im Gesamtverbund fuehrend fuer SOC, Spannung und Strom.
- Cerbo-Systeme regeln in Echtzeit, ioBroker optimiert den Betriebsrahmen.
- Das Venus-Gateway ist Mess- und Daten-Gateway, nicht primaerer Energieregler.

## Unklar

- Direkter produktiver VRM-API-Zugriff ausserhalb des dokumentierten MQTT-/Venus-Betriebs ist `Unklar`.
- Der Raspberry Pi des Venus-Gateways ist vermutlich `2B+`; dies bleibt `Unklar`, bis es quellenbasiert bestaetigt ist.
