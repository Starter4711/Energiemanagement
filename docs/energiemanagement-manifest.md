# Energiemanagement Manifest

## Ziel

Jegliche erzeugte PV-Energie soll moeglichst vollstaendig selbst verbraucht werden. Batterie- und E-Auto-Ladung sollen optimiert werden. Wetterdaten sollen genutzt werden, damit Batterien nicht unnoetig zu frueh am Tag mit voller Leistung vollgeladen werden.

## Anlagen und Zaehlpunkte

### Zaehpunkt 1: Haus

- 10 kW Fronius
- 4,7 kW SMA
- Victron 3P Anlage (ESS)

### Zaehpunkt 2: Halle

- 27 kW Fronius
- Victron 3P Anlage (BAT)

### Zaehpunkt 3: Alte Wohnung

- 17 kW Solaredge

## Speicher und Victron

- Zwei 3-phasige Victronanlagen an Haus (ESS) und Halle (BAT), jeweils mit eigenem Cerbo
- Vier Gobel-Batteriepacks mit je 15 kWh auf der DC-Seite an beide Victronanlagen
- Ein Victron RS450 auf der DC-Seite mit 5,76 kWp
- Die Victronanlagen laufen selbstautomatisiert in Mode 3
- Energie kann ueber die DC-Seite zwischen den Anlagen durchgeschleust werden
- Maximalleistungen muessen beruecksichtigt werden

## Verbraucher

### Wallboxen

- Wallbox 1: 11 kW, regelbar, 1-phasig und 3-phasig umschaltbar waehrend der Ladung
- Wallbox 2: 22 kW, regelbar, 1-phasig und 3-phasig umschaltbar waehrend der Ladung
- Wallbox 3: 11 kW, nicht regelbar, darf nicht veraendert werden
- Morgens sollen Wallbox 1 und 2 auf 1-phasig stehen
- Wallbox 1 und 2 sollen bei angestecktem Fahrzeug aktiviert werden koennen
- Bei Netzbezug darf die Ladung gestoppt werden

### Pooltechnik an Zaehlpunkt Halle

- 3-phasige Poolpumpe
- Waermepumpe
- Elektrolyse
- Wenn zu wenig Leistung verfuegbar ist:
  1. Waermepumpe und Elektrolyse beenden
  2. 30 Sekunden spaeter Pumpe abschalten
- Poolsteuerung beinhaltet PV-ueberschussabhaengiges Aktivieren von Pumpe (`DB1.6`) und Waermepumpe (`DB1.7`) in Abhaengigkeit von der maximalen Temperatur

## Saldierende Verteilung

- Die drei Zaehpunkte sind in einem Verein
- Energie wird zur Abrechnung saldierend verteilt
- Wenn ein Zaehpunkt Netzbezug hat, wird Netzeinspeisung einem anderen Zaehler gutgeschrieben
- Die Regelung arbeitet in einem 15-Minuten-Takt
- Beispiel: Der Victron-Setpoint des ESS kann fuer Haus oder Halle so gesetzt werden, dass saldierend kein Netzbezug bleibt

## Batterie-Strategie

- Parameter 1: maximale Ladegrenze SOC, z. B. 80 %
- Parameter 2: ab welchem Punkt Victron die Batterie nicht weiter laden soll, damit der RS450 die Restladung uebernimmt
- Da der RS450 nicht ins Netz laden darf, soll seine Tagesleistung moeglichst voll ausgeschoepft werden
- Tagesertrag soll anhand von Wetterdaten eingeschaetzt werden
- Eine Restkapazitaet der Batterie gemaess Victron-Parametern muss immer eingehalten werden
- Sommer/Winter muessen unterschieden werden
- Im Sommer moeglichst batterienschonend arbeiten
- Im Winter volle Kapazitaet und Leistung nutzen

## Restriktionen

- Am Zaehlpunkt Halle sind maximal 15 kW Netzbezug erlaubt
- Wallbox 3 darf nicht geregelt werden
- Bestehende ioBroker-Skripte werden nicht inhaltlich veraendert
- Jede Steuerfunktion soll in einem eigenen JavaScript-Skript umgesetzt werden

## Datenquellen und Kommunikation

- `mqtt.1`: Cerbo Haus
- `mqtt.2`: Cerbo Halle
- `mqtt.3`: Raspi VenusOS fuer Zaehler von Zaehpunkt 3 und Solaredge
- Kommunikation mit den Cerbos erfolgt aus ioBroker ueber MQTT
- Unter `mqtt.x.ioBroker` sind bereits Variablen fuer die Kommunikation mit den Cerbos angelegt
- Unter `alias.0` sind bestehende Alias-Variablen vorhanden und zu verwenden
- Direkte Objekte aus Schnittstellen sollen nicht verwendet werden

## Pool via S7

- Kommunikation mit Siemens Logo ueber S7
- Data Points: `DB1`, Eingaenge `I`, Ausgaenge `Q`
- `Q1`: Pumpe
- `Q2`: Elektrolyse
- `Q3`: Wasserstand
- `Q4`: Waermepumpe
- `I1`: Wassersensor
- `DB1.0`: Winterbetrieb
- `DB1.1`: Pumpe deaktivieren
- `DB1.2`: Elektrolyse deaktivieren
- `DB1.3`: H2O deaktivieren
- `DB1.4`: Waermepumpe deaktivieren

## PV-Ausrichtung

- SMA: Sueden, alt und schwaecher
- Solaredge: Ost/West
- Fronius 10 kW: Ost/West
- Fronius 27 kW: Sueden, sommer- und winterseitig am ertragreichsten

## Code-Regeln fuer ioBroker JavaScript

1. Ausschliesslich native ioBroker-Skriptfunktionen verwenden:
   - `on()`
   - `getState()`
   - `setState()`
   - `setStateDelayed()`
   - `createState()`
   - `extendObject()`
   - `subscribe()`
   - `schedule()`
   - `log()`
2. Keine externen Bibliotheken oder Node.js-Webserver-Module verwenden, ausser explizit angefordert
3. Modernen ECMAScript-6+-Code schreiben
4. Fuer asynchrone Operationen `async/await` statt verschachtelter Callbacks verwenden
5. `ack` korrekt setzen:
   - `ack: false` fuer Befehle an Aktuatoren
   - `ack: true` fuer Sensorzustaende und eigene Datenpunkte in `0_userdata.0`
6. Fehlerbehandlung mit `try/catch` und Logging ueber `log('Fehler: ' + e.message, 'warn')`
7. Keine Datenpunkte erfinden
8. Bei Bedarf exakte IDs anfragen oder klar markierte Platzhalter verwenden

## Architekturvorgabe

- Jede Steuerausgangslogik bzw. Funktion in ein eigenes JavaScript-Skript
- Ziel: gute Eingrenzbarkeit bei Fehlersuche und Optimierung
- Debug-Dateien sollen je Skript im Backup-Verzeichnis auf der Synology fuer spaetere Analyse liegen
