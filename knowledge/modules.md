# Module

## Dokumentationsmodule

- `README.md`: sehr kurze Projektbeschreibung
- `PROJECT_MEMORY.md`: dauerhaftes Projektgedaechtnis
- `docs/*.md`: Architektur, Manifest, Risiken, Integrationsregeln

## Altbestand unter `iobroker/scripts/common/`

Wichtige Modulgruppen:

- `Victron_*`: MQTT, Limits, Betriebsmodi, Ladegrenzen, Informationen
- `go-E_*`: Wallbox-Freigabe, Stromregelung, Phasenumschaltung, Limits, Verriegelung
- `Gobel_*`: Zellspannungsdiagnose und Vergleiche
- `Pool*`: Pooltemperaturen, Ueberschusslogik, S7-/LOGO-Anbindung
- `Grid-*`, `Wolken-*`, `Priority_Management`: Netz-, PV- und Prioritaetslogik
- weitere Smart-Home-Skripte wie `Garage.js`, `Hallentore.js`, `Bewässerung.js`, `Rasen.js`, `SmartPlug.js`, `Werkstatt_Hzg.js`, `Smart_BadHzg.js`

## Neues Energiemanagement

- `Config.js`: zentrale Konfigurations-Datenpunkte
- `Debug.js`: Heartbeat und Debug-Zustand
- `Bilanz_Zaehlpunkte.js`: saldierte Netzbilanz
- `Batterie_Zellspannungen.js`: Zellspreizung, Trend, Alarm je Pack
- `Batterie_BMS_Heltec_Vergleich.js`: BMS-/HELTEC-Vergleich je Pack
- `Pool_VIS2_Zeitplaene.js`: VIS2-Zeitplan-Synchronisation mit `time-switch.0`
- `Codex_Access_Test.js`: Deployment-Test

## VIS-2-Module

- `dashboard.html`: Hauptansicht
- `battery.html`: Batteriedetails
- `pool.html`: Pooldetails
- `pool-controls.html`: Pool-Bedienkopf
- `vis-user.css`: Styling
- `build_vis.py`: Build-Logik

## Tool-Module

- `sync_iobroker.py`: Skriptobjekte sichern, deployen, aktivieren, deaktivieren, loeschen
- `deploy_vis2.py`: VIS-2-Backup und Deployment

## Unklar

- Eine vollstaendige Abhaengigkeitenkarte zwischen allen Common-Skripten ist im Repository nicht separat dokumentiert.
