#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "Repository root: ${repo_root}"
echo
echo "Scripts under iobroker/scripts/"
find "${repo_root}/iobroker/scripts" -type f | sort
echo
echo "Objects under iobroker/objects/"
find "${repo_root}/iobroker/objects" -maxdepth 1 -type f | sort
echo
echo "Manifest script entries"
python3 - <<'PY'
import json
from pathlib import Path

manifest = json.loads(Path("iobroker/manifest.json").read_text())
for key in sorted(k for k in manifest if k.startswith("script.js.")):
    value = manifest[key]
    common = value.get("common", {})
    print(f"{key} | enabled={common.get('enabled')} | type={value.get('type')} | name={common.get('name')}")
PY
