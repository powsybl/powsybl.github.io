---
title: Functional documentation
category: Functional documentation
---

# IIDM
IIDM (iTesla Internal Data Model) is a set of classes that models a complete grid model. IIDM modules are a part of the
most important powsybl modules. Read this page to learn more about the [IIDM](iidm/model/index.md). IIDM networks can be
[loaded](iidm/importer/iidm.md) or [saved](iidm/exporter/iidm.md) to XML files without any data loss.

IIDM networks can also be created from various formats such as [UCTE-DEF](iidm/importer/ucte.md)
or [Entso-E CGMES](iidm/importer/cgmes.md) and be exported to various formats. Read the [importer](iidm/importer/index.md)
and the [exporter](iidm/exporter/index.md) documentation pages to learn more about import/export features.

Powsybl also provides business features to work with networks:
- [network reduction](iidm/reducer/index.md) to extract a sub part of a network

# Simulators
Using powsybl, we would be able to run different kind of simulations:
- [loadflows](todo.md)
- [security analysis](loadflow/security-analysis.md)
- [sensitivity calculation](sensitivity/index.md)

# AFS
Read this page to learn more about the [application file system](afs/index.md).

# Time series

Read this page to learn more about the [time series](timeseries/index.md) modeling in powsybl.