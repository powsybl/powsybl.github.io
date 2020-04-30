# Repositories

This page shortly describe each repository of the [PowSyBl organization](https://github.com/powsybl), their maintainers.

## .github
This [repository](https://github.com/powsybl/.github) contains documents to explain how the PowSyBl organization works (code of conduct, maintainers, contributing) It also provides the templates for the issues, the pull requests. These documents are shared by all the repositories.

**Commiters:** [annetill](https://github.com/annetill)

## powsybl.github.io
This [repository](https://github.com/powsybl/powsybl.github.io) contains the source code of the PowSyBl's website.

**Committers:** all the [committers](../../../overview/governance.md#members)

## powsybl-afs [![v3.2.0](https://img.shields.io/badge/-v3.2.0-blue.svg)](https://github.com/powsybl/powsybl-afs/releases/tag/v3.2.0)
This [repository](https://github.com/powsybl/powsybl-afs) provides a standardize way to organize the data for a power system study, called AFS (**A**pplication **F**ile **S**ystem). It supports several storage system such as [MapDB](http://www.mapdb.org) or [Apache Cassandra](https://cassandra.apache.org). It is designed to be extensible using custom plugins to manage new types of data.

**Reviewers:** [pl-buiquang](https://github.com/pl-buiquang), [geofjamg](https://github.com/geofjamg)
**Committers:** [pl-buiquang](https://github.com/pl-buiquang), [mathbagu](https://github.com/mathbagu), [MioRtia](https://github.com/MioRtia)

## powsybl-balances-adjustment [![v1.0.0](https://img.shields.io/badge/-v1.0.0-blue.svg)](https://github.com/powsybl/powsybl-balances-adjustment/releases/tag/v1.0.0)
This [repository](https://github.com/powsybl/powsybl-balances-adjustment) provides a functional module to reach target net positions, through an iterative process based on power flow computations and injections scaling.

**Reviewers:** [murgeyseb](https://github.com/murgeyseb)
**Committers:** [murgeyseb](https://github.com/murgeyseb)

## powsybl-case
This [repository](https://github.com/powsybl/powsybl-case) provides a web service for network cases management.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)

## powsybl-cgmes-gl
This [repository](https://github.com/powsybl/powsybl-cgmes-gl) provides modules to support the [CGMES](https://www.entsoe.eu/digital/common-information-model/cim-for-grid-models-exchange/) Geographical Location Profile  as well as a web service.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)

## powsybl-core [![v3.2.0](https://img.shields.io/badge/-v3.2.0-blue.svg)](https://github.com/powsybl/powsybl-core/releases/tag/v3.2.0)
This [repository](https://github.com/powsybl/powsybl-core) provides the core feature of the PowSyBl framework such as the grid modelling, the support of several data exchange format (CGMES, UCTE...), computation APIs (power flow, security analysis, sensitivity computation, dynamic simulation...).

**Reviewers:** [annetill](https://github.com/annetill), [mathbagu](https://github.com/mathbagu), [MioRtia](https://github.com/MioRtia), [zamarrenolm](https://github.com/zamarrenolm)
**Committers:** [mathbagu](https://github.com/mathbagu), [MioRtia](https://github.com/MioRtia)

## powsybl-dynawo
This [repository](https://github.com/powsybl/powsybl-dynawo) provides an implementation of the dynamic simulation API for the [Dyna&omega;o](https://dynawo.github.io/) time domain simulation tool.

**Reviewers:** [agnesLeroy](https://github.com/agnesLeroy), [mathbagu](https://github.com/mathbagu), [zamarrenolm](https://github.com/zamarrenolm)
**Committers** [mathbagu](https://github.com/mathbagu)

## powsybl-geo-data
This [repository](https://github.com/powsybl/powsybl-geo-data) provides modules to manage geographical data such as substation or lines location as well as a web service.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)

## powsybl-hpc [![v2.9.0](https://img.shields.io/badge/-v2.9.0-blue.svg)](https://github.com/powsybl/powsybl-hpc/releases/tag/v2.9.0)
This [repository](https://github.com/powsybl/powsybl-hpc) provides two implementations of the Computation API, to distribute the computation using [MPI](https://www.open-mpi.org) or [Slurm Workload Manager](https://slurm.schedmd.com).

**Reviewers:** [sylvlecl](https://github.com/sylvlecl) (Slurm), [geofjamg](https://github.com/geofjamg) (MPI)
**Committers:** [sylvlecl](https://github.com/sylvlecl)

## powsybl-incubator
This [repository](https://github.com/powsybl/powsybl-incubator) provides incubating modules that are not mature enough to be released.

**Reviewers:** all the committers

## powsybl-iidm4cpp [![v1.0.0](https://img.shields.io/badge/-v1.0.0-blue.svg)](https://github.com/powsybl/powsybl-dynawo/releases/tag/v1.0.0)
This [repository](https://github.com/powsybl/powsybl-iidm4cpp) provides a C++ implementation of the IIDM grid model.

**Reviewers:** [mathbagu](https://github.com/mathbagu)
**Committers:** [mathbagu](https://github.com/mathbagu)

## powsybl-math-native [![v1.0.2](https://img.shields.io/badge/-v1.0.2-blue.svg)](https://github.com/powsybl/powsybl-math-native/releases/tag/v1.0.2)
This [repository](https://github.com/powsybl/powsybl-math-native) provides a C++ implementation of sparse matrix, based on the [SuiteSparse](http://faculty.cse.tamu.edu/davis/suitesparse.html) project. This 64-bits libraries for Linux, Windows and MacOS are packaged as a Jar file and published on maven central.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [mathbagu](https://github.com/mathbagu)
**Committers:** [geofjamg](https://github.com/geofjamg), [mathbagu](https://github.com/mathbagu)

## powsybl-network-conversion-server
This [repository](https://github.com/powsybl/powsybl-network-conversion-server) provides a web service that exposes conversion functions.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)

## powsybl-network-map-server
This [repository](https://github.com/powsybl/powsybl-network-map-server) provides a web service for the generation of geographical data in order to draw a network on a map.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)

## powsybl-network-store
This [repository](https://github.com/powsybl/powsybl-network-store) provides a persistent implementation of the IIDM grid model in [Apache Cassandra](https://cassandra.apache.org) database. The grid model is exposed as a web service.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)

## powsybl-open-loadflow [![v0.2.0](https://img.shields.io/badge/-v0.2.0-blue.svg)](https://github.com/powsybl/powsybl-open-loadflow/releases/tag/v0.2.0)
This [repository](https://github.com/powsybl/powsybl-open-loadflow) provides an implementation of the LoadFlow API based on the [powsybl-math-native](#powsybl-math-native) project.

**Reviewers:** [geofjamg](https://github.com/geofjamg)
**Release:** [geofjamg](https://github.com/geofjamg), [mathbagu](https://github.com/mathbagu)

## powsybl-parent [![v3](https://img.shields.io/badge/-v3-blue.svg)](https://github.com/powsybl/powsybl-math-native/releases/tag/v3)
This [repository](https://github.com/powsybl/powsybl-parent) provides the build configuration shared as maven pom files, shared by all our Java repositories.

**Reviewers:** [jonenst](https://github.com/jonenst), [mathbagu](https://github.com/mathbagu)
- Release: [jonenst](https://github.com/jonenst), [mathbagu](https://github.com/mathbagu)

## powsybl-single-line-diagram [![v1.2.0](https://img.shields.io/badge/-v1.2.0-blue.svg)](https://github.com/powsybl/powsybl-single-line-diagram/releases/tag/v1.2.0)
This [repository](https://github.com/powsybl/powsybl-single-line-diagram) provides modules to generate single line diagrams.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)

## powsybl-single-line-diagram-server
This [repository](https://github.com/powsybl/powsybl-single-line-diagram-server) provides a web service to generate single line diagrams.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)
**Committers:** [geofjamg](https://github.com/geofjamg), [jonenst](https://github.com/jonenst)

## powsybl-tutorials
This [repositories](https://github.com/powsybl/powsybl-tutorials) contains the source code of the different [tutorials]() presented on this website.

**Reviewers:** [annetill](https://github.com/annetill)




