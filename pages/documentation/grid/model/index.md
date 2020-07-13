---
layout: default
latex: true
---

# Grid model

* TOC
{:toc}

- <span style="color:red"> TODO: put all the current Table in the corresponding javadoc pages.</span>
- <span style="color:red"> TODO: only keep electrotech/regulation/etc. information in this page (not code-oriented information).</span>

## Introduction

In this page the different network components are described in terms of electrotechnical representation.
Each component is identified through a unique ID, and optionally by a name that is easier to interpret for a human.
Note that the equipments in the IIDM model may be flagged as fictitious, in order to fine tune the network modelling.
<span style="color:red"> TODO: complete me.</span>
<span style="color:red"> TODO: when we have aliases, add a description here too.</span>

## Network core model

### Network [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Network.html)

In IIDM, the network is constituted of [substations](#substation), which are themselves constituted of [voltage levels](#voltage-level).
All the equipments are then connected to the voltage levels.
The network comprises metadata in IIDM: 
- a case date: the date and time of the target network that is being modelled
- a forecast distance: the number of minutes between the network generation date and the case date

**Available extensions**

- [CGMES conversion context extension]()
- [CGMES model extension]()

### Substation [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Substation.html)

A substation in IIDM represents a specific geographical location with a set of equipments connected to one or several [voltage levels](#voltage-level).
It comprises metadata in IIDM:
- a country: to specify in which country the substation is located. It is an optional attribute, not set on fictitious test networks for example.
- a set of geographical tags: they make it possible to accurately locate the substation
- a [TSO](/pages/glossary.md#tso) information: to track to which TSO the substation belongs

**Available extensions**

- [ENTSOE Area]()

### Voltage Level [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/VoltageLevel.html)

A voltage level in IIDM represents a set of equipments connected together with the same nominal voltage, physically close to each other (~ 1-100m).
Two voltage levels may be connected through a line (they are then located in different substations) or through transformers (they are then located within
the same substation).

A voltage level in IIDM comprises some metadata:
- a nominal voltage (in $$kV$$)
- a low voltage limit and a high voltage limit (in $$kV$$): they are both optional metadata. The voltage should always remain within these bounds, otherwise it means that the equipments will suffer extra wear compared to
their normal use
- a topology information: indicates whether the voltage level is described in [node/breaker]() or [bus/breaker]() view

#### Node/breaker topology
<span style="color:red"> TODO: explain the topology.</span>

In node/breaker topology, the voltage level is described with the finest level of detail. See the sketch below for an example.
<span style="color:red"> TODO: add sketch of voltage level.</span>
The topology is then described as a graph structure, where busbar sections, injections or branches are connected to the vertices.
When an equipment is connected to a vertex, in the IIDM descrition it corresponds to a `Terminal` object.
It is not possible to connect two equipments on the same vertex.
The edges are constituted of switches or internal connections. See the following sketch corresponding to the previous example:
<span style="color:red"> TODO: add sketch of voltage level topology graph.</span>


**Busbar section**  [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/BusbarSection.html)<br>
A busbar section is a non impedant element used in a node/breaker substation topology to connect equipments.

**Switch**  [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Switch.html)<br>
<span style="color:red"> TODO</span>

**Internal connection**  
An internal connection is a non-impedant connection between two components in a voltage level.

#### Bus/breaker topology
In bus/breaker topology, the voltage level is described with a coarser level of detail. See the sketch below for an example.
<span style="color:red"> TODO: add sketch of voltage level in bus/breaker topology.</span>
The topology is then described as a graph structure, where the vertices are buses and the edges are switches.

**Bus**  [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Bus.html)<br>
A bus is a set of equipments connected at the same voltage.
When an equipment is connected to a bus, in the IIDM descrition it corresponds to a `Terminal` object.
In IIDM there is thus one `Terminal` per connected equipment.

**Switch**  [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Switch.html)<br>
<span style="color:red"> TODO: explain the difference with node/breaker switches</span>

### Injections

An injection in IIDM is any AC equipment with a single connection point to a voltage level.
Below are the different types of injections supported by PowSyBl.

#### Generator [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Generator.html)

A generator is an active equipment that injects active power, and injects or consumes reactive power. 
It may be controlled to hold a voltage or reactive setpoint somewhere in the network (not necessarily directly where it is connected).
More details about this behavior, which is called regulation, are available [here](#voltage-regulation).

<span style="color:red"> TODO: add a sketch where the sign convention is indicated.</span>

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$MinP$$ | MW | The minimal active power |
| $$MaxP$$ | MW | The maximum active power |
| $$TargetP$$ | MW | The active power target |
| $$TargetQ$$ | MVAr | The reactive power target |
| $$TargetV$$ | kV | The voltage target |
| $$RatedS$$ | MVA | The rated nominal power |
| $$ReactiveLimits$$ | - | Operational limits of the generator (P/Q/U diagram) |

**Specifications**
- The minimal active power (in $$MW$$), expected to be lower than the maximal active power. The target $$P$$ is necessarily comprised between the two.
- Setpoints for generators ($$targetV$$, $$targetP$$ and $$targetQ$$):
    - They follow the generator sign convention: a positive value of $$targetP$$ means an injection into the bus.
    - A positive value for the $$targetP$$ and the $$targetQ$$ means a negative value at the corresponding terminal (which is in passive-sign convention).
- A set of reactive limits can be associated to a generator. All the reactive limits modelings available in the library are described [here](#reactive-limits).
- the rated nominal power (MVA)
<span style="color:red"> TODO: explain what it is.</span>

<span style="color:red"> TODO: add a link to the future Regulation section.</span>

- Either the generator is regulating the voltage, and the voltage setpoint is required, or it is not regulating and the reactive power setpoint is required instead.

**Metadata**    
A generator in IIDM comprises some metadata:
- the energy source, which can be:
    - `HYDRO`
    - `NUCLEAR`
    - `WIND`
    - `THERMAL`
    - `SOLAR`
    - `OTHER`
- The participation to regulation (through a boolean)
- The regulating terminal, which can be local or remote: it is the specific connection point on the network where the setpoint is measured.

**Available extensions**

- [Active Power Control]()
- [Coordinated Reactive Control]()

#### Load [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Load.html)

A load is a passive equipment representing a delivery point that consumes active and reactive power.

<span style="color:red"> TODO: add a sketch where the sign convention is indicated.</span>

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$P0$$ | MW | The active power setpoint |
| $$Q0$$ | MVar | The reactive power setpoint |

**Specifications**

- Initial values for loads P0 and Q0 follow the passive-sign convention:
    - Flow out from the bus has a positive sign.
    - Consumptions are positive.

**Metadata**
In IIDM, loads comprise the following metadata:
- The load type, which can be:
    - `UNDEFINED`
    - `AUXILIARY`
    - `FICTITIOUS`

#### Battery [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Battery.html)

A battery on the electric grid is an energy storage device that is either capable of capturing energy from the grid or of injecting it into the grid. The electric energy on the grid side is thus transformed into chemical energy on the battery side and vice versa. The power flow is bidirectional and it is controlled via a power electronic converter.

<span style="color:red"> TODO: add a sketch.</span>

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$P0$$ | MW | The Constant active power |
| $$Q0$$ | MVar | The Constant reactive power |
| $$MinP$$ | MW | The Minimal active power |
| $$MaxP$$ | MW | The Maximum active power |

<span style="color:red"> TODO: add link to the Regulation section when it exists.</span>

**Available extensions**

- [Active Power Control]()

#### Dangling Line [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/DanglingLine.html)

The IIDM network may be connected to other networks for which a full description is not available.
In this case, a boundary line exists between the two networks. In the IIDM model of the fully described network,
that connection is represented through a dangling line, which represents the part of that boundary line which is known.
A dangling line is thus a passive or active component that aggregates a line chunk and a constant power injection, in passive-sign convention.
The active and reactive power setpoints are fixed: the injection represents the power flow that would occur through the connection, were the other
network fully described.

<span style="color:red"> TODO: add a sketch with the sign convention.</span>
<span style="color:red"> TODO: add a link to the Merging documentation.</span>

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$P0$$ | MW | The active power setpoint |
| $$Q0$$ | MVar | The reactive power setpoint |
| $$R$$ | $$\Omega\$$ | The series resistance |
| $$X$$ | $$\Omega\$$ | The series reactance |
| $$G$$ | S | The shunt conductance |
| $$B$$ | S | The shunt susceptance |

**Specifications**

- $$P0$$ and $$Q0$$ are the active and reactive power setpoints
- $$R$$, $$X$$, $$G$$ and $$B$$ correspond to a fraction of the original line and have to be consistent with the declared length of the
dangling line.

In case the line is a boundary, a UCTE Xnode code is defined besides the characteristics of the Table. See the [UCTE-DEF](../importer/ucte.md) documentation
page to learn more about this format. This code is actually related to ENTSOE, not only UCTE: it is a key to match two dangling lines and reconstruct the full boundary line.


**Available extensions**

- [Xnode]()

#### Shunt Compensator [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/ShuntCompensator.html)

<span style="color:red"> TODO: add a description.</span>
<span style="color:red"> TODO: add a sketch with the sign convention.</span>
<span style="color:red"> TODO: explain that there are two shunt models: linear and non-linear.</span>
Shunt compensators follow a passive-sign convention:
  - Flow out from bus has positive sign.
  - Consumptions are positive.

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- |------------ |
| $$bPerSection$$ | S | The Positive sequence shunt (charging) susceptance per section |
| $$MaximumSectionCount$$ | - | The maximum number of sections that may be switched on |
| $$CurrentSectionCount$$ | - | The current number of section that may be switched on |
| $$TargetV$$ | kV | The voltage target |
| $$TargetDeadband$$ | kV | The deadband used to avoid excessive update of controls |

<span style="color:red"> TODO: redo the Table and specifications to be up to date with Miora's work.</span>

**Specifications**

- A section of a shunt compensator is an individual capacitor or reactor.
A value of bPerSection positive means it is modeling a capacitor, an equipment that injects reactive
power into the bus.
A value of bPerSection negative means a reactor, an equipment that can absorb excess reactive power
from the network.
- The current section count is expected to be greater than one and lesser or equal to the maximum section count.
- Regulation for shunt compensators does not necessarily model automation, it can represent human actions on the network
e.g. an operator activating or deactivating a shunt compensator). However, it can of course be integrated on a power flow
calculation or not, depending of what is wanted to be shown.
- In case of a capacitor, the value for its Q will be negative.
- In case of a reactor, the value for its Q will be positive.

#### Static VAR Compensator [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/StaticVarCompensator.html)

<span style="color:red"> TODO: add a description with sign convention.</span>
<span style="color:red"> TODO: add a sketch with the sign convention.</span>
<span style="color:red"> TODO: add a link to the regulation.</span>
It may be controlled to hold a voltage or reactive setpoint somewhere in the network (not necessarily directly where it is connected).
More details about this behavior, which is called regulation, are available [here](#voltage-regulation).

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$Bmin$$ | S | The minimum susceptance |
| $$Bmax$$ | S | The maximum susceptance |
| $$VoltageSetpoint$$ | kV | The voltage setpoint |
| $$ReactivePowerSetpoint$$ | MVar | The reactive power setpoint |

**Specifications**

- $$Bmin$$ and $$Bmax$$ are the susceptance bounds of the static VAR compensator
<span style="color:red"> TODO: add the equation that links $$B$$ to $$Q$$, and say that $$B$$ has to be comprised between the bounds.</span>
- The voltage setpoint is required when the regulation mode is set to `VOLTAGE`.
- The reactive power setpoint is required when the regulation mode is set to `REACTIVE_POWER`.

**Metadata**
In IIDM the static VAR compensator also comprises some metadata:

- The regulation mode, which can be:
    - `VOLTAGE`
    - `REACTIVE_POWER`
    - `OFF`
Note that it is different than the generators' regulation definition, which is only done through a boolean.
- The regulating terminal, which can be local or remote: it is the specific connection point on the network where the setpoint is measured.

### Branches

A branch in IIDM Grid model is any AC equipment with two or more connection points to the network.
Below are the different types of branches supported by PowSyBl.

#### Line [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Line.html)

AC Power lines are modeled using a standard $$\pi$$ model with distributed parameters.

![Power line model](img/index/line-model.svg){: width="50%" .center-image}

With series impedance $$z$$ and the shunt admittance on each side $$y_1$$ and $$y_2$$:

$$
\begin{align*}
  \begin{array}{lcl}
    z & = & r+j.x\\
    y_1 & = & g_1 +j. b_1\\
    y_2 & = & g_2 +j. b_2
  \end{array}
\end{align*}
$$

The equations of the power line, in complex notations, are as follow:

$$
\begin{align*}
    & \left(\begin{array}{c}
    I_{1}\\
    I_{2}
    \end{array}\right)=\left(\begin{array}{cc}
    y_{1}+\frac{1}{z} & -\frac{1}{z}\\
    -\frac{1}{z} & y_{2}+\frac{1}{z}
    \end{array}\right)\left(\begin{array}{c}
    V_{1}\\
    V_{2}
    \end{array}\right)
\end{align*}
$$

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$R$$ | $$\Omega\$$ | The series resistance |
| $$X$$ | $$\Omega\$$ | The series reactance |
| $$G1$$ | S | The first side shunt conductance |
| $$B1$$ | S | The first side shunt susceptance |
| $$G2$$ | S | The second side shunt conductance |
| $$B2$$ | S | The second side shunt susceptance |

**Metadata**

- Lines can have [current limits](#current-limits)

**Available extensions**

- [Merged Xnode]()

##### Tie Line [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/TieLine.html)

A tie line is an AC line sharing power between two neighbouring regional grids. It is constituted of two [half lines](#half-line).
A tie line is created by matching two [dangling lines](#dangling-line) with the same Xnode code.
It has line characteristics, with $$R$$ (resp. $$X$$) being the sum of the series resistances (resp. reactances) of the two half lines.
$$G1$$ (resp. $$B1$$) is equal to the sum of the first half line's $$G1$$ and $$G2$$ (resp. $$B1$$ and $$B2$$).
$$G2$$ (resp. $$B2$$) is equal to the sum of the second half line's $$G1$$ and $$G2$$ (resp. $$B1$$ and $$B2$$).

###### Half Line

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$R$$ | $$\Omega\$$ | The series resistance |
| $$X$$ | $$\Omega\$$ | The series reactance |
| $$G1$$ | S | The first side shunt conductance |
| $$B1$$ | S | The first side shunt susceptance |
| $$G2$$ | S | The second side shunt conductance |
| $$B2$$ | S | The second side shunt susceptance |

<span style="color:red"> TODO: describe xnodeP and xnodeQ in the java doc and here with a sentence.</span>

#### Transformers

<span style="color:red"> TODO: CONTINUE FROM HERE. THE TABLES HAVE ALREADY BEEN COPIED TO THE JAVADOC.</span>

##### Three windings transformer [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/ThreeWindingsTransformer.html)

A three windings power transformer is connected to three voltage levels (side 1, side 2 and side 3) that belong to the
same substation. We usually have:
- Side 1 as the primary side (side with highest rated voltage)
- Side 2 as the secondary side (side with the medium rated voltage)
- Side 3 as the tertiary side (side with the lowest rated voltage)

A three windings transformer is modeled with three legs, where every leg model is electrically equivalent to a two windings transformer.
For each leg, the network bus is at side 1 and the star bus is at side 2.

![Power line model](img/index/three-windings-transformer-model.svg){: width="50%" .center-image}

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| RatedU0 | kV | The rated voltage at the star bus |
| Leg1 | - | The leg at the primary side |
| Leg2 | - | The leg at the secondary side |
| Leg3 | - | getId()The leg at the tertiary side |

**Specifications**

- A Ratio Tap Changer and/or a Phase Tap Changer can be associated to all three sides of a three windings power transformer.
Only one Tap Changer (either ratio or phase tap changer) is allowed to be regulating on the equipment at a given time.

**Available extensions**

- [Phase Angle Clock]()

###### Leg

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$R$$ | $$\Omega\$$ | The nominal series resistance specified at the voltage of the leg |
| $$X$$ | $$\Omega\$$ | The nominal series reactance specified at the voltage of the leg |
| $$G$$ | S | The nominal magnetizing conductance specified at the voltage of the leg |
| $$B$$ | S | The nominal magnetizing susceptance specified at the voltage of the leg |
| $$RatedU$$ | kV | The rated voltage |
| $$RatedS$$ | MVA | The normal apparent power |

**Specifications**

- A leg can have current limits.

##### Two windings transformer [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/TwoWindingsTransformer.html)

A two windings power transformer is connected to two voltage levels (side 1 and side 2) that belong to a same substation.

Two windings transformer are modeled with the following equivalent $$\pi$$ model:

![Power line model](img/index/two-windings-transformer-model.svg){: width="50%" .center-image}

With the series impedance $$z$$ and the shunt admittance $$y$$ and the voltage ratio $$\rho$$ and the angle difference $$\alpha$$ and potentially parameters from the current step of a ratio tap changer and/or a phase tap changer, we have:

$$
\begin{align*}
    r=r_{nom}.\left(1+\frac{r_{r, tap} + r_{\phi, tap}}{100}\right)\\
    x=x_{nom}.\left(1+\frac{x_{r, tap} + x_{\phi, tap}}{100}\right)\\
    g=g_{nom}.\left(1+\frac{g_{r, tap} + g_{\phi, tap}}{100}\right)\\
    b=b_{nom}.\left(1+\frac{b_{r, tap} + b_{\phi, tap}}{100}\right)\\
    \rho=\frac{V_{2nom}}{V_{1nom}}.\rho_{r, tap}.\rho_{\phi, tap}\\
    \alpha=\alpha_{\phi, tap}\\
    z=r+j.x\\
    y=g+j.b\\
    V_{0}=V_{1}.\rho e^{j\alpha}\\
    I_{0}=\frac{I_{1}}{\rho e^{-j\alpha}}\\
\end{align*}
$$

Using the above notation, the equations of the two windings transformer, in complex notations, are as follow:

$$
\left(\begin{array}{c}
I_{1}\\
I_{2}
\end{array}\right)=\left(\begin{array}{cc}
\rho\text{²}(y+\frac{1}{z}) & -\rho e^{-j\alpha}\frac{1}{z}\\
-\rho e^{j\alpha}\frac{1}{z} & \frac{1}{z}
\end{array}\right)\left(\begin{array}{c}
V_{1}\\
V_{2}
\end{array}\right)
$$

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$R_{nom}$$ | $$\Omega$$  | The nominal series resistance at the side 2 of the transformer |
| $$X_{nom}$$ | $$\Omega$$ | The nominal series reactance at the side 2 of the transformer |
| $$G_{nom}$$ | S | The nominal magnetizing conductance at the side 2 of the transformer |
| $$B_{nom}$$ | S | The nominal magnetizing susceptance at the side 2 of the transformer |
| $$V_{1\ nom}$$ | kV | The rated voltage at side 1 |
| $$V_{2\ nom}$$ | kV | The rated voltage at side 2 |
| $$RatedS$$ | MVA | The normal apparent power |

**Specifications**

- A Ratio tap changer and/or a Phase tap changer can be associated with a two windings power transformer.
- For a two windings transformer, the normal apparent power shall be identical at both sides 1 and 2.

**Available extensions**

- [Phase Angle Clock]()

### DC components

#### HVDC Line [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/HvdcLine.html)

An HVDC line is connected to the DC side of two HVDC converter stations.

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$R$$ | double | $$\Omega\$$ | The resistance of the HVDC line |
| $$NominalV$$ | double | kV | The nominal voltage |
| $$ActivePowerSetpoint$$ | MW | The active power setpoint |
| $$MaxP$$ | MW | The maximum active power |

**Specifications**

- The `ConvertersMode` can be:
    - `SIDE_1_RECTIFIER_SIDE_2_INVERTER`
    - `SIDE_1_INVERTER_SIDE_2_RECTIFIER`
- The active power setpoint and the maximum active power should always be positive values. The flow sign is given by the type of the converter station. Power always flows from rectifier converter station to inverter converter station. At a terminal on AC side, P and Q follow load sign convention. P is positive on rectifier side. P is negative at inverter side.

#### LCC Converter Station [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/LccConverterStation.html)

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| PowerFactor | - | The power factor |

**Specifications**

- The PowerFactor is equal to
$$
\frac{P}{\sqrt{P^{2} + Q^{2}}}
$$
and should be between -1 and 1. Note that at terminal on AC side, Q is always positive: the converter station always consumes reactive power.


#### VSC Converter Station [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/VscConverterStation.html)

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| VoltageRegulatorOn | boolean | - | yes | - | The voltage regulator status |
| VoltageSetpoint | double | kV | only if `VoltageRegulatorOn` is set to `true` | - | The voltage setpoint |
| ReactivePowerSetpoint | double | MVar | only if `VoltageRegulatorOn` is set to `false` | - | The reactive power setpoint |

**Specifications**

- The voltage setpoint (in kV) is required if the voltage regulator is on.
- The reactive power setpoint (in MVar) is required if the voltage regulator is off.
- A set of reactive limits can be associated to a VSC converter station. All the reactive limits modelings available in the library are described [here](reactiveLimits.md).

## Additional network models

<span style="color:red"> TODO</span>

### Reactive limits [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/ReactiveLimits.html)

<span style="color:red"> TODO</span>

### Current limits [![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/CurrentLimits.html)

<span style="color:red"> TODO</span>

### Voltage regulation

<span style="color:red"> TODO</span>

## Going further

- [How to create your own IIDM network]()


------

**TODO**

Cette section explique la moThe voltage setpoint is required when the regulation mode is set to VOLTAGE.
The reactive power setpoint is required when the regulation mode is set to REACTIVE_POWER.
délisation IIDM (caractéristique, equations, schémas) et les services offerts:
- Topologie
    - parler des switches, bus et internal connections
- Vues
- Composantes connexes / synchrones
- Extensions
