# EOS Traceability Matrix

## Zweck

Dieses Dokument definiert die verbindliche Nachverfolgbarkeit zwischen Anforderungen, Architekturentscheidungen, Spezifikationen, Modulen, State-Modellen, Implementierungen, Tests und Freigaben im EOS – Energy Operating System.

Nicht belegte Zuordnungen bleiben `Unklar`. Eine technische Implementierung gilt nicht automatisch als fachlich freigegeben.

## Traceability-Kette

Jede relevante EOS-Aenderung soll entlang folgender Kette nachvollziehbar sein:

```text
Requirement
    -> Architekturentscheidung
    -> Spezifikation
    -> State-Modell / Schnittstellenvertrag
    -> Implementierung
    -> Test- und Review-Nachweis
    -> Freigabe
    -> Projektwissen / Changelog
```

Eine Unterbrechung dieser Kette muss sichtbar dokumentiert werden.

## Verbindliche Referenztypen

### Requirement

Quelle:

- `knowledge/requirements.md`

Pflichtangaben:

- eindeutige Requirement-ID,
- fachlicher Zweck,
- Prioritaet,
- betroffene Komponenten,
- Status.

### Architekturentscheidung

Quelle:

- `knowledge/decisions.md`

Pflichtangaben:

- Datum und Kurztitel,
- Status,
- Kontext,
- Entscheidung,
- Begruendung,
- Auswirkungen,
- offene Punkte.

### Spezifikation

Quelle:

- fuehrende Datei unter `docs/` oder `knowledge/`

Pflichtangaben:

- Modulzweck,
- Scope und Nicht-Scope,
- Eingangsquellen,
- Ausgaben,
- Sicherheitsgrenzen,
- Abnahmekriterien.

### State-Modell oder Schnittstellenvertrag

Quellen:

- freigegebene State-Modelle unter `docs/`,
- `knowledge/EOS_Interface_Contract.md`,
- `knowledge/EOS_Communication_Matrix.md`,
- `knowledge/EOS_Module_Dependencies.md`.

Pflichtangaben:

- Pfade,
- Datentypen,
- Einheiten,
- Schreibrechte,
- Aktualisierungsverhalten,
- Fehler- und Timeoutverhalten,
- Verantwortlichkeiten.

### Implementierung

Quellen:

- `iobroker/scripts/energiemanagement/`,
- `iobroker/vis-2/`,
- Deployment- und Verifikationswerkzeuge.

Pflichtangaben:

- konkrete Datei oder Artefakt,
- zugehoerige Spezifikation,
- keine unerlaubte Scope-Erweiterung,
- nachvollziehbarer Commit.

### Test- und Review-Nachweis

Quellen:

- `knowledge/EOS_Test_Review_Acceptance_Strategy.md`,
- modulbezogene Review- oder Abnahmedokumente,
- Commit- und Diff-Nachweise.

Pflichtangaben:

- gepruefte Dateien,
- gepruefte Requirements,
- technische Checks,
- Ergebnis,
- Entscheidung `Freigeben` oder `Korrektur erforderlich`.

### Freigabe

Quellen:

- `knowledge/project_brain.md`,
- `knowledge/decisions.md`,
- modulbezogene Release-Status-Dateien,
- `CHANGELOG.md`.

Pflichtangaben:

- freigegebener Umfang,
- Commit-Hash,
- Version oder Phase,
- verbleibende offene Punkte.

## Traceability-Regeln

- Jede neue fachliche Funktion benoetigt mindestens eine Requirement-Referenz.
- Jede Architektur- oder Verhaltensaenderung benoetigt eine dokumentierte Entscheidung oder eine Aktualisierung einer bestehenden Entscheidung.
- Jede Implementierung muss auf eine Spezifikation und ein State-Modell beziehungsweise einen Schnittstellenvertrag verweisen koennen.
- Jeder Review muss die relevanten Requirements, Entscheidungen und Spezifikationen pruefen.
- Eine Freigabe darf nur den tatsaechlich geprueften Umfang umfassen.
- Commitbeschreibung oder Zusammenfassung ersetzt keine Dateipruefung.
- Nicht freigegebene Zielarchitektur darf nicht als Implementierungsauftrag behandelt werden.
- `Unklar` darf nicht durch Interpretation geschlossen werden.
- Inkompatible State- oder Schnittstellenaenderungen benoetigen eine neue Version und einen dokumentierten Migrationsweg.
- Dokumentationspflege ist Teil der Aenderung und kein nachgelagerter optionaler Schritt.

