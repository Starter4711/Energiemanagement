# Energy Flow V1 – Quellenanalyse für PV, House und Wallbox

## 1. Ausgangslage

`Energy_Flow_V1` ist read-only und ereignisgetrieben. Grid und Battery sind bereits an belegte, verdichtete EOS-interne Quellen angebunden. PV, House und Wallbox bleiben im aktuellen Stand bewusst `UNKNOWN`.

Diese Analyse bewertet ausschließlich den im Repository belegten Bestand. Eine Quelle wird weder anhand ihres Namens noch anhand eines einzelnen Live-Werts freigegeben. Nicht belegbare Eigenschaften sind als `Unklar` gekennzeichnet.

## 2. Quellmatrix

| Domäne | Kandidatenquelle | Repository-Nachweis | Ebene | Einheit | Vorzeichen | Aktualität | Bewertung |
|---|---|---|---|---|---|---|---|
| PV | `0_userdata.0.Victron.SUMME_PV` | Anlage und Berechnung in `iobroker/scripts/common/Victron_INIT.js`; Objekt und Snapshot in `exports/live_inventory/` | fachlich verdichteter Altbestand | W | Erzeugung wird durch `min: 0` als nichtnegativ modelliert | sekündliche Neuberechnung; keine Kommunikations- oder Quellenalterbewertung | bedingt geeignet |
| PV | `0_userdata.0.Victron.HomeGrid_PV_Summe` | Berechnung in `iobroker/scripts/common/Victron_INIT.js` aus SMA, Fronius, MPPT RS450 und optional SolarEdge | teilverdichteter Altbestand | W | als nichtnegative Erzeugungsleistung modelliert | Auslösung nur bei Änderung von `alias.0.EM24 New Grid.Power`; Quellenalter nicht bewertet | bedingt geeignet |
| PV | `alias.0.Fronius.AC-Power`, `alias.0.Fronius.AC-Power_10kW`, `alias.0.SMA.Power`, `alias.0.SE.Power`, `alias.0.MPPT RS450/100.*` | Konfiguration in `iobroker/scripts/energiemanagement/Config.js`; Verwendung in `iobroker/scripts/common/Victron_INIT.js`; Alias-/MQTT-Inventare unter `exports/` | Alias- beziehungsweise Hardware-Rohquellen | W für die belegten AC-Leistungspfade; beim RS450 sind Strom und Spannung beziehungsweise String-Leistungen getrennt | Unklar über alle Quellen hinweg | State-Zeitstempel sind inventarisiert; gemeinsame Kommunikationsbewertung fehlt | nicht geeignet |
| House | `0_userdata.0.Victron.SUMME_Verbrauch` | Anlage und Berechnung in `iobroker/scripts/common/Victron_INIT.js`; Objekt und Snapshot in `exports/live_inventory/` | fachlich verdichteter Altbestand | W | Verbrauch wird als nichtnegativ modelliert | sekündliche Neuberechnung; keine Kommunikations- oder Quellenalterbewertung | bedingt geeignet |
| House | `0_userdata.0.Victron.HomeGrid_Verbrauch` und `0_userdata.0.Victron.HallGrid_Verbrauch` | Anlage und Berechnung aus Victron-Phasenwerten in `iobroker/scripts/common/Victron_INIT.js` | teilverdichteter Altbestand | W | Verbrauch wird als nichtnegativ modelliert; bei Home wird SolarEdge abhängig von `SE_auf_Grid_New` abgezogen | ereignisgetrieben über gespiegelte EM24-States; Aktualität der eigentlichen Eingänge wird nicht bewertet | bedingt geeignet |
| House | `alias.0.MP-ESS.ESS_Consumption_L1..L3` und `alias.0.MP-BAT.BAT_Consumption_L1..L3` | `iobroker/scripts/energiemanagement/Config.js` und `iobroker/scripts/common/Victron_INIT.js` | Victron-Alias-Rohquellen | W | Unklar | einzelne State-Aktualität vorhanden; keine gemeinsame Kommunikationsbewertung | nicht geeignet |
| Wallbox | `alias.0.go-E.powerV3`, `alias.0.go-E.powerV4`, `alias.0.go-E.go-E-V4-Halle` | `iobroker/scripts/energiemanagement/Config.js`, `docs/energiemanagement-manifest.md` und `exports/live_inventory/iobroker_objects_alias.json` | Alias-Rohquellen je Wallbox | kW | Unklar; als Verbrauchsleistung sind positive Live-Werte belegt, aber keine formelle Konvention | einzelne State-Zeitstempel vorhanden; keine gemeinsame Kommunikationsbewertung | bedingt geeignet |
| Wallbox | `go-e.0.energy.power`, `go-e.1.energy.power` und go-e-MQTT-Pfade | Verwendung in `iobroker/scripts/common/go-E_V3_Phasen.js`, `iobroker/scripts/common/go-E_V4_Phasen.js` und weiteren go-e-Skripten; Adapter-/MQTT-Inventare unter `exports/` | direkte Adapter- beziehungsweise MQTT-Rohquellen | kW für die in den Skripten verwendeten Adapter-Leistungspfade; MQTT-Einheit Unklar | Unklar | Adapter- beziehungsweise MQTT-Zeitstempel; keine EOS-Kommunikationsbewertung | nicht geeignet |

