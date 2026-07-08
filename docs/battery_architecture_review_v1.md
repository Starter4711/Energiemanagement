# Battery Architecture Review V1

## Umfang

Geprueft wurde die EOS-Battery-Kette aus:

- `Battery_Supervisor_V1`
- `Battery_Health_V1`
- `Battery VIS2 Read-Only V1`

Pruefgrundlage waren die dokumentierten Spezifikationen, `knowledge/project_brain.md`, `CHANGELOG.md` und der aktuelle Repository-Stand der VIS2-Ansicht.

## Festgestellte Abweichungen

1. Die Spezifikation von `Battery_Supervisor_V1` beschreibt weiterhin eine `Recommendation`-Gruppe und eine `Settings`-Gruppe als Teil der geplanten Ausgabe.
   Im aktuellen Script-Stand erzeugt der Supervisor jedoch nur die freigegebene EOS-Battery-Baseline mit Summary, SmartShunt, Packs, Communication, Warnings und Settings fuer die Kommunikationsschwellen.
   Die dokumentierte Ausgabe und die reale Implementierung sind damit in diesem Punkt nicht mehr identisch.

2. Die VIS2-Batterieansicht ist als read-only auf EOS-States umgesetzt, aber die Quellenlage ist doppelt.
   Es existiert sowohl die explizite HTML-Datei `iobroker/vis-2/main/battery.html` als auch der eingebettete View-Inhalt in `iobroker/vis-2/main/vis-views.json`.
   Dadurch koennen Aenderungen leicht auseinanderlaufen, wenn nur eine der beiden Quellen gepflegt wird.

3. Die Dokumentation von `Battery VIS2 Read-Only V1` bezeichnet die Ansicht teilweise noch als spaetere bzw. offene Ausbaustufe, waehrend `knowledge/project_brain.md` sie bereits als implementiert fuehrt.
   Das ist fachlich nicht falsch, aber es erzeugt Interpretationsspielraum darueber, ob die VIS2-Ansicht als freigegeben, nur spezifiziert oder vollstaendig abgeschlossen gilt.

## Risiken

- Stale Spezifikation bei `Battery_Supervisor_V1` kann Folgeaufgaben in eine falsche Erwartung an Recommendation-States oder an eine breitere Ausgabe fuehren.
- Doppelte VIS2-Quellen erhoehen das Risiko von Drift zwischen Editor-Datei und exportierter JSON-Ansicht.
- Uneinheitliche Formulierung von `Battery VIS2 Read-Only V1` kann spaetere Reviews oder neue ChatGPT-Chats bei der Einordnung des Implementierungsstands irrefuehren.

## Verbesserungsvorschlaege

- Die Supervisor-Spezifikation auf den tatsaechlich freigegebenen EOS-Baseline-Stand synchronisieren und nicht mehr von einer Recommendation-Gruppe ausgehen, wenn diese nicht implementiert ist.
- Eine einzige Fuehrungsquelle fuer die VIS2-Batterieansicht festlegen, damit `battery.html` und `vis-views.json` nicht parallel auseinanderlaufen.
- Den Status von `Battery VIS2 Read-Only V1` in der Wissensbasis klar als implementiert, aber weiterhin dokumentations- und abstimmungsbeduerftig markieren, solange noch offene Punkte existieren.

## Offene Punkte

- Unklar, ob die Recommendation-Ebene fuer `Battery_Supervisor_V1` spaeter wieder eingefuehrt wird oder dauerhaft aus der EOS-Battery-Kette entfällt.
- Unklar, ob `battery.html` oder `vis-views.json` als maßgebliche Pflegequelle fuer die VIS2-Batterieansicht gilt.
- Unklar, ob die aktuelle VIS2-Batterieansicht als final freigegebene Sicht oder nur als stabile Zwischenstufe betrachtet werden soll.
