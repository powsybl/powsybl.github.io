---
title: EmptyContingencyListProvider
layout: default
---

The `com.powsybl.contingency.EmptyContingencyListProvider` is a special implementation of the
[ContingenciesProvider](index.md#ContingenciesProvider) interface that provided an empty list of contingencies. This
implementation should be use to check violations on a N-state.

# Configuration

To use the `EmptyContingencyListProvider`, configure the `ContingenciesProviderFactory` property of the
[componentDefaultConfig](../configuration/modules/componentDefaultConfig.md) module.

## YAML
```yaml
componentDefaultConfig:
    ContingenciesProviderFactory: com.powsybl.contingency.EmptyContingencyListProviderFactory
```

## XML
```xml
<componentDefaultConfig>
    <ContingenciesProviderFactory>com.powsybl.action.dsl.GroovyDslContingenciesProviderFactory</ContingenciesProviderFactory>
</componentDefaultConfig>
```
