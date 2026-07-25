# EOS Test-, Review- und Abnahmestrategie

## Zweck

Dieses Dokument definiert den verbindlichen Pruef-, Review- und Abnahmeprozess fuer EOS-Aenderungen. Ziel ist, fachliche Richtigkeit, technische Qualitaet, Sicherheitsgrenzen und Nachvollziehbarkeit vor einer Freigabe belastbar zu belegen.

## Grundprinzipien

- Repositoryinhalt hat Vorrang vor Commitbeschreibung und Zusammenfassung.
- Jede geaenderte Datei wird vollstaendig gelesen.
- Entscheidungen erfolgen anhand tatsaechlicher Inhalte, nicht anhand von Vermutungen.
- Unklare Punkte bleiben `Unklar` und duerfen nicht als bestanden gewertet werden.
- Read-only, Settings und aktorische Pfade werden getrennt geprueft.
- Live-nahe Aenderungen benoetigen strengere Abnahme als reine Dokumentationsaenderungen.
- Ein technisch vorhandener Stand ist nicht automatisch fachlich freigegeben.

## Pruefebenen

### 1. Dokumentationspruefung

Zu pruefen sind mindestens:

- Konsistenz mit `AGENTS.md`, `knowledge/project_brain.md`, `knowledge/decisions.md` und `knowledge/requirements.md`,
- eindeutiger Status: `Dokumentiert`, `Implementiert`, `Freigegeben`, `Zielbild – nicht freigegeben` oder `Unklar`,
- keine widerspruechlichen Fuehrungsrollen,
- keine stillschweigende Erweiterung des Auftrags,
- korrekte Verweise auf Spezifikationen, State-Modelle und Entscheidungen,
- nachvollziehbare Aktualisierung von `CHANGELOG.md`, wenn sich der dokumentierte Projektstand aendert.

### 2. Statische technische Pruefung

Fuer Code, JSON, HTML, CSS, Shell und Python sind mindestens zu pruefen:

- Syntax und Parsebarkeit,
- `git diff --check`,
- keine TODO-Dummyfunktionen, Platzhalter oder Scheinimplementierungen,
- keine unbeabsichtigten Aenderungen an Objekt-IDs, Topics, Alias-Pfaden, Adapterinstanzen oder Hardware-Zuordnungen,
- keine unzulaessigen Schreibrechte,
- keine direkten Aktorpfade aus read-only Modulen,
- keine zyklischen oder nicht dokumentierten Modulabhaengigkeiten,
- ressourcenschonendes Trigger- und Schreibverhalten.

### 3. State-Modell-Pruefung

Je neuem oder geaendertem EOS-State sind zu pruefen:

- vollstaendiger Pfad,
- fachliche Bedeutung,
- Datentyp, Rolle und Einheit,
- `read`- und `write`-Rechte,
- verantwortliches Schreibmodul,
- Aktualisierungs- und Triggerverhalten,
- Verhalten bei fehlender, veralteter oder unplausibler Quelle,
- Kompatibilitaet mit bestehenden Verbrauchern und VIS2,
- Migrationsbedarf bei inkompatiblen Aenderungen.

### 4. Integrationspruefung

Zu pruefen sind die dokumentierten Daten- und Steuerfluesse zwischen:

- Hardware und Adapterebene,
- MQTT, Modbus, S7 und HTTP,
- ioBroker und EOS-Domaenenmodulen,
- EOS-States und Folgefunktionen,
- EOS-States und VIS2,
- ioBroker, Node-RED, Cerbo und Hardware-Schutz bei freigegebenen Sollwert- oder Limitpfaden.

Ein gesendeter Sollwert gilt nicht als wirksam, solange keine passende Rueckmeldung oder Istwertpruefung vorliegt.

### 5. Degradations- und Recovery-Pruefung

Mindestens folgende Faelle sind bei relevanten Modulen zu pruefen:

- Quelle veraltet,
- Quelle offline,
- unplausibler Wert,
- Neustart des EOS-Moduls,
- Neustart von ioBroker,
- Ausfall von MQTT oder Node-RED,
- Ausfall oder Neustart eines Cerbo,
- Rueckkehr einer Quelle nach Stoerung,
- veraltete Settings oder Sollwerte nach Neustart,
- Vermeidung unkontrollierter Last-, Lade- oder Entladespruenge.

### 6. Live-nahe Abnahme

