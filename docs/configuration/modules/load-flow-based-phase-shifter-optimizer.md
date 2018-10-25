---
title: load-flow-based-phase-shifter-optimizer
layout: default
---

The `load-flow-based-phase-shifter-optimizer` module is used by the `com.powsybl.action.util.LoadFlowBasedPhaseShifterOptimizer`
class, which is an implementation of the `com.powsybl.action.util.PhaseShifterOptimizer` interface. The
`LoadFlowBasedPhaseShifterOptimizer` tries to solve a current violation on a phase tap changer.

# Required properties

## load-flow-factory
The `load-flow-factory` property is a required property that defined the `com.powsybl.loadflow.LoadFlowFactory` implementation
to use for the optimization.

# Examples

## YAML
```yaml
load-flow-based-phase-shifter-optimizer:
    load-flow-factory: com.powsybl.loadflow.mock.LoadFlowFactoryMock
```

## XML
```xml
<load-flow-based-phase-shifter-optimizer>
    <load-flow-factory>com.powsybl.loadflow.mock.LoadFlowFactoryMock</load-flow-factory>
</load-flow-based-phase-shifter-optimizer>
```
