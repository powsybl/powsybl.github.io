---
title: Voltage Level
layout: default
---

The `com.powsybl.iidm.network.VoltageLevel` is used to model a voltage level. A voltage level is is a collection of
equipments located in the same substation and at the same base voltage. It can contain [batteries](battery.md), [generators](generator.md),
[loads](load.md), [shunt compensators](shuntCompensator.md), [dangling lines](danglingLine.md),
[static VAR compensators](staticVarCompensator.md) and [HVDC converter stations](hvdcConverterStation.md).

A voltage level is located in a [substation](substation.md).

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| id | String | - | yes | - | The ID of the voltage level |
| name | String | - | no | - | The name of the voltage level |
| NominalV | double | kV | yes | - | The nominal voltage |
| LowVoltageLimit | double | kV | no | - | The low voltage limit |
| HighVoltageLimit | double | kV | no | - | The high voltage limit |
| TopologyKind | `TopologyKind` | - | yes | - | The kind of topology |

## TopologyKind
`TopologyKind` describes the topology model of the voltage level i.e. how equipments are connected together. The
`com.powsybl.iidm.network.TopologyKind` enum contains these two values:
- NODE_BREAKER
- BUS_BREAKER

`NODE_BREAKER` corresponds to a **node/breaker model**, which is the most detailed way to describe a topology. All
elements are physical ones: busbar sections, breakers and disconnectors. A node in a node/breaker context means
"connection node" and not topological node or bus.

`BUS_BREAKER` corresponds to a **bus/breaker model**, which is an aggregated form of the topology made of buses and
breakers. A bus is the aggregation of busbar sections and closed switches.

# Example
This example shows how to create a new `VoltageLevel` object:
```java
VoltageLevel voltageLevel = substation.newVoltageLevel()
    .setId("VL")
    .setName("VL") // optional
    .setNominalV(20)
    .setTopologyKind(TopologyKind.NODE_BREAKER)
    .setLowVoltageLimit(15)
    .setHighVoltageLimit(25)
    .add();
```
