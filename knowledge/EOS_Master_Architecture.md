# EOS Master Architecture

## Zweck

Dieses Dokument konsolidiert das verifizierte architektonische Zielbild des EOS – Energy Operating System. Es ersetzt keine Fachspezifikation. Nicht belegte Punkte bleiben `Unklar`.

## Quellenhierarchie

1. `AGENTS.md`
2. `knowledge/project_brain.md`
3. `knowledge/decisions.md`
4. `knowledge/requirements.md`
5. fuehrende Fachdateien unter `knowledge/` und Spezifikationen unter `docs/`
6. tatsaechlicher Repository-Inhalt

Repositoryinhalt hat Vorrang vor Commitbeschreibungen und Zusammenfassungen.

## Systemgrenze

EOS umfasst die fachliche Koordination und Verdichtung von:

- drei getrennten Zaehlpunkten mit bilanzieller Gesamtsicht,
- zwei Victron-Systemen mit gemeinsamer DC-Batterie,
- Batterie, Netz, PV, Haus, Wallbox und Pool,
- ioBroker als Strategie- und Koordinationsebene,
- Cerbo/Venus OS als Echtzeitregelung,
- MQTT, Modbus, S7, Adapterobjekten und HTTP als Integrationswegen,
- VIS2 als Bedien- und Diagnoseoberflaeche.

GitHub ist die Single Source of Truth fuer den freigegebenen Repository-Stand. ioBroker bleibt das produktive Live-System.

## Architekturprinzipien

- Schutz, Echtzeitregelung, Strategie, Diagnose und Visualisierung bleiben getrennt.
- Hardware-Schutzfunktionen duerfen durch EOS nicht ersetzt werden.
- Cerbo ESS und Cerbo BAT bleiben primaere Echtzeitregler.
- ioBroker koordiniert Strategien, Sollwerte und Limits innerhalb freigegebener Grenzen.
- Node-RED ist Kommunikationsbruecke, nicht fuehrende Entscheidungsinstanz.
- Rohquellen werden in stabilen EOS-States fachlich verdichtet.
- Berechnete EOS-States sind read-only; nur Settings-States duerfen schreibbar sein.
- VIS2 verwendet EOS-States und enthaelt keine Fachlogik.
- Neue Logik entsteht modular unter `iobroker/scripts/energiemanagement/` beziehungsweise `script.js.energiemanagement.*`.
- Der produktionsnahe Altbestand unter `iobroker/scripts/common/` bleibt ohne ausdrueckliche Freigabe unveraendert.
- Ressourcenschonende, ereignisgetriebene Verarbeitung ist zu bevorzugen.
- Unklare Zustaende werden nicht geraten.

## Schichtenmodell

### 1. Physische Anlagen- und Schutzschicht

Sie umfasst Energieanlagen, Messgeraete, Batterie, Wechselrichter, Ladegeraete, Wallboxen, Sensoren und Aktoren.

Verbindliche Rollen:

- Gobel / Pace BMS ist die fuehrende Batterieschutzinstanz.
- SmartShunt ist die fuehrende Quelle fuer Gesamt-SOC, DC-Spannung und Batteriestrom.
- HELTEC dient der Zellspannungsdiagnose und Plausibilisierung.
- Der MPPT RS 450 bleibt strategische DC-PV- und Schwarzstartquelle.

### 2. Echtzeitregelung

Cerbo ESS und Cerbo BAT verantworten lokale Victron-Regelung, hardwareseitige Limits und zeitkritische Betriebsreaktionen. EOS darf strategische Vorgaben liefern, aber keine reservierten Schutz- oder Echtzeitfunktionen uebernehmen.

### 3. Kommunikations- und Integrationsschicht

Dokumentierte Integrationswege:

- Victron- und Venus-OS-Daten ueber MQTT,
- Batterie-Rohdaten ueber Modbus und HELTEC-MQTT,
- Pool-Sensoren und -Aktoren ueber S7,
- go-e-Wallboxen ueber Adapterobjekte und HTTP,
- Node-RED auf den Cerbos als MQTT- und D-Bus-Bruecke.

### 4. ioBroker-Strategie- und Koordinationsebene

