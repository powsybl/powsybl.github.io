---
title: Java library
layout: default
---

Powsybl can be used as a plain Java library to develop your own application. The Powsybl artifacts are available in Maven Central under the `com.powsybl` groupId: [Powsybl Artifacts](https://repo.maven.apache.org/maven2/com/powsybl/). Depending on the functionalities you want to include in your application, please see below the artifact you have to add in your `pom.xml` file.

**Beginner**
**Intermediate**
**Advanced**

# powsybl-core

## Configuration management

#### powsybl-config-classic
**Beginner**  Modules configuration management, described [here](../configuration).
#### powsybl-config-test
**Advanced** Modules configuration management for unitary tests.

## Network core model and its extensions

#### powsybl-iidm-impl
**Beginner** Network core model implementation.
####  powsybl-iidm-extensions
**Beginner** Network core model extensions.
#### powsybl-iidm-xml-converter
**Intermediate** Network core model XML serialization implementation.
#### powsybl-iidm-comparator
**Intermediate** Comparator of network core models.
#### powsybl-iidm-mergingview
**Intermediate** Network core models merging.
#### powsybl-iidm-reducer
**Intermediate** Network core model reducer.
#### powsybl-iidm-scripting
**Intermediate** Groovy scripting over the core network model.
#### powsybl-iidm-util
**Intermediate** Tools for network core model management.
#### powsybl-iidm-test
**Intermediate** Test cases provider.
#### powsybl-iidm-api
**Advanced** Network core model API.
#### powsybl-iidm-converter-api
**Advanced** Network core model XML serialization API.

## Grid exchange formats

### UCTE conversion

#### powsybl-ucte-converter
**Beginner** conversion to the network core model.
#### powsybl-ucte-network
**Advanced** UCTE network model.

### CIM-CGMES conversion

#### powsybl-cgmes-conversion
**Beginner** CIM-CGMES conversion to the network core model. As the conversion uses a triple store database, you also have to choose one of the three following in-memory triple store implementations:
#### powsybl-triple-store-impl-rdf4j
**Beginner** Triple store in-memory implementation based on RDF4J.
#### powsybl-triple-store-impl-blazegraph
**Beginner** Triple store in-memory implementation based on Blazegraph.
#### powsybl-triple-store-impl-jena
**Beginner** Triple store in-memory implementation based on Jena.
#### powsybl-cgmes-conformity
**Intermediate** Test cases provider.
#### powsybl-cgmes-model
**Advanced** CIM-CGMES network model.
#### powsybl-cgmes-model-alternatives
**Advanced** CIM-CGMES network model alternatives.
#### powsybl-triple-store-api
**Advanced** Triple store common API.

### IEEE conversion

#### powsybl-ieee-cdf-converter
**Beginner** IEEE conversion to the network core model.
#### powsybl-ieee-cdf-model
**Advanced** IEEE netwok model.

## Simulators

### Load flow

#### powsybl-loadflow-api
**Intermediate** Load flow common API.
#### powsybl-loadflow-results-completion
#### powsybl-loadflow-scripting
#### powsybl-loadflow-validation
**Intermediate** To use the load flow validation feature.

### Sensitivity analysis

#### powsybl-security-analysis-api
**Intermediate**

#### powsybl-sensitivity-api/
**Intermediate** Sensitivity analysis common API.

<!-- ### powsybl-simulation-api/
powsybl-dynamic-simulation/                                      -         -      	
powsybl-dynamic-simulation-api/                                  -         -      	

### Computation
powsybl-computation/                                             -         -      	
powsybl-computation-local/ -->