## Aenderungstypen und notwendige Nachweise

### Reine Dokumentationsaenderung

Mindestens erforderlich:

- betroffene fuehrende Dokumente,
- Konsistenzpruefung gegen `project_brain.md`, Requirements und Entscheidungen,
- Commit-Nachweis.

### Read-only EOS-Modul

Mindestens erforderlich:

- Requirement,
- Spezifikation,
- State-Modell,
- Quell- und Abhaengigkeitsnachweis,
- Test- und Review-Nachweis,
- Freigabecommit.

### Aktorisches EOS-Modul

Zusaetzlich erforderlich:

- vollstaendiger Schnittstellenvertrag,
- Sicherheits- und Vorrangregeln,
- Timeout-, Fallback- und Recovery-Verhalten,
- Backup- und Rollback-Nachweis,
- kontrollierter Live-Test,
- ausdrueckliche fachliche Freigabe.

### VIS2-Aenderung

Mindestens erforderlich:

- verwendete EOS-States,
- Abgrenzung zwischen Anzeige, Setting und Aktorik,
- fuehrende Pflegequelle,
- Build- und Exportnachweis,
- visuelle und technische Verifikation.

### Deployment- oder Tool-Aenderung

Mindestens erforderlich:

- betroffene Artefakte,
- Dry-Run- und Apply-Verhalten,
- Backup- und Rollback-Weg,
- Verifikationsschritte,
- Abbruchkriterien.

## Verifizierter Ist-Stand

### Battery V1

Traceability ist fuer den freigegebenen Umfang dokumentiert durch:

- `REQ-BAT-SUPERVISOR-V1`,
- Batterie- und Schutzrequirements,
- Entscheidungen in `knowledge/decisions.md`,
- Battery-Supervisor- und Health-Spezifikationen,
- freigegebene State-Modelle,
- Implementierungen `Battery_Supervisor_V1.js` und `Battery_Health_V1.js`,
- Battery VIS2 Read-Only V1,
- dokumentierten Release-Status.

Status: fuer V1 freigegeben und abgeschlossen.

### Energy Flow V1

Traceability ist fuer den freigegebenen Phase-2-Umfang dokumentiert durch:

- Energy-Flow-Spezifikation und State-Modell,
- Architektur-Review,
- Implementierung `Energy_Flow_V1.js`,
- Freigabe des dokumentierten Phase-2-Commits.

Status: Grid und Battery freigegeben; PV, House und Wallbox bleiben `UNKNOWN` und nicht vollstaendig spezifiziert.

### Zielmodule

Generation, Consumption, Wallbox, Pool, Communication, Historian, Notification, Scheduler, Forecast und Optimizer sind in der Masterarchitektur als `Zielbild – nicht freigegeben` dokumentiert.

Status: keine Implementierungsfreigabe aus dieser Nennung ableitbar.

## Traceability-Pruefung vor Freigabe

Vor jeder Freigabe ist mindestens zu pruefen:

1. Existiert eine eindeutige Requirement-Referenz?
2. Ist die Architekturentscheidung dokumentiert oder weiterhin unveraendert gueltig?
3. Entspricht die Implementierung der Spezifikation?
4. Stimmen State-Modell und tatsaechliche Pfade, Typen und Schreibrechte ueberein?
5. Sind Kommunikations-, Fehler-, Timeout- und Recovery-Regeln nachvollziehbar?
6. Sind Tests und Review-Ergebnisse dokumentiert?
7. Ist der freigegebene Umfang klar begrenzt?
8. Sind `project_brain.md`, Entscheidungen, Roadmap und Changelog konsistent?
9. Sind verbleibende offene Punkte als `Unklar` dokumentiert?
10. Ist der Freigabecommit eindeutig benannt?

## Offene Punkte

Weiterhin `Unklar`:

- vollstaendige Traceability des produktionsnahen Altbestands unter `iobroker/scripts/common/`,
- vollstaendige Zuordnung aller produktiven MQTT-, D-Bus-, S7- und HTTP-Schreibpfade,
- formale Testfall-IDs fuer alle kuenftigen Module,
- standardisierte maschinenlesbare Traceability-Auswertung,
- verbindliche Versionierungsstrategie fuer alle Zielmodule.
