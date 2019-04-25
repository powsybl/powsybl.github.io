---
title: AMPL Exporter
layout: default
---

The [AMPL](https://ampl.com/) (**A** **M**athematical **P**rogramming **L**anguage) format is an algebraic modeling language to describe and solve high-complexity problems for
large-scale mathematical computing (i.e. large-scale optimization and scheduling-type problems).

IIDM networks can be converted in flat text files easy to read in AMPL, each of which describing one type of the network equipments
(batteries, generators, loads, branches, buses, etc.).

# Example
```text
#Branches
#"variant" "num" "bus1" "bus2" "p1 (MW)" "p2 (MW)" "q1 (MVar)" "q2 (MVar)"
1 1 -1 -1 -100.000 -200.000 -110.000 -120.000
1 4 -1 -1 -100.000 -200.000 -110.000 -120.000
```

# Configuration properties for AMPL exporter

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../configuration/modules/import-export-parameters-default-value.md)
module.

## iidm.export.ampl.export-ratio-tap-changer-voltage-target
The `iidm.export.ampl.export-ratio-tap-changer-voltage-target` property is an optional property that defines
if the AMPL exporter exports the ratio tap changer voltage setpoint. Its default value is `false`.

# Deprecated configuration properties for AMPL exporter

## iidm.export.ampl.exportRatioTapChangerVoltageTarget
The `iidm.export.ampl.exportRatioTapChangerVoltageTarget` property is deprecated since V2.4.0. Use the
`iidm.export.ampl.export-ratio-tap-changer-voltage-target` property instead.

# Maven configuration
To support AMPL files, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-ampl-converter</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
**NB**: In order to work, the AMPL exporter also need an IIDM implementation in the `pom.xml`. Powsybl
provides one so you can simply add it:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-impl</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
