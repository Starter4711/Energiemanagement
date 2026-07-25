# EOS Deployment, Release und Rollback

## Zweck

Dieses Dokument definiert den verbindlichen Prozess fuer Deployment, Release, Verifikation und Rollback von EOS-Artefakten. Es gilt fuer ioBroker-Skripte, EOS-States, VIS2-Artefakte, Deployment-Werkzeuge und live-nahe Integrationen. Nicht belegte Detailpfade bleiben `Unklar`.

## Grundsaetze

- GitHub auf dem Branch `ai-foundation` ist die Single Source of Truth fuer den freigegebenen Repository-Stand.
- ioBroker ist das produktive Live-System.
- Ein Commit im Repository veraendert das Live-System nicht automatisch.
- Deployment ist ein eigener, kontrollierter Schritt.
- Vor live-nahen Aenderungen sind Backup, Verifikation und Rollback zwingend vorzubereiten.
- Kleine, isolierte Releases haben Vorrang vor gebuendelten Umbauten.
- Read-only Dokumentations- oder Analyseaenderungen duerfen nicht mit aktorischen Live-Aenderungen vermischt werden.
- Kein Deployment darf auf einer nicht freigegebenen Architekturannahme beruhen.

## Release-Arten

### 1. Dokumentationsrelease

Umfasst ausschliesslich Dateien unter `knowledge/`, `docs/`, `README.md`, `AGENTS.md`, `CHANGELOG.md` oder vergleichbare Referenzdokumente.

Eigenschaften:

- keine direkte Live-Wirkung,
- kein ioBroker-Import erforderlich,
- fachliche Konsistenzpruefung und Commit-Review erforderlich,
- betroffene fuehrende Dokumente und Querverweise muessen konsistent bleiben.

### 2. Read-only EOS-Release

Umfasst Skripte oder States, die ausschliesslich Telemetrie lesen und berechnete read-only EOS-States schreiben.

Beispiele:

- Battery Supervisor V1,
- Battery Health V1,
- Energy Flow V1,
- read-only Kommunikations-, Diagnose- oder Health-Module.

Zusaetzliche Anforderungen:

- State-Modell verifiziert,
- keine schreibbaren Fachresultate,
- keine Aktorik,
- Trigger- und Ressourcenverhalten geprueft,
- Verhalten bei fehlenden, veralteten und unplausiblen Quellen dokumentiert.

### 3. VIS2-Release

Umfasst `battery.html`, weitere fuehrende HTML-Quellen, Styles, Build-Werkzeuge und `vis-views.json`.

Zusaetzliche Anforderungen:

- fuehrende Pflegequelle eindeutig benannt,
- Exportartefakt reproduzierbar erzeugt,
- JSON technisch gueltig,
- keine nicht freigegebenen Rohpfade,
- keine Fachlogik in VIS2,
- aktorische Elemente nur mit eigener Freigabe.

### 4. Aktorischer Release

Umfasst Settings-, Sollwert-, Limit- oder direkte Steuerpfade mit moeglicher Live-Wirkung.

Diese Release-Art ist sicherheitskritisch und benoetigt zusaetzlich:

- expliziten Schnittstellenvertrag,
- dokumentierten Quell- und Zielpfad,
- Wertebereich, Einheit und Prioritaet,
- Ablauf-, Timeout- und Fallbackverhalten,
- Rueckmeldung und Wirksamkeitskontrolle,
- Backup des bisherigen produktiven Zustands,
- definierten manuellen und technischen Rollback,
- ausdrueckliche fachliche Freigabe.

## Release-Voraussetzungen

Vor jedem Release muessen mindestens erfuellt sein:

1. Auftrag und Umfang sind eindeutig.
2. `AGENTS.md`, `knowledge/project_brain.md` und relevante Fachdateien wurden gelesen.
3. Betroffene Requirements und Entscheidungen sind identifiziert.
4. Jede geaenderte Datei wurde vollstaendig geprueft.
5. Keine ungeplanten Aenderungen sind im Commit enthalten.
6. `git diff --check` ist erfolgreich.
7. Keine TODO-Dummyfunktionen, Platzhalter oder Scheinimplementierungen sind vorhanden.
8. State-Pfade, Topics, Adapterinstanzen, Alias-, Modbus-, MQTT-, S7- und HTTP-Pfade sind verifiziert und nicht geraten.
9. Relevante Dokumentation und `CHANGELOG.md` sind aktualisiert.
10. Ein unabhaengiger Architektur- und Code-Review liegt vor.
11. Die Entscheidung lautet ausdruecklich `Freigeben`.
12. Backup- und Rollbackweg sind fuer live-nahe Aenderungen vorbereitet.

## Release-Einheit

