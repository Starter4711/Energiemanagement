# Design Principles

## Verbindliche Architekturprinzipien

- Die Batterie ist das wichtigste Asset.
- Versorgungssicherheit und Batterieschonung haben Vorrang vor Eigenverbrauchsmaximierung.
- Cerbo regelt, ioBroker optimiert.
- Node-RED ist Kommunikationsbruecke, keine fuehrende Regelinstanz.
- SmartShunt ist fuehrend fuer Gesamt-SOC, Spannung und Strom.
- Gobel / Pace BMS ist fuehrend fuer Batterieschutz.
- Heltec ist Diagnoseebene fuer Zellspannungen.
- Hardwaregrenzen haben Vorrang vor Optimierungszielen.
- Prognosen duerfen Strategien beeinflussen, aber keine Sicherheitsfunktionen ersetzen.
- Keine gezielte Batterieeinspeisung ins Netz.
- Aenderungen duerfen Schwarzstartfaehigkeit nicht verschlechtern.
- Aenderungen muessen dokumentiert werden.
- Unklare Zustaende duerfen nicht geraten werden.
