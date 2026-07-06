// ioBroker object: script.js.common.Victron_Shunt_LastFullCharge
// name: Victron_Shunt_LastFullCharge
// engineType: Javascript/js
// enabled: True

const SOURCE = 'mqtt.1.N.c0619ab336ed.battery.279.History.TimeSinceLastFullCharge';
const TARGET = 'javascript.0.Gobel.TimeSinceLastFullChargeFormatted';

// State anlegen
if (!existsState(TARGET)) {
    createState(TARGET, '', {
        name: 'Zeit seit letzter Vollladung',
        type: 'string',
        role: 'text',
        read: true,
        write: false
    });
}

// Umrechnung
function formatDuration(seconds) {
    seconds = Number(seconds) || 0;

    const weeks = Math.floor(seconds / (7 * 24 * 3600));
    seconds %= (7 * 24 * 3600);

    const days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);

    return `${weeks}W ${days}T ${hours}h ${minutes}m`;
}

// Wert sauber extrahieren
function getSeconds(raw) {
    if (!raw) return 0;

    // Fall 1: Objekt
    if (typeof raw === 'object' && raw.value !== undefined) {
        return raw.value;
    }

    // Fall 2: JSON String
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            return parsed.value || 0;
        } catch {
            return Number(raw) || 0;
        }
    }

    // Fall 3: normale Zahl
    return Number(raw) || 0;
}

// Update
function update() {
    const state = getState(SOURCE);
    if (!state) return;

    const seconds = getSeconds(state.val);

    // log(`RAW: ${JSON.stringify(state.val)} → Sekunden: ${seconds}`);

    const formatted = formatDuration(seconds);
    setState(TARGET, formatted, true);
}

// Trigger + Start
on({ id: SOURCE, change: 'any' }, update);
update();
