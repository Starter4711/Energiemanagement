# Changelog Policy

## Grundsatz

- Jede relevante Aenderung braucht einen nachvollziehbaren Git-Commit.
- Architekturentscheidungen gehoeren nach `knowledge/decisions.md`.
- Laufende Aenderungen werden zusaetzlich in `CHANGELOG.md` dokumentiert.

## Changelog-Format

```text
## YYYY-MM-DD
- Added
- Changed
- Fixed
- Removed
- Notes
```

## Trennung der Inhalte

- Dokumentationsaenderungen getrennt von Codeaenderungen dokumentieren.
- Deploymentaenderungen getrennt von Architekturentscheidungen dokumentieren.
- Architekturentscheidungen nicht als reine Changelog-Zeile verpacken, sondern in `knowledge/decisions.md` festhalten.

## Schutzregeln

- `CHANGELOG.md` darf keine Secrets oder privaten Zugangsdaten enthalten.

