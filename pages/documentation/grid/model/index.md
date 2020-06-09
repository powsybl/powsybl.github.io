---
layout: default
latex: true
---

# Grid model

* TOC
{:toc}

## Concepts

## Network core model

### Network

**Characteristics**

| Attribute | Type | Required | Default value | Description |
| --------- | ---- | -------- | ------------- | ----------- |
| Id | String | yes | - | The ID of the network |
| Name | String | no | - | The name of the network |
| CaseDate | `DateTime` | no | Now | The date of the case |
| ForecastDistance | Integer | no | 0 | The number of minutes between the date of the case generation and the date of the case |

**Available extensions**

- [CGMES conversion context extension]()
- [CGMES model extension]()

### Substation

**Characteristics**

| Attribute | Type | Required | Default value | Description |
| --------- | ---- | -------- | ------------- | ----------- |
| Id | String | yes | - | The ID of the substation |
| Name | String | no | - | The name of the substation |
| Country | `Country` | no | - | The country where this substation is located |
| Tso | String | no | - | The TSO this substations belongs to |
| GeographicalTags | List of String | no | - | A list of geographical tags |

**Available extensions**

- [ENTSOE Area]()

### Voltage Level

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Id | String | - | yes | - | The ID of the voltage level |
| Name | String | - | no | - | The name of the voltage level |
| NominalV | double | kV | yes | - | The nominal voltage |
| LowVoltageLimit | double | kV | no | - | The low voltage limit |
| HighVoltageLimit | double | kV | no | - | The high voltage limit |
| TopologyKind | `TopologyKind` | - | yes | - | The kind of topology |

### Injections

An injection in IIDM Grid model is any AC equipment with a single connection point to the network.
Below are the different types of injections supported by PowSyBl.

#### Battery

A battery on the electric grid is an energy storage device that is either capable of capturing energy from the grid or of injecting it into the grid. The electric energy on the grid side is thus transformed into chemical energy on the battery side and vice versa. The power flow is bidirectional and it is controlled via a power electronic converter.

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Id | String | - | yes | - | The ID of the battery |
| Name | String | - | no | - | The name of the battery |
| P0 | double | MW | yes | - | The Constant active power |
| Q0 | double | MVar | yes | - | The Constant reactive power |
| MinP | double | MW | yes | - | The Minimal active power |
| MaxP | double | MW | yes | - | The Maximum active power |

**Available extensions**

- [Active Power Control]()

#### Busbar Section

A busbar section is a non impedant element used in a node/breaker substation topology to connect equipments.

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Id | String | - | yes | - | The ID of the busbar section |
| Name | String | - | no | - | The name of the busbar section |
| V | double | kV | no | - | The voltage magnitude of the busbar section |
| Angle | double | ° |  no | - | The voltage angle of the busbar section |

#### Dangling Line

A dangling line is a component that aggregates a line chunk and a constant power injection.
The active and reactive power setpoints are fixed.

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Id | String | - | yes | - | The ID of the dangling line |
| Name | String | - | no | - | The name of the dangling line |
| P0 | double | MW | yes | - | The active power setpoint |
| Q0 | double | MVar | yes | - | The reactive power setpoint |
| R | double | $$\Omega\$$ | yes | - | The series resistance |
| X | double | $$\Omega\$$ | yes | - | The series reactance |
| G | double | S | yes | - | The shunt conductance |
| B | double | S | yes | - | The shunt susceptance |
| UcteXnodeCode | String | - | no | - | The dangling line's UCTE Xnode code |

**Specifications**

- R, X, G and B correspond to a percent of the original line and have to be consistent with the declared length of the
dangling line.
- The UCTE Xnode code is defined in the case where the line is a boundary. See the [UCTE-DEF](../importer/ucte.md) documentation
page to learn more about this format.

**Available extensions**

- [Xnode]()

#### Generator

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Id | String | - | yes | - | The ID of the generator |
| Name | String | - | no | - | The name of the generator |
| EnergySource | `EnergySource` | - | yes | `OTHER` | The energy source |
| MinP | double | MW | yes | - | The minimal active power |
| MaxP | double | MW | yes | - | The maximum active power |
| RegulatingTerminal | `Terminal` | - | no | The generator's terminal | The terminal used for regulation |
| VoltageRegulatorOn | boolean | - | yes | - | The voltage regulator status |
| TargetP | double | MW | yes | - | The active power target |
| TargetQ | double | MVAr | only if `VoltageRegulatorOn` is set to `false` | - | The reactive power target |
| TargetV | double | kV | only if `VoltageRegulatorOn` is set to `true` | - | The voltage target |
| RatedS | double | MVA | yes | - | The rated nominal power |

