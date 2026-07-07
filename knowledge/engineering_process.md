# Engineering Process

## Standardablauf fuer jede Aenderung

1. Aufgabe klaeren
2. relevante Knowledge-Dateien lesen
3. Ist-Zustand pruefen
4. Backup-Strategie pruefen
5. Aenderung klein und begrenzt umsetzen
6. Doku/Changelog aktualisieren
7. `git diff` pruefen
8. Commit
9. Push
10. Architektur-Review durch ChatGPT

## Freigabeprinzip

- Kein Commit gilt fachlich als freigegeben, bevor ein Architektur-Review durch ChatGPT erfolgt ist.
- Das Review-Gate gilt auch fuer kleine Aenderungen, wenn sie fachlich, betrieblich oder architektonisch relevant sind.

## Kritische Bereiche mit strengem Review

- Batterie
- Victron
- MQTT-Steuerpfade
- Wallbox
- S7/Pool
- ioBroker-Deployment

## Dokumentationspflicht

- Jede relevante Aenderung muss in der passenden Knowledge-Datei dokumentiert werden.
- Wenn die Aenderung laufende Projektarbeit betrifft, muss zusaetzlich `CHANGELOG.md` aktualisiert werden.
- Wenn ein Punkt noch nicht sicher belegt ist, bleibt er als `Unklar` dokumentiert.

## Unklar

- Der genaue formale Umfang des Architektur-Reviews ist noch nicht detailliert spezifiziert.
