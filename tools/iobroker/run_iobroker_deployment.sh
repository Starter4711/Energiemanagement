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
Usage: run_iobroker_deployment.sh [--apply]

Runs the repository inventory, a deployment dry-run, and verification.
Use --apply for the actual ioBroker deployment.
EOF
            exit 0
            ;;
        *)
            echo "ABBRUCH: Unbekanntes Argument: $arg" >&2
            exit 2
            ;;
    esac
done

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
list_script="${repo_root}/tools/iobroker/list_repository_assets.sh"
deploy_script="${repo_root}/tools/iobroker/deploy_repository_to_iobroker.sh"
verify_script="${repo_root}/tools/iobroker/verify_iobroker_import.sh"

for required in "${list_script}" "${deploy_script}" "${verify_script}"; do
    if [[ ! -x "${required}" ]]; then
        echo "FEHLT: Script nicht gefunden oder nicht ausführbar: ${required}" >&2
        exit 1
    fi
done

echo "START"
echo "OK: Repository root ${repo_root}"

echo "DRY-RUN"
"${list_script}"
"${deploy_script}"

if $apply_mode; then
    echo "APPLY"
    "${deploy_script}" --apply
    echo "VERIFY"
    "${verify_script}"
    echo "OK: Deployment abgeschlossen."
else
    echo "OK: Dry-Run abgeschlossen. Kein ioBroker-Import ausgefuehrt."
fi
