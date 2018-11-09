---
title: VSC Converter Station
layout: default
---

The `com.powsybl.iidm.network.VscConverterStation` interface is used to model a VSC Converter Station. In IIDM, this is
a sub interface of [HVDC Converter Station](hvdcConverterStation.md).

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| VoltageRegulatorOn | boolean | - | yes | - | The voltage regulator status |
| VoltageSetpoint | double | kV | no | - | The voltage setpoint |
| ReactivePowerSetpoint | double | MVar | no | - | The reactive power setpoint |

## Setpoints
The voltage setpoint is required if the voltage regulator is on.
The reactive power setpoint is required if the voltage regulator is off.

# Examples
This example shows how to create a new VSC Converter Station in a network:
```java
VscConverterStation vcs = voltageLevel.newVscConverterStation()
    .setId("VSC")
    .setConnectableBus("B1")
    .setBus("B1")
    .setLossFactor(0.011f)
    .setVoltageRegulatorOn(true)
    .setVoltageSetpoint(405.0)
    .add();
```
