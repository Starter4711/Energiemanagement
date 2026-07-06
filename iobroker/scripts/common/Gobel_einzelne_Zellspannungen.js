// ioBroker object: script.js.common.Gobel_einzelne_Zellspannungen
// name: Gobel_einzelne_Zellspannungen
// engineType: Javascript/js
// enabled: False

// --- KONFIGURATION ---
const targetFolder = "mqtt.1.Gobel";    // Zielpfad geändert auf Gobel
const batteryCount = 4;                 // Anzahl deiner Gobel-Batterien (1 bis 4)
const cellsPerBattery = 16;             // 16 Zellen pro Batterie

// Funktion zum Erstellen der Datenpunkte via korrektem 'setObject'
function createMqttStates() {
    for (let b = 1; b <= batteryCount; b++) {
        for (let c = 1; c <= cellsPerBattery; c++) {
            let stateId = `${targetFolder}.Gobel_${b}_Cell_${c}`;
            
            setObject(stateId, {
                type: 'state',
                common: {
                    name: `Gobel ${b} Zelle ${c} Spannung (JSON)`,
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: true
                },
                native: {}
            });
        }
    }
}

// Hauptfunktion zum Synchronisieren der Werte
function syncIndividualVoltages() {
    for (let b = 1; b <= batteryCount; b++) {
        for (let c = 1; c <= cellsPerBattery; c++) {
            let address = 40015 + c; // 40016 für Zelle 1
            let sourceId = `modbus.1.holdingRegisters.${b}.${address}_Cell_Voltage_${c}`;

            if (existsState(sourceId)) {
                let val = getState(sourceId).val;

                // Konvertierung von mV in V
                if (val > 100) val = val / 1000; 
                val = Math.round(val * 1000) / 1000; // Auf 3 Nachkommastellen runden

                // Erstellt das JSON-Format: {"value":3.232}
                let jsonPayload = JSON.stringify({ value: val });
                setState(`${targetFolder}.Gobel_${b}_Cell_${c}`, jsonPayload, true);
            }
        }
    }
}

// 1. Datenpunkte sofort beim Skriptstart anlegen lassen
createMqttStates();

// 2. Werte alle 5 Sekunden aktualisieren
schedule("*/5 * * * * *", syncIndividualVoltages);

// 3. Nachlauf von 1 Sekunde beim Start für den ersten Durchlauf
setTimeout(syncIndividualVoltages, 1000);
