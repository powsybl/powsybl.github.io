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

**shuntRegulationOn**  
The `shuntRegulationOn` is an optional boolean property that defines if Shunts take part in the voltage regulation.  

**automaticSlackBusOn**  
The `automaticSlackbusOn` is an optional boolean property that defines if DynaFlow computes the slack bus
(phase reference bus) by itself or if the slack bus is provided.  

**dsoVoltageLevel**  
The `dsoVoltageLevel` is an optional double property that defines the minimum voltage of level of loads.

**activePowerCompensation**  
The `activePowerCompensation` is an optional property that defines which type of power compensation applies.  
Values available **(TODO: describe them)** : 
- P
- TARGET_P
- PMAX

**settingPath**  
The `settingPath` is an optional property, it is used to indicates the file which defines the models association.

**assemblingPath**  
The `assemblingPath` is an optional property, it is used to indicates the file which defines the model settings values.

**startTime**  
The `startTime` is an optional property that defines the simulation start time (in s).

**stopTime**  
The `stopTime` is an optional property that defines the simulation stop time (in s).

**precision**  
The `precision` is an optional property that defines

**timeOfEvent**  
The `timeOfEvent` is an optional property that defines

**chosenOutputs**  
The `chosenOutputs` is an optinal array property that defines    
Values available **(TODO: describe them)** :
- STEADYSTATE
- LOSTEQ
- TIMELINE
- CONSTRAINTS

**timeStep**  
The `timeStep` is an optional parameter  

### Generic parameters
Furthermore, DynaFlow only supports two of the generic parameters:
- noGeneratorReactiveLimits
- phaseShifterRegulationOn

You may have a description of these parameters [here](index.md#parameters). The other parameters are ignored.

### Example

You may define those parameters in your configuration file:
```yaml
dynaflow-default-parameters:
    svcRegulationOn: true
    shuntRegulationOn: false
    automaticSlackBusOn: true
    dsoVoltageLevel: 987.6,
    activePowerCompensation: "P"
    settingPath: "path/to/settingFile"
    assemblingPath: "path/to/assemblingFile"
    startTime: 0.0
    stopTime: 100.0
    precision: 1.0
    timeOfEvent: 10.0
    chosenOutputs: [ "STEADYSTATE", "LOSTEQ", "TIMELINE", "CONSTRAINTS" ],
    timeStep: 2.6
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
      "svcRegulationOn" : true,
      "shuntRegulationOn" : false,
      "automaticSlackBusOn" : true,
      "dsoVoltageLevel" : 987.6,
      "activePowerCompensation" : "P",
      "settingPath" : "path/to/settingFile",
      "assemblingPath" : "path/to/assemblingFile",
      "startTime" : 0.0,
      "stopTime" : 100.0,
      "precision" : 1.0,
      "sa" : {
        "timeOfEvent" : 10.0
      },
      "chosenOutputs" : [ "STEADYSTATE", "LOSTEQ", "TIMELINE", "CONSTRAINTS" ],
      "timeStep" : 2.6
    }
  }
}
```
