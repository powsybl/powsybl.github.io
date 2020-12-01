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

Remember that this implementation relies on a power flow simulator. It will automatically use the default implementation, except if there are many in your classpath. In that specific case, you have to adjust your configuration defining the name of the power flow simulator to use. Please refer to the [power flow](../powerflow/index.md) page to know the list of available implementations.

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

### Configuration

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

#### Specific parameters

The [ADNSecurityAnalysisParameters](https://javadoc.io/doc/com.rte-france.powsybl/powsybl-rte-core/latest/com/rte_france/powsybl/iidm/export/adn/ADNSecurityAnalysisParameters.html)
is an extension of the [SecurityAnalysisParameters](https://javadoc.io/doc/com.powsybl/powsybl-core/latest/com/powsybl/security/SecurityAnalysisParameters.html)
class that provides specific configuration for the security analysis mode of Hades2.

Read the load flow [specific parameters](../powerflow/hades2.md#specific-parameters) page to learn more about the Hades load-flow configuration.

**afterContingencyBalanceEpsilon**  
The `afterContingencyBalanceEpsilon` property is an optional property that defines the maximum value accepted for the
unbalance at the slack node in contingency simulation. The default value for this parameter is `-1`.

**constraints**  
The `contraints` property is an optional property that defines if violations should be detected. The default value for
this parameter is `true`.

**fastMode**  
The `fastMode` property is an optional property that disable some features to improve performance. In practice, if this
parameter is set to `true`, the maximal number of allowed PV-PQ switches is set to 0. The default value for this parameter
is `false`.

**flowConstraintReference**  
The `flowConstraintReference` property is an optional property that defines the current limits (permanent or temporary)
to use as reference for relative variation criteria. The default value for this parameter is 0.

**minPowerTransferRatio**  
The `minPowerTransferRatio` property is an optional property that defines the threshold of lost MW caused by a contingency
to run a simulation for this contingency. The default value for this parameter is `3`.

**minVMaxV**  
The `minVMaxV` property is an optional property that defines if the minimum and maximum voltage per substations for all
contingencies should be computed. The default value for this parameter is `false`.

**powerTransferRatio**  
The `powerTransferRatio` property is an optional property that defines if the power transfer coefficients should be
computed. The default value for this parameter is `false`.

**worsenedFlowConstraintsDelta**  
The `worsenedFlowConstraintsDelta` property is an optional property that defines the worsening delta for `CURRENT`
violations. The default value for this parameter is `-1`.

**worsenedFlowConstraintsThreshold**  
The `worsenedFlowConstraintsThreshold` property is an optional property that defines the worsening threshold for
`CURRENT` violations. The default value for this parameter is `0.1`.

**worsenedHighVoltageConstraintsDelta**  
The `worsenedHighVoltageConstraintsDelta` property is an optional property that defines the worsening delta for `HIGH_VOLTAGE`
violations. The default value for this parameter is `-1`.

**worsenedHighVoltageConstraintsThreshold**  
The `worsenedHighVoltageConstraintsThreshold` property is an optional property that defines the worsening threshold for
`HIGH_VOLTAGE` violations. The default value for this parameter is `-1`.

**worsenedLowVoltageConstraintsDelta**  
The `worsenedLowVoltageConstraintsDelta` property is an optional property that defines the worsening delta for `LOW_VOLTAGE`
violations. The default value for this parameter is `-1`.

**worsenedLowVoltageConstraintsThreshold**  
The `worsenedLowVoltageConstraintsThreshold` property is an optional property that defines the worsening threshold for
`LOW_VOLTAGE` violations. The default value for this parameter is `-1`.

**writeNState**  
The `writeNState` property is an optional property that defines if the pre-contingency results should be exported. The
default value for this parameter is `true`.

This is an example of a security analysis parameters file with the `ADNSecurityAnalysisParameters` extension:
```json
{
  "version" : "1.0",
  "load-flow-parameters" : {
    ...
  },
  "extensions" : {
    "ADNSecurityAnalysisParameters": {
      "afterContingencyBalanceEpsilon": 1.0,
      "constraints": true,
      "fastMode": true,
      "flowConstraintReference": 0,
      "minPowerTransferRatio": 3,
      "minVMaxV": true,
      "powerTransferRatio": true,
      "worsenedHighVoltageConstraintsDelta": 4.0,
      "worsenedHighVoltageConstraintsThreshold": 0.1,
      "worsenedLowVoltageConstraintsDelta": 5.0,
      "worsenedLowVoltageConstraintsThreshold": 0.1,
      "worsenedFlowConstraintsDelta": -1,
      "worsenedFlowConstraintsThreshold": 0.1,
      "writeNState": true
    }
  }
}
```