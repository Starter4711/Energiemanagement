# Roadmap

## Konkrete naechste Schritte laut Analyse

1. `AGENTS.md` mit Projektregeln und Wissensverweisen bereitstellen.
2. Adapter- und Objektinventar aus `manifest.json`, `objects/` und Skripten dokumentieren.
3. Altbestand unter `iobroker/scripts/common/` fachlich gruppieren und aktiv/inaktiv dokumentieren.
4. Datenpunktvertraege des neuen Energiemanagements unter `0_userdata.0.Energiemanagement.*` dokumentieren.
5. Aktor-Schreibpfade separat inventarisieren:
   - Victron MQTT-Steuerthemen
   - go-e `allow_charging`
   - go-e `amperePV`
   - go-e HTTP-Phasenumschaltung
   - Siemens LOGO / `s7.0.DBs.DB1.*`
6. Dokumentierte Alias-Luecken schliessen.
7. Eine Migrationsmatrix Altbestand -> neues Energiemanagement erstellen.
8. Betriebsdoku fuer Python-Tools mit Rollback-Hinweisen verfassen.
9. `work/` und `outputs/` dokumentieren oder als lokal markieren.
10. VIS-2-Struktur fuer Main/Batterie/Pool separat dokumentieren.

## Aktueller Schwerpunkt

Die Analyse zeigt, dass die Wissensbasis, Objektvertraege und Migrationsdokumentation die naechsten sinnvollen Schritte sind.

## Unklar

- Zeitliche Priorisierung ausserhalb der dokumentierten Liste ist `Unklar`.
