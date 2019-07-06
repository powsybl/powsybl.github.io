---
title: Battery
layout: default
---

The `com.powsybl.iidm.network.Battery` interface is used to model a battery.
A battery on the electric grid is an energy storage device that is either capable of capturing energy from the grid or of injecting it into the grid. The electric energy on the grid side is thus transformed in chemical energy on the battery side and vice versa. The power flow is bidirectional and it is controlled via a power electronic converter.

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| p0 | double | MW | yes | - | Constant active power |
| q0 | double | MVar | yes | - | Constant reactive power |
| MinP | double | MW | yes | - | Minimal active power |
| MaxP | double | MW | yes | - | Maximum active power |
| RegulatingTerminal | `TerminalExt` | - | no | - | The terminal used for regulation |

## Active Limits
The minimal active power is expected to be lower than the maximal active power.

# Examples
This example shows how to create a new `Battery` in the network:
```java
Battery battery = network.getVoltageLevel("VL").newBattery()
    .setId("BAT")
    .setNode(1)
    .setP0(10)
    .setQ0(0)
    .setMinP(-12.0)
    .setMaxP(12.0)
    .add();
```
# Extensions

## Active power control

This extension is used for both batteries and generators, see [generators](generator.md).
