---
title: Java library
layout: default
---

Powsybl can be used as a plain Java library to develop your own application. 
Depending on the features you wish to pick, you will select different Powsybl artifacts.
This page aims at listing them, summarizing their purpose and helping you figure out what you need in your 'pom.xml' file.
The Powsybl artifacts are available at Maven Central under the `com.powsybl` groupId: [Powsybl Artifacts](https://repo.maven.apache.org/maven2/com/powsybl/). 

To help you navigate in the list below, we used labels to tag the artifacts:

**User** corresponds to an artifact that may be used for your application, without any modification of Powsybl

**Advanced-user** corresponds to an artifact aimed at helping you making first extensions of the Powsybl framework to better fit your needs

**Powsybl-developer** corresponds to an artifact aimed at developers who contribute to the Powsybl framework more deeply

# powsybl-core

## Configuration management

#### powsybl-config-classic
**User**  Modules configuration management, described [here](../configuration).
#### powsybl-config-test
**Powsybl-developer** Modules configuration management for unitary tests.

## Network core model and its extensions

#### powsybl-iidm-impl
**User** Network core model implementation.
####  powsybl-iidm-extensions
**User** Network core model extensions.
#### powsybl-iidm-xml-converter
**Advanced-user** Network core model XML serialization implementation.
#### powsybl-iidm-comparator
**Advanced-user** Comparator of network core models.
#### powsybl-iidm-mergingview
**Advanced-user** Network core models merging.
#### powsybl-iidm-reducer
**Advanced-user** Network core model reducer.
#### powsybl-iidm-scripting
**Advanced-user** Groovy scripting over the core network model.
#### powsybl-iidm-util
**Advanced-user** Tools for network core model management.
#### powsybl-iidm-test
**Advanced-user** Test cases provider.
#### powsybl-iidm-api
**Powsybl-developer** Network core model API.
#### powsybl-iidm-converter-api
**Powsybl-developer** Network core model XML serialization API.

## Grid exchange formats

### UCTE conversion

#### powsybl-ucte-converter
**User** conversion to the network core model.
#### powsybl-ucte-network
**Powsybl-developer** UCTE network model.

### CIM-CGMES conversion

#### powsybl-cgmes-conversion
**User** CIM-CGMES conversion to the network core model.
The conversion uses a triple store database, so it has to be used together with one of the three available in-memory triple store implementations below.
#### powsybl-triple-store-impl-rdf4j
**User** Triple store in-memory implementation based on RDF4J.
#### powsybl-triple-store-impl-blazegraph
**User** Triple store in-memory implementation based on Blazegraph.
#### powsybl-triple-store-impl-jena
**User** Triple store in-memory implementation based on Jena.
#### powsybl-cgmes-conformity
**Advanced-user** Test cases provider.
#### powsybl-cgmes-model
**Powsybl-developer** CIM-CGMES network model.
#### powsybl-cgmes-model-alternatives
**Powsybl-developer** CIM-CGMES network model alternatives.
#### powsybl-triple-store-api
**Powsybl-developer** Triple store common API.

### IEEE conversion

#### powsybl-ieee-cdf-converter
**User** IEEE conversion to the network core model.
#### powsybl-ieee-cdf-model
**Powsybl-developer** IEEE netwok model.

## Simulators

### Load flow

#### powsybl-loadflow-api
**Advanced-user** Load flow common API.
#### powsybl-loadflow-results-completion
#### powsybl-loadflow-scripting
#### powsybl-loadflow-validation
**Advanced-user** To use the load flow validation feature.

### Sensitivity analysis

#### powsybl-security-analysis-api
**Advanced-user**

#### powsybl-sensitivity-api/
**Advanced-user** Sensitivity analysis common API.

<!-- ### powsybl-simulation-api/

### Computation
powsybl-computation/
powsybl-computation-local/

powsybl-dsl/

### Action
powsybl-action-dsl/
powsybl-action-dsl-spi/
powsybl-action-simulator/
powsybl-action-util/

### contingency
powsybl-contingency/
powsybl-contingency-api/
powsybl-contingency-dsl/

### Times series
powsybl-time-series-api/

### Other
powsybl-commons/
powsybl-tools/
powsybl-distribution-core/

powsybl-cim-anonymiser/                                          -         -      
powsybl-entsoe-util/-->                                             -         -      
