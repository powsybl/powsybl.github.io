---
layout: default
---

# CIM-CGMES

The CGMES (**C**ommon **G**rid **M**odel **E**xchange **S**pecification) is an IEC technical specification (TS 61970-600-1, TS 61970-600-2) based on the IEC CIM (**C**ommon **I**nformation **M**odel) family of standards. It was developed to meet necessary requirements for TSO data exchanges in the areas of system development and system operation. In this scenario the agents (the Modelling Authorities) generate their Individual Grid Models (IGM) that can be assembled to build broader Common Grid Models (CGM). Boundaries between IGMs are well defined: the boundary data is shared between the modelling agents and contain all boundary points required for a given grid model exchange.

In CGMES an electric power system model is described by data grouped in different subsets (profiles) and exchanged as CIM/XML files, with each file associated to a given profile. The profiles considered in PowSyBl are:
- `EQ` Equipment. Contains data that describes the equipment present in the network and its physical characteristics.
- `SSH` Steady State Hypothesis. Required input parameters to perform power flow analysis; e.g., energy injections and consumptions and setpoint values for regulating controls.
- `TP` Topology. Describe how the equipment is electrically connected. Contains the definition of power flow buses.
- `SV` State Variables. Contains all the information required to describe a steady-state power flow solution over the network.
- `EQBD` Equipment Boundary. Contains definitions of the equipment in the boundary.
- `TPBD` Topology Boundary. Topology information associated to the boundary.

CGMES model connectivity can be defined at two different levels of detail:

`Node/breaker` This is the level of detail required for Operation. The `EQ` contains Connectivity Nodes where the conducting equipment are attached through its Terminals. All switching devices (breakers, disconnectors, ...) are modelled. The contents of the `TP` file must be the result of the topology processing over the graph defined by connectivity nodes and switching devices, taking into account its open/closed status.

`Bus/branch` No Connectivity Nodes are present in the `EQ` file. The association of every equipment to a bus is defined directly in the `TP` file, that must be provided.

* TOC
{:toc}

## Format specification

