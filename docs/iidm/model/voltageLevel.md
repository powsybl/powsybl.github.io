---
title: Voltage Level
layout: default
---

The `com.powsybl.iidm.network.VoltageLevel` is used to model a voltage level. A voltage level is is a collection of equipments located in the same [substation](substation.md) and at the same base voltage. It can contain [batteries](battery.md), [generators](generator.md),
[loads](load.md), [shunt compensators](shuntCompensator.md), [static var compensators](staticVarCompensator.md), [DC converter stations](hvdcConverterStation.md), [dangling lines](danglingLine.md) and [switches](switch.md).

A voltage level contains a topology model, i.e. an object that describes how equipments are connected together. A voltage level may have two kinds of topology model depending on what level of detail we want to have:
- node/breaker model: this is the most detailed way to describe a topology.
- bus/breaker model: this is an aggregated form of the topology made of buses and breakers.

A topology model can be managed through the 3 following views ordered from the most detailed to the less detailed:
- node/breaker view
- bus/breaker view
- bus only view

Depending on the topology model kind of the voltage level a view can have the status:
- N/A means that it doesn't make sense to take view that is more detailed than the model. An exception is thrown when a method is called on an N/A view.
- modifiable, when the view has the same level of details than the model.
- readable only, because the view is a result of a computation on the topology model.

The view status is summarized in the following table:
<table border="1">
 <tr>
   <th colspan="2" rowspan="2"></th>
   <th colspan="2">Topology model</th>
 </tr>
 <tr>
   <th>node/breaker</th>
   <th>bus/breaker</th>
 </tr>
 <tr>
   <th rowspan="3">Topology view</th>
   <th>node/breaker</th>
   <td>modifiable</td>
   <td>N/A</td>
 </tr>
 <tr>
   <th>bus/breaker</th>
   <td>readable</td>
   <td>modifiable</td>
 </tr>
 <tr>
   <th>bus</th>
   <td>readable</td>
   <td>readable</td>
 </tr>
</table>

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

`NODE_BREAKER` corresponds to a node/breaker model, which is the most detailed way to describe a topology. All
elements are physical ones: busbar sections, breakers and disconnectors. A node in a node/breaker context means
"connectivity node" and not topological node or bus.

`BUS_BREAKER` corresponds to a bus/breaker model, which is an aggregated form of the topology made of buses and breakers. A bus is the aggregation of busbar sections and closed switches.

# Examples

## Simple example

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
