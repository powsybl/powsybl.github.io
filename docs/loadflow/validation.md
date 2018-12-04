---
title: Load-flow validation
layout: default
---

The load-flow validation aims at ensuring the consistency of load-flow results, and, more generally of any steady state (that may be found with an OPF or as the final state of a long dynamic simulation), with respect to a set of rules that
describes what is an *acceptable* load-flow result. On the most abstract level, a load-flow result is *acceptable* if it
describes a feasible steady-state of a power system given its physics and its logics. More practically, generations of
practitioners have set quasi-standard ways to describe them that allows to define precise rules.

Overall, tests should never be too tight and leniency is preferred to tightness in case approximations are needed or in
case expectations are unclear (typically when the input data is inconsistent). For example, there is a switch to test
only the main component because it is not clear what to expect from load flow results on small connected components.

Another important global setting is the `ok-missing-values` parameter, which determines if is OK to have missing
values or `NaN`. Normally, it should be set to false but it may be useful in the cases where the power flow results are
incomplete.

This documentation explains the tests done. The documentation of the load-flow validation command, including all its
parameters can be found [here](../tools/loadflow-validation.md).

# Buses
The first law of Kirchhoff must be satisfied for every bus for active and reactive power:


$$
\begin{align*}
    & | \sum_{\text{branches}} P + \sum \text{active power injection} \ < \text{threshold} \\
    & | \sum_{\text{branches}} Q + \sum \text{reactive power injection} | < \text{threshold} \\
\end{align*}
$$

If one value is missing, the test is OK.