## 3. Detailanalyse

### 3.1 PV

Belegt sind vier AC-PV-Leistungspfade in `iobroker/scripts/energiemanagement/Config.js`:

- `alias.0.Fronius.AC-Power_10kW`
- `alias.0.SMA.Power`
- `alias.0.Fronius.AC-Power`
- `alias.0.SE.Power`

Zusätzlich sind für den MPPT RS450 die Alias-Pfade `alias.0.MPPT RS450/100.DC-Current`, `alias.0.MPPT RS450/100.DC-Voltage`, `alias.0.MPPT RS450/100.P String1` und `alias.0.MPPT RS450/100.P String2` konfiguriert. `iobroker/scripts/common/Victron_INIT.js` berechnet daraus beziehungsweise aus gespiegelten Werten:

- `0_userdata.0.Victron.MPPT_RS450_Power`
- `0_userdata.0.Victron.HomeGrid_PV_Summe`
- `0_userdata.0.Victron.SUMME_PV`

`SUMME_PV` ist die am stärksten verdichtete vorhandene Quelle. Sie wird jedoch von einem schreibbaren Blockly-State im Common-Altbestand sekündlich aktualisiert. Die Einzelquellen werden weder auf Vollständigkeit noch auf Kommunikationsstatus oder Alter geprüft. Die bedingte Einbeziehung von SolarEdge über `0_userdata.0.Victron.SE_auf_Grid_New` ist belegt; die fachliche Gültigkeit dieses Umschaltzustands für eine stabile EOS-Schnittstelle bleibt `Unklar`.

Konkurrierend existieren somit die Roh-/Aliasquellen, die Teilverdichtung `HomeGrid_PV_Summe` und die Gesamtverdichtung `SUMME_PV`. Eine direkte Anbindung von `Energy_Flow_V1` an den Common-Altbestand würde die geforderte stabile EOS-Grenze umgehen.

### 3.2 House

`iobroker/scripts/common/Victron_INIT.js` legt folgende verbrauchsbezogene Zustände an:

- `0_userdata.0.Victron.HomeGrid_Verbrauch`
- `0_userdata.0.Victron.HallGrid_Verbrauch`
- `0_userdata.0.Victron.SUMME_Verbrauch`

`HomeGrid_Verbrauch` wird aus `alias.0.MP-ESS.ESS_Consumption_L1..L3` gebildet und abhängig von `SE_auf_Grid_New` um `alias.0.SE.Power` korrigiert. `HallGrid_Verbrauch` summiert `alias.0.MP-BAT.BAT_Consumption_L1..L3`. `SUMME_Verbrauch` wird dagegen sekündlich aus `HomeGrid_PV_Summe`, `HallGrid_PV_Power`, `EM24_HomeGrid_Power` und `EM24_HallGrid_Power` berechnet.

Damit konkurrieren eine Summenbildung über Energieflussgrößen und zwei Victron-Verbrauchssichten. Ob `SUMME_Verbrauch` exakt der in `Energy_Flow_V1.House.Power` geforderten Gesamtlast aller drei Zählpunkte entspricht, ist aus dem Repository nicht sicher belegt. Insbesondere ist die Behandlung des dritten Zählpunkts nur indirekt und damit `Unklar`.

Alle drei Zustände sind read-fähig, aber zugleich `write: true`; sie sind keine read-only EOS-Schnittstelle. Eine belastbare Aktualitäts- und Kommunikationsbewertung der verwendeten Teilquellen fehlt.

### 3.3 Wallbox

Für drei Wallboxen sind in `iobroker/scripts/energiemanagement/Config.js` konkrete Leistungspfade hinterlegt:

