#!/usr/bin/env python3
import argparse
import os
import shlex
import subprocess
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
VIS_DIR = ROOT / "iobroker" / "vis-2" / "main"
DEFAULT_HOST = os.environ.get("IOBROKER_VIS2_HOST", "")
DEFAULT_CONTAINER = os.environ.get("IOBROKER_VIS2_CONTAINER", "")
DEFAULT_KEY = Path(os.environ["IOBROKER_VIS2_SSH_KEY"]) if os.environ.get("IOBROKER_VIS2_SSH_KEY") else None
DEFAULT_SUDO_PASSWORD = os.environ.get("IOBROKER_SUDO_PASSWORD", "")
VIS_META = "vis-2.0"
VIS_BACKUP_DIR = "/opt/iobroker/iobroker-data/files/vis-2.0/backups"


def ssh(key: Path, host: str, command: str, input_text: str = None) -> None:
    subprocess.run(
        [
            "ssh",
            "-i",
            str(key),
            "-o",
            "BatchMode=yes",
            "-o",
            "ConnectTimeout=10",
            host,
            command,
        ],
        input=input_text,
        text=True,
        check=True,
        stdout=subprocess.DEVNULL,
    )


def docker_command(container: str, args: list[str], sudo_password: str) -> str:
    quoted = " ".join(shlex.quote(arg) for arg in args)
    return f"echo {shlex.quote(sudo_password)} | sudo -S /usr/local/bin/docker exec -i {shlex.quote(container)} {quoted}"


def deploy_file(key: Path, host: str, container: str, sudo_password: str, local_file: Path, target: str) -> None:
    temporary = f"/tmp/codex-vis2-{local_file.name}"
    import base64
    b64 = base64.b64encode(local_file.read_bytes()).decode("ascii")
    ssh(
        key,
        host,
        docker_command(container, ["sh", "-lc", f"printf '%s' {shlex.quote(b64)} | base64 -d > {shlex.quote(temporary)}"], sudo_password),
    )
    ssh(key, host, docker_command(container, ["iobroker", "file", "write", temporary, target], sudo_password))
    ssh(key, host, docker_command(container, ["rm", temporary], sudo_password))


def main() -> int:
    parser = argparse.ArgumentParser(description="Deploy the versioned VIS-2 mobile project")
    parser.add_argument("--host", default=DEFAULT_HOST)
    parser.add_argument("--container", default=DEFAULT_CONTAINER)
    parser.add_argument("--ssh-key", type=Path, default=DEFAULT_KEY)
    args = parser.parse_args()

    if not args.host or not args.container or args.ssh_key is None:
        raise SystemExit(
            "FEHLER: VIS2-Deployment benötigt --host, --container und --ssh-key oder die Umgebungsvariablen "
            "IOBROKER_VIS2_HOST, IOBROKER_VIS2_CONTAINER und IOBROKER_VIS2_SSH_KEY."
        )
    if not DEFAULT_SUDO_PASSWORD:
        raise SystemExit(
            "FEHLER: VIS2-Deployment benötigt IOBROKER_SUDO_PASSWORD für den docker/sudo-Zugriff auf der Synology."
        )

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    current = f"{VIS_META}/main/vis-views.json"
    backup = f"{VIS_META}/backups/main-{timestamp}.json"
    temporary_backup = "/tmp/codex-vis2-backup.json"

    ssh(args.ssh_key, args.host, docker_command(args.container, ["mkdir", "-p", VIS_BACKUP_DIR], DEFAULT_SUDO_PASSWORD))
    ssh(args.ssh_key, args.host, docker_command(args.container, ["chown", "-R", "iobroker:iobroker", VIS_BACKUP_DIR], DEFAULT_SUDO_PASSWORD))
    ssh(args.ssh_key, args.host, docker_command(args.container, ["iobroker", "file", "read", current, temporary_backup], DEFAULT_SUDO_PASSWORD))
    ssh(args.ssh_key, args.host, docker_command(args.container, ["iobroker", "file", "write", temporary_backup, backup], DEFAULT_SUDO_PASSWORD))
    ssh(args.ssh_key, args.host, docker_command(args.container, ["rm", temporary_backup], DEFAULT_SUDO_PASSWORD))

    deploy_file(args.ssh_key, args.host, args.container, DEFAULT_SUDO_PASSWORD, VIS_DIR / "vis-views.json", current)
    deploy_file(args.ssh_key, args.host, args.container, DEFAULT_SUDO_PASSWORD, VIS_DIR / "vis-user.css", f"{VIS_META}/main/vis-user.css")
    print(f"VIS-2 deployed; previous project saved as {backup}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
