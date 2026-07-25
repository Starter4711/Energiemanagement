# EOS Master Architecture

## Zweck

Dieses Dokument konsolidiert das verifizierte architektonische Zielbild des EOS – Energy Operating System. Es ersetzt keine Fachspezifikation. Nicht belegte Punkte bleiben `Unklar`.

## Dokumentationsentscheidung

Dieses Masterdokument bildet zwei klar getrennte Ebenen ab:

1. den fachlich freigegebenen und im Repository belegten Ist-Stand,
2. die langfristige Zielarchitektur als strukturellen Orientierungsrahmen.

Die Zielarchitektur ist keine Implementierungsfreigabe. Geplante, aber noch nicht spezifizierte oder freigegebene Module werden ausdrücklich als `Zielbild – nicht freigegeben` gekennzeichnet. Aus ihrer Nennung darf weder ein Codex-Auftrag noch eine technische Umsetzung abgeleitet werden.

Damit bleibt das Dokument vollständig genug für langfristige Architekturarbeit, ohne offene Punkte als bereits beschlossen darzustellen.

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

## Zielarchitektur – nicht freigegeben

Die folgenden Bausteine bilden den langfristigen strukturellen Orientierungsrahmen. Sie sind weder implementiert noch automatisch zur Umsetzung freigegeben.

### Domaenenmodule

- Battery: Schutznahe Verdichtung, Kommunikation, Health und spaetere freigegebene Betriebsbewertung.
- Energy Flow: Vollstaendige read-only Gesamtsicht auf Grid, PV, Battery, House und Wallbox.
- Generation: Konsolidierung von AC-PV, DC-PV, MPPT und Erzeugerstatus.
- Consumption: Fachliche Verdichtung von Haus-, Hallen-, Pool- und sonstigen Verbrauchern.
- Wallbox: Batterie- und PV-bewusste Koordination innerhalb expliziter Grenzen.
- Pool: Zeit-, Temperatur- und Ueberschusskoordination unter Beruecksichtigung der Gesamtstrategie.

### Querschnittsmodule

- Communication: Einheitliche Erreichbarkeits-, Alters- und Fehlerbewertung aller EOS-Quellen.
- Health: Nicht-aktorische Zustandsbewertung je Domaene.
- Historian: Standardisierte Uebergabe relevanter EOS-Zustaende an bestehende Historisierung; keine Doppelhaltung ohne fachlichen Grund.
- Notification: Ableitung priorisierter Meldungen aus freigegebenen Fachzustaenden, ohne Schutzfunktionen zu ersetzen.
- Scheduler: Koordination freigegebener Zeitplaene; keine Vermischung mit Echtzeitregelung.
- Forecast: Wetter-, PV- oder Lastprognosen als optionale Entscheidungshilfe, niemals als Sicherheitsinstanz.
- Optimizer: Langfristig moegliche Strategieoptimierung unter zwingendem Vorrang von Batterie, Schutz, Versorgungssicherheit und Hardwaregrenzen.

### Zielregeln

- Jedes Zielmodul benoetigt vor Umsetzung eine eigene Spezifikation, Requirements-Zuordnung, State-Modell, Sicherheitsabgrenzung und ausdrueckliche Freigabe.
- Aktorische Module duerfen nur ueber kontrollierte Settings-, Sollwert- und Limitpfade wirken.
- Read-only Module duerfen keine Aktoren schreiben.
- Historisierung, Prognose und Optimierung bleiben von Schutz und Echtzeitregelung getrennt.
- VIS2 darf Zielmodule darstellen und konfigurieren, aber keine eigenstaendige Fachentscheidung treffen.
- Bestehende externe Infrastruktur wie InfluxDB oder Grafana ist nur dann EOS-Bestandteil, wenn eine konkrete Integrationsrolle dokumentiert und freigegeben wird.

## Dokumentationsmodell und Vollstaendigkeitskriterien

`knowledge/EOS_Master_Architecture.md` ist die zentrale Architekturuebersicht. Detailwissen verbleibt in den jeweils fuehrenden Dateien und wird hier nicht redundant vervielfacht.

### Fuehrende Dokumente

