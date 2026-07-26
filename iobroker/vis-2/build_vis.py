#!/usr/bin/env python3
import json
from pathlib import Path
from typing import Optional


ROOT = Path(__file__).resolve().parent
MAIN_HTML = (ROOT / "main" / "dashboard.html").read_text(encoding="utf-8")
BATTERY_HTML = (ROOT / "main" / "battery.html").read_text(encoding="utf-8")
POOL_HTML = (ROOT / "main" / "pool.html").read_text(encoding="utf-8")
POOL_CONTROLS_HTML = (ROOT / "main" / "pool-controls.html").read_text(encoding="utf-8")
WALLBOX_HTML = (ROOT / "main" / "wallbox.html").read_text(encoding="utf-8")
OUTPUT = ROOT / "main" / "vis-views.json"


def view(name: str, html: str, height: int) -> dict:
    return {
        "name": name,
        "settings": {
            "style": {
                "background-color": "#101416",
                "width": "100%",
                "height": f"{height}px",
                "overflow-x": "hidden",
            }
        },
        "widgets": {
            "w000001": {
                "tpl": "tplHtml",
                "data": {
                    "bindings": [],
                    "html": html,
                    "refreshInterval": "0",
                    "name": f"{name} Responsive Dashboard",
                },
                "style": {
                    "left": "0px",
                    "top": "0px",
                    "width": "100%",
                    "height": f"{height}px",
                    "position": "relative",
                },
                "widgetSet": "basic",
            }
        },
        "activeWidgets": {},
    }


def pool_controls_view() -> dict:
    controls = [
        ("s7.0.DBs.DB1.V0_0", "switch", "Winterbetrieb"),
        ("s7.0.DBs.DB1.V100_0", "switch", "Zeitsteuerung aktiv"),
        ("s7.0.DBs.DB1.V1_4", "switch", "Pool füllen"),
        ("javascript.0.PoolVIS2.Zeitplan1.Start", "input", "Zeitfenster 1 Start (HH:MM)"),
        ("javascript.0.PoolVIS2.Zeitplan1.Ende", "input", "Zeitfenster 1 Ende (HH:MM)"),
        ("time-switch.0.onoff.4.enabled", "switch", "Zeitfenster 1 aktiv"),
        ("javascript.0.PoolVIS2.Zeitplan2.Start", "input", "Zeitfenster 2 Start (HH:MM)"),
        ("javascript.0.PoolVIS2.Zeitplan2.Ende", "input", "Zeitfenster 2 Ende (HH:MM)"),
        ("time-switch.0.onoff.5.enabled", "switch", "Zeitfenster 2 aktiv"),
        ("s7.0.DBs.DB1.V1_0", "switch", "Wartung: Pumpe Hand"),
        ("s7.0.DBs.DB1.V1_1", "switch", "Wartung: Salz / pH Hand"),
        ("s7.0.DBs.DB1.V1_2", "switch", "Wartung: H2O Hand"),
        ("s7.0.DBs.DB1.V1_3", "switch", "Wartung: Wärmepumpe Hand"),
    ]
    data = {
        "noCard": False,
        "widgetTitle": "Pool",
        "count": len(controls),
        "type": "lines",
        "allSwitch": False,
    }
    for index, (oid, control_type, title) in enumerate(controls, start=1):
        data[f"oid{index}"] = oid
        data[f"type{index}"] = control_type
        data[f"title{index}"] = title
        data[f"noIcon{index}"] = True

    result = view("Pool Bedienung", POOL_CONTROLS_HTML, 1450)
    result["widgets"]["w000001"]["style"]["height"] = "100px"
    result["widgets"]["w000002"] = {
        "tpl": "tplMaterial2Switches",
        "data": data,
        "style": {
            "left": "14px",
            "top": "110px",
            "width": "calc(100% - 28px)",
            "height": "1180px",
        },
        "widgetSet": "vis-2-widgets-material",
    }
    return result


def wallbox_view(name: str, html: str, height: int, controls: Optional[list[tuple[str, str, str]]] = None) -> dict:
    result = view(name, html, height)
    if controls:
        data = {
            "noCard": False,
            "widgetTitle": name,
            "count": len(controls),
            "type": "lines",
            "allSwitch": False,
        }
        for index, (oid, control_type, title) in enumerate(controls, start=1):
            data[f"oid{index}"] = oid
            data[f"type{index}"] = control_type
            data[f"title{index}"] = title
            data[f"noIcon{index}"] = True
        result["widgets"]["w000002"] = {
            "tpl": "tplMaterial2Switches",
            "data": data,
            "style": {
                "left": "14px",
                "top": "110px",
                "width": "calc(100% - 28px)",
                "height": "320px",
            },
            "widgetSet": "vis-2-widgets-material",
        }
    return result


