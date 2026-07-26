# Energy Flow V1 State-Modell

## Oberer State-Baum

`0_userdata.0.EOS.EnergyFlow`

- `Grid`
- `Grid.Grid40`
- `Grid.Grid41`
- `Grid.Grid43`
- `PV`
- `Battery`
- `House`
- `Wallbox`
- `Summary`
- `Communication`

## Grid

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Grid.Status` | Text |  | ja | Netz-/Zaehlpunktwerte | offen |
| `0_userdata.0.EOS.EnergyFlow.Grid.LastUpdate` | Zahl | ms | ja | Netz-/Zaehlpunktwerte | geplant |

Aktueller Stand:

- Grid wird aus den drei EOS-Zaehlpunkten `Grid40`, `Grid41` und `Grid43` gelesen.
- Die drei Einzelwerte werden aus den unter `EOS.Config` gepflegten Alias-IDs bzw. als Fallback aus der Bilanzsicht gelesen.
- `Grid.Status` ist `OK`, wenn alle drei Werte numerisch vorliegen.

## Grid.Grid40

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid40.Power` | Zahl | W | ja | Zaehlpunkt 40 | geplant |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid40.Status` | Text |  | ja | Zaehlpunkt 40 | offen |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid40.LastUpdate` | Zahl | ms | ja | Zaehlpunkt 40 | geplant |

## Grid.Grid41

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid41.Power` | Zahl | W | ja | Zaehlpunkt 41 | geplant |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid41.Status` | Text |  | ja | Zaehlpunkt 41 | offen |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid41.LastUpdate` | Zahl | ms | ja | Zaehlpunkt 41 | geplant |

## Grid.Grid43

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid43.Power` | Zahl | W | ja | Zaehlpunkt 43 | geplant |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid43.Status` | Text |  | ja | Zaehlpunkt 43 | offen |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid43.LastUpdate` | Zahl | ms | ja | Zaehlpunkt 43 | geplant |

## PV

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.PV.Power` | Zahl | W | ja | PV-/Erzeugungswerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.PV.Status` | Text |  | ja | PV-/Erzeugungswerte | offen |
| `0_userdata.0.EOS.EnergyFlow.PV.LastUpdate` | Zahl | ms | ja | PV-/Erzeugungswerte | geplant |

Aktueller Stand:

- PV liest die produktive Victron-Summe `0_userdata.0.Victron.SUMME_PV`.
- Negative Werte werden zu `0` geklemmt.
- Wenn ein numerischer Wert vorliegt, ist der Status `OK`.

## Battery

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Battery.Power` | Zahl | W | ja | Battery-Sicht aus EOS-Battery-States | geplant |
| `0_userdata.0.EOS.EnergyFlow.Battery.SOC` | Zahl | % | ja | Battery-Sicht aus EOS-Battery-States | geplant |
| `0_userdata.0.EOS.EnergyFlow.Battery.Status` | Text |  | ja | Battery-Sicht aus EOS-Battery-States | offen |
| `0_userdata.0.EOS.EnergyFlow.Battery.LastUpdate` | Zahl | ms | ja | Battery-Sicht aus EOS-Battery-States | geplant |

Aktueller Stand:

- Battery wird aus `0_userdata.0.EOS.Battery.Summary.*` verdichtet.
- `SOC`, `Power` und `Status` werden aus den EOS-Battery-States übernommen.
- Die Sicht bleibt read-only und dient nur der Anzeige.

## House

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.House.Power` | Zahl | W | ja | Haus-/Verbrauchswerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.House.Status` | Text |  | ja | Haus-/Verbrauchswerte | offen |
| `0_userdata.0.EOS.EnergyFlow.House.LastUpdate` | Zahl | ms | ja | Haus-/Verbrauchswerte | geplant |

Aktueller Stand:

- House liest die produktive Victron-Summe `0_userdata.0.Victron.SUMME_Verbrauch`.
- Negative Werte werden zu `0` geklemmt.
- Wenn ein numerischer Wert vorliegt, ist der Status `OK`.

## Wallbox

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.Power` | Zahl | W | ja | Wallbox-/Ladewerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.Active` | Boolean |  | ja | Wallbox-/Ladewerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.Status` | Text |  | ja | Wallbox-/Ladewerte | offen |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.LastUpdate` | Zahl | ms | ja | Wallbox-/Ladewerte | geplant |

Aktueller Stand:

- Wallbox wird aus den drei konfigurierten go-e-Leistungsaliasen verdichtet.
- Die drei Werte werden aus `EOS.Config` gelesen und von kW nach W normiert.
- `Active` ist gesetzt, sobald die Gesamtleistung sinnvoll über einem kleinen Schwellenwert liegt.

## Summary

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Summary.Status` | Text |  | ja | konsolidierte Energiefluesse | geplant |
| `0_userdata.0.EOS.EnergyFlow.Summary.LastUpdate` | Zahl | ms | ja | konsolidierte Energiefluesse | geplant |

Aktueller Stand:

- Summary.Status verdichtet Grid, Battery, PV, House und Wallbox.
- Summary.LastUpdate wird bei jeder Verdichtung neu geschrieben.

## Communication

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Communication.OverallStatus` | Text |  | ja | Quellenstatus | geplant |
| `0_userdata.0.EOS.EnergyFlow.Communication.TimeoutCount` | Zahl |  | ja | Quellenstatus | geplant |
| `0_userdata.0.EOS.EnergyFlow.Communication.LastUpdate` | Zahl | ms | ja | Quellenstatus | geplant |

Aktueller Stand:

- OverallStatus verdichtet Grid, Battery, PV, House und Wallbox-Kommunikation.
- TimeoutCount zählt die Teilbereiche mit abweichendem Status.
- LastUpdate wird bei jeder Verdichtung gesetzt.

## Grundsatz

Alle States bleiben read-only.
Energy Flow V1 schreibt niemals auf Quellen oder Aktoren zurueck.
