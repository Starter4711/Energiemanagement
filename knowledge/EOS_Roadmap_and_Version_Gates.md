# EOS Roadmap and Version Gates

## Zweck

Dieses Dokument definiert die verbindliche Reihenfolge fuer weitere EOS-Arbeit, die Versionsgrenzen und die Freigabegates fuer neue Codex-Auftraege. Es leitet keine automatische Implementierungsfreigabe ab. Nicht belegte Details bleiben `Unklar`.

## Grundprinzip

EOS wird nicht als grosser Gesamtumbau entwickelt, sondern in kleinen, fachlich geschlossenen und einzeln pruefbaren Versionen.

Jede Version benoetigt vor Implementierung:

1. klar benannte Fachdomaene,
2. fachlichen Zweck,
3. Requirements-Zuordnung,
4. Architekturentscheidung,
5. Eingangsquellen und Fuehrungsrollen,
6. State-Modell,
7. Abgrenzung zu Schutz, Echtzeitregelung und anderen Modulen,
8. Sicherheits- und Fehlerkonzept,
9. Test- und Abnahmekriterien,
10. Deployment- und Rollbackweg,
11. ausdrueckliche Freigabe fuer Codex.

Ohne diese Punkte darf kein Implementierungsauftrag erzeugt werden.

## Statusmodell

- `Abgeschlossen`: implementiert, technisch geprueft, fachlich freigegeben und dokumentiert.
- `Freigegeben fuer Umsetzung`: Spezifikation und Abnahmekriterien sind vollstaendig; Codex darf implementieren.
- `In Klaerung`: Architektur- oder Quelldetails sind noch offen.
- `Zielbild – nicht freigegeben`: langfristig vorgesehen, aber noch nicht implementierbar.
- `Zurueckgestellt`: bewusst nicht aktuell priorisiert.
- `Verworfen`: soll nicht umgesetzt werden.

## Verifizierter Ausgangsstand

### Battery V1

Status: `Abgeschlossen`

Umfang:

- Battery Supervisor V1 Communication-Baseline,
- Battery Health V1,
- Battery VIS2 Read-Only V1,
- stabile State-Ebene unter `0_userdata.0.EOS.Battery.*`,
- keine Aktorik.

### Energy Flow V1 Phase 2

Status: `Abgeschlossen` fuer den freigegebenen Umfang

Umfang:

- read-only,
- ereignisgetrieben,
- Grid und Battery angebunden,
- PV, House und Wallbox weiterhin `UNKNOWN`,
- keine Recommendation,
- keine Regelung.

## Verbindliche naechste Reihenfolge

### Gate 1: Dokumentationskonsolidierung

Status: `In Arbeit`

Ziel:

- Masterarchitektur,
- Modulabhaengigkeiten,
- Kommunikationsmatrix,
- Schnittstellenvertrag,
- Fehler- und Recovery-Konzept,
- Deployment-, Release- und Rollbackprozess,
- Test- und Abnahmestrategie,
- Traceability,
- Roadmap und Versionsgates,
- konsistente Verweise in `knowledge/project_brain.md`, `knowledge/README.md`, `knowledge/modules.md`, `knowledge/roadmap.md` und `CHANGELOG.md`.

Abschlusskriterium:

- alle neuen Architekturdateien sind in der Knowledge Base verlinkt,
- Widersprueche und veraltete Commitreferenzen sind bereinigt,
- offene Punkte sind eindeutig als `Unklar` oder `Zielbild – nicht freigegeben` markiert.

### Gate 2: Energy Flow V1 vervollstaendigen

Status: `In Klaerung`

Ziel:

- freigegebene EOS-interne Quellen fuer PV, House und Wallbox bestimmen,
- Signalkonventionen und Bilanzregeln bestaetigen,
- State-Modell und Spezifikation erweitern,
- weiterhin read-only und ereignisgetrieben bleiben.

Vor Codex zwingend zu klaeren:

- exakte Quellstates,
- Fuehrungsquelle je Domaene,
- Vorzeichenkonvention,
- Aktualitaets- und Timeoutregeln,
- Verhalten bei Teilverfuegbarkeit,
- Verifikation gegen reale ioBroker-Werte.

### Gate 3: Energy Flow VIS2 Read-Only

Status: `Zielbild – nicht freigegeben`

Voraussetzung:

- Gate 2 fachlich abgeschlossen,
- stabile Energy-Flow-State-Struktur,
- keine direkte Nutzung von Rohquellen,
- keine Bedien- oder Steuerlogik.

### Gate 4: Generation V1

Status: `Zielbild – nicht freigegeben`

Moeglicher Umfang:

- AC-PV,
- DC-PV,
- MPPT,
- Erzeugerkommunikation,
- read-only Verdichtung.

