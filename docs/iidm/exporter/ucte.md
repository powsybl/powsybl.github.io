---
title: UCTE-DEF Exporter
layout: default
---

The UCTE-DEF (UCTE **D**ata **F**ormat **E**xchange) format is the format used by UCTE TSOs to exchange grid models for
load-flow and three-phase short-circuit studies. The data is contained in an unformatted standard US ASCII file, organized in
several sections:
- C : comments
- N : nodes
- L : lines
- T : two windings transformers
- R : two windings transformers regulation
- TT : 2 windings transformers special description (optional)
- E : exchange powers (optional)

To learn more about UCTE-DEF files, read the complete [UCTE-DEF format specification](https://cimug.ucaiug.org/Groups/Model%20Exchange/UCTE-format.pdf).

The UCTE exporter generate files with a `*.uct` extension.`

# Example
```
##C 2007.05.01
This is an example of UCTE-DEF file
##N
##ZXX
XXNODE11              1 0      0       0       0       0       0       0       0       0       0     0       0       0
XXNODE21              1 0      0       0       0       0       0       0       0       0       0     0       0       0
##ZFR
FRNODE11              0 0      0     100       0       0       0       0       0       0       0     0       0       0
##ZES
ESNODE11              0 0    400       0       0    -100       0       0    -200     200    -200     0       0       0
##L
FRNODE11 XXNODE11 1 0      2     10       65    200 INTERCO FR
ESNODE11 XXNODE21 1 0      2     10       65    200 DANGLING XNODE
ESNODE11 XXNODE11 1 0      2     10       65    200 INTERCO ES
```

# Configuration properties for the IIDM-XML exporter

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../configuration/modules/import-export-parameters-default-value.md)
module.

## ucte.export.naming-strategy
The `ucte.export.naming-strategy` property is an optional property that defines the naming strategy to be used for UCTE export.

Its default value is `Default`, which corresponds to an implementation that expects the network elements' ID to be totally compatible with UCTE-DEF
norm (e.g. a network initially imported from a UCTE-DEF file), and throws an exception if any network element does not respect the norm.
It does not do any ID modification.

# Maven configuration
To support UCTE-DEF files, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-ucte-converter</artifactId>
    <version>${powsybl.version}</version>
</dependency>
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-ucte-network</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
**NB**: In order to work, the UCTE exporter also need an IIDM implementation in the `pom.xml`. Powsybl
provides one so you can simply add it:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-impl</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
