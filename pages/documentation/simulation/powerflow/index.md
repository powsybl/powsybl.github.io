---
layout: default
latex: true
---

# Power flow

* TOC
{:toc}

## Introduction
The power flow is a numerical analysis of the flow of electric power in an interconnected system, where that system is considered to be in normal steady-state operation.
Power-flow or load-flow studies are important for planning future expansion of power systems as well as in determining the best operation of existing systems. 
The principal information obtained from the power-flow study is the magnitude and phase angle of the voltage at each bus, and the real and reactive power flowing in each line. 
In this page we'll go into some details about what is expected for a power flow result. It is possible to check the quality of the results using the 
[validation feature of PowSyBl]().
It makes it possible to ensure that the power flow results are consistent according to criteria described further on in this page.
These consistency checks may also be applied to results obtained with an optimal power flow or to the final state of a long dynamic simulation.
It is possible to use the PowSyBl validation through the command line via an iTools command.
Check the corresponding documentation [here]().

A load-flow result is considered *acceptable* if it
describes a feasible steady-state of a power system given its physics and its logics. More practically, generations of
practitioners have set quasi-standard ways to describe them that makes it possible to define precise rules.
Overall, in the PowSyBl validation the tests are not made overly tight. In particular, leniency is preferred to tightness in case approximations are needed or
when expectations are unclear (typically when the input data is inconsistent). For example, there is a switch to test
only the main component because it is not clear what to expect from load flow results on small connected components.

Another important global setting available in the PowSyBl validation is the `ok-missing-values` parameter, which determines if is OK to have missing
values or `NaN`. Normally, it should be set to false but it may be useful in the cases where the power flow results are
incomplete to go through the rest of the validation.

In this page, we'll go through the different expectations regarding power flow results, and the corresponding tests done
by the PowSyBl validation.

## Buses

### Expected results

The first law of Kirchhoff must be satisfied for every bus for active and reactive power:

$$
\begin{align*}
    & \left| \sum_{branches} P + \sum_{injections} P \right| \leq \epsilon \\
    & \left| \sum_{branches} Q + \sum_{injections} Q \right| \leq \epsilon \\
\end{align*}
$$

### Validation

If all values are present, or if only one value is missing, the result is considered to be consistent.
Note that if the result contains only the voltages (phase and angle), the PowSyBl validation provides a load-flow results completion feature.
It can be used to compute the flows from the voltages in order to ensure the results consistency, with the [run-computation]() option of
the PowSyBl validation.

## Branches
### Expected results
Lines and two windings transformers are converted into universal branches:
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

- Power-flow results:
    - $$(|V_1|, \theta_1)$$ and $$(|V_2|, \theta_2)$$: Magnitude (kV) and angle ($$°$$) of the voltage at the connection
buses 1 and 2 respectively.
    - $$(P_1, Q_1)$$ and $$(P_2, Q_2)$$: Active power (MW) and reactive power (MVAr) injected in the branch on each side.
- Characteristics:
    - $$(\rho_1, \alpha_1)$$ and $$(\rho_2, \alpha_2)$$: Magnitude (no unit) and angle ($$°$$) of the ideal transformers
ratios on each side.
    - $$(g_1, b_1)$$ and $$(g_2, b_2)$$: Complex shunt impedance on each side (S).
    - $$(r, x)$$: Complex series impedance $$(\Omega)$$.

Thanks to Kirchhoff laws (see the [line]() and [2-winding transformer]()
documentation), estimations of powers are computed according to the voltages and the characteristics of the branch:

$$(P_1^{calc}, Q_1^{calc}, P_2^{calc}, Q_2^{calc}) = f(\text{Voltages}, \text{Characteristics})$$

### Validation
The result on the branch is considered consistent if:

$$\max( \left| P_1^{calc} - P_1 \right|, \left| Q_1^{calc} - Q_1 \right|, \left| P_2^{calc} - P_2 \right|, \left| Q_2^{calc} - Q_2 \right| ) \leq \epsilon$$


For a branch that is disconnected on one end (for example end 2), then $$P_2 = Q_2 = 0$$. As a result, it is
possible to recompute $$(V_2, \theta_2)$$ which are usually not returned by power-flows and which are not stored in node-breaker
[IIDM](../iidm/model/index.md) format. The quality checks are done when this is done.

In case of missing results (usually the powers $$P_1$$, $$Q_1$$, $$P_2$$, $$Q_2$$ which are not mandatory), the PowSyBl validation
will consider the results as inconsistent, unless `ok-missing-values` was set to `true` by the user on purpose to make the consistency
check more lenient. 

In case the voltages are available but not the powers, the results completion feature of the PowSyBl validation
can be used to recompute them using the validation equations (meaning that the branch validation tests will always be OK, so that it allows to perform the bus validation tests).

