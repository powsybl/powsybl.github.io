---
layout: default
latex: true
---

# Power flow

* TOC
{:toc}

## Introduction
The power flow is a numerical analysis of the flow of electric power in an interconnected system, where that system is considered to be in normal steady-state operation.
Power flow or load flow studies are important for planning future expansion of power systems as well as in determining the best operation of existing systems.
The principal information obtained from the power flow study is the magnitude and phase angle of the voltage at each bus, and the real and reactive power flowing in each line.
In this page we'll go into some details about what are the inputs and outputs of a load flow simulation, what is expected from a power flow result, how the validation feature of PowSyBl works, what power flow implementations are compatible with PowSyBl, and how to configure PowSyBl for the different implementations.

## Inputs

The only input for a power flow simulation is a network and optionally a set of parameters.

## Outputs

The power flow simulation outputs consists of: 
 - A network, which has been modified based on the simulation results. The modified variables are the active and reactive power at the terminals, the voltage and angle at all buses and taps.
 - A global status which is equal to `true` if at least one of the component of the network has converged, false otherwise.
 - Detailed results per synchronous component: a convergence status, the number of iterations (could be equal to `-1` if not relevant for a specific implementation), the selected slack bus (the bus at which the power balance has been done) and active power mismatch at slack bus.
 - Some metrics regarding the computation. Depending on the load flow implementation the content of these metrics may vary.
 - Logs in a simulator specific format.
 
## Validation

### Expected results

A load flow result is considered *acceptable* if it describes a feasible steady-state of a power system given its physics and its logics.
More practically, generations of practitioners have set quasi-standard ways to describe them that makes it possible to define precise rules.
They are described below for the different elements of the network.

#### Buses

The first law of Kirchhoff must be satisfied for every bus for active and reactive power:

$$
\begin{align*}
    & \left| \sum_{branches} P + \sum_{injections} P \right| \leq \epsilon \\
    & \left| \sum_{branches} Q + \sum_{injections} Q \right| \leq \epsilon \\
\end{align*}
$$

#### Branches
Lines and two windings transformers are converted into classical PI models:

<span style="color: red">TODO: make a proper sketch</span>

```
    V1*exp(j*theta1)     rho1*exp(j*alpha1)             r+j*x              rho2*exp(j*alpha2)   V2*exp(j*theta2)
        (P1,Q1)->      ____O/O__________________________-----__________________________O/O_____     <-(P2,Q2)
                                            |           -----           |
                                  g1+j*b1  |_|                         |_| g2+j*b2
                                            |                           |
                                           _|_                         _|_
                                            _                           _
                                            .                           .
```

- Power flow results:
    - $$(\|V_1\|, \theta_1)$$ and $$(\|V_2\|, \theta_2)$$: Magnitude (kV) and angle ($$°$$) of the voltage at the sides 1 and 2, respectively.
    - $$(P_1, Q_1)$$ and $$(P_2, Q_2)$$: Active power (MW) and reactive power (MVAr) injected in the branch on each side.
- Characteristics:
    - $$(\rho_1, \alpha_1)$$ and $$(\rho_2, \alpha_2)$$: Magnitude (no unit) and angle ($$°$$) of the ideal transformers
ratios on each side.
    - $$(g_1, b_1)$$ and $$(g_2, b_2)$$: Complex shunt impedance on each side (S).
    - $$(r, x)$$: Complex series impedance $$(\Omega)$$.

