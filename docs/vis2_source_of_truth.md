# VIS2 Source of Truth

## Zweck

Diese Datei legt fuer Battery VIS2 Read-Only V1 die fuehrende Quelle, das Exportartefakt und den faelligen Pflegeweg fest.

## Fuehrende Quelle

- [iobroker/vis-2/main/battery.html](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/iobroker/vis-2/main/battery.html)

`battery.html` ist die massgebliche Pflegequelle fuer die Batterie-Ansicht.
Hier werden Layout, Text, Struktur und EOS-States gepflegt.

## Export- und Importartefakt

- [iobroker/vis-2/main/vis-views.json](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/iobroker/vis-2/main/vis-views.json)

`vis-views.json` ist das aus `battery.html` und den weiteren VIS2-HTML-Fragmenten erzeugte Exportartefakt.
Die Datei dient als importierbarer Gesamtstand fuer die VIS2-Ansichten, ist aber nicht die fuehrende Pflegequelle fuer die Batterie-Ansicht.

## Verbindliche Pflege-Regel

- Aenderungen an der Batterie-Ansicht werden zuerst in `battery.html` gepflegt.
- Anschliessend wird `vis-views.json` aus dem HTML-Stand neu erzeugt.
- Die beiden Dateien duerfen nicht getrennt weiterentwickelt werden, wenn Drift vermieden werden soll.
- Eine reine Bearbeitung von `vis-views.json` ohne Rueckfuehrung nach `battery.html` ist fuer Battery VIS2 Read-Only V1 nicht der vorgesehene Pflegeweg.

## Konsequenz fuer kuenftige Aenderungen

- Neue oder geaenderte Battery-VIS2-Inhalte werden immer in `battery.html` begonnen.
- Danach wird der Export neu gebaut, damit `vis-views.json` mit dem HTML-Stand uebereinstimmt.
- Die VIS2-Batterieansicht bleibt dabei read-only und greift nur auf EOS-Battery-States zu.

## Einordnung

- `battery.html` ist die Quellenwahrheit fuer die Batterie-Ansicht.
- `vis-views.json` ist das generierte bzw. exportierte Gesamtartefakt fuer den VIS2-Import.
- `build_vis.py` bleibt der technische Build-Schritt zwischen beiden Artefakten.
