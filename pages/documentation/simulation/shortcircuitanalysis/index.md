---
layout: default
latex: true
---

# Short circuit API

* TOC
{:toc}

## Introduction
When a short circuit occurs in a network, the currents on equipment can be so high that they exceed their rated values.
Simulating faults on the network is important to verify that the short circuits are well detected and do not damage the equipments.

The short-circuit API allows the calculation of currents and voltages on a network after a fault. 
For the moment, no simulator is available to compute the analysis, but it is possible to connect one to this API.


## Parameters

### Available parameters
The parameters to be used for the short-circuit calculation should be defined in the config.yml file. For example, here are some valid short-circuit parameters:

```yaml
short-circuit-parameters:
  with-voltage-result: false
  with-feeder-result: true
  with-limit-violations: true
  study-type: TRANSIENT
  with-fortescue-result: false
  min-voltage-drop-proportional-threshold: 20
  with-loads: true
  with-shunt-compensators: true
  with-vsc-converter-stations: false
  with-neutral-position: true
  initial-voltage-profile-mode: CONFIGURED
  voltage-ranges: /path/to/voltage/ranges/file
```

Available parameters in the short-circuit API are stored in `com.powsybl.shortcircuit.ShortCircuitParameters`. They are all optional.

**with-limit-violations**

This property indicates whether limit violations should be returned after the computation. The violations that should be used are `LOW_SHORT_CIRCUIT_CURRENT` and `HIGH_SHORT_CIRCUIT_CURRENT`.
It can be used to filter results where the computed short-circuit current is too high or too low. The default value is `true`.

**with-fortescue-result**

This property indicates if the computed results, like currents and voltages, should be returned only in three-phased magnitude or detailed with magnitude and angle on each phase.
According to this property, different classes to return results can be used. If it is set to false, the classes `MagnitudeFaultResult`, `MagnitudeFeederResult` and `MagnitudeShortCircuitBusResult` should be used.
If the property is true, the classes `FortescueFaultResult`, `FortescueFeederResult` and `FortescueShortCircuitBusResult` should be used. All these classes are in `com.powsybl.shortcircuit`.
The default value is `true`.

**with-feeder-result**

This property indicates if the contributions of each feeder to the short-circuit current at the fault should be computed. 
If the property is set to true, the results can be stored in class `com.powsybl.shortcircuit.FeederResult`. 
The default value is `true`.

**study-type**

This property indicates the type of short-circuit study. It can be:
- `SUB_TRANSIENT`: it is the first stage of the short circuit, right when the fault happens. In this case, it is the subtransient reactance of generators that is used. 
This reactance can either be stored in the network or calculated from the transient reactance of generators with a coefficient defined by the parameter `sub-transient-coefficient`.
- `TRANSIENT`: the second stage of the short circuit, before the system stabilizes. The transient reactance of generators will be used.
- `STEADY_STATE`: the last stage, once all transient effects are gone.

