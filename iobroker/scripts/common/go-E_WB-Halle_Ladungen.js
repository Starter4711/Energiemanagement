// ioBroker object: script.js.common.go-E_WB-Halle_Ladungen
// name: go-E_WB-Halle_Ladungen
// engineType: Javascript/js
// enabled: True

/*******************************************************
 * go-e Charger – Ladesessions Logger (FINAL++)
 * ✔ lesbare Zeit
 * ✔ stabile Erkennung über Ladeleistung
 *******************************************************/

const ROOT = 'javascript.0.goE.sessions';
const ENERGY_STATE = 'go-e.2.loaded_energy_kwh';
const POWER_STATE = 'go-e.2.energy.power';

// Schwellwert ab wann "Laden aktiv"
const POWER_THRESHOLD = 100; // Watt

let sessionActive = false;
let startEnergy = 0;
let startTime = 0;

// Session-ID persistent
createState(`${ROOT}.lastSessionId`, 0, { type: 'number' });

// --- nächste Session-ID ---
function getNextSessionId() {
    let id = getState(`${ROOT}.lastSessionId`).val || 0;
    id++;
    setState(`${ROOT}.lastSessionId`, id, true);
    return 'session_' + id.toString().padStart(3, '0');
}

// --- Start ---
function startSession() {
    startEnergy = getState(ENERGY_STATE).val;
    startTime = Date.now();
    sessionActive = true;

    log('🔌 Ladesession gestartet');
}

// --- Ende ---
function endSession() {
    const endEnergy = getState(ENERGY_STATE).val;
    const endTime = Date.now();

    const energy = Math.max(0, endEnergy - startEnergy);
    const duration = Math.round((endTime - startTime) / 60000);

    const id = getNextSessionId();
    const path = `${ROOT}.${id}`;

    // lesbare Zeiten
    const startReadable = new Date(startTime).toLocaleString();
    const endReadable = new Date(endTime).toLocaleString();

    createState(`${path}.startTime`, startTime, { type: 'number', role: 'value.time' });
    createState(`${path}.startTime_readable`, startReadable, { type: 'string' });

    createState(`${path}.endTime`, endTime, { type: 'number', role: 'value.time' });
    createState(`${path}.endTime_readable`, endReadable, { type: 'string' });

    createState(`${path}.energy_kWh`, energy, { type: 'number', role: 'value.energy', unit: 'kWh' });
    createState(`${path}.duration_min`, duration, { type: 'number', role: 'value', unit: 'min' });

    log(`✅ Session gespeichert: ${id} | ${energy.toFixed(2)} kWh | ${duration} min`);

    sessionActive = false;
}

// --- Trigger über Leistung ---
on({ id: POWER_STATE, change: 'ne' }, (obj) => {

    const power = obj.state.val;

    // START: Leistung steigt über Schwellwert
    if (power > POWER_THRESHOLD && !sessionActive) {
        startSession();
    }

    // STOP: Leistung fällt unter Schwellwert
    if (power <= POWER_THRESHOLD && sessionActive) {
        endSession();
    }
});
