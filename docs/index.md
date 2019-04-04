---
title: Documentation
layout: default
---

# Getting started
There are two different ways to package an application based on powsybl framework.

The first one aims to create a command line bundle, based on `iTools` script, using the [itools-packager-maven-plugin](installation/itools-packager.md).

The second one aims to create a JavaFX desktop application based on the Grid Study Environment, using the
[javafx-packager](installation/javafx-packager.md) to create an installable bundle for Linux (rpm or deb), Windows (exe
or msi) or MacOS (pkg or dmg).

# Configuration
Most features of powsybl can be configured by editing the relative configuration's module in the configuration files.
Read this [documentation](configuration/modules/index.md) page to learn more about powsybl's configuration and have an
overview of all the existing modules.

# IIDM
IIDM (iTesla Internal Data Model) is a set of classes that models a complete grid model. IIDM modules are a part of the
most important powsybl modules. Read this page to learn more about the [IIDM](iidm/model/index.md). IIDM networks can be
[loaded](iidm/importer/iidm.md) or [saved](iidm/exporter/iidm.md) to XML files without any data loss.

IIDM networks can also be created from various formats such as [UCTE-DEF](iidm/importer/ucte.md)
or [Entso-E CGMES](iidm/importer/cgmes.md) and be exported to various formats. Read the [importer](iidm/importer/index.md)
and the [exporter](iidm/exporter/index.md) documentation pages to learn more about import/export features.

Powsybl also provides business features to work with networks:
- [network reduction](iidm/reducer/index.md) to extract a sub part of a network

# Time series

Read this page to learn more about the [time series](timeseries/index.md) modeling in powsybl.

# Tools
The `iTools` script provides a common way to run powsybl commands using the command line. It provides several tools,
sorted by themes:

| Theme | Command | Description |
| ----- | ------- | ----------- |
| Application file system | [afs](tools/afs.md) | Application File System CLI |
| Computation | [action-simulator](tools/action-simulator.md) | Run a remedial actions simulation |
| Computation | [compare-security-analysis-results](tools/compare-security-analysis-results.md) | Compare security analysis results |
| Computation | [loadflow](tools/loadflow.md) | Run a loadflow computation |
| Computation | [loadflow-validation](tools/loadflow-validation.md) | Validate the load-flow results of a network |
| Computation | [run-impact-analysis](tools/run-impact-analysis.md) | Run an impact analysis |
| Computation | [security-analysis](tools/security-analysis.md) | Run a security analysis |
| Computation | [sensitivity-computation](tools/sensitivity-computation.md) | Run a sensitivity computation |
| Data conversion | [convert-network](tools/convert-network.md) | Convert a network from one format to another |
| MPI statistics | [export-tasks-statistics](todo.md) | Export the tasks statistics to CSV file |
| Script | [run-script](tools/run-script.md) | Run a script |
| Misc | [plugins-info](tools/plugins-info.md) | Displays the available plugins |

Read this [documentation](tools/index.md) page to learn more about powsybl command line interface.

# Tutorials
Powsybl is a plugin based Java framework. Most features can be customized by creating a new implementation of a service
or extended by a new extension. Read this [documentation](tutorials/index.md) page to learn more about how to extend the
features of the framework.
