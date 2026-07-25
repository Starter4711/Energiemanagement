# EOS Communication Matrix

## Zweck

Dieses Dokument beschreibt die verifizierten Kommunikationswege des EOS – Energy Operating System. Es legt Rollen, Richtungen, Verantwortlichkeiten, Schutzgrenzen und Fehlerverhalten fest. Nicht belegte Details bleiben `Unklar`.

## Grundregeln

- Kommunikationswege transportieren Daten oder freigegebene Sollwerte, treffen aber keine eigene fachliche Entscheidung.
- Schutzfunktionen verbleiben in Hardware, BMS und Cerbo-Echtzeitregelung.
- ioBroker ist Strategie-, Koordinations- und Verdichtungsebene.
- Node-RED ist Kommunikationsbruecke, nicht fuehrende Entscheidungsinstanz.
- VIS2 liest EOS-States und darf keine Schutz- oder Echtzeitlogik enthalten.
- Rohpfade werden nicht als fachliche API verwendet; EOS-States bilden die stabile interne Schnittstelle.
- Schreibende Kommunikationspfade benoetigen eine eigene Spezifikation, Sicherheitsabgrenzung und Freigabe.
- Fehlende oder unklare Kommunikationsdaten werden nicht geschaetzt.

## Kommunikationsmatrix

| Quelle | Ziel | Weg | Richtung | Zweck | Status | Schutzgrenze |
|---|---|---|---|---|---|---|
| Cerbo ESS / Venus OS | ioBroker | MQTT | lesend | Victron-, Netz-, ESS- und Betriebsdaten | dokumentiert | keine Umgehung der Cerbo-Regelung |
| Cerbo BAT / Venus OS | ioBroker | MQTT | lesend | Batterie-, DC- und Betriebsdaten | dokumentiert | Hardware- und BMS-Grenzen bleiben fuehrend |
| ioBroker | Cerbo ESS / Cerbo BAT | MQTT / Node-RED / D-Bus-Bruecke | schreibend, nur freigegeben | Sollwerte, Limits und strategische Parameter | live-nah, sensibel | keine Schutz- oder Echtzeitfunktion ersetzen |
| Gobel / Pace BMS | ioBroker | Modbus | lesend | Pack-, Zell-, Schutz- und Kommunikationsdaten | dokumentiert | BMS bleibt fuehrende Schutzinstanz |
| HELTEC Balancer | ioBroker | MQTT | lesend | Zellspannungsdiagnose und Plausibilisierung | dokumentiert | keine alleinige Gesamtregelgroesse |
| SmartShunt | ioBroker / Cerbo | Victron-/MQTT-Pfad | lesend | Gesamt-SOC, DC-Spannung und Batteriestrom | dokumentiert | fuehrende Gesamtquelle fuer Batterie |
| EM24 / Energiezaehler | ioBroker / Cerbo | Adapter-, Modbus- oder Victron-Pfad | lesend | lokale Netz- und Leistungswerte | dokumentiert, Detailpfade teilweise `Unklar` | lokale Werte nicht mit Gesamtbilanz verwechseln |
| go-e Adapter | ioBroker | Adapterobjekte | lesend und schreibend | Status, Stromvorgabe, Freigabe und Betriebsdaten | live-nah, sensibel | Batterieprioritaet und freigegebene Grenzen beachten |
| ioBroker | go-e Wallbox | HTTP-API | schreibend | Phasenumschaltung | live-nah, sensibel | Verriegelung, Mindestzeiten und sichere Rueckmeldung erforderlich |
| Siemens LOGO / S7 | ioBroker | S7 | lesend und schreibend | Pool-Sensoren und Pool-Aktoren | live-nah, sensibel | Zeit-, Temperatur- und Schutzbedingungen beachten |
| ioBroker-EOS-Module | `0_userdata.0.EOS.*` | ioBroker States | schreibend intern | fachliche Verdichtung und Statusbildung | freigegebene Domaenen: Battery, EnergyFlow | berechnete States read-only |
| EOS-Folgefunktionen | `0_userdata.0.EOS.*` | ioBroker States | lesend | Nutzung stabiler Fachzustaende | dokumentiert | keine direkten Rohquellen ohne Freigabe |
| VIS2 | `0_userdata.0.EOS.*` | ioBroker States | lesend | Anzeige und Diagnose | dokumentiert | keine Fachlogik in VIS2 |
| VIS2 | Settings-States | ioBroker States | schreibend, nur freigegeben | Bedienung oder Konfiguration | Zielbild, nicht pauschal freigegeben | nur dokumentierte Settings, keine berechneten States |
| Historisierung | EOS-States oder ausgewaehlte Rohwerte | Adapter / externe Plattform | lesend | Zeitreihen und Analyse | Rolle teilweise `Unklar` | keine Doppelhaltung ohne fachlichen Grund |

