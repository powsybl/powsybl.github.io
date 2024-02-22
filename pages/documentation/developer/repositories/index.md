# Repositories

This page shortly describes each repository of the [PowSyBl organization](https://github.com/powsybl), their versions and their maintainers.

## Community

### .github
This [repository](https://github.com/powsybl/.github) contains documents to explain how the PowSyBl organization works (code of conduct, maintainers, contributing, security). It also provides the templates for the issues and the pull requests. These documents are shared by all the repositories. The associated Github wiki contains the roadmap of the whole organization.

**Reviewers:** [annetill](https://github.com/annetill), [So-Fras](https://github.com/So-Fras)    
**Committers:** [annetill](https://github.com/annetill)

### powsybl.github.io
This [repository](https://github.com/powsybl/powsybl.github.io) contains the source code of the PowSyBl's website.

**Reviewers:** [annetill](https://github.com/annetill), [So-Fras](https://github.com/So-Fras)    
**Committers:** all the committers

### powsybl-tutorials
This [repository](https://github.com/powsybl/powsybl-tutorials) contains the source code of the different [tutorials](../tutorials/index.md) presented on this website.

**Reviewers:** [annetill](https://github.com/annetill), [So-Fras](https://github.com/So-Fras),  [colinepiloquet](https://github.com/colinepiloquet)   
**Committers:** all the committers

## Java release train

### [powsybl-core](powsybl-core.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-core.svg?sort=semver)](https://github.com/powsybl/powsybl-core/releases/)
This [repository](https://github.com/powsybl/powsybl-core) provides the core feature of the PowSyBl framework such as the grid modelling, the support of several data exchange formats (CGMES, UCTE...), computation APIs (load flow, security analysis, sensitivity analysis, dynamic simulation...), time series.

**Reviewers:** all great contributors are relevant as first reviewer, second review must be performed by a committer. This repository has many very different features, do not hesitate to ask the developers' community before.      
**Committers:** [flo-dup](https://github.com/flo-dup), [annetill](https://github.com/annetill), [geofjamg](https://github.com/geofjamg), [olperr1](https://github.com/olperr1), [zamarrenolm](https://github.com/zamarrenolm), [jeandemanged](https://github.com/jeandemanged), [obrix](https://github.com/obrix)  

### [powsybl-open-loadflow](powsybl-open-loadflow.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-open-loadflow.svg?sort=semver)](https://github.com/powsybl/powsybl-open-loadflow/releases/)
This [repository](https://github.com/powsybl/powsybl-open-loadflow) provides an implementation of the LoadFlow API based on the [powsybl-math-native](powsybl-math-native.md) project.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [annetill](https://github.com/annetill), [jeandemanged](https://github.com/jeandemanged), [obrix](https://github.com/obrix)   
**Committers:** [geofjamg](https://github.com/geofjamg), [annetill](https://github.com/annetill), [jeandemanged](https://github.com/jeandemanged), [obrix](https://github.com/obrix)      

### [powsybl-dynawo](powsybl-dynawo.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-dynawo.svg?sort=semver)](https://github.com/powsybl/powsybl-dynawo/releases/)
This [repository](https://github.com/powsybl/powsybl-dynawo) provides an implementation of the dynamic simulation API for the [Dyna&omega;o](https://dynawo.github.io/) time domain simulation tool.

**Reviewers:** [flo-dup](https://github.com/flo-dup), [gautierbureau](https://github.com/gautierbureau)      
**Committers:** [flo-dup](https://github.com/flo-dup)    

### [powsybl-diagram](powsybl-diagram.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-diagram.svg?sort=semver)](https://github.com/powsybl/powsybl-diagram/releases/)
This [repository](https://github.com/powsybl/powsybl-diagram) provides modules to generate single-line diagrams and network graph diagrams.

**Reviewers:** [flo-dup](https://github.com/flo-dup), [geofjamg](https://github.com/geofjamg), [So-Fras](https://github.com/So-Fras)  
**Committers:** [flo-dup](https://github.com/flo-dup), [geofjamg](https://github.com/geofjamg), [So-Fras](https://github.com/So-Fras)  

### [powsybl-entsoe](powsybl-entsoe.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-entsoe.svg?sort=semver)](https://github.com/powsybl/powsybl-entsoe/releases/)
This [repository](https://github.com/powsybl/powsybl-entsoe) provides components specific to ENTSO-E-orientated processes.

**Reviewers:** [phiedw](https://github.com/phiedw), [annetill](https://github.com/annetill), [colinepiloquet](https://github.com/colinepiloquet)     
**Committers:** [phiedw](https://github.com/phiedw)   

### [powsybl-open-rao](powsybl-open-rao.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-open-rao.svg?sort=semver)](https://github.com/powsybl/powsybl-open-rao/releases/)
This [repository](https://github.com/powsybl/powsybl-open-rao) provides a modular engine for remedial actions optimization.

**Reviewers:** [bqth29](https://github.com/bqth29), [benrejebmoh](https://github.com/benrejebmoh), [Godelaine](https://github.com/Godelaine), [jipea](https://github.com/jipea), [MartinBelthle](https://github.com/MartinBelthle), [murgeyseb](https://github.com/murgeyseb), [pet-mit](https://github.com/pet-mit), [phiedw](https://github.com/phiedw)  
**Committers:** [bqth29](https://github.com/bqth29), [benrejebmoh](https://github.com/benrejebmoh), [Godelaine](https://github.com/Godelaine), [jipea](https://github.com/jipea), [MartinBelthle](https://github.com/MartinBelthle), [murgeyseb](https://github.com/murgeyseb), [pet-mit](https://github.com/pet-mit), [phiedw](https://github.com/phiedw)  

### powsybl-dependencies [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-dependencies.svg?sort=semver)](https://github.com/powsybl/powsybl-dependencies/releases/)
This [repository](https://github.com/powsybl/powsybl-dependencies) helps users with dependency management in PowSyBl.

**Reviewers:**  [olperr1](https://github.com/olperr1), [flo-dup](https://github.com/flo-dup)  
**Committers:** [olperr1](https://github.com/olperr1), [flo-dup](https://github.com/flo-dup)  

### powsybl-distribution [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-distribution.svg?sort=semver)](https://github.com/powsybl/powsybl-distribution/releases/)
This [repository](https://github.com/powsybl/powsybl-distribution) allows for the generation of a basic distribution of PowSyBl.

**Reviewers:**  [olperr1](https://github.com/olperr1), [flo-dup](https://github.com/flo-dup)  
**Committers:** [olperr1](https://github.com/olperr1), [flo-dup](https://github.com/flo-dup)  

### powsybl-starter [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-starter.svg?sort=semver)](https://github.com/powsybl/powsybl-starter/releases/)
This [repository](https://github.com/powsybl/powsybl-starter) is a help for PowSyBl beginners: it makes the main PowSyBl functionalities available through one single dependency import.

**Reviewers:**  [olperr1](https://github.com/olperr1), [flo-dup](https://github.com/flo-dup)  
**Committers:** [olperr1](https://github.com/olperr1), [flo-dup](https://github.com/flo-dup)  

## Python libraries

### [pypowsybl](pypowsybl.md) [![GitHub release](https://img.shields.io/github/release/powsybl/pypowsybl.svg?sort=semver)](https://github.com/powsybl/pypowsybl/releases/)

This [repository](https://github.com/powsybl/pypowsybl) provides an GraalVM integration of the PowSyBl libraries for Python developers.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [EtienneLt](https://github.com/EtienneLt), [colinepiloquet](https://github.com/colinepiloquet), [obrix](https://github.com/obrix)  
**Committers:** [geofjamg](https://github.com/geofjamg), [EtienneLt](https://github.com/EtienneLt), [obrix](https://github.com/obrix)

### pypowsybl-notebooks

This [repository](https://github.com/powsybl/pypowsybl-notebooks) provides some notebooks using pypowsybl for demos and tutorials.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [annetill](https://github.com/annetill), [colinepiloquet](https://github.com/colinepiloquet), [obrix](https://github.com/obrix)  
**Committers:** [geofjamg](https://github.com/geofjamg), [annetill](https://github.com/annetill), [obrix](https://github.com/obrix)

### pypowsybl-jupyter

This [repository](https://github.com/powsybl/pypowsybl-jupyter) contains widgets for pypowsybl in Jupyter notebooks.

**Committers:** [flo-dup](https://github.com/flo-dup)

## Commons

### powsybl-parent [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-parent.svg?sort=semver)](https://github.com/powsybl/powsybl-parent/releases/)
This [repository](https://github.com/powsybl/powsybl-parent) provides the build configuration shared as maven pom files, shared by all our Java repositories.

**Reviewers:** [jonenst](https://github.com/jonenst)  
**Committers:** [jonenst](https://github.com/jonenst)

### powsybl-dev-tools

This [repository](https://github.com/powsybl/powsybl-dev-tools) provides tools to help developers for debugging such as a single line diagram viewer.

**Committers:** [flo-dup](https://github.com/flo-dup), [So-Fras](https://github.com/So-Fras)  

### powsybl-incubator

This [repository](https://github.com/powsybl/powsybl-incubator) provides incubating modules that are not mature enough to be released.

**Reviewers:** all the committers

## Other Java libraries

### powsybl-network-store [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-network-store.svg?sort=semver)](https://github.com/powsybl/powsybl-network-store/releases/)
This repository provides a PostgreSQL implementation of the IIDM grid model.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [obrix](https://github.com/obrix), [rolnico](https://github.com/rolnico)  
**Committers:** [geofjamg](https://github.com/geofjamg), [obrix](https://github.com/obrix)  

### [powsybl-metrix](powsybl-metrix.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-metrix.svg?sort=semver)](https://github.com/powsybl/powsybl-metrix/releases/)
This [repository](https://github.com/powsybl/powsybl-metrix) provides modules to run optimal power load flow on several network variants. Variants are generated through time series mapping on a base case.

**Reviewers:** [marifunf](https://github.com/marifunf), [rolnico](https://github.com/rolnico), [klorel](https://github.com/klorel)    
**Committers:** [rolnico](https://github.com/rolnico), [marifunf](https://github.com/marifunf), [klorel](https://github.com/klorel)

### [powsybl-afs](powsybl-afs.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-afs.svg?sort=semver)](https://github.com/powsybl/powsybl-afs/releases/)
This [repository](https://github.com/powsybl/powsybl-afs) provides a standardized way to organize the data for a power system study, called AFS (**A**pplication **F**ile **S**ystem). It supports some storage systems such as [MapDB](http://www.mapdb.org) or [Apache Cassandra](https://cassandra.apache.org). It is designed to be extensible using custom plugins to manage new types of data.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [rolnico](https://github.com/rolnico), [marifunf](https://github.com/marifunf), [klorel](https://github.com/klorel)  
**Committers:** [rolnico](https://github.com/rolnico), [marifunf](https://github.com/marifunf), [klorel](https://github.com/klorel)  

### [powsybl-hpc](powsybl-hpc.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-hpc.svg?sort=semver)](https://github.com/powsybl/powsybl-hpc/releases/)
This [repository](https://github.com/powsybl/powsybl-hpc) provides two implementations of the Computation API, to distribute the computation using [MPI](https://www.open-mpi.org) or [Slurm Workload Manager](https://slurm.schedmd.com).

**Reviewers:** [rolnico](https://github.com/rolnico), [geofjamg](https://github.com/geofjamg)     
**Committers:** [rolnico](https://github.com/rolnico), [geofjamg](https://github.com/geofjamg)  

### [powsybl-optimizer](powsybl-optimizer.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-optimizer.svg?sort=semver)](https://github.com/powsybl/powsybl-optimizer/releases/)
This [repository](https://github.com/powsybl/powsybl-optimizer) provides an interface to use the Ampl optimizer.

**Reviewers:** [annetill](https://github.com/annetill), [So-Fras](https://github.com/So-Fras)   
**Committers:** [So-Fras](https://github.com/So-Fras)

### powsybl-eurostag

This [repository](https://github.com/powsybl/powsybl-eurostag) allows to import Eurostag format file.

**Reviewers:** [JB-H](https://github.com/JB-H)  
**Committers:** [geofjamg](https://github.com/geofjamg)  

## C++ libraries

### [powsybl-iidm4cpp](powsybl-iidm4cpp.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-iidm4cpp.svg?sort=semver)](https://github.com/powsybl/powsybl-iidm4cpp/releases/)
This [repository](https://github.com/powsybl/powsybl-iidm4cpp) provides a C++ implementation of the IIDM grid model.

**Reviewers:**  [gautierbureau](https://github.com/gautierbureau)  
**Committers:** [gautierbureau](https://github.com/gautierbureau)

### [powsybl-math-native](powsybl-math-native.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-math-native.svg?sort=semver)](https://github.com/powsybl/powsybl-math-native/releases/)
This [repository](https://github.com/powsybl/powsybl-math-native) provides a C++ implementation of sparse matrix, based on the [SuiteSparse](http://faculty.cse.tamu.edu/davis/suitesparse.html) project. This 64-bits libraries for Linux, Windows and MacOS are packaged as a Jar file and published on maven central.

**Reviewers:** [geofjamg](https://github.com/geofjamg)   
**Committers:** [geofjamg](https://github.com/geofjamg)

### [powsybl-metrix](powsybl-metrix.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-metrix.svg?sort=semver)](https://github.com/powsybl/powsybl-metrix/releases/)
This [repository](https://github.com/powsybl/powsybl-metrix) also provides a C++ implementation of optimal power load flow.

**Reviewers:** [marifunf](https://github.com/marifunf), [rolnico](https://github.com/rolnico), [klorel](https://github.com/klorel)   
**Committers:** [rolnico](https://github.com/rolnico), [marifunf](https://github.com/marifunf), [klorel](https://github.com/klorel)  

## Microservices

### [powsybl-case](powsybl-case.md)
This [repository](https://github.com/powsybl/powsybl-case-server) provides a web service for network cases management.
The [powsybl-case-datasource](https://github.com/powsybl/powsybl-case-datasource) repository is the client part of this service.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst), [antoinebhs](https://github.com/antoinebhs)  
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst), [antoinebhs](https://github.com/antoinebhs)  

### [powsybl-network-store-server](powsybl-network-store-server.md)
This [repository](https://github.com/powsybl/powsybl-network-store-server) provides a persistent implementation of the IIDM grid model in [PostgreSQL](https://www.postgresql.org/) database. The grid model is exposed as a web service.
The [powsybl-network-store](https://github.com/powsybl/powsybl-network-store) repository is the client part of this service.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst), [antoinebhs](https://github.com/antoinebhs)  
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst), [antoinebhs](https://github.com/antoinebhs)

### [powsybl-network-conversion-server](powsybl-network-conversion-server.md)
This [repository](https://github.com/powsybl/powsybl-network-conversion-server) provides a web service that exposes conversion functions.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)    
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  

### [powsybl-single-line-diagram-server](powsybl-single-line-diagram-server.md)
This [repository](https://github.com/powsybl/powsybl-single-line-diagram-server) provides a web service to generate single line diagrams.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)    
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)

### powsybl-ws-commons
This [repository](https://github.com/powsybl/powsybl-ws-commons) provides commons for web services.

**Reviewers:** [jonenst](https://github.com/jonenst)  
**Committers:** [jonenst](https://github.com/jonenst)  

