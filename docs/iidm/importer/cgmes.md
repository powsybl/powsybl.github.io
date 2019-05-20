---
title: CGMES Importer
layout: default
todo:
    - add configuration properties (when the PR is done)
---

The CMGES (**C**ommon **G**rid **M**odel **E**xchange **S**pecification) is an IEC technical specification (TS) based
on the IEC CIM (**C**ommon **I**nformation **M**odel) family of standards.​ It was developed to meet necessary requirements
for TSO data exchanges in the areas of system development and system operation.

Current supported version of CGMES is 2.4.15, that is based on CIM 16. We can note that this importer is also compatible with CIM 14.

To learn more about CGMES files, read the complete [CMGES format specification](https://www.entsoe.eu/digital/common-information-model/#common-grid-model-exchange-specification-cgmes).

# Examples
Have a look to the [CGMES sample files](https://docstore.entsoe.eu/Documents/CIM_documents/Grid_Model_CIM/TestConfigurations_packageCASv2.0.zip)
from ENTSO-E Test Configurations for Conformity Assessment Scheme v2.0.

# Configuration properties for CGMES importer

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../configuration/modules/import-export-parameters-default-value.md)
module.

## iidm.import.cgmes.allow-unsupported-tap-changers
The `iidm.import.cgmes.allow-unsupported-tap-changers` property is an optional property that determines if every tap changer is read in order to be converted in best effort
or if only supported tap changers are read and converted. By default, its value is `true`.

## iidm.import.cgmes.boundary-location
The `iidm.import.cgmes.boundary-location` property is an optional property that defines the directory path where the CGMES importer
can find the boundary files if they are not present in the imported zip file. By default, its value is `<ITOOLS_CONFIG_DIR>/CGMES/boundary`.

## iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state
The `iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state` property is an optional property
that defines if the CGMES importer inverts the sign of reactive power flows for shunt compensators.
Its default value is `false`.

## iidm.import.cgmes.convert-boundary
The `iidm.import.cgmes.convert-boundary` property is an optional property that defines if the CGMES importer imports equipments inside the
boundaries or not. Its default value is `false`.

## iidm.import.cgmes.create-busbar-section-for-every-connectivity-node
The `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` property is an optional property that defines if the CGMES importer creates 
an [IIDM Busbar Section](../model/busbarSection.md) for each CGMES connectivity node. Its default value is `false`.

## iidm.import.cgmes.powsybl-triplestore
The `iidm.import.cgmes.powsybl-triplestore` property is an optional property that defines which triplestore implementation is used. PowSyBl supports
RDF4J, Jena and Blazegraph triplestore implementations. This property has `rdf4j` as default value.

## iidm.import.cgmes.store-cgmes-model-as-network-extension
The `iidm.import.cgmes.store-cgmes-model-as-network-extension` property is an optional property that defines if the CGMES model is stored in the imported IIDM network as
an extension. Its default value is `true`.

# Deprecated properties for CGMES importer

## changeSignForShuntReactivePowerFlowInitialState
The `changeSignForShuntReactivePowerFlowInitialState` property is deprecated since v2.4.0. Use `iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state` instead.

## convertBoundary
The `convertBoundary` property is deprecated since v2.4.0. Use `iidm.import.cgmes.convert-boundary` instead.

## createBusbarSectionForEveryConnectivityNode
The `createBusbarSectionForEveryConnectivityNode` property is deprecated since v2.4.0. Use `iidm.import.cgmes.create-busbar-section-for-every-connectivity-node` instead.

## powsyblTripleStore
The `powsyblTripleStore` property is deprecated since v2.4.0. Use `iidm.import.cgmes.powsybl-triplestore` instead.

## storeCgmesModelAsNetworkExtension
The `storeCgmesModelAsNetworkExtension` property is deprecated since v2.4.0. Use `iidm.import.cgmes.store-cgmes-model-as-network-extension` instead.

# Maven configuration
To support CGMES files, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-cgmes-conversion</artifactId>
    <version>${powsybl.version}</version>
</dependency>
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-cgmes-model</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
**NB**: In order to work, the CGMES importer also need an IIDM implementation in the `pom.xml`. Powsybl
provides one so you can simply add it:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-impl</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
