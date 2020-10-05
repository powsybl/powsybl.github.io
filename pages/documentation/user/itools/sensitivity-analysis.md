---
layout: default
---

# iTools sensitivity-analysis

The `sensitivity-analysis` command is used to run a [sensitivity analysis](../../simulation/sensitivity/index.md) on a network. At the end of the simulation the results are printed or exported to a file.

## Usage
```
$> itools sensitivity-analysis --help
usage: itools [OPTIONS] sensitivity-analysis --case-file <FILE>
       [--contingencies-file <FILE>] --factors-file <FILE> [--help] [-I
       <property=value>] [--import-parameters <IMPORT_PARAMETERS>]
       [--output-file <FILE>] [--output-format <FORMAT>] [--parameters-file
       <FILE>]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name

Available arguments are:
    --case-file <FILE>                        the case path
    --contingencies-file <FILE>               contingencies input file path
    --factors-file <FILE>                     sensitivity factors input file
                                              path
    --help                                    display the help and quit
 -I <property=value>                          use value for given importer
                                              parameter
    --import-parameters <IMPORT_PARAMETERS>   the importer configuation file
    --output-file <FILE>                      sensitivity analysis results
                                              output path
    --output-format <FORMAT>                  the output format [CSV, JSON]
    --parameters-file <FILE>                  sensitivity analysis parameters as
                                              JSON file
```

### Required arguments

**\-\-case-file**  
This option defines the path of the case file on which the power flow simulation is run. The [supported formats](../../index.html#grid-formats) depend on the execution class path.

**\-\-factors-file**  
This option defines the path of the sensitivity factors file. At the moment, only JSON files are supported.

### Optional arguments

**\-\-contingencies-file**  
This option defines the path of the contingencies files. If this parameter is not set, the security violations are checked on the base state only. This file is a groovy script that respects the [contingency DSL](../../simulation/securityanalysis/contingency-dsl.md) syntax.

**\-\-import-parameters**  
This option defines the path of the [importer](../../glossary.md#importer)'s configuration file. It's possible to overload one or many parameters using the `-I property=value` syntax. The list of supported properties depends on the [input format](../../index.html#grid-formats).

**\-\-output-file**  
This option defines the path of the result file. If this option is not set, the results are printed to the console.

**\-\-output-format**
This option defines the format of the output file. This option is required if the `--output-file` is set. The only supported format is `JSON`.  

## Simulators
<span style="color: red">TODO</span>

## Contingencies
<span style="color: red">TODO</span>

## Factors
<span style="color: red">TODO</span>

## Parameters
<span style="color: red">TODO</span>

## Results
<span style="color: red">TODO</span>

## Examples
The following example shows how to run a sensitivity analysis, using the default configuration:
```shell
$> itools sensitivity-analysis --case-file case.xiidm --factors-file factors.json
Loading network 'case.xiidm'
sensitivity analysis results:
+--------------------+--------------------+---------------------+---------------------+------------------+------------------+------------------+
| VariableId         | VariableName       | FunctionId          | FunctionName        | VariableRefValue | FunctionRefValue | SensitivityValue |
+--------------------+--------------------+---------------------+---------------------+------------------+------------------+------------------+
| FFR1AA1 _generator | FFR1AA1 _generator | BBE1AA1  BBE2AA1  1 | BBE1AA1  BBE2AA1  1 | 0.739678         | 0.0534343        | 0.668510         |
| FFR2AA1 _generator | FFR2AA1 _generator | BBE1AA1  BBE2AA1  1 | BBE1AA1  BBE2AA1  1 | 0.320307         | 0.125160         | 0.122958         |
| FFR3AA1 _generator | FFR3AA1 _generator | BBE1AA1  BBE2AA1  1 | BBE1AA1  BBE2AA1  1 | 0.773411         | 0.0759074        | 0.0342171        |
+--------------------+--------------------+---------------------+---------------------+------------------+------------------+------------------+
```

***

# Configuration
To run a sensitivity analysis, one has to configure the the [componentDefaultConfig](../configuration/componentDefaultConfig.md)
module to indicate the implementations to use for parsing the factors file. At the moment, only JSON format is supported.

## YAML version
```yaml
componentDefaultConfig:
    SensitivityFactorsProviderFactory: com.powsybl.sensitivity.JsonSensitivityFactorsProviderFactory
```
### XML version
```xml
<componentDefaultConfig>
    <SensitivityFactorsProviderFactory>com.powsybl.sensitivity.JsonSensitivityFactorsProviderFactory</SensitivityFactorsProviderFactory>
</componentDefaultConfig>
```
*Note*: different sensitivity analysis implementations might require specific configurations, in additional config file's sections.

To learn more about sensitivity factors or available `SensitivityFactorsProvider` read this [documentation](../../simulation/sensitivity/index.md) page.

# Maven configuration
To use the `sensitivity-analysis` command, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-sensitivity-analysis-api</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
