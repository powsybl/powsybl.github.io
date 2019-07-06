---
title: Generator
layout: default
---

The `com.powsybl.iidm.network.Generator` interface is used to model a generator.

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| EnergySource | `EnergySource` | - | yes | `OTHER` | The energy source |
| MinP | double | MW | yes | - | Minimal active power |
| MaxP | double | MW | yes | - | Maximum active power |
| RegulatingTerminal | `TerminalExt` | - | no | - | The terminal used for regulation |
| VoltageRegulatorOn | boolean | - | yes | - | The voltage regulator status |
| TargetP | double | MW | yes | - | The active power target |
| TargetQ | double | MVAr | no | - | The reactive power target |
| TargetV | double | kV | no | - | The voltage target |
| RatedS | double | MVA | yes | - | The rated nominal power |

## EnergySource
The `com.powsybl.iidm.network.EnergySource` enum contains these six values:
- HYDRO
- NUCLEAR
- WIND
- THERMAL
- SOLAR
- OTHER

## Active Limits
The minimal active power is expected to be lower than the maximal active power.

## Targets
The voltage target is required if the voltage regulator is on.
The reactive power target is required if the voltage regulator is off.

# Examples
This example shows how to create a new `Generator` in the network:
```java
Generator generator = network.getVoltageLevel("VL").newGenerator()
    .setId("GEN")
    .setNode(1)
    .setEnergySource(EnergySource.HYDRO)
    .setMinP(0.0)
    .setMaxP(70.0)
    .setVoltageRegulatorOn(false)
    .setTargetP(0.0)
    .setTargetV(0.0)
    .setTargetQ(0.0)
    .add();
```

# Extensions

## Active power control

This extension is used to configure participation factor of the generator typically in case of a loaflow with distributed slack.

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| participate | boolean | - | yes | - | participation status|
| droop | double | None (repartition key) | yes | - | participation factor |

Here is how to add an active power control extension to a generator:
```java
generator.addExtension(ActivePowerControl.class, new ActivePowerControl(generator, true, 4));
```
