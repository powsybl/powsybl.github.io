# Operational limits

## Current limits
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
A `NaN` value for the acceptable duration of a temporary limit means an infinite duration.
