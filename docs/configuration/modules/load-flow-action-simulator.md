---
title: load-flow-action-simulator
layout: default
todo:
    - add a link to http://rte-france.github.io/hades2/index.html
    - the debug property seems unused
---

The `load-flow-action-simulator` module is used by the [action-simulator](../../tools/action-simulator.md) tool if it's
configured to use the `LoadFlowActionSimulator` implementation.

# Properties

## ignore-pre-contingency-violations
Set the `ignore-pre-contingency-violations` to `true` to ignore the the pre-contingency violations and continue the simulation
even if there are still violations after the pre-contingency simulation.

## load-flow-factory
Use the `load-flow-factory` property to define the `com.powsybl.loadflow.LoadFlowFactory` implementation to use for the
simulation.

## max-iterations
Use the `max-iterations` parameter to limit the number of iteration needed to solve the violations.

# Examples

## YAML
```yaml
load-flow-action-simulator:
    debug: false
    ignore-pre-contingency-violations: false
    load-flow-factory: com.powsybl.loadflow.mock.LoadFlowFactoryMock
    max-iterations: 10
```

## XML
```xml
<load-flow-action-simulator>
    <debug>false</debug>
    <ignore-pre-contingency-violations>false</ignore-pre-contingency-violations>
    <load-flow-factory>com.powsybl.loadflow.mock.LoadFlowFactoryMock</load-flow-factory>
    <max-iterations>10</max-iterations>
</load-flow-action-simulator>
```
