---
title: Modules configuration
layout: default
---

The configuration mechanism supports YAML and XML file formats. The framework looks inside all the folders specified
to the [powsybl_config_dirs](../itools.md#powsybl_config_dirs) property in the [itools.conf](../itools.md) file for
configuration files. The framework uses the [powsybl_config_name](../itools.md#powsybl_config_name) property as the
basename of the configuration files. It looks for a YAML file first, then for a XML file. The XML file will be used only
if the YAML configuration file has not been found.

The configuration can also be configured using the system's environment variables. These variables should respect the
following format: `MODULE_NAME__PROPERTY_NAME`. Note that these variables will overload the XML/YAML configuration files.

The default configuration folder and the configuration file name can be configured in the `POWSYBL_HOME/etc/itools.conf`.

# Modules and properties
The configuration file contains a list of modules, that can be required or optional. Each module contains one or
several properties. These properties can also be required or optional. Names in configuration files are case-sensitive.

## Example

### YAML
```yml
module1:
    property1a: value1
    property1b: value2

module2:
    property2a: value3
    property2b: value4
    property2c: value5
```

### XML
```xml
<config>
    <module1>
        <property1a>value1</property1a>
        <property1b>value2</property1b>
    </module1>
    <module1>
        <property2a>value3</property2a>
        <property2b>value4</property2b>
        <property2c>value5</property2c>
    </module1>
</config>
```

### System's environment variables

| Environment variable | Module name | Property name |
| -------------------- | ----------- | ------------- |
| MODULE1__PROPERTY1=1 | module1 | property1 |
| LOWER_HYPHEN__PROPERTY2=2 | lower-hyphen | property2 |
| LOWER_CAMEL__PROPERTY3=3 | lowerCamel | property3 |
| UPPER_CAMEL__PROPERTY4=4 | UpperCamel | property4 |
| SNAKE_CASE__PROPERTY5=5 | snake_case | property5 |

# Modules list
- [componentDefaultConfig](../../../pages/documentation/user/configuration/componentDefaultConfig.md)
- [computation-local](../../../pages/documentation/user/configuration/computation-local.md)
- [default-computation-manager](../../../pages/documentation/user/configuration/default-computation-manager.md)
- [dynamic-simulation](../../../pages/documentation/user/configuration/dynamic-simulation.md)
- [dynamic-simulation-default-parameters](../../../pages/documentation/user/configuration/dynamic-simulation-default-parameters.md)
- [dynawo](../../../pages/documentation/user/configuration/dynawo.md)
- [dynawo-default-parameters](../../../pages/documentation/user/configuration/dynawo-default-parameters.md)
- [external-security-analysis-config](../../../pages/documentation/user/configuration/external-security-analysis-config.md)
- [groovy-dsl-contingencies](../../../pages/documentation/user/configuration/groovy-dsl-contingencies.md)
- [groovy-post-processor](groovy-post-processor.md)
- [import](../../../pages/documentation/user/configuration/import.md)
- [import-export-parameters-default-value](../../../pages/documentation/user/configuration/import-export-parameters-default-value.md)
- [javaScriptPostProcessor](javaScriptPostProcessor.md)
- [limit-violation-default-filter](../../../pages/documentation/user/configuration/limit-violation-default-filter.md)
- [load-flow](../../../pages/documentation/user/configuration/load-flow.md)
- [load-flow-action-simulator](../../../pages/documentation/user/configuration/load-flow-action-simulator.md)
- [load-flow-based-phase-shifter-optimizer](../../../pages/documentation/user/configuration/load-flow-based-phase-shifter-optimizer.md)
- [load-flow-default-parameters](../../../pages/documentation/user/configuration/load-flow-default-parameters.md)
- [loadflow-results-completion-parameters](../../../pages/documentation/user/configuration/loadflow-results-completion-parameters.md)
- [loadflow-validation](../../../pages/documentation/user/configuration/loadflow-validation.md)
- [local-app-file-system](../../../pages/documentation/user/configuration/local-app-file-system.md)
- [mapdb-app-file-system](../../../pages/documentation/user/configuration/mapdb-app-file-system.md)
- [network](../../../pages/documentation/user/configuration/network.md)
- [remote-service](../../../pages/documentation/user/configuration/remote-service.md)
- [security](../../../pages/documentation/user/configuration/security.md)
- [security-analysis](../../../pages/documentation/user/configuration/security-analysis.md)
- [simulation-parameters](../../../pages/documentation/user/configuration/simulation-parameters.md)
- [table-formatter](../../../pages/documentation/user/configuration/table-formatter.md)
