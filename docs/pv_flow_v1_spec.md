# PV Flow V1 Spezifikation

## Ziel

`PV_Flow_V1` verdichtet sechs belegte PV-Leistungsquellen read-only unter `0_userdata.0.EOS.PV.*`.

## Quellen

### AC

- `alias.0.Fronius.AC-Power`
- `alias.0.Fronius.AC-Power_10kW`
- `alias.0.SMA.Power`
- `alias.0.SE.Power`

### DC

- `alias.0.MPPT RS450/100.P String1`
- `alias.0.MPPT RS450/100.P String2`

## Summen

- `ACPower`: Summe der vier AC-Wechselrichter
- `DCPower`: Summe der beiden RS450-Strings
- `TotalPower`: reiner Anzeigewert aus `ACPower + DCPower`

Die RS450-Leistung lädt ausschließlich DC-seitig die Batterie bis zum definierten Höchststand. Aus `TotalPower` darf deshalb keine Netzeinspeisefähigkeit abgeleitet werden.

## Status

- aktueller positiver Zahlenwert: `OK`
- `0 W`, auch mit altem Timestamp: `STANDBY`, da Wechselrichter ohne Sonnenenergie schlafen
- positiver Wert älter als 30 Sekunden: `STALE`, Leistung wird 0
- positiver Wert älter als 120 Sekunden: `OFFLINE`, Leistung wird 0
- ungültiger oder negativer Wert: `ERROR`, Leistung wird 0
- fehlender Wert: `UNKNOWN`

## Abgrenzung

- keine Aktorik
- keine Regelung
- keine Aussage über mögliche Netzeinspeisung der DC-Leistung
- ausschließlich numerische Leistungswerte und String-Status
