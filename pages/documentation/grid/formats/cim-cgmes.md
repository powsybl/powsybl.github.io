---
layout: default
---

# CIM-CGMES

The CGMES (**C**ommon **G**rid **M**odel **E**xchange **S**pecification) is an IEC technical specification (TS 61970-600-1, TS 61970-600-2) based on the IEC CIM (**C**ommon **I**nformation **M**odel) family of standards. It was developed to meet necessary requirements for TSO data exchanges in the areas of system development and system operation. In this scenario the agents (the Modelling Authorities) generate their Individual Grid Models (IGM) that can be assembled to build broader Common Grid Models (CGM). Boundaries between IGMs are well defined: the boundary data is shared between the modelling agents and contain all boundary points required for a given grid model exchange.

In CGMES, an electric power system model is described by data grouped in different subsets (profiles) and exchanged as CIM/XML files, with each file associated to a given profile. The profiles considered in PowSyBl are:
- `EQ` Equipment. Contains data that describes the equipment present in the network and its physical characteristics.
- `SSH` Steady State Hypothesis. Required input parameters to perform power flow analysis; e.g., energy injections and consumptions and setpoint values for regulating controls.
- `TP` Topology. Describe how the equipment is electrically connected. Contains the definition of power flow buses.
- `SV` State Variables. Contains all the information required to describe a steady-state power flow solution over the network.
- `EQBD` Equipment Boundary. Contains definitions of the equipment in the boundary.
- `TPBD` Topology Boundary. Topology information associated to the boundary.
- `DL` Diagram Layout. Contains information about diagram positions.
- `GL` Geographical Layout. Contains information about geographical positions.

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
[Eclipse RDF4J™](https://rdf4j.org/about/) is an open source modular Java framework for working with RDF data. This includes parsing, storing, inferencing and querying of/over such data. It offers an easy-to-use API that can be connected to all leading RDF storage solutions. It allows you to connect with SPARQL endpoints and create applications
that leverage the power of Linked Data and Semantic Web.

Its in-memory implementation is the default triplestore engine use by PowSyBl for CIM-CGMES import.

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

For each substation (considering only the representative substation if they are connected by transformers) in the CGMES model a new substation is created in the PowSyBl grid model with the following attributes created as such:
- `Country` It is obtained from the `regionName` property as first option, from `subRegionName` as second option. Otherwise, is assigned to `null`.
- `GeographicalTags` It is obtained from the `SubRegion` property.

#### VoltageLevel

As in the substations, for each voltage level (considering only the representative voltage level if they are connected by switches) in the CGMES model a new voltage level is created in the PowSyBl grid model with the following attributes created as such:
- `NominalV` It is copied from the `nominalVoltage` property of the CGMES voltage level.
- `TopologyKind` It will be `NODE_BREAKER` or `BUS_BREAKER` depending on the level of detail of the CGMES grid model.
- `LowVoltageLimit` It is copied from the `lowVoltageLimit` property.
- `HighVoltageLimit` It is copied from the `highVoltageLimit` property.

#### ConnectivityNode

If the CGMES model is a node/breaker model then `ConnectivityNode` objects are present in the CGMES input files, and for each of them a new `Node` is created in the corresponding PowSyBl voltage level. A `Node` in the PowSyBl model is an integer identifier that is unique by voltage level.

If the import option `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` is `true` an additional busbar section is also created in the same voltage level. This option is used to debug the conversion and facilitate the comparison of the topology present in the CGMES input files and the topology computed by PowSyBl. The attributes of the busbar section are created as such:
- Identity attributes `Id` and `Name` are copied from the `ConnectivityNode`.
- `Node` The same `Node` assigned to the mapped `ConnectivityNode`.

#### TopologicalNode

If the CGMES model is defined at bus/branch detail, then CGMES `TopologicalNode` objects are used in the conversion, and for each of them a `Bus` is created in the PowSyBl grid model inside the corresponding voltage level container, at the PowSyBl bus/breaker topology level. The created `Bus` has the following attributes:
- Identity attributes `Id` and `Name` are copied from the `TopologicalNode`.
- `V` The voltage of the `TopologicalNode` is copied if it is valid (greater than `0`).
- `Angle` The angle the `TopologicalNode` is copied if the previous voltage is valid.

#### BusbarSection

Busbar sections can be created in PowSyBl grid model only at node/breaker level.

CGMES Busbar sections are mapped to PowSyBl busbar sections only if CGMES is node/breaker and the import option `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` is set to `false`. In this case, a `BusbarSection` is created in the PowSyBl grid model for each `BusbarSection` of the CGMES model, with the attributes created as such:
- Identity attributes `Id` and `Name` are copied from the CGMES `BusbarSection`.
- `Node` A new `Node` in the corresponding voltage level.

#### EnergyConsumer

Every `EnergyConsumer` object in the CGMES model creates a new `Load` in PowSyBl. The attributes are created as such:
- `P0`, `Q0` are set from CGMES values taken from `SSH`, `SV`, or `EQ` data depending on which are defined.
- `LoadType` It will be `FICTITIOUS` if the `Id` of the `energyConsumer` contains the pattern `fict`. Otherwise `UNDEFINED`.
- `LoadDetail` Additional information about conform and non-conform loads is added as an extension of the `Load` object (for more details about the [extension](../model/extensions.md#load-detail)).

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

A CGMES `EnergySource` is a generic equivalent for an energy supplier, with the injection given using load sign convention.

For each `EnergySource` object in the CGMES model a new PowSyBl `Load` is created, with attributes created as such:
- `P0`, `Q0` set from `SSH` or `SV` values depending on which are defined.
- `LoadType` It will be `FICTITIOUS` if the `Id` of the `energySource` contains the pattern `fict`. Otherwise `UNDEFINED`.

#### SvInjection

CMES uses `SvInjection` objects to report mismatches on calculated buses: they record the calculated bus injection minus the sum of the terminal flows. According to the documentation, the values will thus follow generator sign convention: positive sign means injection into the bus. Note that all the reference cases used for development follow load sign convention to report these mismatches, so we have decided to follow this load sign convention as a first approach.

For each `SvInjection` in the CGMES network model a new PowSyBl `Load` with attributes created as such:
- `P0`, `Q0` are set from `SvInjection.pInjection/qInjection`.
- `LoadType` is always set to `FICTITIOUS`.
- `Fictitious` is set to `true`.

#### EquivalentInjection

The mapping of a CGMES `EquivalentInjection` depends on its location relative to the boundary area.

If the `EquivalentInjection` is outside the boundary area, it will be mapped to a PowSyBl `Generator`.

If the `EquivalentInjection` is at the boundary area, its regulating voltage data will be mapped to the generation data inside the PowSyBl `DanglingLine` created at the boundary point and its values for `P`, `Q` will be used to define the DanglingLine `P0`, `Q0`. Please note that the said `DanglingLine` can be created from an [`ACLineSegment`](#aclinesegment), a [`Switch`](#switch-switch-breaker-disconnector-loadbreakswitch-protectedswitch-grounddisconnector),
an [`EquivalentBranch`](#equivalentbranch) or a [`PowerTransformer`](#powertransformer).

Attributes of the PowSyBl generator or of the PowSyBl dangling line's generation are created as such:
- `MinP`/`MaxP` are copied from CGMES `minP`/`maxP` if defined, otherwise they are set to `-Double.MAX_VALUE`/`Double.MAX_VALUE`.
- `TargetP`/`TargetQ` are set from `SSH` or `SV` values depending on which are defined. CGMES values for `p`/`q` are given with load sign convention, so a change in sign is applied when copying them to `TargetP`/`TargetQ`.
- `TargetV` The `regulationTarget` property is copied if it is not equal to zero. Otherwise, the nominal voltage associated to the connected terminal of the `equivalentInjection` is assigned. For CGMES Equivalent Injections the voltage regulation is allowed only at the point of connection.
- `VoltageRegulatorOn` It is assigned to `true` if both properties, `regulationCapability` and `regulationStatus` are `true` and the terminal is connected.
- `EnergySource` is set to `OTHER`.

#### ACLineSegment

CGMES `ACLineSegments`' mapping depends on its location relative to the boundary area.

If the `ACLineSegment` is outside the boundary area, it will be mapped to a PowSyBl [`Line`](../model/index.md#line).

If the `ACLineSegment` is completely inside the boundary area, if the boundaries are not imported, it is ignored. Otherwise, it is mapped to a PowSyBl [`Line`](../model/index.md#line).

If the `ACLineSegment` has one side inside the boundary area and one side outside the boundary area, the importer checks if another branch is connected to the same CGMES [`TopologicalNode`](#TopologicalNode) in the boundary area.
- If there is no other branch connected to this `TopologicalNode`, it will be mapped to a PowSyBl [`DanglingLine`](../model/index.md#dangling-line).
- If there are one or more other branches connected to this `TopologicalNode` and they all are in the same `SubGeographicalRegion`, they will all be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).
- If there is exactly one other branch connected to this `TopologicalNode` in another `SubGeographicalRegion`, they will both be mapped to PowSyBl [`HalfLines`](../model/index.md#half-line), which are part of the same PowSyBl [`TieLine`](../model/index.md#tie-line).
- If there are two or more other branches connected to this `TopologicalNode` in different `SubGeographicalRegions`:
  - If there are only two branches with their boundary terminal connected **and** in different `SubGeographicalRegion`, they will both be mapped to PowSyBl [`HalfLines`](../model/index.md#half-line), which are part of the same PowSyBl [`TieLine`](../model/index.md#tie-line) and all other `ACLineSegments` will be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).
  - Otherwise, they will all be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).

If the `ACLineSegment` is mapped to a PowSyBl [`Line`](../model/index.md#line):
- `R` is copied from CGMES `r`
- `X` is copied from CGMES `x`
- `G1` is calculated as half of CMGES `gch` if defined, `0.0` otherwise
- `G2` is calculated as half of CGMES `gch` if defined, `0.0` otherwise
- `B1` is calculated as half of CGMES `bch`
- `B2` is calculated as half of CGMES `bch`

If the `ACLineSegment` is mapped to a PowSyBl [`DanglingLine`](../model/index.md#dangling-line):
- `R` is copied from CGMES `r`
- `X` is copied from CGMES `x`
- `G` is copied from CMGES `gch` if defined, `0.0` otherwise
- `B` is copied from CGMES `bch`
- `PairingKey` is copied from the name of the `TopologicalNode` or the `ConnectivityNode` (respectively in `NODE-BREAKER` or `BUS-BRANCH`) inside boundaries
- `P0` is copied from CGMES `P` of the terminal at boundary side
- `Q0` is copied from CGMES `Q` of the terminal at boundary side

If the `ACLineSegment` is mapped to a PowSyBl [`HalfLine`](../model/index.md#half-line):
- `R` is copied from CGMES `r`
- `X` is copied from CGMES `x`
- `G1` is `0.0` is the Half Line is on side `ONE` of the Tie Line. If the Half Line is on side `TWO` of the Tie Line, it is copied from CGMES `gch` if defined, `0.0` otherwise.
- `G2` is `0.0` is the Half Line is on side `TWO` of the Tie Line. If the Half Line is on side `ONE` of the Tie Line, it is copied from CGMES `gch` if defined, `0.0` otherwise.
- `B1` is `0.0` is the Half Line is on side `ONE` of the Tie Line. If the Half Line is on side `TWO` of the Tie Line, it is copied from CGMES `bch`.
- `B2` is `0.0` is the Half Line is on side `TWO` of the Tie Line. If the Half Line is on side `ONE` of the Tie Line, it is copied from CGMES `bch`.
- `PairingKey` is copied from the name of the `TopologicalNode` or the `ConnectivityNode` (respectively in `NODE-BREAKER` or `BUS-BRANCH`) inside boundaries

#### EquivalentBranch

CGMES `EquivalentBranches`' mapping depends on its location relative to the boundary area.

If the `EquivalentBranch` is outside the boundary area, it will be mapped to a PowSyBl [`Line`](../model/index.md#line).

If the `EquivalentBranch` is completely inside the boundary area, if the boundaries are not imported, it is ignored. Otherwise, it is mapped to a PowSyBl [`Line`](../model/index.md#line).

If the `EquivalentBranch` has one side inside the boundary area and one side outside the boundary area, the importer checks if another branch is connected to the same CGMES [`TopologicalNode`](#TopologicalNode) in the boundary area.
- If there is no other branch connected to this `TopologicalNode`, it will be mapped to a PowSyBl [`DanglingLine`](../model/index.md#dangling-line).
- If there are one or more other branches connected to this `TopologicalNode` and they all are in the same `SubGeographicalRegion`, they will all be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).
- If there is exactly one other branch connected to this `TopologicalNode` in another `SubGeographicalRegion`, they will both be mapped to PowSyBl [`HalfLines`](../model/index.md#half-line), which are part of the same PowSyBl [`TieLine`](../model/index.md#tie-line).
- If there are two or more other branches connected to this `TopologicalNode` in different `SubGeographicalRegions`:
  - If there are only two branches connected with their boundary terminal connected **and** in different `SubGeographicalRegion`, they will both be mapped to PowSyBl [`HalfLines`](../model/index.md#half-line), which are part of the same PowSyBl [`TieLine`](../model/index.md#tie-line) and all other `EquivalentBranches` will be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).
  - Otherwise, they will all be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).

If the `EquivalentBranch` is mapped to a PowSyBl [`Line`](../model/index.md#line):
- `R` is copied from CGMES `r`
- `X` is copied from CGMES `x`
- `G1` is `0.0`
- `G2` is `0.0`
- `B1` is `0.0`
- `B2` is `0.0`

If the `EquivalentBranch` is mapped to a PowSyBl [`DanglingLine`](../model/index.md#dangling-line):
- `R` is copied from CGMES `r`
- `X` is copied from CGMES `x`
- `G` is `0.0`
- `B` is `0.0`
- `PairingKey` is copied from the name of the `TopologicalNode` or the `ConnectivityNode` (respectively in `NODE-BREAKER` or `BUS-BRANCH`) inside boundaries
- `P0` is copied from CGMES `P` of the terminal at boundary side
- `Q0` is copied from CGMES `Q` of the terminal at boundary side

#### AsychronousMachine

CGMES `AsynchronousMachines` represent rotating machines whose shaft rotates asynchronously with the electrical field.
It can be motor or generator; no distinction is made for the conversion of these two types.

A CGMES `AsynchronousMachine` is mapped to a PowSyBl [`Load`](../model/index.md#load) with attributes created as described below:
- `P0`, `Q0` are set from CGMES values taken from `SSH` or `SV`data depending on which are defined. If there is no defined data, it is `0.0`.
- `LoadType` is `FICTITIOUS` if the CGMES ID contains "`fict`". Otherwise, it is `UNDEFINED`.

#### SynchronousMachine
CGMES `SynchronousMachines` represent rotating machines whose shaft rotates synchronously with the electrical field.
It can be motor or generator; no distinction is made for the conversion of these two types.

A CGMES `SynchronousMachine` is mapped to a PowSyBl [`Generator`](../model/index.md#generator) with attributes created as described below:
- `MinP` is set from CGMES `GeneratingUnit.minOperatingP` on the `GeneratingUnit` associated with the `SynchronousMachine`. If invalid, `MinP` is `-Double.MAX_VALUE`.
- `MaxP` is set from CGMES `GeneratingUnit.maxOperatingP` on the `GeneratingUnit` associated with the `SynchronousMachine`. If invalid, `MaxP` is `Double.MAX_VALUE`.
- `ratedS` is copied from CGMES `ratedS`. If it is strictly lower than 0, it is considered undefined.
- `EnergySource` is defined from the CGMES `GeneratingUnit` class of the `GeneratingUnit` associated with the `SynchronousMachine`
  - If it is a `HydroGeneratingUnit`, `EnergySource` is `HYDRO`
  - If it is a `NuclearGeneratingUnit`, `EnergySource` is `NUCLEAR`
  - If it is a `ThermalGeneratingUnit`, `EnergySource` is `THERMAL`
  - If it is a `WindGeneratingUnit`, `EnergySource` is `WIND`
  - If it is a `SolarGeneratingUnit`, `EnergySource` is `SOLAR`
  - Else, `EnergySource` is `OTHER`
- `TargetP`/`TargetQ` are set from `SSH` or `SV` values depending on which are defined. CGMES values for `p`/`q` are given with load sign convention, so a change in sign is applied when copying them to `TargetP`/`TargetQ`. If undefined, `TargetP` is set from CGMES `GeneratingUnit.initialP` from the `GeneratingUnit` associated to the `SynchronousMachine` and `TargetQ` is set to `0`.

<span style="color: red">TODO reactive limits</span>

<span style="color: red">TODO regulation</span>

<span style="color: red">TODO normalPF</span>

#### EquivalentShunt

A CGMES `EquivalentShunt` is mapped to a PowSyBl linear [`ShuntCompensator`](../model/index.md#shunt-compensator). A linear shunt compensator has banks or sections with equal admittance values.
Its attributes are created as described below:
- `SectionCount` is `1` if the `EquivalentShunt` CGMES `Terminal` is connected, else it is `0`.
- `BPerSection` is copied from CGMES `b`
- `MaximumSectionCount` is set to `1`

#### ExternalNetworkInjection

CGMES `ExternalNetworkInjections` are injections representing the flows from an entire external network.

A CGMES `ExternalNetworkinjection` is mapped to a PowSyBl [`Generator`](../model/index.md#generator) with attributes created as described below:
- `MinP` is copied from CGMES `minP`
- `MaxP` is copied from CGMES `maxP`
- `TargetP`/`TargetQ` are set from `SSH` or `SV` values depending on which are defined. CGMES values for `p`/`q` are given with load sign convention, so a change in sign is applied when copying them to `TargetP`/`TargetQ`. If undefined, they are set to `0`.
- `EnergySource` is set as `OTHER`

<span style="color: red">TODO reactive limits</span>

<span style="color: red">TODO regulation</span>

#### LinearShuntCompensator

CGMES `LinearShuntCompensators` represent shunt compensators with banks or sections with equal admittance values.

A CGMES `LinearShuntCompensator` is mapped to a PowSybl [`ShuntCompensator`](../model/index.md#shunt-compensator) with `SectionCount` copied from CGMES SSH `sections` or CGMES `SvShuntCompensatorSections.sections`, depending on the import option. If none is defined, it is copied from CGMES `normalSections`.
The created PowSyBl shunt compensator is linear and its attributes are defined as described below:
- `BPerSection` is copied from CGMES `bPerSection` if defined. Else, it is `Float.MIN_VALUE`.
- `GPerSection` is copied from CGMES `gPerSection` if defined. Else, it is left undefined.
- `MaximumSectionCount` is copied from CGMES `maximumSections`.

<span style="color: red">TODO regulation</span>

#### NonlinearShuntCompensator

CGMES `NonlinearShuntCompensators` represent shunt compensators with banks or section addmittance values that differs.

A CGMES `NonlinearShuntCompensator` is mapped to a PowSyBl [`ShuntCompensator`](../model/index.md#shunt-compensator) with `SectionCount` copied from CGMES SSH `sections` or CGMES `SvShuntCompensatorSections.sections`, depending on the import option. If none is defined, it is copied from CGMES `normalSections`.
The created PowSyBl shunt compensator is non linear and has as many `Sections` as there are CGMES `NonlinearShuntCompensatorPoint` associated with the CGMES `NonlinearShuntCompensator` it is mapped to.

Sections are created from the lowest CGMES `sectionNumber` to the highest and each section has its attributes created as describe below:
- `B` is calculated as the sum of all CGMES `b` of `NonlinearShuntCompensatorPoints` with `sectionNumber` lower or equal to its `sectionNumber`
- `G` is calculated as the sum of all CGMES `g` of `NonlinearShuntCompensatorPoints` with `sectionNumber` lower or equal to its `sectionNumber`

<span style="color: red">TODO regulation</span>

#### OperationalLimit
<span style="color: red">TODO</span>

#### PowerTransformer

CGMES `PowerTransformers` represent electrical devices consisting of two or more coupled windings, each represented by a `PowerTransformerEnd`. PowSyBl only supports `PowerTransformers` with two or three windings.

##### PowerTransformer with two PowerTransformerEnds

If a CGMES `PowerTransformer` has two `PowerTransformerEnds`, both outside the boundary area, it is mapped to a PowSyBl [`TwoWindingsTransformer`](../model/index.md#two-windings-transformer).
Please note that in this case, if `PowerTransformerEnds` are in different substations, the substations are merged into one.

If a CGMES `PowerTransformer` has two `PowerTransformerEnds`, both completely inside the boundary area, and if the boundary area is not imported, the `PowerTransformer` is ignored. Otherwise, it is mapped to a PowSyBl [`TwoWindingsTransformer`](../model/index.md#two-windings-transformer).

If the `PowerTransformer` has one `PowerTransformerEnd` inside the boundary area and the other outside the boundary area, the importer checks if another branch is connected to the same CGMES [`TopologicalNode`](#TopologicalNode) in the boundary area.
- If there is no other connected to this `TopologicalNode`, it is mapped to a PowSyBl [`DanglingLine`](../model/index.md#dangling-line).
- If there is one or more other branches connected to this `TopologicalNode` and they are all in the same `SubGeographicalRegion`, they will all be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).
- If there is exactly one other branch connected to this `TopologicalNode` in another `SubGeographicalRegion`, they will both be mapped to PowSyBl [`HalfLines`](../model/index.md#half-line), which are part of the same PowSyBl [`TieLine`](../model/index.md#tie-line).
- If there are two or more other branches connected to this `TopologicalNode` in different `SubGeographicalRegions`:
  - If there are only two branches with their boundary terminal connected **and** in different `SubGeographicalRegion`, they will both be mapped to PowSyBl [`HalfLines`](../model/index.md#half-line), which are part of the same PowSyBl [`TieLine`](../model/index.md#tie-line) and all other `EquivalentBranches` will be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).
  - Otherwise, they will all be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).

In every case, a `PowerTransformer` with two `PowerTransformerEnds` is mapped to an intermediary model that corresponds to a PowSyBl [`TwoWindingsTransformer`](../model/index.md#two-windings-transformer).
For more information about this conversion, please look at the classes [`InterpretedT2xModel`](https://github.com/powsybl/powsybl-core/blob/main/cgmes/cgmes-conversion/src/main/java/com/powsybl/cgmes/conversion/elements/transformers/InterpretedT2xModel.java)
and [`ConvertedT2xModel`](https://github.com/powsybl/powsybl-core/blob/main/cgmes/cgmes-conversion/src/main/java/com/powsybl/cgmes/conversion/elements/transformers/ConvertedT2xModel.java).

If the `PowerTransformer` is finally mapped to a PowSyBl [`DanglingLine`](../model/index.md#dangling-line), its structural attributes (`R`, `X`, `G` and `B`) are calculated from the intermediary model's attributes, and the ratio from its ratio tap changer and/or its phase tap changer.
`P0` and `Q0` are set from CGMES `P` and `Q` values at boundary side; `PairingKey` is copied from the name of the `TopologicalNode` or the `ConnectivityNode` (respectively in `NODE-BREAKER` or `BUS-BRANCH`) inside boundaries.

If the `PowerTransformer` is finally mapped to a PowSyBl [`HalfLine`](../model/index.md#half-line), its attributes are calculated using a standard $$\pi$$ model with distributed parameters.

##### PowerTransformer with three PowerTransformerEnds

A CGMES `PowerTransformer` with three `PowerTransformerEnds` is mapped to a PowSyBl [`ThreeWindingsTransformer`](../model/index.md#three-windings-transformer).
Please note that in this case, if `PowerTransformerEnds` are in different substations, the substations are merged into one.

For more information about this conversion, please look at the classes [`InterpretedT3xModel`](https://github.com/powsybl/powsybl-core/blob/main/cgmes/cgmes-conversion/src/main/java/com/powsybl/cgmes/conversion/elements/transformers/InterpretedT3xModel.java)
and [`ConvertedT3xModel`](https://github.com/powsybl/powsybl-core/blob/main/cgmes/cgmes-conversion/src/main/java/com/powsybl/cgmes/conversion/elements/transformers/ConvertedT3xModel.java).

#### SeriesCompensator

CGMES `SeriesCompensators` represent series capacitors or reactors or AC transmission lines without charging susceptance.

If a CGMES `SeriesCompensator` has both its ends inside the same voltage level, it is mapped to a PowSyBl [`Switch`](../model/index.md#breakerswitch). In this case,
all its CGMES electrical attributes are ignored. It is considered as closed, fictitious and, if it is in a node-breaker voltage level, retained. Its `SwitchKind` is `BREAKER`.

If a CGMES `SeriesCompensator` has its ends inside different voltage levels, it is mapped to a PowSyBl [`Line`](../model/index.md#line) with attributes as described below:
- `R` is copied from CGMES `r`
- `X` is copied from CGMES `x`
- `G1`, `G2`, `B1` and `B2` are set to `0`

#### StaticVarCompensator

CGMES `StaticVarCompensators` represent a facility for providing variable and controllable shunt reactive power.

A CGMES `StaticVarCompensator` is mapped to a PowSyBl [`StaticVarCompensator`](../model/index.md#static-var-compensator) with attributes as described below:
- `Bmin` is calculated from CGMES `inductiveRating`: if it is defined and not equals to `0`, `Bmin` is `1 / inductiveRating`. Else, it is `-Double.MAX_VALUE`.
- `Bmax` is calculated from CGMES `capacitiveRating`: if it defined and not equals to `0`, `Bmax` is `1 / capacitiveRating`. Else, it is `Double.MAX_VALUE`.

A PowSyBl [`VoltagePerReactivePowerControl`](../model/extensions.md#voltage-per-reactive-power-control) extension is also created from the CGMES `StaticVarCompensator` and linked to the PowSyBl `StaticVarCompensator` with its `slope` attribute copied from CGMES `slope` if the latter is `0` or positive.

<span style="color: red">TODO regulation</span>

#### Switch (Switch, Breaker, Disconnector, LoadBreakSwitch, ProtectedSwitch, GroundDisconnector)

CGMES `Switches`, `Breakers`, `Disconnectors`, `LoadBreakSwitches`, `ProtectedSwitches` and `GroundDisconnectors` are
all imported in the same manner. For convenience purpose, we will now use CGMES `Switch` as a say but keep in mind that this section is valid for all these CGMES classes. 

If the CGMES `Switch` has its ends both inside the same voltage level, it is mapped to a PowSyBl [`Switch`](../model/index.md#breakerswitch) with attributes as described below:
- `SwitchKind` is defined depending on the CGMES class
  - If it is a CGMES `Breaker`, it is `BREAKER`
  - If it is a CGMES `Disconnector`, it is `DISCONNECTOR`
  - If it is a CGMES `LoadBreakSwitch`, it is `LOAD_BREAK_SWITCH`
  - Otherwise, it is `BREAKER`
- `Retained` is copied from CGMES `retained` if defined in node-breaker. Else, it is `false`.
- `Open` is copied from CGMES SSH `open` if defined. Else, it is copied from CGMES `normalOpen`. If neither are defined, it is `false`.

If the CGMES `Switch` has its ends in different voltage levels inside the same IGM, it is mapped to a [`Switch`](../model/index.md#breakerswitch) but the voltage levels, and potentially the substations, that contain its ends are merged: they are mapped to only one voltage level and/or substation.
The created PowSyBl `Switch` has its attributes defined as described above.

If the `Switch` has one side inside the boundary area and the other side outside the boundary area, the importer checks if another branch is connected to the same CGMES [`TopologicalNode`](#TopologicalNode) in the boundary area.
- If there is no other branch connected to this `TopologicalNode`, it will be mapped to a PowSyBl [`DanglingLine`](../model/index.md#dangling-line).
- If there are one or more other branches connected to this `TopologicalNode` and they all are in the same `SubGeographicalRegion`, they will all be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).
- If there is exactly one other branch connected to this `TopologicalNode` in another `SubGeographicalRegion`, they will both be mapped to PowSyBl [`HalfLines`](../model/index.md#half-line), which are part of the same PowSyBl [`TieLine`](../model/index.md#tie-line).
- If there are two or more other branches connected to this `TopologicalNode` in different `SubGeographicalRegions`:
  - If there are only two branches with their boundary terminal connected **and** in different `SubGeographicalRegion`, they will both mapped to PowSyBl [`HalfLines`](../model/index.md#half-line), which are part of the same PowSyBl [`TieLine`](../model/index.md#tie-line) and all other `EquivalentBranches` will be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).
  - Otherwise, they will all be mapped to PowSyBl [`DanglingLines`](../model/index.md#dangling-line).

If the CGMES `Switch` is mapped to a PowSyBl [`DanglingLine`](../model/index.md#dangling-line), its attributes are as described below:
- `R`, `X`, `G`, `B` are `0.0`;
- `PairingKey` is copied from the name of the `TopologicalNode` or the `ConnectivityNode` (respectively in `NODE-BREAKER` or `BUS-BRANCH`) inside boundaries;
- `P0` is copied from CGMES `P` of the terminal at boundary side;
- `Q0` is copied from CGMES `Q` of the terminal at boundary side

### Extensions

The CIM-CGMES format contains more information than what the `iidm` grid model needs for calculation. The additional data, that are needed to export a network in CIM-CGMES format, are stored in several extensions. 

#### CIM-CGMES control areas

This extension models all the control areas contained in the network as modeled in CIM-CGMES.

| Attribute           | Type                           | Unit | Required | Default value | Description                              |
|---------------------|--------------------------------|------|----------|---------------|------------------------------------------|
| CGMES control areas | `Collection<CgmesControlArea>` | -    | no       | -             | The list of control areas in the network |

**CGMES control area**

| Attribute                        | Type       | Unit | Required | Default value | Description                                              |
|----------------------------------|------------|------|----------|---------------|----------------------------------------------------------|
| ID                               | String     | -    | yes      | -             | The ID of the control area                               |
| name                             | String     | -    | no       | -             | The name of the control area                             |
| Energy Identification Code (EIC) | String     | -    | no       | -             | The EIC control area                                     |
| net interchange                  | double     | -    | no       | -             | The net interchange of the control area (at its borders) |
| terminals                        | `Terminal` | -    | no       | -             | Terminals at the border of the control area              |
| boundaries                       | `Boundary` | -    | no       | -             | Boundaries at the border of the control area             |

It is possible to retrieve a control area by its ID. It is also possible to iterate through all control areas.

This extension is provided by the `com.powsybl:powsybl-cgmes-extensions` module.

#### CIM-CGMES dangling line boundary node

This extension is used to add some CIM-CGMES characteristics to dangling lines.


| Attribute                             | Type    | Unit | Required | Default value | Description                                                         |
|---------------------------------------|---------|------|----------|---------------|---------------------------------------------------------------------|
| hvdc status                           | boolean | -    | no       | false         | Indicates if the boundary line is associated with a DC Xnode or not |
| Line Energy Identification Code (EIC) | String  | -    | no       | -             | The EIC of the boundary line if it exists                           |                                                

This extension is provided by the `com.powsybl:powsybl-cgmes-extensions` module.

#### CIM-CGMES line boundary node

This extension is used to add some CIM-CGMES characteristics to tie lines.

| Attribute                             | Type    | Unit | Required | Default value | Description                                                         |
|---------------------------------------|---------|------|----------|---------------|---------------------------------------------------------------------|
| hvdc status                           | boolean | -    | no       | false         | Indicates if the boundary line is associated with a DC Xnode or not |
| Line Energy Identification Code (EIC) | String  | -    | no       | -             | The EIC of the boundary line EIC if it exists                       |

This extension is provided by the `com.powsybl:powsybl-cgmes-extensions` module.

#### CIM-CGMES Tap Changers

<span style="color: red">TODO</span>

#### CIM-CGMES SSH metadata

<span style="color: red">TODO</span>

#### CIM-CGMES SV metadata

<span style="color: red">TODO</span>

#### CIM characteristics

<span style="color: red">TODO</span>

### Options

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../user/configuration/import-export-parameters-default-value.md) module.


**iidm.import.cgmes.boundary-location**  
Optional property that defines the directory path where the CGMES importer can find the boundary files (`EQBD` and `TPBD` profiles) if they are not present in the imported zip file. By default, its value is `<ITOOLS_CONFIG_DIR>/CGMES/boundary`.
This property can also be used at CGMES export if the network was not imported from a CGMES to indicate the boundary files that should be used for reference.

**iidm.import.cgmes.convert-boundary**  
Optional property that defines if the equipment located inside the boundary are imported as part of the network. Used for debugging purposes. `false` by default.

**iidm.import.cgmes.convert-sv-injections**  
Optional property that defines if `SvInjection` objects are converted to IIDM loads. `true` by default.

**iidm.import.cgmes.create-active-power-control-extension**
Optional property that defines if active power control extensions are created for the converted generators. `true` by default. If `true`, the extension will created for the CGMES `SynchronousMachines` with the attribute `normalPF` defined. For these generators, the `normalPF` value will be saved as the `participationFactor` and the flag `participate` set to `true`. 

**iidm.import.cgmes.create-busbar-section-for-every-connectivity-node**  
Optional property that defines if the CGMES importer creates an [IIDM Busbar Section](../model/index.md#busbar-section) for each CGMES connectivity node. Used for debugging purposes. `false` by default.

**iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode**  
Optional property that defines if fictitious switches are created when terminals are disconnected in CGMES node-breaker networks.
Three modes are available:
- `ALWAYS`: fictitious switches are created at every disconnected terminal.
- `ALWAYS_EXCEPT_SWITCHES`: fictitious switches are created at every disconnected terminal that is not a terminal of a switch.
- `NEVER`: no fictitious switches are created at disconnected terminals.

The default value is `ALWAYS`. 

**iidm.import.cgmes.decode-escaped-identifiers**  
Optional property that defines if identifiers containing escaped characters are decoded when CGMES files are read. `true` by default.

**iidm.import.cgmes.ensure-id-alias-unicity**  
Optional property that defines if IDs' and aliases' unicity is ensured during CGMES import. If it is set to `true`, identical CGMES IDs will be modified to be unique. If it is set to `false`, identical CGMES IDs will throw an exception. `false` by default.

**iidm.import.cgmes.import-control-areas**  
Optional property that defines if control areas must be imported or not. `true` by default.

**iidm.import.cgmes.naming-strategy**  
Optional property that defines which naming strategy is used to transform GMES identifiers to IIDM identifiers. Currently, all naming strategies assign CGMES Ids directly to IIDM Ids during import, without any transformation. The default value is `identity`.

**iidm.import.cgmes.post-processors**  
Optional property that defines all the CGMES post-processors which will be activated after import.
By default, it is an empty list.
One implementation of such a post-processor is available in PowSyBl in the [powsybl-diagram](../../developer/repositories/powsybl-diagram.md) repository, named [CgmesDLImportPostProcessor](#CgmesDLImportPostProcessor).

**iidm.import.cgmes.powsybl-triplestore**  
Optional property that defines which Triplestore implementation is used. Currently, PowSyBl only supports [RDF4J](https://rdf4j.org/). `rdf4j` by default.

**iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions**  
Optional property that defines which CGMES profile is used to initialize tap positions and section counts. It can be `SSH` or `SV`. The default value is `SSH`.

**iidm.import.cgmes.source-for-iidm-id**  
Optional property that defines if IIDM IDs must be obtained from the CGMES `mRID` (master resource identifier) or the CGMES `rdfID` (Resource Description Framework identifier). The default value is `mRID`.

**iidm.import.cgmes.store-cgmes-model-as-network-extension**    
Optional property that defines if the whole CGMES model is stored in the imported IIDM network as an [extension](../model/extensions.md#cgmes-model). The default value is `true`.

**iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension**  
Optional property that defines if the CGMES conversion context will be stored as an extension of the IIDM output network. It is useful for external validation of the mapping made between CGMES and IIDM. Its default value is `false`.

**iidm.import.cgmes.import-node-breaker-as-bus-breaker**  
Optional property that forces CGMES model to be in topology bus/breaker in IIDM. This is a key feature when some models do not have all the breakers to connect and disconnect equipments in IIDM. In bus/breaker topology, connect and disconnect equipment only rely on terminal statuses and not on breakers. Its default value is `false`.  

**iidm.import.cgmes.disconnect-dangling-line-if-boundary-side-is-disconnected**  
Optional property used at CGMES import that disconnects the IIDM dangling line if in the CGMES model the line is open at the boundary side. As IIDM does not have any equivalence for that, this is an approximation. Its default value is `false`.

**iidm.import.cgmes.missing-permanent-limit-percentage**  
Optional property used when in operational limits, temporary limits are present and the permanent limit is missing as it is forbidden in IIDM. The missing permanent limit is equal to a percentage of the lowest temporary limit, with the percentage defined by the value of this property if present, `100` by default. 

**iidm.import.cgmes.cgm-with-subnetworks**  
Optional property to define if subnetworks must be added to the network when importing a Common Grid Model (CGM). Each subnetwork will model an Individual Grid Model (IGM). By default `true`: subnetworks are added, and the merging is done at IIDM level, with a main IIDM network representing the CGM and containing a set of subnetworks, one for each IGM. If the value is set to `false` all the CGMES data will be flattened in a single network and information about the ownership of each equipment will be lost.  

**iidm.import.cgmes.cgm-with-subnetworks-defined**  
If `iidm.import.cgmes.cgm-with-subnetworks` is set to `true`, use this property to specify how the set of input files should be split by IGM: based on their filenames (use the value `FILENAME`) or by its modeling authority, read from the header (use the value `MODELING_AUTHORITY`).

## CGMES post-processors

### CgmesDLImportPostProcessor
This post-processor loads the diagram layout (DL) profile contained in the CGMES file, if available, into the triplestore.
The diagram layout profile contains the data which is necessary to represent a drawing of the diagram corresponding to the CGMES file.
For instance, it contains the position of all equipments.

This post-processor is enabled by adding the name `cgmesDLImport` to the list associated to `iidm.import.cgmes.post-processors` property.

### CgmesGLImportPostProcessor
<span style="color: red">TODO</span>

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

Please note that PowSyBl only ever export CGMES networks as CGMES Node/Breaker networks without consideration of the topology level of the PowSyBl network.

### Conversion from PowSyBl grid model to CGMES

The following sections describe in detail how each supported PowSyBl network model object is converted to CGMES network components.

#### Battery

PowSyBl [`Batteries`](../model/index.md#battery) are exported as CGMES `SynchronousMachine` with CGMES `HydroGeneratingUnits`.

<span style="color: red">TODO details</span>

#### BusbarSection

PowSyBl [`BusbarSections`](../model/index.md#busbar-section) are exported as CGMES `BusbarSections`.

<span style="color: red">TODO details</span>

#### DanglingLine

PowSyBl [`DanglingLines`](../model/index.md#dangling-line) are exported as several CGMES network component.
Each dangling line will be exported as one CGMES `EquivalentInjection` and one CGMES `ACLineSegment`.

<span style="color: red">TODO details</span>

#### Generator

PowSyBl [`Generators`](../model/index.md#generator) are exported as CGMES `SynchronousMachines`.

<span style="color: red">TODO details</span>

#### HVDC line and HVDC converter stations

A PowSyBl [`HVDCLine`](../model/index.md#hvdc-line) and its two [`HVDCConverterStations`](../model/index.md#hvdc-converter-station) are exported as a CGMES `DCLineSegment` and two CGMES `DCConverterUnits`.

<span style="color: red">TODO details</span>

#### Line

PowSyBl [`Lines`](../model/index.md#line) are exported as CGMES `ACLineSegment`.

<span style="color: red">TODO details</span>

#### Load

PowSyBl [`Loads`](../model/index.md#load) are exported as CGMES `ConformLoads`, `NonConformLoads` or `EnergyConsumers` depending on the extension [`LoadDetail`](../model/extensions.md#load-detail).

<span style="color: red">TODO details</span>

#### Shunt compensator

PowSyBl [`ShuntCompensators`](../model/index.md#shunt-compensator) are exported as CGMES `LinearShuntCompensator` or `NonlinearShuntCompensator` depending on their models.

<span style="color: red">TODO details</span>

#### StaticVarCompensator

PowSyBl [`StaticVarCompensators`](../model/index.md#static-var-compensator) are exported as CGMES `StaticVarCompensators`.

<span style="color: red">TODO details</span>

#### Substation

PowSyBl [`Substations`](../model/index.md#substation) are exported as CGMES `Substations`.

<span style="color: red">TODO details</span>

#### Switch

PowSyBl [`Switches`](../model/index.md#breakerswitch) are exported as CGMES `Breakers`, `Disconnectors` or `LoadBreakSwitches` depending on its `SwitchKind`.

<span style="color: red">TODO details</span>

#### ThreeWindingsTransformer

PowSyBl [`ThreeWindingsTransformers`](../model/index.md#three-windings-transformer) are exported as CGMES `PowerTransformers` with three CGMES `PowerTransformerEnds`.
<span style="color: red">TODO details</span>
#### TwoWindingsTransformer

PowSyBl [`TwoWindingsTransformers`](../model/index.md#two-windings-transformer) are exported as CGMES `PowerTransformers` with two CGMES `PowerTransformerEnds`.

<span style="color: red">TODO details</span>

#### Voltage level

PowSybl [`VoltatgeLevels`](../model/index.md#voltage-level) are exported as CGMES `VoltageLevels`.

<span style="color: red">TODO details</span>

### Extensions

#### Control areas

PowSyBl [`ControlAreas`](../model/extensions.md#cim-cgmes-control-areas) are exported as CGMES `ControlAreas`.

<span style="color: red">TODO details</span>

### Options

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../user/configuration/import-export-parameters-default-value.md) module.

**iidm.export.cgmes.base-name**  
Optional property that defines the base name of the exported files. Exported CGMES files' names will look like this:
```
<base_name>_EQ.xml
<base_name>_TP.xml
<base_name>_SSH.xml
<base_name>_SV.xml
```
By default, the base name is the network's name if it exists, or else the network's ID.

**iidm.export.cgmes.boundary-eq-id**  
Optional property that defines the ID of the EQ-BD model if there is any.
Its default value is `null`: we consider there is no EQ-BD model to consider. 
If this property is defined, then this ID will be written in the header of the exported EQ file.

**iidm.export.cgmes.boundary-tp-id**  
Optional property that defines the ID of the TP-BD model if there is any.
Its default value is `null`: we consider there is no TP-BD model to consider.
If this property is defined, then this ID will be written in the header of the exported SV file.

**iidm.export.cgmes.cim-version**  
Optional property that defines the CIM version number in which the user wants the CGMES files to be exported.
CIM versions 14, 16 and 100 are supported i.e. its valid values are `14`, `16` and `100`.
If not defined, and the network has the extension `CimCharacteristics`, the CIM version will be the one indicated in the extension. If not, its default value is `16`.
CIM version 16 corresponds to CGMES 2.4.15.
CIM version 100 corresponds to CGMES 3.0.

**iidm.export.cgmes.encode-ids**  
Optional property that must be used if IIDM IDs that are not compliant with CGMES requirements are to be used as CGMES IDs. `true` by default. Used for debugging purposes.

**iidm.export.cgmes.export-boundary-power-flows**  
Optional property that defines if power flows at boundary nodes are to be exported in the SV file or not. `true` by default.

**iidm.export.cgmes.export-power-flows-for-switches**  
Optional property that defines if power flows of switches are exported in the SV file. `true` by default.

**idm.export.cgmes.naming-strategy**  
Optional property that defines which naming strategy is used to transform IIDM identifiers to CGMES identifiers.
It can be:
- `identity`: CGMES IDs are the same as IIDM IDs.
- `cgmes`: new CGMES IDs (new master resource identifiers, cim:mRID) are created for IIDM `Identifiables` if the IIDM IDs are not compliant with CGMES requirements.
- `cgmes-fix-all-invalid-ids`: ensures that all CGMES IDs in the export will comply with CGMES requirements, for IIDM `Identifiables`and also for its related objects (tap changers, operational limits, regulating controls, reactive capability curves, ...).
Its default value is `identity`.

**iidm.export.cgmes.uuid-namespace**  
Optional property related to the naming strategy specified in `iidm.export.cgmes.naming-strategy`. When new CGMES IDs have to be generated, a mechanism that ensures creation of new, stable identifiers based on IIDM IDs is used (see [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122)). These new IDs are guaranteed to be unique inside a namespace given by this UUID. By default, it is the name-based UUID fo the text "powsybl.org" in the empty namespace.

**iidm.export.cgmes.profiles**  
Optional property that determines which instance files will be exported.
By default, it is a full CGMES export: the instance files for the profiles EQ, TP, SSH and SV are exported.

**iidm.export.cgmes.modeling-authority-set**  
Optional property allowing to write a custom modeling authority set in the exported file headers. `powsybl.org` by default.
If a Boundary set is given with the property `iidm.import.cgmes.boundary-location` and the network sourcing actor is found inside it, then the modeling authority set will be obtained from the boundary file without the need to set this property.
The sourcing actor can be specified using the parameter `iidm.export.cgmes.sourcing-actor`.

**iidm.export.cgmes.model-description**  
Optional property allowing to write a custom model description in the file headers.
By default, the model description is `EQ model` for the EQ file, `TP model` for the TP file, `SSH model` for the SSH 
file and `SV model` for the SV file.

**iidm.export.cgmes.export-transformers-with-highest-voltage-at-end1**  
Optional property defining whether the transformers should be exported with the highest voltage at end 1, even if it might not be the case in the IIDM model. 
This property is set to `false` by default.

**iidm.export.cgmes.export-load-flow-status**  
Optional property that indicates whether the loadflow status (`converged` or `diverged`) should be 
written for the `TopologicalIslands` in the SV file. If `true`, the status will be computed by checking, for every bus,
if the voltage and angle are valid, and if the bus is respecting Kirchhoff's first law. For the latter, we check that 
the sums of active power and reactive power at the bus are higher than a threshold defined by the properties 
`iidm.export.cgmes.max-p-mismatch-converged` and `iidm.export.cgmes.max-q-mismatch-converged`. 
This property is set to `true` by default.

**iidm.export.cgmes.max-p-mismatch-converged**  
Optional property that defines the threshold below which a bus is considered to be balanced for the load flow status of the `TopologicalIsland` in active power. If the sum of all the active power of the terminals connected to the bus is greater than this threshold, then the load flow is considered to be divergent. Its default value is `0.1`, and it should be used only if the `iidm.export.cgmes.export-load-flow-status` property is set to `true`.

**iidm.export.cgmes.max-q-mismatch-converged**  
Optional property that defines the threshold below which a bus is considered to be balanced for the load flow status of the `TopologicalIsland` in reactive power. If the sum of all the reactive power of the terminals connected to the bus is greater than this threshold, then the load flow is considered to be divergent. Its default value is `0.1`, and it should be used only if the `iidm.export.cgmes.export-load-flow-status` property is set to `true`.

**iidm.export.cgmes.export-sv-injections-for-slacks**  
Optional property to specify if the total mismatch left after power flow calculation at IIDM slack buses should be exported as an SvInjection. 
This property is set to `true` by default.

**iidm.export.cgmes.sourcing-actor**  
Optional property allowing to specify a custom sourcing actor. If a Boundary set with reference data is provided for the export through the parameter `iidm.import.cgmes.boundary-location`, the value of this property will be used to look for the modelling authority set and the geographical region to be used in the export.
No default value is given.
If this property is not given, the export process will still try to determine the sourcing actor from the IIDM network if it only contains one country.

**iidm.export.cgmes.model-version**  
Optional property defining the version of the exported CGMES file. It will be used if the version is not already available in the network. 
The version will be written in the header of each exported file and will also be used to generate a unique UUID for the `FullModel` field.
Its default value is 1.

**iidm.export.cgmes.business-process**  
The business process in which the export takes place. This is used to generate unique UUIDs for the EQ, TP, SSH and SV file `FullModel`.
Its default value is `1D`.


Note that if you are exporting a network that does not come from CGMES, you can use the [`iidm.import.cgmes.boundary-location`](#options) property to define the location of the boundary files to use as reference.

## Examples
Have a look to the [CGMES sample files](https://www.entsoe.eu/Documents/CIM_documents/Grid_Model_CIM/TestConfigurations_packageCASv2.0.zip)
from ENTSO-E Test Configurations for Conformity Assessment Scheme v2.0.
