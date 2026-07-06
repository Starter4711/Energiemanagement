// ioBroker object: script.js.common.Gobel_VDIFF
// name: Gobel VDIFF
// engineType: Javascript/js
// enabled: True

/*********************************************************
 * BMS Zellspannungsüberwachung – FINAL + stabiler Trend
 *********************************************************/

const PACKS = [1,2,3,4];
const CELLS = 16;
const BASE = 'javascript.0.BMS';

const DIFF_LIMIT_MV    = 50;     // Alarm-Schwelle
const CALC_INTERVAL_MS = 5000;   // max. 1 Berechnung / 5s

// Trend-Parameter (neu)
const TREND_DELTA_MV = 3;   // Empfindlichkeit
const AVG_WINDOW     = 5;   // Glättung

let cache    = {1:[],2:[],3:[],4:[]};
let diffHist = {1:[],2:[],3:[],4:[]};
let timer    = {1:null,2:null,3:null,4:null};

/* ---------- States anlegen ---------- */
function ensure(id, init, common) {
    if (!existsState(id)) createState(id, init, common);
}

PACKS.forEach(p=>{
    cache[p] = Array(CELLS).fill(null);

    ensure(`${BASE}.Pack${p}.Min_V`,0,{type:'number',unit:'V'});
    ensure(`${BASE}.Pack${p}.Max_V`,0,{type:'number',unit:'V'});
    ensure(`${BASE}.Pack${p}.Diff_mV`,0,{type:'number',unit:'mV'});
    ensure(`${BASE}.Pack${p}.Diff_Avg`,0,{type:'number',unit:'mV'});
    ensure(`${BASE}.Pack${p}.Diff_Alarm`,false,{type:'boolean'});

    // Trend
    ensure(`${BASE}.Pack${p}.Trend`,0,{type:'number',role:'value.direction'});
    ensure(`${BASE}.Pack${p}.Trend_Str`,'→',{type:'string'});
    ensure(`${BASE}.Pack${p}.Trend_Color`,'gray',{type:'string'});
});

/* ---------- Trigger (nur Cache füllen) ---------- */
const trigger = /modbus\.1\.holdingRegisters\.(1|2|3|4)\.400(1[6-9]|2[0-9]|30|31)_Cell_Voltage_(\d+)/;

on({id: trigger, change:'ne'}, obj=>{
    const m = obj.id.match(trigger);
    const p = Number(m[1]);
    const c = Number(m[3]);

    cache[p][c-1] = obj.state.val;

    if (!timer[p]) {
        timer[p] = setTimeout(()=>{
            timer[p] = null;
            calc(p);
        }, CALC_INTERVAL_MS);
    }
});

/* ---------- Berechnung ---------- */
function calc(p) {
    const arr = cache[p];

    // Mindestens 80% der Werte müssen da sein
    const valid = arr.filter(v => v !== null);
    if (valid.length < CELLS * 0.8) return;

    // Min / Max
    let min = Infinity, max = -Infinity;
    for (const v of valid) {
        if (v < min) min = v;
        if (v > max) max = v;
    }

    const diff = max - min;

    /* ---------- Verlauf speichern ---------- */
    diffHist[p].push(diff);
    if (diffHist[p].length > AVG_WINDOW) diffHist[p].shift();

    /* ---------- Durchschnitt (Glättung) ---------- */
    const avg = diffHist[p].reduce((a,b)=>a+b,0) / diffHist[p].length;

    /* ---------- Trend (reaktiv) ---------- */
    let trend = 0;

    if (diffHist[p].length >= 2) {
        const last = diffHist[p][diffHist[p].length - 1];
        const prev = diffHist[p][diffHist[p].length - 2];
        const delta = last - prev;

        if (delta > TREND_DELTA_MV) trend = 1;
        else if (delta < -TREND_DELTA_MV) trend = -1;
    }

    /* ---------- Farbe + Pfeil ---------- */
    let color = 'gray';
    let arrow = '→';

    if (trend === 1) {
        color = 'red';
        arrow = '↑';
    } else if (trend === -1) {
        color = 'green';
        arrow = '↓';
    } else {
        color = 'yellow';
        arrow = '→';
    }

    /* ---------- Ausgabe ---------- */
    setStateChanged(`${BASE}.Pack${p}.Min_V`,  Math.round(min)/1000, true);
    setStateChanged(`${BASE}.Pack${p}.Max_V`,  Math.round(max)/1000, true);
    setStateChanged(`${BASE}.Pack${p}.Diff_mV`, Math.round(diff), true);
    setStateChanged(`${BASE}.Pack${p}.Diff_Avg`, Math.round(avg), true);
    setStateChanged(`${BASE}.Pack${p}.Diff_Alarm`, diff > DIFF_LIMIT_MV, true);

    setStateChanged(`${BASE}.Pack${p}.Trend`, trend, true);
    setStateChanged(`${BASE}.Pack${p}.Trend_Str`, arrow, true);
    setStateChanged(`${BASE}.Pack${p}.Trend_Color`, color, true);

    // Debug (optional)
    // log(`Pack ${p} diff=${diff} avg=${avg.toFixed(1)} trend=${trend}`);
}
