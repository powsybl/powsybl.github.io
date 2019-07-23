---
title:
layout: default
---

Powsybl (**Pow**er **Sy**stem **Bl**ocks) is an open source framework written in Java, that makes it easy to write
complex software for power systems' simulations and analysis. Its modular approach allows developers to extend or customize
its features.

Powsybl is part of the [LF Energy Foundation](http://www.lfenergy.org), a project of The Linux Foundation that supports
open source innovation projects within the energy and electricity sectors.

# Open source
Powsybl in an open source framework licensed under the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/).
The source code is hosted on GitHub in two different repositories:
- [powsybl-core](https://github.com/powsybl/powsybl-core) contains all the core features
- [powsybl-gse](https://github.com/powsybl/powsybl-gse) contains the JavaFX UI

# Features
Powsybl provides IIDM (iTesla Internal Data Model), a complete grid model (substations, voltage levels, AC and DC lines,
two and three windings transformers, batteries, generators, loads, shunt and static VAR compensators...). The grid model can be
extended with extensions to complete the modelling of the equipments. It also provides importers and exporters for several
common exchange formats ([Entso-E CIM/CGMES](https://www.entsoe.eu/digital/common-information-model/cim-for-grid-models-exchange/),
[UCTE-DEF](https://cimug.ucaiug.org/Groups/Model%20Exchange/UCTE-format.pdf)...).

Powsybl provides several API for power systems' simulations and analysis (power flow computations, security analysis,
remedial action simulations, short circuits computations, sensitivity computations, time domain simulations...). These
simulations can run either on a personal computer or on a server, but they can also run on a supercomputer like in the
[iTesla](http://www.itesla-project.eu) project with [Curie](http://www-hpc.cea.fr/en/complexe/tgcc-curie.htm) supercomputer.
The separation of the simulation API and the implementations allows developers to provide their own implementation.

Powsybl is available as a command line tool or in a complete desktop application, based on the GSE (Grid Study Environment)
project. The GSE project is part of the powsybl framework. It provides a JavaFX UI to help developers writing desktop
applications based on the powsybl framework. The GSE is fully customizable and extendable with plugins. All the features
of powsybl are also exposed as web services.

# Tutorials and user stories

- [Load flow tutorial](docs/user_stories/loadflow_tutorial.md)
- [Network security for TSOs](docs/user_stories/security_tso.md)
- [Capacity calculation for RSCs](docs/user_stories/capacity_calculation_rsc.md)
- [Network development for TSOs](docs/user_stories/network_development_tso.md)
