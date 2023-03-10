---
layout: default
---

# Short circuit API

* TOC
{:toc}

## Introduction
When a short circuit occurs in a network, then the currents on equipment can exceed their rated values.
Simulating faults on the network is important to verify that the short circuits are well detected and do not damage the equipments.

The short circuit API allows to compute the currents and voltages on a network after a fault. 
For the moment, no simulator is available to compute the analysis, but it is possible to plug one to this API.


## Parameters
The parameters to be used for the short circuit calculation should be defined in the config.yml file. For example, here are some valid short circuit parameters:

```yaml
short-circuit-parameters:
  with-voltage-map: false
  with-feeder-result: true
  with-limit-violations: true
  study-type: TRANSIENT
  min-voltage-drop-proportional-threshold: 20
```

Available parameters in the short circuit API are stored in `com.powsybl.shortcircuit.ShortCircuitParameters`.

**withLimitViolations**
This property indicates whether limit violations should be returned after the computation. The limit Violations that should be used are LOW_SHORT_CIRCUIT_CURRENT and HIGH_SHORT_CIRCUIT_CURRENT.
It allows to filter results where the short circuit current would be too high or too low.

**withFortescueResult**
This property indicates if the result should be given only in three phased magnitude or detailed with magnitude and angle on each phase.
Different classes to return results can be used: `com.powsybl.shortcircuit.MagnitudeFaultResult`, `com.powsybl.shortcircuit.MagnitudeFeederResult` and `com.powsybl.shortcircuit.MagnitudeShortCircuitBusResult` if the property is false
and `com.powsybl.shortcircuit.FortescueFaultResult`, `com.powsybl.shortcircuit.FortescueFeederResult` and `com.powsybl.shortcircuit.FortescueShortCircuitBusResult` if the property is true.

**withFeederResult**
This property indicates if the contributions of each feeder to the short circuit current at the fault point should be computed. If the property is set to true, the results can be stored in class `com.powsybl.shortcircuit.FeederResult`.

**studyType**
This property indicates the type of short circuit study. It can be transient, subtransient or steady-state. According to the study type, different values for the generators reactance will be used.

**withVoltageResult**
This property indicates if the voltage map should be computed on every node of the network. The results if this property is true should be stored in class `com.powsybl.shortcircuit.ShortCircuitBusResult`.

**minVoltageDropProportionalThreshold**
This property indicates a threshold to filter the voltage results. Only the nodes where the voltage drop due to the short circuit is above this property should be kept.

It is possible to override parameters for each fault by creating an instance of `com.powsybl.shortcircuit.FaultParameters`. Then, a list should be given as an input to the API, and the fault corresponding to the FaultParameter should be specified.

## Inputs

The API takes as input:

**A network**
It is the network on which the computation will be done.

**A list of faults**
The API takes as input a list of faults of which the calculation should be done.
Each fault can either be an instance of BusFault or BranchFault.
The attributes of a BusFault are:

| Attribute  | Type           | Unit       | Required | Default value         | Description                                                                                             |
|------------|----------------|------------|----------|-----------------------|---------------------------------------------------------------------------------------------------------|
| id         | String         | -          | yes      | -                     | The id of the fault                                                                                     |
| elementId  | String         | -          | yes      | -                     | The id of the bus on which the fault will be simulated                                                  |
| r          | double         | $$\Omega$$ | no       | 0                     | The fault resistance to ground                                                                          |
| x          | double         | $$\Omega$$ | no       | 0                     | The fault reactance to ground                                                                           |
| connection | ConnectionType | -          | no       | ConnectionType.SERIES | The way the resistance and reactance of the fault are connected to the ground: in series or in parallel |
| faultType  | FaultType      | -          | no       | FaultType.THREE_PHASE | The type of fault simulated: can be three phased or single phased                                       |

The attributes of a Branchfault are:

| Attribute            | Type           | Unit       | Required | Default value         | Description                                                                                             |
|----------------------|----------------|------------|----------|-----------------------|---------------------------------------------------------------------------------------------------------|
| id                   | String         | -          | yes      | -                     | The id of the fault                                                                                     |
| elementId            | String         | -          | yes      | -                     | The id of the branch on which the fault will be simulated                                               |
| r                    | double         | $$\Omega$$ | no       | 0                     | The fault resistance to ground                                                                          |
| x                    | double         | $$\Omega$$ | no       | 0                     | The fault reactance to ground                                                                           |
| connection           | ConnectionType | -          | no       | ConnectionType.SERIES | The way the resistance and reactance of the fault are connected to the ground: in series or in parallel |
| faultType            | FaultType      | -          | no       | FaultType.THREE_PHASE | The type of fault simulated: can be three phased or single phased                                       |
| proportionalLocation | double         | %          | yes      | -                     | The position where the fault should be simulated, in percent of the line                                |

**A list of FaultParameters**
Optionally, it is possible to specify a list of FaultParameters. Each FaultParameter will overwrite the default parameters for a given fault.
For more information on parameters, see below.

## Outputs
The results of the short circuit analysis can be stored in `com.powsybl.shortcircuit.ShortCircuitAnalysisResult`. This class gathers the results on every fault, accessible either by the ID of the fault or the ID of the element on which the fault is simulated.
For each fault, an object `com.powsybl.shortcircuit.FaultResult` should be returned.

Depending on the property withFortescueResult, the result returned should either be an instance of `com.powsybl.shortcircuit.MagnitudeFaultResult` or `com.powsybl.shortcircuit.FortescueFaultResult`.
Both these class contain the following attributes:

