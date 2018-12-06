---
title: LoadFlowResultsCompletionPostProcessor
layout: default
---

The `com.powsybl.loadflow.LoadFlowResultsCompletionPostProcessor` class is an implementation of the `com.powsybl.iidm.import_.ImportPostProcessor`
interface that aims at completing the loadflow results of a network, computing and assigning, if not already set, the flows
at the end of branches.

Mathematically speaking, a power-flow result is fully defined by the complex voltages at each node. The consequence is
that most load-flow algorithm converge very fast if they are initialized with the voltages. As a result, it happens that
load-flow results include only voltages and not flows on branches. A post-processor has been developed in order to compute
the flows given the voltages for a given network states. The equations (Kirchhoff law) used are the same as the one used
in the [load-flow validation](../../../loadflow/validation.md) to compute $$P_1^{\text{calc}}$$, $$Q_1^{\text{calc}}$$,
$$P_2^{\text{calc}}$$, $$Q_2^{\text{calc}}$$ for branches and $$P_3^{\text{calc}}$$, $$Q_3^{\text{calc}}$$ in addition for
three-windings transformers.

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