- `alias.0.go-E.powerV3`
- `alias.0.go-E.powerV4`
- `alias.0.go-E.go-E-V4-Halle`

`docs/energiemanagement-manifest.md` dokumentiert für diese drei Pfade die Einheit kW. Die Aliasobjekte sind in `exports/live_inventory/iobroker_objects_alias.json` und ihre Beziehungen in `exports/live_inventory/object_relations.json` belegt. Daneben greifen die Common-Skripte direkt auf go-e-Adapterzustände wie `go-e.0.energy.power` und `go-e.1.energy.power` sowie auf Lade- und Phasensteuerzustände zu.

Eine gemeinsame Wallbox-Gesamtleistung existiert im Repository außerhalb des noch `UNKNOWN` bleibenden Zielstates `0_userdata.0.EOS.EnergyFlow.Wallbox.Power` nicht. Ebenso fehlen ein gemeinsamer Kommunikationsstatus, eine definierte Stale-Schwelle und eine belegte Regel für `Wallbox.Active`. Die Leistungspfade sind daher als Eingänge eines vorgelagerten Moduls brauchbar, aber nicht als direkte stabile EOS-Schnittstelle.

## 4. Architekturentscheidung

### PV

**Vorgelagertes EOS-Modul erforderlich.**

Das Modul muss die belegten PV-Teilquellen konsolidieren, ihre Verfügbarkeit und Aktualität bewerten und eine read-only EOS-PV-Leistung in W bereitstellen. `0_userdata.0.Victron.SUMME_PV` kann als fachlicher Vergleichskandidat dienen, darf aber ohne geklärte Quellen- und Aktualitätssemantik nicht direkt freigegeben werden.

### House

**Repository-Nachweis reicht nicht aus.**

Mehrere bestehende Verbrauchsberechnungen sind belegt, ihre Abdeckung der drei Zählpunkte und ihre Übereinstimmung mit der Energy-Flow-Domäne `House` jedoch nicht. Vor einer Modul- oder Direktanbindung muss die fachliche Bilanzgrenze von `House.Power` geklärt werden.

### Wallbox

**Vorgelagertes EOS-Modul erforderlich.**

Die drei belegten Leistungs-Aliasse müssen einheitlich nach W normiert, summiert und hinsichtlich Kommunikation beziehungsweise Aktualität bewertet werden. Erst dessen read-only EOS-Ausgang ist eine geeignete Quelle für `Energy_Flow_V1`.

## 5. Empfohlener nächster Implementierungsschritt

Als minimaler nächster Schritt ist ein read-only `Wallbox_Flow_V1` zu spezifizieren. Dafür sind alle drei Eingangs-Aliasse, ihre Einheit kW und ihre Zuordnung im Repository belegt; das Modul soll ausschließlich Gesamtleistung in W, Aktivstatus, Status und LastUpdate verdichten. Vor der Implementierung sind noch die formelle Vorzeichenkonvention, die Aktiv-Schwelle und die Stale-Schwelle festzulegen.

## 6. Offene Punkte

- PV: Die verbindliche Vollständigkeit der in `SUMME_PV` enthaltenen Erzeuger ist `Unklar`.
- PV: Die fachliche Bedeutung und Verlässlichkeit von `SE_auf_Grid_New` für die PV-Gesamtsicht ist `Unklar`.
- PV: Einheitliche Kommunikations- und Stale-Kriterien aller PV-Quellen sind `Unklar`.
- House: Die genaue fachliche Bilanzgrenze von `House.Power`, insbesondere für den dritten Zählpunkt, ist `Unklar`.
- House: Ob `SUMME_Verbrauch` oder die Summe der Victron-Verbrauchsphasen die fachlich richtige Grundlage ist, ist `Unklar`.
- House: Die Vorzeichenkonvention der einzelnen Consumption- und Korrekturpfade ist nicht vollständig dokumentiert und bleibt `Unklar`.
- Wallbox: Die formelle Vorzeichenkonvention der drei Leistungs-Aliasse ist `Unklar`.
- Wallbox: Die Schwelle für `Active` ist `Unklar`.
- Wallbox: Kommunikations- und Stale-Schwellen je Wallbox sind `Unklar`.
- Wallbox: Das Verhalten bei Ausfall nur einer von drei Quellen ist `Unklar`.
- Für keine der drei Domänen wird mit dieser Analyse eine Implementierung oder direkte Quelle freigegeben.
