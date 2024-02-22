---
layout: default
---

# Overview

[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/4795/badge)](https://bestpractices.coreinfrastructure.org/projects/4795)
[![Actions Status](https://github.com/powsybl/powsybl-core/workflows/CI/badge.svg)](https://github.com/powsybl/powsybl-core/actions)
[![Coverage Status](https://sonarcloud.io/api/project_badges/measure?project=com.powsybl%3Apowsybl-core&metric=coverage)](https://sonarcloud.io/component_measures?id=com.powsybl%3Apowsybl-core&metric=coverage)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=com.powsybl%3Apowsybl-core&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.powsybl%3Apowsybl-core)
[![MPL-2.0 License](https://img.shields.io/badge/license-MPL_2.0-blue.svg)](https://www.mozilla.org/en-US/MPL/2.0/)
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/powsybl)
[![Slack](https://img.shields.io/badge/slack-powsybl-blueviolet.svg?logo=slack)](https://join.slack.com/t/powsybl/shared_invite/zt-rzvbuzjk-nxi0boim1RKPS5PjieI0rA)
[![Javadocs](https://www.javadoc.io/badge/com.powsybl/powsybl-core.svg?color=blue)](https://www.javadoc.io/doc/com.powsybl/powsybl-core)

PowSyBl (<b>Pow</b>er <b>Sy</b>stem <b>Bl</b>ocks) is an open source framework written in Java,
dedicated to electrical grid modelling and simulation, licensed under the [Mozilla Public License version 2.0](./license). 
It is part of [LF Energy](https://www.lfenergy.org/), an open source foundation focused on the power systems sector, hosted within The Linux Foundation. 

The power system blocks may be used through Python scripts for a quick implementation (or prototyping), but also be assembled to build state-of-the-art applications.
Indeed, one major aim of the project is to make it easy to write complex software for power 
system simulation and analysis. For example, using PowSyBl one can create applications able to:
- handle a variety of formats, such as CIM-CGMES for European data exchanges,
- perform power flow simulations, security analyses and sensitivity analyses on the network,
- perform dynamic simulations on the network,
- create visual representations of the network,
- etc.

Another key characteristic of PowSyBl is its modular design, at the core of the open source approach.
It enables developers to extend or customize its features by providing their own plugins.

Check the [Getting started](../documentation/user) and [Configuration](../documentation/user/configuration) pages to learn how to install and configure PowSyBl.

# Features
PowSyBl provides a complete [internal grid model](../documentation/grid/formats/xiidm.md) 
with substations, voltage levels, AC and DC lines, two and three windings transformers, batteries,
generators, loads, shunt and static VAR compensators, etc. The grid model can also be enhanced with extensions that complete the equipment modeling
(short-circuit profile, measurements, position information, etc.).

![Node breaker topology](img/index/nodeBreakerTopology.svg){: width="50%" .center-image}

PowSyBl also provides [importers and exporters](../documentation/index.html#grid-formats)
for several common pan-european exchange formats (Entso-E CIM/CGMES, UCTE-DEF, etc.).

PowSyBl as a library provides several APIs for power systems’ simulation and analysis 
([power flows](../documentation/simulation/powerflow/index.md), 
[security analysis](../documentation/simulation/securityanalysis/index.md), 
[sensitivity analysis](../documentation/simulation/sensitivity/index.md),
[time domain simulation](../documentation/simulation/timedomain/index.md), etc.). 
These simulations can run either on a personal computer or on a server, but they can 
also run on a supercomputer like in the iTesla project with the Curie supercomputer. 
The separation of the simulation API and the implementations allows developers to 
provide their own implementations if necessary, which makes the framework very flexible.

PowSyBl enables users to display [network graph diagrams and single-line diagrams](https://github.com/powsybl/powsybl-diagram#readme) of a network in a highly customizable way.

The [PyPowSyBl](https://pypowsybl.readthedocs.io/en/latest/index.html) project gives access to PowSyBl framework to Python developers. This Python integration relies on GraalVM to compile Java code to a native library.

All PowSyBl features are exposed as [web services](../documentation/index.html#microservices), to make it easy to build web-based 
applications on top of the framework. As an example of integration, please visit the web-site of [GridSuite](https://www.gridsuite.org/).  

# Projects

![GitHub logo](img/index/github-logo.png){: width="30%" .center-image}

## Release train Java libraries

- [powsybl-core](powsybl-core.md) provides the core feature of the PowSyBl framework such as the grid modelling, network extensions, the support of several data exchange formats (CIM-CGMES, UCTE, Matpower, PSSE, PowerFactory...), computation APIs (load flow, security analysis, sensitivity analysis, dynamic simulation...), time series, etc.

- [powsybl-open-loadflow](powsybl-open-loadflow.md) provides an implementation of the LoadFlow, the security analysis and the sensitivity analysis APIs based on the [powsybl-math-native](powsybl-math-native.md) project.

- [powsybl-dynawo](powsybl-dynawo.md) provides an implementation of the dynamic simulation API for the [Dyna&omega;o](https://dynawo.github.io/) time domain simulation tool.

- [powsybl-diagram](powsybl-diagram.md) provides modules to generate single-line diagrams and network graph diagrams. 

- [powsybl-entsoe](powsybl-entsoe.md) provides components specific for ENTSO-E-orientated processes, such as Generator and Load Shift Keys (GLSK) importers, control areas, balances adjustment, etc. 

- [powsybl-open-rao](powsybl-open-rao.md) provides a modular engine for remedial actions optimization.

## Pypowsybl

[Pypowsybl](pypowsybl.md) provides an GraalVM integration of some PowSyBl Java libraries for Python developers. The [PyPowSyBl’s user documentation](https://pypowsybl.readthedocs.io/en/latest/index.html) details the integrated features.



