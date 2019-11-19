---
title: Phase tap changer
layout: default
---

The `com.powsybl.iidm.network.PhaseTapChanger` interface is used to model a phase tap changer device on a transformer.
It can be added to both [two windings transformers](./twoWindingsTransformer.md) and [three windings transformers](./threeWindingsTransformer.md).

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Low tap position | int | - | no | 0 | The position index of the tap changer's low tap |
| Tap position | int | - | yes | - | The position index of current tap |
| Regulating | boolean | - | no | false | ```true``` if the ratio tap changer is regulating, ```false``` otherwise. This is a State variable. |
| Target Deadband | double | - | no | `Double.NaN` | The deadband used to avoid excessive update of controls |
| Regulation mode | enum | - | no | FIXED_TAP | The regulation mode of the phase tap changer. May be ```CURRENT_LIMITER```, ```ACTIVE_POWER_CONTROL``` or ```FIXED_TAP``` |
| Regulation value | double | MW or A | yes | - | The target value, depending on the regulation mode |
| Regulation terminal | Terminal | - | no | - | The terminal where regulation is done |

Each step of a phase tap changer has the following attributes:

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| $$r_{\phi, tap}$$ | double | % | yes | - | The resistance deviation in percent of nominal value |
| $$x_{\phi, tap}$$ | double | % | yes | - | The reactance deviation in percent of nominal value |
| $$g_{\phi, tap}$$ | double | % | yes | - | The conductance deviation in percent of nominal value |
| $$b_{\phi, tap}$$ | double | % | yes | - | The susceptance deviation in percent of nominal value |
| $$\rho_{\phi, tap}$$ | double | p.u. | yes | - | The voltage ratio in per unit of the rated voltages |
| $$\alpha_{\phi, tap}$$ | double | $$^{\circ}$$ | yes | - | Angle difference |

# Model
A phase tap changer is regulating if **Regulating** is set to ```true```.

Remote control can be modeled by setting a distant terminal as the regulation terminal.

Three regulation modes are available:
- ```CURRENT_LIMITER```: the tap changer adapts the step position to limit the current on the regulation terminal
- ```ACTIVE_POWER_CONTROL```: the tap changer adapts the step position to regulate the active power on the regulation terminal
- ```FIXED_TAP```: no tap changer step modification is allowed

For more information about how phase tap changers are taken into account in the transformers model, please refer to the [two windings transformers documentation](./twoWindingsTransformer.md) and the [three windings transformers one](./threeWindingsTransformer.md).

# Examples
This example shows how to add a phase tap changer to a two windings transformer:
```java
twoWindingsTransformer.newPhaseTapChanger()
    .setLowTapPosition(-1)
    .setTapPosition(0)
    .setRegulating(true)
    .setRegulationMode(PhaseTapChanger.RegulationMode.CURRENT_LIMITER)
    .setRegulationValue(25)
    .setRegulationTerminal(twoWindingsTransformer.getTerminal2())
    .beginStep()
        .setAlpha(-10)
        .setRho(0.99)
        .setR(1.)
        .setX(2.)
        .setG(0.5)
        .setB(0.5)
        .endStep()
    .beginStep()
        .setAlpha(0)
        .setRho(1)
        .setR(1.)
        .setX(2.)
        .setG(0.5)
        .setB(0.5)
        .endStep()
    .beginStep()
        .setAlpha(10)
        .setRho(1.01)
        .setR(1.)
        .setX(2.)
        .setG(0.5)
        .setB(0.5)
        .endStep()
    .add()
```
