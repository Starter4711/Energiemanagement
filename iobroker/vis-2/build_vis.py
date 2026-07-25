#!/usr/bin/env python3
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
MAIN_HTML = (ROOT / "main" / "dashboard.html").read_text(encoding="utf-8")
BATTERY_HTML = (ROOT / "main" / "battery.html").read_text(encoding="utf-8")
POOL_HTML = (ROOT / "main" / "pool.html").read_text(encoding="utf-8")
POOL_CONTROLS_HTML = (ROOT / "main" / "pool-controls.html").read_text(encoding="utf-8")
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


project = {
    "___settings": {
        "folders": [],
        "openedViews": ["Main", "Batterie", "Pool", "Pool_Bedienung"],
        "ts": "energiemanagement-pool-v4",
    },
    "Main": view("Energiemanagement", MAIN_HTML, 1400),
    "Batterie": view("Batterie", BATTERY_HTML, 1200),
    "Pool": view("Pool", POOL_HTML, 1900),
    "Pool_Bedienung": pool_controls_view(),
}

OUTPUT.write_text(
    json.dumps(project, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
