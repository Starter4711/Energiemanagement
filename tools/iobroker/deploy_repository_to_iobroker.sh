#!/usr/bin/env bash

set -euo pipefail

apply_mode=false

for arg in "$@"; do
    case "$arg" in
        --apply)
            apply_mode=true
            ;;
        -h|--help)
            cat <<'EOF'
Usage: deploy_repository_to_iobroker.sh [--apply]

Dry-run is the default. Use --apply for real changes.
EOF
            exit 0
            ;;
        *)
            echo "FEHLT: Unbekanntes Argument: $arg" >&2
            exit 2
            ;;
    esac
done

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
manifest_path="${repo_root}/iobroker/manifest.json"
objects_dir="${repo_root}/iobroker/objects"
scripts_dir="${repo_root}/iobroker/scripts"
verify_script="${repo_root}/tools/iobroker/verify_iobroker_import.sh"

if ! command -v iobroker >/dev/null 2>&1; then
    echo "FEHLT: ioBroker-CLI nicht gefunden. Dieses Script muss in einer Umgebung mit installierter ioBroker-CLI laufen." >&2
    exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
    echo "FEHLT: python3 nicht gefunden." >&2
    exit 1
fi

if [[ ! -f "${manifest_path}" ]]; then
    echo "FEHLT: Manifest nicht gefunden: ${manifest_path}" >&2
    exit 1
fi

if [[ ! -x "${verify_script}" ]]; then
    echo "FEHLT: Verifikationsscript nicht gefunden oder nicht ausführbar: ${verify_script}" >&2
    exit 1
fi

mapfile -t manifest_lines < <(python3 - "${manifest_path}" "${objects_dir}" "${scripts_dir}" <<'PY'
import json
import sys
from pathlib import Path

manifest_path = Path(sys.argv[1])
objects_dir = Path(sys.argv[2])
scripts_dir = Path(sys.argv[3])

manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
objects = manifest.get("objects", [])

for entry in objects:
    object_id = entry["id"]
    object_file = objects_dir / entry["objectFile"].split("iobroker/objects/", 1)[-1]
    script_file_rel = entry.get("scriptFile")
    script_file = scripts_dir / script_file_rel.split("iobroker/scripts/", 1)[-1] if script_file_rel else None
    print("\t".join([
        object_id,
        str(object_file),
        str(script_file) if script_file else "",
        entry.get("enabled") if entry.get("enabled") is not None else "",
    ]))
PY
)

read_json() {
    local path="$1"
    python3 - "$path" <<'PY'
import json
import sys
from pathlib import Path

path = Path(sys.argv[1])
print(json.dumps(json.loads(path.read_text(encoding="utf-8")), ensure_ascii=False, separators=(",", ":")))
PY
}

live_object_get() {
    local object_id="$1"
    if iobroker object get "$object_id" >/dev/null 2>&1; then
        local raw
        raw="$(iobroker object get "$object_id")"
        OBJECT_JSON="${raw}" python3 - <<'PY'
import json
import os

data = json.loads(os.environ["OBJECT_JSON"])
print(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
PY
        return 0
    fi
    return 1
}

set_object() {
    local object_id="$1"
    local payload="$2"
    iobroker object set "$object_id" "$payload" >/dev/null
}

update_from_script() {
    local payload="$1"
    local script_file="$2"
    python3 - "$payload" "$script_file" <<'PY'
import json
import sys
from pathlib import Path

payload = json.loads(sys.argv[1])
script_file = Path(sys.argv[2])
source = script_file.read_text(encoding="utf-8")

payload.setdefault("common", {})
payload["common"]["source"] = source.rstrip("\n")

header = source.splitlines()[:4]
for line in header:
    if line.startswith("// name: "):
        payload["common"].setdefault("name", line[len("// name: "):].strip())
    elif line.startswith("// engineType: "):
        payload["common"].setdefault("engineType", line[len("// engineType: "):].strip())
    elif line.startswith("// enabled: "):
        enabled_text = line[len("// enabled: "):].strip().lower()
        if enabled_text in {"true", "false"}:
            payload["common"]["enabled"] = enabled_text == "true"

print(json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
PY
}

changed_count=0

for line in "${manifest_lines[@]}"; do
    IFS=$'\t' read -r object_id object_file script_file enabled <<<"${line}"

    if [[ ! -f "${object_file}" ]]; then
        echo "FEHLT: Objektdatei fehlt: ${object_file}" >&2
        exit 1
    fi

    payload="$(read_json "${object_file}")"
    if [[ -n "${script_file}" && -f "${script_file}" ]]; then
        payload="$(update_from_script "${payload}" "${script_file}")"
    fi

    if current="$(live_object_get "${object_id}")"; then
        if [[ "${current}" == "${payload}" ]]; then
            echo "OK: ${object_id}"
            continue
        fi
        if $apply_mode; then
            set_object "${object_id}" "${payload}"
            echo "GEÄNDERT: ${object_id}"
        else
            echo "GEÄNDERT: ${object_id} (Dry-Run)"
        fi
    else
        if $apply_mode; then
            set_object "${object_id}" "${payload}"
            echo "GEÄNDERT: ${object_id} (angelegt)"
        else
            echo "GEÄNDERT: ${object_id} (Dry-Run, würde angelegt)"
        fi
    fi
    changed_count=$((changed_count + 1))
done

echo "OK: ${changed_count} Einträge geprüft"

if $apply_mode; then
    "${verify_script}"
else
    echo "OK: Dry-Run abgeschlossen, keine Änderungen ausgeführt."
fi
