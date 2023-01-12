# Repositories

This page shortly describes each repository of the [PowSyBl organization](https://github.com/powsybl), their versions and their maintainers.

## Java libraries

### [powsybl-core](powsybl-core.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-core.svg?sort=semver)](https://github.com/powsybl/powsybl-core/releases/)
This [repository](https://github.com/powsybl/powsybl-core) provides the core feature of the PowSyBl framework such as the grid modelling, the support of several data exchange format (CGMES, UCTE...), computation APIs (power flow, security analysis, sensitivity analysis, dynamic simulation...).

**Reviewers:** [annetill](https://github.com/annetill), [miovd](https://github.com/miovd), [zamarrenolm](https://github.com/zamarrenolm), [flo-dup](https://github.com/flo-dup), [sylvlecl](https://github.com/sylvlecl), [geofjamg](https://github.com/geofjamg)  
**Committers:** [miovd](https://github.com/miovd), [flo-dup](https://github.com/flo-dup), [annetill](https://github.com/annetill), [geofjamg](https://github.com/geofjamg)  

### [powsybl-open-loadflow](powsybl-open-loadflow.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-open-loadflow.svg?sort=semver)](https://github.com/powsybl/powsybl-open-loadflow/releases/)
This [repository](https://github.com/powsybl/powsybl-open-loadflow) provides an implementation of the LoadFlow API based on the [powsybl-math-native](powsybl-math-native.md) project.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [annetill](https://github.com/annetill)  
**Committers:** [geofjamg](https://github.com/geofjamg), [annetill](https://github.com/annetill), [flo-dup](https://github.com/flo-dup)  

### [powsybl-dynawo](powsybl-dynawo.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-dynawo.svg?sort=semver)](https://github.com/powsybl/powsybl-dynawo/releases/)
This [repository](https://github.com/powsybl/powsybl-dynawo) provides an implementation of the dynamic simulation API for the [Dyna&omega;o](https://dynawo.github.io/) time domain simulation tool.

**Reviewers:** [flo-dup](https://github.com/flo-dup), [zamarrenolm](https://github.com/zamarrenolm)  
**Committers:** [flo-dup](https://github.com/flo-dup), [miovd](https://github.com/miovd)  

### [powsybl-balances-adjustment](powsybl-balances-adjustment.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-balances-adjustment.svg?sort=semver)](https://github.com/powsybl/powsybl-balances-adjustment/releases/)
This [repository](https://github.com/powsybl/powsybl-balances-adjustment) provides a functional module to reach target net positions across networks, through an iterative process based on power flow computations and injections scaling.

**Reviewers:** [phiedw](https://github.com/phiedw), [miovd](https://github.com/miovd)   
**Committers:** [phiedw](https://github.com/phiedw), [miovd](https://github.com/miovd)  

### [powsybl-diagram](powsybl-diagram.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-diagram.svg?sort=semver)](https://github.com/powsybl/powsybl-diagram/releases/)
This [repository](https://github.com/powsybl/powsybl-diagram) provides modules to generate single-line diagrams and network graph diagrams.

**Reviewers:** [flo-dup](https://github.com/flo-dup), [geofjamg](https://github.com/geofjamg), [BenoitJeanson](https://github.com/BenoitJeanson)    
**Committers:** [flo-dup](https://github.com/flo-dup), [geofjamg](https://github.com/geofjamg), [Luma](https://github.com/zamarrenolm)

### [powsybl-entsoe](powsybl-entsoe.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-entsoe.svg?sort=semver)](https://github.com/powsybl/powsybl-entsoe/releases/)
This [repository](https://github.com/powsybl/powsybl-entsoe) provides components specific to ENTSO-E-orientated processes.

**Reviewers:** [miovd](https://github.com/miovd), [annetill](https://github.com/annetill), [colinepiloquet](https://github.com/colinepiloquet)    
**Committers:** [miovd](https://github.com/miovd), [colinepiloquet](https://github.com/colinepiloquet)  

### [powsybl-metrix](powsybl-metrix.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-metrix.svg?sort=semver)](https://github.com/powsybl/powsybl-metrix/releases/)
This [repository](https://github.com/powsybl/powsybl-metrix) provides modules to run optimal power load flow on several network variants. Variants are generated through time series mapping on a base case.

**Reviewers:** [marifunf](https://github.com/marifunf), [berthaultval](https://github.com/berthaultval), [bongrainmat](https://github.com/orgs/powsybl/people/bongrainmat)      
**Committers:** [berthaultval](https://github.com/berthaultval), [miovd](https://github.com/miovd), [bongrainmat](https://github.com/orgs/powsybl/people/bongrainmat)    

### [powsybl-afs](powsybl-afs.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-afs.svg?sort=semver)](https://github.com/powsybl/powsybl-afs/releases/)
This [repository](https://github.com/powsybl/powsybl-afs) provides a standardized way to organize the data for a power system study, called AFS (**A**pplication **F**ile **S**ystem). It supports several storage system such as [MapDB](http://www.mapdb.org) or [Apache Cassandra](https://cassandra.apache.org). It is designed to be extensible using custom plugins to manage new types of data.

**Reviewers:** [berthaultval](https://github.com/berthaultval), [geofjamg](https://github.com/geofjamg)    
**Committers:** [berthaultval](https://github.com/berthaultval), [miovd](https://github.com/miovd)  

### [powsybl-hpc](powsybl-hpc.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-hpc.svg?sort=semver)](https://github.com/powsybl/powsybl-hpc/releases/)
This [repository](https://github.com/powsybl/powsybl-hpc) provides two implementations of the Computation API, to distribute the computation using [MPI](https://www.open-mpi.org) or [Slurm Workload Manager](https://slurm.schedmd.com).

**Reviewers:** [sylvlecl](https://github.com/sylvlecl) (Slurm), [geofjamg](https://github.com/geofjamg) (MPI)  
**Committers:** [sylvlecl](https://github.com/sylvlecl)  

### powsybl-shortcircuits

This [repository](https://github.com/powsybl/powsybl-shortcircuits) allows analyses of short circuits on a network. This repository provides a generic API for symmetric short circuit calculations but no implementation for the moment.     

**Reviewers:** [miovd](https://github.com/miovd), [annetill](https://github.com/annetill), [colinepiloquet](https://github.com/colinepiloquet)    
**Committers:** [miovd](https://github.com/miovd), [colinepiloquet](https://github.com/colinepiloquet)  

### [powsybl-network-hypothesis](powsybl-network-hypothesis.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-network-hypothesis.svg?sort=semver)](https://github.com/powsybl/powsybl-network-hypothesis/releases/)

This [repository](https://github.com/powsybl/powsybl-network-hypothesis) allows to apply hypotheses on a network such as client connections, HVDC building from groups or loads, etc.  

**Reviewers:** [miovd](https://github.com/miovd), [annetill](https://github.com/annetill), [colinepiloquet](https://github.com/colinepiloquet)  
**Committers:** [miovd](https://github.com/miovd), [colinepiloquet](https://github.com/colinepiloquet)  

### powsybl-eurostag

This [repository](https://github.com/powsybl/powsybl-eurostag) allows to import Eurostag format file.

**Reviewers:** [colinepiloquet](https://github.com/colinepiloquet)  
**Committers:** [colinepiloquet](https://github.com/colinepiloquet)  

## Microservices

### [powsybl-case](powsybl-case.md)
This [repository](https://github.com/powsybl/powsybl-case) provides a web service for network cases management.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  

### [powsybl-network-store](powsybl-network-store.md)
This [repository](https://github.com/powsybl/powsybl-network-store) provides a persistent implementation of the IIDM grid model in [Apache Cassandra](https://cassandra.apache.org) database. The grid model is exposed as a web service.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  

### [powsybl-geo-data](powsybl-geo-data.md)
This [repository](https://github.com/powsybl/powsybl-geo-data) provides modules to manage geographical data such as substation or lines location as well as a web service.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  

### [powsybl-network-conversion-server](powsybl-network-conversion-server.md)
This [repository](https://github.com/powsybl/powsybl-network-conversion-server) provides a web service that exposes conversion functions.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)    
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  

### [powsybl-cgmes-gl](powsybl-cgmes-gl.md)
This [repository](https://github.com/powsybl/powsybl-cgmes-gl) provides modules to support the [CGMES](https://www.entsoe.eu/digital/common-information-model/cim-for-grid-models-exchange/) Geographical Location Profile  as well as a web service.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  

### [powsybl-single-line-diagram-server](powsybl-single-line-diagram-server.md)
This [repository](https://github.com/powsybl/powsybl-single-line-diagram-server) provides a web service to generate single line diagrams.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)    
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  

### [powsybl-network-map-server](powsybl-network-map-server.md)
This [repository](https://github.com/powsybl/powsybl-network-map-server) provides a web service for the generation of geographical data in order to draw a network on a map.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)  

### powsybl-ws-commons
This [repository](https://github.com/powsybl/powsybl-ws-commons) provides commons for web-services.

**Reviewers:** [jonenst](https://github.com/jonenst)  
**Committers:** [jonenst](https://github.com/jonenst)  

## C++ libraries

### [powsybl-iidm4cpp](powsybl-iidm4cpp.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-iidm4cpp.svg?sort=semver)](https://github.com/powsybl/powsybl-iidm4cpp/releases/)
This [repository](https://github.com/powsybl/powsybl-iidm4cpp) provides a C++ implementation of the IIDM grid model.

**Reviewers:** [mathbagu](https://github.com/mathbagu)  
**Committers:** [mathbagu](https://github.com/mathbagu)  

### [powsybl-math-native](powsybl-math-native.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-math-native.svg?sort=semver)](https://github.com/powsybl/powsybl-math-native/releases/)
This [repository](https://github.com/powsybl/powsybl-math-native) provides a C++ implementation of sparse matrix, based on the [SuiteSparse](http://faculty.cse.tamu.edu/davis/suitesparse.html) project. This 64-bits libraries for Linux, Windows and MacOS are packaged as a Jar file and published on maven central.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [mathbagu](https://github.com/mathbagu)  
**Committers:** [geofjamg](https://github.com/geofjamg), [mathbagu](https://github.com/mathbagu)  

### [powsybl-metrix](powsybl-metrix.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-metrix.svg?sort=semver)](https://github.com/powsybl/powsybl-metrix/releases/)
This [repository](https://github.com/powsybl/powsybl-metrix) also provides a C++ implementation of optimal power load flow.

**Reviewers:** [berthaultval](https://github.com/berthaultval), [marifunf](https://github.com/marifunf)  
**Committers:** [berthaultval](https://github.com/berthaultval), [miovd](https://github.com/miovd)  

## Python libraries

### [pypowsybl](pypowsybl.md) [![GitHub release](https://img.shields.io/github/release/powsybl/pypowsybl.svg?sort=semver)](https://github.com/powsybl/pypowsybl/releases/)

This [repository](https://github.com/powsybl/pypowsybl) provides an integration of the PowSyBl framework for Python developers.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [sylvlecl](https://github.com/sylvlecl)  
**Committers:** [geofjamg](https://github.com/geofjamg), [sylvlecl](https://github.com/sylvlecl)  

### pypowsybl-notebooks

This [repository](https://github.com/powsybl/pypowsybl-notebooks) provides some notebooks using pypowsybl for demos and tutorials.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [sylvlecl](https://github.com/sylvlecl)  
**Committers:** [geofjamg](https://github.com/geofjamg), [sylvlecl](https://github.com/sylvlecl)  

## Commons

### powsybl-parent [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-parent.svg?sort=semver)](https://github.com/powsybl/powsybl-parent/releases/)
This [repository](https://github.com/powsybl/powsybl-parent) provides the build configuration shared as maven pom files, shared by all our Java repositories.

**Reviewers:** [jonenst](https://github.com/jonenst), [mathbagu](https://github.com/mathbagu)  
**Committers:** [jonenst](https://github.com/jonenst), [mathbagu](https://github.com/mathbagu)  

### powsybl-dev-tools

This [repository](https://github.com/powsybl/powsybl-dev-tools) provides tools to help developers for debugging such as a single line diagram viewer.  

### powsybl-incubator

This [repository](https://github.com/powsybl/powsybl-incubator) provides incubating modules that are not mature enough to be released.

**Reviewers:** all the committers

## Community

### .github
This [repository](https://github.com/powsybl/.github) contains documents to explain how the PowSyBl organization works (code of conduct, maintainers, contributing) It also provides the templates for the issues, the pull requests. These documents are shared by all the repositories.

**Reviewers:** [annetill](https://github.com/annetill)  
**Committers:** [annetill](https://github.com/annetill)

### powsybl.github.io
This [repository](https://github.com/powsybl/powsybl.github.io) contains the source code of the PowSyBl's website.

**Reviewers:** [annetill](https://github.com/annetill)  
**Committers:** all the [committers](../../../overview/governance.md#members)

### powsybl-tutorials
This [repositories](https://github.com/powsybl/powsybl-tutorials) contains the source code of the different [tutorials](../tutorials/index.md) presented on this website.

**Reviewers:** [annetill](https://github.com/annetill)  
**Committers:** all the [committers](../../../overview/governance.md#members)

### powsybl-distribution
This [repositories](https://github.com/powsybl/powsybl-distribution) contains the source code to build a itools distribution in order to use many features developped in this organisation.  

**Reviewers:** [annetill](https://github.com/annetill)  
**Committers:** all the [committers](../../../overview/governance.md#members)