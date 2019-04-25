---
title: injection
layout: default
---

The `com.powsybl.iidm.network.Injection` class is used to model an equipment with a single [terminal](terminal.md).
In IIDM, the `Injection` interface has seven sub interfaces:
- [Battery](battery.md)
- [BusbarSection](busbarSection.md)
- [DanglingLine](danglingLine.md)
- [Generator](generator.md)
- [HvdcConverterStation](hvdcConverterStation.md)
- [Load](load.md)
- [ShuntCompensator](shuntCompensator.md)
- [StaticVarCompensator](staticVarCompensator.md)

# Creation
Before creating an instance of a sub interface of Injection, its terminal must be set with the method `setNode(int)` in
a Node/Breaker Topology or `setConnectableBus(String)` and eventually `setBus(String)` in a Bus/Breaker Topology.
