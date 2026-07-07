# Documentation Governance

## Rollen

- `docs/` = Analyse, Fachdetails, Betriebsdokumente, historische und ausfuehrliche Projektdokumentation
- `knowledge/` = verdichtetes, dauerhaftes Engineering-Wissen fuer Architektur, Codex und zukunftige Entscheidungen
- `PROJECT_MEMORY.md` = historisches Projektgedaechtnis, nicht mehr fuehrende Quelle

## Fuehrende Quellen

- `AGENTS.md`
- `knowledge/README.md`
- `knowledge/*`
- `docs/project_analysis.md`

## Arbeitsprinzipien

- Informationen sollen nicht doppelt gepflegt werden.
- Bei Ueberschneidungen verweist die ergaenzende Datei auf die fuehrende Datei.
- Neue gesicherte Erkenntnisse werden in der passendsten fuehrenden Datei dokumentiert.
- Unsichere Inhalte bleiben mit `Unklar` markiert.

## Verweislogik

- Detail- und Fachdokumente unter `docs/` ergaenzen die Knowledge Base, ersetzen sie aber nicht.
- Dauerhafte Architektur- und Engineering-Festlegungen gehoeren in `knowledge/`.
- Historische oder ueberholte Projektkontexte bleiben in `PROJECT_MEMORY.md` sichtbar, sind aber nicht mehr massgeblich.