| Attribute              | Type                        | Unit | Required | Default value | Description                                                                                          |
|------------------------|-----------------------------|------|----------|---------------|------------------------------------------------------------------------------------------------------|
| fault                  | Fault                       | -    | yes      | -             | The fault that was simulated                                                                         |
| status                 | Status                      | -    | yes      | -             | The status of the computation, see below for more details                                            |
| shortCircuitPower      | double                      | MVA  | yes      | -             | The value of the short circuit power                                                                 |
| timeConstant           | Duration                    | -    | yes      | -             | The duration before reaching the permanent short circuit current                                     |
| feederResults          | List<FeederResult>          | -    | no       | Empty list    | A list of FeederResult, should not be empty if the parameter withFeederResult is set to true.        |
| limitViolations        | List<LimitViolation>        | -    | no       | Empty list    | A list of LimitViolation, should be empty if the parameter withLimitViolation is set to false.       |
| shortCircuitBusResults | List<ShortCircuitBusResult> | -    | no       | Empty list    | A list of ShortCircuitBusResult, should be empty if the parameter withVoltageResult is set to false. |

However, in these classes, the short circuit current and voltage are represented differently.
In MagnitudeFaultResult:

| Attribute | Type   | Unit | Required | Default value | Description                                      |
|-----------|--------|------|----------|---------------|--------------------------------------------------|
| current   | double | kA   | yes      | -             | The three phased short circuit current magnitude |
| voltage   | double | kV   | yes      | -             | The three phased short circuit current voltage   |

In FortescueFaultResult:

| Attribute | Type           | Unit | Required | Default value | Description                                                                       |
|-----------|----------------|------|----------|---------------|-----------------------------------------------------------------------------------|
| current   | FortescueValue | -    | yes      | -             | The magnitude and angle of the short circuit current detailed on the three phases |
| voltage   | FortescueValue | -    | yes      | -             | The magnitude and angle of the short circuit voltage detailed on the three phases |


**The status of the computation**
This status can be:
- SUCCESS: the computation went as planned and the results are full considering the parameters.
- NO_SHORTCIRCUIT_DATA: this status should be returned if no short circuit data are available in the network, i.e. the reactance of generators and the minimum and maximum admissible short circuit currents.
- SOLVER_FAILURE: the computation failed because of an error linked to the solver.
- FAILURE: the computation failed for any other reason.

**FeederResults**
This field contains the contributions of each feeder to the short circuit current as a list. It should be returned only if the property withFeederResult is set to true.
Depending on the property withFortescueResult, it should be a `com.powsybl.shortcircuit.MagnitudeFeederResult` or a `com.powsybl.shortcircuit.FortescueFeederResult`.
The attributes of MagnitudeFeederResults are:

| Attribute     | Type   | Unit | Required | Default value | Description                                                                                   |
|---------------|--------|------|----------|---------------|-----------------------------------------------------------------------------------------------|
| connectableId | String | -    | yes      | -             | ID of the feeder                                                                              |
| current       | double | kA   | yes      | -             | Current magnitude of the feeder participating to the short circuit current at the fault point | 

The attributes of FortescueFeederResuts are:

| Attribute     | Type           | Unit | Required | Default value | Description                                                                                                                   |
|---------------|----------------|------|----------|---------------|-------------------------------------------------------------------------------------------------------------------------------|
| connectableId | String         | -    | yes      | -             | ID of the feeder                                                                                                              |
| current       | FortescueValue | kA   | yes      | -             | Current magnitudes and angles on the three phases of the feeder participating to the short circuit current at the fault point |

**LimitViolations**
This field contains a list of all the violations after the fault. This implies to have defined in the network the maximum or the minimum acceptable short circuit currents on the buses or equipment.
Then, with comparing to the computed short circuit current, two types of violations can be created: LOW_SHORT_CIRCUIT_CURRENT and HIGH_SHORT_CIRCUIT_CURRENT.
This list should be empty if the property withLimitViolations is set to false.

**ShortCircuitBusResults**
This field contains the voltage results on every bus of the network after simulating the fault. It should be empty if the property withVoltageResult is set to false.
Depending on the property withFortescueResult, the list should contain either `com.powsybl.shortcircuit.MagnitudeShortCircuitBusResult` or `com.powsybl.shortcircuit.FortescueShortCircuitBusResult` objects.
The property withVoltageDropThreshold allows to filter these results by keeping only those where the voltage drop is higher than the defined threshold.
The attributes of MagnitudeShortCircuitBusResult are:

| Attribute               | Type   | Unit | Required | Default value | Description                                            |
|-------------------------|--------|------|----------|---------------|--------------------------------------------------------|
| voltageLevelId          | String | -    | yes      | -             | ID of the voltage level containing the bus             |
| busId                   | String | -    | yes      | -             | ID of the bus                                          | 
| initialVoltageMagnitude | double | kV   | yes      | -             | Magnitude of the three phased voltage before the fault |
| voltageDropProportional | double | %    | yes      | -             | Voltage drop after the fault                           |
| voltage                 | double | kV   | yes      | -             | Magnitude of the three phased voltage after the fault  |

The attributes of FortescueShortCircuitBusResult are:

| Attribute               | Type           | Unit | Required | Default value | Description                                                              |
|-------------------------|----------------|------|----------|---------------|--------------------------------------------------------------------------|
| voltageLevelId          | String         | -    | yes      | -             | ID of the voltage level containing the bus                               |
| busId                   | String         | -    | yes      | -             | ID of the bus                                                            | 
| initialVoltageMagnitude | double         | kV   | yes      | -             | Magnitude of the three phased voltage before the fault                   |
| voltageDropProportional | double         | %    | yes      | -             | Voltage drop after the fault                                             |
| voltage                 | FortescueValue | -    | yes      | -             | Magnitudes and angles of the voltage on the three phases after the fault |
