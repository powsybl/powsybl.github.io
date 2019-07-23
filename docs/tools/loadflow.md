---
title: loadflow
layout: default
---

The `loadflow` command is used to run a power flow simulation.

# Usage
```shell
$> itools loadflow --help
usage: itools [OPTIONS] loadflow --case-file <FILE> [-E <property=value>]
              [--export-parameters <EXPORT_PARAMETERS>] [--help] [-I <property=value>]
              [--import-parameters <IMPORT_PARAMETERS>] [--output-case-file <FILE>]
              [--output-case-format <CASEFORMAT>] [--output-file <FILE>]
              [--output-format <FORMAT>] [--parameters-file <FILE>] [--skip-postproc]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name

Available arguments are:
    --case-file <FILE>                            the case path
-E <property=value>                               use value for given exporter
                                                  parameter
     --export-parameters <EXPORT_PARAMETERS>      the exporter configuration file
     --help                                       display the help and quit
-I <property=value>                               use value for given importer
                                                  parameter
     --import-parameters <IMPORT_PARAMETERS>      the importer configuation file
     --output-case-file <FILE>                    modified network base name
     --output-case-format <CASEFORMAT>            modified network output format
                                                  [CGMES, AMPL, XIIDM]
     --output-file <FILE>                         loadflow results output path
     --output-format <FORMAT>                     loadflow results output format
                                                  [CSV, JSON]
     --parameters-file <FILE>                     loadflow parameters as JSON file
     --skip-postproc                              skip network importer post
                                                  processors (when configured)

```

## Required parameters

### case-file
Use the `--case-file` parameter to specify the path of the case file.

## Optional parameters

### export-parameters
Use the `--export-parameters` parameter to specify the path of the configuration file of the exporter. It is possible to
overload one or many parameters using the `-E property=value` parameter. The properties depend on the output format.
Refer to the documentation page of each [exporter](../iidm/exporter/index.md) to know their specific configuration.

### import-parameters
Use th `--import-parameters` parameter to specify the path of the configuration file of the importer. It is possible to
overload one or many parameters using the `-I property=value` parameter. The properties depend on the input format.
Refer to the documentation page of each [importer](../iidm/importer/index.md) to know their specific configuration.

### output-case-file
Use the `--output-case-file` parameter to export the modified network to the specified path.

### output-case-format
Use the `--output-case-format` parameter to specify the format of the output case file. Read the [exporter](../iidm/exporter/index.md)
documentation to learn more about supported output formats. This parameter is required if the `output-case-file` parameter
is used.

### output-file
Use the `--output-file` parameter to export the result of the computation to the specified path. If this parameter is not
used, the results are printed to the console.

### output-format
Use the `--output-format` parameter to specify the format of the result file. The supported format are CSV and JSON. This
parameter is required if the `output-file` parameter is used.

### parameters-file
Use the `--parameters-file` parameter to specify a JSON configuration file. If this parameter is not set, the default
configuration is used.

### skip-postproc
Use the `--skip-postproc` parameter to skip the importer's post processors. Read the [post processor](../iidm/importer/post-processor/index.md)
documentation page to learn more about importer's post processors.

# Configuration
To run a load flow, one have to choose the implementation of the `com.powsybl.loadflow.LoadFlow` to use, by setting the
`LoadFlowFactory` property to the [componentDefaultConfig](../configuration/modules/componentDefaultConfig.md) module.

To set the default configuration of the load flow, one have to configure the
[load-flow-default-parameters](../configuration/modules/load-flow-default-parameters.md) module.

To learn more about configuration files, read the [LoadFlowParameters](../configuration/parameters/LoadFlowParameters.md) documentation
page.

# Examples
The following example shows how to run a load flow, using the default configuration:
```shell
$> itools loadflow --case-file case.xiidm
Loading network 'case.xiidm'
loadflow results:
+--------+-----------------------------------------------------------------------------------------+
| Result | Metrics                                                                                 |
+--------+-----------------------------------------------------------------------------------------+
| true   | {nbIter=4, dureeCalcul=0.001569, cause=0, contraintes=0, statut=OK, csprMarcheForcee=0} |
+--------+-----------------------------------------------------------------------------------------+
```

The following example shows how to run a load flow using a parameters file:
```shell
$> itools loadflow --case-file case.xiidm --parameters-file loadflowparameters.json
loadflow results:
+--------+-----------------------------------------------------------------------------------------+
| Result | Metrics                                                                                 |
+--------+-----------------------------------------------------------------------------------------+
| true   | {nbIter=4, dureeCalcul=0.001569, cause=0, contraintes=0, statut=OK, csprMarcheForcee=0} |
+--------+-----------------------------------------------------------------------------------------+
```

# Maven configuration
To use the `loadflow` command, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-loadflow-api</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```

# Load-flow implementations
Read this [documentation](http://rte-france.github.io/hades2/index.html) page to learn how to configure powsybl to use
Hades2, a RTE load-flow tool.
