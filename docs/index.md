---
title: Documentation
layout: default
---

# Getting started
There are two different ways to package an application based on powsybl framework.

The first one aims to create a command line bundle, based on `iTools` script, using the [itools-packager-maven-plugin](installation/itools-packager.md).

The second one aims to create a JavaFX desktop application based on the Grid Study Environment, using the
[javafx-packager](installation/javafx-packager.md) to create an installable bundle for Linux (RPM, DEB), Windows (EXE
or MSI) or MacOS (PKG).

# Tools
The `iTools` script provides a common way to run powsybl commands using the command line. It provides several tools,
sorted by themes:

| Theme | Command | Description |
| ----- | ------- | ----------- |
| Application file system | [afs](tools/afs.md) | Application File System CLI |
| Computation | [action-simulator](tools/action-simulator.md) | Run a remedial actions simulation |
| Computation | [loadflow](tools/loadflow.md) | Run a loadflow computation |
| Computation | [loadflow-validation](tools/loadflow-validation.md) | Validate the load-flow results of a network |
| Computation | [run-impact-analysis](tools/run-impact-analysis.md) | Run an impact analysis |
| Computation | [security-analysis](tools/security-analysis.md) | Run a security analysis |
| Computation | [sensitivity-computation]() | Run a sensitivity computation |
| Data conversion | [convert-network](tools/convert-network.md) | Convert a network from one format to another |
| MPI statistics | [export-tasks-statistics]() | Export the tasks statistics to CSV file |
| Script | [run-script](tools/run-script.md) | Run a script |
| Misc | [plugins-info](tools/plugins-info.md) | Displays the available plugins |

Read this [documentation](tools/index.md) page to learn more about powsybl command line interface.
