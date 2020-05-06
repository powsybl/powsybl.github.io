---
layout: default
latex: true
---

# UCTE-DEF
The [**U**nion for the **C**o-ordination of **T**ransmission of **E**lectricity](https://www.ucte.org), created in 1951, coordinated the operation and development of the electricity transmission grid for the Continental European synchronously operated transmission grid, thus providing a reliable platform to all participants of the Internal Electricity Market and beyond.

In 1999, UCTE re-defined itself as an association of TSOs in the context of the Internal Energy Market. Building on its experience with recommendations, UCTE turned to make its technical standards. These standards became indispensable for the reliable international operation of the high voltage grids which are all working at one “heart beat”: the 50 Hz UCTE frequency related to the nominal balance between generation and the electricity demand of some 500 million people in one of the biggest electrical synchronous interconnections worldwide.

On 1 July 2009 UCTE was wound up. All operational tasks were transferred to ENTSO-E.

## Format specifications
The [UCTE-DEF](https://cimug.ucaiug.org/Groups/Model%20Exchange/UCTE-format.pdf) (UCTE **D**ata **E**xchange **F**ormat) format is an exchange format specified by the UCTE, for the exchange of grid model among its members. The data refer to load flow and three phase short circuit sudies and describe the interconnected extra high voltage network. The data are contained in an unformatted standard US ASCII file. The file is divided into 7 different blocks:
- Comments (C)
- Nodes (N)
- Lines (L)
- Two windings transformers (T)
- Two windings transformers regulation (RR)
- Two windings transformers special description (TT)
- Exchange powers (E)

Each block is introduced by a key line consisting of the two characters `##` and of the character given above in brackets. The end of a block is given by the next key line or the end of the file. The information of the each block is written in lines and the contents are separated by a blank (empty space).

The grid is described in Bus/Branch topology, and only few types of equipments are supported (nodal injections, AC line, two windings transformer). Fictitious nodes are located at the electric middle of each tie line. The defined X-nodes are binding for all users.

### File name convention
The UCTE-DEF format use the following file name convention: `<yyyymmdd>_<HHMM>_<TY><w>_<cc><v>.uct` with:
- `yyyymmdd`: year, month and day
- `HHMM`: hour and minute
- `TY`: the file type
    - `FO`: Day ahead congestion forecast
    - `2D`: 2-days ahead congestion forecast
    - `SN`: Snapshots
    - `RE`: Reference
    - `LT`: Long-term reference 
    - `01`...`23`: Intra-day ahead congenstion forecast. The value is the number of hours separating the case date and the generation date.
- `w`: day of the week, starting with 1 for Monday
- `cc`: The ISO country-code for national datasets, `UC` for UCTE-wide merged datasets without X nodes and `UX` for UCTE-wide merged datasets with X nodes
- `v`: version number starting with 0

The specifications of the UCTE-DEF format are available [online](https://cimug.ucaiug.org/Groups/Model%20Exchange/UCTE-format.pdf).

## Import
The import of a UCTE file into an IIDM grid model is done in three steps. First, the file is parsed and a UCTE grid model is created in memory. Then, some inconsistency checks are performed on this model. Finally, the UCTE grid model is converted into an IIDM grid model.

The UCTE parser provided by PowSyBl does not support the blocks `##TT` and `##E` providing respectively a special description of the two windings transformers and the scheduled active power exchange between countries. Those blocks are ignored during the parsing step.

### Inconsistency checks
**TODO:** détailler les checks réaliser et les corrections automatiques.

### From UCTE to IIDM
The UCTE file name is parsed to extract metadata required to initialize the IIDM network, such as its ID, the case date and the forecast distance.  

#### Node conversion
There is no equivalent [voltage level]() or [substation]() concept in the UCTE-DEF format, so we have to create substations and voltage levels from the nodes description and the topology. Two nodes are in the same substation if they have the same geographical spot (the 1st-6th character of the node code) or are connected by a two windings transformer, a coupler or a low impedance line. Two nodes are in the same voltage level if their code only differ by the 8th character (bus bars identifier).  
**Note:** We do not create a substation, a voltage level or a bus for X-nodes. They are converted to [dangling lines](). 

For nodes with a valid active or reactive load, a [load]() is created. It's ID is equal to the ID of the bus post-fixed by `_load`. The `P0` and `Q0` are equal to the active load and the reactive load of the UCTE node. For those with a valid generator, a [generator]() is created. It's ID is equal to the ID of the bus post-fixed by `_generator`. The power plant type is converted to an [energy source]() value (see the mapping table below for the matching).

**Mapping table for power plant types:**

| UCTE Power plant type | IIDM Energy source |
| :-------------------: | :----------------: |
| Hydro (H) | Hydro |
| Nuclear (N) | Nuclear |
| Lignite (L) | Thermal |
| Hard coal (C) | Thermal |
| Gas (G) | Thermal | 
| Oil (O) | Thermal |
| Wind (W) | Wind |
| Further (F) | Other |

The list of the power plant types is more detailed than the list of available [energy source]() types in IIDM, so we add the `powerPlantType` property to each generator to keep the initial value.

#### Line conversion
The busbar couplers connected two real nodes are converted into a [switch](). This switch is open or closed depending on the status of the coupler. In the UCTE-DEF format, the coupler can have extra information not supported in IIDM we keep as properties:
- the current limits is stored in the `currentLimit` property
- the order code is stored in the `orderCode` property
- the element name is stored in the `elementName` property 

The lines connected between two real nodes are converted into a [AC line](), except if its impedance is too small (e.g. smaller than `0.05`). In that particular case, the line is considered as a busbar coupler, and a [switch]() is created. The susceptance of the UCTE line is splitted in two, to initialize `B1` and `B2` with equal values. If the current limits is defined, a permanent limit is created for both ends of the line. The element name of the UCTE line is stored in the `elementName` property.

The lines connected between a read node and an X-node are converted into a [dangling line](). In IIDM, a dangling line is a line segment connected to a constant load. The sum of the active load and generation (rep. reactive) is computed to initialize the `P0` (resp. `Q0`) of the dangling line. The element name of the UCTE line is stored in the `elementName` property and the geographical name of the X-node is stored in the `geographicalName` property.

#### Two windings transformer conversion
The two windings transformers connected between two real nodes are converted into a [two windings transformer](). If the current limits is defined, a permanent limit is created only for the second side. The element name of the transformer is stored in the `elementName` property and the nominal power is stored in the `nominalPower` property.

If a two windings transformer is connected between a real node and an X-node, a fictitious intermediate voltage level is created, with a single bus called an Y-node. This new voltage level is created in the same substation than the real node. The transformer is created between the real node and the new Y-node, and the X-node is converted into a dangling line. The only difference with a classic X-node conversion, is that the electrical characteristic are hold by the transformer and set to `0` for the dangling line, except for the reactance that is set to $$0.05\space\Omega$$.

**TODO**: insérer un schéma
  

##### Phase regulation
If a phase regulation is defined for a transformer, it is converted into a [ratio tap changer](). If the voltage setpoint is defined, the ratio tap changer will regulate the voltage to this setpoint. The regulating terminal is assigned to the first side of the transformer. The &rho; of each step is calculated according to the following formula: $$\rho = 1 / (1 + i * \delta U / 100)$$.

##### Angle regulation
If an angle regulation is defined for a transformer, it is converted into a [phase tap changer](), with a `FIXED_TAP` regulation mode. &rho; and &alpha; of each step are calculated according to the following formulas:
- for an asymmetrical regulation (e.g. $$\Theta \ne 90°$$)

$$
\begin{array}{ccl}
    dx & = & step_i \times \dfrac{\delta U}{100} \times \cos(\Theta) \\[1em]
    dy & = & step_i \times \dfrac{\delta U}{100} \times \sin(\Theta) \\[1em]
    \rho & = & \dfrac{1}{\sqrt{dy^2 + (1 + dx)^2}} \\[1em]
    \alpha & = & - \text{atan2}(dy, 1 + dx) \\[1em]
\end{array}
$$

- for a symmetrical regulation (e.g. $$\Theta = 90°$$)

$$
\begin{array}{ccl}
    dx & = & step_i \times \dfrac{\delta U}{100} \times \cos(\Theta) \\[1em]
    dy & = & step_i \times \dfrac{\delta U}{100} \times \sin(\Theta) \\[1em]
    \rho & = & 1 \\[1em]
    \alpha & = & - 2 \times \text{atan2}(dy, 2 \times (1 + dx)) \\[1em]
\end{array}
$$

**Note:** The sign of $$\alpha$$ is changed because the phase tap changer is on side 2 in UCTE-DEF, and on side 1 in IIDM.

***
<span style="color: red">DO NOT READ UNDER THIS LINE</span>


**TODO:**
- Extensions (EntsoeArea, Xnode)

### Extensions


### Options

**TODO**:
- post-processor?

## Export


## Import
The conversion of a UCTE file into an IIDM grid model is done in two steps. The first step consist to parse the file to create a UCTE grid model and to fix the inconsistencies. Then, the UCTE grid model is converted to an IIDM grid model. 



### Inconsistency 


### Parsing

The UCTE reader provided by PowSyBl supports all the blocks except the `##TT` and the `##E` blocks that are optional blocks providing respectively 

#### Consistency checks
Once the UCTE grid model is created in memory, a consistency check is performed on the different elements (nodes, lines, two windings transformers and regulations).

##### Nodes
The following inconsistency checks are done for nodes with active or reactive power generation:
- if the voltage regulation is enabled and the reactive power generation is undefined, the reactive power generation is set to `0`.
- if the active power generation (resp. reactive) is undefined, it's set to `0`.
- if the voltage regulation is enabled and the voltage reference is undefined or closed to zero (e.g. lesser than `0.0001`), the node's type is set to `PQ`
- if the minimum active power generation (resp. reactive) is undefined, it's set to `9999`
- if the maximum active power generation (resp. reactive) is undefined, it's set to `-9999`
- if the minimum and maximum permissible active power generation (resp. reactive) are inverted, the values are swapped
- if the active power generation is lesser than the maximum permissible active power generation , the maximum permissible active power generation is set to the active power generation.
- if the active power generation is greater than the minimum permissible active power generation, the minimum permissible active power generation is set to the active power generation.
- if the minimum permissible active power generation, the maximum permissible active power generation and the active power generation are equal to `0`, the maximum permissible active power generation is set to `-9999` and the minimum permissible active power generation is set to `9999`
- if the minimum permissible reactive power generation is greater that `9999`, it's capped at `9999`
- if the maximum permissible reactive power generation is lesser that `-9999`, it's capped at `-9999`
- if the reactive power generation is lesser than the maximum permissible reactive power generation , the maximum permissible reactive power generation is set to the reactive power generation.
- if the reactive power generation is greater than the minimum permissible reactive power generation, the minimum permissible reactive power generation is set to the reactive power generation.
- if the minimum permissible reactive power generation is equal to the maximum permissible reactive power generation, the maximum permissible reactive power generation is set to `-9999` and the minimum permissible reactive power generation is set to `9999`

##### Lines and Two windings transformers
The following inconsistency checks are done for lines and two windings transformers:
- if the reactance is too small (e.g. in `[-0.05, 0.05]`), the reactance is capped at `0.05` or `-0.05`
- if the current limit is negative, the value is ignored

##### Regulations
The following inconsistency checks are done for a phase regulation:
- if the voltage value of a phase regulation is negative or equal to `0`, it's set to `NaN`.
- if the some information of a phase regulation is invalid (`n` is equal to `0`) or undefined (`n`, `n'` or `δU`), the phase regulation is ignored.

The following inconsistency checks are done for an angle regulation:
- if the some information of an angle regulation is invalid (`n` is equal to `0`) or undefined (`n`, `n'` or `δU`), the angle regulation is ignored.
- if the type of an angle regulation is undefined, it's set to `ASYM`

### Grid model conversion
The converter uses the filename to retrieve the metadata of the IIDM network (ID, type, case date and forecast distance).

#### Node conversion
The UCTE grid is described in a Bus/Branch topology. The concept of substations doesn't exist, so we regroup the nodes:
- with the same geographical spot
- connected by a two windings transformer
- connected by a coupler or a low impedance line

in the same substation. The name of the substation will be set to six first characters of the main node. The main node of a substation is the node with the higher voltage level that is not an X-node.



The nodes of a substation with the same voltage level are also regroup into a unique `VoltageLevel` object. All the `VoltageLevel` objects are created using a Bus/Breaker topology. 

