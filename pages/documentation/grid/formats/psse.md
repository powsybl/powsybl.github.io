---
layout: default
---

# PSS®E
[PSS®E software](https://new.siemens.com/global/en/products/energy/energy-automation-and-smart-grid/pss-software/pss-e.html) from Siemens provides analysis functions for power system networks in steady-state and dynamic conditions. PSS®E uses different types of files to exchange data about the network. One of them is the RAW file (power flow data file). A PSS®E RAW file contains a collection of unprocessed data that specifies a Bus/Branch network model for the establishment of a power flow working case.

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

```json
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

First, input data is obtained by reading and parsing the input file and as result a PSS®E model is created in memory. This model can be viewed as a set of Java classes where each data block of the PSS®E model is associated with a specific Java class that describes all their attributes or data items. Then, some inconsistency checks are performed on this model. If the validation succeeds the PSS®E model is converted to a PowSyBl grid model.

### Options
Parameters for the import can be defined in the configuration file in the [import-export-parameters-default-value](../../user/configuration/import-export-parameters-default-value.md) module.

**psse.import.ignore-base-voltage**  
The `psse.import.ignore-base-voltage` property is an optional property that defines if the importer should ignore the base voltage information present in the PSS®E file. The default value is `false`.

### Inconsistency checks
-<span style="color: red">TODO</span>

### Conversion. General description

A PSS®E file specifies a Bus/Branch network model where typically there is a bus for each voltage level inside a substation and where the concept of substation is usually not defined. (Since version 35 PSS®E provides a substation data block, but it is optional and it may not be defined in the case). On the other side, the IIDM model is a hierarchical network model where the voltage levels and the network components, except transmission lines, are defined indoor substations so the first step in the conversion process is to define a substation for each PSS®E bus ensuring that all transformer buses are inside the same substation. 

The current conversion version does not support PSS®E substation information so, in all the network cases, a fictitious voltage level and a fictitious substation are created for each bus. Before creating them, buses are grouped using zero impedance branches and transformers as connectors. A voltage level is assigned to each group of buses connected by zero impedance branches and a substation to every group of buses connected by zero impedance branches and transformers. 

In the IIDM model all the network components are identified through a global and unique alphanumeric identifier (**Id**) and optionally by a human readable identifier (**Name**).

For each substation the following attributes are defined:
  - **Id** following the pattern `Sn` where `n` represents a consecutive integer number starting from 1.
  
Every voltage level is assigned to it's corresponding substation and its attributes are:
  - **Id** following the pattern `VLn` where `n` represents the minimum PSS®E bus number included inside of the voltage level (`BusData.I`, Bus Data record, I attribute or field name).
  - **NominalV** Nominal voltage of the voltage level. Forced to `1` if `psse.import.ignore-base-voltage` property is true, otherwise it is assigned to the base voltage of the representative bus, `BusData.BASKV` field name. Entered in kV.
  - **TopologyKind** Topology level assigned to the network model, must be BUS_BREAKER.
  

### BusData to Buses Conversion

There is a one-to-one correspondence between the PSS®E BusData block and the buses of the IIDM network model. For each record of the BusData block an IIDM bus is created and assigned to it's corresponding voltage level with the following attributes:
- **Id** according to the pattern `Bn` where `n` represents the bus number (`BusData.I`).
- **Name** As human readable identifier the alphanumeric identifier of the PSS®E bus is assigned (`BusData.NAME`).
- **V** Voltage of the PSS®E solved case defined as the bus voltage magnitude (`BusData.VM`) multiply by the nominal voltage of the associated voltage level previously defined. Entered in kV.
- **Angle** Phase angle of the solved case defined as the bus voltage phase angle (`BusData.VA`). Entered in degrees.


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
