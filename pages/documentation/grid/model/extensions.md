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

Every extension is considered as serializable unless explicitly specified as non-serializable in XML-IIDM.

* TOC
{:toc}

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

The participation status and the participation factor are multi-variants: they can vary from one variant to another.

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Branch observability

This extension models branches' flows' observability on both sides, obtained after a state estimation.

| Attribute  | Type                  | Unit | Required | Default value | Description                                     |
|------------|-----------------------|------|---------| ------------- |-------------------------------------------------|
| quality P1 | ObservabilityQuality  | -    | no      | - | The observability of active power on side ONE   |
| quality P2 | ObservabilityQuality  | -    | no      | - | The observability of active power on side TWO   |
| quality Q1 | ObservabilityQuality  | -    | no      | - | The observability of reactive power on side ONE |
| quality Q2 | ObservabilityQuality  | -    | no      | - | The observability of reactive power on side TWO |

**Observability quality**

This extension contains the sub-object `ObservabilityQuality`.

| Attribute          | Type      | Unit | Required | Default value | Description                                        |
|--------------------|-----------|------|----------| ------------- |----------------------------------------------------|
| standard deviation | double    | -    | yes      | - | The standard deviation                             |
| redundant          | redundant | -    | yes      | - | Indicates if this value is confirmed by redundancy |

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Branch status

<span style="color: red">TODO</span>

## Busbar section position

<span style="color: red">TODO</span>

## CGMES control areas

This extensions models all the control areas contained in the network as modeled in CGMES.

| Attribute           | Type                           | Unit | Required | Default value | Description                  |
|---------------------|--------------------------------|------|----------| ------------- |------------------------------|
| CGMES control areas | `Collection<CgmesControlArea>` | -    | no       | - | The list of control areas in the network |

** CGMES control area**

| Attribute                        | Type       | Unit | Required | Default value | Description                                         |
|----------------------------------|------------|------|----------| ------------- |-----------------------------------------------------|
| ID                               | String     | -    | yes      | - | The control area's ID                               |
| name                             | String     | -    | no       | - | The control area's name                             |
| energy identification Code (EIC) | String     | -    | no       | - | The control area's EIC                              |
| net interchange                  | double     | -    | no       | - | The control area's net interchange (at its borders) |
| terminals                        | `Terminal` | -    | no       | - | Terminals at the border of the control area         |
| boundaries                       | `Boundary` | -    | no       | - | Boundaries at the border of the control area        |

It is possible to retrieve a control area by its ID. It is also possible to iterate through all control areas.

This extension is provided by the `com.powsybl:powsybl-cgmes-extensions` module.

## CGMES conversion context extension

This extension is used to store the CGMES conversion context as built during the CGMES import.
It contains the used configuration, the terminal mapping and the CGMES model.
It is provided by the `com.powsybl:powsybl-cgmes-conversion` module. It is not serializable.

## CGMES dangling line boundary node

This extension is used to add some CGMES characteristics to boundary dangling lines.


| Attribute                             | Type    | Unit | Required | Default value | Description                                                                                          |
|---------------------------------------|---------|------|----------|---------------|------------------------------------------------------------------------------------------------------|
| hvdc status                           | boolean | -    | no       | false         | Indicates if the boundary line is an HVDC line or not (can be the case for AC emulation for example) |
| line Energy Identification Code (EIC) | String  | -    | no       | -             | The boundary line's EIC if it exists                                                                 |

This extension is provided by the `com.powsybl:powsybl-cgmes-extensions` module.

## CGMES-IIDM mapping

This extension contains the mapping between IIDM buses and CGMES topological nodes and between IIDM voltage levels and CGMES base voltages.
This extension is provided by the `com.powsybl:powsybl-cgmes-extensions` module.

## CGMES line boundary node

This extension is used to add some CGMES characteristics to boundary lines.


| Attribute                             | Type    | Unit | Required | Default value | Description                                                                                          |
|---------------------------------------|---------|------|----------|---------------|------------------------------------------------------------------------------------------------------|
| hvdc status                           | boolean | -    | no       | false         | Indicates if the boundary line is an HVDC line or not (can be the case for AC emulation for example) |
| line Energy Identification Code (EIC) | String  | -    | no       | -             | The boundary line's EIC if it exists                                                                 |

