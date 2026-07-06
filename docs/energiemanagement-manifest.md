# Energiemanagement Manifest

## Ziel

Jegliche erzeugte PV-Energie soll moeglichst vollstaendig selbst verbraucht werden. Batterie- und E-Auto-Ladung sollen optimiert werden. Wetterdaten sollen genutzt werden, damit Batterien nicht unnoetig zu frueh am Tag mit voller Leistung vollgeladen werden.

## Anlagen und Zaehlpunkte

### Zaehpunkt 1: Haus

- 10 kW Fronius
- 4,7 kW SMA
- Victron 3P Anlage (ESS)
- Fronius 10 kW Leistung: `alias.0.Fronius.AC-Power_10kW`
- Fronius 10 kW MQTT-Quelle: `mqtt.1.N.c0619ab336ed.pvinverter.23.Ac.Power`
- SMA 4,7 kW Leistung: `alias.0.SMA.Power`
- SMA 4,7 kW MQTT-Quelle: `mqtt.1.N.c0619ab336ed.pvinverter.21.Ac.Power`
- Netzzaehler: `EM24 New Grid`
- Vorzeichenbehaftete Netzleistung: `alias.0.EM24 New Grid.Power`
- MQTT-Quelle: `mqtt.1.N.c0619ab336ed.grid.43.Ac.Power`
- Vorzeichenkonvention: positive Werte sind Netzbezug, negative Werte sind Einspeisung

### Zaehpunkt 2: Halle

- 27 kW Fronius
- Victron 3P Anlage (BAT)
- Fronius 27 kW Leistung: `alias.0.Fronius.AC-Power`
- Fronius 27 kW MQTT-Quelle: `mqtt.2.N.c0619ab4bea6.pvinverter.20.Ac.Power`
- Netzzaehler: `EM24 Hall Grid`
- Vorzeichenbehaftete Netzleistung: `alias.0.EM24 Hall Grid.Power`
- MQTT-Quelle: `mqtt.2.N.c0619ab4bea6.grid.41.Ac.Power`
- Vorzeichenkonvention: positive Werte sind Netzbezug, negative Werte sind Einspeisung

### Zaehpunkt 3: Alte Wohnung

- 17 kW Solaredge
- SolarEdge-Leistung: `alias.0.SE.Power`
- SolarEdge-MQTT-Quelle: `mqtt.3.N.b827eb7fd855.pvinverter.22.Ac.Power`
- Netzzaehler: `EM24 Old Grid`
- Vorzeichenbehaftete Netzleistung: `alias.0.EM24 Old Grid.Power Old Grid`
- MQTT-Quelle: `mqtt.3.N.b827eb7fd855.grid.40.Ac.Power`
- Vorzeichenkonvention: positive Werte sind Netzbezug, negative Werte sind Einspeisung

## Speicher und Victron

- Zwei 3-phasige Victronanlagen an Haus (ESS) und Halle (BAT), jeweils mit eigenem Cerbo
- Vier Gobel-Batteriepacks mit je 15 kWh auf der DC-Seite an beide Victronanlagen
- Ein Victron RS450 auf der DC-Seite mit 5,76 kWp
- Die Victronanlagen laufen selbstautomatisiert in Mode 3
- Energie kann ueber die DC-Seite zwischen den Anlagen durchgeschleust werden
- Maximalleistungen muessen beruecksichtigt werden

### Gobel Gesamtbatterie

- Gesamtwerte liegen unter `alias.0.Gobel`
- Victron-/MQTT-Quelle: Haus-Cerbo `mqtt.1`, Batterieinstanz `512`
- SOC: `alias.0.Gobel.SOC`
- Spannung: `alias.0.Gobel.Voltage`
- Strom: `alias.0.Gobel.Current`
- Leistung: `alias.0.Gobel.Power`
- Weitere BMS-Grenzwerte: `Gobel MaxChargeCurrent`, `Gobel MaxChargeVoltage` und `Gobel MaxDischargeCurrent`

### Gobel Einzelpacks

- Pack 1 / Master: `alias.0.Gobel_Master`, Modbus-Adresse 1
- Pack 2 / Slave 1: `alias.0.Gobel_Slave1`, Modbus-Adresse 2
- Pack 3 / Slave 2: `alias.0.Gobel_Slave2`, Modbus-Adresse 3
- Pack 4 / Slave 3: `alias.0.Gobel_Slave3`, Modbus-Adresse 4
- Je Pack stehen unter anderem SOC, Strom, Spannung, Temperatur, MOSFET-Temperatur, Balancing und Zellspannungsdifferenz zur Verfuegung

