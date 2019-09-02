---
title: componentDefaultConfig
layout: default
---

The `componentDefaultConfig` module is used to configure the implementation of plugins the framework has to use for a
specific feature (computation...). Contrary to the other modules, it is impossible to give an exhaustive list of the
existing properties.

The name of the properties are the name of Java interfaces of the powsybl framework. The values must be the complete name
of a class which implements this interface.
- ContingenciesProviderFactory
- SensitivityComputationFactory
- SensitivityFactorsProviderFactory
- MpiStatisticsFactory
- SecurityAnalysisFactory
- SimulatorFactory

# Example
In the configuration below, we define these functionalities:
 - A security analysis
 - A description of contingencies
         
The chosen implementations are:
 - "slow" security analysis (for a few contingencies), post-contingency LF based implementation
 - the contingencies expressed in Groovy DSL language

## YAML
```yaml
componentDefaultConfig:
    ContingenciesProviderFactory: com.powsybl.action.dsl.GroovyDslContingenciesProviderFactory
    SecurityAnalysisFactory: com.powsybl.security.SecurityAnalysisFactoryImpl
```

## XML
```xml
<componentDefaultConfig>
    <ContingenciesProviderFactory>com.powsybl.action.dsl.GroovyDslContingenciesProviderFactory</ContingenciesProviderFactory>
    <SecurityAnalysisFactory>com.powsybl.security.SecurityAnalysisFactoryImpl</SecurityAnalysisFactory>
</componentDefaultConfig>

```
