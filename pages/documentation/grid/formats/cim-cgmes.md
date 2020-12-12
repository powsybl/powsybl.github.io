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
