---
layout: default
latex: true
---

# Grid model extensions

The grid model contains enough data to basically describe supported components and run power flow computations, but it may not be sufficient for more complex studies.
The extensions are a way to add additional structured data to an equipment to extend its features.
The extensions can be attached to any objects of a network or to the network itself.

Some extensions are mono-variant meaning the data are identical for all the variants of the network. However, some of them are multi-variants to allow a different value for each variant of the network. It's typically the case for the [LoadDetail](#load-detail) extension that give the distribution of the constant part and the termo-sensitive part of a consumption. 

Note that some extensions provided by PowSyBl aren't supported in the [persistent implementation of IIDM](../../developer/repositories/powsybl-network-store.md).

* TOC
{:toc}

## Load detail
A load is described by its active power setpoint $$P0$$ and its reactive power setpoint $$Q0$$. This extension is used to detail :
- In the total amount of active power what is fixed and what is time-dependant (also called variable). The time-dependant part can be adjusted for production equals consumption.
- In the total amount of reactive power what is fixed and what is time-dependant (also called variable).

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| variableActivePower | double | MW | yes | - | The part of the active power setpoint that is considered variable |
| fixedActivePower | double | MVar | yes | - | The part of the active power setpoint that is considered constant |
| variableReactivePower | double | MW | yes | - | The part of the reactive power setpoint that is considered variable |
| fixedReactivePower | double | MVar | yes | - | The part of the reactive power setpoint that is considered constant |

Here is how to add an load detail extension to a load:
```java
load.newExtension(LoadDetailAdder.class)
    .withVariableActivePower(40)
    .withFixedActivePower(20)
    .withVariableReactivePower(5)
    .withFixedReactivePower(2)
    .add();
```


## Active power control
This extension is used to configure the participation factor of the generator, typically in the case of a load flow computation with distributed slack enabled. This extension is attached to a [generator](index.md#generator) or a [battery](index.md#battery).

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| participate | boolean | - | yes | - | The participation status |
| droop | double | None (repartition key) | yes | - | The participation factor |

Here is how to add an active power control extension to a generator:
```java
generator.newExtension(ActivePowerControlAdder.class)
    .withParticipate(true)
    .withDroop(4)
    .add();
```
The extension is provided by the `com.powsybl:powsybl-iidm-extensions` module. 

## Coordinated reactive control

Some generators can be coordinated to control reactive power in a point of the network. This extension is used to configure the percent of reactive coordinated control that comes from a generator. This extension is attached to a [generator](index.md#generator).

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| QPercent | percent [0-100] | - | yes | - | The reactive control percent of participation |

Here is how to add a coordinated reactive control extension to a generator:
```java
generator.newExtension(CoordinatedReactiveControlAdder.class)
    .withQPercent(40)
    .add();
```

Please note that the sum of the $$qPercent$$ values of the generators coordinating a same point of the network must be 100.

The extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Voltage per reactive power control

This extension is used to model voltage control of static VAR compensators. This extension is attached to a [static VAR compensator](index.md#static-var-compensator).

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Slope | double | kV per MVar | yes | - | The sensibility of the voltage with respect to reactive power |

When this extension is present and the slope greater than zero, the reactive output of the static VAR compensator is defined by:

$$Q = \dfrac{V - VoltageSetpoint}{slope}$$  
where $$V$$ is the voltage at regulating terminal and $$VoltageSetpoint$$ the target value in voltage given as attribute in a static VAR compensator.

Here is how to add a voltage per reactive power control extension to a static VAR compensator:
```java
svc.newExtension(VoltagePerReactivePowerControlAdder.class)
    .withSlope(0.5)
    .add();
```

The extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Slack terminal

This extension is attached to a [voltage level](index.md#voltage-level) and is used to define the slack bus of a power flow calculation. Use this extension before a computation to force the slack bus selection. You should enable default load flow parameter [`isReadSlackBus`](../../simulation/powerflow/index.md#available-parameters). Use this extension after a computation to attach to the network the slack bus that has been selected by the load flow engine (one by connected component). You should enable default load flow parameter [`isWriteSlackBus`](../../simulation/powerflow/index.md#available-parameters).

The slack bus is defined through the terminal of a connectable that belongs to the bus. It is totally allowed to define a disconnected terminal as slack as the connectable could be reconnected during a grid study.

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Terminal | `Terminal` | - | yes | - | The slack terminal |

 ```java
SlackTerminal.attach(bus);
```

The extension is provided by the `com.powsybl:powsybl-iidm-api` module.

## Two windings transformer phase angle clock

This extension is used to model the Vector Group of a two windings transformer. The phase angle clock is modeled at side 2 of a two windings transformer. The voltage phase angle displacement is represented with clock hours. The valid values are 0 to 11. This extension is attached to a [two windings transformer](index.md#two-windings-transformer).

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| PhaseAngleClock | int [0-11] | hours | yes | - | The voltage phase angle displacement |

```java
transformer.newExtension(TwoWindingsTransformerPhaseAngleClockAdder.class)
    .withPhaseAngleClock(3)
    .add();
```

The extension is provided in the module `com.powsybl:powsybl-iidm-extensions`.

## Three windings transformer phase angle clock 

This extension is used to model the Vector Group of a three windings transformer. The phase angle clock could be modeled at leg 2, leg 3 or both legs 2 and 3 and of a three windings transformer (network side). The voltage phase angle displacement is represented with clock hours. The valid values are `0` to `11`. This extension is attached to a [three windings transformer](index.md#three-windings-transformer).

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| PhaseAngleClockLeg2 | int [0-11] | hours | yes | - | The voltage phase angle displacement at leg 2 |
| PhaseAngleClockLeg3 | int [0-11] | hours | yes | - | The voltage phase angle displacement at leg 3 |

```java
transformer.newExtension(ThreeWindingsTransformerPhaseAngleClock.class)
    .withPhaseAngleClockLeg2(10)
    .withPhaseAngleClockLeg3(1)
    .add();
```

The extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.
