---
title: Ratio tap changer
layout: default
---

The `com.powsybl.iidm.network.RatioTapChanger` interface is used to model ratio tap changer devices on transformers.
It can be added to both [two windings transformers](twoWindingsTransformer.md) and [three windings transformers](threeWindingsTransformer.md).

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Low tap position | int | - | no | 0 | Position index of the tap changer's low tap |
| Tap position | int | - | yes | - | Position index of current tap |
| Load tap changing capabilities | boolean | - | no | false | ```true``` if ratio tap changer has load tap changing capabilities, ```false``` otherwise |
| Regulating | boolean | - | no | false | ```true``` if ratio tap changer is regulating, ```false``` otherwise. [State variable](../../todo.md) |
| Target Deadband | double | - | no | `Double.NaN` | The deaband used to avoid excessive update of controls |
| Target V | double | kV | yes | - | The target voltage |
| Regulation terminal | Terminal | - | no | - | The terminal which voltage is regulated |

Each step of a ratio tap changer has the following attributes:

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| $$r_{r, tap}$$ | double | % | yes | - | Resistance deviation in percent of nominal value |
| $$x_{r, tap}$$ | double | % | yes | - | Reactance deviation in percent of nominal value |
| $$g_{r, tap}$$ | double | % | yes | - | Conductance deviation in percent of nominal value |
| $$b_{r, tap}$$ | double | % | yes | - | Susceptance deviation in percent of nominal value |
| $$\rho_{r, tap}$$ | double | p.u. | yes | - | Voltage ratio in per unit of the rated voltages |

# Model
A ratio tap changer is regulating if both **Load tap changing capabilities** and **Regulating** are set to ```true```.
Remote control can be modelled by putting a distant terminal as regulation terminal.

For more information about how ratio tap changers are taken into account in transformers model, please refer to [two windings transformers documentation](twoWindingsTransformer.md) and [three windings transformers one](threeWindingsTransformer.md).


# Examples
This example shows how to add a ratio tap changer to a two windings transformer:
```java
twoWindingsTransformer.newRatioTapChanger()
    .setLowTapPosition(-1)
    .setTapPosition(0)
    .setLoadTapChangingCapabilities(true)
    .setRegulating(true)
    .setTargetV(25)
    .setRegulationTerminal(twoWindingsTransformer.getTerminal1())
    .beginStep()
        .setRho(0.95)
        .setR(1.)
        .setX(2.)
        .setG(0.5)
        .setB(0.5)
        .endStep()
    .beginStep()
        .setRho(1)
        .setR(1.)
        .setX(2.)
        .setG(0.5)
        .setB(0.5)
        .endStep()
    .beginStep()
        .setRho(1.05)
        .setR(1.)
        .setX(2.)
        .setG(0.5)
        .setB(0.5)
        .endStep()
    .add()
```
 