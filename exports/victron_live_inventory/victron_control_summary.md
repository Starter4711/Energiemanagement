# Victron Control Summary

## Zweck

Diese Datei fasst mögliche Victron/Cerbo-Steuerkandidaten aus dem Live-MQTT-Mirror zusammen.
Sie gibt keine Schreibfreigabe für Victron `W/...` Topics.

## Sicherheitsregeln

- Keine Victron `W/...` Topics sind freigegeben.
- VE.Bus-Pfade sind nicht beschreibbar.
- `com.victronenergy.settings` und `/Settings` bleiben nicht beschreibbar.
- `UNKNOWN` bleibt nicht beschreibbar.
- Schreibfreigabe erfolgt erst nach separater Prüfung.
- `SAFE_RUNTIME` bedeutet hier nur: ioBroker-Runtime-Kandidat aus Live-MQTT-Mirror.

## Exportbasis

- Quelle: Live-MQTT-Mirror aus ioBroker.
- Direkter DBus-Zugriff: nein / nicht verifiziert.
- VRM-/Portal-ID: nicht live verifiziert, sofern nicht im Export enthalten.
- Keine Writes ausgeführt.

## SAFE_RUNTIME Kandidaten

| Name | Read Topic | Possible Write Topic | Current Value | Safety Class | Reason |
|---|---|---|---|---|---|
| mqtt.1.ioBroker.ESS_DisableBatteryCharge | mqtt.1.ioBroker.ESS_DisableBatteryCharge | nicht verifiziert | 0 | SAFE_RUNTIME | Boolean runtime control topic used to gate ESS behavior. |
| mqtt.1.ioBroker.ESS_DisableFeedIn | mqtt.1.ioBroker.ESS_DisableFeedIn | nicht verifiziert | 0 | SAFE_RUNTIME | Boolean runtime control topic used to gate ESS behavior. |
| mqtt.1.ioBroker.ESS_DisablePVFeedIn | mqtt.1.ioBroker.ESS_DisablePVFeedIn | nicht verifiziert | 1 | SAFE_RUNTIME | Boolean runtime control topic used to gate ESS behavior. |
| mqtt.1.ioBroker.ESS_GridSetpoint | mqtt.1.ioBroker.ESS_GridSetpoint | nicht verifiziert | 0 | SAFE_RUNTIME | Existing runtime setpoint topic for ESS grid power setpoint; not a persistent settings path. |
| mqtt.1.ioBroker.ESS_MaxChargeCurrent | mqtt.1.ioBroker.ESS_MaxChargeCurrent | nicht verifiziert | 1 | SAFE_RUNTIME | Existing runtime limit topic used for EOS control; looks like temporary operating limit. |
| mqtt.1.ioBroker.ESS_MaxChargeVoltage | mqtt.1.ioBroker.ESS_MaxChargeVoltage | nicht verifiziert | 53.6 | SAFE_RUNTIME | Existing runtime limit topic used for EOS control; looks like temporary operating limit. |
| mqtt.1.ioBroker.ESS_MaxDischargeCurrent | mqtt.1.ioBroker.ESS_MaxDischargeCurrent | nicht verifiziert | 210 | SAFE_RUNTIME | Existing runtime limit topic used for EOS control; looks like temporary operating limit. |

## ESS-relevante Kandidaten

