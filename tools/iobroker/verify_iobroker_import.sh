#!/usr/bin/env bash

set -euo pipefail

fail() {
    echo "FEHLT: $1" >&2
    exit 1
}

ok() {
    echo "OK: $1"
}

if ! command -v iobroker >/dev/null 2>&1; then
    fail "ioBroker-CLI nicht gefunden. Bitte den Befehl im ioBroker-Container oder in einer Umgebung mit installierter ioBroker-CLI ausfuehren."
fi

required_scripts=(
    "script.js.energiemanagement.Battery_Supervisor_V1"
    "script.js.energiemanagement.Battery_Health_V1"
    "script.js.energiemanagement.Energy_Flow_V1"
)

required_roots=(
    "0_userdata.0.EOS.Battery"
    "0_userdata.0.EOS.EnergyFlow"
)

check_object() {
    local object_id="$1"
    if iobroker object get "${object_id}" >/dev/null 2>&1; then
        ok "Objekt vorhanden: ${object_id}"
    else
        fail "Objekt fehlt: ${object_id}"
    fi
}

for script_id in "${required_scripts[@]}"; do
    check_object "${script_id}"
done

for root_id in "${required_roots[@]}"; do
    check_object "${root_id}"
done

ok "Alle erwarteten ioBroker-Objekte und EOS-Roots wurden gefunden."
