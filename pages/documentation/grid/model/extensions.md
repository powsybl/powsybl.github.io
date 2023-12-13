---
layout: default
latex: true
---

# Grid model extensions

The grid model contains enough data to basically describe supported components and run power flow computations, but it may not be sufficient for more complex studies.
The extensions are a way to add additional structured data to an equipment to extend its features.
The extensions can be attached to any objects of a network or to the network itself.

Some extensions are mono-variant meaning the data are identical for all the variants of the network. However, some of them are multi-variants to allow a different value for each variant of the network. It's typically the case for the [LoadDetail](#load-detail) extension that give the distribution of the constant part and the thermo-sensitive part of a consumption. 

Note that some extensions provided by PowSyBl aren't supported in the [persistent implementation of IIDM](../../developer/repositories/powsybl-network-store.md).

Every extension is considered as serializable unless explicitly specified as non-serializable in XML-IIDM.

* TOC
{:toc}

## Active power control
This extension is used to configure the participation factor of the generator, typically in the case of a load flow computation with distributed slack enabled (with [balance type](../../simulation/powerflow/index.md#balanceType) on generator). This extension is attached to a [generator](index.md#generator) or a [battery](index.md#battery).

| Attribute            | Type    | Unit                   | Required | Default value | Description                                  |
|----------------------|---------|------------------------|----------|---------------|----------------------------------------------|
| participate          | boolean | -                      | yes      | -             | The participation status                     |
| droop                | double  | None (repartition key) | no       | -             | The participation factor equals Pmax / droop |
| participation factor | double  | None (repartition key) | no       | -             | Defines the participation factor explicitly  |

Here is how to add an active power control extension to a generator:
```java
generator.newExtension(ActivePowerControlAdder.class)
    .withParticipate(true)
    .withDroop(4)
    .withParticipationFactor(1.5)
    .add();
```

The participation status and the participation factor are multi-variants: they can vary from one variant to another.

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Branch observability

This extension models branches' flows' observability on both sides, obtained after a state estimation.

| Attribute  | Type                 | Unit | Required | Default value | Description                                             |
|------------|----------------------|------|----------|---------------|---------------------------------------------------------|
| quality P1 | ObservabilityQuality | MW   | no       | -             | The observability quality of active power on side ONE   |
| quality P2 | ObservabilityQuality | MW   | no       | -             | The observability quality of active power on side TWO   |
| quality Q1 | ObservabilityQuality | MVar | no       | -             | The observability quality of reactive power on side ONE |
| quality Q2 | ObservabilityQuality | MVar | no       | -             | The observability quality of reactive power on side TWO |

**Observability quality**

This extension contains the sub-object `ObservabilityQuality`.

| Attribute          | Type    | Unit       | Required | Default value | Description                                        |
|--------------------|---------|------------|----------|---------------|----------------------------------------------------|
| standard deviation | double  | MW or MVar | yes      | -             | The standard deviation                             |
| redundant          | boolean | -          | yes      | -             | Indicates if this value is confirmed by redundancy |

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Branch status

This extension models the status of a connectable. The status could be `IN_OPERATION`, `PLANNED_OUTAGE` or `FORCED_OUTAGE`.

## Busbar section position

This extension gives positions information about a bus bar section. The `busBarIndex` gives the position of the bus bar section relatively to other bus bars. The `sectionIndex` gives the position of the bus bar section within the corresponding bus bar. Note that a bus bar is a set of bus bar sections. Hence, the sections of a same bus bar should have the same bus bar index. The bus bar indices induce an order of bus bars within the voltage level, which usually reflects the bus bars physical relative positions. Similarly, the section indices induce an order of sections of a same bus bar, which usually reflects their physical relative position.

## CIM-CGMES control areas

This extensions models all the control areas contained in the network as modeled in CIM-CGMES.

| Attribute           | Type                           | Unit | Required | Default value | Description                              |
|---------------------|--------------------------------|------|----------|---------------|------------------------------------------|
| CGMES control areas | `Collection<CgmesControlArea>` | -    | no       | -             | The list of control areas in the network |

**CGMES control area**

| Attribute                        | Type       | Unit | Required | Default value | Description                                         |
|----------------------------------|------------|------|----------|---------------|-----------------------------------------------------|
| ID                               | String     | -    | yes      | -             | The control area's ID                               |
| name                             | String     | -    | no       | -             | The control area's name                             |
| Energy Identification Code (EIC) | String     | -    | no       | -             | The control area's EIC                              |
| net interchange                  | double     | -    | no       | -             | The control area's net interchange (at its borders) |
| terminals                        | `Terminal` | -    | no       | -             | Terminals at the border of the control area         |
| boundaries                       | `Boundary` | -    | no       | -             | Boundaries at the border of the control area        |

It is possible to retrieve a control area by its ID. It is also possible to iterate through all control areas.

This extension is provided by the `com.powsybl:powsybl-cgmes-extensions` module.

## CIM-CGMES conversion context extension

This extension is used to store the CIM-CGMES conversion context as built during the CIM-CGMES import.
It contains the used configuration, the terminal mapping and the CIM-CGMES model.
It is provided by the `com.powsybl:powsybl-cgmes-conversion` module. It is not serializable.

## CIM-CGMES dangling line boundary node

This extension is used to add some CIM-CGMES characteristics to dangling lines.


| Attribute                             | Type    | Unit | Required | Default value | Description                                                       |
|---------------------------------------|---------|------|----------|---------------|-------------------------------------------------------------------|
| hvdc status                           | boolean | -    | no       | false         | Indicates if the boundary line is associated to a DC Xnode or not |
| Line Energy Identification Code (EIC) | String  | -    | no       | -             | The boundary line's EIC if it exists                              |                                                

This extension is provided by the `com.powsybl:powsybl-cgmes-extensions` module.

## CIM-CGMES line boundary node

This extension is used to add some CIM-CGMES characteristics to boundary lines.


| Attribute                             | Type    | Unit | Required | Default value | Description                                                       |
|---------------------------------------|---------|------|----------|---------------|-------------------------------------------------------------------|
| hvdc status                           | boolean | -    | no       | false         | Indicates if the boundary line is associated to a DC Xnode or not |
| Line Energy Identification Code (EIC) | String  | -    | no       | -             | The boundary line's EIC if it exists                              |

This extension is provided by the `com.powsybl:powsybl-cgmes-extensions` module.

## CIM-CGMES model extension

This extension is used to store the CGMES model as retrieved from the triplestore (as a query catalog) on the network.
It is provided by the `com.powsybl:powsybl-cgmes-conversion` module. It is not serializable.

## CIM-CGMES Tap Changers

<span style="color: red">TODO</span>

## CIM-CGMES SSH metadata

<span style="color: red">TODO</span>

## CIM-CGMES SV metadata

<span style="color: red">TODO</span>

## CIM characteristics

<span style="color: red">TODO</span>

## Connectable position

<span style="color: red">TODO</span>

## Coordinated reactive control

Some generators can be coordinated to control reactive power in a point of the network. This extension is used to configure the percent of reactive coordinated control that comes from a generator. This extension is attached to a [generator](index.md#generator).

| Attribute | Type            | Unit | Required | Default value | Description                                   |
|-----------|-----------------|------|----------|---------------|-----------------------------------------------|
| QPercent  | percent [0-100] | -    | yes      | -             | The reactive control percent of participation |

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

This is an extension dedicated to DC line in order to model AC emulation. For a VSC converter station operating in AC emulation, its active power setpoint is given by
$$P = P0 + k~(ph1 - ph2)$$  

| Attribute | Type    | Unit         | Required | Default value | Description                          |
|-----------|---------|--------------|----------|---------------|--------------------------------------|
| P0        | float   | MW           | yes      | -             | P0 in the equation                   |
| droop     | float   | MW by degree | yes      | -             | k in the equation                    |
| enabled   | boolean | -            | yes      | -             | if the AC emulation is active or not |

## HVDC operator active power range

This extension enables to replace the operational limits of an DC line in AC emulation. In that case, the VSC converter stations min active power and max active power are not used. 

## Generator ENTSO-E category

<span style="color: red">TODO</span>

## Generator short-circuit

This extension models the generators data used for short-circuit calculations. Depending on the type of short-circuit study to be 
performed, either the transient or the subtransient reactance should be filled. The reactance of the step-up transformer should be
filled if the generator has a transformer that is not directly modeled in the network.

| Attribute              | Type   | Unit | Required | Default value | Description                                    |
|------------------------|--------|------|----------|---------------|------------------------------------------------|
| directTransX (X'd)     | double | Ω    | yes      | -             | Direct transient reactance of the generator    |
| directSubtransX (X''d) | double | Ω    | no       | -             | Direct subtransient reactance of the generator |
| stepUpTransformerX     | double | Ω    | no       | -             | Reactance of the step-up transformer           |

This extension is provided in the  `com.powsybl:powsybl-iidm-extensions` module.

To add this extension to a generator, the code to be used is:
```java
generator.newExtension(GeneratorShortCircuitAdder.class)
    .withDirectTransX(20)
    .withDirectSubtransX(14)
    .withStepUpTransformerX(10)
    .add();
```

## Identifiable short-circuit

This extension models the maximum and minimum short-circuit current admissible for any identifiable.

| Attribute | Type   | Unit | Required | Default value | Description                    |
|-----------|--------|------|----------|---------------|--------------------------------|
| ipMin     | double | A    | no       | -             | The minimum admissible current |
| ipMax     | double | A    | yes      | -             | The maximum admissible current |

This extension is provided in the  `com.powsybl:powsybl-iidm-extensions` module.

To add this extension to a bus, for example, the code to be used is:
```java
bus.newExtension(IdentifiableShortCircuitAdder.class)
    .withIpMin(3000)
    .withIpMax(10000)
    .add();
```
The code is similar for every identifiable.

## Injection observability

This extension models injections' flows' observability, obtained after a state estimation.

| Attribute | Type                 | Unit | Required | Default value | Description                                 |
|-----------|----------------------|------|----------|---------------|---------------------------------------------|
| quality P | ObservabilityQuality | MW   | no       | -             | The observability quality of active power   |
| quality Q | ObservabilityQuality | MVar | no       | -             | The observability quality of reactive power |

**Observability quality**

This extension contains the sub-object `ObservabilityQuality`.

| Attribute          | Type    | Unit       | Required | Default value | Description                                       |
|--------------------|---------|------------|----------|---------------|---------------------------------------------------|
| standard deviation | double  | MW or MVar | yes      | -             | The standard deviation                            |
| redundant          | boolean | -          | yes      | -             | Indicates if the value is confirmed by redundancy |

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Load asymmetrical

A balanced load is described by its active power setpoint $$P0$$ and its reactive power setpoint $$Q0$$.
This extension is used to describe the power asymmetry for each ABC phase. In the three-phase representation, the complex power injected at a bus $$i$$ is constant for each phase and represented by three complex values:

$$
\begin{align}
S_{Ai_{Load}}=S_{A}=P_{A}+j.Q_{A} \\
S_{Bi_{Load}}=S_{B}=P_{B}+j.Q_{B} \\
S_{Ci_{Load}}=S_{C}=P_{C}+j.Q_{C} \\
\end{align}
$$

But for a balanced load flow, the constant power load $$P$$ and $$Q$$ refer to the positive sequence load. Given that, in balanced conditions, the load for zero and negative sequences should always be zero. However, in real life, power loads are better defined in the ABC three phases representation. The load extension addresses this issue keeping the default behavior for balanced conditions.

<u>Balanced load flow conditions:</u>

In balanced conditions given the load at bus:

$$ S_{1i_{Load}}=P_{Load}+j.Q_{Load} $$

We must verify:  

$$ 0 = -S_{1i_{Load}} +\sum_{j=v(i)}^{} S_{1ij} $$

<u>Unbalanced load flow conditions:</u>

We must take into account that many loads are still balanced and information related to balanced loads is sufficient. The extension proposes a delta approach where unbalances are expressed in the extension. Supposing that:

$$
\begin{align}
\Delta P_{Ai_{Load}}, \Delta Q_{Ai_{Load}},
\Delta P_{Bi_{Load}}, \Delta Q_{Bi_{Load}},
\Delta P_{Ci_{Load}}, \Delta Q_{Ci_{Load}}
\end{align}
$$

are provided in input through the extension. The three-phase power values used as inputs of an unbalanced load flow calculation are:

$$
\begin{align}
S_{Ai_{Load}}=(P_{Load}+\Delta P_{Ai_{Load}})+j.(Q_{Load}+\Delta Q_{Ai_{Load}}) \\
S_{Bi_{Load}}=(P_{Load}+\Delta P_{Bi_{Load}})+j.(Q_{Load}+\Delta Q_{Bi_{Load}}) \\
S_{Ci_{Load}}=(P_{Load}+\Delta P_{Ci_{Load}})+j.(Q_{Load}+\Delta Q_{Ci_{Load}}) \\
\end{align}
$$

As a consequence, if no extension provided for the load, the unbalanced load flow will use in input:

$$
\begin{align}
S_{Ai_{Load}}=P_{Load}+j.Q_{Load} \\
S_{Bi_{Load}}=P_{Load}+j.Q_{Load} \\
S_{Ci_{Load}}=P_{Load}+j.Q_{Load} \\
\end{align}
$$

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| deltaPa | double | MW | No | 0 | The unbalanced part of the active power setpoint at phase A (balanced parts for each phase are described by its active power setpoint $$P0$$ and its reactive power setpoint $$Q0$$) |
| deltaQa | double | MVar | No | 0 | The unbalanced part of the reactive power setpoint at phase A |
| deltaPb | double | MW | No | 0 | The unbalanced part of the active power setpoint at phase B |
| deltaQb | double | MVar | No | 0 | The unbalanced part of the reactive power setpoint at phase B |
| deltaPc | double | MW | No | 0 | The unbalanced part of the active power setpoint at phase C |
| deltaQc | double | MVar | No | 0 | The unbalanced part of the reactive power setpoint at phase C |

Here is how to add a load detail extension to a load:
```java
load.newExtension(LoadAsymmetricalAdder.class)
        .withDeltaPa(-1)
        .withDeltaQa(1)
        .withDeltaPb(-2)
        .withDeltaQc(2)
        .add();
```

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Load detail
A load is described by its active power setpoint $$P0$$ and its reactive power setpoint $$Q0$$. This extension is used to detail :
- In the total amount of active power what is fixed and what is time-dependant (also called variable). The time-dependant part can be adjusted for production equals consumption.
- In the total amount of reactive power what is fixed and what is time-dependant (also called variable).

| Attribute             | Type   | Unit | Required | Default value | Description                                                         |
|-----------------------|--------|------|----------|---------------|---------------------------------------------------------------------|
| variableActivePower   | double | MW   | yes      | -             | The part of the active power setpoint that is considered variable   |
| fixedActivePower      | double | MW   | yes      | -             | The part of the active power setpoint that is considered constant   |
| variableReactivePower | double | MVar | yes      | -             | The part of the reactive power setpoint that is considered variable |
| fixedReactivePower    | double | MVar | yes      | -             | The part of the reactive power setpoint that is considered constant |

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

This extensions is used for generators with a remote reactive control.

| Attribute          | Type       | Unit | Required | Default value | Description                                        |
|--------------------|------------|------|----------|---------------|----------------------------------------------------|
| enabled            | boolean    | -    | yes      | -             | If the reactive remote control is activated of not |
| targetQ            | double     | MVar | yes      | -             | The targetQ at remote regulating terminal          |
| regulatingTerminal | `Terminal` | -    | yes      | -             | The regulating terminal                            |

## Slack terminal

This extension is attached to a [voltage level](index.md#voltage-level) and is used to define the slack bus of a power flow calculation i.e. which bus will be used to balance the active and reactive power in load flow analysis. Use this extension before a computation to force the slack bus selection. You should enable default load flow parameter [`isReadSlackBus`](../../simulation/powerflow/index.md#available-parameters). Use this extension after a computation to attach to the network the slack bus that has been selected by the load flow engine (one by connected component). You should enable default load flow parameter [`isWriteSlackBus`](../../simulation/powerflow/index.md#available-parameters).

The slack bus is defined through the terminal of a connectable that belongs to the bus. It is totally allowed to define a disconnected terminal as slack as the connectable could be reconnected during a grid study.

| Attribute | Type       | Unit | Required | Default value | Description        |
|-----------|------------|------|----------|---------------|--------------------|
| Terminal  | `Terminal` | -    | yes      | -             | The slack terminal |

 ```java
SlackTerminal.attach(bus);
```

This extension is provided by the `com.powsybl:powsybl-iidm-api` module.

## Three-windings transformer phase angle clock

This extension is used to model the Vector Group of a three windings transformer. The phase angle clock could be modeled at leg 2, leg 3 or both legs 2 and 3 and of a three windings transformer (network side). The voltage phase angle displacement is represented with clock hours. The valid values are `0` to `11`. This extension is attached to a [three windings transformer](index.md#three-windings-transformer).

| Attribute           | Type       | Unit  | Required | Default value | Description                                   |
|---------------------|------------|-------|----------|---------------|-----------------------------------------------|
| PhaseAngleClockLeg2 | int [0-11] | hours | yes      | -             | The voltage phase angle displacement at leg 2 |
| PhaseAngleClockLeg3 | int [0-11] | hours | yes      | -             | The voltage phase angle displacement at leg 3 |

```java
transformer.newExtension(ThreeWindingsTransformerPhaseAngleClock.class)
    .withPhaseAngleClockLeg2(10)
    .withPhaseAngleClockLeg3(1)
    .add();
```

This extension is provided by the `com.powsybl:powsybl-iidm-extensions` module.

## Three-windings transformer to be estimated

This extension is used to indicate if a three-winding transformer tap changer is to be estimated during a state estimation, i.e. if its tap position should be an output of the state estimation.
* The three-winding transformer model offers the possibility to have up to 3 ratio tap changers and up to 3 phase tap changers. Each tap changer can be estimated or not.
* If a tap changer is not to be estimated, it should not be changed during a state estimation (its tap position is merely an input of the state estimation).

| Attribute | Type   | Unit | Required | Default value                         | Description           |
|-----------|--------|------|----------|---------------------------------------|-----------------------|
| NAME      | String | -    | yes      | threeWindingsTransformerToBeEstimated | Name of the extension |

Example of code to get the status of the n°1 phase tap changer:

```java
3wt.getExtension(ThreeWindingsTransformerToBeEstimated.class).shouldEstimatePhaseTapChanger1();
```

This extension is provided in the module `com.powsybl:powsybl-iidm-extensions`.

When adding the extension, the ThreeWindingsTransformerToBeEstimatedAdder extension should be used.

Example of code to add the extension:

```java
transformer.newExtension(ThreeWindingsTransformerToBeEstimatedAdder.class)
        .withRatioTapChanger1Status(true)
        .add();
```


## Two-windings transformer phase angle clock

This extension is used to model the Vector Group of a two windings transformer. The phase angle clock is modeled at side 2 of a two windings transformer. The voltage phase angle displacement is represented with clock hours. The valid values are 0 to 11. This extension is attached to a [two windings transformer](index.md#two-windings-transformer).

| Attribute       | Type       | Unit  | Required | Default value | Description                          |
|-----------------|------------|-------|----------|---------------|--------------------------------------|
| PhaseAngleClock | int [0-11] | hours | yes      | -             | The voltage phase angle displacement |

```java
transformer.newExtension(TwoWindingsTransformerPhaseAngleClockAdder.class)
    .withPhaseAngleClock(3)
    .add();
```

This extension is provided in the module `com.powsybl:powsybl-iidm-extensions`.

## Two-windings transformer to be estimated

This extension is used to indicate if a two-winding transformer tap changer is to be estimated during a state estimation, i.e. if its tap position should be an output of the state estimation.
* A two-winding transformer has a ratio tap changer and/or a phase tap changer. Each tap changer can be estimated or not.
* If a tap changer is not to be estimated, it should not be changed during a state estimation (its tap position is merely an input of the state estimation).

| Attribute | Type   | Unit | Required | Default value                       | Description           |
|-----------|--------|------|----------|-------------------------------------|-----------------------|
| NAME      | String | -    | yes      | twoWindingsTransformerToBeEstimated | Name of the extension |

Example of code to get the status of the ratio tap changer:

```java
2wt.getExtension(TwoWindingsTransformerToBeEstimated.class).shouldEstimateRatioTapChanger();
```

This extension is provided in the module `com.powsybl:powsybl-iidm-extensions`.

When adding the extension, the TwoWindingsTransformerToBeEstimatedAdder extension should be used.

Example of code to add the extension:

Example of code:

```java
transformer.newExtension(TwoWindingsTransformerToBeEstimatedAdder.class)
        .withPhaseTapChangerStatus(true)
        .add();
```

## Voltage per reactive power control

This extension is used to model voltage control of static VAR compensators. This extension is attached to a [static VAR compensator](index.md#static-var-compensator).

| Attribute | Type   | Unit        | Required | Default value | Description                                                   |
|-----------|--------|-------------|----------|---------------|---------------------------------------------------------------|
| Slope     | double | kV per MVar | yes      | -             | The sensibility of the voltage with respect to reactive power |

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
