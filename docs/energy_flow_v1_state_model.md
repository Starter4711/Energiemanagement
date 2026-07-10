# Energy Flow V1 State-Modell

## Oberer State-Baum

`0_userdata.0.EOS.EnergyFlow`

- `Grid`
- `PV`
- `Battery`
- `House`
- `Wallbox`
- `Summary`
- `Communication`

## Grid

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Grid.Power` | Zahl | W | ja | Netz-/Zaehlpunktwerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.Grid.Status` | Text |  | ja | Netz-/Zaehlpunktwerte | offen |
| `0_userdata.0.EOS.EnergyFlow.Grid.LastUpdate` | Zahl | ms | ja | Netz-/Zaehlpunktwerte | geplant |

## PV

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.PV.Power` | Zahl | W | ja | PV-/Erzeugungswerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.PV.Status` | Text |  | ja | PV-/Erzeugungswerte | offen |
| `0_userdata.0.EOS.EnergyFlow.PV.LastUpdate` | Zahl | ms | ja | PV-/Erzeugungswerte | geplant |

## Battery

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Battery.Power` | Zahl | W | ja | Battery-Sicht aus EOS-Battery-States | geplant |
| `0_userdata.0.EOS.EnergyFlow.Battery.SOC` | Zahl | % | ja | Battery-Sicht aus EOS-Battery-States | geplant |
| `0_userdata.0.EOS.EnergyFlow.Battery.Status` | Text |  | ja | Battery-Sicht aus EOS-Battery-States | offen |
| `0_userdata.0.EOS.EnergyFlow.Battery.LastUpdate` | Zahl | ms | ja | Battery-Sicht aus EOS-Battery-States | geplant |

## House

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.House.Power` | Zahl | W | ja | Haus-/Verbrauchswerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.House.Status` | Text |  | ja | Haus-/Verbrauchswerte | offen |
| `0_userdata.0.EOS.EnergyFlow.House.LastUpdate` | Zahl | ms | ja | Haus-/Verbrauchswerte | geplant |

## Wallbox

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.Power` | Zahl | W | ja | Wallbox-/Ladewerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.Active` | Boolean |  | ja | Wallbox-/Ladewerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.Status` | Text |  | ja | Wallbox-/Ladewerte | offen |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.LastUpdate` | Zahl | ms | ja | Wallbox-/Ladewerte | geplant |

## Summary

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Summary.Status` | Text |  | ja | konsolidierte Energiefluesse | geplant |
| `0_userdata.0.EOS.EnergyFlow.Summary.LastUpdate` | Zahl | ms | ja | konsolidierte Energiefluesse | geplant |

## Communication

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Communication.OverallStatus` | Text |  | ja | Quellenstatus | geplant |
| `0_userdata.0.EOS.EnergyFlow.Communication.TimeoutCount` | Zahl |  | ja | Quellenstatus | geplant |
| `0_userdata.0.EOS.EnergyFlow.Communication.LastUpdate` | Zahl | ms | ja | Quellenstatus | geplant |

## Grundsatz

Alle States bleiben read-only.
Energy Flow V1 schreibt niemals auf Quellen oder Aktoren zurueck.