def render_wallbox_html(title: str, subtitle: str, power: str, status: str, allow: str, phases: str, car: str, connection: str, control_title: str, control_text: str, control_hint: str, config_text: str, note: str, note_small: str) -> str:
    return (
        WALLBOX_HTML
        .replace("__TITLE__", title)
        .replace("__SUBTITLE__", subtitle)
        .replace("__POWER__", power)
        .replace("__STATUS__", status)
        .replace("__ALLOW__", allow)
        .replace("__PHASES__", phases)
        .replace("__CAR__", car)
        .replace("__CONNECTION__", connection)
        .replace("__CONTROL_TITLE__", control_title)
        .replace("__CONTROL_TEXT__", control_text)
        .replace("__CONTROL_HINT__", control_hint)
        .replace("__CONFIG_TEXT__", config_text)
        .replace("__NOTE__", note)
        .replace("__NOTE_SMALL__", note_small)
    )


WALLBOX_1_HTML = render_wallbox_html(
    "Wallbox 1 · V3",
    "go-e.0 · ladebar und 1/3-phasig umschaltbar",
    "{alias.0.go-E.powerV3} kW",
    "{go-e.0.allow_charging}",
    "{go-e.0.allow_charging}",
    "{go-e.0.phases}",
    "{go-e.0.car}",
    "{go-e.0.info.connection}",
    "Ladefreigabe",
    "go-e.0.allow_charging",
    "0 = aus, 1 = freigegeben",
    "Leistung alias.0.go-E.powerV3 / HTTP http://192.168.11.20",
    "Schalter steuert die Freigabe",
    "Nur die Freigabe wird geschaltet",
)

WALLBOX_2_HTML = render_wallbox_html(
    "Wallbox 2 · V4",
    "go-e.1 · ladebar und 1/3-phasig umschaltbar",
    "{alias.0.go-E.powerV4} kW",
    "{go-e.1.allow_charging}",
    "{go-e.1.allow_charging}",
    "{go-e.1.phases}",
    "{go-e.1.car}",
    "{go-e.1.info.connection}",
    "Ladefreigabe",
    "go-e.1.allow_charging",
    "0 = aus, 1 = freigegeben",
    "Leistung alias.0.go-E.powerV4 / HTTP http://192.168.11.21",
    "Schalter steuert die Freigabe",
    "Nur die Freigabe wird geschaltet",
)

WALLBOX_3_HTML = render_wallbox_html(
    "Wallbox 3 · Halle",
    "go-e.2 · reine Anzeige, nicht regelbar",
    "{alias.0.go-E.go-E-V4-Halle} kW",
    "{go-e.2.allow_charging}",
    "{go-e.2.allow_charging}",
    "{go-e.2.phases}",
    "{go-e.2.car}",
    "{go-e.2.info.connection}",
    "Steuerung",
    "nicht freigegeben",
    "Wallbox 3 bleibt nur lesend",
    "Leistung alias.0.go-E.go-E-V4-Halle / Halle",
    "Nicht regelbar",
    "Wallbox 3 wird laut Projektstand nicht geschaltet",
)


project = {
    "___settings": {
        "folders": [],
        "openedViews": ["Main", "Batterie", "Pool", "Pool_Bedienung"],
        "ts": "energiemanagement-pool-v4",
    },
    "Main": view("Energiemanagement", MAIN_HTML, 1100),
    "Batterie": view("Batterie", BATTERY_HTML, 1800),
    "Pool": view("Pool", POOL_HTML, 1900),
    "Pool_Bedienung": pool_controls_view(),
    "Wallbox 1": wallbox_view("Wallbox 1", WALLBOX_1_HTML, 900, [
        ("go-e.0.allow_charging", "switch", "Laden freigeben"),
    ]),
    "Wallbox 2": wallbox_view("Wallbox 2", WALLBOX_2_HTML, 900, [
        ("go-e.1.allow_charging", "switch", "Laden freigeben"),
    ]),
    "Wallbox 3": wallbox_view("Wallbox 3", WALLBOX_3_HTML, 760, None),
}

OUTPUT.write_text(
    json.dumps(project, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
