---
title: Shunt compensator
layout: default
---

The `com.powsybl.iidm.network.ShuntCompensator` interface is used to model a shunt compensator.

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| bPerSection | double | S | yes | - | The Positive sequence shunt (charging) susceptance per section |
| MaximumSectionCount| integer | int | yes | - | The maximum number of sections that may be switched on |
| CurrentSectionCount | integer | int | yes | - | The current number of section that may be switched on |

## Section
A section of a shunt compensator is an individual capacitor or reactor.
A value of bPerSection positive means it is modeling a capacitor, an equipment that injects reactive
power into the bus.
A value of bPerSection negative means a reactor, an equipment that can absorb excess reactive power
from the network.

## Current Section Count
The current section count is expected to be greater than one and lesser or equal to the maximum section count.

# Flow sign convention
Shunt compensator follow a load sign convention:
- Flow out from bus has positive sign.
- Consumptions are positive.

In case of a capacitor, the value for its Q will be negative.
In case of a reactor, the value for its Q will be positive.

# Examples
This example shows how to create a new `ShuntCompensator` in the network:
```java
ShuntCompensator shunt = network.getVoltageLevel("VL").newShunt()
    .setId("SHUNT")
    .setBus("BUS1")
    .setConnectableBus("BUS1")
    .setbPerSection(5.0)
    .setCurrentSectionCount(6)
    .setMaximumSectionCount(10)
    .add();
```