Nicht Teil von V1:

- Prognose,
- Optimierung,
- Abregelungssteuerung,
- aktorische Sollwerte.

### Gate 5: Consumption V1

Status: `Zielbild – nicht freigegeben`

Moeglicher Umfang:

- Hausverbrauch,
- Hallenverbrauch,
- Poolverbrauch,
- Wallboxverbrauch,
- sonstige priorisierte Verbraucher,
- read-only Verdichtung.

### Gate 6: Wallbox Coordination V1

Status: `Zielbild – nicht freigegeben`

Voraussetzungen:

- Energy Flow und Consumption liefern stabile EOS-States,
- Batterieprioritaet und SOC-Grenzen sind formal beschlossen,
- alle go-e- und HTTP-Schreibpfade sind vollstaendig dokumentiert,
- Fallback, Quittierung und Rollback sind definiert.

### Gate 7: Pool Coordination V1

Status: `Zielbild – nicht freigegeben`

Voraussetzungen:

- Pool-Zeitplaene, Temperaturbedingungen und Ueberschusskriterien sind getrennt dokumentiert,
- S7-/LOGO-Schreibpfade sind vollstaendig verifiziert,
- manuelle Bedienung und automatische Strategie sind konfliktfrei geregelt.

### Gate 8: Notification V1

Status: `Zielbild – nicht freigegeben`

Umfang:

- Meldungen aus freigegebenen EOS-Zustaenden,
- Prioritaets- und Quittierungsmodell,
- keine Schutzfunktion,
- keine automatische Aktorik.

### Gate 9: Historian Integration V1

Status: `Zielbild – nicht freigegeben`

Ziel:

- definierte Uebergabe ausgewaehlter EOS-States an vorhandene Historisierung,
- keine unkontrollierte Doppelhaltung,
- klare Aufbewahrungs- und Abtastraten.

### Gate 10: Forecast und Optimizer

Status: `Zurueckgestellt`

Voraussetzungen:

- stabile Datenqualitaet,
- abgeschlossene Domaenenmodule,
- belastbare Historisierung,
- Schutz- und Prioritaetsregeln vollstaendig formalisiert.

Forecast und Optimizer duerfen niemals Hardware-Schutz, BMS oder Cerbo-Echtzeitregelung ersetzen.

## Versionsregeln

### V1

- kleinster fachlich nutzbarer Umfang,
- eindeutige Verantwortung,
- stabile States,
- bevorzugt read-only,
- keine unnoetigen Abhaengigkeiten,
- vollstaendige Dokumentation und Verifikation.

### V2

Nur zulaessig, wenn:

- V1 abgeschlossen und stabil ist,
- reale Betriebsdaten einen konkreten Erweiterungsbedarf belegen,
- bestehende State-Vertraege kompatibel bleiben oder eine Migration dokumentiert wird.

### V3 und spaeter

Nur fuer Funktionen, die:

- mehrere abgeschlossene Domaenen koordinieren,
- dokumentierte Fallbacks besitzen,
- keinen monolithischen EOS-Core erzeugen,
- weiterhin modular getestet und zurueckgerollt werden koennen.

## Codex-Auftragsgate

Ein Codex-Auftrag darf erst ausgegeben werden, wenn er mindestens enthaelt:

1. exakten Repository- und Branchbezug,
2. zu lesende Pflichtdateien,
3. exakt erlaubten Arbeitsumfang,
4. verbotene Erweiterungen,
5. konkrete Dateien oder Pfade,
6. fachliche Regeln und State-Vertraege,
7. Sicherheits- und Ressourcenanforderungen,
8. geforderte Pruefungen,
9. Dokumentationspflichten,
10. Commit- und Pushpflicht,
11. exakt erwartete Abschlussmeldung.

## Review-Gate nach Codex

Nach jedem Codex-Commit:

1. Commit und tatsaechlichen Diff lesen,
2. jede geaenderte Datei vollstaendig pruefen,
3. gegen Auftrag, Requirements, Entscheidungen und State-Modell vergleichen,
4. technische Checks kontrollieren,
5. Entscheidung treffen: `Freigeben` oder `Korrektur erforderlich`,
6. bei Freigabe dauerhaften Projektkontext aktualisieren,
7. erst danach den naechsten Codex-Auftrag definieren.

## Aktuelle Architekturentscheidung

Nach Abschluss der Dokumentationskonsolidierung ist der naechste fachliche Kandidat die Klaerung und anschliessende read-only Vervollstaendigung von Energy Flow V1 fuer PV, House und Wallbox.

Dies ist noch keine Implementierungsfreigabe. Vorher muessen die realen ioBroker-Quellen und Signalkonventionen direkt verifiziert werden.