### Victron BAT / Halle

- Alias-Bereich: `alias.0.MP-BAT`
- Cerbo-/MQTT-Quelle: `mqtt.2`, Kennung `c0619ab4bea6`
- VEBus-Geraeteinstanz: `276`
- DC-Werte: `DC-Power`, `DC-Current`, `DC-Voltage`
- AC-Verbrauch je Phase: `BAT_Consumption_L1`, `BAT_Consumption_L2`, `BAT_Consumption_L3`
- Aktives SOC-Limit: `BAT_ActiveSocLimit`

### Victron ESS / Haus

- Alias-Bereich: `alias.0.MP-ESS`
- Cerbo-/MQTT-Quelle: `mqtt.1`, Kennung `c0619ab336ed`
- VEBus-Geraeteinstanz: `276`
- DC-Werte: `DC-Power`, `DC-Current`, `DC-Voltage`
- AC-Verbrauch je Phase: `ESS_Consumption_L1`, `ESS_Consumption_L2`, `ESS_Consumption_L3`

### Victron RS450/100 DC-Solarlader

- Alias-Bereich: `alias.0.MPPT RS450/100`
- Direkt mit der gemeinsamen Batterie verbunden; die Leistung ist keinem einzelnen AC-Zaehlpunkt zuzuordnen
- Cerbo-/MQTT-Quelle: `mqtt.1`, Kennung `c0619ab336ed`
- Solar-Charger-Geraeteinstanz: `0`
- DC-Strom: `alias.0.MPPT RS450/100.DC-Current`
- DC-Spannung: `alias.0.MPPT RS450/100.DC-Voltage`
- PV-Leistung String 1: `alias.0.MPPT RS450/100.P String1`
- PV-Leistung String 2: `alias.0.MPPT RS450/100.P String2`
- Gesamt-PV-Leistung des RS450 wird aus String 1 plus String 2 berechnet

## Verbraucher

### Wallboxen

- Wallbox 1 / V3: 11 kW, `go-e.0`, Seriennummer `069113`
- Leistung Wallbox 1: `alias.0.go-E.powerV3` in kW
- Wallbox 1 ist regelbar und waehrend der Ladung zwischen 1- und 3-phasig umschaltbar
- Wallbox 2 / V4: 22 kW, `go-e.1`, Seriennummer `219846`
- Leistung Wallbox 2: `alias.0.go-E.powerV4` in kW
- Wallbox 2 ist regelbar und waehrend der Ladung zwischen 1- und 3-phasig umschaltbar
- Wallbox 3 / Halle: 11 kW, `go-e.2`, Seriennummer `220022`
- Leistung Wallbox 3: `alias.0.go-E.go-E-V4-Halle` in kW
- Wallbox 3 ist nicht regelbar und darf nicht veraendert werden
- Morgens sollen Wallbox 1 und 2 auf 1-phasig stehen
- Wallbox 1 und 2 sollen bei angestecktem Fahrzeug aktiviert werden koennen
- Bei Netzbezug darf die Ladung gestoppt werden
- Verifizierte Adapterobjekte fuer Wallbox 1 und 2 sind `allow_charging`, `amperePV`, `phases` und der Fahrzeugstatus `car`
- Vor Verwendung werden fuer diese Steuerobjekte eigene `alias.0`-Objekte benoetigt; direkte `go-e.x`-Objekte werden im Energiemanagement nicht verwendet
- Verbindliche Ladestromvorgabe ist ausschliesslich `amperePV`; `ampere` darf fuer die Ansteuerung nicht verwendet werden
- Bei Wallbox 1 entspricht der spaetere Ladestrom-Alias `go-e.0.amperePV`, bei Wallbox 2 `go-e.1.amperePV`
- `allow_charging`: `0` = aus, `1` = freigegeben
- Phasenumschaltung ausschliesslich per lokaler HTTP-API: `psm=1` fuer 1-phasig und `psm=2` fuer 3-phasig
- HTTP-Basis Wallbox 1 / V3: `http://192.168.11.20`
- HTTP-Basis Wallbox 2 / V4: `http://192.168.11.21`
- MQTT darf fuer die Phasenumschaltung nicht verwendet werden; dieser Steuerweg ist veraltet
- Referenz fuer die bewaehrte Ansteuerung sind die bestehenden Common-Skripte der Familie `go-E_V4`, insbesondere `go-E_V4_Charger_Neu`, `go-E_V4_Phasen`, `go-E_V4_Limits` und `go-E_V4_Verriegelung`

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
   - `httpGet()` fuer die lokale Phasenumschaltung der go-E-Wallboxen
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
