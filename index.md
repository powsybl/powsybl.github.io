---
title: Power System Blocks
layout: default
---

Powsybl (**Pow**er **Sy**stem **Bl**ocks) is an open-source Java framework hosted on [GitHub](https://github.com/powsybl), distributed under the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

# Architecture
Powsybl is designed in a modular approach, to allow projects using the framework to extend its features or to modify the default behaviours.

# Features

## Grid data model
Powsybl provides a set of Java classes to describe a grid model (substations, voltage levels, lines, two and three windings transformers, generators...) named IIDM (**i**Tesla **I**nternal **D**ata **M**odel). The grid model can be extended with plugins to add additional data to the network equipments.

The IIDM data model can be loaded from or exported to an XML file, or loaded from an [UCTE-DEF](http://cimug.ucaiug.org/Groups/Model%20Exchange/UCTE-format.pdf) or an [Entso-E CGMES](https://www.entsoe.eu/digital/common-information-model/cim-for-grid-models-exchange/) file.

## Application File System
AFS (**A**pplication **F**ile**S**ystem) is a system used to organize your business data and store them, like a file system does for plain files. AFS can be extended with plugins to support additional data types. The framework provides plugins implementation to handle:
- network models
- scripts to modify network models
- contingencies
- timeseries

Read the [getting started](https://github.com/powsybl/powsybl-core/blob/master/afs/README.md) guide to learn how to use AFS in your application.

## Grid Study Environment
GSE (**G**rid **S**tudy **E**nvironment) is a JavaFX UI for the Powsybl framework. It relies on AFS and can also be extended with plugins.

## High performance computing
Powsybl is able to perform computation on a single computer (mono or multi-thread) or to distribute a computation over a huge cluster of computation nodes, by submitting jobs to a SLURM workload manager.

## Scripting
All powsybl features are available for scripting in groovy without any limitations:
- use the `run-script` itools command to run a complete script
- use `powsyblsh` - a groovy shell based tool - to run a script in an interactive console
