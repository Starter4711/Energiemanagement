// ioBroker object: script.js.common.Gobel_Vergleich_BMS_Heltec
// name: Gobel_Vergleich_BMS_Heltec
// engineType: Javascript/js
// enabled: True

(async () => {
    const packs = 4;
    const cells = 16;
    const rootId = 'javascript.0.Gobel';

    // --- Hilfsfunktionen ---
    async function createChannelIfNotExists(parentId, id, name) {
        try { await createChannelAsync(`${parentId}.${id}`, { name }); } catch {}
    }

    async function createStateIfNotExists(parentId, id, name, type, role, unit = '', def = 0) {
        try {
            await createStateAsync(`${parentId}.${id}`, { name, type, role, unit, def });
        } catch {}
    }

    // --- Struktur erstellen ---
    async function createStructure() {
        for (let p = 1; p <= packs; p++) {
            const packId = `Pack_${p}`;
            await createChannelIfNotExists(rootId, packId, `Pack ${p}`);
            await createStateIfNotExists(`${rootId}.${packId}`, 'packAlarm', `Pack ${p} Alarm`, 'boolean', 'indicator', '', false);
            await createStateIfNotExists(`${rootId}.${packId}`, 'lastUpdate', `Letzte Änderung Pack ${p}`, 'string', 'date', '', '');
            for (let c = 1; c <= cells; c++) {
                const cellId = `cell_${c}`;
                await createStateIfNotExists(`${rootId}.${packId}`, `${cellId}_modbus`, `Cell ${c} Modbus`, 'number', 'value.voltage', 'V');
                await createStateIfNotExists(`${rootId}.${packId}`, `${cellId}_mqtt`, `Cell ${c} MQTT`, 'number', 'value.voltage', 'V');
                await createStateIfNotExists(`${rootId}.${packId}`, `${cellId}_diff`, `Cell ${c} Differenz`, 'number', 'value.voltage', 'V');
                await createStateIfNotExists(`${rootId}.${packId}`, `${cellId}_alarm`, `Cell ${c} Alarm`, 'boolean', 'indicator', '', false);
            }
        }
    }

    // --- Differenz berechnen und Alarm setzen ---
    async function compareCell(pack, cell, modbusValue, mqttValue) {
        const diff = Math.abs(modbusValue - mqttValue);
        await setStateAsync(`${rootId}.${pack}.${cell}_diff`, { val: diff, ack: true });
        const alarm = diff > 0.05; // Schwelle 50mV
        await setStateAsync(`${rootId}.${pack}.${cell}_alarm`, { val: alarm, ack: true });
        return alarm;
    }

    async function updatePackAlarm(pack) {
        let packAlarm = false;
        for (let c = 1; c <= cells; c++) {
            const cellAlarm = await getStateAsync(`${rootId}.${pack}.cell_${c}_alarm`);
            if (cellAlarm?.val) packAlarm = true;
        }
        await setStateAsync(`${rootId}.${pack}.packAlarm`, { val: packAlarm, ack: true });
    }

    // --- Initiale Berechnung bei Start ---
    async function initialCalculation() {
        for (let p = 1; p <= packs; p++) {
            const packId = `Pack_${p}`;
            for (let c = 1; c <= cells; c++) {
                const modbusState = await getStateAsync(`modbus.1.holdingRegisters.1.${40016 + c - 1}_Cell_Voltage_${c}`);
                const mqttState = await getStateAsync(`mqtt.0.HELTEC_${p}.cell_${c}.voltage`);
                const modbusVal = modbusState?.val ? modbusState.val / 1000 : 0;
                const mqttVal = mqttState?.val ?? 0;
                await setStateAsync(`${rootId}.${packId}.cell_${c}_modbus`, { val: modbusVal, ack: true });
                await setStateAsync(`${rootId}.${packId}.cell_${c}_mqtt`, { val: mqttVal, ack: true });
                await compareCell(packId, `cell_${c}`, modbusVal, mqttVal);
            }
            await updatePackAlarm(packId);
            await setStateAsync(`${rootId}.${packId}.lastUpdate`, { val: new Date().toISOString(), ack: true });
        }
    }

    // --- MQTT Trigger optimiert: EIN Trigger für alle HELTEC-Zellen ---
    on({ id: /^mqtt\.0\.HELTEC_\d+\.cell_\d+\.voltage$/, change: "any" }, async (obj) => {
        const match = obj.id.match(/^mqtt\.0\.HELTEC_(\d+)\.cell_(\d+)\.voltage$/);
        if (!match) return;

        const packNum = match[1];
        const cellNum = match[2];
        const packId = `Pack_${packNum}`;
        const cellId = `cell_${cellNum}`;
        const mqttVal = obj.state.val ?? 0;
        const modbusState = await getStateAsync(`modbus.1.holdingRegisters.1.${40016 + Number(cellNum) - 1}_Cell_Voltage_${cellNum}`);
        const modbusVal = modbusState?.val ? modbusState.val / 1000 : 0;

        await setStateAsync(`${rootId}.${packId}.${cellId}_mqtt`, { val: mqttVal, ack: true });
        await setStateAsync(`${rootId}.${packId}.${cellId}_modbus`, { val: modbusVal, ack: true });
        await compareCell(packId, cellId, modbusVal, mqttVal);
        await updatePackAlarm(packId);
        await setStateAsync(`${rootId}.${packId}.lastUpdate`, { val: new Date().toISOString(), ack: true });
    });

    console.log('Starte Struktur-Erstellung...');
    await createStructure();
    console.log('Starte initiale Berechnung...');
    await initialCalculation();
    console.log('Script fertig, MQTT-Trigger aktiv.');
})();
