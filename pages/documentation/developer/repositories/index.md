# Repositories

This page shortly describes each repository of the [PowSyBl organization](https://github.com/powsybl), their versions and their maintainers.

## Java libraries

### [powsybl-core](powsybl-core.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-core.svg)](https://github.com/powsybl/powsybl-core/releases/)
This [repository](https://github.com/powsybl/powsybl-core) provides the core feature of the PowSyBl framework such as the grid modelling, the support of several data exchange format (CGMES, UCTE...), computation APIs (power flow, security analysis, sensitivity analysis, dynamic simulation...).

**Reviewers:** [annetill](https://github.com/annetill), [mathbagu](https://github.com/mathbagu), [MioRtia](https://github.com/MioRtia), [zamarrenolm](https://github.com/zamarrenolm)
**Committers:** [mathbagu](https://github.com/mathbagu), [MioRtia](https://github.com/MioRtia)

### [powsybl-open-loadflow](powsybl-open-loadflow.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-open-loadflow.svg)](https://github.com/powsybl/powsybl-open-loadflow/releases/)
This [repository](https://github.com/powsybl/powsybl-open-loadflow) provides an implementation of the LoadFlow API based on the [powsybl-math-native](powsybl-math-native.md) project.

**Reviewers:** [geofjamg](https://github.com/geofjamg)
**Release:** [geofjamg](https://github.com/geofjamg), [mathbagu](https://github.com/mathbagu)

### [powsybl-dynawo](powsybl-dynawo.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-dynawo.svg)](https://github.com/powsybl/powsybl-dynawo/releases/)
This [repository](https://github.com/powsybl/powsybl-dynawo) provides an implementation of the dynamic simulation API for the [Dyna&omega;o](https://dynawo.github.io/) time domain simulation tool.

**Reviewers:** [agnesLeroy](https://github.com/agnesLeroy), [mathbagu](https://github.com/mathbagu), [zamarrenolm](https://github.com/zamarrenolm)
**Committers** [mathbagu](https://github.com/mathbagu)

### [powsybl-afs](powsybl-afs.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-afs.svg)](https://github.com/powsybl/powsybl-afs/releases/)
This [repository](https://github.com/powsybl/powsybl-afs) provides a standardized way to organize the data for a power system study, called AFS (**A**pplication **F**ile **S**ystem). It supports several storage system such as [MapDB](http://www.mapdb.org) or [Apache Cassandra](https://cassandra.apache.org). It is designed to be extensible using custom plugins to manage new types of data.

**Reviewers:** [pl-buiquang](https://github.com/pl-buiquang), [geofjamg](https://github.com/geofjamg)
**Committers:** [pl-buiquang](https://github.com/pl-buiquang), [mathbagu](https://github.com/mathbagu), [MioRtia](https://github.com/MioRtia)

### [powsybl-hpc](powsybl-hpc.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-hpc.svg)](https://github.com/powsybl/powsybl-hpc/releases/)
This [repository](https://github.com/powsybl/powsybl-hpc) provides two implementations of the Computation API, to distribute the computation using [MPI](https://www.open-mpi.org) or [Slurm Workload Manager](https://slurm.schedmd.com).

**Reviewers:** [sylvlecl](https://github.com/sylvlecl) (Slurm), [geofjamg](https://github.com/geofjamg) (MPI)
**Committers:** [sylvlecl](https://github.com/sylvlecl)

### [powsybl-balances-adjustment](powsybl-balances-adjustment.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-balances-adjustment.svg)](https://github.com/powsybl/powsybl-balances-adjustment/releases/)
This [repository](https://github.com/powsybl/powsybl-balances-adjustment) provides a functional module to reach target net positions across networks, through an iterative process based on power flow computations and injections scaling.

**Reviewers:** [murgeyseb](https://github.com/murgeyseb)
**Committers:** [murgeyseb](https://github.com/murgeyseb)

### [powsybl-single-line-diagram](powsybl-single-line-diagram.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-single-line-diagram.svg)](https://github.com/powsybl/powsybl-single-line-diagram/releases/)
This [repository](https://github.com/powsybl/powsybl-single-line-diagram) provides modules to generate single line diagrams.

**Reviewers:** [flo-dup](https://github.com/flo-dup), [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)
**Committers:** [flo-dup](https://github.com/flo-dup), [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)

### [powsybl-entsoe](powsybl-entsoe.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-entsoe.svg)](https://github.com/powsybl/powsybl-entsoe/releases/)
This [repository](https://github.com/powsybl/powsybl-entsoe) provides components specific to ENTSO-E-orientated processes.

**Reviewers:** [MioRtia](https://github.com/MioRtia), [annetill](https://github.com/annetill), [colinepiloquet](https://github.com/colinepiloquet)
**Committers:** [MioRtia](https://github.com/MioRtia),  [colinepiloquet](https://github.com/colinepiloquet)

### [powsybl-metrix](powsybl-metrix.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-metrix.svg)](https://github.com/powsybl/powsybl-metrix/releases/)
This [repository](https://github.com/powsybl/powsybl-metrix) provides modules to run optimal power load flow on several network variants. Variants are generated through time series mapping on a base case.

**Reviewers:** [marifunf](https://github.com/marifunf), [berthaultval](https://github.com/berthaultval), [pl-buiquang](https://github.com/pl-buiquang)
**Committers:** [berthaultval](https://github.com/berthaultval), [MioRtia](https://github.com/MioRtia)

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

## C++ libraries

### [powsybl-iidm4cpp](powsybl-iidm4cpp.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-iidm4cpp.svg)](https://github.com/powsybl/powsybl-iidm4cpp/releases/)
This [repository](https://github.com/powsybl/powsybl-iidm4cpp) provides a C++ implementation of the IIDM grid model.

**Reviewers:** [mathbagu](https://github.com/mathbagu)
**Committers:** [mathbagu](https://github.com/mathbagu)

### [powsybl-math-native](powsybl-math-native.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-math-native.svg)](https://github.com/powsybl/powsybl-math-native/releases/)
This [repository](https://github.com/powsybl/powsybl-math-native) provides a C++ implementation of sparse matrix, based on the [SuiteSparse](http://faculty.cse.tamu.edu/davis/suitesparse.html) project. This 64-bits libraries for Linux, Windows and MacOS are packaged as a Jar file and published on maven central.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [mathbagu](https://github.com/mathbagu)
**Committers:** [geofjamg](https://github.com/geofjamg), [mathbagu](https://github.com/mathbagu)

### [powsybl-metrix](powsybl-metrix.md) [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-metrix.svg)](https://github.com/powsybl/powsybl-metrix/releases/)
This [repository](https://github.com/powsybl/powsybl-metrix) provides a C++ implementation of optimal power load flow.

**Reviewers:** [berthaultval](https://github.com/berthaultval), [marifunf](https://github.com/marifunf), [pl-buiquang](https://github.com/pl-buiquang)
**Committers:** [berthaultval](https://github.com/berthaultval), [MioRtia](https://github.com/MioRtia)

## Development

### [pypowsybl](pypowsybl.md) [![GitHub release](https://img.shields.io/github/release/powsybl/pypowsybl.svg)](https://github.com/powsybl/pypowsybl/releases/)

This [repository](https://github.com/powsybl/pypowsybl) provides an integration of the PowSyBl framework for Python developers.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [sylvlecl](https://github.com/sylvlecl)  
**Committers:** [geofjamg](https://github.com/geofjamg), [sylvlecl](https://github.com/sylvlecl)

### powsybl-incubator
This [repository](https://github.com/powsybl/powsybl-incubator) provides incubating modules that are not mature enough to be released.

**Reviewers:** all the committers

### powsybl-parent [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-parent.svg)](https://github.com/powsybl/powsybl-parent/releases/)
This [repository](https://github.com/powsybl/powsybl-parent) provides the build configuration shared as maven pom files, shared by all our Java repositories.

**Reviewers:** [jonenst](https://github.com/jonenst), [mathbagu](https://github.com/mathbagu)
**Release:** [jonenst](https://github.com/jonenst), [mathbagu](https://github.com/mathbagu)

### powsybl-tutorials
This [repositories](https://github.com/powsybl/powsybl-tutorials) contains the source code of the different [tutorials](../tutorials/index.md) presented on this website.

**Reviewers:** [annetill](https://github.com/annetill)

## Community

### .github
This [repository](https://github.com/powsybl/.github) contains documents to explain how the PowSyBl organization works (code of conduct, maintainers, contributing) It also provides the templates for the issues, the pull requests. These documents are shared by all the repositories.

**Commiters:** [annetill](https://github.com/annetill)

### powsybl.github.io
This [repository](https://github.com/powsybl/powsybl.github.io) contains the source code of the PowSyBl's website.

**Committers:** all the [committers](../../../overview/governance.md#members)

