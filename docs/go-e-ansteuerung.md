# go-E Ansteuerung

## Verbindliche Vorgabe

- Der geregelte Ladestrom wird ausschliesslich ueber `amperePV` vorgegeben.
- `ampere` darf im neuen Energiemanagement nicht als Stellwert verwendet werden.
- Wallbox 1 verwendet spaeter einen Alias auf `go-e.0.amperePV`.
- Wallbox 2 verwendet spaeter einen Alias auf `go-e.1.amperePV`.
- Wallbox 3 wird nicht geregelt.

## Aus bestehenden V4-Skripten uebernommenes Verhalten

- `access_state` und `allow_charging` steuern Freigabe und Stopp der Ladung.
- Vor dem Start werden Fahrzeugstatus, Betriebsmodus, Ziel-SOC und Schutzbedingungen geprueft.
- Bei Netzbezug oder fehlendem PV-Ueberschuss wird der Ladestrom reduziert beziehungsweise die Ladung zeitverzoegert gestoppt.
- Eine Erhoehung erfolgt schrittweise um maximal 1 A und langsamer als eine Reduktion.
- Der berechnete Strom wird immer auf die getrennten Min-/Max-Grenzen fuer 1- und 3-phasigen Betrieb begrenzt.
- Beim Phasenwechsel wird zuerst der zur neuen Phasenanzahl passende Mindeststrom gesetzt.
- Automatik-, Notlade- und Ladefreigabe-Zustaende muessen gegenseitig verriegelt sein.

## Phasenumschaltung

- Der bestehende V4-Code verwendet den go-E-Parameter `psm`.
- `psm=1` erzwingt 1-phasigen Betrieb.
- `psm=2` erzwingt 3-phasigen Betrieb.
- Der bestehende Code sendet den Wert sowohl ueber die lokale go-E-HTTP-API als auch ueber ein MQTT-Kommando.
- Im neuen Energiemanagement wird der konkrete Befehl hinter einem geprueften, schreibbaren `alias.0`-Aktor gekapselt.
- Nach der Umschaltung wird `amperePV` auf den Mindeststrom des neuen Phasenmodus gesetzt.
- Die tatsaechlich aktiven Phasen werden ueber `phases` kontrolliert; der Sollbefehl allein gilt nicht als erfolgreiche Umschaltung.

## Regelzyklus aus V4

- Laden freigeben: `access_state=0`, danach `allow_charging=1` und passenden Mindestwert an `amperePV` schreiben.
- Laden stoppen: `access_state=1` und `allow_charging=0`.
- Strom erhoehen: hoechstens 1 A je Regelschritt, im bestehenden Code mit 10 Sekunden Sperrzeit.
- Strom reduzieren: schneller, im bestehenden Code mit 2 Sekunden Sperrzeit.
- Strom immer auf die Min-/Max-Werte des aktiven Phasenmodus begrenzen.
- Bei anhaltendem Netzbezug oder fehlender PV-Leistung wird die Ladung nach einer Verzoegerung gestoppt.

## Relevante Common-Skripte

- `script.js.common.go-E_V4_Charger_Neu`: Start, Stopp und laufende Stromregelung
- `script.js.common.go-E_V4_Phasen`: Erkennung und Wechsel zwischen 1- und 3-phasigem Betrieb
- `script.js.common.go-E_V4_Limits`: Min-/Max-Grenzen je Phasenmodus
- `script.js.common.go-E_V4_Verriegelung`: gegenseitige Verriegelung der Betriebsarten

Die Common-Skripte bleiben inhaltlich unveraendert. Einzelne dort noch vorhandene Zugriffe auf `ampere` sind keine Vorlage fuer den neuen Code; die aktuelle Betreiber-Vorgabe `amperePV` hat Vorrang.
