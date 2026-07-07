# Requirements

Diese Datei ist die zentrale fachliche Anforderungsquelle fuer das Energiemanagement.
Sie leitet Anforderungen aus den bestehenden Design Principles, der Energiestrategie, der Regelungshierarchie und dem Engineering-Prozess ab.
Wenn ein Punkt nicht sicher belegt ist, ist er als `Unklar` markiert.

## REQ-BAT-PRIMARY-ASSET

- Titel: Batterie als primaeres Schutz- und Optimierungsziel
- Beschreibung: Die Batterie muss als kritischstes gemeinsames Asset behandelt werden. Alle Optimierungs- und Steuerungsentscheidungen muessen ihre Schutz- und Versorgungsrolle beruecksichtigen.
- Begründung: Die Batterie ist die wichtigste Komponente des Systems und dient vor allem Versorgungssicherheit, Schonung und Ersatzstromfaehigkeit.
- Priorität: Kritisch
- Betroffene Komponenten: Gesamtstrategie, ioBroker, Cerbo-Logik, Wallbox- und Ueberschusssteuerung
- Verknüpfte Design Principles: Die Batterie ist das wichtigste Asset; Versorgungssicherheit und Batterieschonung haben Vorrang; Hardwaregrenzen haben Vorrang
- Status: Aktiv

## REQ-BAT-NO-GRID-DISCHARGE

- Titel: Keine gezielte Batterieentladung ins Netz
- Beschreibung: Das System darf keine aktive, gezielte Entladung der Batterie ins Netz als Steuerungsziel vorsehen.
- Begründung: Die Batterie ist nicht als primaeres Einspeiseasset gedacht, sondern als Schutz- und Versorgungsressource.
- Priorität: Kritisch
- Betroffene Komponenten: ESS-Strategie, ioBroker-Sollwerte, Victron-Parameter, Ueberschusslogik
- Verknüpfte Design Principles: Keine gezielte Batterieeinspeisung ins Netz; Versorgungssicherheit und Batterieschonung haben Vorrang
- Status: Aktiv

## REQ-BAT-GENTLE-CHARGING

- Titel: Schonende Tagesladung der Batterie
- Beschreibung: Die Batterie soll bevorzugt ueber den Tag schonend geladen werden. Eine fruehe Vollladung am Morgen soll vermieden werden, soweit die Strategie und die vorhandenen Grenzen das zulassen.
- Begründung: Die Energiestrategie beschreibt eine gezielte, schonende Ladung ueber den Tag statt frueher Volladung.
- Priorität: Hoch
- Betroffene Komponenten: MPPT-Strategie, Victron-Ladeparameter, ioBroker-Optimierung
- Verknüpfte Design Principles: Versorgungssicherheit und Batterieschonung haben Vorrang; Hardwaregrenzen haben Vorrang
- Status: Aktiv

## REQ-BAT-CELL-MONITORING

- Titel: Zellspannungen nur als Diagnoseebene bewerten
- Beschreibung: Zellspannungsdaten duerfen zur Diagnose und Plausibilisierung herangezogen werden, aber nicht die fuehrende Gesamtregelung ersetzen.
- Begründung: Heltec ist als Diagnoseebene fuer Zellspannungen eingeordnet, waehrend SmartShunt und BMS die fuehrenden Batteriequellen bleiben.
- Priorität: Hoch
- Betroffene Komponenten: Diagnose, Monitoring, Batterieanalyse, Dokumentation
- Verknüpfte Design Principles: Heltec ist Diagnoseebene fuer Zellspannungen; SmartShunt ist fuehrend fuer Gesamt-SOC; Gobel / Pace BMS ist fuehrend fuer Batterieschutz
- Status: Aktiv

## REQ-BAT-TEMPERATURE-PROTECTION

- Titel: Temperatur- und Schutzgrenzen der Batterie respektieren
- Beschreibung: Steuerung und Optimierung duerfen die durch die Batterie- und Schutzinstanzen vorgegebenen Temperatur- und Schutzgrenzen nicht unterlaufen.
- Begründung: Hardwaregrenzen und Schutzinstanzen haben Vorrang vor Optimierungszielen.
- Priorität: Kritisch
- Betroffene Komponenten: Batterie-Schutz, Cerbo, ioBroker, Lade- und Entladeparameter
- Verknüpfte Design Principles: Gobel / Pace BMS ist fuehrend fuer Batterieschutz; Hardwaregrenzen haben Vorrang; Prognosen ersetzen keine Sicherheitsfunktionen
- Status: Aktiv

## REQ-MPPT-NO-CURTAILMENT

