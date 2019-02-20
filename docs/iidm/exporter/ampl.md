---
title: AMPL Exporter
layout: default
---

The [AMPL](https://ampl.com/) (**A** **M**athematical **P**rogramming **L**anguage) format is an algebraic modeling language to describe and solve high-complexity problems for
large-scale mathematical computing (i.e. large-scale optimization and scheduling-type problems).

IIDM networks can be converted in several AMPL files, each of which describing one type of the network equipments
(generators, loads, branches, buses, etc.).

# Configuration properties for AMPL exporter

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../configuration/modules/import-export-parameters-default-value.md)
module.

## iidm.export.ampl.export-ratio-tap-changer-voltage-target
The `iidm.export.ampl.export-ratio-tap-changer-voltage-target` property is an optional property that defines
if the AMPL exporter exports the ratio tap changer voltage target. Its default value is `false`.

## iidm.export.ampl.specific-compatibility
The `iidm.export.xml.specific-compatibility` property is an optional property that defines if the AMPL exporter
is using specific compatibility or not. Its default value is `false`.

## iidm.export.ampl.exportRatioTapChangerVoltageTarget (deprecated)
The `iidm.export.ampl.exportRatioTapChangerVoltageTarget` property is deprecated for the current snapshot version. Use the
`iidm.export.ampl.export-ratio-tap-changer-voltage-target` property instead.

## iidm.export.ampl.specificCompatibility (deprecated)
The `iidm.export.ampl.specificCompatibility` property is deprecated for the current snapshot version. Use the
`iidm.export.ampl.specific-compatibility` property instead.

# Example
```text
#Branches
#"variant" "num" "bus1" "bus2" "p1 (MW)" "p2 (MW)" "q1 (MVar)" "q2 (MVar)"
1 1 -1 -1 -100.000 -200.000 -110.000 -120.000
1 4 -1 -1 -100.000 -200.000 -110.000 -120.000
```

# Maven configuration
To support AMPL files, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-ampl-converter</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```