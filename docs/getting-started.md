---
title: Getting started
category: Getting started
---

Powsybl (Power system blocks) is an open source framework written in Java, that makes it easy to write complex software for power systems' simulations and analysis. Its modular approach allows developers to extend or customize its features.

Powsybl is part of the [LF Energy Foundation](http://www.lfenergy.org), a project of The Linux Foundation that supports open source innovation projects within the energy and electricity sectors. Powsybl in an open source framework licensed under the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

# Features

Powsybl provides an internal complete grid model with substations, voltage levels, AC and DC lines,
two and three windings transformers, batteries, generators, loads, shunt and static VAR compensators, etc. The grid model can be
enhanced with extensions that complete the equipments modeling (dynamic profile, short-circuit profile, monitoring, etc.). It also provides importers and exporters for several common pan-european exchange formats ([Entso-E CIM/CGMES](https://www.entsoe.eu/digital/common-information-model/cim-for-grid-models-exchange/), [UCTE-DEF](https://cimug.ucaiug.org/Groups/Model%20Exchange/UCTE-format.pdf), etc.).

Powsybl as a library provides several APIs for power systems' simulations and analyses (power flow computations, security analyses,
remedial action simulations, short circuits computations, sensitivity computations, time domain simulations...). These
simulations can run either on a personal computer or on a server, but they can also run on a supercomputer like in the
[iTesla](http://www.itesla-project.eu) project with the [Curie](http://www-hpc.cea.fr/en/complexe/tgcc-curie.htm) supercomputer.
The separation of the simulation API and the implementations allows developers to provide their own implementation.

Powsybl is also available as a command line tool or in a complete desktop application, based on the GSE (Grid Study Environment)
project. The GSE project is part of the Powsybl framework. It provides a JavaFX UI to help developers writing desktop
applications based on the Powsybl framework. The GSE is fully customizable and extendable with plugins. Additionally, all the features
of Powsybl are also exposed as web services.

# Installation

Thus, there are three different ways to package an application based on the Powsybl framework:

- The first one is to use Powsybl as a plain Java library to develop your own application. The Powsybl artifacts are available in Maven Central under the `com.powsybl` groupId: [Powsybl Artifacts](http://central.maven.org/maven2/com/powsybl/). Browse this site to discover which artifacts contain the functionalities you want to include in your application. The [Tutorials](tutorials/index.md) are a good start to see Powsybl used as a library.

- The second one aims to create a command line bundle, based on the `iTools` script, using the [itools-packager-maven-plugin](installation/itools-packager.md).

- The third one aims to create a JavaFX desktop application based on the Grid Study Environment, using the [javafx-packager](installation/javafx-packager.md) to create an installable bundle for Linux (rpm or deb), Windows (exe or msi) or MacOS (pkg or dmg).

# Configuration
Most features of Powsybl can be configured by editing the corresponding configuration's module in the configuration files.
Read this [documentation](configuration/modules/index.md) page to learn more about Powsybl's configuration and have an
overview of all the existing modules.