- Titel: MPPT nicht unnoetig abregeln
- Beschreibung: Die MPPT-Strategie soll die Batterie bevorzugt schonend laden, ohne wegen frueher Max-SOC-Erreichung unguenstig und vermeidbar abzuregeln.
- Begründung: Die Energiestrategie nennt den MPPT RS 450 als strategische DC-PV- und Schwarzstartquelle und verlangt eine schonende Ladung.
- Priorität: Hoch
- Betroffene Komponenten: MPPT-Strategie, Victron-Ladeparameter, ioBroker-Optimierung
- Verknüpfte Design Principles: Aenderungen duerfen Schwarzstartfaehigkeit nicht verschlechtern; Hardwaregrenzen haben Vorrang
- Status: Aktiv

## REQ-MPPT-BLACKSTART

- Titel: Schwarzstartfaehigkeit erhalten
- Beschreibung: Aenderungen an der MPPT- und Lade-Strategie duerfen die Schwarzstartfaehigkeit des Systems nicht verschlechtern.
- Begründung: Der MPPT RS 450 ist als strategische DC-PV- und Schwarzstartquelle beschrieben und darf in dieser Rolle nicht geschwaecht werden.
- Priorität: Kritisch
- Betroffene Komponenten: MPPT RS 450, Ladestrategie, Victron-Systeme, Dokumentation
- Verknüpfte Design Principles: Aenderungen duerfen Schwarzstartfaehigkeit nicht verschlechtern; Hardwaregrenzen haben Vorrang
- Status: Aktiv

## REQ-ESS-CERBO-REALTIME-CONTROL

- Titel: Cerbo bleibt Echtzeitregler
- Beschreibung: Cerbo ESS und Cerbo BAT muessen die primaere Echtzeitregelung behalten. ioBroker darf Strategien, Sollwerte und Limits setzen, aber keine lokalen Schutz- und Echtzeitfunktionen ersetzen.
- Begründung: Die Regelungshierarchie ordnet Cerbo als primaeren Echtzeitregler ein und ioBroker als Strategie- und Limitgeber.
- Priorität: Kritisch
- Betroffene Komponenten: Cerbo ESS, Cerbo BAT, ioBroker, MQTT, Victron-Parameter
- Verknüpfte Design Principles: Cerbo regelt, ioBroker optimiert; Hardwaregrenzen haben Vorrang; Prognosen ersetzen keine Sicherheitsfunktionen
- Status: Aktiv

## REQ-IOB-STRATEGY-LAYER

- Titel: ioBroker als Strategie- und Koordinationsebene
- Beschreibung: ioBroker darf Sollwerte, Limits und strategische Parameter bereitstellen, muss dabei aber die fuer Hardware und Cerbo reservierten Echtzeit- und Schutzfunktionen respektieren.
- Begründung: Die Regelungshierarchie beschreibt ioBroker als Optimierungs- und Koordinationsebene.
- Priorität: Hoch
- Betroffene Komponenten: ioBroker, Strategiemodule, MQTT, Victron-Ansteuerung
- Verknüpfte Design Principles: Cerbo regelt, ioBroker optimiert; Node-RED ist Kommunikationsbruecke; Hardwaregrenzen haben Vorrang
- Status: Aktiv

## REQ-WB-PV-PRIORITY

- Titel: PV vor Wallbox, aber batteriegesteuert
- Beschreibung: Die Wallbox soll PV-gestuetzt bedient werden, ohne die Prioritaet der Batterie als Schutz- und Versorgungsressource zu unterlaufen.
- Begründung: Die Energiestrategie benennt die Batterie nicht als primaere Ressource fuer E-Autos und die Batterie soll vor aggressiver Verbrauchsoptimierung geschuetzt werden.
- Priorität: Mittel
- Betroffene Komponenten: Wallbox-Logik, PV-Ueberschusssteuerung, ioBroker, Lastmanagement
- Verknüpfte Design Principles: Versorgungssicherheit und Batterieschonung haben Vorrang; Die Batterie ist das wichtigste Asset
- Status: Aktiv

## REQ-WB-BATTERY-SUPPORT-LIMIT

- Titel: Batterieunterstuetzung fuer Wallbox begrenzen
- Beschreibung: Eine Batterieunterstuetzung der Wallbox ist nur als konfigurierbarer Einstellwert und nur bis zu einem definierten SOC-Rahmen zulässig.
- Begründung: Die Energiestrategie nennt Batterieentladung zur Wallbox-Unterstuetzung als konfigurierbaren Einstellwert bis zu definiertem SOC.
- Priorität: Mittel
- Betroffene Komponenten: Wallbox-Steuerung, SOC-Schwellen, ioBroker, Nutzerparameter
- Verknüpfte Design Principles: Versorgungssicherheit und Batterieschonung haben Vorrang; Hardwaregrenzen haben Vorrang
- Status: Aktiv

