---
title: Phase tap changer
layout: default
---

The `com.powsybl.iidm.network.PhaseTapChanger` interface is used to model phase tap changer devices on transformers.
It can be added to both [two windings transformers](./twoWindingsTransformer.md) and [three windings transformers](./threeWindingsTransformer.md).

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Low tap position | int | - | no | 0 | Position index of the tap changer's low tap |
| Tap position | int | - | yes | - | Position index of current tap |
| Regulating | boolean | - | no | false | ```true``` if ratio tap changer is regulating, ```false``` otherwise. State variable |
| Target Deadband | double | - | no | `Double.NaN` | The deaband used to avoid excessive update of controls |
| Regulation mode | enum | - | no | FIXED_TAP | Regulation mode of the phase tap changer. May be ```CURRENT_LIMITER```, ```ACTIVE_POWER_CONTROL``` or ```FIXED_TAP``` |
| Regulation value | double | MW or A | yes | - | The target value, depending on the regulation mode |
| Regulation terminal | Terminal | - | no | - | The terminal where regulation is done |

Each step of a phase tap changer has the following attributes:

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| $$r_{\phi, tap}$$ | double | % | yes | - | Resistance deviation in percent of nominal value |
| $$x_{\phi, tap}$$ | double | % | yes | - | Reactance deviation in percent of nominal value |
| $$g_{\phi, tap}$$ | double | % | yes | - | Conductance deviation in percent of nominal value |
| $$b_{\phi, tap}$$ | double | % | yes | - | Susceptance deviation in percent of nominal value |
| $$\rho_{\phi, tap}$$ | double | p.u. | yes | - | Voltage ratio in per unit of the rated voltages |
| $$\alpha_{\phi, tap}$$ | double | $$^{\circ}$$ | yes | - | Angle difference |

# Model
A phase tap changer is regulating if **Regulating** is set to ```true```.

Remote control can be modelled by putting a distant terminal as regulation terminal.

Three regulation modes are available:
- ```CURRENT_LIMITER```: tap changer adapts step position to limit current on regulation terminal
- ```ACTIVE_POWER_CONTROL```: tap changer adapts step position to regulate active power on regulation terminal
- ```FIXED_TAP```: no tap changer step modification allowed

For more information about how phase tap changers are taken into account in transformers model, please refer to [two windings transformers documentation](./twoWindingsTransformer.md) and [three windings transformers one](./threeWindingsTransformer.md).

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
