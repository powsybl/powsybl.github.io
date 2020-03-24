---
title: Shunt compensator
layout: default
---

The `com.powsybl.iidm.network.ShuntCompensator` interface is used to model a shunt compensator.

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| Model | [`ShuntCompensatorModel`](shuntCompensatorModel.md) | - | yes | - | Model describing how susceptance and conductance are split amongst the shunt compensator's sections |
| MaximumSectionCount| integer | int | yes | - | The maximum number of sections that may be switched on |
| CurrentSectionCount | integer | int | yes | - | The current number of section that may be switched on |
| RegulatingTerminal | [`Terminal`](terminal.md) | - | no | The shunt compensator's terminal | The terminal used for regulation |
| TargetV | double | kV | only if `VoltageRegulatorOn` is set to `true` | - |  The voltage target |
| TargetDeadband | double | kV | only if `VoltageRegulatorOn` is set to `true` | - | The deadband used to avoid excessive update of controls |
| VoltageRegulatorOn | boolean | - | no | false | The voltage regulating status |

## Section
A section of a shunt compensator is an individual capacitor or reactor.
A specified susceptance and conductance are linked to each section of the shunt compensator.

## Model
There are two possible shunt compensator's models: linear and non linear. The attribute `model` describes the characteristics of the shunt compensator's distribution of susceptance
and conductance amongst its sections. To know more about these characteristics, go to the documentation page of the [Shunt compensator's models](shuntCompensatorModel.md).

## Current Section Count
The current section count is the index of the section to which the shunt compensator is currently pointing.
It is expected to be greater than or equal to zero and lesser than or equal to the maximum section count.

## Regulation
Regulation for shunt compensators does not necessarily model automation, it can represent human actions on the network
i.e. an operator activating a shunt compensator, deactivating a shunt compensator or changing the current section of a shunt compensator.
However, it can of course be integrated on a power flow calculation or not, depending of what is wanted to be shown.

# Flow sign convention
Shunt compensators follow a load sign convention:
- Flow out from bus has positive sign.
- Consumptions are positive.

In case of a capacitor, the value for its Q will be negative.
In case of a reactor, the value for its Q will be positive.

# Examples
This example shows how to create a new linear `ShuntCompensator` in the network:
```java
ShuntCompensator shunt = network.getVoltageLevel("VL").newShunt()
    .setId("SHUNT")
    .setBus("BUS1")
    .setConnectableBus("BUS1")
    .setCurrentSectionCount(6)
    .newLinearModel()
        .setbPerSection(5.0)
        .setgPerSection(2.0)
        .setMaximumSectionCount(10)
    .add()
    .add();
```

This example shows how to create a new non-linear `ShuntCompensator` in the network:
```java
ShuntCompensator shunt = network.getVoltageLevel("VL").newShunt()
    .setId("SHUNT")
    .setBus("BUS1")
    .setConnectableBus("BUS1")
    .setCurrentSectionCount(6)
    .newNonLinearModel()
        .beginSection()
            .setSectionNumber(0)
            .setB(5.0)
            .setG(2.0)
        .endSection()
        .beginSection()
            .setSectionNumber(1)
            .setB(4.0)
            .setG(1.0)
        .endSection()
    .add()
    .add();
```