Current supported versions of CGMES are 2.4.15 and 3.0. To learn more about the standard, read the documents in the [Common Grid Model Exchange Standard (CGMES) Library](https://www.entsoe.eu/digital/cim/cim-for-grid-models-exchange/).

## Triple store
A triplestore or RDF store is a purpose-built database for the storage and retrieval of triples through semantic queries. A triple is a data
entity composed of subject-predicate-object such as "Generator is in France", or in RDF/XML:
```xml
<rdf:description rdf:about="generator">
  <generator:in>France</generator:in>
</rdf:description>
```

Input CGMES data read from CIM/XML files is stored natively in a purpose specific database for RDF statements (a Triplestore). There are multiple open-source implementations of Triplestore engines that could be easily plugged in PowSyBl.
The only supported Triplestore engine used by PowSyBl is [RDF4J](https://rdf4j.org/).
Loading from RDF/XML files to the Triplestore is highly optimized by these engines. Furthermore, the Triplestore repository can be configured to use an in-memory store, allowing faster access to data.

### In-memory Rdf4j
<span style="color: red">TODO</span>

## Import

The CGMES importer reads and converts a CGMES model to the PowSyBl grid model. The import process is performed in two steps:
- Read input files into a triplestore
- Convert CGMES data retrieved by SPARQL requests from the created triplestore to PowSyBl grid model

The data in input CIM/XML files uses RDF (Resource Description Framework) syntax. In RDF, data is described making statements about resources using triplet expressions: (subject, predicate, object).
To describe the conversion from CGMES to PowSyBl we first introduce some generic considerations about the level of detail of the model (node/breaker or bus/branch), the identity of the equipments and equipment containment in substations and voltage levels. After that, the conversion for every CGMES relevant class is explained. Consistency checks and validations performed during the conversion are mentioned in the corresponding sections.

### Levels of detail: node/breaker and bus/branch

CGMES models defined at node/breaker level of detail will be mapped to PowSyBl node/breaker topology level. CGMES models defined at bus/branch level will be mapped to PowSyBl bus/breaker topology level.

For each equipment in the PowSyBl grid model it is necessary to specify how it should be connected to the network.

If the model is specified at the bus/breaker level, a `Bus` must be specified for the equipment.

If the voltage level is built at node/breaker level, a `Node` must be specified when adding the equipment to PowSyBl. The conversion will create a different `Node` in PowSyBl for each equipment connection.

Using the `Node` or `Bus` information, PowSyBl creates a `Terminal` that will be used to manage the point of connection of the equipment to the network.

Some equipment, like switches, lines or transformers, have more than one point of connection to the Network.

In PowSyBl, a `Node` can have zero or one terminal. In CGMES, the `ConnectivityNode` objects may have more than one associated terminals. To be able to represent this in PowSyBl, the conversion process will automatically create internal connections between the PowSyBl nodes that represent equipment connections and the nodes created to map CGMES `ConnectivityNode` objects.

### Identity of model equipments

Almost all the equipments of the PowSyBl grid model require a unique identifier `Id` and may optionally have a human readable `Name`. Whenever possible, these attributes will be directly copied from original CGMES attributes.

Terminals are used by CGMES and PowSyBl to define the points of connection of the equipment to the network. CGMES terminals have unique identifiers. PowSyBl does not allow terminals to have an associated identifier. Information about original CGMES terminal identifiers is stored in each PowSyBl object using aliases.

### Equipment containers: substations and voltage levels

The PowSyBl grid model establishes the substation as a required container of voltage levels and transformers (two and three windings transformers and phase shifters). Voltage levels are the required container of the rest network equipments, except for the AC and DC transmission lines that establish connections between substations and are associated directly to the network model. All buses at transformer ends should be kept at the same substation.

The CGMES model does not guarantee these hierarchical constraints, so the first step in the conversion process is to identify all the transformers with ends in different substations and all the breakers and switches with ends in different voltage levels. All the voltage levels connected by breakers or switches should be mapped to a single voltage level in the PowSyBl grid model. The first CGMES voltage level, in alphabetical order, will be the representative voltage level associated to the PowSyBl voltage level. The same criterion is used for substations, and the first CGMES substation will be the representative substation associated to the PowSyBl one. The joined voltage levels and substations information is used almost in every step of the mapping between CGMES and PowSyBl models, and it is recorded in the `Context` conversion class, that keeps data throughout the overall conversion process.

### Conversion from CGMES to PowSyBl grid model

The following sections describe in detail how each supported CGMES network component is converted to PowSyBl network model objects.

#### Substation

For each substation (considering only the representative substation if they are connected by transformers) in the CGMES model a new substation is created in the PowSyBl grid model with the following attributes:
- `Country` It is obtained from the `regionName` property as first option, from `subRegionName` as second option. Otherwise, is assigned to `null`.
- `GeographicalTags` It is obtained from the `SubRegion` property.

#### VoltageLevel

As in the substations, for each voltage level (considering only the representative voltage level if they are connected by switches) in the CGMES model a new voltage level is created in the PowSyBl grid model with the following attributes:
- `NominalV` It is copied from the `nominalVoltage` property of the CGMES voltage level.
- `TopologyKind` It will be `NODE_BREAKER` or `BUS_BREAKER` depending on the level of detail of the CGMES grid model.
- `LowVoltageLimit` It is copied from the `lowVoltageLimit` property.
- `HighVoltageLimit` It is copied from the `highVoltageLimit` property.

#### ConnectivityNode

If the CGMES model is a node/breaker model then `ConnectivityNode` objects are present in the CGMES input files, and for each of them a new `Node` is created in the corresponding PowSyBl voltage level. A `Node` in the PowSyBl model is an integer identifier that is unique by voltage level.

If the import option `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` is `true` an additional busbar section is also created in the same voltage level. This option is used to debug the conversion and facilitate the comparison of the topology present in the CGMES input files and the topology computed by PowSyBl. The attributes of the busbar section are:
- Identity attributes `Id` and `Name` are copied from the `ConnectivityNode`.
- `Node` The same `Node` assigned to the mapped `ConnectivityNode`.

#### TopologicalNode

If the CGMES model is defined at bus/branch detail, then CGMES `TopologicalNode` objects are used in the conversion, and for each of them a `Bus` is created in the PowSyBl grid model inside the corresponding voltage level container, at the PowSyBl bus/breaker topology level. The created `Bus` has the following attributes:
- Identity attributes `Id` and `Name` are copied from the `TopologicalNode`.
- `V` The voltage of the `TopologicalNode` is copied if it is valid (greater than `0`).
- `Angle` The angle the `TopologicalNode` is copied if the previous voltage is valid.

#### BusbarSection

Busbar sections can be created in PowSyBl grid model only at node/breaker level.

CGMES Busbar sections are mapped to PowSyBl busbar sections only if CGMES is node/breaker and the import option `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` is set to `false`. In this case, a `BusbarSection` is created in the PowSyBl grid model for each `BusbarSection` of the CGMES model, with the attributes:
- Identity attributes `Id` and `Name` are copied from the CGMES `BusbarSection`.
- `Node` A new `Node` in the corresponding voltage level.

#### EnergyConsumer

Every `EnergyConsumer` object in the CGMES model creates a new `Load` in PowSyBl. The attributes are:
- `P0`, `Q0` are set from CGMES values taken from `SSH`, `SV`, or `EQ` data depending on the import options.
- `LoadType` It will be `FICTITIOUS` if the `Id` of the `energyConsumer` contains the pattern `fict`. Otherwise `UNDEFINED`.
- `LoadDetail` Additional information about conform and non-conform loads is added as an extension of the `Load` object (for more details about the [extension](../model/extensions.md#load-detail)).

If the import option `iidm.import.cgmes.profile-used-for-initial-state-values` is `SSH` (the default) the active and reactive power of the load are the first defined values present in the sequence `SSH` (`EnergyConsumer.p/q`), `SV` (`SvPowerFlow.p/q` given at EnergyConsumer terminal), `EQ` (`EnergyConsumer.pFixed/qFixed`). Otherwise, if it is `SV` then the sequence used will be `SV`, `SSH`, `EQ`. If no values can be obtained from CGMES, `P0` and `Q0` will be set to `NaN`.

The `LoadDetail` extension attributes depend on the `type` property of the CGMES `EnergyConsumer`. For a conform load:
- `withFixedActivePower` is always `0`.
- `withFixedReactivePower` is always `0`.
- `withVariableActivePower` is set to the Load `P0`.
- `withVariableReactivePower` is set to the Load `Q0`.

When the type is a non-conform load:
- `withFixedActivePower` is set to the Load `P0`.
- `withFixedReactivePower` is set to the Load `Q0`.
- `withVariableActivePower` is set to `0`.
- `withVariableReactivePower` is set to `0`.

#### EnergySource

A CGMES EnergySource is a generic equivalent for an energy supplier, with the injection given using load sign convention.

For each `EnergySource` object in the CGMES model a new PowSyBl `Load` is created, with attributes:
- `P0`, `Q0` set from `SSH` or `SV` values depending on import options.
- `LoadType` It will be `FICTITIOUS` if the `Id` of the `energySource` contains the pattern `fict`. Otherwise `UNDEFINED`.

If the import option `iidm.import.cgmes.profile-used-for-initial-state-values` is `SSH` (the default) the active and reactive power of the load are copied from the `SSH` values (`EnergySource.activePower/reactivePower`). If it is `SV` they will be assigned from the values seen in `SvPowerFlow.p/q` object associated to the EnergySource terminal.

#### SvInjection

CMES uses `SvInjection` objects to report mismatches on calculated buses: they record the calculated bus injection minus the sum of the terminal flows. According to the documentation, the values will thus follow generator sign convention: positive sign means injection into the bus. Note that all the reference cases used for development follow load sign convention to report these mismatches, so we have decided to follow this load sign convention as a first approach.

For each `SvInjection` in the CGMES network model a new PowSyBl `Load` with attributes:
- `P0`, `Q0` are set from `SvInjection.pInjection/qInjection`.
- `LoadType` is always set to `FICTITIOUS`.
- `Fictitious` is set to `true`.

#### EquivalentInjection

The mapping of a CGMES `EquivalentInjection` depends on its location relative to the boundary area.

If the `EquivalentInjection` is outside the boundary area it will be mapped to a PowSyBl `Generator`.

If the `EquivalentInjection` is at the boundary area its regulating voltage data will be mapped to the generation data inside the PowSyBl `DanglingLine` created at the boundary point and its values for `P`, `Q` will be used to define the DanglingLine `P0`, `Q0`.

The PowSyBl generator attributes:
- `MinP`/`MaxP` are copied from CGMES `minP`/`maxP` if defined, otherwise they are set to `-Double.MAX_VALUE`/`Double.MAX_VALUE`.
- `TargetP`/`TargetQ` are set from `SSH` or `SV` values depending on the import option. CGMES values for `p`/`q` are given with load sign convention, so a change in sign is applied when copying them to `TargetP`/`TargetQ`.
- `TargetV` The `regulationTarget` property is copied if it is not equal to zero. Otherwise, the nominal voltage associated to the connected terminal of the `equivalentInjection` is assigned. For CGMES Equivalent Injections the voltage regulation is allowed only at the point of connection.
- `VoltageRegulatorOn` It is assigned to `true` if both properties, `regulationCapability` and `regulationStatus` are `true` and the terminal is connected.
- `EnergySource` is set to `OTHER`.

#### ACLineSegment
<span style="color: red">TODO</span>

#### EquivalentBranch
<span style="color: red">TODO</span>

#### AsychronousMachine / SynchronousMachine
<span style="color: red">TODO</span>

#### EquivalentShunt
<span style="color: red">TODO</span>

#### ExternalNetworkInjection
<span style="color: red">TODO</span>

#### OperationalLimit
<span style="color: red">TODO</span>

#### SeriesCompensator
<span style="color: red">TODO</span>

#### Shunt
<span style="color: red">TODO</span>

#### StaticVarCompensator
<span style="color: red">TODO</span>

#### Switch
<span style="color: red">TODO</span>

### Extensions
<span style="color: red">TODO</span>

### Options

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../user/configuration/import-export-parameters-default-value.md) module.

**iidm.import.cgmes.allow-unsupported-tap-changers**  
The `iidm.import.cgmes.allow-unsupported-tap-changers` property is an optional property that determines if every tap changer is read in order to be converted in best effort or if only supported tap changers are read and converted. By default, its value is `true`.

**iidm.import.cgmes.boundary-location**  
The `iidm.import.cgmes.boundary-location` property is an optional property that defines the directory path where the CGMES importer can find the boundary files (`EQBD` and `TPBD` profiles) if they are not present in the imported zip file. By default, its value is `<ITOOLS_CONFIG_DIR>/CGMES/boundary`.

**iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state**  
The `iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state` property is an optional property
that defines if the CGMES importer inverts the sign of reactive power flows for shunt compensators. Its default value is `false`.

**iidm.import.cgmes.convert-boundary**  
The `iidm.import.cgmes.convert-boundary` property is an optional property that defines if the CGMES importer imports equipments that are located inside the boundaries or not. Its default value is `false`.

**iidm.import.cgmes.convert-sv-injections**
The `iidm.import.cgmes.convert-sv-injections` property is an optional property that defines if SV injections are imported as loads. Its default value is `true`.

**iidm.import.cgmes.create-active-power-control-extension**
The `iidm.import.cgmes.create-active-power-control-extension` property is an optional property that defines if active power extensions are created for CGMES `normalPF` attribute.
Its default value is `false`.

**iidm.import.cgmes.create-busbar-section-for-every-connectivity-node**  
The `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` property is an optional property that defines if the CGMES importer creates an [IIDM Busbar Section](../model/index.md#busbar-section) for each CGMES connectivity node. Its default value is `false`.

**iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode**
The `iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode` property is an optional property that defines if fictitious switches are created when terminals are described as disconnected in CGMES node-breaker networks.
Three modes are available:
- `ALWAYS`: fictitious switches are created at every disconnected terminal
- `ALWAYS_EXCEPT_SWITCHES`: fictitious switches are created at every disconnected terminal that is not a switch terminal
- `NEVER`: no fictitious switch is created at disconnected terminals
Its default value is `ALWAYS`.

**iidm.import.cgmes.decode-escaped-identifiers**
The `iidm.import.cgmes.decode-escaped-identifiers` property is an optional property that defines if identifiers with characters escaped during the triplestore creation are decoded.
Its default value is `true`.

**iidm.import.cgmes.ensure-id-alias-unicity**  
The `iidm.import.cgmes.ensure-id-alias-unicity` property is an optional property that defines if IDs' and aliases' unicity is ensured during CGMES import. If it is set to `true`, identical CGMES IDs will be modified to be unique. If it is set to `false`, identical CGMES IDs will throw an exception. Its default value is `false`.

**iidm.import.cgmes.id-mapping-file-path**
The `iidm.import.cgmes.id-mapping-file-path` property is an optional property that defines the path of the CSV file containing a mapping between IIDM identifiers and CGMES identifiers. By default, its value is `null`:
ID-mapping CSV file is read only if it is in the imported compressed file.

**iidm.import.cgmes.import-control-areas**  
The `iidm.import.cgmes.import-control-areas` property is an optional property that defines if control areas must be imported or not. Its default value is `true`.

**iidm.import.cgmes.naming-strategy**
THe `iidm.import.cgmes.naming-strategy` property is an optional property that defines which kind of mapping is made between
CGMES identifiers and IIDM identifiers.
It can be:
- `identity`: CGMES IDs are the same as IIDM IDs
- `cgmes`: if CGMES IDs have associated IIDM IDs in a mapping file, IIDM ID is applied (CGMES ID is an alias). if CGMES IDs do not have associated IIDM IDs in a mapping file but are not compliant with CGMES requirements and correspond to an IIDM `Identifiable`, a new CGMES ID is created as an alias.
- `cgmes-fix-all-invalid-ids`: if CGMES IDs have associated IIDM IDs in a mapping file, IIDM ID is applied (CGMES ID is an alias). if CGMES IDs do not have associated IIDM IDs in a mapping file but are not compliant with CGMES requirements, a new CGMES ID is created as an alias.
  Its default value is `identity`.

**iidm.import.cgmes.post-processors**  
The `iidm.import.cgmes.post-processors` property is an optional property that defines all the CGMES post-processors which will be activated after import.
By default, it is an empty list.
One implementation of such a post-processor is available in PowSyBl in the [powsybl-diagram](../../developer/repositories/powsybl-diagram.md) repository, named [CgmesDLImportPostProcessor](#CgmesDLImportPostProcessor).

**iidm.import.cgmes.powsybl-triplestore**  
The `iidm.import.cgmes.powsybl-triplestore` property is an optional property that defines which Triplestore implementation is used. PowSyBl supports the [RDF4J](#rdf4j) and [Jena](#jena) Triplestore implementations. This property has `rdf4j` as default value.

**iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions**
The `iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions` property is an optional property that defines which CGMES profile is used to initialize tap positions and section counts. It can be `SSH` or `SV`. Its default value is `SSH`.

**iidm.import.cgmes.source-for-iidm-id**
The `iidm.import.cgmes.source-for-iidm-id` property is an optional property that defines if IIDM IDs must be the CGMES mRID or the CGMES rdfID. Its default value is `mRID`.

**iidm.import.cgmes.store-cgmes-model-as-network-extension**  
The `iidm.import.cgmes.store-cgmes-model-as-network-extension` property is an optional property that defines if the CGMES model is stored in the imported IIDM network as an [extension](../model/extensions.md#cgmes-model). Its default value is `true`.

**iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension**  
The `iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension` property is an optional property that defines if the CGMES conversion context will be stored as an extension of the IIDM output network. Its default value is `false`.

## CGMES post-processors

### CgmesDLImportPostProcessor
This post-processor loads the diagram layout (DL) profile contained in the CGMES file, if available, into the triplestore.
The diagram layout profile contains the data which is necessary to represent a drawing of the diagram corresponding to the CGMES file.
For instance, it contains the position of all equipments.

This post-processor is enabled by adding the name `cgmesDLImport` to the list associated to `iidm.import.cgmes.post-processors` property.

### CgmesMeasurementsPostProcessor
<span style="color: red">TODO</span>

### CgmesShortCircuitPostProcessor
<span style="color: red">TODO</span>

### EntsoeCategoryPostProcessor
<span style="color: red">TODO</span>

### PhaseAngleClock
<span style="color: red">TODO</span>

## Export
<span style="color: red">TODO</span>

### Options

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../user/configuration/import-export-parameters-default-value.md) module.

**iidm.export.cgmes.base-name**
The `iidm.export.cgmes.base-name` property is an optional property that defines the base name of the exported files. Exported CGMES files' names will look like this:
```yaml
<base_name>_EQ.xml
<base_name>_TP.xml
<base_name>_SSH.xml
<base_name>_SV.xml
```
By default, the base name is the network's name if it exists, as a last resort, the network's ID.

**iidm.export.cgmes.boundary-eq-id**
The `iidm.export.cgmes.boundary-eq-id` property is an optional property that defines the ID of the EQ-BD model if there is any.
Its default value is `null`: we consider there is no EQ-BD model to consider.

**iidm.export.cgmes.boundary-tp-id**
The `iidm.export.cgmes.boundary-tp-id` property is an optional property that defines the ID of the TP-BD model if there is any.
Its default value is `null`: we consider there is no TP-BD model to consider.

**iidm.export.cgmes.cim-version**
The `iidm.export.cgmes.cim-version` property is an optional property that defines the CIM version number in which the user wants the CGMES files to be exported.
CIM version 14 and 16 are supported i.e. its valid values are `14` or `16`.
If not defined, and the network has the extension `CimCharacteristics`, the CIM version will be the one indicated in the extension. If not, its default value is `16`.

**iidm.export.cgmes.export-boundary-power-flows**
The `iidm.export.cgmes.export-boundary-power-flows` property is an optional property that defines if power flows of boundary nodes are to be exported in the SV file or not.
Its default value is `true`.

**iidm.export.cgmes.export-power-flows-for-switches**
The `iidm.export.cgmes.export-power-flows-for-switches` property is an optional property that defines if power flows of switches are exported in the SV file.
Its default value is `false`.

**idm.export.cgmes.naming-strategy**
The `iidm.export.cgmes.naming-strategy` property is an optional property that defines which naming strategy is used.
It can be:
- `identity`: CGMES IDs are the same as IIDM IDs
- `cgmes`: IDs of IIDM `Identifiables` are exported as CGMES IDs if they are not compliant with CGMES requirements 
- `cgmes-fix-all-invalid-ids`: all IDs are exported as CGMES IDs if they are not compliant with CGMES requirements
Its default value is `identity`.

**iidm.export.cgmes.profiles**
The `iidm.export.cgmes.profiles` property is an optional property that defines the exported CGMES profiles.
By default, it is a full CGMES export: EQ, TP, SSH and SV are exported.

## Examples
Have a look to the [CGMES sample files](https://www.entsoe.eu/Documents/CIM_documents/Grid_Model_CIM/TestConfigurations_packageCASv2.0.zip)
from ENTSO-E Test Configurations for Conformity Assessment Scheme v2.0.