Eine Release-Einheit ist der kleinste gemeinsam deploybare und gemeinsam rueckrollbare Umfang.

Sie soll enthalten:

- genau ein fachliches Ziel,
- moeglichst wenige Dateien,
- keine fachfremden Nebenarbeiten,
- eindeutigen Commit-Hash,
- eindeutige Zielkomponenten,
- Verifikationskriterien,
- Rollbackreferenz.

Skripte, State-Modelle und VIS2-Aenderungen duerfen nur dann in einer Release-Einheit kombiniert werden, wenn sie fachlich untrennbar sind und gemeinsam verifiziert werden koennen.

## Deployment-Stufen

### Stufe 1: Repository-Verifikation

- Ziel-Commit und Branch pruefen.
- Geaenderte Dateien gegen Auftrag, Requirements und Architektur lesen.
- Syntax-, Struktur- und Formatpruefungen ausfuehren.
- Sicherstellen, dass nur vorgesehene Artefakte betroffen sind.

### Stufe 2: Inventar und Dry-Run

Soweit fuer den Artefakttyp vorhanden, sind die Repository-Werkzeuge zu verwenden:

- `tools/iobroker/list_repository_assets.sh`
- `tools/iobroker/deploy_repository_to_iobroker.sh`
- `tools/iobroker/verify_iobroker_import.sh`
- `tools/iobroker/run_iobroker_deployment.sh`
- `iobroker/tools/sync_iobroker.py`
- `iobroker/tools/deploy_vis2.py`

Regeln:

- Dry-Run vor Apply,
- keine stillen Nebenimporte,
- Zielpfade und Artefakte sichtbar ausgeben,
- Abweichungen zwischen Repository und Live-System dokumentieren,
- bei unerwarteten Abweichungen stoppen.

### Stufe 3: Backup

Vor Apply muss je nach Artefakt mindestens gesichert werden:

- bisherige ioBroker-Skriptversion,
- bisherige Objekt- oder State-Definitionen, wenn betroffen,
- bisherige VIS2-Quelle und Exportdatei,
- bisherige Settings oder Sollwerte bei aktorischen Aenderungen,
- relevante Node-RED-, MQTT-, Cerbo- oder Adapterkonfiguration, wenn betroffen.

Das Backup muss eindeutig dem Ziel-Commit und dem Deployment-Zeitpunkt zugeordnet werden koennen.

### Stufe 4: Apply

- Nur die freigegebene Release-Einheit deployen.
- Keine parallelen fachfremden Aenderungen durchfuehren.
- Schreibpfade und Aktivierungen auf den dokumentierten Umfang begrenzen.
- Bei aktorischen Releases zuerst sichere oder inaktive Betriebsart verwenden, sofern technisch vorgesehen.
- Unerwartete Fehlermeldungen, neue States oder Schreibzugriffe fuehren zum Abbruch.

### Stufe 5: Technische Verifikation

Mindestens pruefen:

- Skript oder Modul ist vorhanden und im erwarteten Zustand,
- Syntax- oder Laufzeitfehler fehlen,
- erwartete EOS-States existieren,
- Typen, Rollen und Schreibrechte stimmen,
- LastUpdate-, Communication- und Fehlerstates reagieren korrekt,
- keine fremden State-Bereiche werden beschrieben,
- keine unkontrollierten Schreibzyklen oder Logfluten entstehen,
- VIS2-Artefakte werden korrekt geladen,
- bei aktorischen Releases stimmen Rueckmeldung und Istzustand mit dem Sollwert ueberein.

### Stufe 6: Fachliche Verifikation

- Werte und Stati sind fachlich plausibel.
- `UNKNOWN`, `STALE`, `OFFLINE` und Fehlerfaelle werden korrekt dargestellt.
- Batterie-, Cerbo- und Hardware-Schutz bleiben wirksam.
- Keine gezielte Batterieentladung ins Netz wird unbeabsichtigt aktiviert.
- Schwarzstartfaehigkeit wird nicht verschlechtert.
- Wallbox-, Pool- und andere Verbraucher verletzen keine Batterieprioritaet.
- Die Drei-Zaehlpunkt-Bilanz wird nicht mit lokalen Einzelwerten verwechselt.

### Stufe 7: Release-Abschluss

Ein Release gilt erst als abgeschlossen, wenn:

- technische und fachliche Verifikation erfolgreich sind,
- keine ungeplanten Nebeneffekte bestehen,
- der produktive Stand dem freigegebenen Commit zugeordnet ist,
- Deployment-Nachweis und Ergebnis dokumentiert sind,
- `knowledge/project_brain.md` und weitere fuehrende Dokumente bei dauerhaft geaendertem Projektstand aktualisiert wurden.

