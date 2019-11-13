---
title: Internal data model
layout: default
---


The [Network](network.md) modeling is made of two main objects: substations and lines. A substation can have several voltage levels and a line can be of several types (AC lines, DC lines and AC lines shared between two countries).

- [Line](line.md)

- [Tie line](tieLine.md)

- [HVDC line](hvdcLine.md)

- A [Substation](substation.md) can be made of several voltage levels, which are connected through transformers:

    - [Two windings transformer](twoWindingsTransformer.md)

    - [Three windings transformer](threeWindingsTransformer.md)

    - [VoltageLevel](voltageLevel.md)
        - [Node/Breaker topology](../../todo.md)
        - [Bus/Breaker topology](../../todo.md)
        - [Battery](battery.md)
        - [Generator](generator.md)
        - [Load](load.md)
        - [Shunt compensator](shuntCompensator.md)
        - [Dangling line](danglingLine.md)
        - [Static VAR compensator](staticVarCompensator.md)
        - [VSC converter station](vscConverterStation.md)
        - [LCC converter station](lccConverterStation.md)

The following image shows some elements of the internal data model:

![IIDM model](./images/schema-iidm.png){: width="50%" .center-image}
