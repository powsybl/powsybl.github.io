---
layout: default
---

# DynaFlow

DynaFlow is a new steady-state simulation tool that aims at calculating the steady-state point by using a simplified time-domain simulation, guaranteeing the correctness of the solution found. You can find more information about it [here](https://dynawo.github.io/about/dynaflow).

* TOC
{:toc}

## Installation

You may download DynaFlow release packages from [here](https://github.com/dynawo/dynaflow-launcher/releases).


## Configuration

You need to tell powsybl where to find DynaFlow, by adding this into you configuration file:
```yaml
dynaflow:
    homeDir: /path/to/dynaflow  # Directory obtained by unzipping the package, should contain "bin"
    debug: false
```

To use DynaFlow as a default for all power flow computations, you may configure the `load-flow`
module in your configuration file:
```yaml
load-flow:
    default-impl-name: "DynaFlow"
```

### Specific parameters

**svcRegulationOn**  
The `svcRegulationOn` is an optional boolean property that defines if SVCs (Static Var Compensator) take part
in the voltage regulation.  
The default value of this parameter is `false`.

**shuntRegulationOn**  
The `shuntRegulationOn` is an optional boolean property that defines if Shunts take part in the voltage regulation.  
The default value of this parameter is `false`.

**automaticSlackBusOn**  
The `automaticSlackbusOn` is an optional boolean property that defines if DynaFlow computes the slack bus
(phase reference bus) by itself or if the slack bus is provided.  
The default value of this parameter is `true`.

**dsoVoltageLevel**  
The `dsoVoltageLevel` is an optional double property that defines  
The default value of this parameter is `45.0`.

**chosenOutputs**  
The `chosenOutputs` is an optinal array property that defines  
The default value of this parameter is `[ "STEADYSTATE" ]`.

**vscAsGenerators**  
The `vscAsGenerators` is an optional boolean property that defines if VSCs (Voltage Source Converters)
are modeled as generators.  
The default value of this parameter is `true`.

**lccAsLoads**  
The `lccAsLoads` is an optional boolean property that defines if LCCs (Line Commutated Converters) are modeled as loads.  
The default value of this parameter is `true`.

**timeStep**  
The `timeStep` is an optional parameter  
The default value of this parameter is `2.6`.

### Generic parameters
Furthermore, DynaFlow only supports two of the generic parameters:
- noGeneratorReactiveLimits
- phaseShifterRegulationOn

You may have a description of these parameters [here](index.md#parameters). The other parameters are ignored.

### Example

You may define those parameters in your configuration file:
```yaml
dynaflow-default-parameters:
    svcRegulationOn: false
    shuntRegulationOn: false
    automaticSlackBusOn: false
    dsoVoltageLevel: 987.6,
    chosenOutputs : [ "STEADYSTATE", "LOSTEQ", "TIMELINE", "CONSTRAINTS" ],
    vscAsGenerators : true,
    lccAsLoads : true,
    timeStep : 2.6
```


Alternatively, you can provide parameters as a JSON file where supported
(for example when using `itools loadflow` command):
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
      "dsoVoltageLevel": 987.6,
      "chosenOutputs" : [ "STEADYSTATE", "LOSTEQ", "TIMELINE", "CONSTRAINTS" ],
      "vscAsGenerators" : true,
      "lccAsLoads" : true,
      "timeStep" : 2.6
    }
  }
}
```
