# Script Logging Policy

## Grundsatz

- Alle neuen produktiven Skripte muessen eine zuschaltbare Logebene unterstuetzen.
- Standardzustand ist minimales Logging, kein dauerhaftes Detail-Logging.
- Debug- und Trace-Logging darf nur bewusst aktiviert werden.

## Anforderungen an Logging

- Logging muss ressourcenschonend sein.
- Wiederholte identische Meldungen muessen gedrosselt werden.
- Logfiles duerfen nicht unkontrolliert wachsen.
- Logfile-Pfade muessen dokumentiert und konfigurierbar sein.
- Keine blockierenden File-I/O-Schreibmuster in schnellen Regelzyklen.

## Empfohlene Log-Level

- `OFF`
- `ERROR`
- `WARN`
- `INFO`
- `DEBUG`
- `TRACE`

## Einordnung fuer neue ioBroker-JavaScript-Skripte

- Fuer neue ioBroker-JavaScript-Skripte soll eine gemeinsame Logging-Struktur vorbereitet werden.
- In diesem Task wird noch kein Code geaendert.
- Bestehende Skripte werden durch diese Policy nicht automatisch veraendert.

