# Energiemanagement Architektur

## Leitlinie

Bestehende Skripte bleiben unveraendert. Neues Energiemanagement wird modular in `script.js.energiemanagement.*` aufgebaut. Jede fachliche Funktion bekommt ihr eigenes Skript.

## Empfohlene erste Modulstruktur

### Grundlagen

- `script.js.energiemanagement.Init`
- `script.js.energiemanagement.Config`
- `script.js.energiemanagement.Debug`
- `script.js.energiemanagement.Zeitmodell`

### Energiebilanz

- `script.js.energiemanagement.Bilanz_Zaehlpunkte`
- `script.js.energiemanagement.Bilanz_Saldierung`
- `script.js.energiemanagement.Bilanz_PV_Prognose`

### Batterie und Victron

- `script.js.energiemanagement.Batterie_Strategie`
- `script.js.energiemanagement.Batterie_Pack_Überwachung`
- `script.js.energiemanagement.Victron_ESS_Setpoint`
- `script.js.energiemanagement.Victron_BAT_Setpoint`
- `script.js.energiemanagement.RS450_Strategie`

### Wallboxen

- `script.js.energiemanagement.Wallbox_1_Control`
- `script.js.energiemanagement.Wallbox_2_Control`
- `script.js.energiemanagement.Wallbox_Phasenlogik`

### Pool

- `script.js.energiemanagement.Pool_Freigabe`
- `script.js.energiemanagement.Pool_Lastabwurf`
- `script.js.energiemanagement.Pool_Winter_Sommer`

### Schutz und Grenzen

- `script.js.energiemanagement.Limits_Hausanschluss_40A`
- `script.js.energiemanagement.Limits_Halle_Netz`
- `script.js.energiemanagement.Limits_Hallenabgang_40A`
- `script.js.energiemanagement.Min_SOC_Schutz`
- `script.js.energiemanagement.FailSafe`

## Empfohlene Reihenfolge

1. `Config`
2. `Debug`
3. `Bilanz_Zaehlpunkte`
4. `Bilanz_Saldierung`
5. `Limits_Hausanschluss_40A`
6. `Limits_Halle_Netz`
7. `Limits_Hallenabgang_40A`
8. `Wallbox_Phasenlogik`
9. `Batterie_Strategie`
10. `Victron_ESS_Setpoint`
11. `Victron_BAT_Setpoint`
12. `Pool_Lastabwurf`

## Was ich als Naechstes bauen sollte

Der sinnvollste erste technische Einstieg ist nicht gleich die gesamte Steuerung, sondern ein stabiles Fundament:

- ein `Config`-Skript mit klar markierten Platzhaltern fuer exakte Datenpunkt-IDs
- ein `Debug`-Skript bzw. gemeinsame Debug-Datenpunkte in `0_userdata.0`
- ein erstes `Bilanz_Zaehlpunkte`-Skript, das nur liest, aggregiert und Diagnosewerte schreibt

Damit bekommen wir zuerst Sichtbarkeit und pruefbare Energiebilanzen, bevor wir aktiv in Setpoints oder Verbrauchersteuerung eingreifen.
