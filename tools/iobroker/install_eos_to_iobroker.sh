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
Usage: install_eos_to_iobroker.sh [--apply]

Default mode is dry-run. Use --apply for a real repository and VIS2 deployment.
EOF
            exit 0
            ;;
        *)
            echo "FEHLER: Unbekanntes Argument: $arg" >&2
            exit 2
            ;;
    esac
done

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
repo_deploy="${repo_root}/tools/iobroker/deploy_repository_to_iobroker.sh"
repo_verify="${repo_root}/tools/iobroker/verify_iobroker_import.sh"
repo_list="${repo_root}/tools/iobroker/list_repository_assets.sh"
vis_deploy="${repo_root}/iobroker/tools/deploy_vis2.py"
vis_dir="${repo_root}/iobroker/vis-2/main"

for required in "${repo_deploy}" "${repo_verify}" "${repo_list}"; do
    if [[ ! -x "${required}" ]]; then
        echo "FEHLER: Benötigtes Script fehlt oder ist nicht ausführbar: ${required}" >&2
        exit 1
    fi
done

if [[ ! -f "${vis_dir}/battery.html" ]]; then
    echo "FEHLT: VIS2-Battery-Ansicht fehlt: ${vis_dir}/battery.html" >&2
    exit 1
fi

if [[ ! -f "${vis_dir}/vis-views.json" ]]; then
    echo "FEHLT: VIS2-View-Export fehlt: ${vis_dir}/vis-views.json" >&2
    exit 1
fi

echo "START"
echo "OK: Repository root ${repo_root}"
echo "OK: VIS2-Pfad ${vis_dir}"

echo "DRY-RUN"
"${repo_list}"
"${repo_deploy}"

if $apply_mode; then
    echo "INSTALLIERT: Repository-Inhalte werden angewendet"
    "${repo_deploy}" --apply
    echo "INSTALLIERT: VIS2-Dateien werden angewendet"
    if ! command -v python3 >/dev/null 2>&1; then
        echo "FEHLER: python3 nicht gefunden." >&2
        exit 1
    fi
    if [[ ! -f "${vis_deploy}" ]]; then
        echo "FEHLER: VIS2-Deployment-Script fehlt: ${vis_deploy}" >&2
        exit 1
    fi
    python3 "${vis_deploy}"
    echo "VERIFY"
    "${repo_verify}"
    echo "OK: EOS-Installation abgeschlossen."
else
    echo "OK: Dry-Run abgeschlossen. Keine Aenderungen ausgefuehrt."
fi
