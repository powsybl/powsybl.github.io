---
layout: default
---

# Hades2

Hades2 is a software edited by [RTE](https://www.rte-france.com), the french TSO. This simulator is distributed as a freeware (see the [license agreement](https://rte-france.github.io/hades2/license.html)).

* TOC
{:toc}

## Installation
Hades2 is available for GNU Linux and Windows. See the [installation guide](https://rte-france.github.io/hades2/index.html#installation-guide) to learn how install the software and use it with PowSyBl.

## Configuration
To use Hades2 with PowSyBl, you have to configure the `load-flow` module in your configuration file:
```yaml
load-flow:
  default-impl-name: "Hades2"
```

You also have to configure the `hades2` module to indicate where Hades2 software is installed. 
```yaml
hades2:
    homeDir: <PATH_TO_HADES_2>
```

In this section, you may also choose the option `debug: true` to tell PowSyBl not to erase the temporary folder created by Hades2 for the calculation.
This makes it possible to check what happened on the Hades2 side for debugging purposes.

## Specific parameters

Then, you need to configure the load flow calculation itself. For example:
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

The complete list of available parameters for the Hades2 load flow is available [here](https://rte-france.github.io/hades2/configuration/ADNLoadFlowParameters.html).

