# Project Memory

## Projekt

Name: Energiemanagement

Repository: privates GitHub-Repository

## Zweck

Dieses Dokument sammelt den dauerhaften Kontext, damit wir das Projekt ueber viele Sitzungen hinweg konsistent weiterentwickeln koennen.

## Grundregeln

- Dieses Repository ist die Quelle der Wahrheit fuer Code, Dokumentation und Entscheidungen.
- Wichtige Annahmen, Ziele und Richtungswechsel werden hier oder in `docs/decisions.md` festgehalten.
- Vor groesseren Umbauten wird der aktuelle Kontext aus diesen Dateien gelesen.

## Bisherige Entscheidungen

- Das Projekt wird ueber GitHub aufgebaut.
- Das Repository soll privat sein.
- Der Repository-Name lautet `Energiemanagement`.
- GitHub soll die Referenz und das Backup fuer ioBroker-Skripte sein.
- Der Code im ioBroker-System ist die Live-Version und wird aus dem Repository heraus angelegt, geaendert und optimiert.

## Zielumgebung

- ioBroker laeuft in Docker auf einer Synology.
- Relevanter Arbeitsbereich: JavaScript-Skripte im ioBroker JavaScript Script Editor.
- Gewuenschte Operationen: Skripte anlegen, aendern, loeschen und synchronisieren.
- Gewaehlte Zugriffsmethode: SSH auf die Synology, danach `docker exec` in den ioBroker-Container.
- Deployment-Grundsatz: Repository-Dateien sind Referenz; vor Live-Aenderungen wird der aktuelle ioBroker-Stand gesichert.

## Offene Klaerungen

- Welche Energiequellen, Verbraucher, Sensoren, Datenformate oder Schnittstellen sind relevant?
- Wie ist ioBroker im Netzwerk erreichbar?
- Ist der ioBroker JavaScript-Adapter installiert und aktiv?
- Wie heisst der Docker-Container oder Docker-Compose-Service fuer ioBroker?
- Welcher SSH-Benutzer darf Docker-Befehle auf der Synology ausfuehren?