## Three-windings transformers
<span style="color: red">To be implemented, based on a conversion into 3 two-windings transformers.</span>

## Generators

### Active power
#### Expected results
There may be an imbalance between the sum of generator active power setpoints $$\text{targetP}$$ on one side and consumption
and losses on the other side, in the power flow results. Note that, if it is possible to modify the setpoints during the computation
(for example if the results were computed by an Optimal Power Flow and not a Power Flow), there should be no imbalance left.

#### Validation
In case of an imbalance between the sum of generator active power setpoints $$\text{targetP}$$ on one side and consumption
and losses on the other side, the generation $$P$$ of some units is adjusted by the PowSyBl validation.
The adjustment is done by modifying the generation of the generators connected to the slack node of the network.

The slack node is a computation point designated to be the place where adjustments are done.

This way of performing the adjustment is the simplest solution from a mathematical point of view, but it presents several drawbacks.
In particular, it may not be enough in case of a large imbalance. 
This is why other schemes have been developed, called "distributed slack nodes". 
Loads could be adjusted, but this is generally not the case because loads are usually considered as inflexible. 
Generators are usually adjusted proportionally to a shift key to be defined. 
Three keys have been retained for the validation ($$g$$ is a generator):
- mode $$P_{max}$$: Proportional to $$F(g) = f(g) P_{max}(g)$$
- mode $${targetP}$$: Proportional to $$F(g) = f(g) targetP(g)$$
- mode $$P_{diff}$$: Proportional to $$F(g) = f(g) (P_{max}(g) - targetP(g))$$

$$f(g)$$ is a participation factor. In the current validation scheme, $$f(g)\in\{0,1\}$$. It is binary: either the unit
participates or not.

Since the load-flow results do not include the key used nor the participation factor, they have to be inferred. To do so, a
first iteration is done on units that deviate significantly. For each of these units, assuming one mode, the proportion
factor can be estimated. If deviations are perfect, the proportion factor $$\hat{K}$$ estimated for the right mode will
be the same for all the deviating units for which $$P$$ is strictly $$P_{min}$$ and $$P_{max}$$. Therefore, the inferred
deviation is the one for which the standard deviation of the estimated proportion factor is the lowest.

Once the mode is determined, the new target can be computed for each unit. The following check is done:

$$\left| \max(P_{min}, \min(P_{max}, (1+\hat{K} F(g)))) targetP - P \right| < \epsilon$$

### Voltage and reactive power

#### Voltage regulation deactivated
If the voltage regulation is deactivated, it is expected that:

$$\left| targetQ - Q \right| < \epsilon$$

#### Voltage regulation activated
If the voltage regulation is activated, the generator is modeled as a $$PV/PQ$$ node: the voltage target should be reached
except if reactive bounds are hit (PV mode). If the reactive bounds are hit, the reactive power should be equal to a limit.
Mathematically speaking, one of the following 3 conditions should be met:

$$
\begin{align*}
    |V - targetV| & \leq && \epsilon && \& && minQ & \leq & Q \leq maxQ \\
    V - targetV & < & -& \epsilon && \& && |Q-maxQ| & \leq & \epsilon \\
    targetV - V & < && \epsilon && \& && |Q-minQ| & \leq & \epsilon \\
\end{align*}
$$

There are a few tricks to handle special cases:
- if $$minQ > maxQ$$, then the values are switched to recover a meaningfull interval if `noRequirementIfReactiveBoundInversion = false`
- in case of a missing value, the corresponding test is OK
- $$minQ$$ and $$maxQ$$ are function of $$P$$. If $$targetP$$ is outside $$[minP, maxP]$$, no test is done.

## Loads
<span style="color: red">To be implemented, with tests similar to generators with voltage regulation.</span>

## Shunts
A shunt is expected not to generate or absorb active power:

$$\left| P \right| < \epsilon$$

