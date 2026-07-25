# Wallbox Flow V1 – Spezifikation

## Status

Spezifiziert fuer eine spaetere, ausdruecklich beauftragte Implementierung. Dieses Dokument allein erzeugt noch keine Implementierungs- oder Deploymentfreigabe.

## Zweck

`Wallbox_Flow_V1` verdichtet die belegten Leistungswerte von drei go-e-Wallboxen zu einer stabilen, read-only EOS-Wallboxsicht. Das Modul enthaelt keine Ladefreigabe, Stromvorgabe, Phasenumschaltung oder sonstige Aktorik.

## Scope

- drei dokumentierte Wallbox-Leistungsquellen lesen,
- kW nach W normieren,
- Einzelwerte und Gesamtleistung immer numerisch ausgeben,
- Aktivitaet ab einer Leistung groesser als 100 W erkennen,
- Aktualitaet je Quelle bewerten,
- Teilausfaelle als `DEGRADED` sichtbar machen,
- ausschliesslich eigene read-only EOS-States schreiben,
- ereignisgetrieben und ressourcenschonend arbeiten.

## Nicht-Scope

- keine Aenderung an go-e-Adaptern, MQTT oder HTTP,
- keine Ladefreigabe,
- keine Strom- oder Phasenvorgabe,
- keine Batterieunterstuetzung,
- keine Ueberschussregelung,
- keine Recommendation,
- keine VIS2-Aenderung,
- keine Aenderung an `Energy_Flow_V1.js`.

## Eingangsquellen

| Quelle | Zuordnung | Einheit | Vorzeichen | Rolle |
|---|---|---:|---|---|
| `alias.0.go-E.powerV3` | Wallbox 1 / V3 | kW | positiv = Energie ins Auto | primaere Leistungsquelle Wallbox 1 |
| `alias.0.go-E.powerV4` | Wallbox 2 / V4 | kW | positiv = Energie ins Auto | primaere Leistungsquelle Wallbox 2 |
| `alias.0.go-E.go-E-V4-Halle` | Wallbox 3 / Halle | kW | positiv = Energie ins Auto | primaere Leistungsquelle Wallbox 3 |

Die Pfade und die Einheit kW sind im Repository belegt. Es werden keine direkten Adapter-, MQTT- oder HTTP-Pfade verwendet.

## Zahlen- und Statusregeln

- Leistungswerte sind immer vom Typ `number`.
- `null`, `undefined`, `NaN`, Strings oder nicht endliche Werte duerfen nie in Leistungsstates geschrieben werden.
- Gueltige kW-Eingangswerte werden mit Faktor 1.000 nach W umgerechnet.
- Negative Eingangswerte sind fuer V1 unplausibel. Der betroffene Leistungswert wird als `0 W` ausgegeben und sein Status auf `ERROR` gesetzt.
- Fehlende, veraltete, offline oder unplausible Quellen tragen `0 W` zur Summe bei.
- Der Status muss immer als String ausgegeben werden und die Gueltigkeit des Zahlenwerts erklaeren.
- `0 W` mit Status `OK` bedeutet aktuelle, gueltige Nulllast.
- `0 W` mit `STALE`, `OFFLINE`, `UNKNOWN` oder `ERROR` darf nicht als bestaetigte Nulllast interpretiert werden.

## Aktivitaetsregel

- `Active = true`, wenn die gueltige Leistung groesser als `100 W` ist.
- Bei `100 W` oder weniger gilt `Active = false`.
- Nicht gueltige Quellen sind `Active = false`.
- Der Gesamtstatus `Active` ist wahr, wenn mindestens eine gueltige Einzelquelle aktiv ist.

## Aktualitaetsregeln

Die Aktualitaet wird anhand des ioBroker-State-Zeitstempels `ts` bewertet:

