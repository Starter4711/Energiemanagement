# PV Flow V1 State-Modell

Alle States liegen unter `0_userdata.0.EOS.PV` und sind read-only.

## Summary

| State | Typ | Einheit | Bedeutung |
| --- | --- | --- | --- |
| `Summary.TotalPower` | Zahl | W | Anzeige AC + DC |
| `Summary.ACPower` | Zahl | W | vier AC-Wechselrichter |
| `Summary.DCPower` | Zahl | W | zwei RS450-Strings, reine DC-Batterieladung |
| `Summary.Active` | Boolean | | mindestens 1 W Gesamtleistung |
| `Summary.Status` | Text | | verdichteter Quellenstatus |
| `Summary.LastUpdate` | Zahl | ms | letzte fachliche Änderung |

## Sources

Für `FroniusHalle`, `FroniusHaus`, `SMA`, `SolarEdge`, `RS450String1` und `RS450String2` werden jeweils bereitgestellt:

- `Power` als numerischer Wattwert
- `Status` als String
- `LastUpdate` in Millisekunden
- `AgeSeconds` als numerischer Sekundenwert