ioBroker erfasst und plausibilisiert Quellen, berechnet Fachzustaende, ueberwacht Kommunikation, fuehrt Zaehlpunkte bilanziell zusammen und stellt stabile EOS-States fuer Folgefunktionen und VIS2 bereit.

### 5. EOS-Fachschicht

Die EOS-Fachschicht ist die stabile interne API.

Verbindliche Regeln:

- Rohquellen bleiben Rohquellen.
- Fachliche Verdichtung erfolgt in EOS-Modulen.
- Folgefunktionen verwenden EOS-States statt direkter Rohpfade.
- State-Namen, Rollen und Schreibrechte folgen der fachlichen Bedeutung.
- Freigegebene State-Modelle werden nicht stillschweigend umbenannt.

Aktuell verifizierte Bereiche:

- `0_userdata.0.EOS.Battery.*`
- `0_userdata.0.EOS.EnergyFlow.*`

### 6. Visualisierung

VIS2 ist Anzeige-, Bedien- und Diagnoseoberflaeche, nicht Regelinstanz.

- Keine Fachlogik in VIS2.
- Read-only Ansichten lesen ausschliesslich freigegebene EOS-States.
- Aktorische Bedienung benoetigt eine eigene fachliche Freigabe.
- `battery.html` ist die fuehrende Pflegequelle der Battery-Ansicht.
- `vis-views.json` ist das generierte Exportartefakt.

### 7. Repository und Deployment

Das Repository enthaelt:

- `knowledge/` fuer dauerhafte Architektur- und Wissensbasis,
- `docs/` fuer Spezifikationen, Analysen und Betriebsdokumentation,
- `iobroker/scripts/common/` fuer produktionsnahen Altbestand,
- `iobroker/scripts/energiemanagement/` fuer neue EOS-Module,
- `iobroker/objects/` fuer exportierte Objekte,
- `iobroker/vis-2/` fuer versionierte VIS2-Quellen,
- Deployment- und Verifikationswerkzeuge.

Repository-Aenderungen werden erst durch einen kontrollierten Import- oder Deployment-Schritt im Live-System wirksam.

## Fachdomaenen

### Batterie

Die Batterie ist das primaere Schutz- und Optimierungsziel.

- Keine gezielte Batterieentladung ins Netz.
- Batterieschonung und Versorgungssicherheit haben Vorrang.
- Schwarzstartfaehigkeit darf nicht verschlechtert werden.
- Zellspannungen sind Diagnosewerte und keine alleinige Gesamtregelgroesse.

Freigegebene Module:

- `Battery_Supervisor_V1.js` als nicht-aktorische Communication-Baseline,
- `Battery_Health_V1.js` als separater nicht-aktorischer Health-Baustein,
- Battery VIS2 Read-Only V1 als reine Anzeige.

Battery V1 ist als abgeschlossen dokumentiert.

### Energy Flow

`Energy_Flow_V1.js` ist die erste produktive EOS-Schicht fuer konsolidierte Energiefluesse.

Verifizierter Stand:

- read-only,
- ereignisgetrieben,
- Grid und Battery angebunden,
- PV, House und Wallbox bleiben `UNKNOWN`, bis freigegebene EOS-interne Quellen dokumentiert sind,
- keine Rueckschreibungen in die Batterieebene,
- keine Regelung oder Recommendation.

### Drei-Zaehlpunkt-Bilanz

Das Energiemanagement basiert auf drei getrennten Zaehlpunkten mit bilanzieller Gesamtsicht. Lokale Messwerte und Gesamtbilanz duerfen nicht verwechselt werden. Die genaue formale Abrechnungslogik ausserhalb der dokumentierten Grundlagen bleibt `Unklar`.

### Wallbox und Pool

Wallbox und Pool sind nachrangige, steuerbare Verbraucher.

- Ihr Betrieb darf die Batterieprioritaet nicht unterlaufen.
- Batterieunterstuetzung der Wallbox ist nur innerhalb freigegebener Grenzen zulaessig.
- go-e-, HTTP- und S7-Pfade sind live-nah und sensibel.
- Bedienung, Zeitplaene und fachliche Energieentscheidung bleiben getrennt.

### PV und Erzeugung

