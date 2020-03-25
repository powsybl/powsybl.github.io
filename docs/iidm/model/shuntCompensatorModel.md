---
title: Shunt compensator's Models
layout: default
---

The `com.powsybl.iidm.network.ShuntCompensatorModel` interface is used to model how susceptance and conductance are split by
sections in a given [shunt compensator](shuntCompensator.mde). `powsybl-core` supports two types of shunt compensator models: linear and non linear.

# Linear Shunt Compensator model

The susceptance and conductance of a linear shunt compensator's section are proportional to its number. To calculate them, only the susceptance and conductance per section are needed.
These characteristics are contained in the `ShuntCompensatorLinearModel`.

## Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| bPerSection | double | S | yes | - | The sequence shunt susceptance per section |
| gPerSection| double | S | no | - | The sequence shunt conductance per section |

## bPerSection
A value of `bPerSection` positive means it is modeling a capacitor, an equipment that injects reactive
power into the bus.

A value of `bPerSection` negative means a reactor, an equipment that can absorb excess reactive power
from the network.

# Non linear Shunt Compensator model

The susceptance and conductance of a non-linear shunt compensator's section are not proportional to its number: they must be explicitly specified.
A `ShuntCompensatorNonLinearModel` contains a map of all the shunt compensator's section with their respective susceptance and conductance.

## Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| Sections | [`Section`](#section) | - | yes (must contain at least one section) | - | the shunt compensator's sections |

## Section

### Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- |-------- | ------------- | ----------- |
| B | double | S | yes | - | The sequence shunt susceptance for the given section |
| G | double | S | no | - | The sequence shunt conductance for the given section |

