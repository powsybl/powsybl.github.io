---
title: sensitivity-computation
layout: default
todo:
    - add links to missing pages
    - add link to H2 implementation
---

The `sensitivity-computation` command is used to run a sensitivity computation on a network.

# Usage
```shell
$> itools sensitivity-computation --help
usage: itools [OPTIONS] sensitivity-computation --case-file <FILE>
       --factors-file <FILE> [--help] [-I <property=value>] [--import-parameters
       <IMPORT_PARAMETERS>] [--output-file <FILE>] [--output-format <FORMAT>]
       [--skip-postproc]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name

Available arguments are:
    --case-file <FILE>                                 the case path
    --factors-file <FILE>                              sensitivity factors input file
                                                       path
    --help                                             display the help and quit
-I <property=value>                                    use value for given
                                                       importer parameter
    --import-parameters <IMPORT_PARAMETERS>            the importer configuation
                                                       file
    --output-file <FILE>                               sensitivity computation results
                                                       output path
    --output-format <FORMAT>                           the output format [JSON]
    --skip-postproc                                    skip network importer post
                                                       processors (when configured)
```

## Required parameters

### case-file
Use the `--case-file` parameter to specify the path of the case file.

### factors-file 
Use the `--factors-file` parameter to specify the path of the sensitivity factors file.

## Optional parameters

### import-parameters
Use the `--import-parameters` parameter to specify the path of the configuration file of the importer. It is possible to
overload one or many parameters using the `-I property=value` parameter. The properties depend on the input format.
Refer to the documentation page of each [importer](../iidm/importer/index.md) to know their specific configuration.

### output-file
Use the `--output-file` parameter to export the result of the computation to the specified path. If this parameter is not
used, the results are printed to the console.

### output-format
Use the `--output-format` parameter to specify the format of the result file. Currently, the only supported format is JSON. This
parameter is required if the `output-file` parameter is used.

### skip-postproc
Use the `--skip-postproc` parameter to skip the importer's post processors. Read the [post processor](../iidm/importer/post-processor/index.md)
documentation page to learn more about importer's post processors.

# Configuration
To run a sensitivity computation, one have to configure the the [componentDefaultConfig](../configuration/modules/componentDefaultConfig.md)
module to indicate the implementations to use for:
- the `com.powsybl.sensitivity.SensitivityComputation` to use, by setting the `SensitivityComputationFactory` property
- the `com.powsybl.sensitivity.SensitivityFactorsProvider` to use, by setting the `SensitivityFactorsProviderFactory` property

## YAML version
```yaml
componentDefaultConfig:
    SensitivityComputationFactory: com.powsybl.sensitivity.mock.SensitivityComputationFactoryMock
    SensitivityFactorsProviderFactory: com.powsybl.sensitivity.JsonSensitivityFactorsProviderFactory
```
### XML version
```xml
<componentDefaultConfig>
    <SensitivityComputationFactory>com.powsybl.sensitivity.mock.SensitivityComputationFactoryMock</SensitivityComputationFactory>
    <SensitivityFactorsProviderFactory>com.powsybl.sensitivity.JsonSensitivityFactorsProviderFactory</SensitivityFactorsProviderFactory>
</componentDefaultConfig>
```
*Note*: different sensitivity computation implementations might require specific configurations, in additional config file's sections.

To learn more about sensitivity factors or available `SensitivityFactorsProvider` read this [documentation](../sensitivity/index.md) page.

# Examples
The following example shows how to run a sensitivity computation, using the default configuration:
```shell
$> itools sensitivity-computation --case-file case.xiidm --factors-file factors.json
Loading network 'case.xiidm'
sensitivity computation results:
+--------------------+--------------------+---------------------+---------------------+------------------+------------------+------------------+
| VariableId         | VariableName       | FunctionId          | FunctionName        | VariableRefValue | FunctionRefValue | SensitivityValue |
+--------------------+--------------------+---------------------+---------------------+------------------+------------------+------------------+
| FFR1AA1 _generator | FFR1AA1 _generator | BBE1AA1  BBE2AA1  1 | BBE1AA1  BBE2AA1  1 | 0.739678         | 0.0534343        | 0.668510         |
| FFR2AA1 _generator | FFR2AA1 _generator | BBE1AA1  BBE2AA1  1 | BBE1AA1  BBE2AA1  1 | 0.320307         | 0.125160         | 0.122958         |
| FFR3AA1 _generator | FFR3AA1 _generator | BBE1AA1  BBE2AA1  1 | BBE1AA1  BBE2AA1  1 | 0.773411         | 0.0759074        | 0.0342171        |
+--------------------+--------------------+---------------------+---------------------+------------------+------------------+------------------+
```

# Maven configuration
To use the `sensitivity-computation` command, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-sensitivity-api</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
