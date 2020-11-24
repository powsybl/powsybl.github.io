---
layout: default
latex: true
---

# OpenLoadFlow

PowSyBl OpenLoadFlow is an open-source power flow implementation in Java provided by PowSyBl. The source code is hosted on [GitHub](https://github.com/powsybl/powsybl-open-loadflow). 

* TOC
{:toc}

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
- `First` if you want to choose the first bus of all the network buses, identified by the [slack terminal extension]().
- `Name` if you want to choose a specific bus as the slack bus. In that case, the other `nameSlackBusSelectorBusId` property has to be filled.
- `MostMeshed` if you want to choose the most meshed bus as the slack bus. This option is required for computation with several synchronous component.

Note that if you want to choose the slack bus that is defined inside the network with a slackTerminal extension, you have to use the `LoadflowParameters`

**nameSlackBusSelectorBusId**  
The `nameSlackBusSelectorBusId` property is a required property if you choose `Name` for property `slackBusSelectorType`.
It defines the bus chosen for slack distribution by its ID.

**remainsLoadPowerFactorConstant**  
Optional boolean property (default value : false). This property is used in <span style="color: green">DistributedSlackOnLoad</span> outer loop if :
- `distributedSlack` property is set to true in [load-flow-default-parameters](https://www.powsybl.org/pages/documentation/simulation/powerflow/index.html#available-parameters "load-flow-default-parameters"),
- `balanceType` property is set to `PROPORTIONAL_TO_LOAD` or `PROPORTIONAL_TO_CONFORM_LOAD` in  [load-flow-default-parameters](https://www.powsybl.org/pages/documentation/simulation/powerflow/index.html#available-parameters "load-flow-default-parameters").

If prerequisites fullfilled and `remainsLoadPowerFactorConstant` property is set to true, when the outer loop adjust <span style="color: green">P</span> value,
it adjust <span style="color: green">Q</span> value too in order to remain <span style="color: red">power factor</span> a constant value (apply on total power if  `PROPORTIONAL_TO_LOAD`, only variable power if `PROPORTIONAL_TO_CONFORM_LOAD`).
At the end, loads elements in the network file produced as output, are updated with Q ending value.
<span style="color: red">Power Factor</span> is given with this equation :

$$
Power Factor = {\frac {P} {\sqrt {P^2+{Q^2}}}}
$$ 

Case 1 : `balanceType` = `PROPORTIONAL_TO_LOAD` : in order to remain <span style="color: red">power factor</span> a constant value with new $$P_2$$, it means we have to isolate $$Q_2$$ in this equation :

> $$
{\frac {P_1} {\sqrt {P^2_1+{Q^2_1}}}}={\frac {P_2} {\sqrt {P^2_2+{Q^2_2}}}}
$$

> Finally, a simple rule of three is implemented in <span style="color: green">DistributedSlackOnLoad</span> outer loop :

> $$
Q_2={\frac {Q_1P_2} {P_1}}
$$

Case 2 : `balanceType` = `PROPORTIONAL_TO_CONFORM_LOAD` : in order to remain <span style="color: red">variable power factor</span> a constant value with new $$P_2$$, it means we have to isolate $$Q_2$$ in this equation (V : variable part, F : fixed part) :

> $$
QV_2={\frac {QV_1PV_2} {PV_1}}
$$

> $$
Q_2-QF={\frac {(Q_1-QF)(P_2-PF)} {P_1-PF}}
$$

> $$
Q_2=QF+{\frac {(Q_1-QF)(P_2-PF)} {P_1-PF}}
$$


The default value for `remainsLoadPowerFactorConstant` property is `false`.

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
