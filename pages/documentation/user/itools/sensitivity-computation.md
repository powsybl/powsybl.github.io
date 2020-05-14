---
layout: default
---

# iTools sensitivity-computation

The `sensitivity-computation` command is used to run a [sensitivity computation](../../simulation/sensitivity/index.md) on a network. At the end of the simulation the results are printed or exported to a file.

## Usage
```
$> itools sensitivity-computation --help
usage: itools [OPTIONS] sensitivity-computation --case-file <FILE>
       [--contingencies-file <FILE>] --factors-file <FILE> [--help] [-I
       <property=value>] [--import-parameters <IMPORT_PARAMETERS>]
       [--output-file <FILE>] [--output-format <FORMAT>]

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
    --output-file <FILE>                      sensitivity computation results
                                              output path
    --output-format <FORMAT>                  the output format [CSV, JSON]
```

### Required arguments

**\-\-case-file**  
This option defines the path of the case file on which the power flow simulation is run. The [supported formats](../../index.html#grid-formats) depend on the execution class path.

**\-\-factors-file**  
This option defines the path of the sensitivity factors file.
<span style="color: red">TODO</span>: quels formats???


### Optional arguments

**\-\-contingencies-file**  
<span style="color: red">TODO</span>

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

***

# Configuration
To run a sensitivity computation, one has to configure the the [componentDefaultConfig](../configuration/modules/componentDefaultConfig.md)
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

# Maven configuration
To use the `sensitivity-computation` command, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-sensitivity-api</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
