#!/usr/bin/env python3
import argparse
import json
import os
import re
import shlex
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


ROOT = Path(__file__).resolve().parents[2]
IOBROKER_DIR = ROOT / "iobroker"
OBJECT_DIR = IOBROKER_DIR / "objects"
SCRIPT_DIR = IOBROKER_DIR / "scripts"
BACKUP_DIR = IOBROKER_DIR / "backups"
MANIFEST = IOBROKER_DIR / "manifest.json"

DEFAULT_HOST = os.environ.get("SYNOLOGY_HOST", "192.168.0.20")
DEFAULT_SSH_USER = os.environ.get("SYNOLOGY_SSH_USER", "Richard")
DEFAULT_CONTAINER = os.environ.get("IOBROKER_CONTAINER", "iobroker-iobroker-1-1-1-1")
DEFAULT_SSH_KEY = Path(os.environ.get("SYNOLOGY_SSH_KEY", str(ROOT / "work" / "secrets" / "synology_iobroker_key")))


HEADER_PREFIXES = {
    "object_id": "// ioBroker object: ",
    "name": "// name: ",
    "engine_type": "// engineType: ",
    "enabled": "// enabled: ",
}


def run_remote(host: str, ssh_key: Path, command: str, stdin_text: Optional[str] = None) -> str:
    ssh_command = [
        "ssh",
        "-i",
        str(ssh_key),
        "-o",
        "BatchMode=yes",
        "-o",
        "ConnectTimeout=10",
        host,
        command,
    ]
    result = subprocess.run(
        ssh_command,
        input=stdin_text,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return result.stdout


def iobroker(host: str, ssh_key: Path, container: str, command: str, stdin_text: Optional[str] = None) -> str:
    remote_command = (
        "sudo -n /usr/local/bin/docker exec "
        f"-i {container} sh -lc {json.dumps(command, ensure_ascii=False)}"
    )
    return run_remote(host, ssh_key, remote_command, stdin_text=stdin_text)


def iobroker_set_json(host: str, ssh_key: Path, container: str, object_id: str, payload: dict) -> str:
    compact = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    command = f"iobroker object set {shlex.quote(object_id)} {shlex.quote(compact)}"
    return iobroker(host, ssh_key, container, command)


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def safe_part(value: str) -> str:
    value = value.replace("script.js.", "")
    value = value.replace("script.js", "_root")
    value = value.replace("/", "_")
    return re.sub(r"[^A-Za-z0-9._ -]+", "_", value).strip(" .") or "unnamed"


def object_file_for_id(object_id: str) -> Path:
    return OBJECT_DIR / f"{safe_part(object_id)}.json"


def read_manifest() -> dict:
    if not MANIFEST.exists():
        raise SystemExit(f"Missing manifest: {MANIFEST}")
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def write_manifest(manifest: dict) -> None:
    write_json(MANIFEST, manifest)


def upsert_manifest_entry(object_id: str, payload: dict, script_path: Optional[Path]) -> None:
    manifest = read_manifest()
    object_rel_path = str(object_file_for_id(object_id).relative_to(ROOT))
    script_rel_path = str(script_path.relative_to(ROOT)) if script_path else None
    name = payload.get("common", {}).get("name")
    engine_type = payload.get("common", {}).get("engineType")
    enabled = payload.get("common", {}).get("enabled")
    object_type = payload.get("type")

    entry = {
        "id": object_id,
        "name": name,
        "type": object_type,
        "engineType": engine_type,
        "enabled": enabled,
        "objectFile": object_rel_path,
        "scriptFile": script_rel_path,
    }

    items = [item for item in manifest["objects"] if item["id"] != object_id]
    items.append(entry)
    items.sort(key=lambda item: item["id"])
    manifest["objects"] = items
    manifest["count"] = len(items)
    manifest["exportedAt"] = datetime.now(timezone.utc).isoformat()
    write_manifest(manifest)


def remove_manifest_entry(object_id: str) -> None:
    manifest = read_manifest()
    items = [item for item in manifest["objects"] if item["id"] != object_id]
    manifest["objects"] = items
    manifest["count"] = len(items)
    manifest["exportedAt"] = datetime.now(timezone.utc).isoformat()
    write_manifest(manifest)


def parse_script_header(script_path: Path) -> tuple[dict, str]:
    text = script_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    metadata = {}
    body_start = 0

    for index, line in enumerate(lines[:8]):
        matched = False
        for key, prefix in HEADER_PREFIXES.items():
            if line.startswith(prefix):
                metadata[key] = line[len(prefix):].strip()
                body_start = index + 1
                matched = True
                break
        if not matched:
            break

    while body_start < len(lines) and lines[body_start].strip() == "":
        body_start += 1

    body = "\n".join(lines[body_start:]).rstrip() + "\n"
    if "enabled" in metadata:
        metadata["enabled"] = metadata["enabled"].lower() == "true"
    return metadata, body


def script_path_to_object_id(script_path: Path) -> str:
    relative = script_path.relative_to(SCRIPT_DIR)
    parts = list(relative.parts)
    parts[-1] = Path(parts[-1]).stem
    return "script.js." + ".".join(parts)


def manifest_lookup_by_script(script_rel_path: str) -> Optional[dict]:
    manifest = read_manifest()
    for item in manifest["objects"]:
        if item.get("scriptFile") == script_rel_path:
            return item
    return None


def ensure_channel(host: str, ssh_key: Path, container: str, channel_id: str) -> None:
    try:
        iobroker(host, ssh_key, container, f"iobroker object get {shlex.quote(channel_id)}")
        return
    except subprocess.CalledProcessError:
        pass

    name = channel_id.rsplit(".", 1)[-1]
    payload = {
        "_id": channel_id,
        "type": "channel",
        "common": {"name": name},
        "native": {},
    }
    iobroker(
        host,
        ssh_key,
        container,
        f"iobroker object set {shlex.quote(channel_id)} {shlex.quote(json.dumps(payload, ensure_ascii=False, separators=(',', ':')))}",
    )


def ensure_parent_channels(host: str, ssh_key: Path, container: str, object_id: str) -> None:
    parts = object_id.split(".")
    if len(parts) <= 3:
        return
    current = parts[:2]
    for segment in parts[2:-1]:
        current.append(segment)
        ensure_channel(host, ssh_key, container, ".".join(current))


def fetch_live_object(host: str, ssh_key: Path, container: str, object_id: str) -> Optional[dict]:
    try:
        raw = iobroker(host, ssh_key, container, f"iobroker object get {shlex.quote(object_id)}").strip()
    except subprocess.CalledProcessError:
        return None
    return json.loads(raw) if raw else None


def backup_live_object(host: str, ssh_key: Path, container: str, object_id: str) -> Optional[Path]:
    obj = fetch_live_object(host, ssh_key, container, object_id)
    if obj is None:
        return None
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup_path = BACKUP_DIR / timestamp / f"{safe_part(object_id)}.json"
    write_json(backup_path, obj)
    return backup_path


def build_object_payload(script_path: Path) -> tuple[str, dict]:
    metadata, source = parse_script_header(script_path)
    script_rel_path = str(script_path.relative_to(ROOT))
    manifest_item = manifest_lookup_by_script(script_rel_path)

    if manifest_item is not None:
        object_id = manifest_item["id"]
        object_path = ROOT / manifest_item["objectFile"]
        obj = json.loads(object_path.read_text(encoding="utf-8"))
    else:
        object_id = metadata.get("object_id") or script_path_to_object_id(script_path)
        obj = {
            "_id": object_id,
            "type": "script",
            "common": {
                "name": metadata.get("name") or script_path.stem,
                "engineType": metadata.get("engine_type") or "Javascript/js",
                "engine": "system.adapter.javascript.0",
                "enabled": metadata.get("enabled", False),
            },
            "native": {},
        }

    obj["_id"] = object_id
    obj["type"] = "script"
    obj.setdefault("common", {})
    obj["common"]["source"] = source.rstrip("\n")
    if "name" in metadata:
        obj["common"]["name"] = metadata["name"]
    if "engine_type" in metadata:
        obj["common"]["engineType"] = metadata["engine_type"]
    obj["common"].setdefault("engineType", "Javascript/js")
    obj["common"].setdefault("engine", "system.adapter.javascript.0")
    if "enabled" in metadata:
        obj["common"]["enabled"] = metadata["enabled"]
    obj["common"].setdefault("enabled", False)
    return object_id, obj


def deploy_script(host: str, ssh_key: Path, container: str, script_path: Path) -> tuple[str, Optional[Path]]:
    object_id, payload = build_object_payload(script_path)
    ensure_parent_channels(host, ssh_key, container, object_id)
    backup_path = backup_live_object(host, ssh_key, container, object_id)
    iobroker(
        host,
        ssh_key,
        container,
        f"iobroker object set {shlex.quote(object_id)} {shlex.quote(json.dumps(payload, ensure_ascii=False, separators=(',', ':')))}",
    )
    object_path = object_file_for_id(object_id)
    write_json(object_path, payload)
    upsert_manifest_entry(object_id, payload, script_path)
    return object_id, backup_path


def delete_script(host: str, ssh_key: Path, container: str, object_id: str) -> Optional[Path]:
    backup_path = backup_live_object(host, ssh_key, container, object_id)
    iobroker(host, ssh_key, container, f"iobroker object del {shlex.quote(object_id)}")
    remove_manifest_entry(object_id)
    return backup_path


def command_deploy(args: argparse.Namespace) -> int:
    script_path = (ROOT / args.script).resolve()
    if not script_path.exists():
        raise SystemExit(f"Missing script file: {script_path}")
    object_id, backup_path = deploy_script(args.host, args.ssh_key, args.container, script_path)
    print(f"Deployed {object_id}")
    if backup_path:
        print(f"Backup saved to {backup_path.relative_to(ROOT)}")
    else:
        print("No previous live object existed")
    return 0


def command_delete(args: argparse.Namespace) -> int:
    backup_path = delete_script(args.host, args.ssh_key, args.container, args.object_id)
    print(f"Deleted {args.object_id}")
    if backup_path:
        print(f"Backup saved to {backup_path.relative_to(ROOT)}")
    return 0


def command_backup(args: argparse.Namespace) -> int:
    backup_path = backup_live_object(args.host, args.ssh_key, args.container, args.object_id)
    if backup_path is None:
        raise SystemExit(f"Live object not found: {args.object_id}")
    print(f"Backup saved to {backup_path.relative_to(ROOT)}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Sync ioBroker scripts between repository and live system")
    parser.add_argument("--host", default=f"{DEFAULT_SSH_USER}@{DEFAULT_HOST}")
    parser.add_argument("--container", default=DEFAULT_CONTAINER)
    parser.add_argument("--ssh-key", type=Path, default=DEFAULT_SSH_KEY)

    subparsers = parser.add_subparsers(dest="command", required=True)

    deploy_parser = subparsers.add_parser("deploy", help="Create or update one script object from a repository file")
    deploy_parser.add_argument("script", help="Path to script file relative to repository root")
    deploy_parser.set_defaults(func=command_deploy)

    backup_parser = subparsers.add_parser("backup", help="Back up one live object as JSON")
    backup_parser.add_argument("object_id", help="Full ioBroker object id, e.g. script.js.common.Victron_INIT")
    backup_parser.set_defaults(func=command_backup)

    delete_parser = subparsers.add_parser("delete", help="Delete one live script object after saving a backup")
    delete_parser.add_argument("object_id", help="Full ioBroker object id")
    delete_parser.set_defaults(func=command_delete)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