| Name | Read Topic | Possible Write Topic | Current Value | Safety Class | Reason |
|---|---|---|---|---|---|
| mqtt.1.N.c0619ab336ed.settings.0.Settings.CGwacs.Hub4Mode | mqtt.1.N.c0619ab336ed.settings.0.Settings.CGwacs.Hub4Mode | nicht verifiziert | {"value":1} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.1.N.c0619ab336ed.settings.0.Settings.DynamicEss.BatteryChargeLimit | mqtt.1.N.c0619ab336ed.settings.0.Settings.DynamicEss.BatteryChargeLimit | nicht verifiziert | {"max":9999.9,"min":-1.0,"value":-1.0} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.1.N.c0619ab336ed.settings.0.Settings.GuiMods.GaugeLimits.BatteryMaxChargeCurrent | mqtt.1.N.c0619ab336ed.settings.0.Settings.GuiMods.GaugeLimits.BatteryMaxChargeCurrent | nicht verifiziert | {"value":0.0} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.1.N.c0619ab336ed.settings.0.Settings.GuiMods.GaugeLimits.BatteryMaxDischargeCurrent | mqtt.1.N.c0619ab336ed.settings.0.Settings.GuiMods.GaugeLimits.BatteryMaxDischargeCurrent | nicht verifiziert | {"value":0.0} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.1.N.c0619ab336ed.settings.0.Settings.SystemSetup.MaxChargeCurrent | mqtt.1.N.c0619ab336ed.settings.0.Settings.SystemSetup.MaxChargeCurrent | nicht verifiziert | {"max":10000,"min":-1,"value":1} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.1.N.c0619ab336ed.vebus.276.BatteryOperationalLimits.MaxChargeCurrent | mqtt.1.N.c0619ab336ed.vebus.276.BatteryOperationalLimits.MaxChargeCurrent | nicht verifiziert | {"value":0.0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.BatteryOperationalLimits.MaxDischargeCurrent | mqtt.1.N.c0619ab336ed.vebus.276.BatteryOperationalLimits.MaxDischargeCurrent | nicht verifiziert | {"value":500.0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Dc.0.MaxChargeCurrent | mqtt.1.N.c0619ab336ed.vebus.276.Dc.0.MaxChargeCurrent | nicht verifiziert | {"max":210.0,"value":210.0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.AssistantId | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.AssistantId | nicht verifiziert | {"value":5} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.DisableCharge | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.DisableCharge | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.DisableFeedIn | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.DisableFeedIn | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.DoNotFeedInOvervoltage | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.DoNotFeedInOvervoltage | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.FixSolarOffsetTo100mV | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.FixSolarOffsetTo100mV | nicht verifiziert | {"value":1} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.AcPowerSetpoint | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.AcPowerSetpoint | nicht verifiziert | {"value":-642} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.CurrentLimitedDueToHighTemp | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.CurrentLimitedDueToHighTemp | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.FrequencyVariationOccurred | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.FrequencyVariationOccurred | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.MaxFeedInPower | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.MaxFeedInPower | nicht verifiziert | {"value":3983} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.OffsetAddedToVoltageSetpoint | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.OffsetAddedToVoltageSetpoint | nicht verifiziert | {"value":1} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.OverruledShoreLimit | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L1.OverruledShoreLimit | nicht verifiziert | {"value":null} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.AcPowerSetpoint | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.AcPowerSetpoint | nicht verifiziert | {"value":76} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.CurrentLimitedDueToHighTemp | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.CurrentLimitedDueToHighTemp | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.FrequencyVariationOccurred | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.FrequencyVariationOccurred | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.MaxFeedInPower | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.MaxFeedInPower | nicht verifiziert | {"value":3983} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.OffsetAddedToVoltageSetpoint | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.OffsetAddedToVoltageSetpoint | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.OverruledShoreLimit | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L2.OverruledShoreLimit | nicht verifiziert | {"value":null} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.AcPowerSetpoint | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.AcPowerSetpoint | nicht verifiziert | {"value":465} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.CurrentLimitedDueToHighTemp | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.CurrentLimitedDueToHighTemp | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.FrequencyVariationOccurred | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.FrequencyVariationOccurred | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.MaxFeedInPower | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.MaxFeedInPower | nicht verifiziert | {"value":3983} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.OffsetAddedToVoltageSetpoint | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.OffsetAddedToVoltageSetpoint | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.OverruledShoreLimit | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.L3.OverruledShoreLimit | nicht verifiziert | {"value":null} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.Sustain | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.Sustain | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.N.c0619ab336ed.vebus.276.Hub4.TargetPowerIsMaxFeedIn | mqtt.1.N.c0619ab336ed.vebus.276.Hub4.TargetPowerIsMaxFeedIn | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.ioBroker.ESS_BatteryLowVoltage | mqtt.1.ioBroker.ESS_BatteryLowVoltage | nicht verifiziert | 48 | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.ioBroker.ESS_CCL_BAT | mqtt.1.ioBroker.ESS_CCL_BAT | nicht verifiziert | 0 | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.1.ioBroker.ESS_DisableBatteryCharge | mqtt.1.ioBroker.ESS_DisableBatteryCharge | nicht verifiziert | 0 | SAFE_RUNTIME | Boolean runtime control topic used to gate ESS behavior. |
| mqtt.1.ioBroker.ESS_DisableFeedIn | mqtt.1.ioBroker.ESS_DisableFeedIn | nicht verifiziert | 0 | SAFE_RUNTIME | Boolean runtime control topic used to gate ESS behavior. |
| mqtt.1.ioBroker.ESS_DisablePVFeedIn | mqtt.1.ioBroker.ESS_DisablePVFeedIn | nicht verifiziert | 1 | SAFE_RUNTIME | Boolean runtime control topic used to gate ESS behavior. |
| mqtt.1.ioBroker.ESS_GridSetpoint | mqtt.1.ioBroker.ESS_GridSetpoint | nicht verifiziert | 0 | SAFE_RUNTIME | Existing runtime setpoint topic for ESS grid power setpoint; not a persistent settings path. |
| mqtt.1.ioBroker.ESS_MaxChargeCurrent | mqtt.1.ioBroker.ESS_MaxChargeCurrent | nicht verifiziert | 1 | SAFE_RUNTIME | Existing runtime limit topic used for EOS control; looks like temporary operating limit. |
| mqtt.1.ioBroker.ESS_MaxChargeVoltage | mqtt.1.ioBroker.ESS_MaxChargeVoltage | nicht verifiziert | 53.6 | SAFE_RUNTIME | Existing runtime limit topic used for EOS control; looks like temporary operating limit. |
| mqtt.1.ioBroker.ESS_MaxDischargeCurrent | mqtt.1.ioBroker.ESS_MaxDischargeCurrent | nicht verifiziert | 210 | SAFE_RUNTIME | Existing runtime limit topic used for EOS control; looks like temporary operating limit. |
| mqtt.1.ioBroker.ESS_Test | mqtt.1.ioBroker.ESS_Test | nicht verifiziert | null | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.settings.0.Settings.CGwacs.Hub4Mode | mqtt.2.N.c0619ab4bea6.settings.0.Settings.CGwacs.Hub4Mode | nicht verifiziert | {"value":1} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.2.N.c0619ab4bea6.settings.0.Settings.DynamicEss.BatteryChargeLimit | mqtt.2.N.c0619ab4bea6.settings.0.Settings.DynamicEss.BatteryChargeLimit | nicht verifiziert | {"max":9999.9,"min":-1.0,"value":-1.0} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.2.N.c0619ab4bea6.settings.0.Settings.GuiMods.GaugeLimits.BatteryMaxChargeCurrent | mqtt.2.N.c0619ab4bea6.settings.0.Settings.GuiMods.GaugeLimits.BatteryMaxChargeCurrent | nicht verifiziert | {"value":0.0} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.2.N.c0619ab4bea6.settings.0.Settings.GuiMods.GaugeLimits.BatteryMaxDischargeCurrent | mqtt.2.N.c0619ab4bea6.settings.0.Settings.GuiMods.GaugeLimits.BatteryMaxDischargeCurrent | nicht verifiziert | {"value":0.0} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.2.N.c0619ab4bea6.settings.0.Settings.SystemSetup.MaxChargeCurrent | mqtt.2.N.c0619ab4bea6.settings.0.Settings.SystemSetup.MaxChargeCurrent | nicht verifiziert | {"max":10000,"min":-1,"value":1} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.2.N.c0619ab4bea6.vebus.276.BatteryOperationalLimits.MaxChargeCurrent | mqtt.2.N.c0619ab4bea6.vebus.276.BatteryOperationalLimits.MaxChargeCurrent | nicht verifiziert | {"value":1.0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.BatteryOperationalLimits.MaxDischargeCurrent | mqtt.2.N.c0619ab4bea6.vebus.276.BatteryOperationalLimits.MaxDischargeCurrent | nicht verifiziert | {"value":500.0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Dc.0.MaxChargeCurrent | mqtt.2.N.c0619ab4bea6.vebus.276.Dc.0.MaxChargeCurrent | nicht verifiziert | {"max":210.0,"value":99.0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.AssistantId | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.AssistantId | nicht verifiziert | {"value":5} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.DisableCharge | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.DisableCharge | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.DisableFeedIn | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.DisableFeedIn | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.DoNotFeedInOvervoltage | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.DoNotFeedInOvervoltage | nicht verifiziert | {"value":1} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.FixSolarOffsetTo100mV | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.FixSolarOffsetTo100mV | nicht verifiziert | {"value":1} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.AcPowerSetpoint | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.AcPowerSetpoint | nicht verifiziert | {"value":3102} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.CurrentLimitedDueToHighTemp | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.CurrentLimitedDueToHighTemp | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.FrequencyVariationOccurred | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.FrequencyVariationOccurred | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.MaxFeedInPower | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.MaxFeedInPower | nicht verifiziert | {"value":32766} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.OffsetAddedToVoltageSetpoint | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.OffsetAddedToVoltageSetpoint | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.OverruledShoreLimit | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L1.OverruledShoreLimit | nicht verifiziert | {"value":3270.0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.AcPowerSetpoint | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.AcPowerSetpoint | nicht verifiziert | {"value":3115} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.CurrentLimitedDueToHighTemp | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.CurrentLimitedDueToHighTemp | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.FrequencyVariationOccurred | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.FrequencyVariationOccurred | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.MaxFeedInPower | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.MaxFeedInPower | nicht verifiziert | {"value":32766} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.OffsetAddedToVoltageSetpoint | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.OffsetAddedToVoltageSetpoint | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.OverruledShoreLimit | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L2.OverruledShoreLimit | nicht verifiziert | {"value":3270.0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.AcPowerSetpoint | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.AcPowerSetpoint | nicht verifiziert | {"value":3086} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.CurrentLimitedDueToHighTemp | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.CurrentLimitedDueToHighTemp | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.FrequencyVariationOccurred | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.FrequencyVariationOccurred | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.MaxFeedInPower | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.MaxFeedInPower | nicht verifiziert | {"value":32766} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.OffsetAddedToVoltageSetpoint | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.OffsetAddedToVoltageSetpoint | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.OverruledShoreLimit | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.L3.OverruledShoreLimit | nicht verifiziert | {"value":3270.0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.Sustain | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.Sustain | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.TargetPowerIsMaxFeedIn | mqtt.2.N.c0619ab4bea6.vebus.276.Hub4.TargetPowerIsMaxFeedIn | nicht verifiziert | {"value":0} | UNKNOWN | Derived from live topic structure; classification conservative. |
| mqtt.3.N.b827eb7fd855.settings.0.Settings.CGwacs.Hub4Mode | mqtt.3.N.b827eb7fd855.settings.0.Settings.CGwacs.Hub4Mode | nicht verifiziert | {"value":1} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.3.N.b827eb7fd855.settings.0.Settings.DynamicEss.BatteryChargeLimit | mqtt.3.N.b827eb7fd855.settings.0.Settings.DynamicEss.BatteryChargeLimit | nicht verifiziert | {"max":9999.9,"min":-1.0,"value":-1.0} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |
| mqtt.3.N.b827eb7fd855.settings.0.Settings.SystemSetup.MaxChargeCurrent | mqtt.3.N.b827eb7fd855.settings.0.Settings.SystemSetup.MaxChargeCurrent | nicht verifiziert | {"max":10000,"min":-1,"value":-1} | FORBIDDEN_VEBUS_OR_FLASH_RISK | Topic is in settings or read/request namespace, likely persistent or informational rather than safe runtime. |

## Nicht freigegebene Bereiche

- VE.Bus
- settings
- UNKNOWN
- persistente Geräteeinstellungen
- Batterie-/BMS-Konfiguration
- alles ohne eindeutige Runtime-Klassifikation

## Ergebnis

Aus diesem Export werden aktuell keine direkten Victron-Schreibpfade freigegeben.
Für EOS dürfen diese Daten nur zur Dokumentation und späteren getrennten Sicherheitsprüfung verwendet werden.
