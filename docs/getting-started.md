---
title: Getting started
category: Getting started
---

Powsybl (Power system blocks) is an open source framework written in Java, that makes it easy to write complex software for power systems' simulations and analysis. Its modular approach allows developers to extend or customize its features.

Powsybl is part of the [LF Energy Foundation](http://www.lfenergy.org), a project of The Linux Foundation that supports open source innovation projects within the energy and electricity sectors. Powsybl in an open source framework licensed under the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

# Features

Powsybl provides an internal complete grid model with substations, voltage levels, AC and DC lines,
two and three windings transformers, batteries, generators, loads, shunt and static VAR compensators, etc. The grid model can be
extended with extensions to complete the modelling of the equipments (dynamic profile, short-circuit profile, monitoring, etc.). It also provides importers and exporters for several common pan-european exchange formats ([Entso-E CIM/CGMES](https://www.entsoe.eu/digital/common-information-model/cim-for-grid-models-exchange/), [UCTE-DEF](https://cimug.ucaiug.org/Groups/Model%20Exchange/UCTE-format.pdf), etc.).

Powsybl library provides several API for power systems' simulations and analysis (power flow computations, security analysis,
remedial action simulations, short circuits computations, sensitivity computations, time domain simulations...). These
simulations can run either on a personal computer or on a server, but they can also run on a supercomputer like in the
[iTesla](http://www.itesla-project.eu) project with [Curie](http://www-hpc.cea.fr/en/complexe/tgcc-curie.htm) supercomputer.
The separation of the simulation API and the implementations allows developers to provide their own implementation.

Powsybl is also available as a command line tool or in a complete desktop application, based on the GSE (Grid Study Environment)
project. The GSE project is part of the powsybl framework. It provides a JavaFX UI to help developers writing desktop
applications based on the powsybl framework. The GSE is fully customizable and extendable with plugins. All the features
of powsybl are also exposed as web services.

# Installation

Thus, there are three different ways to package an application based on powsybl framework:

- The first one is to use powsybl as a Java library and its Maven dependencies.

- The second one aims to create a command line bundle, based on `iTools` script, using the [itools-packager-maven-plugin](installation/itools-packager.md).

- The third one aims to create a JavaFX desktop application based on the Grid Study Environment, using the [javafx-packager](installation/javafx-packager.md) to create an installable bundle for Linux (rpm or deb), Windows (exe or msi) or MacOS (pkg or dmg).

# Configuration
Most features of powsybl can be configured by editing the relative configuration's module in the configuration files.
Read this [documentation](configuration/modules/index.md) page to learn more about powsybl's configuration and have an
overview of all the existing modules.
