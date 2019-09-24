---
title: Current limits
layout: default
---

The `com.powsybl.iidm.network.CurrentLimits` interface is used to model current limits for [branches](branch.md),
[dangling lines](danglingLine.md) and [three windings transformers](threeWindingsTransformer.md).
Current limits are defined by at most one permanent limit and/or any number of temporary limits.

# Permanent Limits
A permanent limit is modeled by a double. 

# Temporary Limits
A temporary limit has an **acceptable duration**. The component on which the current limits are applied can safely remain
between the preceding limit (it could be another temporary limit or a permanent limit) and this limit for a duration up to the acceptable duration.
A `NaN` value for the acceptable duration of a temporary limit means an infinite duration.

# Examples
This example shows how to create a new `CurrentLimits` instance:
```java
CurrentLimits currentLimits = network.getDanglingLine("DL").newCurrentLimits()
    .setPermanentLimit(100.0)
    .beginTemporaryLimit()
        .setName("TL1")
        .setValue(120.0)
        .setAcceptableDuration(20 * 60)
    .endTemporaryLimit()
    .beginTemporaryLimit()
        .setName("TL2")
        .setValue(140.0)
        .setAcceptableDuration(10 * 60)
    .endTemporaryLimit()
    .add();
```
