---
layout: default
latex: true
---

# Artifacts

PowSyBl can be used as a plain Java library to develop your own application. Depending on the features you need, you would select artifacts in the list below. This page aims at listing them, summarizing their purpose and helping you to figure out what you need in your 'pom.xml' file.

The PowSyBl artifacts are available at [Maven Central](https://repo.maven.apache.org/maven2/com/powsybl/) within the groudId `com.powsybl`.

* TOC
{:toc}

## Grid

### Grid modelling
The following artifacts provide the grid model that is at the heart of PowSyBl.

**powsybl-iidm-api**  
This module provides the API of the [network core model](../documentation/grid/model) and some utilities.

**powsybl-iidm-impl**  
This module provides an in-memory implementation of the network core model API.

**powsybl-iidm-extensions**  
This module provides usual extensions for equipments of the grid model.

**powsybl-entsoe-util**  
This module provides extensions for equipments of the grid model used in ENTSO-E business processes.

### Grid conversion
The following artifacts provide a common API to convert network files from one format to another. PowSyBl provides several implementations of this API to support common grid exchange formats.

#### IIDM-XML

**powsybl-iidm-xml-converter**  
This module provides an implementation of the converter API to allow a user to load/save a network from/to an XML file.

#### UCTE
The following artifacts provide the support of the [UCTE-DEF format](../grid/formats/ucte-def.md).

**powsybl-ucte-network**  
This module provides classes to model the network regarding the UCTE-DEF format.

**powsybl-ucte-converter**  
This module provides an implementation of the converter API to allow a user to load/save a network from/to a UCTE file.

### CIM-CGMES
The following artifacts provide the support of the [CIM-CGMES format](../grid/formats/cim-cgmes.md).

**powsybl-cgmes-model**  
This module provides classes to model the network regarding the CIM-CGMES format.

**powsybl-cgmes-conversion**  
This module provides an implementation of the converter API to allow a user to load/save a network from/to a CIM-CGMES file.

**powsybl-triple-store-api**  
This module provides a common API to access to the CIM-CGMES from a triple store. Several implementations are available but we suggest to use Eclipse RDF4J one that offers the best performance.

**powsybl-triple-store-impl-rdf4j**  
This module provides SPARQL queries to access to a triple store based on [Eclipse RDF4J](https://rdf4j.org/).

**powsybl-triple-store-impl-jena**  
This module provides SPARQL queries to access to a triple store based on [Jena](https://jena.apache.org).

**powsybl-cgmes-conformity**  
This module implements the ENTSO-E conformity tests.

**powsybl-cim-anonymiser**  
This module provides a tool to anonymize identifier of a CIM-CGMES file.

#### IEEE-CDF

The following artifacts provide the support for the [IEEE-CDF](../grid/formats/ieee-cdf.md) format.

**powsybl-ieee-cdf-model**  
This module provides classes to model the network regarding the IEEE-CDF format.

**powsybl-ieee-cdf-converter**  
This module provides an implementation of the converter API to allow a user to load/save a network from/to an IEEE-CDF file.

#### PSS/E

The following artifacts provide the support for the [PSSE/E](../grid/formats/psse.md) format.

**powsybl-psse-model**  
This module provides classes to model the network regarding the PSSE format.

**powsybl-psse-converter**        
This module provides an implementation of the converter API to allow a user to load/save a network from/to a PSSE file.

#### MatPower

The following artifacts provide the support for the [MatPower](../grid/formats/matpower.md) format.

**powsybl-matpower-model**  
This module provides classes to model the network regarding the MatPower format.

**powsybl-matpower-converter**        
This module provides an implementation of the converter API to allow a user to load/save a network from/to a MatPower file.

#### AMPL

**powsybl-ampl-converter**  
This module provides an implementation of the converter API to allow a user to export a network to a set of tabular text files. As the format is really simple to parse, it's commonly used to integrate PowSyBl with an optimal power flow using an [AMPL](../grid/formats/ampl.md) model or with Matlab.

### Network additional features
The following artifacts provide additional features around the network.

**powsybl-iidm-comparator**  
This module provides functions to help to compare IIDM networks.

**powsybl-iidm-mergingview**  
This module provides an alternative way to merge several networks, keeping the underlying networks unchanged.

**powsybl-iidm-reducer**  
This module provides classes to extract a sub area of a network.

**powsybl-iidm-test**  
This module provides factories to create simple networks.

**powsybl-iidm-tck**  
This module provides a test compatibility kit to validate an IIDM implementation regarding the requirements of the API.

**powsybl-iidm-util** *(Removed since v4.0.0)*
This module provides additional features around the network. We removed this module in v4.0.0 and move its content in the `powsybl-iidm-api` module.

### Network hypothesis

**powsybl-network-hypothesis**
This module provides components in order to model network hypotheses. Basic hypothesis are modification tasks, available in `powsybl-core`. More complex modification tasks are implemented here.

## Simulators

### Power flow

**powsybl-loadflow-api**  
This module provides a common API for power flow computation. You have to implement this API to use your power flow simulator through PowSyBl.

**powsybl-open-loadflow**  
This module provides an [implementation](../simulation/powerflow/openlf.md) of the load flow API.

**powsybl-loadflow-results-completion**  
This module implements power flow equations to initialize the P, Q, V and $$\theta$$ from the characteristics of the equipments. This module can be used as a [post processor](../grid/formats/import-post-processor.md) of the import or with the [load flow validation](../user/itools/loadflow-validation.md#load-flow-results-validation) tool.

**powsybl-loadflow-validation**  
This module provides functions to check the consistency of a power flow result. It can be use as a java library, but the
easiest way to use it is through the [iTools CLI](../user/itools/loadflow-validation.md).

### Contingencies
The following artifacts are used to model contingencies. Contingencies can then be used to run security analyses with or without remedial actions, sensitivity analysis...

**powsybl-contingency-api**  
This module provides an API to model and create contingencies.

**powsybl-contingency-dsl**  
This module provides classes to load [a contingency list from a groovy script](../simulation/securityanalysis/contingency-dsl.md). This is a powerful way to create contingencies.

### Security analyses

**powsybl-security-analysis-api**  
This module provides a common API for [security analyses](../simulation/securityanalysis/index.md) computation. You have to implement this API to use your simulator through PowSyBl. We also provide an simple implementation that relies on a power flow simulator.  

**powsybl-action-dsl**  
This module provides the [action DSL](../simulation/securityanalysis/action-dsl.md), a domain specific language to describe a strategy to solve violation issues, used in the action simulation.

**powsybl-action-dsl-spi**  
This module provides an SPI to extend the action a user can use in an action script.

**powsybl-action-simulator**  
This module provides an API to run [security analyses with remedial actions](). It also provides an implementation based on a power flow simulator.

**powsybl-action-util**  
This module provides a set of common remedial actions an user would like to use in his action script.

### Sensitivity analysis

**powsybl-sensitivity-analysis-api**  
This module provides a common API for [sensitivity analysis](../simulation/sensitivity/index.md). You have to implement this API to use your own simulator through PowSyBl.

**powsybl-sensitivity-api** (Deprecated)  
This module has been replaced by `powsybl-sensitivity-analysis-api` since powsybl-core v3.7.0.

### Time domain simulation

**powsybl-dynamic-simulation-api**  
This module provides a common API for [time domain simulation](../simulation/timedomain/index.md). You have to implement this API to use your own simulator through PowSyBl.

**powsybl-dynamic-simulation-dsl**  
This module provides an API to implement a DSL for dynamic simulation inputs, such as the curves, the dynamic model or events mapping.

**powsybl-dynamic-simulation-tool**  
This module provides an [iTools](../user/itools/dynamic-simulation.md) command to run time-domain simulation.

**powsybl-simulation-api**  *(Removed since v4.1.0)*
This module provides a legacy API for time domain simulation. We removed this module in 4.1.0 ; `powsybl-dynamic-simulation-api` should be used instead.

### Optimal power load flow on network variants (Metrix)

**powsybl-metrix-mapping**
This module provides the [mapping DSL](../simulation/metrix/mapping.md) to generate multi cases mapping configuration. 

**powsybl-metrix-integration**
This module provides an API to run [metrix simulator](../simulation/metrix/index.md) optimal power load flow.

## Balances computation

**powsybl-balances-adjustment**
This module provides components in order to run a active power balances adjustment computation over several network areas.

## Configuration management
The following artifacts define how PowSyBl features access to the [user configuration](../user/configuration/index.md).

**powsybl-config-classic**  
This module allows you to access to the configuration defined in a configuration file stored in the home directory of the user. This is the classic way to configure PowSyBl.

**powsybl-config-test**  
This module should be used for unit testing only. It allows you to access to the configuration stored in the classpath.

## Computation
The following artifacts are used by PowSyBl to know where the computation are really executed, locally or remotely for [high performance computing](../index.html#hpc).

**powsybl-computation**  
This module provides the API to manage [computations]() in PowSyBl.

**powsybl-computation-local**  
This module is an implementation of the computation API that allows a user to run computation locally. This is the simplest way to do calculation using PowSyBl.

**powsybl-computation-mpi**  
This module is an implementation of the computation API that allows a user to run computation on a computation grid using [MPI]().

**powsybl-computation-slurm** *(Advanced user)*  
This module is an implementation of the computation API that allows a user to run computation using on servers manage by [Slurm](), a workload manager.

## Data management
The following artifacts described below provide classes to model data in our data management system called [AFS](../data/afs.md) (Application File System).

**powsybl-afs-core**  
This module provides the core classes to model a file system (Node, File, Folder...). You have to extend these base classes if you want to store custom data in AFS.

**powsybl-afs-ext-base**  
This module provides classes to manage common powsybl concepts in AFS (cases, networks, scripts...).

**powsybl-afs-contingency**  
This module provides classes to manage contingency lists in AFS.

**powsybl-afs-security-analysis**  
This module provides classes to run security analyses on networks stored in AFS.

**powsybl-afs-security-analysis-local**  
This module provides classes to run security analyses locally.

**powsybl-afs-action-dsl**  
This module provides classes to manage scripts for the simulation of remedial actions.

### Storage

**powsybl-afs-storage-api**  
This module provides a common API for the storage layer. This API have to be implemented if you want to store your data in a database. PowSyBl provides several implementation to store data on the file system.

**powsybl-afs-local**  
This module provides an implementation of the storage API to read/store data from/to the local file system.

**powsybl-afs-mapdb**  
This module provides an implementation of the `AppFileSystem` interface based on [MapDB](http://www.mapdb.org).

**powsybl-afs-mapdb-storage**  
This module provides an implementation of the storage API to read/store data using [MapDB](http://www.mapdb.org).

**powsybl-afs-cassandra**  
This module provides an implementation of the storage API based on [Apache Cassandra](http://apache.cassandra.org).

### Remote storage

**powsybl-afs-ws-storage**  
This module provides an implementation of the storage API to expose a remote AFS.

**powsybl-afs-ws-utils**  
This module provides utility classes shared between the client part and the server part (JSON serialization...).

**powsybl-afs-ws-server**  
This module provides a facade to expose a remote AFS through a Rest API.

**powsybl-afs-ws-server-utils**  
This module provides utility classes for the backend part (authentication...).

**powsybl-afs-ws-client**  
This module provides the client code to access to a remove AFS.

**powsybl-afs-ws-client-utils**  
This module provides utility classes for the client part (session management, configuration...).

**powsybl-afs-network-server**  
This module provides a Rest API to query a network stored in AFS.

**powsybl-afs-network-client**  
This module provides the client code of the network query Rest API.

## Scripting

**powsybl-scripting**  
This module provides a [CLI tool](../user/itools/run-script.md) to create groovy script based on PowSyBl. It is designed to be fully extendable and offers a complete access to the whole framework, without any limitation.

**powsybl-iidm-scripting**  
This modules provides extensions to access to the network. It is mainly used to maintain the compatibility with existing scripts.

**powsybl-loadflow-scripting**  
This module provides extensions to run power flow from groovy scripts.

**powsybl-afs-scripting**  
This module provides an extension to access to an AFS from groovy scripts.

## Mathematical

**powsybl-math**  
This module provides mathematical utility classes to work with matrix or graphs.

**powsybl-math-native**  
This module provides a native implementation of sparse matrix based on [SuiteSparse](http://faculty.cse.tamu.edu/davis/suitesparse.html) and LU factorization. This module is used by [Open LoadFlow](../simulation/powerflow/openlf.md).

## Timeseries

**powsybl-timeseries-api**  
This module provides a model of time series and a DSL to perform basic operations.

## Miscellaneous

**powsybl-commons**  
This module provides a lot of really basic and technical utilities used everywhere in PowSyBl such as XML or JSON helpers, configuration, exceptions...

**powsybl-dsl**  
This module provides classes to define a new domain specific language (DSL). It provides logical expression support and a facade to access and manipulate a network.

## iTools

**powsybl-tools**  
This module provides a [CLI tool](../user/itools/index.md) to run simulations.

**powsybl-itools-packager-maven-plugin**  
This module provides a maven plugin to [create a standalone distribution based on iTools](../developer/tutorials/itools-packager.md).

## Network visualization

### Single line diagram

**single-line-diagram-core**  
This module enables to generate svg images of voltage levels and substations.

**single-line-diagram-cgmes-dl-iidm-extensions**  
This module gathers the network core model extensions for CIM-CGMES networks.

**single-line-diagram-cgmes-dl-conversion**  
This module is used to convert the CIM-CGMES DL profile to the network core model extensions.

**single-line-diagram-cgmes-layout**  
This module should be used to create svgs from the CIM-CGMES DL (Diagram Layout) profile.

**single-line-diagram-force-layout**  
This module provides a layout for substation diagrams based on a basic force layout algorithm.

**single-line-diagram-iidm-extensions**  
This module defines extensions to attach diagram information to networks.

### Network area diagram

**network-area-diagram**  
This module enables to generate svg images displaying a concise diagram of the network or part of the network.

### Development tools

**powsybl-single-line-diagram-viewer**  
This module provides a demo app for debug purpose, which allows viewing and interacting with substations and voltage levels diagrams of network files.

## Grid Study Environment (Deprecated)
The following artifacts are part of a generic desktop application you can easily customize with plugins.

**powsybl-gse-app**  
This module provides the base classes for the GSE front-end. If you want to create a standalone application based on GSE, you have to use this module.

**powsybl-gse-afs-ext-base**  
This module provides a GUI to manage objects defined in the [powsybl-afs-ext-base](#data-management) module.

**powsybl-gse-copy-paste-afs**  
This module provides utility functions to manage the copy/paste of data stored in AFS.

**powsybl-gse-demo**  
This module contains the entry point of a demo based on the GSE.

**powsybl-gse-network-explorer**  
This module provides a plugin to visualize the hierarchy and the characteristics of the equipments of a network.

**powsybl-gse-network-map**  
This module provides a plugin to display a network on a map.

**powsybl-gse-security-analysis**  
This module provides a GUI to manage objects related to the security analyses.

**powsybl-gse-spi**  
This module provides an SPI to extend and customize the GSE, creating your own plugins.
