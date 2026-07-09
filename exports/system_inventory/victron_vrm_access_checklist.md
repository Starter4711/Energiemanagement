# VRM / Victron Zugriff-Checkliste

Erstellt am: 2026-07-09T15:14:25.863741+00:00

## Ziel

Diese Datei dokumentiert, was fuer einen echten VRM-/Victron-Livezugriff benoetigt wird, damit spaeter ein belastbarer Export der Victron-/VRM-/Venus-Datenpunkte erstellt werden kann.

## Was hier aktuell belegt ist

- Im Repository sind Victron-/MQTT-/Cerbo-Beziehungen dokumentiert.
- VRM wird laut Benutzerangabe fuer ESS und BAT verwendet.
- In dieser Umgebung ist kein Live-Zugriff auf VRM oder auf die Victron-Laufzeit vorhanden.

## Was fuer einen echten Zugriff fehlt

- VRM Token oder ein anderer gesicherter API-Zugang, falls VRM-Cloud-Export gewuenscht ist
- Klarheit, ob der Zugriff ueber VRM Cloud, lokale Venus MQTT-Daten oder dbus erfolgen soll
- Falls lokal: die konkrete Cerbo-IP oder Hostadresse
- Falls lokal: Netzwerkpfad und Zugriffsmethode zum Cerbo bzw. zur VenusOS-Instanz
- Falls MQTT: die konkrete Broker-Verbindung, die die Victron-Daten traegt

## Moegliche Zugriffswege

1. VRM Cloud API
- benoetigt ein gueltiges Token
- geeignet fuer dokumentierte, externe Abfragen

2. Lokale Venus MQTT-Daten
- benoetigt Zugriff auf den lokalen MQTT-Broker oder eine vorhandene ioBroker-MQTT-Instanz
- geeignet fuer die im System sichtbaren Victron-Nutzdaten

3. dbus / lokale VenusOS-Schnittstelle
- benoetigt Zugriff direkt auf das Victron-Geraet oder den Container / Host
- geeignet fuer tiefergehende Live-Inspektion

## Naechster belastbarer Schritt

- Zugangsdaten oder den gewuenschten Zugriffsweg eindeutig festlegen
- danach einen echten Live-Export erzeugen
- anschliessend die resultierenden IDs und Komponenten im Inventory dokumentieren
