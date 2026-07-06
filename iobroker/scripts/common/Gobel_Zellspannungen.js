// ioBroker object: script.js.common.Gobel_Zellspannungen
// name: Gobel_Zellspannungen
// engineType: Javascript/js
// enabled: False

// Konfiguration
const numDevices = 4;
const numCells = 16;
const startRegister = 40016;
const UPDATE_INTERVAL_MS = 60000;  // Genau 1x pro Minute (60s)

// 1. INITIALISIERUNG & DATENPUNKT-ERZEUGUNG IN MQTT.2 (Läuft nur 1x beim Start)
for (let d = 1; d <= numDevices; d++) {
    const mqttTopic = `mqtt.2.Gobel.Gobel_${d}_All_Voltages`;
    
    // extendObject erzwingt das Anlegen/Aktualisieren im fremden Adapter-Verzeichnis
    extendObject(mqttTopic, {
        type: 'state',
        common: {
            name: `Gobel ${d} Alle 16 Zellspannungen als JSON-Liste`,
            type: 'string',
            role: 'json',
            read: true,
            write: true,
            def: '{"value":[]}'
        },
        native: {}
    }, function(err) {
        if (!err) {
            log(`Datenpunkt ${mqttTopic} wurde erfolgreich angelegt/überprüft.`, 'info');
        } else {
            log(`Fehler beim Anlegen von ${mqttTopic}: ${err}`, 'error');
        }
    });
}

// 2. DER MINUTEN-TAKT (Sorgt für die exakte Ausführung alle 60 Sekunden)
setInterval(function() {
    log("Starte minütliches Gobel-BMS Update...", "info");
    for (let d = 1; d <= numDevices; d++) {
        buildAndPublishJson(d);
    }
}, UPDATE_INTERVAL_MS);

// 3. VERARBEITUNG & SENDEN
function buildAndPublishJson(deviceId) {
    const currentVoltages = [];
    const baseId = `modbus.1.holdingRegisters.${deviceId}.`;

    // 16 Werte aus dem Modbus-RAM-Cache lesen
    for (let i = 0; i < numCells; i++) {
        const stateId = `${baseId}${startRegister + i}_Cell_Voltage_${i + 1}`; 
        const state = getState(stateId);
        
        if (state && state.val !== undefined && state.val !== null) {
            currentVoltages.push(state.val);
        } else {
            currentVoltages.push(0); 
        }
    }

    const jsonPayload = JSON.stringify({ value: currentVoltages });
    const mqttTopic = `mqtt.2.Gobel.Gobel_${deviceId}_All_Voltages`;

    // ack=false triggert den MQTT-Adapter aktiv zum Senden
    setState(mqttTopic, jsonPayload, false);
    log(`Device ${deviceId} an MQTT-Adapter übergeben: ${jsonPayload}`, "info");
}

// Sofort-Start nach 3 Sekunden beim Speichern
setTimeout(function() {
    log("Initialer Skriptstart: Erster Durchlauf...", "info");
    for (let d = 1; d <= numDevices; d++) {
        buildAndPublishJson(d);
    }
}, 3000);
