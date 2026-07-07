#!/usr/bin/env python3
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
MAIN_HTML = (ROOT / "main" / "dashboard.html").read_text(encoding="utf-8")
BATTERY_HTML = (ROOT / "main" / "battery.html").read_text(encoding="utf-8")
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


project = {
    "___settings": {
        "folders": [],
        "openedViews": ["Main", "Batterie"],
        "ts": "energiemanagement-navigation-v3",
    },
    "Main": view("Energiemanagement", MAIN_HTML, 1100),
    "Batterie": view("Batterie", BATTERY_HTML, 1200),
}

OUTPUT.write_text(
    json.dumps(project, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