## REQ-POOL-PV-SURPLUS-CONSUMER

- Titel: Pool als PV-Ueberschussverbraucher
- Beschreibung: Poolpumpe und Pool-Waermepumpe werden als steuerbare PV-Ueberschussverbraucher behandelt und duerfen nur innerhalb der strategischen Rahmenbedingungen betrieben werden.
- Begründung: Diese Verbraucher sind in der Energiestrategie als aktuell steuerbare PV-Ueberschussverbraucher beschrieben.
- Priorität: Mittel
- Betroffene Komponenten: Poolsteuerung, S7 / LOGO, ioBroker, Ueberschusslogik
- Verknüpfte Design Principles: Versorgungssicherheit und Batterieschonung haben Vorrang; Hardwaregrenzen haben Vorrang
- Status: Aktiv

## REQ-DOC-TRACEABILITY

- Titel: Nachvollziehbare Dokumentation mit Requirements-Referenzen
- Beschreibung: Relevante Features und Aenderungen sollen kuenftig auf Anforderungen verweisen und ihre fachliche Herleitung dokumentieren.
- Begründung: Die Knowledge Base und der Engineering-Prozess verlangen dokumentierte Aenderungen und nachvollziehbare Entscheidungen.
- Priorität: Hoch
- Betroffene Komponenten: Knowledge Base, Changelog, Entscheidungen, Feature-Dokumentation
- Verknüpfte Design Principles: Aenderungen muessen dokumentiert werden; Unklare Zustaende duerfen nicht geraten werden
- Status: Aktiv

## REQ-BACKUP-BEFORE-LIVE-CHANGE

- Titel: Backup vor live-naher Aenderung
- Beschreibung: Vor live-nahen oder produktiven Aenderungen muss ein belastbarer Backup- und Rollback-Zustand vorhanden sein.
- Begründung: Der Engineering-Prozess und die AGENTS-Regeln machen Backup und Rollback zur Pflicht vor Live-Aenderungen.
- Priorität: Kritisch
- Betroffene Komponenten: Deployment-Prozess, ioBroker, Betrieb, Dokumentation
- Verknüpfte Design Principles: Aenderungen muessen dokumentiert werden; Unklare Zustaende duerfen nicht geraten werden
- Status: Aktiv

## REQ-LOGGING-SWITCHABLE

- Titel: Logging schaltbar halten
- Beschreibung: Neue produktive Skripte sollen eine zuschaltbare Logebene bereitstellen.
- Begründung: Der Projektstandard verlangt eine schaltbare Logebene fuer neue produktive Skripte.
- Priorität: Mittel
- Betroffene Komponenten: Neue Skripte, Runtime-Logging, Betrieb, Diagnose
- Verknüpfte Design Principles: Aenderungen muessen dokumentiert werden; Ressourcenschonung ist eine verbindliche Architekturregel
- Status: Aktiv

## REQ-STRATEGY-SEASONAL-SWITCH

- Titel: Saisonale Strategie nur mit gesicherter Logik
- Beschreibung: Sommer- und Winterstrategie duerfen voneinander abweichen, aber operative Umschaltkriterien muessen gesichert dokumentiert sein, bevor sie als verbindlich gelten.
- Begründung: Die Energiestrategie benennt saisonale Unterschiede, macht die konkreten Umschaltkriterien jedoch noch nicht sicher.
- Priorität: Mittel
- Betroffene Komponenten: Strategie-Logik, Prognosebezug, Betriebsregeln
- Verknüpfte Design Principles: Unklare Zustaende duerfen nicht geraten werden; Prognosen duerfen Strategien beeinflussen, aber keine Sicherheitsfunktionen ersetzen
- Status: Unklar

## REQ-FORECAST-ONLY-ADVISORY

- Titel: Prognosen nur als Advisory nutzen
- Beschreibung: Prognosen duerfen strategische Entscheidungen beeinflussen, aber keine Sicherheitsfunktionen oder fuehrende Schutzreaktionen ersetzen.
- Begründung: Die bestehenden Leitdokumente erlauben Prognosebezug, grenzen ihn aber klar gegen Sicherheitsfunktionen ab.
- Priorität: Hoch
- Betroffene Komponenten: Prognose-Logik, Strategie, Ladeplanung, Verbrauchssteuerung
- Verknüpfte Design Principles: Prognosen duerfen Strategien beeinflussen, aber keine Sicherheitsfunktionen ersetzen; Unklare Zustaende duerfen nicht geraten werden
- Status: Aktiv

