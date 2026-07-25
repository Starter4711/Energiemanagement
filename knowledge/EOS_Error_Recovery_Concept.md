# EOS Error and Recovery Concept

## Zweck

Dieses Dokument definiert den verbindlichen Rahmen fuer Fehlererkennung, Degradation, Recovery und Wiederanlauf im EOS – Energy Operating System. Es beschreibt Architekturregeln und keine ungeprueften produktiven Grenzwerte. Nicht belegte Detailwerte bleiben `Unklar`.

## Grundprinzipien

- Hardware-Schutz und Cerbo-Echtzeitregelung bleiben auch bei Ausfall von EOS, ioBroker, MQTT oder Node-RED wirksam.
- Ein Kommunikations- oder Modulfehler darf keinen unkontrollierten Aktorwechsel ausloesen.
- Fehlende, veraltete oder unplausible Werte werden nicht geschaetzt.
- Read-only Module degradieren zu einem dokumentierten Status und schreiben keine Ersatz-Sollwerte.
- Aktorische Funktionen benoetigen je Schnittstelle ein explizites Ablauf-, Fallback- und Wiederanlaufverhalten.
- Recovery erfolgt stufenweise und erst nach erneuter Plausibilisierung.
- Ein Neustart darf keine veralteten Schreibwerte ungeprueft reaktivieren.

## Fehlerklassen

### Kommunikationsfehler

Beispiele:

- Quelle liefert keine Aktualisierung,
- MQTT-, Modbus-, S7-, HTTP- oder Adapterverbindung ist unterbrochen,
- Rueckmeldung eines Zielsystems fehlt,
- Zeitstempel oder Aktualitaet sind nicht mehr gueltig.

Erwartetes Verhalten:

- Status wechselt gemaess freigegebenem State-Modell auf `STALE`, `OFFLINE`, `UNKNOWN` oder einen spezifisch dokumentierten Fehlerzustand.
- Letzter bekannter Wert darf nur als historischer Wert sichtbar bleiben und nicht als aktuell gueltig gelten.
- Abhaengige Module duerfen keine neue fachliche Gueltigkeit ableiten.

### Plausibilitaetsfehler

Beispiele:

- Wert liegt ausserhalb des dokumentierten Wertebereichs,
- mehrere Quellen widersprechen sich,
- Einheit, Typ oder Semantik passen nicht zum Schnittstellenvertrag,
- physikalisch unmoeglicher Sprung oder unplausible Kombination.

Erwartetes Verhalten:

- betroffener Fachwert wird als unplausibel oder unbekannt markiert,
- fuehrende Quellenrolle wird nicht stillschweigend geaendert,
- Ersatzquellen werden nur genutzt, wenn dies ausdruecklich dokumentiert und freigegeben ist,
- aktorische Folgeentscheidungen werden gesperrt, wenn ihre Eingangsvoraussetzungen nicht mehr erfuellt sind.

### Modulfehler

Beispiele:

- Skriptabbruch,
- unvollstaendige Initialisierung,
- unerwartete Exception,
- inkonsistenter interner Zustand,
- fehlendes erforderliches Objekt oder State-Modell.

Erwartetes Verhalten:

- Fehler wird sichtbar und sparsam protokolliert,
- Modul setzt keine ungesicherten Fachwerte,
- andere Domaenen bleiben soweit moeglich unabhaengig funktionsfaehig,
- Neustart erfolgt nicht in einer unkontrollierten Dauerschleife.

### Plattform- oder Infrastrukturausfall

Betroffene Ebenen koennen sein:

- ioBroker,
- Synology oder Docker,
- MQTT-Broker,
- Netzwerk,
- Node-RED,
- Cerbo-Kommunikation,
- externe Historisierung oder Visualisierung.

Erwartetes Verhalten:

- Hardware-Schutz und lokale Cerbo-Regelung bleiben autonom,
- EOS-Strategie und Visualisierung duerfen ausfallen, ohne Schutzfunktionen zu deaktivieren,
- externe Analyse- oder Historisierungssysteme sind nicht sicherheitskritisch,
- nach Wiederkehr wird der Zustand neu eingelesen und nicht aus alten Annahmen rekonstruiert.

## Degradationsstufen

EOS verwendet fachlich getrennte Degradationsstufen. Die konkrete Statusmenge wird je Modul im State-Modell festgelegt.

1. `OK`: Quellen aktuell, plausibel und vollstaendig genug fuer den freigegebenen Funktionsumfang.
2. `DEGRADED`: Teilinformationen fehlen, read-only Sicht bleibt eingeschraenkt nutzbar.
3. `STALE`: Daten sind vorhanden, aber nicht mehr aktuell.
4. `OFFLINE`: Quelle oder Zielsystem ist nicht erreichbar.
5. `UNKNOWN`: fachliche Aussage ist nicht belastbar.
6. `ERROR`: Modul oder Schnittstelle kann den vorgesehenen Umfang nicht sicher erfuellen.
7. `BLOCKED`: aktorische Funktion ist wegen fehlender Voraussetzungen gesperrt.

Ein Status darf nur verwendet werden, wenn seine Bedeutung im jeweiligen Modulvertrag eindeutig definiert ist.

## Timeout-Regeln

