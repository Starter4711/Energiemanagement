# Battery Supervisor V1 State Model

## Zweck

Dieses Dokument definiert die stabile EOS-State-Struktur fuer Battery Supervisor V1 unter `0_userdata.0.EOS.Battery.*`.
Es ist eine reine Spezifikation.

## Verbindliche Grundsaetze

1. EOS-States duerfen nach der Veröffentlichung nicht umbenannt werden.
2. Neue Versionen duerfen nur neue States ergaenzen.
3. VIS2 liest ausschliesslich EOS-States.
4. Der Supervisor kennt die Original-Datenquellen, VIS2 nicht.
5. In der VIS gibt es keine Logik.

## Versionsregel

- `Version` beschreibt die fachliche Mindestversion, ab der ein State in V1 verfuegbar sein muss.
- Alle hier dokumentierten States gehoeren zum stabilen V1-API-Umfang.

## State-Referenz

### Summary

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Summary.HealthScore` | number | % | EOS-Logik aus Health, SmartShunt, Packs, Communication | Zusammengefasster Gesundheitswert der Batterie | Bei jeder relevanten Quellaktualisierung bzw. Bewertung | Ampel- und KPI-Anzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Summary.Status` | string | - | EOS-Logik | Gesamtstatus der Batterie, z. B. `ok`, `warning`, `critical`, `unknown` | Ereignis- und bewertungsgetrieben | Hauptstatus der Batterieseite | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Summary.SOC` | number | % | SmartShunt | Aufbereiteter Gesamt-SOC fuer VIS2 | Bei SmartShunt-Aktualisierung | SOC-Anzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Summary.Voltage` | number | V | SmartShunt | Gesamt-Batteriespannung | Bei SmartShunt-Aktualisierung | Spannungsanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Summary.Current` | number | A | SmartShunt | Gesamt-Batteriestrom, positiv oder negativ je Konvention des Systems | Bei SmartShunt-Aktualisierung | Stromanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Summary.Power` | number | W | SmartShunt | Berechnete Batterieleistung | Bei SmartShunt-Aktualisierung | Leistungsanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Summary.MaxVDiff` | number | mV | Packs, Heltec | Maximale Spannungsdifferenz ueber alle bekannten Packs | Bei Pack- oder Heltec-Aktualisierung | Diagnosewert fuer Detailansicht | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Summary.MaxTemperature` | number | °C | Packs, BMS | Hoechste relevante Batterietemperatur | Bei Temperaturaktualisierung | Temperatur-KPI | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Summary.ActiveWarnings` | number | - | Warnings | Anzahl aktuell aktiver Warnungen | Bei Warnungswechsel | Warnzaehler | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Summary.Recommendation` | string | - | Recommendation | Kurztext der aktuell wichtigsten Handlungsempfehlung | Bei Empfehlungswechsel | Kurzempfehlung auf Hauptseite | REQ-BAT-SUPERVISOR-V1 | V1 |

### SmartShunt

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.SmartShunt.SOC` | number | % | SmartShunt | Fuehrender Gesamt-SOC | Bei SmartShunt-Aktualisierung | Primärer SOC-Wert | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.SmartShunt.Voltage` | number | V | SmartShunt | Gesamtspannung der Batterie | Bei SmartShunt-Aktualisierung | Primäre Spannung | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.SmartShunt.Current` | number | A | SmartShunt | Batteriestrom | Bei SmartShunt-Aktualisierung | Primärer Strom | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.SmartShunt.Power` | number | W | SmartShunt | Berechnete Leistung aus Strom und Spannung | Bei SmartShunt-Aktualisierung | Leistungsdetail | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.SmartShunt.ConsumedAh` | number | Ah | SmartShunt | Entnommene oder gespeicherte Kapazitaet in Ah, je Konvention der Quelle | Bei SmartShunt-Aktualisierung | Diagnosewert | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.SmartShunt.DischargedEnergy` | number | Wh | SmartShunt | Bisher entladene Energie | Bei SmartShunt-Aktualisierung | Diagnosewert | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.SmartShunt.ChargedEnergy` | number | Wh | SmartShunt | Bisher geladene Energie | Bei SmartShunt-Aktualisierung | Diagnosewert | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.SmartShunt.TimeToGo` | number | min | SmartShunt | Verbleibende Zeit bis zur Entladung unter Annahmen der Quelle | Bei SmartShunt-Aktualisierung | Optionaler Diagnosewert | REQ-BAT-SUPERVISOR-V1 | V1 |

