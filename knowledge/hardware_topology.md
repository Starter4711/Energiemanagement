# Hardware-Topologie

## Zweck

Diese Datei dokumentiert die physische und logische Topologie der Gesamtanlage auf Basis der heute festgehaltenen Architektur- und Hardwareerkenntnisse.

## Gesamtanlage

- Es gibt drei Netzanschluesse beziehungsweise Zaehlpunkte:
  1. Wohnung / altes Haus
  2. Haus / neues Haus
  3. Halle
- Alle drei Zaehlpunkte sind in einem Verein / Energiegemeinschaftsmodell saldiert.
- Einspeisung und Bezug werden rechnerisch ueber die Zaehlpunkte gegengerechnet.
- Einspeisung wird ueber OeMAG verrechnet.

## Zaehlpunkt 1: Wohnung / altes Haus

- EM24 `old Grid`
- SolarEdge 17 kW Wechselrichter
- 22,4 kWp PV Ost/West
- Keine Batterie
- Kein Victron ESS

## Zaehlpunkt 2: Haus / neues Haus

- EM24 `new Grid`
- Victron ESS 3-phasig
- Cerbo ESS
- IP `192.168.0.191`
- VRM-ID `c0619ab336ed`
- MQTT in ioBroker: `mqtt.1`
- `3x MultiPlus-II 5000 3P` mit Bezeichnung `ESS`
- SmartShunt direkt angeschlossen
- Gobel CAN / VE.Can direkt angeschlossen
- EM24 New Grid direkt angeschlossen
- SMA WR 5 kWp Sued am AC OUT
- Fronius 10 kW / 15,575 kWp Ost-West am AC OUT
- Gesamtes Haus am AC OUT
- MPPT RS 450 mit 5,76 kWp direkt DC-seitig am Lynx

## Zaehlpunkt 3: Halle

- EM24 `Hall Grid`
- Cerbo BAT
- IP `192.168.0.195`
- VRM-ID `c0619ab4bea6`
- MQTT in ioBroker: `mqtt.2`
- `3x MultiPlus-II 5000 3P` mit Bezeichnung `BAT`
- MQTT Battery / SerialBattery
- Fronius 27 kW / 33 kWp Sued
- go-e Wallbox 3 mit 11 kW vor EM24 40A
- EM24 40A 3P misst den Abgang zur 100-m-Leitung

Hinter der 100-m-Leitung haengen parallel:

- go-e Wallbox 2 mit 22 kW
- go-e Wallbox 1 mit 11 kW
- 3-phasige Poolpumpe
- 1-phasige Pool-Waermepumpe
- Victron ESS `BAT`

## Venus-Gateway

- Dokumentationsname: `Venus-Gateway`
- Raspberry Pi vermutlich `2B+`
- Standort Haus
- IP `192.168.0.153`
- Venus OS `v3.66`
- VRM-ID `b827eb7fd855`
- MQTT in ioBroker: `mqtt.3`
- Aufgabe: Mess- und Daten-Gateway
- Alle EM24 sind per Modbus TCP angebunden

Erfasst werden:

- EM24 Old Grid
- EM24 40A
- SolarEdge per Modbus TCP

Hinweis:

- Node-RED koennte dort laufen, wird dort aber nicht benutzt.

## Topologische Kernaussage

- Die Gesamtanlage ist ein Drei-Zaehlpunkt-System mit gemeinsamer bilanzieller Betrachtung.
- Haus und Halle sind ueber eine gemeinsame DC-Batteriearchitektur fachlich gekoppelt.
- Das Venus-Gateway ergaenzt die Victron-Systeme als Mess- und Datendrehscheibe fuer den dritten Zaehlpunkt und weitere externe Messwerte.

## Unklar

- Der Raspberry Pi ist vermutlich `2B+`; dies ist als `Unklar` zu behandeln, solange keine belastbarere Quellenbestaetigung dokumentiert ist.