- Timeouts sind je Quelle und fachlicher Reaktionszeit zu definieren.
- Ein globaler Standardwert darf nicht ungeprueft auf alle Protokolle und Domaenen uebertragen werden.
- Warning-, Stale- und Offline-Schwellen muessen getrennt betrachtet werden, wenn das Modul dies benoetigt.
- Timeout-Auswertung soll ressourcenschonend und moeglichst ereignisgesteuert erfolgen.
- Wiederholte identische Fehler duerfen das Logging nicht ueberfluten.
- Konkrete produktive Schwellen bleiben in den jeweiligen Spezifikationen oder Settings-States dokumentiert.

## Verhalten bei aktorischen Schnittstellen

Ein aktorischer Pfad muss vor Freigabe mindestens festlegen:

1. Gueltigkeitsdauer eines Sollwerts,
2. Verhalten bei ausbleibender Quittierung,
3. Verhalten bei Verlust der Eingangsdaten,
4. Verhalten bei Ausfall von ioBroker, MQTT oder Node-RED,
5. sicheren Default oder Uebergang in lokale Regelung,
6. maximale Wiederholrate,
7. Rueckmelde- und Wirksamkeitspruefung,
8. Sperrbedingungen,
9. manuelle Freigabeanforderungen nach kritischem Fehler,
10. Rollback-Verfahren.

Ohne diese Angaben ist ein aktorischer Pfad nicht freigegeben.

## Wiederanlauf

### Initialisierung

Nach Start eines EOS-Moduls:

- erforderliche Objekte und States werden geprueft,
- Quellen werden eingelesen,
- Aktualitaet und Plausibilitaet werden bewertet,
- Fachwerte werden erst nach ausreichender Initialisierung als gueltig markiert,
- Schreibpfade bleiben bis zur erfolgreichen Pruefung gesperrt.

### Wiederkehr einer Quelle

Nach `STALE`, `OFFLINE` oder `ERROR`:

- die Quelle wird nicht nach einem einzelnen Wert sofort als stabil betrachtet,
- Zeitstempel, Wertebereich und Zusammenhang mit anderen Quellen werden erneut geprueft,
- der Status wird erst nach dokumentierten Kriterien auf `OK` gesetzt,
- abhaengige aktorische Funktionen bleiben bis zur erfolgreichen Recovery gesperrt.

### Wiederanlauf aktorischer Funktionen

- alte Sollwerte werden nicht ungeprueft wiederholt,
- der aktuelle Istzustand des Zielsystems wird zuerst gelesen,
- konkurrierende Anforderungen werden neu bewertet,
- ein Wiederanlauf darf keinen Last-, Lade- oder Entladesprung erzeugen,
- kritische Funktionen koennen eine manuelle Quittierung oder explizite Freigabe benoetigen.

## Fehlerisolation

- Ein Domaenenfehler darf nicht automatisch alle EOS-Domaenen auf `ERROR` setzen.
- Querschnittsmodule duerfen Fehler verdichten, aber keine fremden Domaenenwerte ueberschreiben.
- Energy Flow darf bei Ausfall einer Quelle die anderen Domaenen weiterhin anzeigen und den fehlenden Anteil als `UNKNOWN` markieren.
- Battery Supervisor und Battery Health bleiben nicht-aktorisch und duerfen keine Schutzlogik ersetzen.
- Historian, Notification und VIS2 sind nachgelagert und duerfen die Fachmodule nicht blockieren.

## Logging und Benachrichtigung

- Zustandswechsel und erstmalige Fehler werden protokolliert.
- Dauerhafte identische Fehler werden gedrosselt.
- Recovery wird nachvollziehbar protokolliert.
- Benachrichtigungen muessen priorisiert und entprellt sein.
- Logging oder Notification duerfen keinen sicherheitskritischen Produktivpfad blockieren.
- Konkrete Alarm- und Quittierungsregeln bleiben je Domaene zu spezifizieren.

## Verifikation

Fuer jedes Modul sind mindestens folgende Fehlerfaelle zu pruefen:

- Quelle fehlt beim Start,
- Quelle wird waehrend des Betriebs veraltet,
- Quelle wird offline,
- unplausibler Einzelwert,
- widerspruechliche Quellen,
- Neustart des Moduls,
- Neustart von ioBroker,
- Wiederkehr nach Kommunikationsunterbrechung,
- fehlende oder negative Zielrueckmeldung bei aktorischen Pfaden,
- Rollback auf den letzten freigegebenen Stand.

## Verifizierter Ist-Stand

- Battery Supervisor V1 besitzt eine dokumentierte Communication-Baseline mit Warning- und Offline-Bewertung.
- Battery Health V1 ist nicht-aktorisch.
- Energy Flow V1 ist read-only und verwendet `UNKNOWN` fuer nicht angebundene Domaenen.
- Hardware-Schutz und Cerbo-Echtzeitregelung bleiben ausserhalb der EOS-Recovery-Logik fuehrend.
- Konkrete produktive Recovery-Vertraege fuer Wallbox, Pool und Victron-Sollwerte sind noch nicht vollstaendig dokumentiert.

## Offene Punkte

Weiterhin `Unklar`:

- konkrete Timeout- und Recovery-Schwellen je produktiver Quelle,
- vollstaendige Liste aktorischer Fallbackwerte,
- Notabschaltungsszenarien und manuelle Quittierungsregeln,
- standardisiertes Alarm- und Acknowledgement-Modell,
- Recovery-Verhalten aller produktiven Altbestandsskripte,
- verbindliche Wiederanlaufreihenfolge ueber ioBroker, MQTT, Node-RED und Cerbo hinweg.
