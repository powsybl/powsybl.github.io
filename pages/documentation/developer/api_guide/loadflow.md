---
layout: default
---

# Load flow API

The `com.powsybl.loadflow.LoadFlow` is the main entry point to run load-flow computations. It provides the static methods `run` and `runAsync`. These methods will run the computation and only differ in the way they return the results. The `run` method returns the results directly and can be used in most cases. The `runAsync` returns a `CompletableFuture` and can be used when a non-blocking computation is prefered. The `LoadFlow` class doesn't implement the computation directly, but instead relies on a `com.powsybl.loadflow.LoadFlowProvider` to implement it. This allows to use different load-flow algorithm implementations with the same code. Both the `run` and `runAsync` methods use the globally configured load-flow provider. `LoadFlow` also has a `find` method that allows to use a specific load-flow provider for this computation.
