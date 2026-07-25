# EOS Module Dependencies

## Zweck

Dieses Dokument beschreibt die zulaessigen Abhaengigkeitsrichtungen zwischen EOS-Schichten und -Modulen. Es ist eine Architekturregel, keine Implementierungsfreigabe fuer neue Module.

Nicht belegte oder nicht freigegebene Beziehungen bleiben `Unklar`.

## Grundregel

EOS-Abhaengigkeiten verlaufen grundsaetzlich von Quellen ueber fachliche Verdichtung zu Folgefunktionen und Visualisierung.

```text
Hardware / Adapter / Protokolle
            |
            v
Quellintegration und Quellstatus
            |
            v
EOS-Domaenenmodule
            |
            v
stabile EOS-States
       +----+----+
       |         |
       v         v
Folgemodule     VIS2
```

Rueckwaerts gerichtete Schreibpfade sind nur ueber ausdruecklich freigegebene Settings-, Sollwert- oder Limit-Schnittstellen zulaessig.

## Zulaessige Abhaengigkeiten

### Quellintegration zu EOS-Domaenen

EOS-Domaenenmodule duerfen dokumentierte Rohquellen lesen, wenn:

- Quelle, Pfad, Einheit und Fuehrungsrolle belegt sind,
- Kommunikations- und Fehlerverhalten definiert sind,
- keine ungesicherte Ersatzquelle stillschweigend fuehrend wird,
- der Zugriff in der jeweiligen Spezifikation dokumentiert ist.

### EOS-Domaene zu EOS-Domaene

Ein EOS-Modul darf States eines anderen EOS-Moduls lesen, wenn:

- die gelesene Schnittstelle freigegeben und stabil ist,
- keine direkte Rohquelle umgangen wird,
- die Abhaengigkeit fachlich notwendig und dokumentiert ist,
- kein zyklischer Schreib- oder Entscheidungsfluss entsteht.

Ein Modul schreibt grundsaetzlich nur in seinen eigenen State-Bereich.

### EOS zu VIS2

VIS2 darf freigegebene EOS-States lesen und freigegebene Settings bedienen.

VIS2 darf nicht:

- Rohquellen fachlich zusammenfuehren,
- eigene Regelentscheidungen treffen,
- read-only Fachstates beschreiben,
- Schutz- oder Echtzeitlogik ersetzen.

### EOS zu Cerbo und Hardware

Aktorische EOS-Funktionen duerfen nur ueber dokumentierte und freigegebene Settings-, Sollwert- oder Limitpfade wirken.

Cerbo ESS, Cerbo BAT und Hardware-Schutz bleiben fuer Echtzeitregelung und Schutz verantwortlich. Direkte Umgehung dieser Instanzen ist unzulaessig.

## Verbotene Abhaengigkeiten

Nicht zulaessig sind:

- Schreibzugriffe eines read-only Moduls auf Aktoren,
- Fachlogik in VIS2,
- direkte Abhaengigkeit freigegebener EOS-Module von zufaelligen UI- oder Dashboard-Zustaenden,
- zyklische Modulabhaengigkeiten ohne ausdruecklich dokumentiertes Konflikt- und Prioritaetsmodell,
- stillschweigende Kopplung ueber gemeinsam beschriebene Fremdstates,
- direkte Nutzung nicht freigegebener Rohquellen durch Folgefunktionen,
- Umgehung von BMS-, Cerbo- oder Hardwaregrenzen,
- semantische Doppelhaltung derselben Fachinformation ohne begruendete Fuehrungsrolle.

## Abhaengigkeitsklassen

Jede dokumentierte Modulabhaengigkeit wird einer Klasse zugeordnet:

- `READ_SOURCE`: Modul liest eine technische Rohquelle.
- `READ_EOS`: Modul liest eine freigegebene EOS-Schnittstelle.
- `WRITE_OWN_STATE`: Modul schreibt berechnete oder verdichtete States im eigenen Bereich.
- `READ_SETTING`: Modul liest freigegebene Konfiguration.
- `WRITE_SETPOINT`: aktorisches Modul schreibt einen freigegebenen Sollwert oder ein Limit.
- `VIS_READ`: VIS2 liest einen EOS-State.
- `VIS_SETTING`: VIS2 bedient einen freigegebenen Settings-State.

Andere Abhaengigkeitsklassen benoetigen vor Verwendung eine Architekturentscheidung.

## Pflichtangaben je Abhaengigkeit

Jede freigegebene Modulabhaengigkeit muss mindestens dokumentieren:

1. Quellmodul oder technisches Quellsystem,
2. Zielmodul,
3. Abhaengigkeitsklasse,
4. gelesene oder geschriebene Schnittstelle,
5. Fuehrungsrolle der Information,
6. Trigger- oder Aktualisierungsverhalten,
7. Fehler- und Timeout-Verhalten,
8. Schreibrechte und Sicherheitsgrenzen,
9. Verhalten bei fehlender oder unplausibler Quelle,
10. Requirements- und Entscheidungsreferenz.

## Verifizierter Ist-Stand

### Battery V1

- `Battery_Supervisor_V1` liest dokumentierte Batterie- und Kommunikationsquellen und schreibt ausschliesslich in `0_userdata.0.EOS.Battery.*`.
- `Battery_Health_V1` liest freigegebene EOS-Battery-States und bleibt nicht-aktorisch.
- Battery VIS2 Read-Only V1 liest ausschliesslich freigegebene EOS-Battery-States.

### Energy Flow V1

- `Energy_Flow_V1` liest fuer Battery die freigegebene EOS-Battery-Schnittstelle.
- Grid wird ueber die dokumentierte EOS-interne Bilanzsicht angebunden.
- PV, House und Wallbox bleiben `UNKNOWN`, solange keine freigegebenen EOS-internen Quellen dokumentiert sind.
- Energy Flow schreibt nicht in die Battery-Domaene zurueck.

## Zielbild – nicht freigegeben

Langfristig sollen Domaenenmodule nur ueber stabile EOS-Schnittstellen gekoppelt werden. Querschnittsmodule wie Communication, Health, Notification, Scheduler, Forecast und Optimizer duerfen Domaeneninformationen lesen, aber keine Schutz- oder Echtzeitinstanz ersetzen.

Die konkrete Abhaengigkeitsmatrix kuenftiger Module ist erst mit der jeweiligen Modulspezifikation festzulegen.

## Offene Punkte

Weiterhin `Unklar`:

- vollstaendige Abhaengigkeitskarte des produktionsnahen Altbestands,
- EOS-interne Quellen fuer PV, House und Wallbox,
- konkrete aktorische Sollwert- und Limitpfade kuenftiger Module,
- Prioritaets- und Konfliktmodell zwischen mehreren aktorischen Modulen,
- verbindliche Abhaengigkeiten von Historian, Notification, Scheduler, Forecast und Optimizer.