**Specifications**

- The `EnergySource` of a generator can be:
    - HYDRO
    - NUCLEAR
    - WIND
    - THERMAL
    - SOLAR
    - OTHER
- The minimal active power is expected to be lower than the maximal active power.
- The voltage target is required if the voltage regulator is on.
The reactive power target is required if the voltage regulator is off.
- The regulating terminal can be local or remote.
- A set of reactive limits can be associated to a generator. All the reactive limits modelings available in the library are described [here](reactiveLimits.md).
- Target values for generators (TargetP and TargetQ) are seen as target values for injections.
    - They follow the generator sign convention.
    - A value of TargetP positive means an injection into the bus.
    - A positive value for the TargetP and the TargetQ means a negative value at the corresponding terminal.
    
**Available extensions**

- [Active Power Control]()
- [Coordinated Reactive Control]()

#### Load

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| Id | String | - | yes | - | The ID of the load |
| Name | String | - | no | - | The name of the load |
| LoadType | `LoadType` | - | no | `UNDEFINED` | The type of the load |
| P0 | double | MW | yes | - | The active power setpoint |
| Q0 | double | MVar | yes | - | The reactive power setpoint |

**Specifications**

- The `LoadType` can be:
    - UNDEFINED
    - AUXILIARY
    - FICTITIOUS
- Initial values for loads P0 and Q0 follow the load sign convention:
    - Flow out from bus has positive sign.
    - Consumptions are positive.

