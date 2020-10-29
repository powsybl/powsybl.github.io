---
layout: default
---

# PSS/E

Power System Simulation for Engineering (PSS/E) is a set of programs for studies of power system transmission network in steady-state and dynamic conditions. PSS/E uses different types of files, one of them is the *.raw file (Power flow raw data file). A raw file is a collection of unprocessed data that specifies a bus branch network model for the establishment of a power flow working case.
The raw file consists of 20 groups of records (version 33), with each group containing a particular type of data needed in power flow. The last record of each block data is a record specifying a value of zero to indicate the end of the category (except for the Case Identification Data).

Each record data is a set of data items separated by a comma or one or more blanks where alphanumeric attributes must be enclosed in single quotes. As many of the data items specified in the Raw Data File have a default value only the specific information needed should be defined in the record.

In the version 35 the .raw file has 23 groups of records and a new .rawx file format (Extensible Power Flow Data File) based on Json has also been supported. It will become the standard text-based data format in the future. The RAWX format consist of two types of named JSON objects. These are referred to the RAWX Parameter Set, and the RAWX Data Table. Each Json object is identified by a tag name and includes a Field List and a Data Lists expressed as Json Arrays. The Field List are tag attributes and indicates the order and subset of fields for which data is provided.

A minimum network model is included as an example in version 35 of both formats RAW and RAWX.

```text
 0,      100.0, 35, 0, 0, 60.00       / October 27, 2020 18:37:53
 PSS(R)E Minimum RAW Case

0 / END OF SYSTEM-WIDE DATA, BEGIN BUS DATA
    1,'Slack-Bus   ', 138.0000,3
    2,'Load-Bus    ', 138.0000,1
0 / END OF BUS DATA, BEGIN LOAD DATA
    2,'1 ',1,,,   40.000,    15.000
0 / END OF LOAD DATA, BEGIN FIXED SHUNT DATA
0 / END OF FIXED SHUNT DATA, BEGIN GENERATOR DATA
    1,'1 ',   40.350,   10.870
0 / END OF GENERATOR DATA, BEGIN BRANCH DATA
    1,     2,'1 ', 0.01938, 0.05917,0.05280
0 / END OF BRANCH DATA, BEGIN SYSTEM SWITCHING DEVICE DATA
0 / END OF SYSTEM SWITCHING DEVICE DATA, BEGIN TRANSFORMER DATA
0 / END OF TRANSFORMER DATA, BEGIN AREA DATA
0 / END OF AREA DATA, BEGIN TWO-TERMINAL DC DATA
0 / END OF TWO-TERMINAL DC DATA, BEGIN VOLTAGE SOURCE CONVERTER DATA
0 / END OF VOLTAGE SOURCE CONVERTER DATA, BEGIN IMPEDANCE CORRECTION DATA
0 / END OF IMPEDANCE CORRECTION DATA, BEGIN MULTI-TERMINAL DC DATA
0 / END OF MULTI-TERMINAL DC DATA, BEGIN MULTI-SECTION LINE DATA
0 / END OF MULTI-SECTION LINE DATA, BEGIN ZONE DATA
0 / END OF ZONE DATA, BEGIN INTER-AREA TRANSFER DATA
0 / END OF INTER-AREA TRANSFER DATA, BEGIN OWNER DATA
0 / END OF OWNER DATA, BEGIN FACTS CONTROL DEVICE DATA
0 / END OF FACTS CONTROL DEVICE DATA, BEGIN SWITCHED SHUNT DATA
0 / END OF SWITCHED SHUNT DATA, BEGIN GNE DEVICE DATA
0 / END OF GNE DEVICE DATA, BEGIN INDUCTION MACHINE DATA
0 / END OF INDUCTION MACHINE DATA, BEGIN SUBSTATION DATA
0 / END OF SUBSTATION DATA
Q
```

```text
{
     "network":{
         "caseid":{
             "fields":["ic", "sbase", "rev", "xfrrat", "nxfrat", "basfrq", "title1"],
             "data":[0, 100.00, 35, 0, 0, 60.00, "PSS(R)E Minimum RAWX Case"]
         },
         "bus":{
             "fields":["ibus", "name", "baskv", "ide"],
             "data":[
                 [1, "Slack-Bus", 138.0, 3],
                 [2, "Load-Bus", 138.0 1]
             ]
         },
         "load":{
             "fields":["ibus", "loadid", "stat", "pl", "ql"],
             "data":[
                 [2, "1", 1, 40.0, 15.0]
             ]
         },
         "generator":{
             "fields":["ibus", "machid", "pg", "qg"],
             "data":[
                 [1, "1", "40.35", "10.87"]
             ]
         },
         "acline":{
             "fields":["ibus", "jbus", "ckt", "rpu", "xpu", "bpu"],
             "data":[
                 [1, 2, "1", 0.01938, 0.05917, 0.05280]
             ]
         }
    }
}
```

## Import

The import package allows for the import and conversion of a PSS/E file into an IIDM grid model. The current implementation supports RAW format for versions 33 and 35 and RAWX format for version 35. Import process is done in three steps:
- Read input file.
- Validate input data.
- Convert input data into IIDM.

First, input data is obtained by reading and parsing the input file and as result a PSS/E model is created in memory. This model can be envisioned as a set of java classes where each category block of the PSS/E model is associated with a specific java class that describes all their attributes or data items. Then, some inconsistency checks are performed on this model and finally, only if the validation succeeded the PSS/E grid model is converted into an IIDM grid model.

### Options
These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../user/configuration/import-export-parameters-default-value.md) module.

**psse.import.ignore-base-voltage**  
The `psse.import.ignore-base-voltage` property is an optional property that defines if the importer should ignore the base voltage information present in the PSS/E file. The default value is `false`.

### Inconsistency checks
-<span style="color: red">TODO</span>

### Conversion, General description
-<span style="color: red">TODO</span>

### BusData to Buses Conversion
-<span style="color: red">TODO</span>

### LoadData to Loads Conversion
-<span style="color: red">TODO</span>

### FixedBusShuntData to Linear Shunt Compensators Conversion
-<span style="color: red">TODO</span>

### SwitchedShuntData to Non-Linear Shunt Compensators Conversion
-<span style="color: red">TODO</span>

### GeneratorData to Generators Conversion
-<span style="color: red">TODO</span>

### Non-TransformerBranchData to Lines Conversion
-<span style="color: red">TODO</span>

### TransformerData to TwoWindings and ThreeWindings Transformers Conversion
-<span style="color: red">TODO</span>

### Slack Conversion
-<span style="color: red">TODO</span>

## Export

The export of network into the PSS/E format is not supported.
