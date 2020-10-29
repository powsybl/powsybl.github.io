---
layout: default
---

# PSS®E
[PSS®E software](https://new.siemens.com/global/en/products/energy/energy-automation-and-smart-grid/pss-software/pss-e.html) from Siemens provides analysis functions for power system networks in steady-state and dynamic conditions. PSS®E uses different types of files to exchange data about the network. One of them is the RAW file (power flow data file). A PSS®E RAW file contains a collection of unprocessed data that specifies a bus branch network model for the establishment of a power flow working case.

The RAW file has multiple groups of records (data blocks), with each group containing a particular type of data needed in power flow. The last record of each data block is a record specifying a value of zero to indicate the end of the category.

Each record in a data block contains a set of data items separated by a comma or one or more blanks where alphanumeric attributes must be enclosed in single quotes. As many of the data items specified in the RAW file have a default value only the specific information needed should be defined in the record.

In PSS®E version 35 a new RAWX file format (Extensible Power Flow Data File) based on JSON has been introduced. It will be the standard text-based data format for PSS®E power flow data exchange. The RAWX files contain two types of data objects: Parameter Sets and Data Tables. A Parameter Set has an array with field names and a single array with field values. A Data Table has an array with field names an and array of records, each record being an array of field values. The field names array indicates the order and subset of fields for which data is provided in the data arrays.

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
The import module reads and converts a PSS®E power flow data file to the PowSyBl grid model. The current implementation supports RAW format for versions 33 and 35 and RAWX format for version 35. The import process is performed in three steps:
- Read input file.
- Validate input data.
- Convert input data into PowSyBl grid model.

First, input data is obtained by reading and parsing the input file and as result a PS®SE model is created in memory. This model can be viewed as a set of Java classes where each data block of the PSS®E model is associated with a specific Java class that describes all their attributes or data items. Then, some inconsistency checks are performed on this model. If the validation succeeds the PSS®E model is converted to a PowSyBl grid model.

### Options
Parameters for the import can be defined in the configuration file in the [import-export-parameters-default-value](../../user/configuration/import-export-parameters-default-value.md) module.

**psse.import.ignore-base-voltage**  
The `psse.import.ignore-base-voltage` property is an optional property that defines if the importer should ignore the base voltage information present in the PSS®E file. The default value is `false`.

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