Thanks to Kirchhoff laws (see the [line](../../grid/model/index.md#line) and [2-winding transformer](../../grid/model/index.md#two-windings-transformer) documentation), estimations of powers are computed according to the voltages and the characteristics of the branch:

$$(P_1^{calc}, Q_1^{calc}, P_2^{calc}, Q_2^{calc}) = f(\text{Voltages}, \text{Characteristics})$$

#### Three-windings transformers
<span style="color: red">To be implemented, based on a conversion into 3 two-windings transformers.</span>

#### Generators

##### Active power
There may be an imbalance between the sum of generator active power setpoints $$\text{targetP}$$ on one side and consumption
and losses on the other side, after the load flow optimization process. Note that, if it is possible to modify the setpoints during the computation
(for example if the results were computed by an Optimal Power Flow and not a Power Flow), there should be no imbalance left.

In case of an imbalance between the sum of generator active power setpoints $$\text{targetP}$$ on one side and consumption
and losses on the other side, the generation $$P$$ of some units has to be adjusted.
The adjustment is done by modifying the generation of the generators connected to the slack node of the network.
It may also be done by modifying the loads connected to the slack node.
The slack node is a computation point designated to be the place where adjustments are done.

This way of performing the adjustment is the simplest solution from a mathematical point of view, but it presents several drawbacks.
In particular, it may not be enough in case of a large imbalance.
This is why other schemes have been developed, called "distributed slack nodes".

Generators or loads are usually adjusted proportionally to a shift function to be defined.
Three keys have been retained for the validation ($$g$$ is a generator):
Usual ways of defining this function, for each equipment that may be involved in the compensation (generator or load), read:
- proportional to $$P_{max}$$: $$F = f \times P_{max}$$
- proportional to $${targetP}$$: $$F = f \times targetP$$
- proportional to $$P_{diff}$$: $$F = f (P_{max} - targetP)$$

$$f$$ is a participation factor, per unit. For example, a usual definition is: $$f\in\{0,1\}$$: either the unit
participates or not. The adjustment is then done by doing:
$$P <- P \times \hat{K} \times F$$
where $$\hat{K}$$ is a proportionality factor, usually defined for each unit by $$\dfrac{P_{max}}{\sum{F}}$$, $$\dfrac{targetP}{\sum{F}}$$ or $$\dfrac{P_{diff}}{\sum{F}}$$
depending on the adjustment mode (the sums run over all the units participating to the compensation).

##### Voltage and reactive power

If the voltage regulation is deactivated, it is expected that:

$$\left| targetQ - Q \right| < \epsilon$$

If the voltage regulation is activated, the generator is modeled as a $$PV$$ node.
The voltage target should be reached, except if reactive bounds are hit. Then, the generator is switched to $$PQ$$ node and the reactive power should be equal to a limit.
Mathematically speaking, one of the following 3 conditions should be met:

$$
\begin{align*}
    |V - targetV| & \leq && \epsilon && \& && minQ & \leq & Q \leq maxQ \\
    V - targetV & < & -& \epsilon && \& && |Q-maxQ| & \leq & \epsilon \\
    targetV - V & < && \epsilon && \& && |Q-minQ| & \leq & \epsilon \\
\end{align*}
$$

#### Loads
<span style="color: red">To be implemented, with tests similar to generators with voltage regulation.</span>

#### Shunts
A shunt is expected not to generate or absorb active power:

$$\left| P \right| < \epsilon$$

A shunt is expected to generate reactive power according to the number of activated sections and to the susceptance per section $$B$$:
$$\left| Q + \text{#sections} * B  V^2 \right| < \epsilon$$

#### Static VAR Compensators
Static VAR Compensators behave like generators producing 0 active power except that their reactive bounds are expressed
in susceptance, so that they are voltage dependent.

$$targetP = 0$$ MW

- If the regulation mode is `OFF`, then $$targetQ$$ is constant
- If the regulation mode is `REACTIVE_POWER`, it behaves like a generator without voltage regulation
- If the regulation mode is `VOLTAGE`, it behaves like a generator with voltage regulation with the following bounds (dependent on the voltage, which is not the case for generators):
$$minQ = - Bmax * V^2$$ and $$maxQ = - Bmin V^2$$

#### HVDC lines
<span style="color: red">To be done.</span>

##### VSC
VSC converter stations behave like generators with the additional constraints that the sum of active power on converter
stations paired by a cable is equal to the losses on the converter stations plus the losses on the cable.

##### LCC
<span style="color: red">To be done.</span>

#### Transformers with a ratio tap changer

Transformers with a ratio tap changer have a tap with a finite discrete number of position that allows to change their transformer ratio.
Let's assume that the logic is based on deadband: if the deviation between the measurement
and the setpoint is higher than the deadband width, the tap position is increased or decreased by one unit.

As a result, a state is a steady state only if the regulated value is within the deadband or if the tap position is at
minimum or maximum: this corresponds to a valid load flow result for the ratio tap changers tap positions.

## Implementations

The following power flow implementations are supported:
- [PowSyBl OpenLoadFlow](openlf.md)
- [Hades2](hades2.md)

## Configuration
You first need to choose which implementation to use in your configuration file:
```yaml
load-flow:
  default-impl-name: "<IMPLEMENTATION_NAME>"
```

Each implementation is identified by its name, that may be unique in the classpath:
- use "OpenLoadFlow" to use PowSyBl OpenLoadFlow
- use "Hades2" to use RTE Hades2

## Parameters

Then, configure some generic parameters for all load flow implementations:
```yaml
load-flow-default-parameters:
    voltageInitMode: DC_VALUES
    transformerVoltageControlOn: false
    specificCompatibility: true
```

The parameters may also be overridden with a JSON file, in which case the configuration will look like:
```json
{
  "version" : "1.0",
  "voltageInitMode" : "PREVIOUS_VALUES",
  "transformerVoltageControlOn" : true,
  "phaseShifterRegulationOn" : false,
  "noGeneratorReactiveLimits" : true,
  "specificCompatibility" : false,
  "extensions" : {
    ...
  }
}
```

### Available parameters

**specificCompatibility**  
The `specificCompatibility` property is an optional property that defines whether the load flow runs in legacy mode (implementation specific) or not.
For example, Hades2 implementation uses this parameter to define whether the shunt admittance is split at each side of the serie impedance for lines. The default value is `false`.

**twtSplitShuntAdmittance**  
The `twtSplitShuntAdmittance` property is an optional property that defines whether the shunt admittance is split at each side of the serie impedance for transformers. The default value is `false`.

**voltageInitMode**  
The `voltageInitMode` property is an optional property that defines the policy used by the load flow to initialize the
voltage values. The default value for this property is `UNIFORM_VALUES`. The available values are:
- `UNIFORM_VALUES`: `v=1pu`, $$\theta=0$$
- `PREVIOUS_VALUES`: use previous computed value from the network
- `DC_VALUES`: preprocessing to compute DC angles

**distributedSlack**  
The `distributedSlack` property is an optional property that defines if the active power mismatch is distributed over the network or not. The default value is `true`.

**balanceType**  
The `balanceType` property is an optional property that defines, if `distributedSlack` parameter is set to true, how to manage the distribution. Several algorithms are supported. All algorithms follow the same scheme: only some elements are participating in the slack distribution, with a given participation factor. Three options are available:
- If using `PROPORTIONAL_TO_GENERATION_P_MAX` then the participating elements are the generators. The participation factor is computed using the maximum active power target $$MaxP$$ and the active power control droop. The default droop value is `4`. If present, the simulator uses the droop of the generator given by the [active power control extension]().
- If using `PROPORTIONAL_TO_GENERATION_P` then the participating elements are the generators. The participation factor is computed using the active power set point $$TargetP$$ and the active power control droop. The default droop value is `4`. If present, the simulator uses the droop of the generator given by the [active power control extension]().
- If using `PROPORTIONAL_TO_LOAD` then the participating elements are the loads. The participation factor is computed using the active power $$P0$$.
- If using `PROPORTIONAL_TO_CONFORM_LOAD` then the participating elements are the loads which have a conform active power part. The participation factor is computed using the [load detail extension](), which specifies the variable and the fixed parts of $$P0$$. The slack is distributed only on loads that have a variable part. If the extension is not available on a load, the whole $$P0$$ is considered as a variable.

This default value is `PROPORTIONAL_TO_GENERATION_P_MAX`.

**readSlackBus**  
The `readSlackBus` is an optional property that defines if the slack bus has to be selected in the network through the [slack terminal extension]().
The default value is `false`.

**writeSlackBus**   
The `writeSlackBus` is an optional property that says if the slack bus has to be written in the network using the [slack terminal extension]() after a load flow computation.
The default value is `false`.

**noGeneratorReactiveLimits**  
The `noGeneratorReactiveLimits` property is an optional property that defines whether the load flow is allowed to find a setpoint value outside the reactive limits of a generator or not.
The default value is `false`.

**phaseShifterRegulationOn**  
The `phaseShifterRegulationOn` property is an optional property that defines whether the load flow is allowed to change taps of a phase tap changer or not.
The default value is `false`.

**transformerVoltageControlOn**  
The `transformerVoltageControlOn` property is an optional property that defines whether the load flow is allowed to change taps of a ratio tap changer or not.
The default value is `false`.

**simulShunt**  
The `simulShunt` property is an optional property that defines whether the load flow is allowed to change sections of a shunt compensator with multiple sections or not.
The default value is `false`.

### Default parameters
The default values of all the optional properties are read from the [load-flow-default-parameter](../../user/configuration/load-flow-default-parameters.md) module, defined in the configuration file.

### Specific parameters
Some implementation use specific parameters that can be defined in the configuration file or in the JSON parameters file:
- [PowSyBl OpenLoadFlow parameters](openlf.md#parameters)
- [Hades2](hades2.md#specific-parameters)

## Going further
To go further about the power flow with PowSyBl, check the following pages:
- [Run a power flow through an iTools command](../../user/itools/loadflow.md): Learn how to perform a power flow calculation from the command line
- [Load flow tutorial](../../developer/tutorials/loadflow.md)