If the result contains only the voltages (phase and angle), `com.powsybl.loadflow.resultscompletion.LoadFlowResultsCompletion` can be used to compute
the flows from the voltages in order to validate the rule, with the [run-computation](../tools/loadflow-validation.md#run-computation)
option.

# Branches
Lines and Two windings transformers are converted into an universal branch:
```
    V1*exp(j*theta1)     rho1*exp(j*alpha1)             r+j*x              rho1*exp(j*alpha1)   V2*exp(j*theta2)
        (P1,Q1)->      ____O/O__________________________-----__________________________O/O_____     <-(P2,Q2)
                                            |           -----           |
                                  g1+j*b1  |_|                         |_| g2+j*b2
                                            |                           |
                                           _|_                         _|_
                                            _                           _
                                            .                           .
```

- Power-flow results:
    - $(|V_1|, \theta_1)$ and $(|V_2|, \theta_2)$: Magnitude (kV) and angle $(°)$ of the voltage at the connection buses 1 and 2 respectively.
    - $(P_1,Q_1)$ and $(P_2,Q_2)$: Active power (MW) and reactive power (MVAr) injected in the branch on each side.
- Characteristics:
    - $(\rho_1, \alpha_1)$ and $(\rho_2, \theta_2)$: Magnitude (no unit) and angle $(°)$ of the ideal transformers ratios on each side.
    - $(g_1,b_1)$ and $(g_2,b_2)$: Complex shunt impedance on each side $(S)$.
    - (r,x): Complex series impedance $(\Omega)$.

Thanks to Kirchhoff laws (see [line](./docs/iidm/model/line.html) and [2-winding transformer](./docs/iidm/model/twoWindingsTransformer.html) documentation), estimations of powers are computed according to the voltages and the characteristics of the branch:

$$(P_1^\text{calc}, Q_1^\text{calc}, P_2^\text{calc}, Q_2^\text{calc}) = f(\text{Voltages}, \text{Characteristics})$$

The test of the branch is OK if:

$$\max( |P_1^\text{calc}-P1|, |Q_1^\text{calc}-Q1|, |P_2^\text{calc}-P2|, |Q_2^\text{calc}-Q2| ) \leq \text{threshold}$$


For a branch that is disconnected on one end (for example end 2), then $P_2 = $Q_2 = 0$. As a result, it is
possible to recompute $(V_2, \theta_2)$ which are usually not returned by power-flows and which are not stored in node-breaker
[IIDM](../iidm/model/index.md) format. Then, the same tests are done.

In case of missing results (usually the powers P1, Q1, P2, Q2 which are not mandatory), the test is always OK if
`ok-missing-values = true` and NOK if false. In case the voltages are available but not the powers, the
`com.powsybl.loadflow.resultscompletion.LoadFlowResultsCompletion` can recompute them using the validation equations (meaning
that the branch validation tests will always be OK but it allows to perform the bus validation tests).

# Three-windings transformers
To be implemented, based on a conversion into 3 two-windings transformers.

# Generators

## Active power
As there is no standard way to balance generation and consumption in power flow, the validation assumes that the power-flow 
results are balanced, meaning that, for all generators including those of the slack node:
$$ | targetP \text{ (Active Power Set Point)} - P \text{(Active power)}| < \text{threshold}$$

## Voltage and reactive power

### Voltage regulation deactivated
If the voltage regulation is deactivated, it is expected that:
$$ | targetQ \text{ (Reactive Power Set Point)} - Q \text{ (Reactive power)}| < \text{threshold}$$

### Voltage regulation activated
If the voltage regulation is activated, the generator is modelled as a PV/PQ node: the voltage target should be reached
except if reactive bounds are hit (PV mode). If the reactive bounds are hit, the reactive power should be equal to a limit.
Mathematically speaking, one of the following 3 conditions should be met:
$$
\begin{align*}
    |V-\text{targetV}&| \leq&& \text{threshold} && \& && \text{minQ} & \leq& Q \leq  \text{maxQ} \\
    V-\text{targetV} &<& -&\text{threshold} && \& && |Q-\text{maxQ}| &\leq& \text{threshold} \\
    \text{targetV}-V &<&&  \text{threshold} && \& && |Q-\text{minQ}| &\leq& \text{threshold}
\end{align*}
$$

There are a few tricks to handle special cases:
- if $\text{minQ}>\text{maxQ}$, then the values are switched to recover a meaningfull interval if `noRequirementIfReactiveBoundInversion = false`
- in case of a missing value, the corresponding test is OK
- $\text{minQ}$ and $\text{maxQ}$ are function of $P$. If \text{targetP} is outside $[\text{minP}, \text{maxP}]$, no test is done.

# Loads
To be implemented, with tests similar to generators with voltage regulation.

# Shunts
A shunt is expected not to generate or absorb active power:
$$
    | P | < \text{threshold}
$$

A shunt is expected to generate reactive power according to the number of actived section and to the susceptance per section:
$$
    | Q + \text{ #sections} * B  V^2 | < \text{threshold}
$$

# Static VAR Compensator
Static VAR Compensator behave like generators producing 0 active power except that their reactive bounds are expressed
in susceptance, so that they are voltage dependent.
$$
    \text{targetP} = 0 \text{ MW}
$$

- If the regulation mode is `OFF`, then `$\text{targetQ} = 0 \text{ MVAr}$
- If the regulation mode is `REACTIVE_POWER`, it behaves like a generator without voltage regulation
- If the regulation mode is `VOLTAGE`, it behaves like a generator with voltage regulation with the following bounds (dependent on the voltage, which is not the case for generators):
$\text{minQ} = - \text{Bmax} * V^2$ and $\text{maxQ} = - Bmin V^2$

# HVDC lines
To be done.

## VSC
VSC converter stations behave like generators with the additional constraints that the sum of active power on converter
stations paired by a cable is equal to the losses on the converter stations plus the losses on the cable.

## LCC
To be done.

# Ratio tap transformers
Ratio tap transformers have a tap with a finite discrete number of position that allows to change its characteristics,
especially the transformer ratio. Let assume that the logic is based on dead band: if the deviation between the measurement
and the set point is higher than the dead band width, the tap position is increased or decreased of one unit.

As a result, a state is a steady state only if the regulated value is within the dead band or if the tap position is at
minimum or maximum. To check this assertion, an upper bound of the dead-band value is needed. Generally, the value of the
dead-band is not know available in data models. Usual load flow solvers simply consider a continuous tap that is rounded
afterwards. As a result, one should compute an upper bound of the effect of the rounding. Under the usual situation where
the low voltage (side one) is controlled, the maximum effect is expected if the high voltage is fixed (usually it decreases)
and if the network connected to the low voltage is an antenna. If the transformer is perfect, the equations are:

With the current tap `tap`, and if the regulated side is side `TWO`:
$$
    V_2(\text{tap}) = \rho_\text{tap} V_1
$$

With the next tap, the new voltage would be:
$$
    V_2(\text{tap}+1) = \rho_{\text{tap}+1} V_1 = \frac{\rho_{\text{tap}+1}}{\rho_{\text{tap}}} V_2(\text{tap})
$$

We can therefore compute approximately the voltage increments corresponding to $\text{tap+1}$ and $\text{tap+1}$.

We then assume the *deadband* of the regulation to be equal to the voltage increase/decrease that can be performed with
taps $\text{tap+1}$ and $\text{tap+1}$:

$$
    \text{up deadband} = -\min(V_2(\text{tap+1})-V_2(\text{tap}), V_2(\text{tap-1})-V_2(\text{tap})) \\
    \text{down deadband} = \max(V_2(\text{tap+1})-V_2(\text{tap}), V_2(\text{tap-1})-V_2(\text{tap}))
$$

Finally, we check that the voltage deviation $\text{deviation} = V_2(\text{tap}) - \text{targetV2}$ stays inside the deadband.
- If $\text{deviation} < 0$, meaning that the voltage is too low, it should be checked if the deviation would be smaller by
increasing V2, i.e. the following condition should be satisfied: $|\text{deviation}| < \text{down deadband} + \text{threshold}$
- If $\text{deviation} > 0$, meaning that the voltage is too high, it should be checked if the deviation would be smaller by
decreasing V2, i.e. the following condition should be satisfied: $\text{deviation} < \text{up deadband}  + \text{threshold}$

The test is done only if the regulated voltage is on one end of the transformer and it always returns OK if the controlled
voltage is remote.

## References:
- 2018 iPST-day: [Steady-state validation](http://www.itesla-pst.org/pdf/iPST-PowSyBl-day-2018/04%20-%20iPST-PowSyBl%20day%20-%20Open-source%20steady-state%20validation.pdf)
