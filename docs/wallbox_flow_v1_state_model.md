# Wallbox Flow V1 – State-Modell

## Status

Stabiles V1-Zielmodell fuer eine spaetere, ausdruecklich beauftragte Implementierung. Alle berechneten States sind read-only.

## Root

`0_userdata.0.EOS.Wallbox`

## Statusmenge

Zulaessige Statusstrings:

- `OK`
- `DEGRADED`
- `STALE`
- `OFFLINE`
- `UNKNOWN`
- `ERROR`

`DEGRADED` wird nur fuer die Gesamtsicht verwendet. Einzelquellen verwenden `OK`, `STALE`, `OFFLINE`, `UNKNOWN` oder `ERROR`.

## Gesamtstates

| State | Typ | Rolle | Einheit | read | write | Bedeutung |
|---|---|---|---|---:|---:|---|
| `0_userdata.0.EOS.Wallbox.Summary.Power` | number | `value.power` | W | true | false | Summe der aktuell gueltigen Einzelquellen; immer numerisch |
| `0_userdata.0.EOS.Wallbox.Summary.Active` | boolean | `indicator` | – | true | false | mindestens eine gueltige Quelle groesser als 100 W |
| `0_userdata.0.EOS.Wallbox.Summary.Status` | string | `text` | – | true | false | Gesamtqualitaet der Wallboxsicht |
| `0_userdata.0.EOS.Wallbox.Summary.LastUpdate` | number | `value.time` | ms | true | false | Millisekunden-Timestamp der letzten fachlichen Neubewertung |

## Einzelquellen

Das Schema gilt fuer `Wallbox1`, `Wallbox2` und `Wallbox3` unter `0_userdata.0.EOS.Wallbox.Sources.<Source>.*`.

| Suffix | Typ | Rolle | Einheit | read | write | Bedeutung |
|---|---|---|---|---:|---:|---|
| `Power` | number | `value.power` | W | true | false | normierte Leistung; bei nicht gueltiger Quelle 0 |
| `Active` | boolean | `indicator` | – | true | false | wahr bei gueltiger Leistung groesser als 100 W |
| `Status` | string | `text` | – | true | false | `OK`, `STALE`, `OFFLINE`, `UNKNOWN` oder `ERROR` |
| `LastUpdate` | number | `value.time` | ms | true | false | letzter belastbarer Quellzeitstempel `ts`; 0 wenn unbekannt |
| `AgeSeconds` | number | `value.interval` | s | true | false | nichtnegatives Alter der Quelle; 0 wenn nicht bestimmbar und Status `UNKNOWN` |

Vollstaendige Source-Roots:

- `0_userdata.0.EOS.Wallbox.Sources.Wallbox1`
- `0_userdata.0.EOS.Wallbox.Sources.Wallbox2`
- `0_userdata.0.EOS.Wallbox.Sources.Wallbox3`

## Quellzuordnung

| EOS-Quelle | Eingangsstate |
|---|---|
| `Wallbox1` | `alias.0.go-E.powerV3` |
| `Wallbox2` | `alias.0.go-E.powerV4` |
| `Wallbox3` | `alias.0.go-E.go-E-V4-Halle` |

## Initialwerte

| State-Art | Initialwert |
|---|---|
| Leistungswerte | `0` |
| Active | `false` |
| Status | `UNKNOWN` |
| LastUpdate | `0` |
| AgeSeconds | `0` |

Initialwerte sind keine bestaetigten Messwerte. Ihre Gueltigkeit ergibt sich ausschliesslich aus dem zugehoerigen Status.

## Schreibverantwortung

Nur `script.js.energiemanagement.Wallbox_Flow_V1` darf diese States beschreiben.

Andere Module und VIS2 duerfen sie nach Freigabe lesen. Eine spaetere Anbindung an `Energy_Flow_V1` benoetigt einen eigenen Auftrag und darf erst erfolgen, wenn `Wallbox_Flow_V1` implementiert, getestet und freigegeben ist.

## Kompatibilitaetsregel

Nach Veroeffentlichung duerfen V1-State-Pfade nicht umbenannt oder semantisch umgedeutet werden. Erweiterungen muessen rueckwaertskompatibel sein oder eine neue Version mit Migrationsweg erhalten.