#### Shunt Compensator

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| Id | String | - | yes | - | The ID of the shunt compensator |
| Name | String | - | no | - | The name of the shunt compensator |
| bPerSection | double | S | yes | - | The Positive sequence shunt (charging) susceptance per section |
| MaximumSectionCount| integer | int | yes | - | The maximum number of sections that may be switched on |
| CurrentSectionCount | integer | int | yes | - | The current number of section that may be switched on |
| RegulatingTerminal | `Terminal | - | no | The shunt compensator's terminal | The terminal used for regulation |
| TargetV | double | kV | only if `VoltageRegulatorOn` is set to `true` | - |  The voltage target |
| TargetDeadband | double | kV | only if `VoltageRegulatorOn` is set to `true` | - | The deadband used to avoid excessive update of controls |
| VoltageRegulatorOn | boolean | - | no | false | The voltage regulating status |

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
    - Shunt compensators follow a load sign convention:
    - Flow out from bus has positive sign.
    - Consumptions are positive.
- In case of a capacitor, the value for its Q will be negative.
- In case of a reactor, the value for its Q will be positive.

#### Static VAR Compensator

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| Id | String | - | yes | - | The ID of the static VAR compensator |
| Name | String | - | no | - | The name of the static VAR compensator |
| Bmin | double | S | yes | - | The minimum susceptance |
| Bmax | double | S | yes | - | The maximum susceptance |
| VoltageSetpoint | double | kV | only if `RegulationMode` is set to `VOLTAGE` | - | The voltage setpoint |
| ReactivePowerSetpoint | double | MVar | only if `RegulationMode` is set to `REACTIVE_POWER` | - | The reactive power setpoint |
| RegulatingTerminal | `Terminal`| - | no | The static var compensator's terminal | The terminal used for regulation |
| RegulationMode | `RegulationMode` | - | yes | - | The regulation mode |

**Specifications**

- The `RegulationMode` can be:
    - VOLTAGE
    - REACTIVE_POWER
    - OFF
- The voltage setpoint is required when the regulation mode is set to VOLTAGE.
The reactive power setpoint is required when the regulation mode is set to REACTIVE_POWER.

### Branches

A branch in IIDM Grid model is any AC equipment with two or more connection points to the network.
Below are the different types of branches supported by PowSyBl.

#### Line

AC Power lines are modeled using a standard $$\pi$$ model with distributed parameters.

![Power line model](./images/line-model.svg){: width="50%" .center-image}

With series impedance $$z$$ and the shunt admittance on each side $$y_1$$ and $$y_2$$:

$$
\begin{align*}
    & z=r+j.x\\
    & y_1 = g_1 +j. b_1\\
    & y_2 = g_2 +j. b_2
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

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Id | string | - | yes | - | Unique identifier of the line|
| Name | string | - | no | "" | Human-readable name of the line|
| R | double | $$\Omega\$$ | yes | - | The series resistance |
| X | double | $$\Omega\$$ | yes | - | The series reactance |
| G1 | double | S | yes | - | The first side shunt conductance |
| B1 | double | S | yes | - | The first side shunt susceptance |
| G2 | double | S | yes | - | The second side shunt conductance |
| B2 | double | S | yes | - | The second side shunt susceptance |

**Specifications**

- Lines can have current limits

**Available extensions**

- [Merged Xnode]()

#### Tie Line

A Tie Line is an AC line sharing power between two neighbouring regional grids. It is composed of two Half Lines.

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Id | string | - | yes | - | Unique identifier of the tie line |
| Name | string | - | no | "" | Human-readable name of the tie line |
| HalfLine1 | `TieLine.HalfLine` | - | yes | - | The first half of the line characteristics |
| HalfLine2 | `TieLine.HalfLine` | - | yes | - | The second half of the line characteristics |
| UcteXnodeCode | String | - | no | - | The UCTE Xnode code corresponding to this line (only required if the line crosses a boundary) |
| R | double | $$\Omega\$$ | yes | - | The series resistance (sum of the series resistances of the two Half lines) **NB: this attribute is read-only** |
| X | double | $$\Omega\$$ | yes | - | The series reactance (sum of the series reactances of the two Hald lines) **NB: this attribute is read-only**  |
| G1 | double | S | yes | - | The first side shunt conductance (sum of the first side shunt conductances of the two Half lines) **NB: this attribute is read-only** |
| B1 | double | S | yes | - | The first side shunt susceptance (sum of the first side shunt susceptances of the two Half lines) **NB: this attribute is read-only**  |
| G2 | double | S | yes | - | The second side shunt conductance (sum of the second side shunt conductances of the two Half lines) **NB: this attribute is read-only** |
| B2 | double | S | yes | - | The second side shunt susceptance (sum of the second side shunt susceptances of the two Half lines) **NB: this attribute is read-only** |

##### Half Line

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Id | String | - | yes | - | The ID of the Half Line |
| Name | String | - | no | - | The name of the Half Line |
| R | double | $$\Omega\$$ | yes | - | The series resistance |
| X | double | $$\Omega\$$ | yes | - | The series reactance |
| G1 | double | S | yes | - | The first side shunt conductance |
| B1 | double | S | yes | - | The first side shunt susceptance |
| G2 | double | S | yes | - | The second side shunt conductance |
| B2 | double | S | yes | - | The second side shunt susceptance |
| XnodeP | double | MW | yes | - | The active power consumption |
| XnodeQ | double | MVar | yes | - | The reactive power consumption |

#### Transformers

##### Three windings transformer

A three windings power transformer is connected to three voltage levels (side 1, side 2 and side 3) that belong to the
same substation. We usually have:
- Side 1 as the primary side (side with highest rated voltage)
- Side 2 as the secondary side (side with the medium rated voltage)
- Side 3 as the tertiary side (side with the lowest rated voltage)

A three windings transformer is modeled with three legs, where every leg model is electrically equivalent to a two windings transformer.
For each leg, the network bus is at side 1 and the star bus is at side 2.

![Power line model](./images/three-windings-transformer-model.svg){: width="50%" .center-image}

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| Id | string | - | yes | - | Unique identifier of the transformer |
| Name | string | - | yes | - | Human-readable name of the transformer |
| RatedU0 | double | kV | yes | - | The rated voltage at the star bus |
| Leg1 | `ThreeWindingsTransformer.Leg` | - | yes | - | The leg at the primary side |
| Leg2 | `ThreeWindingsTransformer.Leg` | - | yes | - | The leg at the secondary side |
| Leg3 | `ThreeWindingsTransformer.Leg` | - | yes | - | getId()The leg at the tertiary side |

**Specifications**

- A Ratio Tap Changer and/or a Phase Tap Changer can be associated to all three sides of a three windings power transformer.
Only one Tap Changer (either ratio or phase tap changer) is allowed to be regulating on the equipment at a given time.

**Available extensions**

- [Phase Angle Clock]()

###### Leg

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| Terminal | [`Terminal`](terminal.md) | - | yes | - | The terminal the leg is connected to |
| R | double | $$\Omega\$$ | yes | - | The nominal series resistance specified at the voltage of the leg |
| X | double | $$\Omega\$$ | yes | - | The nominal series reactance specified at the voltage of the leg |
| G | double | S | yes | - | The nominal magnetizing conductance specified at the voltage of the leg |
| B | double | S | yes | - | The nominal magnetizing susceptance specified at the voltage of the leg |
| RatedU | double | kV | yes | - | The rated voltage |
| RatedS | double | MVA | no | - | The normal apparent power |

**Specifications**

- A leg can have current limits.

##### Two windings transformer

A two windings power transformer is connected to two voltage levels (side 1 and side 2) that belong to a same substation.

Two windings transformer are modeled with the following equivalent $$\pi$$ model:

![Power line model](./images/two-windings-transformer-model.svg){: width="50%" .center-image}

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

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Id | string | - | yes | - | Unique identifier of the transformer |
| Name | string | - | yes | - | Human-readable name of the transformer |
| $$R_{nom}$$ | double | $$\Omega$$  | yes | - | The nominal series resistance at the side 2 of the transformer |
| $$X_{nom}$$ | double | $$\Omega$$ | yes | - | The nominal series reactance at the side 2 of the transformer |
| $$G_{nom}$$ | double | S | yes | - | The nominal magnetizing conductance at the side 2 of the transformer |
| $$B_{nom}$$ | double | S | yes | - | The nominal magnetizing susceptance at the side 2 of the transformer |
| $$V_{1\ nom}$$ | double | kV | yes | - | The rated voltage at side 1 |
| $$V_{2\ nom}$$ | double | kV | yes | - | The rated voltage at side 2 |
| RatedS | double | MVA | no | - | The normal apparent power |

**Specifications**

- A Ratio tap changer and/or a Phase tap changer can be associated with a two windings power transformer.
- For a two windings transformer, the normal apparent power shall be identical at both sides 1 and 2.

**Available extensions**

- [Phase Angle Clock]()

### DC components

#### HVDC Line

An HVDC line is connected to the DC side of two HVDC converter stations.

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Id | string | - | yes | - | Unique identifier of the HVDC line |
| Name | string | - | yes | - | Human-readable name of the HVDC line |
| R | double | $$\Omega\$$ | yes | - | The resistance of the HVDC line |
| ConvertersMode | `ConvertersMode`| - | yes | - | The converter's mode |
| NominalV | double | kV | yes | - | The nominal voltage |
| ActivePowerSetpoint | MW | double | yes | - | The active power setpoint |
| MaxP | double | MW | yes | - | The maximum active power |
| ConverterStationId1 | String | - | yes | - | The ID of the HVDC converter station connected on side 1 |
| ConverterStationId2 | String | - | yes | - | The ID of the HVDC converter station connected on side 2 |

**Specifications**

- The `ConvertersMode` can be:
    - SIDE_1_RECTIFIER_SIDE_2_INVERTER
    - SIDE_1_INVERTER_SIDE_2_RECTIFIER
- The active power setpoint and the maximum active power should always be positive values. The flow sign is given by the type of the converter station. Power always flows from rectifier converter station to inverter converter station. At a terminal on AC side, P and Q follow load sign convention. P is positive on rectifier side. P is negative at inverter side.

#### LCC Converter Station

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| Id | string | - | yes | - | Unique identifier of the LCC converter station |
| Name | string | - | yes | - | Human-readable name of the LCC converter station |
| PowerFactor | float | - | yes | - | The power factor |

**Specifications**

- The PowerFactor is equal to
$$
\frac{P}{\sqrt{P^{2} + Q^{2}}}
$$
and should be between -1 and 1. Note that at terminal on AC side, Q is always positive: the converter station always consumes reactive power.


#### VSC Converter Station

**Characteristics**

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| VoltageRegulatorOn | boolean | - | yes | - | The voltage regulator status |
| VoltageSetpoint | double | kV | only if `VoltageRegulatorOn` is set to `true` | - | The voltage setpoint |
| ReactivePowerSetpoint | double | MVar | only if `VoltageRegulatorOn` is set to `false` | - | The reactive power setpoint |

**Specifications**

- The voltage setpoint is required if the voltage regulator is on.
The reactive power setpoint is required if the voltage regulator is off.
- A set of reactive limits can be associated to a VSC converter station. All the reactive limits modelings available in the library are described [here](reactiveLimits.md).

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