Vor einer produktiven Aenderung sind mindestens erforderlich:

1. Backup und dokumentierter Rollback-Punkt,
2. identifizierte Quell-, Ziel- und Schreibpfade,
3. Dry-Run oder read-only Vorpruefung, soweit technisch moeglich,
4. klarer Abbruchpunkt,
5. kontrolliertes Apply,
6. unmittelbare technische Verifikation,
7. fachliche Sichtpruefung,
8. Beobachtung des Wiederanlauf- und Kommunikationsverhaltens,
9. dokumentierter Release- und Rollback-Nachweis.

## Reviewrollen

### Codex-Selbstaudit

Vor jedem Commit prueft Codex mindestens:

- Auftragstreue,
- Konsistenz mit Projektwissen und Spezifikationen,
- Vollstaendigkeit aller geaenderten Dateien,
- `git diff --check`,
- Syntax und Parsebarkeit,
- keine unerwuenschten Erweiterungen,
- keine Platzhalter oder ungesicherten Annahmen.

### ChatGPT-Architektur- und Code-Review

ChatGPT prueft unabhaengig:

- jede geaenderte Datei vollstaendig,
- Auftrag gegen tatsaechlichen Diff,
- Architektur- und Sicherheitsregeln,
- State-Modell und Schreibrechte,
- Abhaengigkeiten und Schnittstellen,
- Test- und Verifikationsnachweise,
- Dokumentationskonsistenz.

Danach erfolgt genau eine Entscheidung:

- `Freigeben`
- `Korrektur erforderlich`

## Abnahmekriterien

Eine Aenderung darf nur freigegeben werden, wenn:

- der Auftrag vollstaendig und ohne unerwuenschte Erweiterung umgesetzt ist,
- alle betroffenen Dateien konsistent sind,
- alle relevanten Tests bestanden oder als nicht anwendbar begruendet sind,
- keine Sicherheits- oder Architekturregel verletzt wird,
- keine ungeklaerte Annahme als Fakt verwendet wird,
- State-Rechte und Schnittstellen eindeutig sind,
- Deployment, Rollback und Verifikation fuer live-nahe Aenderungen belegt sind,
- Dokumentation, Entscheidungen, Requirements und Changelog konsistent sind.

## Definition of Done fuer EOS-Module

Ein EOS-Modul gilt erst als fertig, wenn mindestens vorliegen:

1. fachlicher Zweck und Verantwortung,
2. Spezifikation,
3. Requirements-Zuordnung,
4. dokumentierte Architekturentscheidung,
5. Eingangsquellen und Fuehrungsrollen,
6. stabiles State-Modell,
7. Kommunikations- und Fehlerverhalten,
8. Trigger- und Ressourcenmodell,
9. Sicherheitsabgrenzung,
10. Implementierung ohne Platzhalter,
11. technische Tests,
12. Integrations- und Recovery-Pruefung,
13. Deployment- und Rollback-Weg,
14. VIS2-Abgrenzung,
15. Review-Nachweis,
16. dokumentierter Versions- und Freigabestand.

## Review-Nachweis

Jeder fachlich relevante Review soll mindestens festhalten:

- gepruefter Commit,
- geaenderte Dateien,
- ausgefuehrte Pruefungen,
- festgestellte Abweichungen,
- Architekturentscheidung,
- Freigabe oder Korrektur,
- naechster vollstaendiger Codex-Auftrag.

## Nicht ausreichende Nachweise

Nicht ausreichend sind:

- reine Commitbeschreibung,
- Behauptung eines Tests ohne Ergebnis,
- nur teilweise gelesene Dateien,
- visuelle Plausibilitaet ohne State- oder Schnittstellenpruefung,
- erfolgreicher Start ohne Pruefung des Fehler- und Wiederanlaufverhaltens,
- vorhandener Code ohne Requirements- und Architekturbezug.

## Offene Punkte

Weiterhin `Unklar`:

- welche automatisierten Testwerkzeuge fuer alle EOS-Dateitypen verbindlich eingefuehrt werden,
- ob ein separates Staging-System fuer live-nahe Aenderungen aufgebaut wird,
- welche Mindestbeobachtungsdauer fuer aktorische Releases gilt,
- welche produktiven Schnittstellen eine formale End-to-End-Quittierung benoetigen,
- welche Regressionstests fuer den produktionsnahen Altbestand automatisierbar sind.