- DC-PV und MPPT duerfen nicht unnoetig abgeregelt werden.
- Schonende Tagesladung ist einer unnoetig fruehen Vollladung vorzuziehen.
- Prognosen duerfen keine Schutzfunktionen ersetzen.
- Kuenftige Prognose- und Optimierungsmodule bleiben bis zur Freigabe `Unklar`.

## Daten- und Steuerfluss

```text
Hardware / Adapter / MQTT / Modbus / S7
                |
                v
        Rohdaten und Quellstatus
                |
                v
       EOS-Domaenenmodule in ioBroker
                |
                v
      stabile read-only EOS-States
                |
        +-------+--------+
        |                |
        v                v
 Folgefunktionen       VIS2
```

Der Steuerfluss bleibt getrennt:

```text
EOS-Strategie in ioBroker
          |
          v
freigegebene Settings / Sollwerte / Limits
          |
          v
Kommunikationsbruecken und Cerbo-Schnittstellen
          |
          v
Cerbo-Echtzeitregelung und Hardware-Schutz
          |
          v
reale Aktoren und Energiefluesse
```

Nicht zulaessig sind direkte Aktorik aus read-only Diagnosemodulen, Steuerlogik in VIS2 oder die Umgehung von BMS- und Cerbo-Schutzfunktionen.

## Modulregeln

Jedes neue EOS-Modul benoetigt:

- eindeutig benannte Fachdomaene und Verantwortung,
- definierte Eingangsquellen,
- stabiles State-Modell,
- klare Schreibrechte,
- definierte Kommunikations- und Fehlerzustaende,
- Verweis auf relevante Requirements,
- Abgrenzung zu Hardware-Schutz, Cerbo-Echtzeitregelung und VIS2,
- Abnahmekriterien und Review-Nachweis.

Transport, Fachlogik, Aktorik und Visualisierung sind bewusst zu trennen.

## Fehler- und Kommunikationsmodell

EOS unterscheidet:

- erreichbar und aktuell,
- veraltet,
- offline,
- unplausibel,
- fachlich unbekannt,
- Modulfehler.

`UNKNOWN` ist ein gueltiger fachlicher Zustand und darf nicht durch Schaetzungen ersetzt werden. Fehler einer Quelle machen keine ungesicherte Ersatzquelle automatisch zur fuehrenden Quelle.

## Sicherheits- und Betriebsregeln

Vor live-nahen Aenderungen:

- betroffene Daten- und Steuerpfade identifizieren,
- Backup und Rollback sicherstellen,
- nur den minimal benoetigten Umfang aendern,
- keine Topics, Objekt-IDs, Alias-Pfade, Adapterinstanzen oder Hardware-Zuordnungen raten,
- Verifikation vor und nach Deployment durchfuehren,
- Auswirkungen auf Batterie, Schwarzstart, Netz, Wallbox und Pool pruefen,
- keine Platzhalter oder Scheinimplementierungen committen.

## Freigegebener Stand

Freigegeben und dokumentiert:

- Battery Supervisor V1 Communication-Baseline,
- Battery Health V1,
- Battery VIS2 Read-Only V1,
- Energy Flow V1 Phase 2,
- stabile EOS-State-Ebene als interne Fachschnittstelle,
- ereignisgetriebene Verdichtung als bevorzugtes Muster,
- Trennung von Schutz, Echtzeitregelung, Strategie und Visualisierung.

Der in `knowledge/project_brain.md` dokumentierte letzte freigegebene Commit ist `273b4f13e51b88237c58d7247326eb34cc0b2c89`.

## Offene Architekturgrenzen

Weiterhin `Unklar`:

- naechste freigegebene EOS-Modulgrenze,
- vollstaendiges Sollbild aller kuenftigen Module,
- EOS-interne Quellen fuer PV, House und Wallbox in Energy Flow,
- konkrete Notabschaltungsszenarien,
- kuenftige Prognose- und Optimierungsmodule,
- vollstaendige Abhaengigkeitenkarte des Altbestands,
- formale Prioritaetsregeln je Verbrauchergruppe,
- Detailumfang kuenftiger aktorischer VIS2-Funktionen.

Neue Architekturarbeit beginnt erst nach expliziter fachlicher Freigabe des jeweiligen Punktes.
