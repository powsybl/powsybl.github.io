---
layout: default
latex: true
---
# Dynaflow
If you have chosen Dynaflow as your load flow implementation, you can specify optionals properties 
in the specific simulation parameters. 

## Specific simulation parameters

### SvcRegulationOn
The `SvcRegulationOn` is an optional boolean property that defines if Svcs (Static Var Compensator) take part 
in the voltage regulation. The default value of this parameter is false.

### ShuntRegulationOn
The `ShuntRegulationOn` is an optional boolean property that defines if Shunts take part in the voltage regulation.
The default value of this parameter is false.

### AutomaticSlackBusOn
The `AutomaticSlackbusOn` is an optional boolean property that defines 
if Dynaflow computes the Slack bus (Phase reference bus) by itself or if the slack bus is already provided.
The default value of this parameter is true.

### VscAsGenerators
The `VscAsGenerators` is an optional boolean property that defines if Vscs (Voltage Source Converters) 
are modeled as generators. The default value of this parameter is true.

### LccAsLoads
The `LccAsLoads` is an optional boolean property that defines if Lccs (Line Commutated Converters) are modeled as loads.
The default value of this parameter is true.  

## Generic simulation parameters
Furthermore, only 2 parameters from the generic simulation parameters are 
transfered to Dynaflow. These parameters are : 
+ **NoGeneratorReactiveLimits** 
+ **PhaseShifterRegulationOn**   
You may see a description of these parameters [here](index.md)

##Example
This is an example of a loadflow parameters file with specific simulation parameters:
```json
{
  "version" : "1.0",
  "voltageInitMode" : "PREVIOUS_VALUES",
  "transformerVoltageControlOn" : true,
  "phaseShifterRegulationOn" : false,
  "noGeneratorReactiveLimits" : false,
  "specificCompatibility" : false,
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