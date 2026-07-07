# Batteriearchitektur

## Zweck

Diese Datei dokumentiert die gemeinsame Batteriearchitektur, ihre Rollenverteilung und die bekannten Diagnose- und Schutzebenen.

## Grundaufbau

- Es gibt eine gemeinsame DC-Batterieanlage fuer Cerbo ESS und Cerbo BAT.
- Beide Victron-Systeme haengen DC-seitig zusammen.
- Aufbau:
  - Victron ESS und Victron BAT
  - SmartShunt
  - Victron Lynx
  - vier Gobel-Packs parallel

## Fachliche Rollen

- SmartShunt ist fuehrende Quelle fuer Gesamt-SOC, DC-Spannung und Batteriestrom.
- Gobel / Pace BMS ist fuehrende Schutzinstanz der Batterie.
- Heltec dient der Zellspannungsdiagnose.
- Die Batterie ist die wichtigste Komponente des Gesamtsystems.

## Gobel-Packs

- `4` identische Packs
- Typ: `Gobel Power GP-SR1-PC200`
- `51,2 V`
- `280 Ah`
- `15 kWh` je Pack
- Gesamt: `60 kWh`
- Zellchemie: `LiFePO4 / Hithium`
- `16` Zellen pro Pack
- Normalspannung ca. `53 bis 54,4 V`
- Balancing bis `55,2 V`
- BMS: `Pace PC200`
- Urspruengliche Stromwerte: `140/200 A`
- Reduziert auf `100/150 A` je Pack

## Pack-Nomenklatur

- Gobel-Master = `modbus.1.holdingRegisters.1` = `mqtt.0.HELTEC_1`
- Gobel-Slave-1 = `modbus.1.holdingRegisters.2` = `mqtt.0.HELTEC_2`
- Gobel-Slave-2 = `modbus.1.holdingRegisters.3` = `mqtt.0.HELTEC_3`
- Gobel-Slave-3 = `modbus.1.holdingRegisters.4` = `mqtt.0.HELTEC_4`

## BMS- und Balancer-Kommunikation

- Gobel / Pace CAN direkt zum Cerbo ESS
- Cerbo BAT bekommt Batteriedaten nicht direkt ueber CAN, sondern ueber MQTT / SerialBattery
- Pace CAN ueber Umsetzer auf `modbus.1`
- `modbus.1` enthaelt die vier Packs unter `holdingRegisters.1` bis `.4`
- Je Pack ein Heltec Balancer
- Heltec per Bluetooth an Raspberry Pi 4
- Raspberry Pi 4 sendet Heltec-Daten per `mqtt.0` an ioBroker

## Ueberwachungsziele

- Zellspannungen ueberwachen
- Zellspannungsdifferenzen ueberwachen
- Temperaturen ueberwachen
- Bei Auffaelligkeiten Leistung fuer Laden und Entladen reduzieren

## Risiken

- Kommunikationsausfaelle zwischen BMS, Heltec, Raspberry Pi, MQTT oder ioBroker sind als Risiko zu behandeln.
- Falsche Pack-Zuordnungen verfaelschen Zellspannungsdiagnose und Vergleichslogik.
- Der Gobel-SOC ist nicht als fuehrende Gesamtgroesse zu verwenden.

## Offene Punkte

- Notabschaltungsszenarien muessen definiert werden.
- Detaillierte Eskalationslogik bei Kommunikationsausfall ist `Unklar`.
