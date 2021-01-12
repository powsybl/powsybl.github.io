---
layout: default
---

# CIM-CGMES

The CMGES (**C**ommon **G**rid **M**odel **E**xchange **S**pecification) is an IEC technical specification (TS) based on the IEC CIM (**C**ommon **I**nformation **M**odel) family of standards. It was developed to meet necessary requirements for TSO data exchanges in the areas of system development and system operation. In this scenario the agents generate their IGM (Individual Grid Model) and additionally it is necessary to have a boundary that describes the connection with other IGMs. The boundary set contains all boundary points necessary for a given grid model exchange. A boundary set can have different coverage depending on the requirements of the common grid model exchange. An individual grid model is described by a set of CIMXML files. Each file is associated to a profile and the most used are:
- `EQ` is an input to power flow describing the network
- `SSH` describe the power flow input parameters, e.g. injections and set point values.
- `TP` describe the power flow buses and depends on the type of model. For Node Breaker (NB) model TP is an output from topology processing. For Bus Branch (BB) model TP is an input to power flow where the power flow buses are manually maintained.
- `SV` describe the power flow solution, so it is an output from power flow.

The boundary is described in the following CIMXML files:
- `EQBD` contains all the equipment defined in the boundary. 
- `TPBD` contains the topology information associated to the boundary.

A CGMES model can be used in processes that are based on assembling Individual Grid Models (IGM) or into larger Common Grid Models (CGM). 
As an IGM is incomplete the boundary should be assembled with it to become complete, then a power flow can be solved.

* TOC
{:toc}

## Format specification
Current supported version of CGMES is 2.4.15, that is based on CIM 16. We can note that this importer is also compatible with CIM 14.

