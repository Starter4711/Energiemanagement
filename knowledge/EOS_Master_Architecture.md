# EOS Master Architecture

## Projektziel
EOS (Energy Operating System) ist ein lernendes Regelsystem für genau eine Energieanlage. Ziel ist es, den Netzbezug so gering wie möglich zu halten, die Versorgungssicherheit zu gewährleisten, die Batterie zu schonen und die Energie wirtschaftlich zu nutzen.

## Grundprinzipien
- Versorgungssicherheit hat höchste Priorität.
- Die Batterie dient primär dem Hausbetrieb.
- Pool, Wallbox und optionale Verbraucher werden grundsätzlich nicht aus der Batterie versorgt, sofern keine definierte Strategie dies erlaubt.
- EOS ergänzt das bestehende Victron-ESS, ersetzt es nicht.
- Entscheidungen basieren auf Messwerten, Prognosen und historischen Erfahrungen.
- Maximale Wetter- und Planungsprognose: 7 Tage.

## Entwicklungsmodell
1. Beobachten
2. Prognose
3. Empfehlung
4. Teilautomatik
5. Vollautomatische Übernahme in den EOS-Core nach erfolgreicher Erprobung.

## Architekturregel
Neue Funktionen werden zuerst beobachtet und bewertet. Erst nach nachgewiesenem Nutzen werden sie automatisiert.

## Source of Truth
Diese Datei ist die führende Architekturreferenz des EOS-Projekts. Alle weiteren Module und Dokumente orientieren sich an dieser Architektur.
