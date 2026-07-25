# Grid Flow V1 Spezifikation

## Ziel

`Grid_Flow_V1` stellt die drei physischen Netz-Zählpunkte als read-only EOS-Sicht unter `0_userdata.0.EOS.Grid.*` bereit.

Die Nummer eines Zählpunkts ist die `DeviceInstance` des Grid-Zählers im jeweils zuständigen Victron-System. Eine frei vergebene laufende Nummer wird nicht verwendet.

## Quellen

| EOS-Quelle | Victron-DeviceInstance | Standort | bestehender Alias |
| --- | ---: | --- | --- |
| `Grid40` | 40 | Alte Wohnung | `alias.0.EM24 Old Grid.Power Old Grid` |
| `Grid41` | 41 | Halle | `alias.0.EM24 Hall Grid.Power` |
| `Grid43` | 43 | Haus / neues Haus | `alias.0.EM24 New Grid.Power` |

`Grid42` ist der EM24 40A und ausdrücklich kein eigener Netz-Zählpunkt. Er wird von diesem Modul nicht gelesen.

DeviceInstances sind innerhalb des jeweiligen Venus-Systems zu interpretieren. Abweichende Nummern gespiegelter Geräte im zentralen Venus-Gateway ändern die oben festgelegte Quellzuordnung nicht.

## Vorzeichen und Einheiten

- Leistung wird ausschließlich numerisch in Watt ausgegeben.
- Positive Leistung bedeutet Netzbezug.
- Negative Leistung bedeutet Einspeisung.
- Statuswerte sind Strings.
- Nicht gültige Leistungswerte werden als `0 W` ausgegeben; der zugehörige Status verhindert die Interpretation als bestätigte Nulllast.

## State-Modell

Je Quelle unter `0_userdata.0.EOS.Grid.Sources.Grid40|Grid41|Grid43`:

- `DeviceInstance`: numerisch
- `Location`: String
- `Power`: numerisch, W
- `Status`: String
- `LastUpdate`: numerischer Millisekunden-Zeitstempel
- `AgeSeconds`: numerisch, s

Summary unter `0_userdata.0.EOS.Grid.Summary`:

- `Power`: rechnerischer momentaner Saldo der drei physischen Netz-Zählpunkte in W
- `Status`: String
- `LastUpdate`: numerischer Millisekunden-Zeitstempel

Der Momentansaldo ist keine 15-Minuten-Abrechnung und keine Aussage über einen einzelnen physischen Netzfluss.

## Aktualität

- `OK`: höchstens 30 Sekunden alt
- `STALE`: älter als 30 Sekunden
- `OFFLINE`: älter als 120 Sekunden
- zentrale Altersprüfung alle 60 Sekunden
- `ERROR`: Quellwert nicht numerisch oder nicht endlich
- `UNKNOWN`: Quelle oder Zeitstempel fehlt
- `DEGRADED`: mindestens eine, aber nicht alle Quellen sind `OK`

Der Summary-Saldo wird nur bei drei Quellen mit Status `OK` berechnet. Andernfalls bleibt er numerisch `0 W` und der Summary-Status zeigt den Fehlerzustand.

## Abgrenzung

- rein lesend und ereignisgesteuert
- keine Aktorik oder Regelung
- keine Abrechnung oder 15-Minuten-Saldierung
- keine Zuordnung des RS450 zu einem Grid-Zähler
- keine Änderung bestehender Aliase, MQTT-Pfade oder Victron-Konfigurationen
- noch keine Umschaltung von `Energy_Flow_V1`; diese erfolgt erst nach Test und fachlichem Review