## Abbruchkriterien

Deployment oder Release sind sofort abzubrechen bei:

- nicht verifizierten Live-Pfaden,
- unerwarteten Schreibrechten,
- neuen oder geaenderten aktorischen Pfaden ohne Freigabe,
- Laufzeit- oder Syntaxfehlern,
- unplausiblen Batterie-, Netz- oder Leistungswerten,
- Kommunikationsverlust ohne dokumentiertes Fallback,
- Schreib- oder Neustartschleifen,
- fehlendem Backup,
- unklarem Rollbackweg,
- Abweichung zwischen beauftragtem und tatsaechlichem Umfang.

## Rollback-Arten

### 1. Repository-Rollback

- letzten bekannten freigegebenen Commit identifizieren,
- keine Historie stillschweigend umschreiben,
- Korrektur oder Revert nachvollziehbar committen,
- Wissensbasis und Changelog konsistent halten.

### 2. Skript-Rollback

- vorherige gesicherte Skriptversion wiederherstellen,
- Aktivierungszustand pruefen,
- betroffene EOS-States und Kommunikationsstatus kontrollieren,
- nach Wiederherstellung erneut technisch und fachlich verifizieren.

### 3. VIS2-Rollback

- vorherige fuehrende Quelle und Exportdatei wiederherstellen,
- Build- und JSON-Gueltigkeit pruefen,
- Ansicht auf Desktop und Mobilgeraet kontrollieren,
- sicherstellen, dass keine veralteten oder nicht freigegebenen State-Pfade verbleiben.

### 4. Aktorischer Rollback

- neue Sollwerte oder Settings deaktivieren beziehungsweise auf dokumentierten sicheren Stand setzen,
- vorherige Konfiguration wiederherstellen,
- Zielsystem und Rueckmeldung pruefen,
- Cerbo- und Hardware-Schutzstatus kontrollieren,
- automatische Wiederaktivierung veralteter Werte verhindern.

## Rollback-Entscheidung

Rollback ist erforderlich, wenn mindestens einer dieser Punkte eintritt:

- Sicherheits- oder Schutzgrenzen sind betroffen,
- Sollwert und Istwirkung weichen unerklaert ab,
- Kommunikationsausfall fuehrt zu unkontrolliertem Verhalten,
- Ressourcenverbrauch oder Logmenge steigen unvertretbar,
- fachliche Werte sind falsch oder unplausibel,
- VIS2 zeigt falsche oder sicherheitsrelevante Bedienfunktionen,
- der produktive Stand kann nicht eindeutig verifiziert werden.

Bei sicherheitskritischen Abweichungen hat Rollback Vorrang vor weiterer Ursachenanalyse im Live-System.

## Wiederanlauf nach Rollback

Nach einem Rollback gilt:

1. Live-System auf stabilen Zustand pruefen.
2. Kommunikations- und Schutzstatus kontrollieren.
3. Abweichung und Ursache dokumentieren.
4. Fehler nicht direkt im Live-System improvisiert korrigieren.
5. Korrektur erneut als kleine Release-Einheit im Repository vorbereiten.
6. Vollstaendigen Review- und Freigabeprozess wiederholen.

## Release-Nachweis

Jeder produktive Release soll mindestens dokumentieren:

- Repository und Branch,
- Commit-Hash,
- Release-Art,
- betroffene Dateien und Live-Komponenten,
- Datum und verantwortliche Ausfuehrung,
- verwendetes Backup,
- ausgefuehrte Dry-Run-, Apply- und Verifikationsschritte,
- Ergebnis,
- bekannte Abweichungen,
- Rollbackreferenz,
- Freigabestatus.

## Verifizierter Ist-Stand

- Repository und Live-System sind bewusst getrennt.
- Fuer ioBroker bestehen Inventar-, Dry-Run-, Apply- und Verifikationswerkzeuge.
- Battery V1 und Energy Flow V1 sind read-only und benoetigen keine aktorischen Schreibfreigaben.
- VIS2 wird versioniert im Repository gepflegt und separat deployt.
- Aktorische Pfade bleiben nur dort gueltig, wo sie separat dokumentiert und freigegeben sind.

## Offene Punkte

Weiterhin `Unklar`:

- verbindlicher Speicherort und Namensstandard fuer alle produktiven Deployment-Nachweise,
- vollstaendige automatische Testabdeckung vor Apply,
- konkrete maximale Beobachtungszeit je Release-Art,
- vollstaendige Liste aller Backup-Artefakte fuer Node-RED, Cerbo und Adapterkonfigurationen,
- standardisierte Freigabekennzeichnung fuer produktiv ausgerollte Commits,
- automatisierter, atomarer Rollback fuer alle Artefakttypen.