This extension is provided by the `com.powsybl:powsybl-cgmes-extensions` module.

## CGMES model extension

This extension is used to store the CGMES model as retrieved from the triplestore (as a query catalog) on the network.
It is provided by the `com.powsybl:powsybl-cgmes-conversion` module. It is not serializable.

## CGMES Tap Changers

<span style="color: red">TODO</span>

## CGMES SSH metadata

<span style="color: red">TODO</span>

## CGMES SV metadata

<span style="color: red">TODO</span>

## CIM characteristics

<span style="color: red">TODO</span>

## Connectable position

<span style="color: red">TODO</span>

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

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Discrete measurements

<span style="color: red">TODO</span>

## ENTSO-E area

<span style="color: red">TODO</span>

## HVDC angle droop active power control

<span style="color: red">TODO</span>

## HVDC operator active power range

<span style="color: red">TODO</span>

## Generator ENTSO-E category

<span style="color: red">TODO</span>

## Generator short-circuit

<span style="color: red">TODO</span>

## Identifiable short-circuit

<span style="color: red">TODO</span>

## Injection observability

This extension models injections' flows' observability, obtained after a state estimation.

| Attribute | Type                  | Unit | Required | Default value | Description                         |
|-----------|-----------------------|------|---------| ------------- |-------------------------------------|
| quality P | ObservabilityQuality  | -    | no      | - | The observability of active power   |
| quality Q | ObservabilityQuality  | -    | no      | - | The observability of reactive power |

**Observability quality**

This extension contains the sub-object `ObservabilityQuality`.

| Attribute          | Type      | Unit | Required | Default value | Description                                       |
|--------------------|-----------|------|----------| ------------- |---------------------------------------------------|
| standard deviation | double    | -    | yes      | - | The standard deviation                            |
| redundant          | redundant | -    | yes      | - | Indicates if the value is confirmed by redundancy |

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

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

All of this extension's attributes are multi-variants: they can vary from one variant to another.

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Measurements

<span style="color: red">TODO</span>

## Merged X-node

<span style="color: red">TODO</span>

## PSS/E conversion context extension

<span style="color: red">TODO</span>

## PSS/E model extension

<span style="color: red">TODO</span>

## Remote reactive power control

<span style="color: red">TODO</span>

## Slack terminal

This extension is attached to a [voltage level](index.md#voltage-level) and is used to define the slack bus of a power flow calculation i.e. which bus will be used to balance the active and reactive power in load flow analysis. Use this extension before a computation to force the slack bus selection. You should enable default load flow parameter [`isReadSlackBus`](../../simulation/powerflow/index.md#available-parameters). Use this extension after a computation to attach to the network the slack bus that has been selected by the load flow engine (one by connected component). You should enable default load flow parameter [`isWriteSlackBus`](../../simulation/powerflow/index.md#available-parameters).

The slack bus is defined through the terminal of a connectable that belongs to the bus. It is totally allowed to define a disconnected terminal as slack as the connectable could be reconnected during a grid study.

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Terminal | `Terminal` | - | yes | - | The slack terminal |

 ```java
SlackTerminal.attach(bus);
```

This extension is provided by the `com.powsybl:powsybl-iidm-api` module.

## Three-windings transformer phase angle clock

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

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Three-windings transformer to be estimated

<span style="color: red">TODO</span>

## Two-windings transformer phase angle clock

This extension is used to model the Vector Group of a two windings transformer. The phase angle clock is modeled at side 2 of a two windings transformer. The voltage phase angle displacement is represented with clock hours. The valid values are 0 to 11. This extension is attached to a [two windings transformer](index.md#two-windings-transformer).

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| PhaseAngleClock | int [0-11] | hours | yes | - | The voltage phase angle displacement |

```java
transformer.newExtension(TwoWindingsTransformerPhaseAngleClockAdder.class)
    .withPhaseAngleClock(3)
    .add();
```

This extension is provided in the module `com.powsybl:powsybl-iidm-extensions`.

## Two-windings transformer to be estimated

<span style="color: red">TODO</span>

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

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## X-node

<span style="color: red">TODO</span>
