---
title: HVDC converter station
layout: default
---

The `com.powsybl.iidm.network.HvdcConverterStation` interface is used to model an AC/DC Converter Station. An AC/DC converter station can do a rectifier operation with losses or an inverter operation with losses. This is the base class for [VSC](../../todo.md) and [LCC](../../todo.md). As such, its sub interfaces are:
- [LCC Converter Station](lccConverterStation.md)
- [VSC Converter Station](vscConverterStation.md)

## Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| HvdcType | `HvdcType` | - | yes | - | The HVDC type |
| LossFactor | float | % | yes | - | The loss factor |

## HVDC Type
The `com.powsybl.iidm.network.HvdcConverterStation.HvdcType` enum contains these two values:
- LCC
- VSC

It determines if the Converter Station is a LCC Converter Station or a VSC Converter Station.

## LossFactor
The positive loss factor `LossFactor` is used to model the losses during the conversion. In case of:
- A rectifier operation (conversion from AC to DC), we have
$$
frac{P_{DC}}{P_{AC}} = 1 - frac{LossFactor}{100}
$$
- An inverter operation (conversion from DC to AC), we have
$$
frac{P_{AC}}{P_{DC}} = 1 - frac{LossFactor}{100}
$$