### Health

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Health.Score` | number | % | EOS-Logik | Bewerteter Gesundheitswert der Batterie | Bei jeder relevanten Bewertung | Detail-KPI | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Health.Status` | string | - | EOS-Logik | Fachlicher Gesundheitsstatus, z. B. `good`, `degraded`, `critical`, `unknown` | Bewertungsgetrieben | Statusanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Health.Reason` | string | - | EOS-Logik | Kurzbegruendung fuer den aktuellen Health-Status | Bei Statuswechsel | Diagnosehinweis | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Health.LastUpdate` | string | ISO-8601 | EOS-Logik | Zeitpunkt der letzten Health-Bewertung | Bei jeder Health-Neuberechnung | Aktualitaetsanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |

### Packs

#### Pack1

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Status` | string | - | Heltec, BMS, EOS-Logik | Packstatus, z. B. `ok`, `warning`, `critical`, `offline`, `unknown` | Bei Pack- oder Quellenwechsel | Packstatus-Kachel | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Voltage` | number | V | Heltec | Packspannung | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Current` | number | A | Heltec, BMS | Packstrom, sofern fachlich verfuegbar | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Power` | number | W | EOS-Logik | Berechnete Packleistung | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack1.TemperatureMax` | number | °C | Heltec | Maximale Temperatur innerhalb des Packs | Bei Temperaturaktualisierung | Packtemperatur | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack1.VDiff` | number | mV | Heltec | Spannungsdifferenz innerhalb des Packs | Bei Heltec-Aktualisierung | Diagnosewert | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Balancing` | boolean | - | BMS, Heltec | Balancing-Status des Packs | Bei Balancingwechsel | Diagnoseindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack1.Communication` | string | - | Communication | Kommunikationsstatus des Packs oder der zugeordneten Quelle | Bei Kommunikationswechsel | Verfuegbarkeitsanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack1.WarningCount` | number | - | Warnings | Anzahl aktiver Pack-Warnungen | Bei Warnungswechsel | Pack-Warnzaehler | REQ-BAT-SUPERVISOR-V1 | V1 |

#### Pack2

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Status` | string | - | Heltec, BMS, EOS-Logik | Packstatus, z. B. `ok`, `warning`, `critical`, `offline`, `unknown` | Bei Pack- oder Quellenwechsel | Packstatus-Kachel | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Voltage` | number | V | Heltec | Packspannung | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Current` | number | A | Heltec, BMS | Packstrom, sofern fachlich verfuegbar | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Power` | number | W | EOS-Logik | Berechnete Packleistung | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack2.TemperatureMax` | number | °C | Heltec | Maximale Temperatur innerhalb des Packs | Bei Temperaturaktualisierung | Packtemperatur | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack2.VDiff` | number | mV | Heltec | Spannungsdifferenz innerhalb des Packs | Bei Heltec-Aktualisierung | Diagnosewert | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Balancing` | boolean | - | BMS, Heltec | Balancing-Status des Packs | Bei Balancingwechsel | Diagnoseindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack2.Communication` | string | - | Communication | Kommunikationsstatus des Packs oder der zugeordneten Quelle | Bei Kommunikationswechsel | Verfuegbarkeitsanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack2.WarningCount` | number | - | Warnings | Anzahl aktiver Pack-Warnungen | Bei Warnungswechsel | Pack-Warnzaehler | REQ-BAT-SUPERVISOR-V1 | V1 |