The default value is `TRANSIENT`. The transient and subtransient reactances of the generators are stored in the [short circuit generator extension.](../../grid/model/extensions.md#generator-short-circuit)

**sub-transient-coefficient**

This property allows to define an optional coefficient, in case of a subtransient study, to apply to the transient reactance of generators to get the subtransient one:

$$X''_d = c \times X'_d$$

with:

- $$X''_d$$: the sub-transient reactance
- $$c$$: the sub-transient coefficient defined in this property
- $$X'_d$$: the transient reactance

By default, the value of the coefficient is 0.7, and it should not be higher than 1.

**with-voltage-result**

This property indicates if the voltage profile should be computed on every node of the network. The results, if this property is `true`, should be stored in class `com.powsybl.shortcircuit.ShortCircuitBusResult`. The default value is `true`.

**min-voltage-drop-proportional-threshold**

This property indicates a threshold to filter the voltage results. Thus, it only makes sense if `with-voltage-result` is set to true. 
Only the nodes where the voltage drop due to the short circuit is above this property are kept. 
The voltage drop is calculated as the ratio between the initial voltage magnitude on the node and the voltage magnitude on the node after the fault. The default value is `0`.

**with-loads**

This property indicates whether loads should be taken into account during the calculation. If `true`, the loads are modelled as an equivalent reactance and the equivalent reactance at the fault point will be lowered. If `false`, then they will be ignored.

**with-shunt-compensators**

This property indicates if shunt compensators should be taken into account during the computation. If `true`, the shunt compensators will be modelled as an equivalent reactance.
If `false`, then the shunt compensators will be ignored.

**with-vsc-converter-stations**

This property is a boolean property that indicates whether the VSC converter stations should be included in the calculation. 
If `true`, the VSC converter stations will be modeled as an equivalent reactance. If `false`, they will be ignored.

**with-neutral-position**

This property indicates which position of the tap changer of transformers should be used for the calculation. If `true`, the neutral step of the tap changer
is used. The neutral step is the one for which $$\rho = 1$$ and $$\alpha = 0$$. If `false`, then the step that is in the model will be used. 
By default, this property is set to false.
For more information about tap changers, see [the documentation about it](../../grid/model/index.md#phase-tap-changer).

**initial-voltage-profile-mode**

This property defines the voltage profile that should be used for the calculation. Three options are available:
- `NOMINAL`: the nominal voltage profile is used for the calculation
- `PREVIOUS`: the voltage profile from the loadflow will is for the calculation
- `CONFIGURED`: the voltage profile is specified by the user
In the case of CONFIGURED voltage profile, ranges of nominal voltages with multiplicative coefficients must be specified in the `voltage-ranges` property.
By default, the initial voltage profile mode is set to `NOMINAL`.

**voltage-ranges**

This property specifies a path to a JSON file containing the voltage ranges and associated coefficients to be used when `initial-voltage-profile-mode` is set to `CONFIGURED`.
The JSON file must contain a list of voltage ranges and coefficients. Then, for each nominal voltage in the network that belongs to the range, the given coefficient is applied to calculate the voltage to be used 
in the calculation. All the coefficients should be between 0.8 and 1.2.
Here is an example of this JSON file:
````json
[
    {
      "minimumNominalVoltage": 350.0, 
      "maximumNominalVoltage": 400.0,
      "voltageRangeCoefficient": 1.1
    },
    {
      "minimumNominalVoltage": 215.0,
      "maximumNominalVoltage": 235.0,
      "voltageRangeCoefficient": 1.2
    },
    {
      "minimumNominalVoltage": 80.0,
      "maximumNominalVoltage": 150.0,
      "voltageRangeCoefficient": 1.05
    }
]
````


### FaultParameters

It is possible to override parameters for each fault by creating an instance of `com.powsybl.shortcircuit.FaultParameters`. This object will take the fault to which it applies and all the parameters
for this specific fault. One `FaultParameters` corresponds to one `Fault`.
A list of `FaultParameters` can be given as an input to the API with specific parameters for one or multiple faults. If a fault has no `FaultParameters` corresponding, then the general parameters will be used.

## Inputs

The API takes as inputs:

**A network**

It is the network on which the computation will be done.

**A list of faults**

The API takes as input a list of faults on which the calculation should be done. Faults on buses and on lines are supported.
Each fault can either be an instance of `com.powsybl.shortcircuit.BusFault` or `com.powsybl.shortcircuit.BranchFault`.

The attributes to fill of a `BusFault` are:

| Attribute  | Type           | Unit | Required | Default value           | Description                                                                                             |
|------------|----------------|------|----------|-------------------------|---------------------------------------------------------------------------------------------------------|
| id         | String         | -    | yes      | -                       | The id of the fault                                                                                     |
| elementId  | String         | -    | yes      | -                       | The id of the bus on which the fault will be simulated (bus/view topology)                                                 |
| r          | double         | Ω    | no       | 0                       | The fault resistance to ground                                                                          |
| x          | double         | Ω    | no       | 0                       | The fault reactance to ground                                                                           |
| connection | ConnectionType | -    | no       | `ConnectionType.SERIES` | The way the resistance and reactance of the fault are connected to the ground: in series or in parallel |
| faultType  | FaultType      | -    | no       | `FaultType.THREE_PHASE` | The type of fault simulated: can be three-phased or single-phased                                       |

The attributes to fill of a `BranchFault` are:

| Attribute            | Type           | Unit | Required | Default value           | Description                                                                                             |
|----------------------|----------------|------|----------|-----------------------  |---------------------------------------------------------------------------------------------------------|
| id                   | String         | -    | yes      | -                       | The id of the fault                                                                                     |
| elementId            | String         | -    | yes      | -                       | The id of the branch on which the fault will be simulated                                               |
| r                    | double         | Ω    | no       | 0                       | The fault resistance to ground                                                                          |
| x                    | double         | Ω    | no       | 0                       | The fault reactance to ground                                                                           |
| connection           | ConnectionType | -    | no       | `ConnectionType.SERIES` | The way the resistance and reactance of the fault are connected to the ground: in series or in parallel |
| faultType            | FaultType      | -    | no       | `FaultType.THREE_PHASE` | The type of fault simulated: can be three-phased or single-phased                                       |
| proportionalLocation | double         | %    | yes      | -                       | The position where the fault should be simulated, in percent of the line                                |

**A list of FaultParameters**

Optionally, it is possible to specify a list of `FaultParameters`. Each `FaultParameter` will override the default parameters for a given fault.
For more information on parameters, see [above](#faultparameters).

## Outputs
The results of the short circuit analysis are stored in `com.powsybl.shortcircuit.ShortCircuitAnalysisResult`. This class gathers the results for every fault, they are accessible either by the ID of the fault or the ID of the element on which the fault is simulated.
For each fault, an object `com.powsybl.shortcircuit.FaultResult` is returned.

Depending on `with-fortescue-result`, the returned result should either be an instance of `com.powsybl.shortcircuit.MagnitudeFaultResult` or `com.powsybl.shortcircuit.FortescueFaultResult`.

Both classes contain the following attributes:

| Attribute              | Type                        | Unit | Required | Default value | Description                                                                                              |
|------------------------|-----------------------------|------|----------|---------------|----------------------------------------------------------------------------------------------------------|
| fault                  | Fault                       | -    | yes      | -             | The fault that was simulated                                                                             |
| status                 | Status                      | -    | yes      | -             | The status of the computation, see below for more details                                                |
| shortCircuitPower      | double                      | MVA  | yes      | -             | The value of the short circuit power                                                                     |
| timeConstant           | Duration                    | -    | yes      | -             | The duration before reaching the permanent short circuit current                                         |
| feederResults          | List<FeederResult>          | -    | no       | Empty list    | A list of FeederResult, should not be empty if the parameter `with-feeder-result` is set to `true`.        |
| limitViolations        | List<LimitViolation>        | -    | no       | Empty list    | A list of LimitViolation, should be empty if the parameter `with-limit-violations` is set to `false`.      |
| shortCircuitBusResults | List<ShortCircuitBusResult> | -    | no       | Empty list    | A list of ShortCircuitBusResult, should be empty if the parameter `with-voltage-result` is set to `false`. |

However, in these classes, the short circuit current and voltage are represented differently.

In `MagnitudeFaultResult`, the additional attributes are:

| Attribute | Type   | Unit | Required | Default value | Description                                                      |
|-----------|--------|------|----------|---------------|------------------------------------------------------------------|
| current   | double | kA   | yes      | -             | The three-phased magnitude of the computed short circuit current |
| voltage   | double | kV   | yes      | -             | The three-phased magnitude of the computed short circuit voltage |

In `FortescueFaultResult`, they are:

| Attribute | Type             | Unit | Required | Default value | Description                                                                                |
|-----------|------------------|------|----------|---------------|--------------------------------------------------------------------------------------------|
| current   | `FortescueValue` | kA   | yes      | -             | The magnitude and angle of the computed short circuit current detailed on the three phases |
| voltage   | `FortescueValue` | kV   | yes      | -             | The magnitude and angle of the computed short circuit voltage detailed on the three phases |


**The status of the computation**

This status can be:
- `SUCCESS`: the computation went as planned and the results are full considering the parameters.
- `NO_SHORTCIRCUIT_DATA`: this status should be returned if no short circuit data are available in the network, i.e. the subtransient or transient reactance of generators and the minimum and maximum admissible short circuit currents.
- `SOLVER_FAILURE`: the computation failed because of an error linked to the solver.
- `FAILURE`: the computation failed for any other reason.

**FeederResults**

This field contains the contributions of each feeder to the short circuit current as a list. It should only be returned if `with-feeder-result` is set to `true`.
Depending on the value of `with-fortescue-result`, it should be an instance of `com.powsybl.shortcircuit.MagnitudeFeederResult` or `com.powsybl.shortcircuit.FortescueFeederResult`.

The attributes of `MagnitudeFeederResults` are:

| Attribute     | Type   | Unit | Required | Default value | Description                                                                                   |
|---------------|--------|------|----------|---------------|-----------------------------------------------------------------------------------------------|
| connectableId | String | -    | yes      | -             | ID of the feeder                                                                              |
| current       | double | kA   | yes      | -             | Three-phased current magnitude of the feeder participating to the short circuit current at the fault point | 

The attributes of `FortescueFeederResuts` are:

| Attribute     | Type             | Unit | Required | Default value | Description                                                                                                                   |
|---------------|------------------|------|----------|---------------|-------------------------------------------------------------------------------------------------------------------------------|
| connectableId | String           | -    | yes      | -             | ID of the feeder                                                                                                              |
| current       | `FortescueValue` | kA   | yes      | -             | Current magnitudes and angles on the three phases of the feeder participating to the short circuit current at the fault point |

**LimitViolations**

This field contains a list of all the violations after the fault. This implies to have defined in the network the maximum or the minimum acceptable short circuit currents on the voltage levels.
Then, with comparing to the computed short circuit current, two types of violations can be created: `LOW_SHORT_CIRCUIT_CURRENT` and `HIGH_SHORT_CIRCUIT_CURRENT`.
This list should be empty if the property `with-limit-violations` is set to `false`.

**ShortCircuitBusResults**

This field contains a list of voltage results on every bus of the network after simulating the fault. It should be empty if `with-voltage-result` is set to `false`.
The value of the property `with-voltage-drop-threshold` allows to filter these results by keeping only those where the voltage drop is higher than this defined threshold.
Depending on the value of `with-fortescue-result`, the list should contain instances of either `com.powsybl.shortcircuit.MagnitudeShortCircuitBusResult` or `com.powsybl.shortcircuit.FortescueShortCircuitBusResult` objects.


The attributes of `MagnitudeShortCircuitBusResult` are:

| Attribute               | Type   | Unit | Required | Default value | Description                                            |
|-------------------------|--------|------|----------|---------------|--------------------------------------------------------|
| voltageLevelId          | String | -    | yes      | -             | ID of the voltage level containing the bus             |
| busId                   | String | -    | yes      | -             | ID of the bus                                          | 
| initialVoltageMagnitude | double | kV   | yes      | -             | Magnitude of the three-phased voltage before the fault |
| voltageDropProportional | double | %    | yes      | -             | Voltage drop after the fault                           |
| voltage                 | double | kV   | yes      | -             | Magnitude of the three-phased voltage after the fault  |

The attributes of `FortescueShortCircuitBusResult` are:

| Attribute               | Type             | Unit | Required | Default value | Description                                                              |
|-------------------------|------------------|------|----------|---------------|--------------------------------------------------------------------------|
| voltageLevelId          | String           | -    | yes      | -             | ID of the voltage level containing the bus                               |
| busId                   | String           | -    | yes      | -             | ID of the bus                                                            | 
| initialVoltageMagnitude | double           | kV   | yes      | -             | Magnitude of the three-phased voltage before the fault                   |
| voltageDropProportional | double           | %    | yes      | -             | Voltage drop after the fault                                             |
| voltage                 | `FortescueValue` | kV   | yes      | -             | Magnitudes and angles of the voltage on the three phases after the fault |
