# EOS Interface Contract

## Zweck

Dieses Dokument definiert den verbindlichen Schnittstellenrahmen zwischen EOS, ioBroker, Node-RED, Cerbo/Venus OS und den physischen Schutzinstanzen. Es beschreibt Verantwortungen, zulässige Daten- und Steuerflüsse sowie verbotene Kopplungen. Nicht belegte Detailpfade bleiben `Unklar`.

## Rollen

### EOS-Fachschicht

- verdichtet Rohquellen zu stabilen Fachzuständen,
- stellt read-only EOS-States für Folgefunktionen und VIS2 bereit,
- erzeugt nur ausdrücklich freigegebene Settings, Sollwerte oder Limits,
- übernimmt keine Hardware-Schutz- oder Echtzeitregelung.

### ioBroker

- ist Strategie-, Koordinations- und Integrationsplattform,
- hostet EOS-Module und EOS-States,
- überwacht Kommunikation und Plausibilität,
- darf nur über dokumentierte Schnittstellen auf externe Systeme wirken.

### Node-RED

- ist Kommunikations- und Protokollbrücke,
- darf Werte zwischen MQTT, D-Bus und freigegebenen Schnittstellen transportieren,
- trifft keine eigenständigen fachlichen Optimierungs- oder Schutzentscheidungen,
- darf keine nicht freigegebenen Ersatzwerte erzeugen.

### Cerbo ESS und Cerbo BAT

- bleiben primäre Victron-Echtzeitregler,
- setzen lokale hardware- und systemnahe Limits um,
- verarbeiten nur dokumentierte Sollwerte und Limits,
- behalten Schutz- und Fallback-Verantwortung bei Ausfall externer Strategieebenen.

### BMS und Hardware-Schutz

- bleiben höchste Schutzinstanz,
- dürfen durch EOS, ioBroker, Node-RED, MQTT oder VIS2 nicht umgangen werden,
- haben bei widersprüchlichen Vorgaben immer Vorrang.

## Schnittstellenklassen

### 1. Telemetrie

Richtung:

```text
Hardware / Cerbo / Adapter / MQTT / Modbus / S7
                        -> ioBroker
                        -> EOS-Domänenmodule
                        -> read-only EOS-States
```

Regeln:

- Telemetrie ist grundsätzlich read-only.
- Rohdaten bleiben außerhalb der EOS-Fachstruktur.
- Zeitstempel, Aktualität und Kommunikationsstatus müssen nachvollziehbar sein.
- Fehlende oder veraltete Werte dürfen nicht geschätzt werden.

### 2. Fachzustände

Richtung:

```text
EOS-Domänenmodul -> 0_userdata.0.EOS.<Domain>.* -> Folgefunktionen / VIS2
```

Regeln:

- Ein State hat genau eine fachliche Schreibverantwortung.
- Andere Module dürfen den State lesen, aber nicht überschreiben.
- Schreibrechte, Typ, Einheit, Statusmenge und Fehlerverhalten werden im State-Modell definiert.
- Inkompatible Änderungen benötigen neue Version und Migration.

### 3. Settings

Richtung:

```text
VIS2 / Betreiber / Konfiguration -> freigegebener Settings-State -> zuständiges EOS-Modul
```

Regeln:

- Nur explizit dokumentierte Settings-States sind schreibbar.
- Eingaben müssen typ-, bereichs- und plausibilitätsgeprüft werden.
- Ungültige Werte dürfen keine Aktorik auslösen.
- Settings sind keine direkten Hardware-Schreibpfade.

### 4. Sollwerte und Limits

Richtung:

```text
EOS-Strategie -> freigegebener Sollwert / Limit -> Kommunikationsbrücke -> Cerbo / Zielsystem
```

Regeln:

- Jeder Sollwert benötigt fachliche Quelle, Einheit, Gültigkeitsbereich und Ablaufverhalten.
- Ein Sollwert muss bei Kommunikationsverlust in einen dokumentierten sicheren Zustand übergehen.
- Cerbo- und Hardwaregrenzen dürfen nicht erweitert oder übersteuert werden.
- Schreibwiederholungen sind auf den fachlich notwendigen Umfang zu begrenzen.
- Direkte Schreibpfade aus read-only Modulen sind verboten.

