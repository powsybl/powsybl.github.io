---
layout: default
---

# Hades2

Hades2 is a software edited by [RTE](https://www.rte-france.com), the french TSO. This simulator is distributed as a freeware (see the [license agreement](https://rte-france.github.io/hades2/license.html)).
* TOC
{:toc}

## Installation
Read this [documentation page](https://rte-france.github.io/hades2/index.html) to learn how to 
install and configure PowSyBl to use the load flow of Hades2.

## Configuration
To use Hades2 and perform sensitivity analyses, you first need to add these lines to your YML configuration file:
```yaml
load-flow:
  default-impl-name: "hades2"
```
(it is actually the same configuration as for the load flow). Then, provide the path to your Hades2 installation:
```yaml
hades2:
    homeDir: <PATH_TO_HADES_2>
```
Then, you need to configure the load flow calculation itself, because the
sensitivity analysis of Hades2 relies on an initial load flow calculation. For example:
```yaml
load-flow-default-parameters:
    voltageInitMode: DC_VALUES
    transformerVoltageControlOn: false
    specificCompatibility: true 

hades2-default-parameters:
    dcMode: false
```
Read this [page](../loadflow/index.html#configuration) to learn how to 
configure PowSyBl to run a load flow using Hades2.

Finally, you need to choose which parameters specific to sensitivity analyses to use.
```yaml
hades2-default-sensitivity-parameters:
    computeSensitivityToPsts: true
    computeSensitivityToInjections: false
    resultsThreshold: 0
```
The complete list of parameters specific to sensitvity analyses is provided below:

**Supported parameters**
- `computeSensitivityToPsts` is a boolean: when set to false, Hades2 will not output any sensitivity
results for factors involving phase tap changers
- `computeSensitivityToInjections` is also a boolean: when activated, Hades2 will output the sensitivity
values with respect to all injections on the network, regardless of which factors were specified by the 
user. This may result in a very high number of sensitivity values, and degrade performance.
- to filter the results, it is possible to use the parameter `resultsThreshold`: all sensitivity values 
lower, in absolute value, to that threshold value, will not be present in the Hades2 output.
For example, if that threshold is set to 0.1, the only sensitivity values Hades2 will output will be
the ones lower than -0.1 and the ones greater than 0.1. Using this parameter may be very useful to
improve performances, since the time spent to exchange output data between Hades2 and PowSyBl may
be significant when large numbers of sensitivity values are present in the output.


**Unsupported parameters**
- `equationTypePst` may be set to `ANGLE_SHIFT_EQ` or `FLOW_EQ`, depending on whether the user wants to compute the sensitivity to angle shift modification, or flow modification, respectively. However, at the moment the flow modification sensitivity cannot be computed since the corresponding factor does not exist.
- `computeInitialLoadflow` should have the effect to enable or disable the initial loadflow computation
before sensitivity values are calculated, but it doesn't seem to have any effect.
- `hubPtdf` is not supported at the moment: if we integrate the PTDF calculation ype of Hades2 we should make it work but at the moment sensiDC calculations seem to fit our needs.
