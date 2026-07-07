# Victron

## Rolle

Victron ist ein zentrales Fachmodul des Projekts.

## Sichtbarer Systembezug

- Cerbo Haus ueber `mqtt.1`
- Cerbo Halle ueber `mqtt.2`
- VEBus-/ESS-/BAT-Steuerung ueber `ioBroker/...`-Themen
- SmartShunt als fuehrende Quelle fuer Gesamt-SOC und DC-Spannung
- RS450/100 als DC-Solar-Charger

## Wichtige Skriptfamilien

- `Victron_INIT`
- `Victron_BAT`
- `Victron_Mqtt`
- `Victron_Limits`
- `Victron_Infos`
- `Victron_Mode`
- `Victron_TOP-Balancing`
- `Victron_Shunt_LastFullCharge`
- `Victron_OldGrid`
- `Victron_DiffV`
- `Victron_EM24`
- `Victron_Hzg`
- `Victron_Alarms`

## Wichtige Regeln aus der Analyse

- Steuerung erfolgt ueber MQTT-nahe `ioBroker`-Datenpunkte.
- SmartShunt-Werte sind fuer Gesamt-SOC und DC-Spannung fuehrend.
- Der Gobel-SOC ist laut Projektdokumentation nicht als fuehrende Gesamtgroesse zu verwenden.

## VRM-Bezug

- Direkter VRM-API-Zugriff ist im Repository nicht sichtbar.
- Bewertung: `Unklar`, ob VRM ausserhalb des Repositories produktiv verwendet wird.
