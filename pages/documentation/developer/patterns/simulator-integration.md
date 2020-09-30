---
layout: default
---

# Simulator integration pattern

This page describes the way simulators are meant to be integrated to PowSyBl.

* TOC
{:toc}

## Main utility class
The idea is to create common utility classes for each type of simulator:
for example, a `DynamicSimulation` class for time-domain simulation or a `LoadFlow` class for power flows. These utility classes are meant to expose:
- a set of `run` methods to synchronously launch simulations (i.e. the main thread execution has to wait for the end of the `run` execution to proceed)
- a set of `runAsync` methods to asynchronously launch simulations (i.e. the main thread execution does not have to wait for the end of the `runAsync` execution to proceed)
- a set of `find` methods to be able to choose which simulator implementation to use

In those utility classes, several `run` and `runAsync` methods may be defined in order to be able to launch simulations with various parameter configurations (indeed, some simulation parameters may be optional).

The `find` method proceeds as follows:
- either it takes no argument:
  - if only one implementation of the simulator exists in the classpath, it returns that implementation
  - otherwise, it is necessary to define a configuration module in which the name of the implementation is specifically chosen
- otherwise it takes an implementation name as an argument and selects the corresponding implementation

## Provider

Each simulator implementation has to be interfaced through a `Provider`.
For example, for load flow simulations, a `LoadFlowProvider` interface exists, and for time-domain
simulations a `DynamicSimulationProvider` interface exists.
These interfaces inherit from the `Versionable` and the `PlatformConfigNamedProvider` interfaces, and provide two methods:
- `getName` (inherited from `Versionable`): returns the implementation name, which has to be the one given in the configuration
- `getVersion` (inherited from `Versionable`): returns the version of the simulator, which may be used to check that the binary for the simulator and the integration code in PowSyBl are compatible
- `run`: the main method, to launch the simulation

## Implementation

For each simulator, it is then necessary to implement the `getName`, `getVersion` and `run` methods.
For example, for load flow simulations, some existing implementations are `OpenLoadFlowProvider` and `Hades2Provider`, and for time-domain simulations the `DynawoProvider` exists.

**Remarks**:

- Beware that `getName` has to return a specific name to avoid conflicts with other implementations.
- It is necessary to annotate the `Provider` implementation with `AutoService` to automatically generate the metadata needed by the `ServiceLoader` to find out about the implementations of `ServiceLoader`-style providers:

```java
@AutoService(LoadFlowProvider.class)
public class OpenLoadFlowProvider implements LoadFlowProvider {
...
}
```

## Configuration 

The configuration for a simulator consists of several modules:
- one to choose the simulator itself
- one to configure the simulator globally
- one to choose the simulation parameters common to all the simulators for a simulation type
- one to choose the simulation parameters specific to the chosen simulator

### Simulator choice

Regarding the configuration for the simulator choice, the standard in PowSyBl is to proceed as follows:
- the module name is based on the utility class name: for example `dynamic-simulation` or `load-flow`
- in that module, the property to be defined to select the implementation is named: `default-impl-name` (see for example the [load flow configuration](../../simulation/powerflow/index.md#configuration)

### Simulator configuration

Besides the implementation choice for a specific simulator type, it may be necessary to let the user choose some global simulator parameters, like:
- the installation path if the simulator is not Java based
- whether the simulations will be run in debug or release mode
- etc.

This should be done in a module named according to the `Provider` name. For example, `hades2` or `dynawo`.

### Simulation configuration

There are two types of simulation parameters:
- the ones common to all the implementations for a given simulation type (for example the start and end time of simulation for time-domain simulations). We'll call them generic parameters further on.
- the ones specific to each implementation

#### Generic simulation parameters

These parameters should be defined in modules named according to the simulation type: for example `dynamic-simulation-parameters`.

#### Specific simulation parameters

Finally, the parameters specific to an implementation can be done in a module usually named according to the following convention: `dynawo-default-parameters`, `hades2-default-parameters`, etc.

<span style="color:red"> TODO: make a refactoring to remove the `default` from the module names.</span>

The standard in PowSyBl is to let the user configure these simulation parameters either in the `config.yml` directly, or by providing a JSON file to set the parameters. The JSON parameters overwrite the parameters defined in the `config.yml` file.

## User point of view

In the end, to launch a loadflow the user will:
- specify the implementation and its specific parameters in the configuration
- use the `LoadFlow` class with methods `run` and `runAsync`.

Example with an implementation chosen from the configuration:
```java
Network network = Importers.loadNetwork(filename);
LoadFlow.run(network);
```

Example with a specific implementation chosen in Java:

```java
Network network = Importers.loadNetwork(filename);
LoadFlowResult result = LoadFlow.find("OpenLoadFlow").run(network, new LoadFlowParameters());
```
