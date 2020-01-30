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

**Advanced user** corresponds to an artifact aimed at helping you making first extensions of the Powsybl framework to better fit your needs

**Powsybl developer** corresponds to an artifact aimed at developers who contribute to the Powsybl framework more deeply

# Network
## Network modeling
The artifacts described below provide the [grid modeling](../iidm/model/index.md) on which Powsybl relies. This grid model can be extended using a
plugin mechanism, if you need to add additional data to an equipment.

**powsybl-iidm-api** *(Powsybl developer)*  
This module provides the API of the network model.

**powsybl-iidm-impl** *(User)*  
This module provides an in-memory implementation of the IIDM API.

**powsybl-iidm-extensions** *(User)*  
This module provides common extensions for the network.

**powsybl-entsoe-util** *(Advanced user)*  
This module provides extensions used in ENTSO-E business processes.

## Network conversion
The artifacts described below provide a common API to convert network files from one format to another. Powsybl provides
several implementations of this API to support common formats.

**powsybl-iidm-converter-api** *(Powsybl developer)*  
This module provides a common API that is implemented for each new format supported by Powsybl. 

### IIDM-XML

**powsybl-iidm-xml-converter** *(User)*  
This module provides an implementation of the converter API to allow a user to load/save a network from/to an XML file.

### UCTE
The artifacts described below provide the support of the [UCTE-DEF format](../iidm/importer/ucte.md).

**powsybl-ucte-network** *(Advanced user)*  
This module provides classes to model the network regarding the UCTE-DEF format.

**powsybl-ucte-converter** *(User)*  
This module provides an implementation of the converter API to allow a user to load/save a network from/to a UCTE file.

### CMGES
The artifacts described below provide the support of the [CIM-CGMES format](../iidm/importer/cgmes.md).

**powsybl-cgmes-model** *(Advanced user)*  
This module provides classes to model the network regarding the CIM-CGMES format.

**powsybl-cgmes-conversion** *(User)*  
This module provides an implementation of the converter API to allow a user to load/save a network from/to a CIM-CGMES file.
 
**powsybl-triple-store-api** *(Powsybl developer)*  
This module provides a common API to access to the CIM-CGMES from a triple store. Powsybl provides several in-memory
implementations of this API. We suggest to use Eclipse RDF4J implementation that offers the best global performance.

