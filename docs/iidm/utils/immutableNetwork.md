---
title: Immutable network
layout: default
---

# Examples
## Basic usage
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

## Extension
If you want to make an extension immutable too, you should write a class inherited from `AbstractImmutableWrapperExtension` and also annotation with `@AutoServie(ImmutabeWrapperExtension.class)`

Here is an example how to turn a `LoadFooExtension` into immutable.
```java
@AutoService(ImmutableWrapperExtension.class)
public class ImmutableLoadFooExtension extends AbstractImmutableWrapperExtension<Load, LoadFooExt> {

    @Override
    public String getExtensionName() {
        return "loadFoo";
    }

    @Override
    public Class getExtensionClass() {
        return LoadFooExt.class;
    }

    @Override
    protected LoadFooExt toImmutable(LoadFooExt mutableExt, Load immuExtendable) {
        return new LoadFooExt(immuExtendable) {

            @Override
            public String getUsername() {
                return mutableExt.getUsername();
            }

            @Override
            public void setUsername(String username) {
                throw ImmutableNetwork.UNMODIFIABLE_EXCEPTION;
            }

            @Override
            public void setExtendable(Load extendable) {
                throw ImmutableNetwork.UNMODIFIABLE_EXCEPTION;
            }
        };
    }
}
```
