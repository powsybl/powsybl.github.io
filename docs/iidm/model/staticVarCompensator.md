---
title: Static VAR compensator
layout: default
---

The `com.powsybl.iidm.network.StaticVarCompensator` interface is used to model a static VAR compensator.

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| Bmin | double | S | yes | - | The minimum susceptance |
| Bmax | double | S | yes | - | The maximum susceptance |
| VoltageSetpoint | double | kV | only if `RegulationMode` is set to `VOLTAGE` | - | The voltage setpoint |
| ReactivePowerSetpoint | double | MVar | only if `RegulationMode` is set to `REACTIVE_POWER` | - | The reactive power setpoint |
| RegulatingTerminal | [`Terminal`](terminal.md) | - | no | The static var compensator's terminal | The terminal used for regulation |
| RegulationMode | `RegulationMode` | - | yes | - | The regulation mode |

## RegulationMode
The `com.powsybl.iidm.network.StaticVarCompensator.RegulationMode` enum contains these three values:
- VOLTAGE
- REACTIVE_POWER
- OFF

## Setpoints
The voltage setpoint is required when the regulation mode is set to VOLTAGE.
The reactive power setpoint is required when the regulation mode is set to REACTIVE_POWER.

# Examples
This example shows how to create a new `StaticVarCompensator` in the network:
```java
StaticVarCompensator staticVarCompensator = network.getVoltageLevel("VL")
    .newStaticVarCompensator()
        .setId("SVC")
        .setBus("BUS1")
        .setConnectableBus("BUS1")
        .setBmin(0.0002)
        .setBmax(0.0008)
        .setRegulationMode(StaticVarCompensator.RegulationMode.VOLTAGE)
        .setVoltageSetPoint(390)
        .add();
```