To learn more about CGMES files, read the complete [CMGES format specification](https://www.entsoe.eu/digital/common-information-model/#common-grid-model-exchange-specification-cgmes).

## Import

The import module reads and converts a CGMES model to the PowSyBl grid model. The import process is performed in three steps:
- Read input files.
- Validate input data.
- Convert input data into PowSyBl grid model.

First, input CGMES data read from RDF/XML files is stored natively in a purpose specific database for RDF statements. In RDF, data is described making statements about resources in triplet expressions (subject, predicate, object). There are multiple open-source implementations of triplestore engines and load from RDF/XML files to the triplestore is highly optimized by these engines. The triplestore repository can be in memory  and it is easy to provide default data and complete missing information. Verifications are made after all data has been loaded. If the validation succeeds the CGMES model is converted to a PowSyBl grid model.

### Inconsistency checks
<span style="color: red">TODO</span>

### From CGMES to IIDM

The PowSyBl grid model establishes the substation as a required container of voltage levels and transformers (two and three windings and phase shifters). Voltage levels are the required container of the rest network components, except for the AC and DC transmission lines that 
establish connections between substations and are associated directly to the network model. All buses at transformer ends should be kept at the same substation.

The CGMES model does not guarantee these hierarchical constraints, so the first step in the conversion process, is to identify all the transformers with ends in different substations and all the breakers and switches with ends in different voltage levels. All the voltage levels connected by breakers or switches should be mapped to a single voltage level in the PowSyBl grid model. The first CGMES voltage level, in alphabetical order, will be the representative voltage level associated to the PowSyBl voltage level. The same criterion is used for substations, and the first CGMES substation will be the representative substation associated to the PowSyBl one. The joined voltage levels and substations information is used almost in every step of the conversion process and it is recorded in the `context` class that contains all the collateral information needed to convert from CGMES to PowSyBl and the more requested CGMES information as a `cache memory` allowing a fast access to these data in future requests. 

The following sections describe in detail how each supported CGMES network component is converted to PowSyBl network model objects.

#### Substation

For each substation (considering only the representative substation if they are connected by transformers) in the CGMES model a new substation is created in the PowSyBl grid model with the following attributes:

- `Id` The CGMES `Id` is copied.
- `Name` The CGMES `name` property is copied.
- `Country` It is obtained from the `regionName` property as first option, from `subRegionName` as second option. Otherwise is assigned to `null`.
- `GeographicalTags` It is obtained from the `SubRegion` property.

#### Voltage Level

As in the substations, for each voltage level (considering only the representative voltage level if they are connected by switches) in the CGMES model a new voltage level is created in the PowSyBl grid model with the following attributes:
- `Id` The CGMES `Id` is copied.
- `Name` The CGMES `name` property is copied.
- `NominalV` It is copied from the `nominalVoltage` property of the CGMES voltage level.
- `TopologyKind` It will be `NODE_BREAKER` or `BUS_BREAKER` depending on the topology level specified in the CGMES grid model. Both options are possible.
- `LowVoltageLimit` It is copied from the `lowVoltageLimit` property.
- `HighVoltageLimit` It is copied from the `highVoltageLimit` property.

#### ConnectivityNode / TopologicalBus

If the CGMES model is a `node/breaker` model then the `connectivityNodes` are defined, and for each of them a `node` associated to the corresponding voltage level is created in the PowSyBl grid model. A `node` in the PowSyBl model is only an integer identifier that is unique by voltage level. If the import option `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` is `true` an additional `busBarSection` is also created in the same voltage level. The attributes of the `busBarSection` are:
- `Id` The `Id` of the CGMES `connectivityNode` is copied.
- `Name` The `name` of the CGMES property of the `connectivityNode` is copied.
- `Node` The integer PowSyBl node is copied.

If the CGMES model is a `bus/breaker` model then the `topologicalNodes` are defined, and for each of them a `bus` is created in the PowSyBl grid model inside the corresponding voltage level container. The created `bus` has the following attributes:
- `Id` The `Id` of the CGMES `topologicalNode` is copied.
- `Name` The `name` of the CGMES `topologicalNode` is copied.
- `V` The voltage of the `topologicalNode` is copied if it is valid (greater than `0`).
- `Angle` The angle the `topologicalNode` is copied if the previous voltage is valid.

In both cases, if the `connectivityNode` or the `topologicalNode` are located inside the boundary it is necessary to define previously a substation and a voltage level that will be used as the container to associate the PowSyBl `node` or `bus`.

If the import option `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` is `false` and the CGMES model is a `node/breaker` model a `busBarSection` is created in the PowSyBl grid model for each `busBarSection` of the CGMES model. The attributes are:
- `Id` The `Id` of the CGMES `busBarSection` is copied.
- `Name` The `name` of the CGMES `busBarSection` is copied.
- `Node` The integer PowSyBl node associated to the CGMES `busBarSection` is copied (It is the node associated to the first terminal connected to the `busBarSection`) .

For each component in the PowSyBl grid model it is necessary to specify how it should be connected to the network. If the voltage level is built at node/breaker level, a `Node` is needed when adding the equipment to the model. If the model is specified at the bus/breaker level, then the `Bus` of the equipment must be specified. Using this information, the PowSyBl grid model creates a `Terminal` that will be used to manage the point of connection of the equipment to the network. Some equipments, like transformers, require two or three `Nodes` or `Buses`.

In all the components of the PowSyBl grid model is obligatory to specify an `Id` (unique identifier) and optionally a human readable `Name`. As in this conversion process both attributes are copied directly from the same properties of the corresponding CGMES network component they will be omitted in the following sections. Also, it is omitted that all the CGMES terminal identifiers used to manage the connection of the equipment to the rest of the network are recorded as aliases of the network component.

#### EnergyConsumer

Every `energyConsumer` component in the CGMES model creates a new `load` in the PowSyBl grid model associated to the corresponding voltage level. The attributes are:
- `P0` One of these four values (`P` from the `stateVariablesPowerFlow` profile, `P` from the `steadyStateHypothesisPowerFlow` profile, `P` from the `pFixed` property of the CGMES equipment, or `NaN`) is copied according to the import options.
- `Q0` One of these four values (`Q` from the `stateVariablesPowerFlow` profile, `Q` from the `steadyStateHypothesisPowerFlow` profile, `Q` from the `qFixed` property of the CGMES equipment, or `NaN`) is copied according to the import options.
- `LoadType` It will be `FICTITIOUS` if the `Id` of the `energyConsumer` contains the pattern `fict`. Otherwise `UNDEFINED`.
- `LoadDetail` Additional information added as an extension of the main network component class.

If the import option `iidm.import.cgmes.profile-used-for-initial-state-values` is `SV` the active and reactive power of the load is the first defined value of the sequence `stateVariablesPowerFlow`, `steadyStateHypothesisPowerFlow`, `Fixed` and `NaN`. Otherwise if it is `SSH` then the sequence will be `steadyStateHypothesisPowerFlow`, `stateVariablesPowerFlow`, `Fixed` and `NaN`.

The `LoadDetail` depends  on the load Kind (`type` property of the CGMES `energyConsumer`). If the type of the `energyConsumer` is a conform load the following attributes are defined:
- `withFixedActivePower` Always `0.0`.
- `withFixedReactivePower` Always `0.0`.
- `withVariableActivePower` The load `P0` property is copied.
- `withVariableReactivePower` The load `Q0` property is copied.

and when the type is a non-conform load the defined attributes are:
- `withFixedActivePower` The load `P0` property is copied.
- `withFixedReactivePower` The load `Q0` property is copied.
- `withVariableActivePower` Always `0.0`.
- `withVariableReactivePower` Always `0.0`.

#### EnergySource

For each `energySource` component in the CGMES model a new `load` in the PowSyBl grid model is created and associated to the corresponding voltage level. The attributes are:
- `P0` One of these two values (`P` from the `stateVariablesPowerFlow` profile or `P` from the `steadyStateHypothesisPowerFlow` profile) is copied according to the import options.
- `Q0` One of these tow values (`Q` from the `stateVariablesPowerFlow` profile or `Q` from the `steadyStateHypothesisPowerFlow` profile) is copied according to the import options.
- `LoadType` It will be `FICTITIOUS` if the `Id` of the `energySource` contains the pattern `fict`. Otherwise `UNDEFINED`.

If the import option `iidm.import.cgmes.profile-used-for-initial-state-values` is `SV` the active and reactive power of the load is copied from the `stateVariablesPowerFlow` profile. If it is `SSH` will be copy from the `steadyStateHypothesisPowerFlow` profile.

#### EquivalentInjection

The PowSyBl network component created by an `equivalentInjection` of the CGMES grid model can vary depending on where it is located, inside or outside the boundary. If the `equivalentInjection` is located outside the boundary a `generator` will be created. If it is inside and the import option `iidm.import.cgmes.convert-boundary` is `true` then the conversion process will import all the equipments inside the boundary and a `generator`, as in the previous case, will be created. Otherwise, if the `equivalentInjection` is regulating voltage and a dangling line is created at the boundary the regulating voltage data of the `equivalentInjection` will be transferred to the `danglingLine`.

When a generator is created, it is associated to the corresponding voltage level and has the following attributes:
- `MinP` The `minP` property is copied if it is defined, otherwise `-Double.MAX_VALUE`.
- `MaxP` The `maxP` property is copied if it is defined, otherwise `Double.MAX_VALUE`.
- `TargetP` The active power `P` from the `stateVariablesPowerFlow` profile or from the `steadyStateHypothesisPowerFlow` profile according with the import options and with the opposite sign as it is a target value.  `0.0` if both profiles are not defined.
- `TargetQ` The reactive power `Q` from the `stateVariablesPowerFlow` profile or from the `steadyStateHypothesisPowerFlow` profile according with the import options and with the opposite sign. `0.0` if both profiles are not defined.
- `TargetV` The `regulationTarget` property is copied if it is not zero. Otherwise the nominal voltage associated to the connected terminal of the `equivalentInjection` is assigned.
- `VoltageRegulatorOn` It is assigned to `true` if both properties, `regulationCapability` and `regulationStatus` are `true` and the terminal is connected.
- `EnergySource` Fixed to `OTHER`.

The regulating terminal is not defined so the voltage control will be always local.

The PowSyBl grid model accepts one definition of limits, either `MinMaxReactiveLimits` or ReactiveCapabilityCurve. The first step is to define the points of the curve. At each point the active power, the minimum reactive and the maximum reactive power values are specified by copying the value of the `xvalue`, `y1value` and `y2value` properties associated to the capability curve  recorded in the `ReactiveCapabilityCurve` property. After that `MinMaxReactiveLimits` is created if there is only one point and `ReactiveCapabilityCurve` in another case.

The best way to determine the final topology at the boundary, it is to wait until the end of the conversion process. At this point all the CGMES network components connected to the boundary node have been analyzed and will be possible to determine it using all the information. So if the `equivalentInjection` is not used to create a generator at this step of the conversion process it will be recorded as an equipment attached to the boundary node. See [Boundary Topology](#boundary-topology) to know  the final topology at the boundary.

#### ExternalNetworkInjection

For each `externalNetworkInjection` a generator is created in the PowSyBl grid model. The generator is attached to the voltage level container and has the following attributes:
- `MinP` The `minP` property is copied if it is defined, otherwise `-Double.MAX_VALUE`.
- `MinP` The `maxP` property is copied if it is defined, otherwise `Double.MAX_VALUE`.
- `TargetP` The active power `P` from the `stateVariablesPowerFlow` profile or from the `steadyStateHypothesisPowerFlow` profile according with the import options and with the opposite sign as it is a target value.  `0.0` if both profiles are not defined.
- `TargetQ` The reactive power `Q` from the `stateVariablesPowerFlow` profile or from the `steadyStateHypothesisPowerFlow` profile according with the import options and with the opposite sign. `0.0` if both profiles are not defined.
- `EnergySource` Fixed to `OTHER`.

As in the `equivalentInjection` a set of reactive power limits is defined (`MinMaxReactiveLimits` or `ReactiveCapabilityCurve`) by copying the value of the `xvalue`, `y1value` and `y2value` properties associated to the capability curve recorded in the `ReactiveCapabilityCurve` property.

The `regulatingControl` attributes are assigned at the end of the conversion process as the control could be remote and the `regulatingTerminal` could not be defined at the current step. See [Regulating Control For Generators](#regulating-control-for-generators)

#### Shunt Compensator

There is a one-to-one correspondence between CGMES and PowSyBl `shuntCompensators`. For each component of the CGMES model a new one is created in the PowSyBl grid model associated to the corresponding voltage level. The first step is to specify the `SectionCount`, then the shunt model that can be a linear model or a non-linear model and finally the `regulatingControl` attributes.

The `SectionCount` attribute is specify by the `SVsections` property taken from the `stateVariablesPowerFlow` profile or from the  `SSHsections` property of the `steadyStateHypothesisPowerFlow` profile according with the import option `iidm.import.cgmes.profile-used-for-initial-state-values`. If both properties are not defined then the value of the `normalSections` property of the CGMES shunt compensator is used.

The shunt model is specified by the `type` property of the shunt compensator. The linear model is defined by the following attributes:
 - `GPerSection` Positive sequence shunt (charging) conductance per section. It is copied from the `gPerSection` property.
 - `BPerSection` Positive sequence shunt (charging) susceptance per section. It is copied from the `bPerSection` property and if it is zero is fixed to `Double.MIN_VALUE`
 - `MaximumSectionCount` It is copied from the `maximumSections` property of the CGMES shunt compensator.
 
 The non-linear model is defined by a sorted set of sections where each section accumulates the conductance and susceptance of the previous ones. The attributes by section are:
 - `G` Total shunt conductance. It is calculated by accumulating the `g` of each previous point associated to the non-linear model of the CGMES shunt. 
 - `B` Total shunt susceptance. It is calculated by accumulating the `b` of each previous point associated to the non-linear model of the CGMES shunt.
 
The regulating attributes of the shunt compensator are defined at the end of the conversion process. See [Regulating Control For Shunt Compensators](#regulating-control-for-shunt-compensators)
  
#### Equivalent Shunt

Every `equivalentShunt` of the CGMES model creates a new shunt compensator in the PowSyBl grid model. This new equipment is attached to the corresponding voltage level. The `SectionCount` attribute is defined as `1` if the `equivalentShunt` is connected and as `0` if it is disconnected. A linear model is specified where the `BPerSection` attribute is copied from the `b` property of the `equivalentShunt` and the `MaximumSectionCount` is fixed to `1`. It is a fixed shunt compensator, without control capability.

#### Static VAR Compensator

For each `staticVARcompensator` of the CGMES model a new `staticVARcompensator` is created and attached to a voltage level in the PowSyBl model. The attributes of the staticVARcompensator are:
- `Bmin` The inverse of the `inductiveRating` property of the CGMES `staticVARcompensator`.
- `Bmax` The inverse of the `capacitiveRating` property of the CGMES `staticVARcompensator`.

The droop or current compensation (must be positive) is copied from the `slope`property and is recorded as an extension attached to the `staticVARcompensator` object.

The regulating attributes of the `staticVARcompensator` are defined at the end of the conversion process. See [Regulating Control For static VAR compensators](#regulating-control-for-static-var-compensators)

#### Asynchronous Machine

Each `asynchronousMachine` component of the CGMES model creates a new load in the PowSyBl grid model that is attached to a voltage level. The attributes are:
- `P0` One of these two values (`P` from the `stateVariablesPowerFlow` profile or `P` from the `steadyStateHypothesisPowerFlow` profile) is copied according to the import options.
- `Q0` One of these tow values (`Q` from the `stateVariablesPowerFlow` profile or `Q` from the `steadyStateHypothesisPowerFlow` profile) is copied according to the import options.
- `LoadType` It will be `FICTITIOUS` if the `Id` of the `energySource` contains the pattern `fict`. Otherwise `UNDEFINED`.

If the import option `iidm.import.cgmes.profile-used-for-initial-state-values` is `SV` the active and reactive power of the load is copied from the `stateVariablesPowerFlow` profile. Otherwise if it is `SSH` will be copy from the `steadyStateHypothesisPowerFlow` profile.

#### Synchronous Machine

Each `synchronousMachine` of the CGMES model creates a new generator in the PowSyBl grid model attached to the voltage level container with the following attributes:
- `MinP` The `minP` property is copied if it is defined, otherwise `-Double.MAX_VALUE`.
- `MaxP` The `maxP` property is copied if it is defined, otherwise `Double.MAX_VALUE`.
- `TargetP` The active power `P` from the `stateVariablesPowerFlow` profile or from the `steadyStateHypothesisPowerFlow` profile according with the import options and with the opposite sign as it is a target value.  `0.0` if both profiles are not defined.
- `TargetQ` The reactive power `Q` from the `stateVariablesPowerFlow` profile or from the `steadyStateHypothesisPowerFlow` profile according with the import options and with the opposite sign. `0.0` if both profiles are not defined.
- `EnergySource` It is obtained after processing the `generatingUnitType` property.
- `RatedS` The value of the `ratedS` property is copied.

A set of reactive power limits is defined (`MinMaxReactiveLimits` or `ReactiveCapabilityCurve`) by copying the value of the `xvalue`, `y1value` and `y2value` properties associated to the capability curve recorded in the `ReactiveCapabilityCurve` property.

The generator is added as slack terminal if the `referencePriority` property is greater than `0.0` and if the `normalPF` property is defined then a new extension is added at the generator for recording the participation factor when distributed slack is enabled:
- `withParticipate` Fixed to `true`.
- `withDroop` The `normalPF` property is copied.

The regulating attributes of the generator are defined at the end of the conversion process. See [Regulating Control For Generators](#regulating-control-for-generators)

#### Switches

When one of the ends of the `Switch` is connected to the boundary See [Boundary Topology](#boundary-topology) to know  the final topology at the boundary. In the rest of the cases the `Switch` is converted to a switch in the PowSyBl grid model.

The new switch in the PowSyBl model is attached to a voltage level and if the model is defined at node/breaker level its attributes are:
- `Kind` It is obtained by analyzing the `type` property of the CGMES `Switch`. (could be `BREAKER`, `DISCONNECTOR` or `LOAD_BREAK_SWITCH`).

If the model is defined at bus/breaker model the switch is created with default attributes.

At both levels of topology the open status of the switch (true or false) is obtained from the first defined value of this sequence (`open` property from the CGMES `Switch`, `normalOpen` property of the CGMES `Switch`, `false`).
       

#### AC Line Segments


When one of the ends of the `ACLineSegment` is connected to the boundary See [Boundary Topology](#boundary-topology) to know  the final topology at the boundary. In the rest of the cases the `ACLineSegment` is converted to a Line or a switch. 

In most of the cases the `ACLineSegment` is converted to a Line. Then a new Line in the PowSyBl grid model is created and attached to the network container with the following attributes:
- `R` The `r` property value is copied.
- `X` The `x` property value is copied.
- `G1` The half of the `gch` property value is copied.
- `B1` The half of the `bch` property value is copied.
- `G2` The half of the `gch` property value is copied.
- `B2` The half of the `bch` property value is copied.

When the `ACLineSegment` is a zero impedance line inside the voltage level a new switch is created and attached to the corresponding voltage level in the PowSyBl grid model. If the model is defined at node/breaker level, then the switch will have the following attributes: 
- `Kind` Fixed to `BREAKER`.
- `Fictitious` Fixed to `true`.

If the model is defined at bus/breaker model only the `Fictitious` attribute will be set to  `true`
In both cases the switch is considered closed if both of the terminal ends are connected.

#### Equivalent Branch

Each `equivalentBranch` in the CGMES model creates a new line in the powSyBl grid model. The line is attached to the network container and has the following attributes:
- `R` The `r` property value of the CGMES `equivalentBranch` is copied.
- `X` The `x` property value of the CGMES `equivalentBranch` is copied.
- `G1` Fixed to `0.0`.
- `B1` Fixed to `0.0`.
- `G2` Fixed to `0.0`.
- `B2` Fixed to `0.0`.
 
It is possible to define an impedance at each end of the `equivalentBranch` in the CGMES model, `r` and `x` properties define the impedance at end `1` and `r21` and `x21` properties define it at end `2`. The current version of PowSyBl only supports lines with identical impedance at both ends. At the conversion process the impedance is copied from end `1`, `r` and `x` properties.

#### Series Compensator

Each `seriesCompensator` in the CGMES model creates a new line in the powSyBl grid model. The line is attached to the network container and has the following attributes:
- `R` The `r` property value of the CGMES `seriesCompensator` is copied.
- `X` The `x` property value of the CGMES `seriesCompensator` is copied.
- `G1` Fixed to `0.0`.
- `B1` Fixed to `0.0`.
- `G2` Fixed to `0.0`.
- `B2` Fixed to `0.0`.

#### Transformer Ends

A two-winding transformer end is defined in the CGMES model as two power transformer ends. Each power transformer end supports one transmission impedance, one magnetizing admittance and one `tapChanger` (`ratioTapChanger` or `phaseTapChanger`). The same two-winding transformer in CGMES can be modeled in different ways depending on the attributes assigned to each power transformer end. In the PowSyBl model the two-winding transformer model includes the transmission impedance, a `ratioTapChanger` and/or a `phaseTapChanger` always located at the end `1` and the magnetizing admittance between the `tapChanger` and the transmission impedance.

Each two-winding transformer in the CGMES model, defined as two power transformer ends, is converter to a new two-winding transformer in the PowSyBl model that is attached to the corresponding substation. The conversion process is structured in three steps. In the first step all the information coming a the two power transformers ends is collected and organized. In the second step this information is interpreted and mapped to a general two-winding transformer model that supports all the possible ways to model a two-winding transformer using power transformer ends. Finally, in the third step the general two-winding transformer model is converted to the PowSyBl two-winding transformer model. The general and the PowSyBl transformer model obtained as result of the conversion process are equivalent electrical models for almost all the two-winding transformers defined in the CGMES network models, but in some models it is possible to find some transformers that can not be exactly modeled using the PowSyBl model. In these cases, the PowSyBl transformer model is an approximation of the real model.

![TwoWindingsTransformerModel](img/cim-cgmes/two-windings-transformer-model.svg){: width="100%" .center-image}

In the first step the following information is collected from the two power transformer ends:
- `TransmissionImpedance` as the addition of the transmission impedance of each power transformer end.
- An at each of the transformer, end1 and end2:
	- `MagnetizingAdmittance`. Complex zero value is assigned if it is not defined.
	- `RatioTapChanger`. Null is assigned if it is not defined.
	- `PhaseTapChanger`. Null is assigned if it is not defined.
	- `RatedU`. The rated voltage, always is defined.

The `RatioTapChanger` and the `PhaseTapChanger` are always expressed in the PowSyBl model as a table so it is necessary to convert the `tapChangers` of the power transformer ends to a table if they are not defined as tabular. This conversion process supports the conversion to a table of tabular and linear `ratioTapChangers` and tabular, linear, symmetrical and asymmetrical `phaseTapChangers`.

In the second step, the data collected in the previous step is mapped to a more general two-winding transformer model. This model supports a transmission impedance  and a `ratioTapChanger` and `phaseTapChanger` at each end. Magnetizing admittance can be defined at both ends, allows to specify the end of the structural ratio and the rated voltage at both ends. There are different alternatives to map the collected data into the general model. After analyzing all the available CGMES network models a set of predefined alternatives have been suggested and considered. Only one of them is active, the default alternative. In the current version the most used alternative in CGMES network models is considered the default alternative. In the default alternative:

- `RatioTapChanger` and `PhaseTapChanger` are considered at the end where they are defined. If they are defined at power transformer end1 then are considered at the end1 of the general model. If they are defined at the end2 then are assigned to end2 and finally, if `tapChangers` are defined in both power transformer ends then the general model will have tapChanger in both ends.
- Magnetizing admittance follows the same criterion as `tapChangers`.
- `StructuralRatio` is defined at then end2 if the impedance transmission is defined at the power transformer end1 and it is defined at the end1 if the impedance transmission is defined at the end2.

The rated voltage must be defined in both power transformers ends and it is mapped at the corresponding end of the general model regardless of the considered alternative.

In the third and last step, the general transformer model is converted to the final PowSyBl two-winding transformer model. To do this process the following procedures are needed:
- If there is a `RatioTapChanger` defined at the end2 is moved to the end1.
- If there is a `PhaseTapChanger` defined at the end2 is moved to the end1.
- If the `StructuralRatio` is defined at the end2 is moved to the end1.
- If there is a magnetizing admittance at the end2 then this admittance is added to the magnetizing admittance of the end1. This is an approximation.
- After moving the `RatioTapChanger` of the end2 if there are two `RatioTapChangers` at the end1 it is necessary to combine both to get only one. The combine procedure does a Cartesian product of two tapChangers getting as result a new tapChanger with steps1 x steps2 steps. As the combined tapChanger is not so useful for analysis and it is not possible to map back to the original one, before combining them, one of the tapChangers is fixed to only one the step, the current step.
- If there are two `PhaseTapChangers` at the end1, then both will be combined to get only one.

Before combining two `tapChagers` a priority ranking is established and the `tapChanger` with lower priority is fixed at the current tap position and the `tapChanger` with higher priority is preserved. The lowest priority is assigned to `tapChanger` with only one step, then are considered `tapChanger` with several steps without regulating control and finally the highest priority is assigned to `tapChanger` with regulating control. If both `tapChangers` have the same priority then the `tapChanger` associated to the power transformer end1 is preserved.

When the structural ratio is moved from end2 to end1 a correction is applied to the transmission impedance and magnetizing admittance modifying the initial values but when the `tapChanger` is moved then the transmission impedance and magnetizing admittance are not modified and the corrections are managed as step corrections of the tapChanger expressed as percentage deviation of the nominal value.

After all these procedures the following attributes are defined in the two-winding transformer created in the PowSyBl model:
- `R` The sum of the resistances of both power transformer ends corrected if the structural ratio has been moved from end2 to end1.
- `X` The sum of the reactances of both power transformer ends corrected if the structural ratio has been moved from end2 to end1.
- `G` The sum of the conductances of both power transformer ends corrected if the structural ratio has been moved from end2 to end1.
- `B` The sum of the susceptances of both power transformer ends corrected if the structural ratio has been moved from end2 to end1.
- `RatioTapChanger` The ratioTapChanger obtained as result of the previous process. Could be null.
- `PhaseTapChanger` The paseTapChanger obtained as result of the previous. Could be null
- `RatedU1` The rated voltage of the power transformer end1.
- `RatedU2` The rated voltage of the power transformer end2.

The regulating attributes of the two-winding transformer are defined at the end of the conversion process. See [Regulating Control For Transformers.](#regulating-control-for-transformers) 
 
Each three-winding transformer in the CGMES model, defined as three power transformer ends, is converted to a new three-winding transformer in the PowSyBl model that is attached to the corresponding substation. To do this the two-winding transformer procedures are also applied here. The first step is then to collect the information of the three power transformer ends. For each end the collected data is:

- `TransmissionImpedance` The transmission impedance of the corresponding power transformer end.
- `MagnetizingAdmittance`. The magnetizing admittance of the corresponding power transformer end. Complex zero value is assigned if it is not defined.
- `RatioTapChanger`. The `RatioTapChanger` of the corresponding power transformer end. Null is assigned if it is not defined.
- `PhaseTapChanger`. The `PhaseTapChanger` of the corresponding power transformer end. Null is assigned if it is not defined.
- `RatedU`. The rated voltage of the corresponding power transformer end.

The second step is to map this information to the general three-winding transformer model. This model can be envisioned as three general two-winding transformer models connected to the star bus, a fictitious bus where is necessary to defined the rated voltage (`ratedU0` attribute). The map process is done according with the default alternative. In this alternative:
- `RatioTapChanger` and `PhaseTapChanger` are mapped at the network side.
- The `MagnetizingAdmittance` is also mapped at the network side.
- The structural ratio is considered at the star bus side of the general three-winding transformer model.

As the three-winding transformer model in PowSyBl can also be represented as three two-winding transformers connected to the star bus to convert the general three-winding transformer model to the model in PowSyBl it is only necessary to apply the previous convert process to each two-winding transformer. However, it is important to point out that in this situation the combine procedure will not act as there is no way to define two `ratioTapChangers` or `phaseTapChangers` in the same leg. 

Additionally to the attributes of the three two-winding transformers the rated voltage of the star bus must be defined. In the default alternative it is assigned to the rated voltage of the power transformer end1.

The regulating attributes of the three-winding transformer are defined at the end of the conversion process. See [Regulating Control For Transformers.](#regulating-control-for-transformers) 

![ThreeWindingsTransformerModel](img/cim-cgmes/three-windings-transformer-model.svg){: width="100%" .center-image}

#### DC network components

<span style="color: red">TODO</span>

#### Boundary Topology

The conversion process at the boundary depends on the boundary topology. The following configurations are supported:
- Only one line. A dangling line is created.
- Only one switch. A dangling line with zero impedance is created.
- Two lines. Depending on the configuration a TieLine is created or both lines are merged and replaced by the equivalent line.
- One line and one switch. The switch is converted into a zero impedance line and then depending on the configuration, a TieLine is created or both lines are merged and replaced by the equivalent line.


If there is one line at the boundary then a dangling line is created and attached to the voltage level associated to the model side node with the following attributes:
- `R` The `r` property value of the CGMES line is copied.
- `X` The `x` property value of the CGMES line is copied.
- `G` The `gch` property value of the CGMES line is copied.
- `B` The `bch` property value of the CGMES line is copied.
- `UcteXnodeCode` The ucteXnode associated to the boundary node is copied.
- `P0` The active power injection at the boundary node from the `stateVariablesPowerFlow` profile or from the `steadyStateHypothesisPowerFlow` profile according with the import options.
- `Q0` The reactive power injection at the boundary node from the `stateVariablesPowerFlow` profile or from the `steadyStateHypothesisPowerFlow` profile according with the import options.

If the equivalent injection associated to the boundary node is regulating voltage then all the regulating properties are mapped over the dangling line as a virtual generator. The attributes of the virtual generator are:
- `MinP` Fixed to `-Double.MAX_VALUE`.
- `MaxP` Fixed to `Double.MAX_VALUE`.
- `TargetP` The active power `P` from the `stateVariablesPowerFlow` profile or from the `steadyStateHypothesisPowerFlow` profile according with the import options and with the opposite sign as it is a target value.  `0.0` if both profiles are not defined.
- `TargetQ` The active power `q` from the `stateVariablesPowerFlow` profile or from the `steadyStateHypothesisPowerFlow` profile according with the import options and with the opposite sign as it is a target value.  `0.0` if both profiles are not defined.
- `TargetV` The `regulationTarget` property of the equivalent injection is copied if it is not zero. Otherwise the nominal voltage of the associated voltage level is copied.
- `VoltageRegulationOn` Fixed to `true`.

Finally, the active and reactive flow is assigned to the terminal associated to the model side node of the dangling line. The flow can be taken directly from the `stateVariablesPowerFlow` profile or from the `steadyStateHypothesisPowerFlow` profile according with the import options. It can be propagated from the boundary node if the dangling line has zero impedance or in the last case, can be calculated using the power injection and the voltage at the boundary side and the impedance and shunt admittance of the dangling line.

If there is one switch at the boundary then a dangling line with zero impedance is created. All the previous criteria are valid and the only differences are that the `R`, `X`, `G` and `B` attributes of the new dangling line are fixed to zero.

If there is two lines at the boundary then a tie line is created if the import property `iidm.import.cgmes.merge-boundaries-using-tie-lines` is `true`. Otherwise if the import property is `false` an equivalent line by merging both lines is created.

The created TieLine is attached to the network model and the attributes of the two half lines of the TieLine are copied from the properties of the two lines at the boundary.

If there is one switch and one line at the boundary then a zero impedance line is created as a first step an then the previous procedure is followed.


#### Regulating Control For Generators

The regulating control information is defined at the end of the conversion process, after all network components have been specified. The attributes added to the generator are:
- `RegulatingTerminal` It is copied from the terminal associated to the `Terminal` property of the `regulatingControl`. If is not valid then the terminal associated to the created generator is used by forcing the control to local. 
- `TargetV` The `TargetValue` property of the `regulatingControl` is copied if it is not zero and not `NaN`. Otherwise the nominal voltage of the associated voltage level is copied.
- `VoltageRegulatorOn` To be `true` both properties, the `enabled` of the `regulatingControl` and the `controlEnabled` of the CGMES network component must be `true`.

At the current CGMES import version only voltage control is supported in generators and the percent of the coordinated reactive control, `qPercent` property, is recorded as an extension class of the generator.

#### Regulating Control For Static VAR Compensators

The `regulatingControl` attributes added to `staticVARcompensators` are:
- `VoltageSetpoint` The `targetValue` property of the `regulatingControl` is copied.
- `ReactivePowerSetpoint` The `targetValue` property of the `regulatingControl` is copied.
- `RegulatingTerminal` Terminal where the voltage or reactive power should be controlled. It is defined as the terminal associated to the `Terminal` property of the `regulatingControl` if it is valid. Otherwise the terminal associated to the `staticVARcompensator` is used by forcing the control to local.
- `RegulationMode` Three possible status `VOLTAGE`, `REACTIVE_POWER` and `OFF`. The current status is defined in the `mode` property of the `regulatingControl` and it is only assigned if  both properties, the `enabled` property of the `regulatingControl` and the `controlEnabled` of the CGMES network component are `true`. 

A default `regulatingControl` is defined using the `voltageSetPoint`, `q`, and `controlMode` properties of the CGMES network component when only the `controlEnabled` is `true`. In that case the control will be local.

#### Regulating Control For Shunt Compensators

The `regulatingControl` attributes added to shunt compensators are:
 - `TargetV` It is copied from the `targetValue` property of the `regulatingControl`.
 - `TargetDeadband` It is copied from the `targetDeadband` property of the `regulatingControl`.
 - `RegulatingTerminal` Terminal where voltage should be controlled. It is defined as the terminal associated to the `Terminal` property of the `regulatingControl` if it is valid. Otherwise the terminal associated to the created shunt is used by forcing the control to local.
 - `VoltageRegulatorOn` To be `true` both properties, the `enabled` property of the `regulatingControl` and the `controlEnabled` property of the CGMES network component must be `true` and also `TargetV` greater than zero.

If the `regulatingControl` data is not well defined then a local `regulatingControl` is created where `TargetV` is the nominal voltage associated to the shunt compensator and `TargetDeadband` is fixed to `0.0`.

#### Regulating Control For Transformers

<span style="color: red">TODO</span>

<span style="color: red">TODO</span>


### Extensions
<span style="color: red">TODO</span>

### Options

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../user/configuration/import-export-parameters-default-value.md) module.

**iidm.import.cgmes.allow-unsupported-tap-changers**  
The `iidm.import.cgmes.allow-unsupported-tap-changers` property is an optional property that determines if every tap changer is read in order to be converted in best effort or if only supported tap changers are read and converted. By default, its value is `true`.

**iidm.import.cgmes.boundary-location**  
The `iidm.import.cgmes.boundary-location` property is an optional property that defines the directory path where the CGMES importer can find the boundary files if they are not present in the imported zip file. By default, its value is `<ITOOLS_CONFIG_DIR>/CGMES/boundary`.

**iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state**  
The `iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state` property is an optional property
that defines if the CGMES importer inverts the sign of reactive power flows for shunt compensators. Its default value is `false`.

**iidm.import.cgmes.convert-boundary**  
The `iidm.import.cgmes.convert-boundary` property is an optional property that defines if the CGMES importer imports equipments inside the boundaries or not. Its default value is `false`.

**iidm.import.cgmes.create-busbar-section-for-every-connectivity-node**  
The `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` property is an optional property that defines if the CGMES importer creates an [IIDM Busbar Section](../model/index.md#busbar-section) for each CGMES connectivity node. Its default value is `false`.

**iidm.import.cgmes.ensure-id-alias-unicity**
The `iidm.import.cgmes.ensure-id-alias-unicity` property is an optional property that defines if IDs and aliases' unicity is ensured during CGMES import. If it is set to `true`, identical CGMES IDs will be modified to be unique.
If it is set to `false`, identical CGMES IDs will throw an exception. Its default value is `false`. 

**iidm.import.cgmes.post-processors**
The `iidm.import.cgmes.post-processors` property is an optional property that defines all the CGMES post-processors which are to be activated after import. By default, it is an empty list.

**iidm.import.cgmes.powsybl-triplestore**  
The `iidm.import.cgmes.powsybl-triplestore` property is an optional property that defines which triplestore implementation is used. PowSyBl supports the [RDF4J](#rdf4j), [Jena](#jena) and [Blazegraph](#blazegraph) triplestore implementations. This property has `rdf4j` as default value.

**iidm.import.cgmes.profile-used-for-initial-state-values**
The `iidm.import.cgmes.profile-used-for-initial-state-values` property is an optional property that defines which profile is used in priority for initial state values. It can be `SSH` or `SV`. Its default value is `SSH`.

**iidm.import.cgmes.store-cgmes-model-as-network-extension**  
The `iidm.import.cgmes.store-cgmes-model-as-network-extension` property is an optional property that defines if the CGMES model is stored in the imported IIDM network as an [extension](). Its default value is `true`.

**iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension**
The `iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension` property is an optional property that defines if the CGMES Conversion context will be stored as an extension of the IIDM output network. Its default value is `false`.

#### Deprecated properties

**changeSignForShuntReactivePowerFlowInitialState**  
The `changeSignForShuntReactivePowerFlowInitialState` property is deprecated since v2.4.0. Use `iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state` instead.

**convertBoundary**  
The `convertBoundary` property is deprecated since v2.4.0. Use `iidm.import.cgmes.convert-boundary` instead.

**createBusbarSectionForEveryConnectivityNode**  
The `createBusbarSectionForEveryConnectivityNode` property is deprecated since v2.4.0. Use `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` instead.

**powsyblTripleStore**  
The `powsyblTripleStore` property is deprecated since v2.4.0. Use `iidm.import.cgmes.powsybl-triplestore` instead.

**storeCgmesModelAsNetworkExtension**  
The `storeCgmesModelAsNetworkExtension` property is deprecated since v2.4.0. Use `iidm.import.cgmes.store-cgmes-model-as-network-extension` instead.

## Export
<span style="color: red">TODO</span>

## Triple stores

### Rdf4j
<span style="color: red">TODO</span>

### Jena
<span style="color: red">TODO</span>

### Blazegraph
<span style="color: red">TODO</span>

## Examples
Have a look to the [CGMES sample files](https://docstore.entsoe.eu/Documents/CIM_documents/Grid_Model_CIM/TestConfigurations_packageCASv2.0.zip)
from ENTSO-E Test Configurations for Conformity Assessment Scheme v2.0.
