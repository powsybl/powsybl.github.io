---
title: Three windings transformer
layout: default
---

The `com.powsybl.iidm.network.ThreeWindingsTransformer` interface is used to model a three windings power transformer.
A three windings power transformer is connected to three voltage levels (side 1, side 2 and side 3) that belong to the
same substation. We usually have:
- Side 1 as the primary side (side with highest rated voltage)
- Side 2 as the secondary side (side with the medium rated voltage)
- Side 3 as the tertiary side (side with the lowest rated voltage)

A [Ratio Tap Changer](ratioTapChanger.md) and/or a [Phase Tap Changer](phaseTapChanger.md) can be associated to all three sides of a three windings power transformer.
Only one Tap Changer (either ratio or phase tap changer) is allowed to be regulating on the equipment at a given time.

# Characteristics

| Attribute | Type | Required | Default value | Description |
| --------- | ---- | -------- | ------------- | ----------- |
| Leg1 | `ThreeWindingsTransformer.Leg` | yes | - | The leg at the primary side |
| Leg2 | `ThreeWindingsTransformer.Leg` | yes | - | The leg at the secondary side |
| Leg3 | `ThreeWindingsTransformer.Leg` | yes | - | The leg at the tertiary side |

<br/>

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| id | string | - | yes | - | Unique identifier of the transformer |
| name | string | - | yes | - | Human-readable name of the transformer |
| RatedU0 | double | kV | yes | - | The rated voltage at the star bus |

<br/>
Three windings transformers can also have [current limits](currentLimits.md) defined for each leg.

## Leg
`ThreeWindingsTransformer.Leg` is a nested interface used to model a leg of a three windings power transformer.

### Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| Terminal | [`Terminal`](terminal.md) | - | yes | - | The terminal the leg is connected to |
| R | double | $$\Omega\$$ | yes | - | The nominal series resistance specified at the voltage of the leg |
| X | double | $$\Omega\$$ | yes | - | The nominal series reactance specified at the voltage of the leg |
| G | double | S | yes | - | The nominal magnetizing conductance specified at the voltage of the leg |
| B | double | S | yes | - | The nominal magnetizing susceptance specified at the voltage of the leg |
| RatedU | double | kV | yes | - | The rated voltage |

# Model
Three windings transformers are modeled with three legs, where every leg model is electrically equivalent to a two windings transformer.
For each leg, the network bus is at side 1 and the star bus is at side 2.

![Power line model](./images/three-windings-transformer-model.svg){: width="50%" .center-image}

# Examples
This is an example of how to create a new ThreeWindingsTransformer in the network:
```java
ThreeWindingsTransformer threeWindingsTransformer = substation.newThreeWindingsTransformer()
    .setId("TWT3")
    .setName("TWT3Name")
    .setRatedU0(132)
    .newLeg1()
        .setVoltageLevel("VL1")
        .setNode(11)
        .setR(17.424)
        .setX(1.7424)
        .setG(0.00573921028466483)
        .setB(0.000573921028466483)
        .setRatedU(132.0)
        .add()
    .newLeg2()
        .setVoltageLevel("VL2")
        .setNode(22)
        .setR(1.089)
        .setX(0.1089)
        .setG(0.0)
        .setB(0.0)
        .setRatedU(33.0)
        .add()
    .newLeg3()
        .setVoltageLevel("VL3")
        .setNode(33)
        .setR(0.121)
        .setX(0.0121)
        .setG(0.0)
        .setB(0.0)
        .setRatedU(11.0)
        .add()
    .add();
```

# Extensions

## Phase angle clock

This extension is used to model the Vector Group of a three windings transformer. The phase angle clock could be modeled at leg 2, leg 3 or both legs 2 and 3 and of a three windings transformer (network side). The voltage phase angle displacement is represented with clock hours. The valid values are 0 to 11.

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| PhaseAngleClockLeg2 | int [0-11] | hours | yes | - | The voltage phase angle displacement at leg 2 |
| PhaseAngleClockLeg3 | int [0-11] | hours | yes | - | The voltage phase angle displacement at leg 3 |

```java
transformer.addExtension(ThreeWindingsTransformerPhaseAngleClock.class, new ThreeWindingsTransformerPhaseAngleClock(transformer, 10, 1));
```