**powsybl-triple-store-impl-rdf4j** *(User)*  
This module provides SPARQL queries to access to a triple store based on [Eclipse RDF4J](https://rdf4j.org/).

**powsybl-triple-store-impl-blazegraph** *(User)*  
This module provides SPARQL queries to access to a triple store based on [Blazegraph](https://blazegraph.com/).

**powsybl-triple-store-impl-jena** *(User)*  
This module provides SPARQL queries to access to a triple store based on [Jena](https://jena.apache.org).

**powsybl-cgmes-conformity** *(Advanced user)*  
This module implements the ENTSO-E conformity tests.

**powsybl-cim-anonymiser** *(Advanced user)*  
This module provides a tool to anonymize identifier of a CIM-CGMES file.

### IEEE-CDF

The artifacts described below provide the support of the IEEE-CDF format.

**powsybl-ieee-cdf-model** *(Advanced user)*  
This module provides classes to model the network regarding the IEEE-CDF format.

**powsybl-ieee-cdf-converter** *(User)*  
This module provides an implementation of the converter API to allow a user to load/save a network from/to a IEEE-CDF file.

### AMPL

**powsybl-ampl-converter** *(Advanced user)*  
This module provides an implementation of the converter API to allow a user to export a network to a set of tabular text
files. As the format is really simple to parse, it's commonly used to integrate Powsybl with an optimal power flow using
an [AMPL](../iidm/exporter/ampl.md) model or with Matlab. 

## Network additional features

The artifacts described below provide additional features around the network.

**powsybl-iidm-comparator** *(User)*  
This module provides functions to help to compare IIDM networks.

**powsybl-iidm-mergingview** *(Advanced user)*  
This module provides an alternative way to merge several networks, keeping the underlying networks unchanged.

**powsybl-iidm-reducer** *(Advanced user)*  
This module provides classes to extract a sub area of a network.

**powsybl-iidm-util** *(Advanced user)*  
This module provides additional features around the network. 

**powsybl-iidm-test** *(Advanced user)*  
This module provides factories to create simple networks.

# Simulators

## Load flow

**powsybl-loadflow-api** *(User)*  
This module provides a common API for power flow computation. You have to implement this API to use your power flow
simulator through powsybl. 

**powsybl-open-loadflow** *(User)*  
This module provides an implementation of the load flow API.

**powsybl-loadflow-results-completion** *(Advanced user)*  
This module implements power flow equations to initialize the P, Q, V and $$\theta$$ from the characteristics of the
equipments. This module can be used as a [post processor](../iidm/importer/post-processor/LoadFlowResultsCompletionPostProcessor.md)
of the import or with the [load flow validation](../loadflow/validation.md). 

**powsybl-loadflow-validation** *(Advanced user)*  
This module provides functions to check the consistency of a power flow result. It can be use as a java library, but the
easiest way to use it, it's through the [iTools CLI](../tools/loadflow-validation.md).

## Contingencies

The artifacts described below are used to model contingencies. Contingencies can then be used to run security analyses, with
or without remedial actions. 

**powsybl-contingency-api** *(User)*  
This module provides an API to model and create contingencies.

**powsybl-contingency-dsl** *(User)*  
This module provides classes to load [a contingency list from a groovy script](../contingencies/GroovyDslContingenciesProvider.md). This is a powerful way to create contingencies
iterating over the equipments of network.

## Security analyses

**powsybl-security-analysis-api** *(User)*  
This module provides a common API for security analyses computation. You have to implement this API to use your simulator
through powsybl. We also provide an simple implementation that relies on a power flow simulator.  

**powsybl-action-dsl** *(Advanced user)*  
This module provides classes to load a groovy file, called an action script, that defines contingencies, remedial actions
and business rules to run a security analysis with remedial actions. 

**powsybl-action-dsl-spi** *(Powsybl developer)*  
This module provides an SPI to extend the action a user can use in an action script.

**powsybl-action-simulator** *(Advanced user)*  
This module provides an API to run security analyses with remedial actions. It also provides an implementation based on
a power flow simulator.

**powsybl-action-util** *(Advanced user)*  
This module provides a set of common remedial actions an user would like to use in his action script.

## Sensitivity calculation

**powsybl-sensitivity-api** *(Advanced user)*  
This module provides a common API for sensitivity calculation. You have to implement this API to use your own simulator
through powsybl.

## Dynamic simulation

**powsybl-dynamic-simulation-api** *(Advanced user)*  
This module provides a common API for dynamic simulation. You have to implement this API to use your own simulator through
powsybl.

**powsybl-simulation-api** *(Advanced user)*  
This module provides a legacy API for time domain simulation. This module is not maintained anymore and will be replaced
by the **powsybl-dynamic-simulation-api**.

# Configuration management
The artifacts described below define how Powsybl features access to the [user configuration](../configuration/modules/index.md).

**powsybl-config-classic** *(User)*  
This module allows you to access to the configuration defined in a configuration file stored in the home directory of the user.
This is the classic way to configure Powsybl.

**powsybl-config-test** *(Powsybl developer)*  
This module should be used for unit testing only. It allows you to access to the configuration stored in the classpath.

# Computation

The artifacts described below are used by powsybl to know where the computation are really executed, locally or remotely
for high performance computing.

**powsybl-computation-local** *(User)*  
This module is an implementation of the computation API that allows a user to run computation locally. This is the simplest
way to do calculation using powsybl.

**powsybl-computation-mpi** *(Advanced user)*  
This module is an implementation of the computation API that allows a user to run computation on a computation grid using
[MPI](https://en.wikipedia.org/wiki/Message_Passing_Interface).

**powsybl-computation-slurm** *(Advanced user)*  
This module is an implementation of the computation API that allows a user to run computation using on servers manage by
[Slurm](https://slurm.schedmd.com), a workload manager.

# Data management

The artifacts described below provide classes to model data in our data management system called AFS (Application
File System).

**powsybl-afs-core** *(Advanced user)*  
This module provides the core classes to model a file system (Node, File, Folder...). You have to extend these base
classes if you want to store custom data in AFS. 

**powsybl-afs-ext-base** *(Advanced user)*  
This module provides classes to manage common powsybl concepts in AFS (cases, networks, scripts...).

**powsybl-afs-contingency** *(Advanced user)*  
This module provides classes to manage contingency lists in AFS.

**powsybl-afs-security-analysis** *(Advanced user)*  
This module provides classes to run security analyses on networks stored in AFS.

**powsybl-afs-security-analysis-local** *(Advanced user)*  
This module provides classes to run security analyses locally.

**powsybl-afs-action-dsl** *(Advanced user)*  
This module provides classes to manage scripts for the simulation of remedial actions.

## Storage

**powsybl-afs-storage-api** *(Advanced user)*  
This module provides a common API for the storage layer. This API have to be implemented if you want to store your
data in a database. Powsybl provides several implementation to store data on the file system:

**powsybl-afs-local** *(Advanced user)*  
This module provides an implementation of the storage API to read/store data from/to the local file system.

**powsybl-afs-mapdb** *(Advanced user)*  
This module provides an implementation of the `AppFileSystem` interface based on [MapDB](http://www.mapdb.org).

**powsybl-afs-mapdb-storage** *(Advanced user)*  
This module provides an implementation of the storage API to read/store data using [MapDB](http://www.mapdb.org).

**powsybl-afs-cassandra** *(Advanced user)*  
This module provides an implementation of the storage API based on [Apache Cassandra](http://apache.cassandra.org).

## Remote storage

**powsybl-afs-ws-storage** *(Advanced user)*  
This module provides an implementation of the storage API to expose a remote AFS.

**powsybl-afs-ws-utils** *(Advanced user)*  
This module provides utility classes shared between the client part and the server part (JSON serialization...).

**powsybl-afs-ws-server** *(Advanced user)*  
This module provides a facade to expose a remote AFS through a Rest API.

**powsybl-afs-ws-server-utils** *(Advanced user)*  
This module provides utility classes for the backend part (authentication...).

**powsybl-afs-ws-client** *(Advanced user)*  
This module provides the client code to access to a remove AFS. 

**powsybl-afs-ws-client-utils** *(Advanced user)*  
This module provides utility classes for the client part (session management, configuration...).

**powsybl-afs-network-server** *(Advanced user)*  
This module provides a Rest API to query a network stored in AFS.

**powsybl-afs-network-client** *(Advanced user)*  
This module provides the client code of the network query Rest API.

# Scripting

**powsybl-scripting** *(Advanced user)*  
This module provides a [CLI tool](../tools/run-script.md) to create groovy script based on powsybl. It is designed to be
fully extendable and offers a complete access to the powsybl framework, without limitation. 

**powsybl-iidm-scripting** *(Advanced user)*  
This modules provides extensions to access to the Network. It is mainly used to maintain the compatibility with existing
scripts.

**powsybl-loadflow-scripting** *(Advanced user)*  
This module provides extensions to run power flow from groovy scripts.

**powsybl-afs-scripting** *(Advanced user)*  
This module provides an extension to access to an AFS from groovy scripts.

# Mathematical

**powsybl-math** *(Advanced user)*  
This module provides mathematical utility classes to work with matrix or graphs.

**powsybl-math-native** *(Advanced user)*  
This module provides a native implementation of sparse matrix based on [SuiteSparse](http://faculty.cse.tamu.edu/davis/suitesparse.html)
and LU factorization. This module is used by Open LoadFlow.

**powsybl-timeseries-api** *(Advanced user)*  
This module provides a model of time series and a DSL to perform basic operations.

# Miscellaneous

**powsybl-commons**  
This module provides a lot of really basic and technical utilities used everywhere in powsybl such as XML or JSON
helpers, configuration, exceptions... 

**powsybl-dsl** *(Powsybl developer)*  
This module provides classes to define a new domain specific language (DSL) for Powsybl. It provides logical expression
support and a facade to access and manipulate a network.

# iTools

**powsybl-tools** *(User)*  
This module provides a [CLI tool](../tools/index.md) based on powsybl.

**powsybl-itools-packager-maven-plugin** *(Powsybl developer)*  
This module provides a maven plugin to [create a standalone distribution based on iTools](../installation/itools-packager.md).

# Grid Study Environment

The artifacts described below are part of a generic desktop application you can easily customize with plugins.

**powsybl-gse-app** *(User)*  
This module provides the base classes for the GSE front-end. If you want to create a standalone application based on GSE,
you have to use this module.

**powsybl-gse-afs-ext-base** *(Advanced user)*  
This module provides a GUI to manage objects defined in the [powsybl-afs-ext-base](#data-management) module.

**powsybl-gse-copy-paste-afs** *(Advanced user)*  
This module provides utility functions to manage the copy/paste of data stored in AFS.

**powsybl-gse-demo** *(User)*
This module contains the entry point of a demo based on the GSE.

**powsybl-gse-network-explorer** *(User)*
This module provides a plugin to visualize the hierarchy and the characteristics of the equipments of a network.

**powsybl-gse-network-map** *(User)*
This module provides a plugin to display a network on a map.

**powsybl-gse-security-analysis** *(User)*
This module provides a GUI to manage objects related to the security analyses.

**powsybl-gse-spi** *(Powsybl developer)*
This module provides an SPI to extend and customize the GSE, creating your own plugins.
