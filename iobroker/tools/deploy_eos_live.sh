#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HOST="${IOBROKER_HOST:-Richard@192.168.0.20}"
KEY="${IOBROKER_SSH_KEY:-$ROOT/work/secrets/synology_iobroker_key_live}"
CONTAINER="${IOBROKER_CONTAINER:-iobroker-iobroker-1-1-1-1}"
SUDO_PASSWORD="${IOBROKER_SUDO_PASSWORD:-}"

if [[ -z "$SUDO_PASSWORD" ]]; then
  printf 'FEHLER: IOBROKER_SUDO_PASSWORD fehlt.\n' >&2
  exit 1
fi

remote() {
  local command="$1"
  ssh -i "$KEY" "$HOST" "echo '$SUDO_PASSWORD' | sudo -S /usr/local/bin/docker exec -i $CONTAINER sh -lc $(printf '%q' "$command")"
}

deploy_script() {
  local file="$1"
  local tmp="/tmp/codex-eos-$(basename "$file")"
  local object_id enabled name engine_type

  object_id="$(python3 - "$file" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
lines = p.read_text(encoding='utf-8').splitlines()
for line in lines[:8]:
    if line.startswith("// ioBroker object: "):
        print(line.split(": ", 1)[1].strip())
        break
PY
)"
  enabled="$(python3 - "$file" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
lines = p.read_text(encoding='utf-8').splitlines()
enabled = "false"
for line in lines[:8]:
    if line.startswith("// enabled: "):
        enabled = line.split(": ", 1)[1].strip().lower()
        break
print(enabled)
PY
)"
  name="$(python3 - "$file" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
lines = p.read_text(encoding='utf-8').splitlines()
name = p.stem
for line in lines[:8]:
    if line.startswith("// name: "):
        name = line.split(": ", 1)[1].strip()
        break
print(name)
PY
)"
  engine_type="$(python3 - "$file" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
lines = p.read_text(encoding='utf-8').splitlines()
engine_type = "Javascript/js"
for line in lines[:8]:
    if line.startswith("// engineType: "):
        engine_type = line.split(": ", 1)[1].strip()
        break
print(engine_type)
PY
)"

  if ! remote "/usr/bin/iobroker object get $object_id >/dev/null 2>&1"; then
    remote "/usr/bin/iobroker object set $object_id '{\"_id\":\"$object_id\",\"type\":\"script\",\"common\":{\"name\":\"$name\",\"engineType\":\"$engine_type\",\"engine\":\"system.adapter.javascript.0\",\"enabled\":$enabled},\"native\":{}}'"
  fi
  source_b64="$(python3 - "$file" <<'PY'
from pathlib import Path
import base64, sys
p = Path(sys.argv[1])
lines = p.read_text(encoding='utf-8').splitlines()
body_start = 0
for i, line in enumerate(lines[:8]):
    if line.startswith("// ioBroker object: ") or line.startswith("// name: ") or line.startswith("// engineType: ") or line.startswith("// enabled: "):
        body_start = i + 1
body = "\n".join(lines[body_start:]).lstrip("\n")
print(base64.b64encode(body.encode('utf-8')).decode('ascii'))
PY
)"
  remote "tee $tmp" < "$file"
  remote "node -e 'const cp=require(\"child_process\");const src=Buffer.from(process.argv[2],\"base64\").toString(\"utf8\");const r=cp.spawnSync(\"/usr/bin/iobroker\",[\"object\",\"set\",process.argv[1],\"common.source=\"+JSON.stringify(src)],{stdio:\"inherit\"});process.exit(r.status===null?1:r.status);' $object_id $source_b64"
  remote "/usr/bin/iobroker object set $object_id common.enabled=$enabled"
  remote "/usr/bin/iobroker object set $object_id common.name=$name"
  remote "/usr/bin/iobroker object set $object_id common.engineType=$engine_type"
  remote "rm -f $tmp"
}

deploy_file() {
  local file="$1"
  local target="$2"
  local b64
  b64="$(python3 - "$file" <<'PY2'
from pathlib import Path
import base64, sys
print(base64.b64encode(Path(sys.argv[1]).read_bytes()).decode('ascii'))
PY2
)"
  remote "mkdir -p /opt/iobroker/iobroker-data/files/$(dirname '$target') && printf '%s' '$b64' | base64 -d > /opt/iobroker/iobroker-data/files/$target"
}

if [[ "$#" -gt 0 ]]; then
  for script in "$@"; do
    deploy_script "$ROOT/$script"
  done
else
  deploy_script "$ROOT/iobroker/scripts/energiemanagement/Config.js"
  deploy_script "$ROOT/iobroker/scripts/energiemanagement/Debug.js"
  deploy_script "$ROOT/iobroker/scripts/energiemanagement/Batterie_Zellspannungen.js"
  deploy_script "$ROOT/iobroker/scripts/energiemanagement/Batterie_BMS_Heltec_Vergleich.js"
  deploy_script "$ROOT/iobroker/scripts/energiemanagement/Battery_Supervisor_V1.js"
  deploy_script "$ROOT/iobroker/scripts/energiemanagement/Battery_Health_V1.js"
  deploy_script "$ROOT/iobroker/scripts/energiemanagement/Energy_Flow_V1.js"

  deploy_file "$ROOT/iobroker/vis-2/main/vis-views.json" "vis-2.0/main/vis-views.json"
  deploy_file "$ROOT/iobroker/vis-2/main/vis-user.css" "vis-2.0/main/vis-user.css"
fi

printf 'EOS live deployment completed.\n'
