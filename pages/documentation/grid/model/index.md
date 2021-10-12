---
layout: default
latex: true
---

# Grid model

* TOC
{:toc}

## Introduction

PowSyBl uses an internal grid model initially developed under the iTesla project, a research project funded by the [European Union 7th Framework programme](https://cordis.europa.eu/project/id/283012) (FP7). The grid model is known as IIDM (iTesla Internal Data Model). One of the iTesla outputs was a toolbox designed to support the decision-making process of power system operation from two-days ahead to real time. The IIDM grid model was at the center of the toolbox.

To build an electrical network model using IIDM first the substations must be defined. The equipment in a substation (loads, generators, shunts, static VAR compensators, DC converters ...) are grouped in voltage levels. Transformers present in a substation connect its different voltage levels. Transmission lines (AC and DC) connect the substations.

The PowSyBl grid model allows a full representation of the substation connectivity where all the switching devices and busbars are defined (node/breaker level). Automated topology calculation permits obtaining views of the network up to the bus/branch level.

Different states of the network can be stored together with the power system model efficiently. The set of attributes that define a given state of the network (steady state hypothesis and state variables) are collectively organized in variants. The user can create and remove variants as needed. Setting and getting variant dependent attributes on network objects use the current variant.

A set of PowSyBl networks can be merged together in a single network view, and sub-parts of the network model can be easily extracted as separate networks.

All elements modeled in the network are identified through a unique ID, and optionally described by a name that is easier to interpret for a human. All components can be [extended](extensions.md) by the user to incorporate additional structured data.

## Network core model

In the following sections the different network components are described in terms of its main attributes and electro-technical representation. The attributes shared by all the network components are described in the next table:

| Attribute | Description |
| --------- | ----------- |
| $$Id$$ | Unique Id assigned to each network component |
| $$Name$$ | Human readable identifier (not necessary unique) |
| $$Fictitious$$ | To identify non-physical network components |
| $$Aliases$$ | Additional unique identifiers associated with each network component |
| $$Properties$$ | To add additional data items to network components |

All equipment and the network itself are identified by a unique identifier which is the only required attribute. They can have a human readable name. offer the possibility of adding additional unique identifiers to each component. An alias can be qualified to indicate what it corresponds to.

Properties allow associating additional arbitrary data items under the general schema of pairs `<Key, Value>`.

To identify non-physical network components, one can use the fictitious property that is set to `false` by default.

### Network
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Network.html)

