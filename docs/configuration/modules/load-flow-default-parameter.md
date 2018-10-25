---
title: load-flow-default-parameters
layout: default
--- 

The `load-flow-default-parameters` module is used everytime a load-flow is run. It defines the default values for the
most common parameters a `com.powsybl.loadflow.LoadFlow` implementation should be able to handle. 

# Optional properties

## noGeneratorReactiveLimits
The `noGeneratorReactiveLimits` property is an optional property that defines if the load-flow is allowed to find a
setpoint value outside the reactive limits of a generator. The default value of this property is `false`.

## phaseShifterRegulationOn
The `phaseShifterRegulationOn` property is an optional property that defined if the load-flow is allowed to change taps
of a phase tap changer. The default value of this property is `false`.

## specificCompatibility
The `specificCompatibility` property is an optional property that defines if the load-flow run in a legacy mode
(implementation specific). The default value of this property is `false`.

## transformerVoltageControlOn
The `transformerVoltageControlOn` property is an optional property that defines if the load-flow is allowed to change
taps of a ratio tap changer. The default value of this property is `false`.

## voltageInitMode
The `voltageInitMode` property is an optional property that defines the policy used by the load-flow to initialize the
voltage values. The default value for this property is `UNIFORM_VALUES`. The available `com.powsybl.loadflow.LoadFlowParameters.VoltageInitMode`
values are:
- UNIFORM_VALUES: v=1pu, theta=0
- PREVIOUS_VALUES: use previous computed value from the network
- DC_VALUES: preprocessing to compute DC angles

# Examples

## YAML
```yaml
load-flow-default-parameters:
    noGeneratorReactiveLimits: false
    phaseShifterRegulationOn: false
    specificCompatibility: false
    transformerVoltageControlOn: false
    voltageInitMode: UNIFORM_VALUES
```

## XML
```xml
<load-flow-default-parameters>
    <noGeneratorReactiveLimits>false</noGeneratorReactiveLimits>
    <phaseShifterRegulationOn>false</phaseShifterRegulationOn>
    <specificCompatibility>false</specificCompatibility>
    <transformerVoltageControlOn>false</transformerVoltageControlOn>
    <voltageInitMode>UNIFORM_VALUES</voltageInitMode>
</load-flow-default-parameters>
```