### 5. Status und Rückmeldung

Richtung:

```text
Zielsystem -> Istwert / Annahmestatus / Fehler -> ioBroker -> EOS-Status
```

Regeln:

- Ein gesendeter Sollwert gilt nicht automatisch als umgesetzt.
- Annahme, Wirksamkeit und Istzustand müssen getrennt betrachtet werden.
- Fehlende Rückmeldung führt zu `UNKNOWN`, `STALE`, `OFFLINE` oder einem dokumentierten Fehlerstatus.
- Wiederanlauf nach Kommunikationsstörung benötigt erneute Plausibilitätsprüfung.

## Schreibfreigabe

Ein aktorischer Schnittstellenpfad ist erst zulässig, wenn mindestens dokumentiert sind:

1. fachlicher Zweck,
2. verantwortliches EOS-Modul,
3. vollständiger Quell- und Zielpfad,
4. Datentyp, Einheit und Wertebereich,
5. Aktualisierungs- und Triggerregel,
6. Zeitüberschreitung und Ablaufverhalten,
7. Fallback bei Ausfall von ioBroker, MQTT, Node-RED oder Cerbo,
8. Vorrangregeln gegenüber BMS, Cerbo und Hardware,
9. Rückmelde- und Verifikationsweg,
10. Backup-, Rollback- und Testverfahren,
11. Requirements- und Entscheidungsreferenzen,
12. ausdrückliche fachliche Freigabe.

## Verbotene Kopplungen

- VIS2 schreibt direkt auf MQTT-, Modbus-, S7-, Adapter- oder D-Bus-Aktoren.
- Read-only Diagnose- oder Health-Module schreiben Sollwerte.
- Node-RED ersetzt EOS-Fachentscheidungen oder Cerbo-Echtzeitregelung.
- Ein EOS-Modul schreibt ohne Vertrag in den State-Bereich einer anderen Domäne.
- Fehlende Telemetrie wird durch statische oder geschätzte Ersatzwerte als gültig ausgegeben.
- Cerbo- oder BMS-Schutzgrenzen werden durch externe Sollwerte aufgehoben.
- Ein Kommunikationsfehler löst unkontrollierte Wiederholungs- oder Schaltzyklen aus.

## Ausfall- und Wiederanlaufverhalten

- Der Ausfall von EOS oder ioBroker darf Hardware-Schutz und Cerbo-Echtzeitregelung nicht deaktivieren.
- Sollwerte mit begrenzter Gültigkeit müssen nach Ablauf verworfen oder auf dokumentierte Defaults zurückgeführt werden.
- Nach Neustart dürfen aktorische Werte nicht ungeprüft aus veralteten States wiederhergestellt werden.
- Vor erneuter Aktivierung sind Quelle, Ziel, Kommunikationsstatus und Istwert zu prüfen.
- Ein Wiederanlauf darf keinen unkontrollierten Last-, Lade- oder Entladesprung verursachen.

## Verifizierter Ist-Stand

- Battery Supervisor V1, Battery Health V1 und Battery VIS2 Read-Only V1 sind nicht-aktorisch.
- Energy Flow V1 ist read-only und schreibt nicht in die Batterieebene zurück.
- Cerbo bleibt Echtzeitregler; ioBroker bleibt Strategie- und Koordinationsebene.
- Node-RED ist als Kommunikationsbrücke dokumentiert.
- Konkrete produktive Sollwert- und Limitverträge sind nur dort gültig, wo sie separat dokumentiert und freigegeben sind.

## Offene Punkte

Weiterhin `Unklar`:

- vollständige Liste aller produktiven MQTT- und D-Bus-Schreibpfade,
- konkrete Ablaufzeiten und Fallbackwerte je aktorischer Schnittstelle,
- verbindliche Rückmeldeverträge für Wallbox-, Pool- und Victron-Sollwerte,
- formale Priorität konkurrierender Strategieanforderungen,
- standardisiertes Quittierungsmodell für zukünftige EOS-Aktorik.
