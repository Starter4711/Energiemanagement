# Entscheidungen

Dieses Dokument haelt wichtige Projektentscheidungen fest.

## 2026-07-05: GitHub als Projektakte

Das Projekt wird in einem privaten GitHub-Repository aufgebaut. Code, Dokumentation, Projektgedaechtnis und spaetere Aufgaben sollen dort nachvollziehbar gepflegt werden.

Gruende:

- Gemeinsame dauerhafte Quelle der Wahrheit.
- Aenderungen bleiben ueber Git nachvollziehbar.
- Der Projektkontext kann in spaeteren Sitzungen wieder eingelesen werden.

## 2026-07-05: GitHub als Referenz, ioBroker als Live-System

Die ioBroker-JavaScript-Skripte sollen im Repository gepflegt werden. Das GitHub-Repository ist Referenz, Historie und Backup. Die Skripte im ioBroker-System sind die Live-Version.

Geplante Arbeitsweise:

- Skripte werden zuerst im Repository erstellt oder angepasst.
- Aenderungen werden versioniert und nach ioBroker uebertragen.
- Live-Aenderungen in ioBroker sollen nach Moeglichkeit wieder ins Repository zurueckgefuehrt werden.
- Zugangsdaten, Tokens und lokale Verbindungsdaten werden nicht in Git gespeichert.

Noch offen ist die technische Verbindung zu ioBroker. Bevor Live-Aenderungen erfolgen, wird eine sichere Zugriffsmethode festgelegt und mit einem ungefaehrlichen Lesetest verifiziert.
