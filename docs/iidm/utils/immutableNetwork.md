---
title: Immutable network
layout: default
---

# Examples
This example shows how to create an immutable network object from a normal network:
```java
Network immutableNetwork = ImmutableNetwork.of(network);
```
Then, it will throw an exception when the network is being modified by following actions:

Create new variant(But it is allowed to set variant)
```java
immutableNetwork.cloneVariant("a", "b");
```
Change attribute of network
```java
immutableNetwork.setForecastDistance(60);
```
Add equipment
```java
VoltageLevelAdder adder = immutableNetwork.newVoltageLevel();
```
Remove equipment
```java
immutableNetwork.getSubstation("P1").remove();
```
Reset an attribute of equipment
```java
network.getTwoWindingsTransformer("NHV2_NLOAD").setR(1.0f);
```
Or even reset an attribute of sub-equipment
```java
network.getTwoWindingsTransformer("NHV2_NLOAD").getRatioTapChanger().setTapPosition(1);
```
