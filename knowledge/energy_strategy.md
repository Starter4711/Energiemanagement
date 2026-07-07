# Energiestrategie

## Zweck

Diese Datei dokumentiert die heute festgehaltene Energie- und Batteriestrategie als fachlichen Rahmen fuer kuenftige Automatisierung und Optimierung.

## Strategische Grundsaetze

- Die Batterie ist die wichtigste Komponente des Systems.
- Die Batterie dient hauptsaechlich zur Versorgung des Hauses und zur Ersatzstromfaehigkeit.
- Die Batterie ist nicht primaer zum Laden von Pool oder E-Autos vorgesehen.
- Die Batterie darf niemals gezielt ins Netz entladen werden.

## Batterie- und Ladephilosophie

- Batterieentladung zur Wallbox-Unterstuetzung ist ein konfigurierbarer Einstellwert bis zu definiertem SOC.
- MultiPlus-Ladung soll nur bis Mindest-SOC erfolgen, aktuell beispielhaft `40 %`.
- Max-SOC ist aktuell beispielhaft `80 %`.
- MPPT soll oberhalb Mindest-SOC bevorzugt bis Max-SOC laden.
- Die Batterie soll nicht morgens mit voller Leistung geladen werden und bereits ab `11:00` voll sein.
- Ziel ist eine gezielte, schonende Ladung ueber den Tag.

## MPPT-Strategie

- MPPT RS 450 ist strategische DC-PV- und Schwarzstartquelle.
- MPPT soll die Batterie bevorzugt schonend laden, ohne wegen Max-SOC frueh unguenstig abzuregeln.
- MPPT darf nicht aktiv ueber Victron ESS ins Netz druecken.

## Saisonale Strategie

- Sommer- und Winterstrategie unterscheiden sich stark.

## Aktuelle steuerbare Verbraucher

- Poolpumpe
- Pool-Waermepumpe

Diese sind aktuell steuerbare PV-Ueberschussverbraucher.

## Prognosebezug

- Tagesprognose soll kuenftig Ladeverhalten beeinflussen.
- Wetter- beziehungsweise PV-Prognose ist aktuell noch nicht vorhanden.
- Erwarteter MPPT-Tagesertrag wird aktuell noch nicht berechnet.

## Schutzbezug

- Versorgungssicherheit und Batterieschonung haben Vorrang vor Eigenverbrauchsmaximierung.
- Prognosen duerfen Strategien beeinflussen, aber keine Sicherheitsfunktionen ersetzen.

## Unklar

- Konkrete operative Umschaltkriterien zwischen Sommer- und Winterstrategie sind `Unklar`, soweit sie nicht anderweitig bereits in laufender Logik dokumentiert sind.
