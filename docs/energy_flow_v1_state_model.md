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
| `0_userdata.0.EOS.EnergyFlow.Grid.Import` | Zahl | W | ja | Netz-/Zaehlpunktwerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.Grid.Export` | Zahl | W | ja | Netz-/Zaehlpunktwerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.Grid.Status` | Text |  | ja | Netz-/Zaehlpunktwerte | offen |

## PV

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.PV.Power` | Zahl | W | ja | PV-/Erzeugungswerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.PV.Status` | Text |  | ja | PV-/Erzeugungswerte | offen |

## Battery

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Battery.Power` | Zahl | W | ja | Battery-Sicht aus EOS-Battery-States | geplant |
| `0_userdata.0.EOS.EnergyFlow.Battery.SOC` | Zahl | % | ja | Battery-Sicht aus EOS-Battery-States | geplant |
| `0_userdata.0.EOS.EnergyFlow.Battery.Status` | Text |  | ja | Battery-Sicht aus EOS-Battery-States | offen |

## House

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.House.Power` | Zahl | W | ja | Haus-/Verbrauchswerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.House.Status` | Text |  | ja | Haus-/Verbrauchswerte | offen |

## Wallbox

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.Power` | Zahl | W | ja | Wallbox-/Ladewerte | geplant |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.Status` | Text |  | ja | Wallbox-/Ladewerte | offen |

## Summary

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Summary.Status` | Text |  | ja | konsolidierte Energiefluesse | geplant |
| `0_userdata.0.EOS.EnergyFlow.Summary.PowerBalance` | Zahl | W | ja | konsolidierte Energiefluesse | geplant |
| `0_userdata.0.EOS.EnergyFlow.Summary.Direction` | Text |  | ja | konsolidierte Energiefluesse | offen |

## Communication

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Communication.Status` | Text |  | ja | Quellenstatus | geplant |
| `0_userdata.0.EOS.EnergyFlow.Communication.LastUpdate` | Text |  | ja | Quellenstatus | geplant |
| `0_userdata.0.EOS.EnergyFlow.Communication.AgeSeconds` | Zahl | s | ja | Quellenstatus | geplant |
| `0_userdata.0.EOS.EnergyFlow.Communication.Grid` | Text |  | ja | Quellenstatus | offen |
| `0_userdata.0.EOS.EnergyFlow.Communication.PV` | Text |  | ja | Quellenstatus | offen |
| `0_userdata.0.EOS.EnergyFlow.Communication.Battery` | Text |  | ja | Quellenstatus | offen |
| `0_userdata.0.EOS.EnergyFlow.Communication.House` | Text |  | ja | Quellenstatus | offen |
| `0_userdata.0.EOS.EnergyFlow.Communication.Wallbox` | Text |  | ja | Quellenstatus | offen |

## Grundsatz

Alle States bleiben read-only.
Energy Flow V1 schreibt niemals auf Quellen oder Aktoren zurueck.

