---
title: Network reduction
layout: default
---

The network reduction module is used to extract a sub part of a network, replacing the border lines, transformers, HVDC
lines by injections. **It is required to run a load-flow computation before trying to reduce it.**

The network reduction is relying on a `NetworkPredicate` instance, to define an _area of interest_ (i.e. a list
of equipments to keep in the network after the reduction). The equipments outside this area will be removed and the
lines, transformers and HVDC lines connecting voltage levels inside and outside this area will be replaced by injections
(loads or dangling lines, depending on the implementation).

# Define an area of interest

Before doing the reduction, one have to define the area of interest, thanks to the `com.powsybl.iidm.reducer.NetworkPredicate`
interface. This interface declare two methods:
```java
public interface NetworkPredicate {

    boolean test(Substation substation);

    boolean test(VoltageLevel voltageLevel);
}
```

These two methods return `true` if the given parameter (a [substation](../model/substation.md) or a [voltage level](../model/voltageLevel.md))
is in the area of interest and should still be in the network after the reduction.

Powsybl provides two implementations of this interface:
- the `IdentifierNetworkPredicate` implementation defines an area of interest using a list of voltage levels or
substation IDs
- the `NominalVoltageNetworkPredicate` implementation defines an area of interest using a range of nominal voltages 

You can also provide your own implementation.

## By IDs

The `com.powsybl.iidm.reducer.IdentifierNetworkPredicate` class is an implementation of the `NetworkPredicate` interface
that contains a set of substations' or voltage levels' IDs.

The `boolean test(Substation substation)` method returns true if the ID of the given substation is contained in the set of
IDs, or at least one of the voltage levels IDs of the given substation is found in the set of IDs.

The `boolean test(VoltageLevel voltageLevel)` method returns true if the ID of the given voltage level or the ID of its
substation is found in the set of IDs.

### Examples

The following example shows how to create new `IdentifierNetworkPredicate` instances:
```java
IdentifierNetworkPredicate p1 = new IdentifierNetworkPredicate(Arrays.asList("VL1", "VL2", "S1"));

IdentifierNetworkPredicate p2 = new IdentifierNetworkPredicate(Collections.singleton("VL1"));
```

There is also a more convenient way to create an instance of `IdentifierNetworkPredicate`, using the `of(String...)`
static method:
```java
NetworkPredicate p1 = IdentifierNetworkPredicate.of("VL1", "VL2", "S1");

NetworkPredicate p2 = IdentifierNetworkPredicate.of("VL1");
```

The list of voltage levels IDs can also be the result of a query:
```java
NetworkPredicate p3 = new IdentifierNetworkPredicate(
        network.getVoltageLevelStream()
                .filter(vl -> vl.getNominalV() >= 225.0)
                .filter(vl -> vl.getNominalV() <= 400.0)
                .map(VoltageLevel::getId)
                .collect(Collectors.toList()));
```

## By nominal voltages

The `com.powsybl.iidm.reducer.NominalVoltageNetworkPredicate` class is an implementation of the `NetworkPredicate`
interface that contains two double values that define a range of nominal voltages.

The `boolean test(Substation substation)` method returns true if at least one of the voltage levels of the given substation
has its nominal voltage inside the range.

The `boolean test(Voltage substation)` method returns true if the given voltage level has its nominal voltage inside the
range.

### Examples

The following example shows how to create a new `NominalVoltageNetworkPredicate` instance:
```java
NetworkPredicate p1 = new NominalVoltageNetworkPredicate(0.0, Double.MAX_VALUE);

NetworkPredicate p2 = new NominalVoltageNetworkPredicate(225.0, 400.0);
```

# Network reduction

The `com.powsybl.iidm.reducer.NetworkReducer` interface provides one method, in charge of the reduction of the network:
```java
public interface NetworkReducer {

    void reduce(Network network);
}
```

Powsybl provides a default implementation of this interface, but you can provide your own.

## Default implementation

