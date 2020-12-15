---
layout: default
---

# CIM-CGMES

The CMGES (**C**ommon **G**rid **M**odel **E**xchange **S**pecification) is an IEC technical specification (TS) based on the IEC CIM (**C**ommon **I**nformation **M**odel) family of standards. It was developed to meet necessary requirements for TSO data exchanges in the areas of system development and system operation. In this scenario the agents generate their IGM (Individual Grid Model) and additionally it is necessary to have a boundary that describes the connection with other IGMs. The boundary set contains all boundary points necessary for a given grid model exchange. A boundary set can have different coverage depending on the requirements of the common grid model exchange. An individual grid model is described by a set of CIMXML files. Each file is associated to a profile and the most used are:
- `EQ` is an input to power flow describing the network
- `SSH` describe the power flow input parameters, e.g. injections and set point values.
- `TP` describe the power flow busses and depends on the type of model. For Node Breaker (NB) model TP is an output from topology processing. For Bus Branch (BB) model TP is an input to power flow where the power flow busses are manually maintained.
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

The import module reads and converts a CGMES model to the PowSyBl grid model. The import process is performed in two steps:
- Read input files.
- Validate input data.
- Convert input data into PowSyBl grid model.

First, input CGMES data read from RDF/XML files is stored natively in a purpose specific database for RDF statements. In RDF, data is described making statements about resources in triplet expressions (subject, predicate, object). There are multiple open-source implementations of triplestore engines and load from RDF/XML files to the triplestore is highly optimized by these engines. The triplestore repository can be in memory  and it is easy to provide default data and complete missing information. Verifications can be made after all data has been loaded. If the validation succeeds the CGMES model is converted to a PowSyBl grid model.

### Inconsistency checks
<span style="color: red">TODO</span>

### From CGMES to IIDM

The PowSyBl grid model establishes the substation as a required container of voltage levels and transformers (two and three windings and phase shifters). Voltage levels are the required container of the rest network components, except for the AC and DC transmission lines that 
establish connections between substations and are associated directly to the network model. All buses at transformer ends should be kept at the same substation.

The CGMES model does not guarantee these hierarchical constraints, so the first step in the conversion process is to identify all the transformers with ends in different substations and all the breakers and switches with ends in different voltage levels. All the voltage levels connected by breakers or switches should be mapped to a single voltage level in the PowSyBl grid model. The first CGMES voltage level, in alphabetical order, will be the representative voltage level associated to the PowSyBl voltage level. The same criterion is used also for substations, and the first CGMES substation will be the representative substation associated to the PowSyBl one. The joined voltage levels and substations information is used almost in every step steps of the conversion process and it is recorded in the `context` class that contains all the collateral information needed to convert from CGMES to PowSyBl and the more requested CGMES information as a `cache memory` allowing a fast access to these data in future requests. 

The following sections describe in detail how each supported CGMES network component is converted to PowSyBl network model objects.

#### Substation

For each substation (considering only the representative substation if they are connected by transformers) in the CGMES model a new substation is created in the PowSyBl grid model with the following attributes:

- `Id` The CGMES `Id` is copied.
- `Name` The CGMES `name` attribute is copied.
- `Country` It is obtained from the `regionName` attribute as first option, from `subRegionName` as second option. Otherwise is assigned to `null`.
- `GeographicalTags` It is obtained from the `SubRegion` attribute.

#### Voltage Level

As in the substations, for each voltage level (considering only the representative voltage level if they are connected by switches) in the CGMES model a new voltage level is created in the PowSyBl grid model with the following attributes:
- `Id` The CGMES `Id` is copied.
- `Name` The CGMES `name` attribute is copied.
- `NominalV` It is copied from the `nominalVoltage` property of the CGMES voltage level.
- `TopologyKind` It will be `NODE_BREAKER` or `BUS_BREAKER` depending on the topology level specified in the CGMES grid model. Both options are possible.
- `LowVoltageLimit` It is copied from the `lowVoltageLimit` property.
- `HighVoltageLimit` It is copied from the `highVoltageLimit` property.

#### ConnectivityNode / TopologicalBus

If the CGMES model is a `node/breaker` model then the `connectivityNodes` are defined, and for each of them a `node` associated to the corresponding voltage level is created in the PowSyBl grid model. A `node` in the PowSyBl model is only an integer identifier that is unique by voltage level. If the import option `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` is `true` an additional `busBarSection` is also created in the same voltage level. The attributes of the `busBarSection` are:
- `Id` The `Id` of the CGMES `connectivityNode` is copied.
- `Name` The `name` of the CGMES attribute of the `connectivityNode` is copied.
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

In all the components of the PowSyBl grid model is obligatory to specify an `Id` (unique identifier) and optionally a human readable `Name`. As in this conversion process both attributes are copied directly from the same attributes of the corresponding CGMES network component they will be omitted in the following sections.

<span style="color: red">TODO General aliases recorded in all network components</span> 

#### EnergyConsumer

