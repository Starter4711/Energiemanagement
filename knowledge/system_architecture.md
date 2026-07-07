# System Architecture

## Zweck

Diese Datei ist die kompakte Architekturuebersicht des Gesamtsystems.
Sie verbindet die Knowledge Base mit den technischen Referenzdokumenten, ohne technische Bestandsdaten zu duplizieren.

## Architekturdiagramm

```text
                         +----------------------+
                         |  GitHub / Knowledge  |
                         |  Base / docs / KB    |
                         +----------+-----------+
                                    |
                                    v
                        +-----------+-----------+
                        |   ChatGPT / Codex     |
                        |   Analyse / Doku      |
                        +-----------+-----------+
                                    |
                                    v
+------------------+       +-------+---------+       +------------------+
|  ioBroker        |<----->|      MQTT       |<----->| Victron ESS      |
|  Scripts / VIS2  |       +-------+---------+       | Victron BAT      |
+--------+---------+               |                 +--------+---------+
         |                         |                          |
         |                         |                          |
         v                         v                          v
 +-------+--------+       +--------+---------+       +--------+---------+
 | VIS2           |       | Venus-Gateway    |       | Gobel / Pace     |
 | Bedienung      |       | Messdaten        |       | Batterie-BMS     |
 +-----------------+       +------------------+       +------------------+
         ^
         |
 +-------+---------+
 | Heltec /        |
 | Raspberry Pi 4  |
 +-----------------+
```

## Hauptkomponenten

- GitHub / Knowledge Base: dauerhafte Dokumentation, Entscheidungen und Referenzen
- ChatGPT / Codex: Analyse-, Pflege- und Dokumentationsinstanz
- ioBroker: Live-Skripte, Datenpunkte, Steuerlogik und VIS-2-Anbindung
- MQTT: Transport fuer Victron-, Venus- und Balancer-Daten
- Victron ESS: Echtzeitregelung fuer das Haus
- Victron BAT: Echtzeitregelung fuer die Halle
- Venus-Gateway: Mess- und Datendrehscheibe fuer den dritten Zaehlpunkt
- Gobel / Pace: Batterie- und Schutzinstanz
- Heltec / Raspberry Pi 4: Zellspannungs- und Balancerquelle
- VIS2: Bedien- und Visualisierungsebene

## Hauptdatenfluesse

1. Messdaten kommen von Victron, EM24, Gobel/Pace und Heltec beziehungsweise dem Venus-Gateway.
2. ioBroker sammelt, aliasiert und bewertet diese Daten fuer Steuerung und Visualisierung.
3. MQTT transportiert die fuer Victron-nahe Systeme und Balancer relevanten Werte.
4. VIS2 zeigt verdichtete Betriebszustände fuer Bedienung und Diagnose.
5. GitHub und die Knowledge Base halten den dokumentierten Stand fest.

## Regelungshierarchie

- Die Hardware und ihre Schutzlogik gehen vor.
- Victron ESS und BAT fuehren die Echtzeitregelung.
- ioBroker bildet Strategie, Verdichtung und koordinierte Sollwerte ab.
- MQTT und Node-RED sind Transport- oder Brueckenebenen, nicht die eigentliche Fuehrungsinstanz.
- VIS2 ist Anzeige und Bedienung, nicht Regelkern.

## Verweise

- [knowledge/hardware_topology.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/knowledge/hardware_topology.md)
- [knowledge/battery_architecture.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/knowledge/battery_architecture.md)
- [knowledge/victron_venus_structure.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/knowledge/victron_venus_structure.md)
- [knowledge/control_hierarchy.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/knowledge/control_hierarchy.md)
- [knowledge/energy_strategy.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/knowledge/energy_strategy.md)
- [knowledge/design_principles.md](/Users/richardnussdorfer/Documents/Codex/2026-07-05/ist-es-m-glich-mit-dir/knowledge/design_principles.md)
