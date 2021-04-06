# Operational limits

## Current limits
Two examples are provided below, with their corresponding limits scheme, to show clearly how to create a new `CurrentLimits` instance.

### First example
This first example creates a `CurrentLimits` instance containing one permanent limit and two temporary limits.
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
![Current limits scheme_example1](img/limits/currentLimitsExample1.svg){: width="50%" .center-image}

### Second example
This second example creates a `CurrentLimits` instance containing one permanent limit and three temporary limits, one of them having an infinite limit value.
```java
CurrentLimits currentLimits = network.getDanglingLine("DL").newCurrentLimits()
    .setPermanentLimit(700.0)
    .beginTemporaryLimit()
        .setName("IT20")
        .setValue(800.0)
        .setAcceptableDuration(20 * 60)
    .endTemporaryLimit()
    .beginTemporaryLimit()
        .setName("IT10")
        .setValue(900.0)
        .setAcceptableDuration(10 * 60)
    .endTemporaryLimit()
    .beginTemporaryLimit()
        .setName("IT1")
        .setValue(Double.POSITIVE_INFINITY)
        .setAcceptableDuration(60)
    .endTemporaryLimit()
    .add();
```
![Current limits scheme_example1](img/limits/currentLimitsExample2.svg){: width="50%" .center-image}
