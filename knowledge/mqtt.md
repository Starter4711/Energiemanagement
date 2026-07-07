# MQTT

## Rolle im Projekt

MQTT ist ein zentrales Integrationsmedium fuer Victron-/VenusOS-Daten, Steuerwerte und HELTEC-Balancer-Daten.

## MQTT-Instanzen

- `mqtt.0`: HELTEC-Balancer und teilweise go-e-bezogene Altobjekte
- `mqtt.1`: Cerbo Haus / Victron ESS
- `mqtt.2`: Cerbo Halle / Victron BAT
- `mqtt.3`: Raspi VenusOS fuer dritten Zaehlpunkt und SolarEdge
- `mqtt.4`: Keepalive-Pfad laut `Keep_Alive.js`

## Topic-Familien

- `N/<serial>/...`: Nutzdaten
- `R/<serial>/...`: Refresh-/Anfragethemen
- `ioBroker/...`: aus ioBroker an Victron-nahe Systeme gesendete Steuerwerte

## Sichtbare Nutzungen

- Refresh der Victron-/VenusOS-Daten in `common/Victron_Mqtt.js`
- ESS-/BAT-Steuerwerte in `common/Victron_INIT.js` und `common/Victron_BAT.js`
- HELTEC-Daten unter `mqtt.0.HELTEC_1` bis `mqtt.0.HELTEC_4`

## Architekturregel

- Das neue Energiemanagement bevorzugt Alias-Objekte.
- MQTT-Rohobjekte sollen nur dort direkt gelesen werden, wo es fachlich oder aus Ressourcensicht notwendig ist.

## Unklar

- Vollstaendige Topic-Liste aller produktiv verwendeten MQTT-Pfade ist im Repository nicht separat dokumentiert.
