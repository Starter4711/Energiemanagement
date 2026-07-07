# CHANGELOG

## 2026-07-07
- Added
  - `docs/vis_live_sync_report.md` fuer den Live-Abgleich von VIS1 und VIS2 ergaenzt
  - Live-Backups von VIS1 und VIS2 unter `iobroker/backups/20260707T180000Z/` abgelegt
- Changed
  - VIS1 als aktuell produktive Visualisierung und VIS2 als Ziel-Visualisierung dokumentiert
  - `docs/vis_live_sync_report.md` auf den geklaerten Produktivstatus von VIS1 und die Zielrolle von VIS2 aktualisiert
  - `knowledge/open_questions.md` um weiterhin offene VIS1-Fragen bereinigt und praezisiert
- Notes
  - VIS2 stimmt mit dem Repository-Stand unter `iobroker/vis-2/main/` ueberein
  - VIS1 ist die produktive Alt-Visualisierung und bleibt vor VIS-Arbeiten zu sichern

## 2026-07-07
- Added
  - Frischer Live-Export aus dem ioBroker-Container gezogen und `iobroker/manifest.json` aktualisiert
- Changed
  - `docs/iobroker_live_sync_report.md` auf den frischen Live-Export umgestellt
  - Repository und Live-Stand erneut fuer `script.js.common.*` und `script.js.energiemanagement.*` abgeglichen
- Notes
  - Im frischen Export fehlen `script.js.energiemanagement.Bilanz_Zaehlpunkte` und `script.js.energiemanagement.Debug` gegenueber dem Repository

## 2026-07-07
- Added
  - `docs/iobroker_live_sync_report.md` fuer den Live-Abgleich zwischen ioBroker und Repository ergaenzt
- Changed
  - Live-Stand aus ioBroker gegen den Repository-Stand fuer `script.js.common.*` und `script.js.energiemanagement.*` verglichen
  - Keine produktiven Skripte, ioBroker-Objekte oder Enabled-Status geaendert
- Notes
  - Der exportierte Stand war fuer den Vergleich inhaltlich konsistent

## 2026-07-07
- Added
  - AI-Knowledge-Base eingefuehrt
  - Requirements-Struktur eingefuehrt
  - Knowledge-Navigation und Governance weiter verdichtet
  - Oesterreichisches Zahlenformat als Dokumentationsstandard ergaenzt
- Changed
  - Hardware-Topologie dokumentiert
  - Batteriearchitektur dokumentiert
  - Design Principles eingefuehrt
  - Knowledge-Base-Governance eingefuehrt
  - Requirements-Markdown lesbarer formatiert
- Notes
  - Review-/Engineering-Prozess wird eingefuehrt