The `com.powsybl.iidm.reducer.DefaultNetworkReducer` class is the common implementation of the `NetworkReducer` interface
that replaces the lines in the _border_ group by [loads](../model/load.md) or [dangling lines](../model/danglingLine.md),
depending of the [options](index.md#options), and the two windings transformers by [loads](../model/load.md).

NB: The HVDC lines and the three windings transformers replacement is not supported yet. If the `DefaultNetworkReducer`
encountered a HVDC line or a three windings transformer, an `UnsupportedOperationException` is thrown.

### Replacements by loads

The load created in place of a branch has the same ID and name than the replaced branch. The type of the load is set as
`FICTITIOUS` and the $$P_0$$ and $$Q_0$$ are set to the $$P$$ and $$Q$$ of the relevant terminal, depending on the side
kept in the network. If the branch is disconnected, $$P_0$$ and $$Q_0$$ are set to `NaN`. The connectivity information
(node or bus depending on the voltage level topology) are kept.

### Replacements by dangling lines

The dangling line created in place of a line has the same ID and name than the replaced line. The resistance and reactance
of the dangling line are equals to the half of the resistance and reactance of the replaced line (we consider that the line
is cut in the middle). The conductance and susceptance are set to the $$G_1$$ and $$B_1$$ or to $$G_2$$ and $$B_2$$
depending on the side kept in the network. 

The $$P_0$$ and $$Q_0$$ are set to the $$P$$ and $$Q$$ of the relevant terminal, depending on the side kept in the network.
If the line is disconnected, $$P_0$$ and $$Q_0$$ are set to `NaN`. The connectivity information (node or bus depending
on the voltage level topology) is kept.

### Options

The network reduction can be configured passing a `com.powsybl.iidm.reducer.ReductionOptions` instance to the
`DefaultNetworkReducer` constructor.

#### withDanglingLines
This option defines if the equipments in the _border_ group are replaced by a dangling line. If this option is set to `false`,
which is the default value, the equipments are exclusively replaced by loads.

#### Examples
The following example shows how to create a new `ReductionOptions` instance to do replacements by dangling lines.
```java
ReductionOptions options = new ReductionOptions();
options.withDanglingLines(true);
```

Note that the `ReductionOptions` class offers a fluent API that allow you writing code like this:
```java
ReductionOptions options = new ReductionOptions()
        .withDanglingLines(true);
```

### Observers

The `com.powsybl.iidm.reducer.NetworkReducerObserver` is an interface that allow to be notified each time an identifiable
is removed or replaced. This interface provides several methods, one by `Identifiable` sub class that is managed by the
`DefaultNetworkReducer` implementation. There are 2 types of events:
- a _replace_ event, when a line or a two windings transformer is replaced by a load or a danging line
- a _remove_ event, when a substation, a voltage level, a line, a two or three windings transformer or a HVDC line is
removed.

```java
public interface NetworkReducerObserver {

    void substationRemoved(Substation substation);

    void voltageLevelRemoved(VoltageLevel voltageLevel);

    void lineReplaced(Line line, Injection injection);

    void lineRemoved(Line line);

    void transformerReplaced(TwoWindingsTransformer transformer, Injection injection);

    void transformerRemoved(TwoWindingsTransformer transformer);

    void transformerReplaced(ThreeWindingsTransformer transformer, Injection injection);

    void transformerRemoved(ThreeWindingsTransformer transformer);

    void hvdcLineReplaced(HvdcLine hvdcLine, Injection injection);

    void hvdcLineRemoved(HvdcLine hvdcLine);

}
```

Powsybl provides a default implementation of the `NetworkReducerObserver` that does nothing. Use it as a base class of
your own implementation.

# Examples

The following Java code shows how to reduce a network, using the default implementation:
```java
Network network = Importers.loadNetwork("network.xiidm");

NetworkReducer reducer = NetworkReducer.builder()
        .withNetworkPredicate(new NominalVoltageNetworkPredicate(225.0, 400.0))
        .withDanglingLines(true)
        .build();
reducer.reduce(network);
```

## Network conversion
This example shows how to do a network reduction, using the `groovy-script` option of the [convert-network](../../tools/convert-network.md)
command.

First, we need a groovy script to do the reduction:
```groovy
import com.powsybl.iidm.network.Network;
import com.powsybl.iidm.reducer.IdentifierNetworkPredicate;
import com.powsybl.iidm.reducer.NetworkReducer;

NetworkReducer reducer = NetworkReducer.builder()
        .withNetworkPredicate(IdentifierNetworkPredicate.of("P1"))
        .build()
reducer.reduce(network)
```

Then, we run the [convert-network](../../tools/convert-network.md) command:
```shell
$> ./itools convert-network --input-file /home/user/input.xiidm
--output-file /home/user/output.xiidm --output-format XIIDM
--groovy-script /home/user/network-reduction.groovy
```

## Import post-processor
This example shows how to automatically reduce networks when they are loaded, using the
[groovy post-processors](../importer/post-processor/GroovyScriptPostProcessor.md), using the same script as before.

First, we have to configure the groovy post-processor in your configuration file:
```yaml
import:
    postProcessors: groovyScript
    
groovy-post-processor:
    script: /home/user/network-reduction.groovy
```
For more information about the configuration of the groovy post-processor, please refer to this documentation
[page](../../configuration/modules/groovy-post-processor.md).

Then, we run the [convert-network](../../tools/convert-network.md) command:
```shell
$> ./itools convert-network --input-file /home/user/input.xiidm
--output-file /home/user/output.xiidm --output-format XIIDM
```

## Observers
This example shows how to implement the `NetworkReducerObserver` and log information each time an equipment is replaced.
```java
NetworkReducerObserver observer = new DefaultNetworkReducerObserver() {

    private static final Logger LOGGER = LoggerFactory.getLogger(NetworkReducerObserver.class);

    @Override
    public void lineReplaced(Line line, Injection injection) {
        LOGGER.info("Line " + line.getId() + " has be replaced by a " + injection.getType());
    }

    @Override
    public void transformerReplaced(TwoWindingsTransformer transformer, Injection injection) {
        LOGGER.info("Transformer " + transformer.getId() + " has be replaced by a " + injection.getType());
    }

    @Override
    public void transformerReplaced(ThreeWindingsTransformer transformer, Injection injection) {
        LOGGER.info("Transformer " + transformer.getId() + " has be replaced by a " + injection.getType());
    }

    @Override
    public void hvdcLineReplaced(HvdcLine hvdcLine, Injection injection) {
        LOGGER.info("HVDC line " + hvdcLine.getId() + " has be replaced by a " + injection.getType());
    }
};

NetworkReducer reducer = NetworkReducer.builder()
        .withNetworkPredicate(new NominalVoltageNetworkPredicate(225.0, 400.0))
        .withDanglingLines(true)
        .withObservers(observer)
        .build();
reducer.reduce(network);
```
