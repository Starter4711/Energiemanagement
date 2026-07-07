# Regelungshierarchie

## Zweck

Diese Datei beschreibt die fuehrende Regelungs- und Verantwortungshierarchie des Systems.

## Grundhierarchie

1. Hardwaregrenzen und Schutzinstanzen
2. Cerbo ESS und Cerbo BAT als primaere Echtzeitregler
3. ioBroker als Strategie-, Sollwert- und Limitgeber
4. MQTT als Transport
5. Node-RED als Kommunikationsbruecke
6. VIS2 als Bedienung und Visualisierung

## Rollen im Detail

### Schutz- und Hardwareebene

- Hardwaregrenzen haben Vorrang vor Optimierungszielen.
- Gobel / Pace BMS ist fuehrende Schutzinstanz der Batterie.
- SmartShunt ist fuehrende Quelle fuer Gesamt-SOC, Spannung und Strom.

### Victron-Echtzeitregelung

- Cerbo ESS und Cerbo BAT bleiben primaere Echtzeitregler.
- Sie setzen den unmittelbaren Betrieb der Victron-Systeme um.

### ioBroker-Ebene

- ioBroker setzt Strategie, Sollwerte, Limits und Parameter.
- ioBroker ist Optimierungs- und Koordinationsebene, nicht Ersatz fuer lokale Schutz- und Regelfunktionen.

### Node-RED-Ebene

- Node-RED laeuft auf den Cerbos im Venus OS Large Image.
- Node-RED ist Kommunikationsbruecke, keine fuehrende Entscheidungsinstanz.
- Node-RED schreibt per MQTT vom ioBroker empfangene Werte auf Cerbo-, D-Bus- und Victron-Parameter.

### Bedien- und Beobachtungsebene

- VIS2 ist Bedienung und Visualisierung.

## Folgerungen fuer die Architektur

- Sicherheitsfunktionen duerfen nicht von Prognosen oder Komfortlogik abhaengen.
- Strategische Optimierung darf die lokalen Schutzfunktionen nicht aushebeln.
- Aenderungen an MQTT-, D-Bus- oder Sollwertpfaden muessen die Rollenverteilung respektieren.

## Unklar

- Detaillierte Rangfolge einzelner Schutzreaktionen bei kombinierten Stoerungsfaellen ist `Unklar`.
