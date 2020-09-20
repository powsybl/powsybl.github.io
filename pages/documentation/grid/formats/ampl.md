---
layout: default
---

# AMPL

The [AMPL](https://ampl.com/) (**A** **M**athematical **P**rogramming **L**anguage) format is an algebraic modeling language to describe and solve high-complexity problems for large-scale mathematical computing (i.e. large-scale optimization and scheduling-type problems).

IIDM networks can be converted in flat text files easy to read in AMPL, each of which describing one type of the network equipments (batteries, generators, loads, branches, buses, etc.).

## Export
<span style="color: red">TODO</span>

### Options

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../user/configuration/import-export-parameters-default-value.md) module.

**iidm.export.ampl.export-ratio-tap-changer-voltage-target**  
The `iidm.export.ampl.export-ratio-tap-changer-voltage-target` property is an optional property that defines whether the AMPL exporter exports the ratio tap changer voltage setpoint or not. Its default value is `false`.

#### Deprecated properties

**iidm.export.ampl.exportRatioTapChangerVoltageTarget**  
The `iidm.export.ampl.exportRatioTapChangerVoltageTarget` property is deprecated since V2.4.0. Use the `iidm.export.ampl.export-ratio-tap-changer-voltage-target` property instead.

## Example
```text
#Branches
#"variant" "num" "bus1" "bus2" "p1 (MW)" "p2 (MW)" "q1 (MVar)" "q2 (MVar)"
1 1 -1 -1 -100.000 -200.000 -110.000 -120.000
1 4 -1 -1 -100.000 -200.000 -110.000 -120.000
```
