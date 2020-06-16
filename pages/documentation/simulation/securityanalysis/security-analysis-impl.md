---
layout: default
---

# Security analysis implementations

## Load flow based implementation
This implementation of the Security Analysis API relies on a power flow simulator. Basically, a load flow computation is run on the base case to compute a reference. Then each contingency is applied on a temporary variant and a new power flow is calculated. If the power flow converges, the violations are listed.

To use this implementation, you have to add the following lines to your configuration file:

**YAML configuration:**
```yaml
componentDefaultConfig:
    SecurityAnalysisFactory: com.powsybl.security.SecurityAnalysisFactoryImpl
```

**XML configuration:**
```xml
<componentDefaultConfig>
    <SecurityAnalysisFactory>com.powsybl.security.SecurityAnalysisFactoryImpl</SecurityAnalysisFactory>
</componentDefaultConfig>
```

Remember that this implementation relies on a power flow simulator. It will automatically use the default implementation, except if there are many in your classpath. In that specific case, you have to adjust your configuration defining the name of the power flow simulator to use. Please refer to the [power flow]() page to know the list of available implementations.

**YAML configuration:**
```yaml
load-flow:
    default-impl-name: Default
```

**XML configuration:**
```xml
<load-flow>
    <default-impl-name>Default</default-impl-name>
</load-flow>
```

## Hades2
This implementation is [provided by RTE](https://rte-france.github.io/hades2/) as a freeware. To use this implementation, add the following lines to your configuration file:

**YAML configuration:**
```yaml
componentDefaultConfig:
    SecurityAnalysisFactory: com.rte_france.powsybl.hades2.Hades2SecurityAnalysisFactory

hades2:
    homeDir: /path/to/hades2
```

**XML configuration:**
```xml
<componentDefaultConfig>
    <SecurityAnalysisFactory>com.rte_france.powsybl.hades2.Hades2SecurityAnalysisFactory</SecurityAnalysisFactory>
</componentDefaultConfig>
<hades2>
    <homeDir>/path/to/hades2</homeDir>
</hades2>
```

Please refer to [Hades2 documentation](https://rte-france.github.io/hades2/features/security-analysis.html) for all the configuration details.
