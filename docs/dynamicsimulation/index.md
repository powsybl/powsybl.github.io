---
title: Dynamic Simulation
layout: default
---

The `com.powsybl.dynamicsimulation.DynamicSimulation` is the main entry point to run dynamic
simulation. It provides the static methods `run` and `runAsync`. These methods
will run the computation and only differ in the way they return the results.
The `run` method returns the results directly and can be used in most cases.
The `runAsync` returns a `CompletableFuture` and can be used when a
non-blocking computation is prefered. The `DynamicSimulation` class doesn't implement
the computation directly, but instead relies on a
`com.powsybl.dynamicsimulation.DynamicSimulationProvider` to implement it. This allows to use
different dynamic simulation implementations with the same code. Both the `run`
and `runAsync` use the globally configured dynamic simulation provider. `DynamicSimulation` also
has a `find` method that allows to use a specific dynamic simulation provider for this
computation.

**Note**: Powsybl provides an [implementation](./dynawo-simulation.md) to run dynamic simulations with Dynawo.

# Configuration
To run a dynamic simulation, one has to choose the implementation, follow the instructions at [dynamic simulation Configuration](../configuration/modules/dynamic-simulation.md).

To set the default configuration of the dynamic simulation, one has to configure the
[dynamic-simulation-default-parameters](../configuration/modules/dynamic-simulation-default-parameters.md) module.

To learn more about configuration files, read the [DynamicSimulationParameters](../configuration/parameters/DynamicSimulationParameters.md) documentation
page.