- Projektsteuerung und freigegebener Entwicklungsstand: `knowledge/project_brain.md`
- Masterarchitektur und Systemgrenzen: `knowledge/EOS_Master_Architecture.md`
- verbindliche Architekturentscheidungen: `knowledge/decisions.md`
- fachliche Anforderungen: `knowledge/requirements.md`
- offene, nicht gesicherte Punkte: `knowledge/open_questions.md`
- Modulbestand und Modulgruppen: `knowledge/modules.md`
- technische Detailanalysen und Spezifikationen: `docs/`
- Aenderungshistorie: `CHANGELOG.md`

### Statusbegriffe

- `Freigegeben`: fachlich beschlossen, im Repository belegt und als gueltige Grundlage verwendbar.
- `Implementiert`: im Repository technisch vorhanden; eine fachliche Freigabe ist separat nachzuweisen.
- `Dokumentiert`: beschrieben, ohne automatisch Implementierung oder Freigabe zu bedeuten.
- `Zielbild – nicht freigegeben`: langfristig architektonisch vorgesehen, aber weder spezifiziert noch zur Umsetzung freigegeben.
- `Unklar`: nicht ausreichend belegt und deshalb nicht als Entscheidungsgrundlage verwendbar.

### Mindestumfang je freigegebenem EOS-Modul

Die Dokumentation eines EOS-Moduls gilt erst dann als vollstaendig, wenn mindestens folgende Punkte belegt sind:

1. fachlicher Zweck und klare Verantwortung,
2. Abgrenzung zu anderen Modulen und Schutzinstanzen,
3. definierte Eingangsquellen und Fuehrungsrollen,
4. stabiles State-Modell einschliesslich Datentypen und Schreibrechten,
5. Kommunikations-, Plausibilitaets- und Fehlerverhalten,
6. Ressourcen- und Triggerkonzept,
7. Sicherheitsauswirkungen und verbotene Schreibpfade,
8. Deployment-, Backup-, Rollback- und Verifikationsweg,
9. VIS2-Bezug und erlaubte Bedienfunktionen,
10. Requirements- und Entscheidungsreferenzen,
11. Abnahmekriterien sowie technischer Review-Nachweis,
12. dokumentierter Freigabe- und Versionsstand.

### Aktueller Dokumentationsgrad

- Battery V1: fuer den freigegebenen V1-Umfang dokumentiert und abgeschlossen.
- Energy Flow V1 Phase 2: fuer den freigegebenen Umfang dokumentiert; die Domaenen PV, House und Wallbox bleiben fachlich unvollstaendig und `UNKNOWN`.
- Drei-Zaehlpunkt-Bilanz: Grundprinzip dokumentiert; vollstaendige formale Abrechnungs- und Abhaengigkeitsbeschreibung bleibt offen.
- Wallbox und Pool: Grundrollen und Sicherheitsgrenzen dokumentiert; keine vollstaendige EOS-Modulspezifikation freigegeben.
- Zielmodule Generation, Consumption, Communication, Health, Historian, Notification, Scheduler, Forecast und Optimizer: nur als Zielbild dokumentiert und nicht freigegeben.
- Altbestand: Modulgruppen sind dokumentiert; eine vollstaendige technische Abhaengigkeitenkarte fehlt.

Damit ist die Masterarchitektur strukturell konsolidiert. Die vollstaendige EOS-Gesamtdokumentation ist erst erreicht, wenn alle freigegebenen Domaenen die Mindestkriterien erfuellen und die verbleibenden offenen Architekturgrenzen entweder beschlossen oder ausdruecklich verworfen wurden.

## Offene Architekturgrenzen

Weiterhin `Unklar`:

- naechste freigegebene EOS-Modulgrenze,
- konkrete Reihenfolge und Versionierung der Zielmodule,
- EOS-interne Quellen fuer PV, House und Wallbox in Energy Flow,
- konkrete Notabschaltungsszenarien,
- konkrete Prognose- und Optimierungsverfahren,
- vollstaendige Abhaengigkeitenkarte des Altbestands,
- formale Prioritaetsregeln je Verbrauchergruppe,
- Detailumfang kuenftiger aktorischer VIS2-Funktionen,
- verbindliche Rolle externer Historisierungs- und Analyseplattformen.

Neue Architekturarbeit beginnt erst nach expliziter fachlicher Freigabe des jeweiligen Punktes.
