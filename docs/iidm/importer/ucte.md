---
title: UCTE-DEF Importer
layout: default
---

The UCTE-DEF (UCTE **D**ata **F**ormat **E**xchange) format is the format used by UCTE TSOs to exchange grid models for
load flow and three phase short circuit studies. The data are contained in an unformatted standard US ASCII, organized in
several sections:
- C : comments
- N : nodes
- L : lines
- T : two windings transformers
- R : two windings transformers regulation
- TT : 2 windings transformers special description (optional)
- E : exchange powers (optional)

To learn more about UCTE-DEF files, read the complete [UCTE-DEF format specification](https://cimug.ucaiug.org/Groups/Model%20Exchange/UCTE-format.pdf).

The UCTE importer support files with the following extensions: `*.uct` and `*.UCT`

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
**NB**: In order to work, the UCTE importer also need an IIDM implementation in the `pom.xml`. Powsybl
provides one so you can simply add it:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-impl</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```