A shunt is expected to generate reactive power according to the number of actived section and to the susceptance per section:
$$\left| Q + \text{#sections} * B  V^2 \right| < \epsilon$$

## Static VAR Compensators
Static VAR Compensators behave like generators producing 0 active power except that their reactive bounds are expressed
in susceptance, so that they are voltage dependent.

$$targetP = 0$$ MW

- If the regulation mode is `OFF`, then $$targetQ = 0$$ MVar
- If the regulation mode is `REACTIVE_POWER`, it behaves like a generator without voltage regulation
- If the regulation mode is `VOLTAGE`, it behaves like a generator with voltage regulation with the following bounds (dependent on the voltage, which is not the case for generators):
$$minQ = - Bmax * V^2$$ and $$maxQ = - Bmin V^2$$

## HVDC lines
<span style="color: red">To be done.</span>

### VSC
VSC converter stations behave like generators with the additional constraints that the sum of active power on converter
stations paired by a cable is equal to the losses on the converter stations plus the losses on the cable.

### LCC
<span style="color: red">To be done.</span>

## Ratio tap transformers

### Expected results
Ratio tap transformers have a tap with a finite discrete number of position that allows to change their transformer ratio. 
Let's assume that the logic is based on deadband: if the deviation between the measurement
and the setpoint is higher than the deadband width, the tap position is increased or decreased by one unit.

As a result, a state is a steady state only if the regulated value is within the deadband or if the tap position is at
minimum or maximum. 

### Validation
To check the previous assertion, an upper bound of the deadband value is needed. Generally, the value of the
deadband is not available in data models. Usual load flow solvers simply consider a continuous tap that is rounded
afterwards. As a result, one should compute an upper bound of the effect of the rounding. Under the usual situation where
the low voltage (side one) is controlled, the maximum effect is expected if the high voltage is fixed (usually it decreases)
and if the network connected to the low voltage is an antenna. If the transformer is perfect, the equations are:

With the current tap `tap`, and if the regulated side is side `TWO`:

$$V_2(tap) = \rho_{tap} V_1$$

With the next tap, the new voltage would be:

$$V_2(tap+1) = \rho_{tap+1} V_1 = \frac{\rho_{tap+1}}{\rho_{tap}} V_2(tap)$$

We can therefore compute approximately the voltage increments corresponding to $$tap+1$$ and $$tap+1$$.

We then assume the *deadband* of the regulation to be equal to the voltage increase/decrease that can be performed with
taps $$tap+1$$ and $$tap+1$$:

$$
\begin{align*}
    & \text{up deadband} = - \min(V_2(tap+1) - V_2(tap), V_2(tap-1) - V_2(tap)) \\
    & \text{down deadband} = \max(V_2(tap+1) - V_2(tap), V_2(tap-1) - V_2(tap)) \\
\end{align*}
$$

Finally, we check that the voltage deviation $$\text{deviation} = V_2(tap) - targetV2$$ stays inside the deadband.
- If $$deviation < 0$$, meaning that the voltage is too low, it should be checked if the deviation would be smaller by
increasing V2, i.e. the following condition should be satisfied: $$\left| deviation \right| < down deadband + threshold$$
- If $$deviation > 0$$, meaning that the voltage is too high, it should be checked if the deviation would be smaller by
decreasing V2, i.e. the following condition should be satisfied: $$deviation < up deadband  + threshold$$

The test is done only if the regulated voltage is on one end of the transformer and it always returns OK if the controlled voltage is remote.

## Implementations

The following power flow implementations are supported:
- [Open LoadFlow](openlf.md)
- [Hades2](https://rte-france.github.io/hades2/index.html): learn how to 
install Hades2 and use it with PowSyBl.

## Configuration
You first need to choose which implementation to use in your configuration file:
```yaml
loadflow:
  default-impl-name: "hades2"
```
or
```yaml
loadflow:
  default-impl-name: "open-loadflow"
```
Then, configure some generic parameters for all load flow implementations:
```yaml
load-flow-default-parameters:
    voltageInitMode: DC_VALUES
    transformerVoltageControlOn: false
    specificCompatibility: true 
```
<span style="color: red">TODO: describe all the options</span>


### Open LoadFlow configuration
<span style="color: red">TODO</span>

### Hades2 configuration
Once you have chosen Hades2 as a load flow implementation, you have to provide the path to your Hades2
installation:
```yaml
hades2:
    homeDir: <PATH_TO_HADES_2>
```
In this section, you may also choose the option `debug: true` to tell PowSyBl not to erase the
temporary folder created by Hades2 for the calculation. Thismakes it possible to 
check what happened on the Hades2 side for debugging purposes.

Then, you need to configure the load flow calculation itself, because the
sensitivity analysis of Hades2 relies on an initial load flow calculation. For example:
```yaml
hades2-default-parameters:
    balanceType: PROPORTIONAL_TO_LOAD
    computedConnectedComponentNumber: 0
    reactiveCapabilityCurveWithMoreThanThreePoints: THREE_POINTS_DIAGRAM
    withMinimumReactance: false
    minimumReactancePerUnit: 0.0007
    anglePerte: false
    remoteVoltageGenerators: true
    dcMode: false
    hvdcAcEmulation: false
```

**Supported parameters**

**Unsupported parameters**:

<span style="color: red">TODO: describe all the options</span>

## Going further
To go further about the power flow with PowSyBl, check the following pages:
- [Run a power flow through an iTools command](../../user/itools/loadflow.md): Learn how to perform a power flow calculation from the command line 
- [Load flow tutorial](../../developer/tutorials/loadflow.md)

## References
- 2018 iPST-day: [Steady-state validation](http://www.itesla-pst.org/pdf/iPST-PowSyBl-day-2018/04%20-%20iPST-PowSyBl%20day%20-%20Open-source%20steady-state%20validation.pdf)

