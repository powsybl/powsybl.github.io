---
layout: default
latex: true
---

# OpenLoadFlow

PowSyBl OpenLoadFlow is an open-source power flow implementation in Java provided by PowSyBl. The source code is hosted on [GitHub](https://github.com/powsybl/powsybl-open-loadflow). 

* TOC
{:toc}

## Grid modelling

OpenLoadFlow computes power flows from IIDM grid model in bus/view topology. From the view, a very simple network, composed of only buses and branches is created. In the graph vision, we rely on a $$\Pi$$ model for branches (lines, transformers, dangling lines, etc.):

- $$R$$ and $$X$$ are respectively the real part (resistance) and the imaginary part (reactance) of the complex impedance ;  
- $$G_1$$ and $$G_2$$ are the real parts (conductance) on respectively side 1 and side 2 of the branch ;
- $$B_1$$ and $$B_2$$ are the imaginary parts (susceptance) on respectively side 1 and side 2 of the branch ;
- $$A_1$$ is the angle shifting on side 1, before the series impedance. For classical branches, the default value is zero ;
- $$\rho_1$$ is the ratio of voltages between side 2 and side 1, before the series impedance. For classical branches, the default value is $$1$$.

As the $$\Pi$$ model is created from IIDM grid modelling that locates its ratio and phase tap changers in side 1, $$A_2$$ and $$\rho_2$$ are always equal to zero and $$1$$. In case of a branch with voltage or phase control, the $$\Pi$$ model becomes an array. See below our model:

![Pi model](img/pi-model.svg){: width="50%" .center-image}

### AC flows computing

AC flows computing in OpenLoadFLow relies on solving a non linear squared equations system, where unknown are voltage magnitude and phase angle at each bus of the network, implying that there are $$2N$$ unknown where $$N$$ is the number of buses. There are two equations per network bus, resulting in $$2N$$ equations. The nature of these $$2$$ equations depends on the type of the bus:
- PQ-bus: active and reactive balance are fixed at the bus,
- PV-bus: active balance and voltage magnitude are fixed at the bus.

Moreover, at the slack bus, the active balance equation is removed and replaced by an equation fixing the voltage phase angle at 0.

Let $$v_i$$ be the unknown voltage magnitude at bus $$i$$. Let $$\theta_i$$ be the unknown voltage phase angle at bus $$i$$. Equation fixing voltage magnitude to a reference (also called target) is simply written $$v_i = V^{ref}_i$$. Equation fixing voltage phase angle at slack bus $$i$$ is: $$\phi_i = 0$$

To build the active and reactive balance equations, OpenLoadFlow first expresses active and reactive power flowing from a bus to another through a line:

$$p_{i,j}= \rho_iv_i(G_i\rho_iv_i + Y\rho_iv_i\text{sin}(\Xi) - Y\rho_jv_j\text{sin}(\theta))$$

$$q_{i,j}= \rho_iv_i(-B_i\rho_iv_i + Y\rho_iv_i\text{cos}(\Xi) - Y\rho_jv_j\text{cos}(\theta))$$

Where $$Y$$ is the magnitude of the line complex admittance $$\frac{1}{R+jX}$$, and $$\Xi$$ such that: $$R+jX = \frac{1}{Y}e^{j(\frac{\pi}{2}-\Xi)}$$. $$\theta$$ satisfies: $$\theta= \Xi - A_i + A_j - \phi_i + \phi_j.$$

Beware that $$p_{i,j}$$ is the power at the exit of bus $$i$$.

Therefore, active and reactive balance equations are expressed as:

$$ P_i^{in} = \sum_{j \in v(i)} p_{i,j}$$

$$ Q_i^{in} = \sum_{j \in v(i)} q_{i,j}$$

where $$v(i)$$ is the set of buses linked to $$i$$ in the network graph.

Solving this non-linear equations system is done using the Newton-Raphson method. At each iteration, the local jacobian matrix $$J(v,\phi)$$ of the system is computed and a linear system based on this matrix is solved using its LU decomposition. 

#### Other regulation modes

PQ-bus and PV-bus are used to model local voltage magnitude or local reactive power controls. Other controls are supported in OpenLoadFLow:
- Remote voltage control for generators, static var compensators and two and three windings transformers with ratio tap changer. Control shared over several controllers buses is supported ;
- Remote reactive power control for generators ;
- For static var compensator with a voltage set point, the support of a voltage per reactive power control, also called slope, that modifies a bit the local voltage at connection bus. We only support a local control. 

##### Remote voltage control

In our explanation, we have two buses. A generator or more is connected to bus $$b_1$$, that is called controller bus. The remote bus $$b_2$$, where voltage should reach the target, is called controlled bus. The bus $$b_1$$ is no longer a PQ-bus and becomes a P-bus: only active power balance is fixed for that bus. Bus $$b_2$$ becomes a PQV-bus, where the voltage magnitude is fixed at the value defined by the voltage control. To resume:
- At controller bus $$b_1$$:
    - $$P_{b_1}^{in} = \sum_{j \in v(b_1)} p_{b_1,j}$$.
- At controlled bus $$b_2$$:
    - $$P_{b_2}^{in} = \sum_{j \in v(b_2)} p_{b_2,j}$$.
    - $$Q_{b_2}^{in} = \sum_{j \in v(b_2)} q_{b_2,j}$$.
    - $$v_{b_2} = V^{c}_{b_1}$$.
    
##### Remote reactive power control

A bus $$b_1$$ has, through a generator, a remote reactive power control on a branch $$(i,j)$$. This controller bus is treated as a P-bus: only active power balance is fixed for that bus. The reactive power flowing at side i on line $$(i,j)$$ is fixed by the control (it could be at side j too). To resume:
- At controller bus $$b_1$$:
    - $$P_{b_1}^{in} = \sum_{j \in v(b_1)} p_{b_1,j}$$.
- At controlled branch $$(i,j)$$:
    - $$q_{i,j} = Q^{c}_{b_1}$$.
    
##### Local voltage control for a static var compensator with a slope 

We only support the simple case where:
- Only one generator controlling voltage is connected to a bus. If other generators are present, they should have a local reactive power control ;
- The control is local ;
- No other generators from other controller buses are controlling the bus where the static var compensator is connected. Let's call it $$b_1$$.

In that case only, the voltage at bus $$b_1$$ is equal to $$v(b_1) + slope * q_{svc}$$.  

When a bus $$b_1$$ applies a remote reactive power control on a line $$(i,j)$$, bus $$b_1$$ is treated as a P-bus, that is, only active balance is fixed at bus $$b_1$$. The reactive power flowing at side i on line $$(i,j)$$ is fixed by the control. To resume:
- At bus $$b_1$$:
    - $$P_{b_1}^{in} = \sum_{j \in v(b_1)} p_{b_1,j}$$.
- At line $$(i,j)$$:
    - $$q_{i,j} = Q^{rctrl}_{b_1}$$.


### DC flows computing

The DC flows computing relies on several classical assumptions to build a model where the active power flowing through a line depends linearly from the voltage angles at its ends.
In this simple model, reactive power flows and active power losses are totally neglected. The following assumptions are made to ease and speed the computations:
- The voltage magnitude is equal to $$1 per unit$$ at each bus,
- The series conductance $$G_{i,j}$$ of each line $$(i,j)$$ is neglected, only the series susceptance $$B_{i,j}$$ is considered,
- The voltage angle difference between two adjacent buses is considered as very small.

Therefore, the power flows from bus $$i$$ to bus $$j$$ following the linear expression:

$$ P_{i,j} = \frac{\theta_i-\theta_j+A_{i,j}}{X_{i,j}} $$

Where $$X_{i,j}$$ is the serial reactance of the line $$(i,j)$$, $$\theta_i$$ the voltage angle at bus $$i$$ and $$A_{i,j}$$ is the phase angle shifting on side $$j$$.

DC flows computing gives a linear grid constraints system.
The variables of the system are, for each bus, the voltage angle $$\theta$$.
The constraints of the system are the active power balance at each bus, except for the slack bus.
The voltage angle at slack bus is set to zero.
Therefore the linear system is composed of $$N$$ variables and $$N$$ constraints, where $$N$$ is the number of buses in the network.

We introduce the linear matrix $$J$$ of this system that satisfies:

$$
\begin{align}
\texttt{If}~i~\text{is the slack bus}:&\\
&J_{i,i} = 1\\
\texttt{Else},~\text{let}~v(i)~\text{be the buses linked to}~i~\text{in the network graph}:&\\
&J_{i,i} = \sum_{j \in v(i)} \frac{1}{X_{i,j}}\\
&\forall j \in v(i), \quad J_{i,j} = - \frac{1}{X_{i,j}}\\
\text{All other entries of}~J~\text{are zeros}.&
\end{align}
$$

The right-hand-side $$b$$ of the system satisfied:

$$
\begin{align}
\texttt{If}~i~\text{is the slack bus}:&\\
&b_{i} = 0\\
\texttt{Else},~\text{let}~v(i)~\text{be the buses linked to}~i~\text{in the network graph}:&\\
&b_{i} = P_i - \sum_{j \in v(i)} \frac{A_{i,j}}{X_{i,j}}\\
\end{align}
$$

Where $$P_i$$ is the injection at bus $$i$$.

This linear system is resumed by:
$$ J\theta = b $$
The grid constraints system takes as variables the voltage angles.
Note that the vector $$b$$ of right-hand sides is linearly computed from the given injections and phase-shifting angles.

To solve this system, we follow the classic approach of the LU matrices decomposition $$ J = LU $$.
Hence by solving the system using LU decomposition, you can compute the voltage angles by giving as data the injections and the phase-shifting angles.

## Configuration
To use PowSyBl OpenLoadFlow for all power flow computations, you have to configure the `load-flow` module in your configuration file:
```yaml
load-flow:
  default-impl-name: "OpenLoadFlow"
```

### Specific parameters

**lowImpedanceBranchMode**  
The `lowImpedanceBranchMode` property is an optional property that defines how to deal with low impedance lines (when $$Z$$ is less than the $$10^{-8}$$ per-unit threshold).
Possible values are:
- Use `REPLACE_BY_ZERO_IMPEDANCE_LINE` if you want to consider a low impedance line has $$R$$ and $$X$$ equal to zero.
- Use `REPLACE_BY_MIN_IMPEDANCE_LINE` if you want to consider a low impedance line with a small value equal to the previously given threshold.

**throwsExceptionInCaseOfSlackDistributionFailure**  
The `throwsExceptionInCaseOfSlackDistributionFailure` is an optional property that defines if an exception has to be thrown in case of slack distribution failure.
This could happen in small synchronous component without enough generators or loads to balance the mismatch.
In that case, the remaining active power mismatch remains on the selected slack bus.

**voltageRemoteControl**  
The `voltageRemoteControl` property is an optional property that defines if the remote control for voltage controllers has to be modeled.
The default value is `true`.

**slackBusSelectorType**  
The `slackBusSelectorType` property is an optional property that defines how to select the slack bus. The three options are available through the configuration file:
- `First` if you want to choose the first bus of all the network buses, identified by the [slack terminal extension](../../grid/model/extensions.md#slack-terminal).
- `Name` if you want to choose a specific bus as the slack bus. In that case, the other `nameSlackBusSelectorBusId` property has to be filled.
- `MostMeshed` if you want to choose the most meshed bus as the slack bus. This option is required for computation with several synchronous component.

Note that if you want to choose the slack bus that is defined inside the network with a slackTerminal extension, you have to use the `LoadflowParameters`

**nameSlackBusSelectorBusId**  
The `nameSlackBusSelectorBusId` property is a required property if you choose `Name` for property `slackBusSelectorType`.
It defines the bus chosen for slack distribution by its ID.

**loadPowerFactorConstant**  
The `loadPowerFactorConstant ` property is an optional boolean property. The default value is `false`. This property is used in the outer loop that distributes slack on loads if :
- `distributedSlack` property is set to true in the [load flow default parameters](index.md#available-parameters),
- `balanceType` property is set to `PROPORTIONAL_TO_LOAD` or `PROPORTIONAL_TO_CONFORM_LOAD` in the [load flow default parameters](index.md#available-parameters).

If prerequisites fullfilled and `loadPowerFactorConstant` property is set to `true`, the distributed slack outer loop adjusts the load P value and adjusts also the load Q value in order to maintain the power factor as a constant value.
At the end of the load flow calculation, $$P$$ and $$Q$$ at loads terminals are both updated. Note that the power factor of a load is given by this equation :

$$
Power Factor = {\frac {P} {\sqrt {P^2+{Q^2}}}}
$$ 

Maintaining the power factor constant from an updated active power $$P^‎\prime$$ means we have to isolate $$Q^‎\prime$$ in this equation :

> $$
{\frac {P} {\sqrt {P^2+{Q^2}}}}={\frac {P^‎\prime} {\sqrt {P^‎\prime^2+{Q^‎\prime^2}}}}
$$

> Finally, a simple rule of three is implemented in the outer loop :

> $$
Q^\prime={\frac {Q P^\prime} {P}}
$$

If `balanceType` equals to `PROPORTIONAL_TO_LOAD`, the power factor remains constant scaling the global $$P0$$ and $$Q0$$ of the load.
If `balanceType` equals to `PROPORTIONAL_TO_CONFORM_LOAD`, the power factor remains constant scaling only the variable parts. Thus, we fully rely on [load detail extension](../../grid/model/extensions.md#load-detail).

The default value for `loadPowerFactorConstant` property is `false`.

**dcUseTransformerRatio**  
The `dcUseTransformerRatio` property is an optional property that defines if ratio of transformers should be used in the flow equations during DC approximation. The default value of this parameter is `true`.

**plausibleActivePowerLimit**  
The `plausibleActivePowerLimit` property is an optional property that defines a maximal active power limit for generators to be considered as participating elements for slack distribution (`balanceType` equals to `PROPORTIONAL_TO_GENERATION_P_MAX`). The default value is $10000 MW$.

**addRatioToLinesWithDifferentNominalVoltageAtBothEnds**  
The `addRatioToLinesWithDifferentNominalVoltageAtBothEnds` property is an optional property used for lines that are connected to two voltage level with different nominal voltages. If this property equals `true`, a structural ratio is taken into account to ease the convergence. The default value if `false`.  

### Configuration file example
See below an extract of a config file that could help:

```yaml
open-loadflow-default-parameters:
  lowImpedanceBranchMode: REPLACE_BY_ZERO_IMPEDANCE_LINE
  distributedSlack: true
  throwsExceptionInCaseOfSlackDistributionFailure: false
  voltageRemoteControl: false
  slackBusSelectorType: Name
  nameSlackBusSelectorBusId: Bus3_0
  remainsLoadPowerFactorConstant: true
```

At the moment, overriding the parameters by a JSON file is not supported by OpenLoadFlow.
