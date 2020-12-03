---
layout: default
---

# DynaFlow

DynaFlow is a new steady-state simulation tool that aims at calculating the steady-state point by using a simplified time-domain simulation, guaranteeing the correctness of the solution found. You can find more information about it [here](https://dynawo.github.io/about/dynaflow).

* TOC
{:toc}

## Installation

<span style="color: red">TODO: explain how to install DynaFlow</span>

## Configuration
To use DynaFlow for all power flow computations, you have to configure the `load-flow` module in your configuration file:
```yaml
load-flow:
  default-impl-name: "DynaFlow"
```

### Specific parameters

**svcRegulationOn**  
The `svcRegulationOn` is an optional boolean property that defines if SVCs (Static Var Compensator) take part in the voltage regulation. The default value of this parameter is `false`.

**shuntRegulationOn**  
The `shuntRegulationOn` is an optional boolean property that defines if Shunts take part in the voltage regulation.
The default value of this parameter is `false`.

**automaticSlackBusOn**  
The `automaticSlackbusOn` is an optional boolean property that defines if DynaFlow computes the slack bus (phase reference bus) by itself or if the slack bus is provided.
The default value of this parameter is `true`.

**vscAsGenerators**
The `vscAsGenerators` is an optional boolean property that defines if VSCs (Voltage Source Converters) are modeled as generators.
The default value of this parameter is `true`.

**lccAsLoads**  
The `lccAsLoads` is an optional boolean property that defines if LCCs (Line Commutated Converters) are modeled as loads.
The default value of this parameter is `true`.

### Generic parameters
Furthermore, DynaFlow only supports two of the generic parameters:
- noGeneratorReactiveLimits
- phaseShifterRegulationOn

You may have a description of these parameters [here](index.md#parameters). The other parameters are ignored.

### Example

This is an example of a load flow parameters file with specific parameters for DynaFlow:
```json
{
  "version" : "1.4",
  "phaseShifterRegulationOn" : false,
  "noGeneratorReactiveLimits" : false,
  "extensions" : {
    "DynaflowParameters" : {
      "svcRegulationOn": true,
      "shuntRegulationOn": false,
      "automaticSlackBusOn": true,
      "vscAsGenerators": false,
      "lccAsLoads": true
    }
  }
}
```