Every `energyConsumer` component in the CGMES model creates a new `load` in the PowSyBl grid model associated to the corresponding voltage level. The attributes are:
- `P0` One of these four values (`P` from the `stateVariablesPowerFlow`, `P` from the `steadyStateHypothesisPowerFlow`, `P` from the `pFixed` attribute of the CGMES equipment, or `NaN`) is copied according to the import options.
- `Q0` One of these four values (`Q` from the `stateVariablesPowerFlow`, `Q` from the `steadyStateHypothesisPowerFlow`, `Q` from the `qFixed` attribute of the CGMES equipment, or `NaN`) is copied according to the import options.
- `LoadType` It will be `FICTITIOUS` if the `Id` of the `energyConsumer` contains the pattern `fict`. Otherwise `UNDEFINED`.
- `LoadDetail` Additional information added as an extension of the main network component class.

If the import option `iidm.import.cgmes.profile-used-for-initial-state-values` is `SV` the active and reactive power of the load is the first defined value of the sequence `stateVariablesPowerFlow`, `steadyStateHypothesisPowerFlow`, `Fixed` and `NaN`. Otherwise if it is `SSH` then the sequence will be `steadyStateHypothesisPowerFlow`, `stateVariablesPowerFlow`, `Fixed` and `NaN`.

The `LoadDetail` depends  on the load Kind (property `type` of the CGMES `energyConsumer`). If the type of the `energyConsumer` is a conform load the following attributes are defined:
- `withFixedActivePower` Always `0.0`.
- `withFixedReactivePower` Always `0.0`.
- `withVariableActivePower` The load `P0` attribute is copied.
- `withVariableReactivePower` The load `Q0` attribute is copied.

and when the type is a non-conform load the defined attributes are:
- `withFixedActivePower` The load `P0` attribute is copied.
- `withFixedReactivePower` The load `Q0` attribute is copied.
- `withVariableActivePower` Always `0.0`.
- `withVariableReactivePower` Always `0.0`.

#### EnergySource

For each `energySource` component in the CGMES model a new `load` in the PowSyBl grid model is associated to the corresponding voltage level. The attributes are:
- `P0` One of these two values (`P` from the `stateVariablesPowerFlow` or `P` from the `steadyStateHypothesisPowerFlow`) is copied according to the import options.
- `Q0` One of these tow values (`Q` from the `stateVariablesPowerFlow` or `Q` from the `steadyStateHypothesisPowerFlow`) is copied according to the import options.
- `LoadType` It will be `FICTITIOUS` if the `Id` of the `energySource` contains the pattern `fict`. Otherwise `UNDEFINED`.

If the import option `iidm.import.cgmes.profile-used-for-initial-state-values` is `SV` the active and reactive power of the load is copied from the `stateVariablesPowerFlow`. Otherwise if it is `SSH` will be copy from`steadyStateHypothesisPowerFlow`.

#### EquivalentInjection

The PowSyBl network component created by an `equivalentInjection` of the CGMES grid model can vary depending on where it is located, inside or outside the boundary. If the `equivalentInjection` is located outside the boundary a `generator` will be created. If it is inside and the import option `iidm.import.cgmes.convert-boundary` is `true` then the conversion process will import all the equipments inside the boundary and a `generator`, as in the previous case, will be created. Otherwise, if the `equivalentInjection` is regulating voltage and a dangling line is created at the boundary the regulating voltage data of the `equivalentInjection` will be transferred to the `danglingLine`.

When a generator is created it is associated to the corresponding voltage level and has the following attributes:
- `MinP` The property `minP` is copied if it is defined, otherwise `-Double.MAX_VALUE`.
- `MinP` The property `maxP` is copied if it is defined, otherwise `Double.MAX_VALUE`.
- `TargetP` The active power `P` from the `stateVariablesPowerFlow` or from the `steadyStateHypothesisPowerFlow` according with the import options and with the opposite sign as it is a target value.  `0.0` if both properties are not defined.
- `TargetQ` The reactive power `Q` from the `stateVariablesPowerFlow` or from the `steadyStateHypothesisPowerFlow` according with the import options and with the opposite sign. `0.0` if both properties are not defined.
- `TargetV` The `regulationTarget` property is copied if it is non zero. Otherwise the nominal voltage of the voltage level associated to the connected terminal of the `equivalentInjection` is assigned.
- `VoltageRegulatorOn` It is assigned to `true` if both properties `regulationCapability` and `regulationStatus` are `true` and the terminal is connected.
- `EnergySource` Fixed to `OTHER`.

The PowSyBl grid model accepts one definition of limits, either `MinMaxReactiveLimits` or ReactiveCapabilityCurve. The first step is to define the points of the curve. At each point the active power value, the minimum reactive and the maximum reactive power value are specified by coping the value of the properties `xvalue`, `y1value` and `y2value` of the capability curve associated to the `curveId` recorded in the property `ReactiveCapabilityCurve`. After that a `MinMaxReactiveLimits` is created if there is only a point and a `ReactiveCapabilityCurve` in another case.

The best way to determine the final topology at the boundary, it is to wait until the end of the conversion process. At this point all the CGMES network components connected to the boundary node have been recorded and will be possible to determine it. So if the `equivalentInjection` is not used to create a generator at this step of the conversion process it will be recorded as an equipment attached to the boundary node. See [Boundary Topology](#boundary-topology) to know  the final topology at the boundary.

#### Switches


#### Boundary Topology

The boundary topology.

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