#### Pack3

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Status` | string | - | Heltec, BMS, EOS-Logik | Packstatus, z. B. `ok`, `warning`, `critical`, `offline`, `unknown` | Bei Pack- oder Quellenwechsel | Packstatus-Kachel | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Voltage` | number | V | Heltec | Packspannung | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Current` | number | A | Heltec, BMS | Packstrom, sofern fachlich verfuegbar | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Power` | number | W | EOS-Logik | Berechnete Packleistung | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack3.TemperatureMax` | number | °C | Heltec | Maximale Temperatur innerhalb des Packs | Bei Temperaturaktualisierung | Packtemperatur | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack3.VDiff` | number | mV | Heltec | Spannungsdifferenz innerhalb des Packs | Bei Heltec-Aktualisierung | Diagnosewert | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Balancing` | boolean | - | BMS, Heltec | Balancing-Status des Packs | Bei Balancingwechsel | Diagnoseindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack3.Communication` | string | - | Communication | Kommunikationsstatus des Packs oder der zugeordneten Quelle | Bei Kommunikationswechsel | Verfuegbarkeitsanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack3.WarningCount` | number | - | Warnings | Anzahl aktiver Pack-Warnungen | Bei Warnungswechsel | Pack-Warnzaehler | REQ-BAT-SUPERVISOR-V1 | V1 |

#### Pack4

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Status` | string | - | Heltec, BMS, EOS-Logik | Packstatus, z. B. `ok`, `warning`, `critical`, `offline`, `unknown` | Bei Pack- oder Quellenwechsel | Packstatus-Kachel | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Voltage` | number | V | Heltec | Packspannung | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Current` | number | A | Heltec, BMS | Packstrom, sofern fachlich verfuegbar | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Power` | number | W | EOS-Logik | Berechnete Packleistung | Bei Pack-Aktualisierung | Packdaten | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack4.TemperatureMax` | number | °C | Heltec | Maximale Temperatur innerhalb des Packs | Bei Temperaturaktualisierung | Packtemperatur | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack4.VDiff` | number | mV | Heltec | Spannungsdifferenz innerhalb des Packs | Bei Heltec-Aktualisierung | Diagnosewert | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Balancing` | boolean | - | BMS, Heltec | Balancing-Status des Packs | Bei Balancingwechsel | Diagnoseindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack4.Communication` | string | - | Communication | Kommunikationsstatus des Packs oder der zugeordneten Quelle | Bei Kommunikationswechsel | Verfuegbarkeitsanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Packs.Pack4.WarningCount` | number | - | Warnings | Anzahl aktiver Pack-Warnungen | Bei Warnungswechsel | Pack-Warnzaehler | REQ-BAT-SUPERVISOR-V1 | V1 |

### Communication

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Communication.SmartShunt` | string | - | EOS-Logik | Kommunikationsstatus des SmartShunt, z. B. `online`, `offline`, `stale`, `unknown` | Bei Verbindungswechsel | Quellstatus | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Communication.Gobel` | string | - | EOS-Logik | Kommunikationsstatus von Gobel / Pace BMS | Bei Verbindungswechsel | Quellstatus | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Communication.Heltec` | string | - | EOS-Logik | Kommunikationsstatus von Heltec | Bei Verbindungswechsel | Quellstatus | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Communication.MQTT` | string | - | EOS-Logik | Kommunikationsstatus der relevanten MQTT-Strecke | Bei Verbindungswechsel | Transportstatus | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Communication.LastUpdate` | string | ISO-8601 | EOS-Logik | Zeitpunkt der letzten erfolgreichen Kommunikationsbewertung | Bei jeder Kommunikationsneuberechnung | Aktualitaetsanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |

### Warnings

Die Warnings-Gruppe enthaelt alle aktiven Warnungen als einzelne States. Jeder State ist ein harter, eigenstaendiger EOS-Status.

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Warnings.SmartShuntOffline` | boolean | - | Communication | SmartShunt ist nicht oder nicht ausreichend erreichbar | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.GobelOffline` | boolean | - | Communication | Gobel / Pace BMS ist nicht oder nicht ausreichend erreichbar | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.HeltecOffline` | boolean | - | Communication | Heltec ist nicht oder nicht ausreichend erreichbar | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.MQTTOffline` | boolean | - | Communication | Relevante MQTT-Kommunikation ist gestoert | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.LowSOC` | boolean | - | SmartShunt, Settings | SOC liegt unterhalb der definierten Untergrenze | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.HighSOC` | boolean | - | SmartShunt, Settings | SOC liegt oberhalb der definierten Obergrenze | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.HighTemperature` | boolean | - | Packs, BMS, Settings | Temperatur hat Warnschwelle erreicht oder ueberschritten | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.CriticalTemperature` | boolean | - | Packs, BMS, Settings | Kritische Temperaturgrenze erreicht oder ueberschritten | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.HighVDiffNormal` | boolean | - | Packs, Settings | Spannungsdifferenz im normalen Zustand ueber Warnschwelle | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.CriticalVDiffNormal` | boolean | - | Packs, Settings | Spannungsdifferenz im normalen Zustand ueber kritischer Schwelle | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.HighVDiffBalancing` | boolean | - | Packs, Settings | Spannungsdifferenz waehrend Balancing ueber Warnschwelle | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.CriticalVDiffBalancing` | boolean | - | Packs, Settings | Spannungsdifferenz waehrend Balancing ueber kritischer Schwelle | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Warnings.BMSWarning` | boolean | - | Gobel / Pace BMS | BMS meldet eine allgemeine Schutz- oder Warnlage | Bei Statuswechsel | Warnindikator | REQ-BAT-SUPERVISOR-V1 | V1 |