## Kommunikationsrollen

### Lesende Quellintegration

Lesende Quellintegration uebernimmt:

- Erfassung technischer Rohdaten,
- Zeitstempel und Altersbewertung,
- Kommunikationsstatus,
- Plausibilitaetspruefung,
- Uebergabe an Domaenenmodule.

Sie darf keine Rohquelle stillschweigend zur fuehrenden Quelle aufwerten.

### Fachliche Verdichtung

EOS-Domaenenmodule:

- lesen dokumentierte Quellen oder bereits freigegebene EOS-States,
- bilden fachliche Werte und Status,
- schreiben ausschliesslich in den eigenen Domaenenbereich,
- kennzeichnen `UNKNOWN`, veraltet, offline oder unplausibel eindeutig,
- schreiben nur bei fachlich relevanter Wertaenderung.

### Schreibende Steuerpfade

Schreibende Pfade sind nur zulaessig, wenn mindestens dokumentiert sind:

1. fachlicher Zweck,
2. Zielsystem und Zielpfad,
3. erlaubter Wertebereich,
4. Prioritaet und Fuehrungsrolle,
5. Verriegelungen und Mindestzeiten,
6. Verhalten bei Kommunikationsverlust,
7. Rueckmeldung und Verifikation,
8. Backup- und Rollbackweg,
9. Ausschluss der Umgehung von Schutzinstanzen,
10. ausdrueckliche Freigabe.

## Fehler- und Ausfallverhalten

Jeder Kommunikationsweg muss mindestens folgende Zustaende unterscheiden koennen:

- aktuell und plausibel,
- veraltet,
- offline,
- unplausibel,
- Schreibfehler,
- fehlende Rueckmeldung,
- fachlich unbekannt.

Verbindliche Regeln:

- Ein Ausfall einer Quelle fuehrt nicht automatisch zur Nutzung einer ungesicherten Ersatzquelle.
- Schreibende Befehle ohne belastbare Rueckmeldung gelten nicht als erfolgreich ausgefuehrt.
- Bei Kommunikationsverlust darf kein unsicherer Dauerschreibzustand entstehen.
- Wiederholungen muessen begrenzt und ressourcenschonend sein.
- Logging erfolgt zustandswechselorientiert und nicht als ungebremstes Dauerlogging.
- Kommunikationsfehler duerfen Schutzfunktionen nicht deaktivieren oder umgehen.

## Ressourcenschonung

- Ereignisgetriebene Verarbeitung ist Polling vorzuziehen.
- Polling ist nur zulaessig, wenn die Quelle keine belastbare Ereignisbenachrichtigung bietet.
- Schreibvorgaenge erfolgen nur bei notwendiger Wertaenderung.
- Kommunikationsstatus und LastUpdate werden nur im fachlich erforderlichen Umfang gespeichert.
- Wiederholintervalle und Timeouts richten sich nach Reaktionsbedarf und Kritikalitaet der Domaene.

## Sicherheitsklassifikation

### Klasse A – read-only und diagnostisch

Beispiele:

- HELTEC-Zellspannungen,
- Battery Health,
- Energy Flow Read-Only,
- VIS2-Anzeige.

Anforderung: keine Aktorik, keine Sollwertschreibungen.

### Klasse B – strategische Settings und Limits

Beispiele:

- freigegebene SOC-Grenzen,
- Lade- oder Entladelimits,
- konfigurierbare Verbrauchergrenzen.

Anforderung: dokumentierte Wertebereiche, Validierung und kontrollierte Weitergabe.

### Klasse C – direkte oder live-nahe Aktorik

Beispiele:

- go-e-Freigabe und Stromvorgabe,
- HTTP-Phasenumschaltung,
- S7-/LOGO-Schaltpfade,
- MQTT-Schreibpfade zu Victron.

Anforderung: Backup, Rollback, Verriegelung, Rueckmeldung, Fehlerbehandlung und ausdrueckliche Freigabe.

## Offene Punkte

Weiterhin `Unklar`:

- vollstaendige Liste aller produktiven MQTT-Schreibtopics,
- vollstaendige Zuordnung aller EM24- und Zaehlerpfade,
- konkrete produktive Node-RED-Flows und D-Bus-Pfade,
- verbindliche Rolle von InfluxDB und Grafana innerhalb von EOS,
- vollstaendige Kommunikationsmatrix des Altbestands unter `iobroker/scripts/common/`,
- konkrete Wiederhol-, Timeout- und Fail-safe-Regeln aller aktorischen Pfade.

Neue oder geaenderte Kommunikationswege werden erst nach Dokumentation, Sicherheitspruefung und ausdruecklicher Freigabe Bestandteil der EOS-Architektur.