In the PowSyBl grid model, the Network contains [substations](#substation), which themselves contain [voltage levels](#voltage-level).

| Attribute | Description |
| --------- | ----------- |
| $$SourceFormat$$ | Source format of the imported network model |
| $$CaseDate$$ | Date and time of the target network that is being modeled |
| $$ForecastDistance$$ | Number of minutes between the network generation date and the case date |

The `SourceFormat` attribute is a required attribute that indicates the origin of the network model automatically set by the [importers](../../index.html#grid-formats). If the case date and the forecast distance cannot be found in the case file, the network is considered as a snapshot: the case date is set to the current date, and the forecast distance is set to `0`.

### Substation
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Substation.html)

A substation represents a specific geographical location with equipment grouped in one or several [voltage levels](#voltage-level).

| Attribute | Description |
| --------- | ----------- |
| $$Country$$ | To specify in which country the substation is located |
| $$GeographicalTags$$ | They make it possible to accurately locate the substation |
| $$TSO$$ | To track to which [TSO](../../glossary.md#tso) the substation belongs |

All three attributes are optional.

### Voltage Level
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/VoltageLevel.html)

A voltage level contains equipment with the same nominal voltage.
Two voltage levels may be connected through lines (when they belong to different substations) or through transformers (they must be located within the same substation).

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$NominalVoltage$$ | kV | Nominal base voltage |
| $$LowVoltageLimit$$ | kV | Low voltage limit magnitude |
| $$HighVoltageLimit$$ | kV | High voltage limit magnitude |
| $$TopologyKind$$ |  | Level of connectivity detail |

Only `NominalVoltage` and `TopologyKind` are required.

The connectivity in each voltage level of the network can be defined at one of two levels: `node/breaker` or `bus/breaker`. The connectivity level can be different in each voltage level of the model.

In `node/breaker` the connectivity is described with the finest level of detail and can provide an exact field representation. This level could be described as a graph structure where the vertices are `Nodes` and the edges are `Switches` (breakers, disconnectors) or internal connections. Each equipment is associated to one `Node` (busbar sections, loads, generators, ..), two `Nodes` (transmission lines, two-windings transformers, ...) or three `Nodes` (three-windings transformers). Each `Node` can only have one associated equipment. `Nodes` do not have an alphanumeric `Id` or `Name`, they are identified by an integer.

Using `bus/breaker` the voltage level connectivity is described with a coarser level of detail. In this case the vertices of the graph are `Buses`, defined explicitly by the user. A `Bus` has an `Id`, and may have a `Name`. Each equipment defines the bus or buses to which it is connected. `Switches` can be defined between buses.

PowSyBl provides an integrated topology processor that allows to automatically obtain a bus/breaker view from a node/breaker definition, and a bus/branch view from a bus/breaker view or definition. It builds the topology views from the open/close status of `Switches`. `Switches` marked as `retained` in the node/breaker level are preserved in the bus/breaker view.

The following diagram represents an example voltage level with two busbars separated by a circuit breaker, a transformer connected to one of them and three generators that can connect to any of the two busbars. The three topology levels are shown.

![VoltageLevel](img/index/voltage-level.svg){: width="100%" .center-image}

When defining the model, the user has to specify how the different equipment connect to the network. If the voltage level is built at node/breaker level, the user has to specify a `Node` when adding equipment to the model. If the user is building using bus/breaker level, the `Bus` of the equipment must be specified. Using this information, the model creates a `Terminal` that will be used to manage the point of connection of the equipment to the network.

**Available extensions**

The [Slack Terminal](extensions.md#slack-terminal) extension defines the `Terminal` marking which bus will be used to balance the active and reactive power in load flow analysis.

### Generator
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Generator.html)

A generator is an active equipment that injects active power, and injects or consumes reactive power. It may be controlled to hold a voltage or reactive setpoint somewhere in the network (not necessarily directly where it is connected).

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$MinP$$ | MW | Minimum generator active power output |
| $$MaxP$$ | MW | Maximum generator active power output |
| $$ReactiveLimits$$ | MVar | Operational limits of the generator (P/Q/V diagram) |
| $$RatedS$$ | MVA | The rated nominal power |
| $$TargetP$$ | MW | The active power target |
| $$TargetQ$$ | MVAr | The reactive power target |
| $$TargetV$$ | kV | The voltage target |
| $$RegulatingTerminal$$ |  | Associated node or bus for which voltage is to be regulated |
| $$VoltageRegulatorOn$$ |  | True if the generator regulates voltage |
| $$EnergySource$$ |  | The energy source harnessed to turn the generator |

The values `MinP`, `MaxP` and `TargetP` are required. The minimum active power output can not be greater than the maximum active power output. `TargetP` must be inside this active power limits. `RatedS` specifies the nameplate apparent power rating for the unit, it is optional and should be a positive value if it is defined. The [reactive limits](#reactive-limits) of the generator are optional, if they are not given the generator is considered with unlimited reactive power. Reactive limits can be given as a pair of [min/max values](#min-max-reactive-limits) or as a [reactive capability curve](#reactive-capability-curve).

The `VoltageRegulatorOn` attribute is required. It voltage regulation is enabled, then `TargetV` and `RegulatingTerminal` must also be defined. If the voltage regulation is disabled, then `TargetQ` is required. `EnergySource` is optional, it can be: `HYDRO`, `NUCLEAR`, `WIND`, `THERMAL`, `SOLAR` or `OTHER`.

Target values for generators (`TargetP` and `TargetQ`) follow the generator sign convention: a positive value means an injection into the bus. Positive values for `TargetP` and `TargetQ` mean negative values at the flow observed at the generator `Terminal`, as `Terminal` flow always follows load sign convention. The following diagram shows the sign convention of these quantities with an example.

![GeneratorSignConvention](img/index/generator-sign-convention.svg){: width="40%" .center-image}

The [Active Power Control](extensions.md#active-power-control) participation and the percent of the reactive control that comes from this generator in a [Coordinated Reactive Control](extensions.md#coordinated-reactive-control) configuration are available as grid model extensions.

### Load
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Load.html)

A load is a passive equipment representing a delivery point that consumes active and reactive power.

<!---
<span style="color:red"> TODO: add a sketch where the sign convention is indicated.</span>
-->

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

### Battery
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Battery.html)

A battery on the electric grid is an energy storage device that is either capable of capturing energy from the grid or of injecting it into the grid. The electric energy on the grid side is thus transformed into chemical energy on the battery side and vice versa. The power flow is bidirectional and it is controlled via a power electronic converter.

<!---
<span style="color:red"> TODO: add a sketch.</span>
--> 

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$P0$$ | MW | The Constant active power |
| $$Q0$$ | MVar | The Constant reactive power |
| $$MinP$$ | MW | The Minimal active power |
| $$MaxP$$ | MW | The Maximum active power |

**Available extensions**

- [Active Power Control](extensions.md#active-power-control)

### Dangling line
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/DanglingLine.html)

The IIDM network may be connected to other networks for which a full description is not available.
In this case, a boundary line exists between the two networks. In the IIDM model of the fully described network,
that connection is represented through a dangling line, which represents the part of that boundary line which is known.
A dangling line is thus a passive or active component that aggregates a line chunk and a constant power injection, in passive-sign convention.
The active and reactive power setpoints are fixed: the injection represents the power flow that would occur through the connection, were the other
network fully described.

![Dangling line model](img/index/danglingLine.svg){: width="50%" .center-image}

A generation part, at boundary side can also be modeled, with a constant active power injection and a constant reactive power injection if the generation part of the dangling line is out of voltage regulation or a voltage target if the regulation is enabled. This fictitious generator can only regulate voltage locally: the regulating terminal can not be set, it is necessary the boundary side of the dangling line. Limits are modeled through $$MinP$$ and $$MaxP$$ for active power limits and through [reactive limits](#reactive-limits). This generation part is optional. The generation part of the dangling line follows the classical generator sign convention.

Resulting flows at the dangling line terminal all follow the same passive-sign convention, either for the injection part or for the generation part.

Dangling lines are key objects for merging networks. Merging will be described soon [here](../features/merging.md). 

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$P0$$ | MW | The active power setpoint |
| $$Q0$$ | MVar | The reactive power setpoint |
| $$R$$ | $$\Omega$$ | The series resistance |
| $$X$$ | $$\Omega$$ | The series reactance |
| $$G$$ | S | The shunt conductance |
| $$B$$ | S | The shunt susceptance |

Optional: 

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$MinP$$ | MW | Minimum generation part active power output |
| $$MaxP$$ | MW | Maximum generation part active power output |
| $$ReactiveLimits$$ | MVar | Operational limits of the generation part (P/Q/V diagram) |
| $$TargetP$$ | MW | The active power target |
| $$TargetQ$$ | MVAr | The reactive power target |
| $$TargetV$$ | kV | The voltage target |
| $$VoltageRegulatorOn$$ |  | True if the generation part regulates voltage |

**Specifications**

- $$P0$$ and $$Q0$$ are the active and reactive power setpoints
- $$R$$, $$X$$, $$G$$ and $$B$$ correspond to a fraction of the original line and have to be consistent with the declared length of the
dangling line.

In case the line is a boundary, a UCTE Xnode code is defined besides the characteristics of the Table. See the [UCTE-DEF](../importer/ucte.md) documentation
page to learn more about this format. This code is actually related to ENTSOE, not only UCTE: it is a key to match two dangling lines and reconstruct the full boundary line.


**Available extensions**

- [Xnode]()

### Shunt Compensator
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/ShuntCompensator.html)

<!---
<span style="color:red"> TODO: add a sketch with the sign convention.</span>
-->

A shunt compensator represents a shunt capacitor or reactor or a set of switchable banks of shunt capacitors or reactors in the network. A section of a shunt compensator
is an individual capacitor or reactor: if its reactive power (Q) is negative, it is a capacitor; if it is positive, it is a reactor.

There are two models of shunt compensators in IIDM: linear shunt compensators and non-linear shunt compensators.

A linear shunt compensator has banks or sections with equal admittance values.
A non-linear shunt compensator has banks or sections with different admittance values.

Shunt compensators follow a passive-sign convention:
  - Flow out from bus has positive sign.
  - Consumptions are positive.

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- |------------ |
| $$MaximumSectionCount$$ | - | The maximum number of sections that may be switched on |
| $$SectionCount$$ | - | The current number of sections that are switched on |
| $$B$$ | S | The susceptance of the shunt compensator in its current state |
| $$G$$ | S | The conductance of the shunt compensator in its current state |
| $$TargetV$$ | kV | The voltage target |
| $$TargetDeadband$$ | kV | The deadband used to avoid excessive update of controls |
| $$RegulatingTerminal$$ | - | Associated node or bus for which voltage is to be regulated |
| $$VoltageRegulatorOn$$ | - | True if the shunt compensator regulates voltage |

- For Linear Shunt Compensators

| Attribute | Unit | Description |
| --------- | ---- |------------ |
| $$bPerSection$$ | S | The Positive sequence shunt (charging) susceptance per section |
| $$gPerSection$$ | S | The Positive sequence shunt (charging) conductance per section |

We expect $$bPerSection$$ to be a non zero value. The disconnected status of the linear shunt compensator can be modeled by setting the $$SectionCount$$ attribute to zero.

- For Non Linear Shunt Compensators

| Attribute | Unit | Description |
| --------- | ---- |------------ |
| $$Sections$$ | [Section](#Section) | The Partition of all the shunt compensator's sections |

#### Section

| Attribute | Unit | Description |
| --------- | ---- |------------ |
| $$B$$ | S | The Positive sequence shunt (charging) susceptance of the section |
| $$G$$ | S | The Positive sequence shunt (charging) conductance of the section |

$$B$$ and $$G$$ attributes can be equal zero, but the disconnected status of the non linear shunt compensator can be modeled by setting the $$SectionCount$$ attribute to zero. The section which $$SectionCount$$ equal to $$1$$ is the first effective section, and it would be more efficient to affect it a non zero susceptance.   

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

### Static VAR Compensator
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/StaticVarCompensator.html)

<span style="color:red"> TODO: add a description with sign convention.</span>  
<span style="color:red"> TODO: add a sketch with the sign convention.</span>  
It may be controlled to hold a voltage or reactive setpoint somewhere in the network (not necessarily directly where it is connected).
Static VAR compensators follow a passive-sign convention:
  - Flow out from bus has positive sign.
  - Consumptions are positive.

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$Bmin$$ | S | The minimum susceptance |
| $$Bmax$$ | S | The maximum susceptance |
| $$VoltageSetpoint$$ | kV | The voltage setpoint |
| $$ReactivePowerSetpoint$$ | MVar | The reactive power setpoint |

**Specifications**

- $$Bmin$$ and $$Bmax$$ are the susceptance bounds of the static VAR compensator. Reactive power output of a static VAR compensator is limited by the maximum and the minimum susceptance values. The min/max reactive power of a static VAR compensator are determined by:  
$$Qmin = -Bmin \times V^2$$  
$$Qmax = -Bmax \times V^2$$  
where $$V$$ is the voltage of the bus that connects the static VAR compensator to the network. Even if the regulating terminal is remote, only the local voltage has to be considered to retrive the minimum and the maximum amouts of reactive power. Reactive limits can be handled in an approximative way using the nominal voltage of the connected bus.   
- The voltage setpoint is required when the regulation mode is set to `VOLTAGE`.
- The reactive power setpoint is required when the regulation mode is set to `REACTIVE_POWER`.

**Metadata**
In IIDM the static VAR compensator also comprises some metadata:

- The regulation mode, which can be:
    - `VOLTAGE`
    - `REACTIVE_POWER`
    - `OFF`
Note that it is different from the generators' regulation definition, which is only done through a boolean.
- The regulating terminal, which can be local or remote: it is the specific connection point on the network where the setpoint is measured.

**Available extensions**

- [VoltagePerReactivePowerControl](extensions.md#voltage-per-reactive-power-control)

### Branches

A branch in IIDM Grid model is any AC equipment with two or more connection points to the network.
Below are the different types of branches supported by PowSyBl.

#### Line
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Line.html)

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
    y_{1}+\dfrac{1}{z} & -\dfrac{1}{z}\\
    -\dfrac{1}{z} & y_{2}+\dfrac{1}{z}
    \end{array}\right)\left(\begin{array}{c}
    V_{1}\\
    V_{2}
    \end{array}\right)
\end{align*}
$$

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$R$$ | $$\Omega$$ | The series resistance |
| $$X$$ | $$\Omega$$ | The series reactance |
| $$G1$$ | S | The first side shunt conductance |
| $$B1$$ | S | The first side shunt susceptance |
| $$G2$$ | S | The second side shunt conductance |
| $$B2$$ | S | The second side shunt susceptance |

**Metadata**

- Lines can have [current limits](#current-limits)

**Available extensions**

- [Merged Xnode]()

##### Tie Line
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/TieLine.html)

A tie line is an AC line sharing power between two neighbouring regional grids. It is constituted of two [half lines](#half-line).
A tie line is created by matching two [dangling lines](#dangling-line) with the same Xnode code.
It has line characteristics, with $$R$$ (resp. $$X$$) being the sum of the series resistances (resp. reactances) of the two half lines.
$$G1$$ (resp. $$B1$$) is equal to the sum of the first half line's $$G1$$ and $$G2$$ (resp. $$B1$$ and $$B2$$).
$$G2$$ (resp. $$B2$$) is equal to the sum of the second half line's $$G1$$ and $$G2$$ (resp. $$B1$$ and $$B2$$).

###### Half Line

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$R$$ | $$\Omega$$ | The series resistance |
| $$X$$ | $$\Omega$$ | The series reactance |
| $$G1$$ | S | The first side shunt conductance |
| $$B1$$ | S | The first side shunt susceptance |
| $$G2$$ | S | The second side shunt conductance |
| $$B2$$ | S | The second side shunt susceptance |

<!---
<span style="color:red"> TODO: describe xnodeP and xnodeQ in the java doc and here with a sentence.</span>
-->

#### Transformers

##### Two windings transformer
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/TwoWindingsTransformer.html)

A two windings power transformer is connected to two voltage levels (side 1 and side 2) that belong to a same substation.
Two windings transformers are modeled with the following equivalent $$\Pi$$ model:

![Power line model](img/index/two-windings-transformer-model.svg){: width="50%" .center-image}

With the series impedance $$z$$ and the shunt admittance $$y$$ and the voltage ratio $$\rho$$ and the angle difference $$\alpha$$ and potentially parameters from the current step of a [ratio tap changer](#ratio-tap-changer) and/or a [phase tap changer](#phase-tap-changer), we have:

$$
\begin{array}{lcl}
    r & = & r_{nom}.\left(1+\dfrac{r_{r, tap} + r_{\phi, tap}}{100}\right)\\
    x & = & x_{nom}.\left(1+\dfrac{x_{r, tap} + x_{\phi, tap}}{100}\right)\\
    g & = & g_{nom}.\left(1+\dfrac{g_{r, tap} + g_{\phi, tap}}{100}\right)\\
    b & = & b_{nom}.\left(1+\dfrac{b_{r, tap} + b_{\phi, tap}}{100}\right)\\
    \rho & = & \dfrac{V_{2nom}}{V_{1nom}}.\rho_{r, tap}.\rho_{\phi, tap}\\
    \alpha & = & \alpha_{\phi, tap}\\
    z & = & r + j.x\\
    y & = & g + j.b\\
    V_{0} & = & V_{1}.\rho e^{j\alpha}\\
    I_{0} & = & \dfrac{I_{1}}{\rho e^{-j\alpha}}\\
\end{array}
$$

Using the above notation, the equations of the two windings transformer, in complex notations, are as follow:

$$
\left(\begin{array}{c}
I_{1}\\
I_{2}
\end{array}\right)=\left(\begin{array}{cc}
\rho\text{²}(y+\dfrac{1}{z}) & -\dfrac{1}{z}\rho e^{-j\alpha}\\
-\rho\dfrac{1}{z} e^{j\alpha} & \dfrac{1}{z}
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

- A [ratio tap changer](#ratio-tap-changer) and/or a [phase tap changer](#phase-tap-changer) can be associated with a two windings power transformer.
- For a two windings transformer, the normal apparent power shall be identical at both sides 1 and 2.

**Available extensions**

- [Phase Angle Clock](extensions.md#two-windings-transformer-phase-angle-clock)

##### Three windings transformer
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/ThreeWindingsTransformer.html)

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
| $$RatedU0$$ | kV | The rated voltage at the star bus |

**Specifications**

- A [ratio tap changer](#ratio-tap-changer) and/or a [phase tap changer](#phase-tap-changer) can be associated to all three sides of a three windings power transformer.
Only one tap changer (either ratio or phase tap changer) is allowed to be regulating on the equipment at a given time.

**Available extensions**

- [Phase Angle Clock](extensions.md#three-windings-transformer-phase-angle-clock)

##### Three windings transformer leg

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$R$$ | $$\Omega$$ | The nominal series resistance specified at the voltage of the leg |
| $$X$$ | $$\Omega$$ | The nominal series reactance specified at the voltage of the leg |
| $$G$$ | S | The nominal magnetizing conductance specified at the voltage of the leg |
| $$B$$ | S | The nominal magnetizing susceptance specified at the voltage of the leg |
| $$RatedU$$ | kV | The rated voltage |
| $$RatedS$$ | MVA | The normal apparent power |

**Specifications**

- A leg can have [current limits](#current-limits).

### DC components

#### HVDC Line
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/HvdcLine.html)

An HVDC line is connected to the DC side of two HVDC converter stations, either an [LCC station](#lcc-converter-station) or a [VSC station](#vsc-converter-station).

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$R$$ | $$\Omega$$ | The resistance of the HVDC line |
| $$NominalV$$ | kV | The nominal voltage |
| $$ActivePowerSetpoint$$ | MW | The active power setpoint |
| $$MaxP$$ | MW | The maximum active power |

**Specifications**

- The HVDC line operation depends on a converters mode, which indicates the flow direction. In the specification it is thus mandatory to define `ConvertersMode`, which can be:
    - `SIDE_1_RECTIFIER_SIDE_2_INVERTER`: the flow goes from side 1 to side 2
    - `SIDE_1_INVERTER_SIDE_2_RECTIFIER`: the flow goes from side 2 to side 1

  The flow sign is thus given by the type of the converter station: the power always flows from the rectifier converter station to the inverter converter station.
  At a terminal on the AC side, `P` and `Q` follow the passive sign convention. `P` is positive on the rectifier side. `P` is negative at the inverter side.
- The active power setpoint and the maximum active power should always be positive values.

#### HVDC Converter Station

An HVDC converter station converts electric power from high voltage alternating current (AC) to high-voltage direct current (HVDC), or vice versa.
Electronic converters for HVDC are divided into two main categories: line-commutated converters (LCC) and voltage-sourced converters (VSC).

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| HvdcType | `HvdcType` | - | yes | - | The HVDC type |
| LossFactor | float | % | yes | - | The loss factor |

The LossFactor should be greater than 0.

**Specifications**  

The HVDC type, `LCC` or `VSC`, determines if the Converter Station is a LCC Converter Station or a VSC Converter Station.

The positive loss factor `LossFactor` is used to model the losses during the conversion. In case of:
- A rectifier operation (conversion from AC to DC), we have
$$
\frac{P_{DC}}{P_{AC}} = 1 - \frac{LossFactor}{100}
$$
- An inverter operation (conversion from DC to AC), we have
$$
\frac{P_{AC}}{P_{DC}} = 1 - \frac{LossFactor}{100}
$$
Note that at the terminal on the AC side, $$Q$$ is always positive: the converter station always consumes reactive power.

##### LCC Converter Station
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/LccConverterStation.html)

An LCC converter station is made with electronic switches that can only be turned on (thyristors). Below are some characteristics:
- Use semiconductors which can withstand voltage in either polarity
- Output voltage can be either polarity to change the power direction
- Current direction does not change
- Store energy inductively
- Use semiconductors which can turn on by control action
- Turn-off and commutation rely on the external circuit

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$PowerFactor$$ | % | Ratio between the active power $$P$$ and the apparent power $$S$$. |

##### VSC Converter Station
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/VscConverterStation.html)

A VSC converter station is made with switching devices that can be turned both on and off (transistors). Below are some characteristics:
- Use semiconductors which can pass current in either direction
- Output voltage polarity does not change
- Current direction changes to change the power direction
- Store energy capacitively
- Use semiconductors which can turn on or off by control action
- Turn-off is independant of external circuit

**Characteristics**

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$VoltageSetpoint$$ | kV | The voltage setpoint for regulation |
| $$ReactivePowerSetpoint$$ | MVar | The reactive power setpoint for regulation |
| $$PowerFactor$$ | % | Ratio between the active power $$P$$ and the apparent power $$S$$. |

**Specifications**

- The voltage setpoint (in kV) is required if the voltage regulator is on for the VSC station.
- The reactive power setpoint (in MVar) is required if the voltage regulator is off for the VSC station. A positive value of $$ReactivePowerSetpoint$$ means an injection into the bus, thus a negative value at the corresponding terminal (which is in passive-sign convention).
- A set of reactive limits can be associated to a VSC converter station. All the reactive limits modelings available in the library are described [here](reactiveLimits.md).

**Metadata**
- The participation to regulation (through a boolean)

### Busbar Section

[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/BusbarSection.html)<br>
A busbar section is a non impedant element used in a node/breaker substation topology to connect equipment.

<!---
<span style="color:red"> TODO</span>
--> 

### Breaker/Switch

[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/Switch.html)<br>

<!---
<span style="color:red"> TODO</span>
-->

### Internal Connection

**Internal connection**  
An internal connection is a non-impedant connection between two components in a voltage level.

<!--
<span style="color:red"> TODO</span>
-->

## Additional network models

In this section, the additional models available in IIDM are described: reactive limits, current limits, voltage regulation, phase and ratio tap changers.
They can be used by various equipment models.

### Reactive limits
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/ReactiveLimits.html)

The reactive limits may be used to model limitations of the reactive power of
[generators](#generator), [VSC converter stations](#vsc-converter-station) and [batteries](#battery).

#### Min-Max reactive limits
With the min-max reactive limits, the reactive power does not depend on the active power. For any active power value, the reactive power value is in the [minQ, maxQ] interval.

#### Reactive capability curve
With the reactive capability curve limits, the reactive power limitation depends on the active power value. This dependency is based on a curve provided by the user.
The curve is defined as a set of points that associate, to each active power value, a minimum and maximum reactive power value.
In between the defined points of the curve, the reactive power limits are computed through a linear interpolation.

### Loading Limits
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/LoadingLimits.html)

Some equipment have operational limits regarding the current, active power or apparent power value, corresponding to the equipment's physical limitations (related to heating).

Loading limits can be declined into active power limits (in MW), apparent power limits (in kVA) and current limits (in A).
They may be set for [lines](#line),
[dangling lines](#dangling-line), [two windings transformers](#two-windings-transformer) and [three windings transformers](#three-windings-transformer). The active power limits are in absolute value.

Loading limits are defined by at most one permanent limit and any number of temporary limits (zero or more).
The permanent limit sets the current, active power or apparent power absolute value under which the equipment can safely
be operated for any duration.
The temporary limits can be used to define higher current, active power or apparent power limitations corresponding
to specific operational durations.
A temporary limit thus has an **acceptable duration**.

The component on which the current limits are applied can safely remain
between the preceding limit (it could be another temporary limit or a permanent limit) and this limit for a duration up to the acceptable duration.
Please look at this scheme to fully understand the modelling (the following example shows current limits but this modelling is valid for all loading limits):

![Loading limits model](img/index/currentLimits.svg){: width="50%" .center-image}

Note that, following this modelling, in general the last temporary limit (the higher one in value) should be infinite with an acceptable duration different from zero, except for tripping current modeling where the last temporary limit is infinite with an acceptable duration equal to zero.

### Phase tap changer
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/PhaseTapChanger.html)

A phase tap changer can be added to either [two windings transformers](#two-windings-transformer) or [three windings transformers' legs](#three-windings-transformer-leg).

**Specifications**

A phase tap changer is described by a set of tap positions (or steps) within which the transformer or transformer leg can operate. Additionally to that set of steps, it is necessary to specify:
- the lowest tap position
- the highest tap position
- the position index of the current tap (which has to be within the highest and lowest tap position bounds)
- whether the tap changer is regulating or not
- the regulation mode, which can be `CURRENT_LIMITER`, `ACTIVE_POWER_CONTROL` or `FIXED_TAP`: the tap changer either regulates the current or the active power.
- the regulation value (either a current value in `A` or an active power value in `MW`)
- the regulating terminal, which can be local or remote: it is the specific connection point on the network where the setpoint is measured.
- the target deadband, which defines a margin on the regulation so as to avoid an excessive update of controls

The phase tap changer can always switch tap positions while loaded, which is not the case of the ratio tap changer described below.

<!---
<span style="color:red"> TODO: check what happens when setting `isRegulating` to true and `FIXED_TAP` as regulating mode</span>
-->

Each step of a phase tap changer has the following attributes:

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$r_{\phi, tap}$$ | % | The resistance deviation in percent of nominal value |
| $$x_{\phi, tap}$$ | % | The reactance deviation in percent of nominal value |
| $$g_{\phi, tap}$$ | % | The conductance deviation in percent of nominal value |
| $$b_{\phi, tap}$$ | % | The susceptance deviation in percent of nominal value |
| $$\rho_{\phi, tap}$$ | p.u. | The voltage ratio in per unit of the rated voltages |
| $$\alpha_{\phi, tap}$$ | $$^{\circ}$$ | Angle difference |

### Ratio tap changer
[![Javadoc](https://img.shields.io/badge/-javadoc-blue.svg)](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/iidm/network/RatioTapChanger.html)

A ratio tap changer can be added to either [two windings transformers](#two-windings-transformer) or [three windings transformers' legs](#three-windings-transformer-leg).

**Specifications**

A ratio tap changer is described by a set of tap positions (or steps) within which the transformer or transformer leg can operate (or be operated offload). Additionally to that set of steps, it is necessary to specify:
- the lowest tap position
- the highest tap position
- the position index of the current tap (which has to be within the highest and lowest tap position bounds)
- whether the tap changer is regulating or not; a ratio tap changer always regulates on the voltage
- the regulation value (in `kV`)
- the regulating terminal, which can be local or remote: it is the specific connection point on the network where the setpoint is measured.
- the target deadband, which defines a margin on the regulation so as to avoid an excessive update of controls
- whether the ratio tap changer can change tap positions onload or only offload


Each step of a ratio tap changer has the following attributes:

| Attribute | Unit | Description |
| --------- | ---- | ----------- |
| $$r_{r, tap}$$ | % | The resistance deviation in percent of nominal value |
| $$x_{r, tap}$$ | % | The reactance deviation in percent of nominal value |
| $$g_{r, tap}$$ | % | The conductance deviation in percent of nominal value |
| $$b_{r, tap}$$ | % | The susceptance deviation in percent of nominal value |
| $$\rho_{r, tap}$$ | p.u. | The voltage ratio in per unit of the rated voltages |

## Going further

<!---
<span style="color:red"> TODO: create a tutorial showing how to create the FourSubstationsNodeBreakerFactory network of the tests.</span>
-->