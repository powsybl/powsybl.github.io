---
title: LoadFlowParameters
layout: default
---

The `com.powsybl.loadflow.LoadFlowParameters` class provides the generic parameters for all `com.powsybl.loadflow.LoadFlow`
implementations. Specific parameters should be provided as an extension of the `LoadFlowParameters` class.

# Properties

## noGeneratorReactiveLimits
The `noGeneratorReactiveLimits` property is an optional property that defines if the load-flow is allowed to find a
setpoint value outside the reactive limits of a generator.

## phaseShifterRegulationOn
The `phaseShifterRegulationOn` property is an optional property that defined if the load-flow is allowed to change taps
of a phase tap changer.

## specificCompatibility
The `specificCompatibility` property is an optional property that defines if the load-flow run in a legacy mode
(implementation specific).

## transformerVoltageControlOn
The `transformerVoltageControlOn` property is an optional property that defines if the load-flow is allowed to change
taps of a ratio tap changer.

## voltageInitMode
The `voltageInitMode` property is an optional property that defines the policy used by the load-flow to initialize the
voltage values. The default value for this property is `UNIFORM_VALUES`. The available `com.powsybl.loadflow.LoadFlowParameters.VoltageInitMode`
values are:
- UNIFORM_VALUES: v=1pu, theta=0
- PREVIOUS_VALUES: use previous computed value from the network
- DC_VALUES: preprocessing to compute DC angles

# Configuration
The default values of all the optional properties are read from the [load-flow-default-parameter](../modules/load-flow-default-parameters.md)
module, defined in the configuration file. 

## Examples
```json
{
  "version" : "1.0",
  "voltageInitMode" : "PREVIOUS_VALUES",
  "transformerVoltageControlOn" : true,
  "phaseShifterRegulationOn" : false,
  "noGeneratorReactiveLimits" : true,
  "specificCompatibility" : false,
  "extensions" : {
    ...
  }
}
```
