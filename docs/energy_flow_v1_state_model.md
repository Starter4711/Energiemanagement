# Energy Flow V1 State-Modell

## Oberer State-Baum

`0_userdata.0.EOS.EnergyFlow`

- `Grid`
  - `Grid40`
  - `Grid41`
  - `Grid43`
- `PV`
- `Battery`
- `House`
- `Wallbox`
- `Summary`
- `Communication`

## Grid

Die drei Netz-Zählpunkte bleiben vollständig getrennt. Es gibt keinen State `EnergyFlow.Grid.Power` und keine Grid-Gesamtleistung.

### Grid 40 – alte Wohnung

| Ziel-State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid40.Power` | Zahl | W | ja | `0_userdata.0.EOS.Grid.Sources.Grid40.Power` | spezifiziert |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid40.Status` | Text |  | ja | `0_userdata.0.EOS.Grid.Sources.Grid40.Status` | spezifiziert |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid40.LastUpdate` | Zahl | ms | ja | `0_userdata.0.EOS.Grid.Sources.Grid40.LastUpdate` | spezifiziert |

### Grid 41 – Halle

| Ziel-State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid41.Power` | Zahl | W | ja | `0_userdata.0.EOS.Grid.Sources.Grid41.Power` | spezifiziert |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid41.Status` | Text |  | ja | `0_userdata.0.EOS.Grid.Sources.Grid41.Status` | spezifiziert |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid41.LastUpdate` | Zahl | ms | ja | `0_userdata.0.EOS.Grid.Sources.Grid41.LastUpdate` | spezifiziert |

### Grid 43 – Haus

| Ziel-State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid43.Power` | Zahl | W | ja | `0_userdata.0.EOS.Grid.Sources.Grid43.Power` | spezifiziert |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid43.Status` | Text |  | ja | `0_userdata.0.EOS.Grid.Sources.Grid43.Status` | spezifiziert |
| `0_userdata.0.EOS.EnergyFlow.Grid.Grid43.LastUpdate` | Zahl | ms | ja | `0_userdata.0.EOS.Grid.Sources.Grid43.LastUpdate` | spezifiziert |

### Grid-Regeln

- positiv bedeutet Netzbezug
- negativ bedeutet Netzeinspeisung
- Leistungswerte sind immer numerisch
- Statuswerte sind Strings
- ein ungültiger Grid-Leistungswert wird als `0 W` ausgegeben und durch seinen Status gekennzeichnet
- Grid 42 wird nicht aufgenommen
- RS450 wird keinem Grid zugeordnet
- die drei Grid-Leistungen werden nicht summiert
- die bisherigen States `EnergyFlow.Grid.Power`, `EnergyFlow.Grid.Status` und `EnergyFlow.Grid.LastUpdate` gehören nicht zum Zielmodell und müssen bei einer späteren Implementierung nach Backup entfernt werden

## PV

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.PV.Power` | Zahl | W | ja | `0_userdata.0.EOS.PV.Summary.TotalPower` | implementiert |
| `0_userdata.0.EOS.EnergyFlow.PV.Status` | Text |  | ja | `0_userdata.0.EOS.PV.Summary.Status` | implementiert |
| `0_userdata.0.EOS.EnergyFlow.PV.LastUpdate` | Zahl | ms | ja | `0_userdata.0.EOS.PV.Summary.LastUpdate` | implementiert |

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
| `0_userdata.0.EOS.EnergyFlow.Wallbox.Power` | Zahl | W | ja | `0_userdata.0.EOS.Wallbox.Summary.Power` | implementiert |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.Active` | Boolean |  | ja | `0_userdata.0.EOS.Wallbox.Summary.Active` | implementiert |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.Status` | Text |  | ja | `0_userdata.0.EOS.Wallbox.Summary.Status` | implementiert |
| `0_userdata.0.EOS.EnergyFlow.Wallbox.LastUpdate` | Zahl | ms | ja | `0_userdata.0.EOS.Wallbox.Summary.LastUpdate` | implementiert |

## Summary

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Summary.Status` | Text |  | ja | konsolidierte Teilbereichsstatus | implementiert |
| `0_userdata.0.EOS.EnergyFlow.Summary.LastUpdate` | Zahl | ms | ja | letzte Gesamtbewertung | implementiert |

`Summary` enthält keine Grid-Leistung und keine rechnerische Summe der drei Netz-Zählpunkte.

## Communication

| State | Datentyp | Einheit | read-only | Herkunft | Status |
| --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.EnergyFlow.Communication.OverallStatus` | Text |  | ja | Status aller angebundenen Quellen | implementiert |
| `0_userdata.0.EOS.EnergyFlow.Communication.TimeoutCount` | Zahl |  | ja | Anzahl ungültiger oder fehlender Teilquellen | implementiert |
| `0_userdata.0.EOS.EnergyFlow.Communication.LastUpdate` | Zahl | ms | ja | letzte Kommunikationsbewertung | implementiert |

Bei einer späteren Implementierung werden Grid 40, Grid 41 und Grid 43 als drei getrennte Kommunikationsquellen bewertet.

## Grundsatz

Alle States bleiben read-only.
Energy Flow V1 schreibt niemals auf Quellen oder Aktoren zurück.
Diese Änderung spezifiziert ausschließlich das Zielmodell; sie verändert weder Code noch Live-System.
