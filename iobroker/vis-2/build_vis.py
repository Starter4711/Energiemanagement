#!/usr/bin/env python3
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
HTML = (ROOT / "main" / "dashboard.html").read_text(encoding="utf-8")
OUTPUT = ROOT / "main" / "vis-views.json"

project = {
    "___settings": {
        "folders": [],
        "openedViews": ["Main"],
        "ts": "energiemanagement-mobile-v1",
    },
    "Main": {
        "name": "Energiemanagement",
        "settings": {
            "style": {
                "background-color": "#101416",
                "width": "100%",
                "height": "1600px",
                "overflow-x": "hidden",
            }
        },
        "widgets": {
            "w000001": {
                "tpl": "tplHtml",
                "data": {
                    "bindings": [],
                    "html": HTML,
                    "refreshInterval": "0",
                    "name": "Energiemanagement Mobile Dashboard",
                },
                "style": {
                    "left": "0px",
                    "top": "0px",
                    "width": "100%",
                    "height": "1600px",
                    "position": "relative",
                },
                "widgetSet": "basic",
            }
        },
        "activeWidgets": {},
    },
}

OUTPUT.write_text(
    json.dumps(project, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
