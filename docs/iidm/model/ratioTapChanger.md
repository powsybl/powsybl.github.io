---
title: Ratio tap changer
layout: default
---

The `com.powsybl.iidm.network.RatioTapChanger` interface is used to model a ratio tap changer device on a transformer.
It can be added to both [two windings transformers](twoWindingsTransformer.md) and [three windings transformers](threeWindingsTransformer.md).

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| LowTapPosition | int | - | no | 0 | The position index of the tap changer's low tap |
| TapPosition | int | - | yes | - | The position index of current tap |
| LoadTapChangingCapabilities | boolean | - | no | false | ```true``` if the ratio tap changer has load tap changing capabilities, ```false``` otherwise |
| Regulating | boolean | - | no | false | ```true``` if the ratio tap changer is regulating, ```false``` otherwise. [State variable](../../todo.md) |
| TargetDeadband | double | - | no | `Double.NaN` | The deadband used to avoid excessive update of controls |
| TargetV | double | kV | yes | - | The target voltage |
| RegulationTerminal | Terminal | - | no | - | The terminal which voltage is regulated |

Each step of a ratio tap changer has the following attributes:

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| $$r_{r, tap}$$ | double | % | yes | - | The resistance deviation in percent of nominal value |
| $$x_{r, tap}$$ | double | % | yes | - | The reactance deviation in percent of nominal value |
| $$g_{r, tap}$$ | double | % | yes | - | The conductance deviation in percent of nominal value |
| $$b_{r, tap}$$ | double | % | yes | - | The susceptance deviation in percent of nominal value |
| $$\rho_{r, tap}$$ | double | p.u. | yes | - | The voltage ratio in per unit of the rated voltages |

# Model
A ratio tap changer is regulating if both **Load tap changing capabilities** and **Regulating** are set to ```true```.
Remote control can be modeled by setting a distant terminal as the regulation terminal.

For more information on how ratio tap changers are taken into account in the transformers model, please refer to the [two windings transformers documentation](twoWindingsTransformer.md) and the [three windings transformers one](threeWindingsTransformer.md).


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
