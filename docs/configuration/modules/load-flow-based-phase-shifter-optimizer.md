---
title: load-flow-based-phase-shifter-optimizer
layout: default
---

The `load-flow-based-phase-shifter-optimizer` module is used by the `com.powsybl.action.util.LoadFlowBasedPhaseShifterOptimizer`
class, which is an implementation of the `com.powsybl.action.util.PhaseShifterOptimizer` interface. The
`LoadFlowBasedPhaseShifterOptimizer` tries to solve a current violation on a phase tap changer.

# Required properties

## load-flow-name
The `load-flow-name` property is an optional property that defines the implementation name to use for running the loadflow. 
If this property is not set, the default loadflow implementation is used.
**Note**: In previous Powsybl releases (before 3.0.0), this was configured in the `load-flow-factory` property with the full classname of the implementation.

# Examples

## YAML
```yaml
load-flow-based-phase-shifter-optimizer:
    load-flow-name: Mock
```

## XML
```xml
<load-flow-based-phase-shifter-optimizer>
    <load-flow-name>Mock</load-flow-name>
</load-flow-based-phase-shifter-optimizer>
```
