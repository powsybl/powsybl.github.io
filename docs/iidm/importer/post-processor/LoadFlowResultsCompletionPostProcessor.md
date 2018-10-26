---
title: LoadFlowResultsCompletionPostProcessor
default: layout
---

The `com.powsybl.loadflow.LoadFlowResultsCompletionPostProcessor` class is an implementation of the `com.powsybl.iidm.import_.ImportPostProcessor`
interface that aims at completing the loadflow results of a network, computing and assigning, if not already set, the flows
at the end of branches.

The post processor uses Kirchhoff laws, and the estimation of active and reactive power is computed according to the
voltages and the characteristics of the branch:
```
(P1calc, Q1calc, P2calc, Q2calc) = f(Voltages, Characteristics)
```

Please see `com.powsybl.iidm.network.util.BranchData` class for more details.

# Configuration
To activate the `LoadFlowResultsCompletionPostProcessor`, add `loadflowResultsCompletion` to the `postProcessors`
property of the [import](../../../configuration/modules/import.md) module.

Read the [loadflow-results-completion-parameters](../../../configuration/modules/loadflow-results-completion-parameters.md)
documentation page to learn how to configure the parameters of this post processor.

## YAML
```yaml
import:
    postProcessors: loadflowResultsCompletion
```

## XML
```xml
<import>
    <postProcessors>loadflowResultsCompletion</postProcessors>
</import>
```