### Recommendation

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Recommendation.Text` | string | - | EOS-Logik | Textuelle Handlungsempfehlung fuer den aktuellen Betriebszustand | Bei Empfehlungswechsel | Empfehlungstext | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Recommendation.Level` | string | - | EOS-Logik | Empfehlungsstufe, z. B. `info`, `watch`, `action`, `critical` | Bei Empfehlungswechsel | Priorisierung | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Recommendation.Reason` | string | - | EOS-Logik | Kurzbegruendung fuer die Empfehlung | Bei Empfehlungswechsel | Diagnosehinweis | REQ-BAT-SUPERVISOR-V1 | V1 |

### Settings

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Settings.MinSOC` | number | % | Konfiguration | Untere SOC-Grenze fuer Bewertung und Warnlogik | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.MaxSOC` | number | % | Konfiguration | Obere SOC-Grenze fuer Bewertung und Warnlogik | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.MaxChargeCurrent` | number | A | Konfiguration | Maximal zulässiger Ladestrom | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.MaxDischargeCurrent` | number | A | Konfiguration | Maximal zulässiger Entladestrom | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.WallboxSupportMaxPower` | number | W | Konfiguration | Maximale Batterieleistung fuer Wallbox-Unterstuetzung | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.WallboxSupportMinSOC` | number | % | Konfiguration | Untere SOC-Grenze fuer Wallbox-Unterstuetzung | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.TargetVoltageSummer` | number | V | Konfiguration | Zielspannung fuer sommerliche Ladebewertung | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.TargetVoltageWinter` | number | V | Konfiguration | Zielspannung fuer winterliche Ladebewertung | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.TemperatureWarning` | number | °C | Konfiguration | Temperatur-Warnschwelle | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.TemperatureCritical` | number | °C | Konfiguration | Temperatur-Kritischschwelle | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.VDiffWarningNormal` | number | mV | Konfiguration | VDiff-Warnschwelle fuer normalen Betrieb | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.VDiffCriticalNormal` | number | mV | Konfiguration | VDiff-Kritischschwelle fuer normalen Betrieb | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.VDiffWarningBalancing` | number | mV | Konfiguration | VDiff-Warnschwelle waehrend Balancing | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Settings.VDiffCriticalBalancing` | number | mV | Konfiguration | VDiff-Kritischschwelle waehrend Balancing | Bei Konfigurationsaenderung | Grenzwertanzeige | REQ-BAT-SUPERVISOR-V1 | V1 |

### Statistics

Die Statistics-Gruppe wird fuer spaetere Verlaufe vorbereitet.
Historienlogik wird in diesem Dokument nicht beschrieben.

| State | Datentyp | Einheit | Quelle | Beschreibung | Aktualisierung | VIS2-Nutzung | Requirement | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0_userdata.0.EOS.Battery.Statistics.Today` | number | - | EOS-Logik | Platzhalter fuer Tagesstatistik | Bei spaeterer Historienlogik | Spaetere Statistikansicht | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Statistics.Week` | number | - | EOS-Logik | Platzhalter fuer Wochenstatistik | Bei spaeterer Historienlogik | Spaetere Statistikansicht | REQ-BAT-SUPERVISOR-V1 | V1 |
| `0_userdata.0.EOS.Battery.Statistics.Month` | number | - | EOS-Logik | Platzhalter fuer Monatsstatistik | Bei spaeterer Historienlogik | Spaetere Statistikansicht | REQ-BAT-SUPERVISOR-V1 | V1 |

## Notizen zur Stabilitaet

- Die State-Namen bilden die stabile API fuer V1.
- Neue fachliche Inhalte werden kuenftig durch neue States ergaenzt, nicht durch Umbenennung bestehender States.
- Wenn eine Quelle nicht verfuegbar ist, soll der Statuswert das sichtbar machen; fehlende Daten duerfen nicht implizit geraten werden.
