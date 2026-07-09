# Victron / VRM / Venus Inventory nicht live exportierbar

Datum: 2026-07-09T15:14:25.863615+00:00

Status: Nicht konfiguriert bzw. in dieser Umgebung nicht erreichbar.

Fehlend oder nicht verfuegbar:
- VRM Portal-/Anlagen-IDs: nicht live belegt
- VRM Token: nicht hinterlegt
- lokale Venus MQTT-Daten: kein Live-Zugriff auf `ioBroker`-States oder MQTT-Bridge
- dbus Zugriff: kein Live-Zugriff auf die Victron-/Cerbo-Umgebung
- Cerbo IPs: laut Benutzerangabe vorhanden, aber kein Live-Export aus dieser Umgebung

Hinweis:
- Diese Datei dokumentiert die fehlende Live-Konfiguration.
- Ein Victron-Inventory wurde deshalb nicht als Live-Export erzeugt.
- Die vorhandenen Repository-Referenzen wurden nicht als Ersatz fuer einen echten Laufzeit-Export bewertet.
- VRM wird fuer ESS und BAT verwendet, aber die Live-IDs wurden hier nicht ausgelesen.
