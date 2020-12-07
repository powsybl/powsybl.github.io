---
layout: default
latex: true
---

# OpenLoadFlow

PowSyBl OpenLoadFlow is an open-source power flow implementation in Java provided by PowSyBl. The source code is hosted on [GitHub](https://github.com/powsybl/powsybl-open-loadflow). 

* TOC
{:toc}

## Grid modelling

OpenLoadFlow computes power flows from IIDM grid model in bus/view topology. From the view, a very simple network, composed of only buses and branches is created. In the graph vision, we rely on a `Pi` model for branches (lines, transformers, dangling lines, etc.):

- `R` and `X` are respectively the real part (resistance) and the imaginary part (reactance) of the complex impedance ;  
- `G1` and `G2` are the real parts (conductance) on respectively side 1 and side 2 of the branch ;
- `B1` and `B2` are the imaginary parts (susceptance) on respectively side 1 and side 2 of the branch ;
- `A1` is the angle shifting on side 1, before the series impedance. For classical branches, the default value is zero ;
- `R1` is the ratio of voltages between side 2 and side 1, before the series impedance. For classical branches, the default value is `1`.

As the `Pi` model is created from IIDM grid modelling that locates its ratio and phase tap changers in side 1, `A2` and `R2` are always equal to zero and `1`. In case of a branch with voltage or phase control, the `Pi` model becomes an array. See below our model:

![Pi model](img/pi-model.svg){: width="50%" .center-image}

### AC flows computing

TO DO

### DC flows computing

The DC flows computing relies on several classical assumptions to build a model where the active power flowing through a line depends linearly from the voltage angles at its ends.
In this simple model, reactive power flows and active power losses are totally neglected. The following assumptions are made to ease and speed the computation:
- The voltage magnitude is equal to 1 per unit at each bus,
- The conductance \\(G_{i,j}\\) of each line \\((i,j)\\) is neglected, only the susceptance \\(B_{i,j}\\) is considered,
- The voltage angle difference between two adjacent buses is considered as very small.

Therefore, the power flows from bus \\(i\\) to bus \\(j\\) following the linear expression:

$$ P_{i,j} = \frac{\theta_i-\theta_j+\phi_{i,j}}{X_{i,j}} $$

Where \\(X_{i,j}\\) is the reactance of the line \\((i,j)\\), and \\(\theta_i\\) the voltage angle at bus \\(i\\).

The first step to compute the sensitivities is to build the grid constraints linear system. The variables of the system are, for each bus, the voltage angle \\(\theta\\). The constraints of the system are the active power balance at each bus, except for the slack bus. The voltage angle at slack bus is set to zero. Therefore the linear system is composed of \\(N\\) variables and \\(N\\) constraints, where \\(N\\) is the number of buses in the network:

$$ A\theta = b $$

The vector \\(b\\) of right-hand sides is linearly computed from the given injections and phase-shifting angles.

The second step consists in decomposing the square matrix \\(A\\) using the LU matrices decomposition $$ A = LU $$. Hence matrices \\(L\\) and \\(U\\) are obtained, it is quite easy to solve the grid constraints linear system. The solution of this system gives the voltage angles corresponding to injections at each bus (minus the slack bus). From those angles it is easy to compute the power flow on a given line using the previous formula.

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
The default value is `false`.

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