- `OK`: Alter bis einschliesslich 30 Sekunden,
- `STALE`: Alter groesser als 30 Sekunden und bis einschliesslich 120 Sekunden,
- `OFFLINE`: Alter groesser als 120 Sekunden,
- `UNKNOWN`: State fehlt oder besitzt keinen belastbaren Zeitstempel,
- `ERROR`: Wert ist nicht numerisch, nicht endlich oder negativ.

Die Altersbewertung muss auch ohne neue Quellereignisse die Uebergaenge nach 30 und 120 Sekunden erkennen. Dafuer ist genau ein ressourcenschonender, zentraler Prueftimer zulaessig; ein Polling je Quelle ist nicht zulaessig.

## Summen- und Teilausfallregel

- Die Gesamtleistung ist die Summe aller aktuell gueltigen Einzelwerte mit Status `OK`.
- Quellen mit anderem Status tragen numerisch `0 W` bei.
- Alle drei Quellen `OK`: Gesamtstatus `OK`.
- Mindestens eine Quelle `OK`, mindestens eine weitere Quelle nicht `OK`: Gesamtstatus `DEGRADED`.
- Keine Quelle `OK`, aber mindestens eine `STALE`: Gesamtstatus `STALE`.
- Keine Quelle `OK` oder `STALE`, aber mindestens eine `OFFLINE`: Gesamtstatus `OFFLINE`.
- Bei mindestens einem `ERROR` und keiner `OK`-Quelle: Gesamtstatus `ERROR`.
- Wenn keine Quelle fachlich bewertbar ist: Gesamtstatus `UNKNOWN`.

## Trigger- und Ressourcenmodell

- Quellstates werden beim Modulstart eingelesen.
- Jede Quellaenderung loest nur die Bewertung der betroffenen Quelle und danach die Gesamtsicht aus.
- Ein zentraler Prueftimer bewertet ausschliesslich notwendige Zeituebergaenge.
- EOS-States werden nur bei Wertaenderung geschrieben.
- Logging erfolgt nur bei Statuswechseln oder erstmaligen Fehlern.
- Eine zuschaltbare Debug-Logebene ist vorzusehen.

## Sicherheitsabgrenzung

Das Modul ist Sicherheitsklasse A: read-only und diagnostisch.

Es darf:

- die drei dokumentierten Alias-Leistungsstates lesen,
- ausschliesslich `0_userdata.0.EOS.Wallbox.*` schreiben.

Es darf nicht:

- go-e-, MQTT-, HTTP-, Adapter- oder Hardwarestates beschreiben,
- Settings, Sollwerte oder Ladefreigaben erzeugen,
- Batterie-, Grid- oder Energy-Flow-States ueberschreiben,
- Hardware-, Cerbo- oder bestehende Wallbox-Schutzlogik ersetzen.

## Abnahmekriterien

1. Alle Leistungsstates sind `number` und read-only.
2. Statusstates sind Strings.
3. kW-Werte werden korrekt nach W umgerechnet.
4. Positive Leistung bedeutet Energiefluss ins Auto.
5. Aktivitaet beginnt erst oberhalb von 100 W.
6. `STALE` tritt nach mehr als 30 Sekunden ein.
7. `OFFLINE` tritt nach mehr als 120 Sekunden ein.
8. Fehlende oder ungueltige Quellen liefern numerisch 0 W und einen nicht-`OK`-Status.
9. Teilausfall liefert die Summe der verfuegbaren `OK`-Quellen und Gesamtstatus `DEGRADED`.
10. Das Modul ist ereignisgetrieben und verwendet hoechstens einen zentralen Alterstimer.
11. Es schreibt nur bei Wertaenderung.
12. Es existiert keine Aktorik und keine Aenderung an `Energy_Flow_V1.js`.
13. Syntax-, State-Modell-, Fehler-, Neustart- und Recovery-Pruefungen sind erfolgreich.
14. Implementierung, Objektdatei und Manifest werden erst in einem eigenen Auftrag erstellt.
