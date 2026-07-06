#!/usr/bin/env python3
import argparse
import shlex
import subprocess
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
VIS_DIR = ROOT / "iobroker" / "vis-2" / "main"
DEFAULT_HOST = "Richard@192.168.0.20"
DEFAULT_CONTAINER = "iobroker-iobroker-1-1-1-1"
DEFAULT_KEY = ROOT / "work" / "secrets" / "synology_iobroker_key"
VIS_META = "vis-2.0"


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


def docker_command(container: str, args: list[str]) -> str:
    quoted = " ".join(shlex.quote(arg) for arg in args)
    return f"sudo -n /usr/local/bin/docker exec -i {shlex.quote(container)} {quoted}"


def deploy_file(key: Path, host: str, container: str, local_file: Path, target: str) -> None:
    temporary = f"/tmp/codex-vis2-{local_file.name}"
    ssh(key, host, docker_command(container, ["tee", temporary]), local_file.read_text(encoding="utf-8"))
    ssh(key, host, docker_command(container, ["iobroker", "file", "write", temporary, target]))
    ssh(key, host, docker_command(container, ["rm", temporary]))


def main() -> int:
    parser = argparse.ArgumentParser(description="Deploy the versioned VIS-2 mobile project")
    parser.add_argument("--host", default=DEFAULT_HOST)
    parser.add_argument("--container", default=DEFAULT_CONTAINER)
    parser.add_argument("--ssh-key", type=Path, default=DEFAULT_KEY)
    args = parser.parse_args()

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    current = f"{VIS_META}/main/vis-views.json"
    backup = f"{VIS_META}/backups/main-{timestamp}.json"
    temporary_backup = "/tmp/codex-vis2-backup.json"

    ssh(args.ssh_key, args.host, docker_command(args.container, ["iobroker", "file", "read", current, temporary_backup]))
    ssh(args.ssh_key, args.host, docker_command(args.container, ["iobroker", "file", "write", temporary_backup, backup]))
    ssh(args.ssh_key, args.host, docker_command(args.container, ["rm", temporary_backup]))

    deploy_file(args.ssh_key, args.host, args.container, VIS_DIR / "vis-views.json", current)
    deploy_file(args.ssh_key, args.host, args.container, VIS_DIR / "vis-user.css", f"{VIS_META}/main/vis-user.css")
    print(f"VIS-2 deployed; previous project saved as {backup}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
