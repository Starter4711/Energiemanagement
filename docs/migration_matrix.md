# Migrationsmatrix: ioBroker-common Altbestand -> neues Energiemanagement

Stand: frischer Manifest-Export vom 2026-07-07T17:54:47.083662+00:00.

Bewertungshinweis:
- Die Aufgabenbeschreibungen sind bei mehreren Alt-Skripten aus Dateinamen und Projektkontext abgeleitet.
- "Bereits ersetzt" ist nur bei den Gobel-Skripten sicher belegbar, weil fuer sie neue Energiemanagement-Skripte existieren.
- Kritische Schreibpfade sind mit `⚠️` markiert.

| Skript-ID | Aktiv | Bereich | Vermutete Aufgabe | Liest von | Schreibt auf | Risiko | Ziel im neuen Energiemanagement | Migrationsstatus | Priorität |
|---|---|---|---|---|---|---|---|---|---|
| `script.js.common.Bewässerung` | nein | Sonstiges | Bewässerungslogik / Gartensteuerung | `alias.0`, Zeitlogik | Aktoren der Bewässerung | mittel | Kein vorrangiges Energiemanagement-Ziel | behalten | niedrig |
| `script.js.common.EBikeLader` | nein | Sonstiges | E-Bike-Laden / Nebenverbraucher | Zeitfenster, Freigaben | Ladefreigabe | mittel | Kein Kernziel; ggf. später Nebenlastlogik | prüfen | niedrig |
| `script.js.common.Garage` | nein | Sonstiges | Garagentor-/Statuslogik | Sensorik, Taster | Garagentor-Aktoren | niedrig | Kein Energiemanagement-Ziel | behalten | niedrig |
| `script.js.common.Gobel_VDIFF` | nein | Batterie | Batterie-Differenzspannung / Diagnose | Gobel-BMS, Zellwerte | Diagnosewerte | hoch | `Batterie_Zellspannungen` / Diagnose | bereits ersetzt | hoch |
| `script.js.common.Gobel_Vergleich_BMS_Heltec` | nein | Batterie | Vergleich Gobel-BMS vs. HELTEC | Gobel-BMS, HELTEC | Diagnose-/Vergleichsstates | hoch | `Batterie_BMS_Heltec_Vergleich` | bereits ersetzt | hoch |
| `script.js.common.Gobel_Zellspannungen` | nein | Batterie | Zellspannungsaggregation | Gobel-BMS | Diagnosewerte | hoch | `Batterie_Zellspannungen` | bereits ersetzt | hoch |
| `script.js.common.Gobel_einzelne_Zellspannungen` | nein | Batterie | Einzelzellwerte / Diagnose je Pack | Gobel-BMS | Diagnosewerte | hoch | `Batterie_Zellspannungen` | bereits ersetzt | hoch |
| `script.js.common.Grid-PV` | ja | Bilanz | Netz/PV-Bilanz oder Hilfslogik | Zaehler, PV, Verbrauch | Bilanz-/Hilfsstates | hoch | `Bilanz_Zaehlpunkte` | prüfen | hoch |
| `script.js.common.Grid-PVHalle` | ja | Bilanz | Hallen-Zaehlpunkt / PV-Bilanz | Zaehlpunkte, Netzleistung | Bilanz-/Hilfsstates | hoch | `Bilanz_Zaehlpunkte` | prüfen | hoch |
| `script.js.common.Hallentore` | ja | Sonstiges | Hallen-/Toransteuerung | Sensorik, Bedienung | Torausgaenge | niedrig | Kein Energiemanagement-Ziel | behalten | niedrig |
| `script.js.common.Pool` | ja | Pool | Pool-Grundlogik / Status | Temperatur, Zeit, Freigaben | Poolzustand, Aktoren | mittel | Pool-Steuerlogik im Zielsystem; VIS2-Kopplung | prüfen | mittel |
| `script.js.common.Pool_Steuerung` | ja | Pool | Pool-PV-Ueberschusssteuerung | PV, Temperatur, Zeit, S7 | ⚠️ S7/LOGO, Pool-Aktoren | hoch | Pool-Modul / Zielsteuerung | ersetzen | hoch |
| `script.js.common.Priority_Management` | nein | Bilanz | Priorisierung von Lasten / Verbrauchern | Prioritaeten, PV, Batterie | Freigaben / Prioritaeten | hoch | Neue Strategielogik im Energiemanagement | prüfen | hoch |
| `script.js.common.Rasen` | nein | Sonstiges | Rasen-/Bewässerungsnebenlogik | Zeit, Saison | Aktoren | niedrig | Kein Energiemanagement-Ziel | behalten | niedrig |
| `script.js.common.SmartPlug` | nein | Sonstiges | Steckdosen-/Smartplug-Steuerung | Schaltlogik, Zeiten | Smart-Plug-Aktoren | niedrig | Kein Kernziel | behalten | niedrig |
| `script.js.common.Smart_BadHzg` | nein | Sonstiges | Badheizung per Smartplug | Temperatur, Zeiten | Heizungssteckdose | mittel | Kein Kernziel | behalten | niedrig |
| `script.js.common.Sonne` | ja | Bilanz | Sonnenstand / Tagesfenster / PV-Hilfe | Astronomie-/Zeitdaten | Hilfsstates | niedrig | Hilfslogik fuer neue Strategien | prüfen | niedrig |
| `script.js.common.Sonnenstand` | nein | Bilanz | Sonnenstandsberechnung | Astronomie-/Zeitdaten | Hilfsstates | niedrig | Hilfslogik oder Ersatz durch Standardfunktion | prüfen | niedrig |
| `script.js.common.Victron_Alarms` | ja | Victron | Alarm-/Stoerungslogik fuer Victron | Victron-States, MQTT | Alarmstates, Meldungen | hoch | Victron-Monitoring / Alarmierung | behalten | hoch |
| `script.js.common.Victron_BAT` | ja | Batterie | Victron BAT-Freigaben / Limits / Steuerung | Cerbo, BMS, MQTT | ⚠️ Victron BAT / MQTT | kritisch | Victron-/BAT-Kernlogik im Zielsystem | prüfen | kritisch |
| `script.js.common.Victron_DiffV` | ja | Batterie | Differenzspannungen / Zellspreizung | BMS, Zellwerte | Diagnosewerte | hoch | Diagnose im neuen Batterie-Modul | ersetzen | hoch |
| `script.js.common.Victron_EM24` | ja | Bilanz | EM24-Zaehlpunkt / Netzleistung | EM24, MQTT | Bilanz-/Netzstates | hoch | `Bilanz_Zaehlpunkte` | prüfen | hoch |
| `script.js.common.Victron_Hzg` | ja | Victron | Heizung / Victron-nahe Steuerlogik | Temperatur, Freigaben | Heiz-/Freigabestates | mittel | Ziel noch unklar | prüfen | mittel |
| `script.js.common.Victron_INIT` | ja | Victron | Initialisierung von Victron-States / MQTT | Startwerte, Konfig | ⚠️ Victron-States, MQTT | kritisch | Kerninitialisierung im Zielsystem | ersetzen | kritisch |
| `script.js.common.Victron_Infos` | ja | Victron | Status-/Infoaufbereitung | Victron-States, MQTT | Info-/Anzeigezustand | mittel | Monitoring-/Info-Layer | behalten | mittel |
| `script.js.common.Victron_Limits` | ja | Victron | Lade-/Entladegrenzen setzen | SOC, Spannung, Temperatur | ⚠️ Victron Limits / MQTT | kritisch | Limit-Layer im Zielsystem | ersetzen | kritisch |
| `script.js.common.Victron_Mode` | ja | Victron | ESS/BAT-Modus schalten | Betriebszustand, Konfig | ⚠️ Victron-Modus / MQTT | kritisch | Strategiemodus im Zielsystem | ersetzen | kritisch |
| `script.js.common.Victron_Mqtt` | ja | Victron | MQTT-Kommunikation zu Victron | Cerbo, MQTT | ⚠️ MQTT-Topics / Victron | kritisch | Kommunikationsschicht im Zielsystem | behalten | kritisch |
| `script.js.common.Victron_OldGrid` | ja | Bilanz | Alte Grid-Logik / Legacy-Bilanz | Zaehlpunkte, PV | Bilanz-/Legacy-States | hoch | Legacy, nur falls noetig uebernehmen | ersetzen | hoch |
| `script.js.common.Victron_Shunt_LastFullCharge` | ja | Batterie | Letzte Volladung / Shunt-Auswertung | SmartShunt | Diagnose-/Historienstates | hoch | Batteriehistorie / Analyse | behalten | hoch |
| `script.js.common.Victron_TOP-Balancing` | ja | Batterie | Top-Balancing-Logik | BMS, SOC, Spannung | ⚠️ Batterie-/Ladeparameter | kritisch | Nur falls strategisch noetig; sonst Schutzlogik | prüfen | kritisch |
| `script.js.common.Werkstatt_Hzg` | ja | Sonstiges | Werkstattheizung / Nebenlast | Temperatur, Zeit | Heizungsausgang | niedrig | Kein Energiemanagement-Ziel | behalten | niedrig |
| `script.js.common.Wolken-PV_Halle` | ja | Bilanz | Wetter-/Wolkenhilfe fuer Hallen-PV | Wetter, PV, Sonne | Prognose-/Hilfsstates | mittel | Prognose-/Hilfsebene | prüfen | mittel |
| `script.js.common.Wolken-PV_Home` | ja | Bilanz | Wetter-/Wolkenhilfe fuer Home-PV | Wetter, PV, Sonne | Prognose-/Hilfsstates | mittel | Prognose-/Hilfsebene | prüfen | mittel |
| `script.js.common.go-E_V3_Charger` | ja | Wallbox | go-e V3 Basissteuerung | Wallboxstatus, Freigaben | ⚠️ Wallbox / go-e | kritisch | Wallbox-Modul / Zielsteuerung | ersetzen | kritisch |
| `script.js.common.go-E_V3_Control` | ja | Wallbox | go-e V3 Regelung | Ueberschuss, Freigaben | ⚠️ Wallbox / go-e | kritisch | Wallbox-Modul / Zielsteuerung | ersetzen | kritisch |
| `script.js.common.go-E_V3_Debug` | ja | Wallbox | go-e V3 Debug / Diagnose | Wallboxstatus | Debugstates | mittel | Diagnoseebene | prüfen | niedrig |
| `script.js.common.go-E_V3_Error` | ja | Wallbox | go-e V3 Fehlerauswertung | Wallboxfehler | Fehlerstates | hoch | Diagnose / Alarmierung | behalten | mittel |
| `script.js.common.go-E_V3_GridOffset` | ja | Wallbox | Netzoffset fuer go-e V3 | Zaehlpunkte, PV | ⚠️ Wallbox / Netzoffset | kritisch | Wallbox-/Ueberschusslogik | ersetzen | kritisch |
| `script.js.common.go-E_V3_Init` | ja | Wallbox | Initialisierung go-e V3 | Konfig, Status | ⚠️ Wallbox / go-e | kritisch | Wallbox-Initialisierung | ersetzen | kritisch |
| `script.js.common.go-E_V3_LED` | ja | Wallbox | LED-/Statusanzeige go-e V3 | Wallboxstatus | Status-/LED-States | niedrig | Diagnose / Status | behalten | niedrig |
| `script.js.common.go-E_V3_Limits` | ja | Wallbox | go-e V3 Limitsetzung | Strom, Freigaben, SOC | ⚠️ Wallbox / Limits | kritisch | Wallbox-Sollwerte im Zielsystem | ersetzen | kritisch |
| `script.js.common.go-E_V3_Phasen` | ja | Wallbox | Phasenumschaltung go-e V3 | Last, PV, Freigabe | ⚠️ Wallbox / Phasen | kritisch | Wallbox-Modul / Phasenlogik | ersetzen | kritisch |
| `script.js.common.go-E_V3_Verriegelung` | ja | Wallbox | Verriegelung / Freigabe go-e V3 | Status, Freigabe | ⚠️ Wallbox / Sperre | kritisch | Wallbox-Sicherheitslogik | behalten | kritisch |
| `script.js.common.go-E_V3_Überschuss` | ja | Wallbox | Ueberschussladen go-e V3 | PV, Netzbezug, Batterie | ⚠️ Wallbox / Ueberschuss | kritisch | Wallbox-Ueberschussmodul | ersetzen | kritisch |
| `script.js.common.go-E_V3_Überwachung` | ja | Wallbox | Ueberwachung go-e V3 | Wallboxstatus, Fehler | Monitoring / Alarme | hoch | Monitoring / Diagnose | behalten | hoch |
| `script.js.common.go-E_V4_Charger_Neu` | ja | Wallbox | Neue go-e V4 Charger-Logik | Wallboxstatus, Konfig | ⚠️ Wallbox / go-e | kritisch | Neuer Wallbox-Zielpfad | ersetzen | kritisch |
| `script.js.common.go-E_V4_Control` | ja | Wallbox | go-e V4 Regelung | Ueberschuss, Freigaben | ⚠️ Wallbox / go-e | kritisch | Neuer Wallbox-Zielpfad | ersetzen | kritisch |
| `script.js.common.go-E_V4_Debug` | ja | Wallbox | go-e V4 Debug / Diagnose | Wallboxstatus | Debugstates | mittel | Diagnoseebene | prüfen | niedrig |
| `script.js.common.go-E_V4_Error` | ja | Wallbox | go-e V4 Fehlerauswertung | Wallboxfehler | Fehlerstates | hoch | Diagnose / Alarmierung | behalten | mittel |
| `script.js.common.go-E_V4_GridOffset` | ja | Wallbox | Netzoffset fuer go-e V4 | Zaehlpunkte, PV | ⚠️ Wallbox / Netzoffset | kritisch | Wallbox-/Ueberschusslogik | ersetzen | kritisch |
| `script.js.common.go-E_V4_Halle` | ja | Wallbox | Halle-spezifische go-e V4 Logik | Hallenlast, Freigaben | ⚠️ Wallbox / Halle | kritisch | Hallen-Wallboxpfad | ersetzen | kritisch |
| `script.js.common.go-E_V4_Init` | ja | Wallbox | Initialisierung go-e V4 | Konfig, Status | ⚠️ Wallbox / go-e | kritisch | Wallbox-Initialisierung | ersetzen | kritisch |
| `script.js.common.go-E_V4_LED` | ja | Wallbox | LED-/Statusanzeige go-e V4 | Wallboxstatus | Status-/LED-States | niedrig | Diagnose / Status | behalten | niedrig |
| `script.js.common.go-E_V4_Limits` | ja | Wallbox | go-e V4 Limitsetzung | Strom, Freigaben, SOC | ⚠️ Wallbox / Limits | kritisch | Wallbox-Sollwerte im Zielsystem | ersetzen | kritisch |
| `script.js.common.go-E_V4_Phasen` | ja | Wallbox | Phasenumschaltung go-e V4 | Last, PV, Freigabe | ⚠️ Wallbox / Phasen | kritisch | Wallbox-Modul / Phasenlogik | ersetzen | kritisch |
| `script.js.common.go-E_V4_Verriegelung` | ja | Wallbox | Verriegelung / Freigabe go-e V4 | Status, Freigabe | ⚠️ Wallbox / Sperre | kritisch | Wallbox-Sicherheitslogik | behalten | kritisch |
| `script.js.common.go-E_V4_kWh` | ja | Wallbox | Energiezaehler / kWh-Auswertung | Wallboxzaehler | Statistik-/Abrechnungsstates | mittel | Statistik / Reporting | behalten | niedrig |
| `script.js.common.go-E_V4_Überwachung` | ja | Wallbox | Ueberwachung go-e V4 | Wallboxstatus, Fehler | Monitoring / Alarme | hoch | Monitoring / Diagnose | behalten | hoch |
| `script.js.common.go-E_WB-Halle_Ladungen` | ja | Wallbox | Hallen-Ladevorgaenge / Ladeprotokoll | Wallbox, Zaehler | Ladehistorie / Protokoll | hoch | Reporting / Diagnose | behalten | mittel |
| `script.js.energiemanagement.Batterie_BMS_Heltec_Vergleich` | ja | Batterie | Neuer Vergleich BMS vs. HELTEC | Pace-BMS, HELTEC | Diagnose-/Vergleichsstates | hoch | Zielmodul bereits aktiv | behalten | hoch |
| `script.js.energiemanagement.Batterie_Zellspannungen` | ja | Batterie | Neue Zellspannungsanalyse | Pace-BMS, HELTEC | Diagnose-/Alarmstates | hoch | Zielmodul bereits aktiv | behalten | hoch |
| `script.js.energiemanagement.Codex_Access_Test` | nein | Sonstiges | Testskript fuer Deployment | Testdaten | Teststate | niedrig | Kein Produktivziel | behalten | niedrig |
| `script.js.energiemanagement.Config` | nein | Sonstiges | Zentrale Konfigurationsstates | Manuelle Konfiguration | `0_userdata.0.Energiemanagement.Config` | mittel | Zielmodul-Konfiguration | behalten | mittel |
| `script.js.energiemanagement.Pool_VIS2_Zeitplaene` | ja | Pool | VIS2-Zeitplaene mit `time-switch.0` synchronisieren | VIS2, `time-switch.0` | VIS2-/Zeitplanstates | mittel | Zielmodul fuer Pool-Bedienung | behalten | mittel |

## Kurzfazit

- Die klarsten Migrationskandidaten sind die Gobel-Skripte und die go-e/Victron-Kernlogik.
- Die produktiven Schreibpfade liegen vor allem bei Victron-, Wallbox- und Pool-Skripten.
- Die neuen Energiemanagement-Skripte decken Batterie-Diagnose bereits ab; die Bilanz- und Debug-Skripte liegen aktuell nur im Repository und sind im Live-Export noch nicht sichtbar.
