# Battery VIS2 Documentation Check V1

## Gepruefte Dateien

- [docs/vis2_source_of_truth.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/docs/vis2_source_of_truth.md)
- [docs/battery_vis2_readonly_v1_spec.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/docs/battery_vis2_readonly_v1_spec.md)
- [docs/battery_vis2_readonly_v1_state_mapping.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/docs/battery_vis2_readonly_v1_state_mapping.md)
- [knowledge/project_brain.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/knowledge/project_brain.md)

## Feststellung

Abweichung.

Die vier Dokumente sind nicht vollstaendig deckungsgleich.

## Konkrete Abweichung

- [docs/battery_vis2_readonly_v1_state_mapping.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/docs/battery_vis2_readonly_v1_state_mapping.md) fuehrt weiterhin einen eigenen `Health`-Block mit den States `0_userdata.0.EOS.Battery.Health.*`.
- [docs/battery_vis2_readonly_v1_spec.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/docs/battery_vis2_readonly_v1_spec.md) beschreibt die read-only Batterieansicht hingegen nur mit `Summary`, `Communication`, `Warnings`, `SmartShunt-Grundwerte` und `Pack-Grundwerte`.
- [docs/vis2_source_of_truth.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/docs/vis2_source_of_truth.md) legt als Pflegeweg die Batterie-Ansicht ueber `battery.html` und `vis-views.json` fest, enthaelt aber keine Aussage zum Health-Block.
- [knowledge/project_brain.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/knowledge/project_brain.md) beschreibt die Battery VIS2 Read-Only V1 als read-only und nur auf EOS-Battery-States basierend, fuehrt den Health-Block aber nicht mehr als explizite VIS2-Aussage.

## Korrektur-Empfehlung

1. Den `Health`-Block aus [docs/battery_vis2_readonly_v1_state_mapping.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/docs/battery_vis2_readonly_v1_state_mapping.md) entfernen oder in eine als nicht-hauptsichtlich markierte Detail-Notiz verschieben.
2. Anschliessend in [docs/battery_vis2_readonly_v1_spec.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/docs/battery_vis2_readonly_v1_spec.md) und [knowledge/project_brain.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/knowledge/project_brain.md) die gleiche Entscheidung spiegeln, damit Spezifikation, State-Mapping und Projektgedaechtnis identisch bleiben.
3. Wenn `Health` bewusst erhalten bleiben soll, muessen [docs/vis2_source_of_truth.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/docs/vis2_source_of_truth.md) und [docs/battery_vis2_readonly_v1_spec.md](/Users/richardnussdorfer/Documents/GitHub/Energiemanagement/docs/battery_vis2_readonly_v1_spec.md) die Health-Anzeige ebenfalls explizit nennen.

## Einordnung

Es gibt keine Implementierungsabweichung im Sinne eines Codefehlers.
Die Abweichung ist rein dokumentarisch und betrifft die fachliche Benennung der sichtbaren Batterie-Teilbereiche.
