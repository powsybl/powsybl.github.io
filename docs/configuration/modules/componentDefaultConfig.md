---
title: componentDefaultConfig
layout: default
---

The `componentDefaultConfig` module is used to configure the implementation of plugins the framework has to use for
specific features (e.g. computation, etc.). Contrary to the other modules, it is impossible to give an exhaustive list of the
existing properties.

The names of the properties are the names of Java interfaces of the powsybl framework. Each value must be the complete name
of a class which implements this interface.
- ContingenciesProviderFactory
- LoadFlowFactory
- SensitivityComputationFactory
- SensitivityFactorsProviderFactory
- MpiStatisticsFactory
- SecurityAnalysisFactory
- SimulatorFactory

# Example
In the configuration below, we define these functionalities:
 - A security analysis
 - A description of contingencies
 - A loadflow

The chosen implementations are:
 - "slow" security analysis (for a few contingencies), post-contingency LF based implementation
 - the contingencies expressed in Groovy DSL language
 - the 'mock' loadflow (a loadflow implementation that does nothing on the network: for demonstration purposes, only)

## YAML
```yaml
componentDefaultConfig:
    ContingenciesProviderFactory: com.powsybl.action.dsl.GroovyDslContingenciesProviderFactory
    SecurityAnalysisFactory: com.powsybl.security.SecurityAnalysisFactoryImpl
    LoadFlowFactory: com.powsybl.loadflow.mock.LoadFlowFactoryMock
```

## XML
```xml
<componentDefaultConfig>
    <ContingenciesProviderFactory>com.powsybl.action.dsl.GroovyDslContingenciesProviderFactory</ContingenciesProviderFactory>
    <LoadFlowFactory>com.powsybl.loadflow.mock.LoadFlowFactoryMock</LoadFlowFactory>
    <SecurityAnalysisFactory>com.powsybl.security.SecurityAnalysisFactoryImpl</SecurityAnalysisFactory>
</componentDefaultConfig>

```
