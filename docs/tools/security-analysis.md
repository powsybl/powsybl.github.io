---
title: security-analysis
layout: default
todo:
    - add link to the SecurityAnalysisParameter page
---

The `security-analysis` command is used to detect security violations on pre-contingencies and post-contingencies states.

# Usage
```shell
$>cd  <POWSYBL_HOME>/bin
$> ./itools security-analysis --help
usage: itools [OPTIONS] security-analysis --case-file <FILE>
       [--contingencies-file <FILE>] [--external] [--help] [-I <property=value>]
       [--import-parameters <IMPORT_PARAMETERS>] [--limit-types <LIMIT-TYPES>]
       [--output-file <FILE>] [--output-format <FORMAT>] [--parameters-file
       <FILE>] [--with-extensions <EXTENSIONS>]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name

Available arguments are:
    --case-file <FILE>                                 the case path
    --contingencies-file <FILE>                        the contingencies path
    --external                                         external execution
    --help                                             display the help and quit
-I <property=value>                                    use value for given
                                                       importer parameter
    --import-parameters <IMPORT_PARAMETERS>            the importer configuation
                                                       file
    --limit-types <LIMIT-TYPES>                        limit type filter (all if not set)
    --output-file <FILE>                               the output path
    --output-format <FORMAT>                           the output format [JSON]
    --parameters-file <FILE>                           loadflow parameters as JSON file
    --skip-postproc                                    skip network importer post
                                                       processors (when configured)
    --with-extensions <EXTENSIONS>                     the extension list to enable

Allowed LIMIT-TYPES values are [CURRENT, LOW_VOLTAGE, HIGH_VOLTAGE,
LOW_SHORT_CIRCUIT_CURRENT, HIGH_SHORT_CIRCUIT_CURRENT, OTHER]
Allowed EXTENSIONS values are []
```

## Required options

### case-file
Use the `--case-file` parameter to specify the path of the case file.

## Optional options

### contingencies-file
Use the `--contingencies-file` parameter to specify the path of the contingencies file. If this parameter is not set, the
security violations are checked on the N-state only.

### external
Use the `--external` parameter to run the security analysis in an external process. Read the
[external-security-analysis-config](../configuration/modules/external-security-analysis-config.md) documentation page
to learn how to configure the external mode.

### import-parameters
Use the `--import-parameters` parameter to specify the path of the configuration file of the importer. It is possible to
overload one or many parameters using the `-I property=value` parameter. The properties depend on the input format.
Refer to the documentation page of each [importer](../iidm/importer/index.md) to know their specific configuration.

### limit-types
Use the `--limit-types` parameter to filter certain types of violations. This parameter overrides the default
[configuration](../configuration/modules/limit-violation-default-filter.md). The available `LimitViolationType` values
are:
- CURRENT
- LOW_VOLTAGE
- HIGH_VOLTAGE
- LOW_SHORT_CIRCUIT_CURRENT
- HIGH_SHORT_CIRCUIT_CURRENT
- OTHER

### output-file
Use the `--output-file` parameter to specify the path of the output file. If this parameter is not set, the results are
displayed to the console.

### output-format
Use the `--output-format` parameter to specify the format of the output file. This parameter is required if the
`output-file` parameter is used. The supported format are:
- JSON

### parameters-file
Use the `--parameters-file` parameter to specify the path of the configuration file.

### skip-postproc
Use the `--skip-postproc` parameter to skip the importer's post processors. Read the [post processor](../iidm/importer/post-processor/index.md)
documentation page to learn more about importer's post processors.

### with-extensions
Use the `--with-extensions` parameter to activate a list of `com.powsybl.security.interceptors.SecurityAnalysisInterceptor`
implementations.

# Configuration
To run a security analysis, one has to configure the [componentDefaultConfig](../configuration/modules/componentDefaultConfig.md)
module to indicate the implementations to use for:
- the `com.powsybl.security.SecurityAnalysis` to use, by setting the `SecurityAnalysisFactory` property
- the `com.powsybl.contingency.ContingenciesProvider` to use, by setting the `ContingenciesProviderFactory` property

## YAML version
```yaml
componentDefaultConfig:
    ContingenciesProviderFactory: com.powsybl.action.dsl.GroovyDslContingenciesProviderFactory
    SecurityAnalysisFactory: com.powsybl.security.SecurityAnalysisFactoryImpl
    LoadFlowFactory: com.powsybl.loadflow.mock.LoadFlowFactoryMock
```

## XML version
```xml
<config>
    <componentDefaultConfig>
        <ContingenciesProviderFactory>com.powsybl.action.dsl.GroovyDslContingenciesProviderFactory</ContingenciesProviderFactory>
        <SecurityAnalysisFactory>com.powsybl.security.SecurityAnalysisFactoryImpl</SecurityAnalysisFactory>
        <LoadFlowFactory>com.powsybl.loadflow.mock.LoadFlowFactoryMock</LoadFlowFactory>
    </componentDefaultConfig>
</config>
```

To learn more about contingencies or available `ContingenciesProvider` read this [documentation](../contingencies/index.md) page.

To learn how to filter violations, read the [limit-violation-default-filter](../configuration/modules/limit-violation-default-filter.md)
module documentation page.

To learn more about configuration files, read the [SecurityAnalysisParameters](../configuration/parameters/SecurityAnalysisParameters.md)
documentation page.


# Examples

## Example 1
The following example shows how to run security analysis to detect only pre-contingency violation, for a given network:
```shell
$> itools security-analysis --case-file 20170322_1844_SN3_FR2.uct
```

The analysis results will be printed to the standard output:
```shell
Loading network '20170322_1844_SN3_FR2.uct'
Pre-contingency violations:
+--------+---------------------+---------+---------+--------------+----------------+-----------------+------------+-----------+------------------+----------------+
| Action | Equipment (1)       | End     | Country | Base voltage | Violation type | Violation name  | Value      | Limit     | abs(value-limit) | Loading rate % |
+--------+---------------------+---------+---------+--------------+----------------+-----------------+------------+-----------+------------------+----------------+
|        | FFNGEN71 FFNHV111 1 | FFNHV17 | FR      |           27 | CURRENT        | Permanent limit | 15350.0808 | 9999.0000 |        5351.0808 |         153.52 |
+--------+---------------------+---------+---------+--------------+----------------+-----------------+------------+-----------+------------------+----------------+
```

## Example 2
The following example shows how to run security-analysis to identify the post-contingency security status of given network:
```shell
$> cat contingencies.groovy
contingency('HV_line_1') {
    equipments 'NHV1_NHV2_1'
}
contingency('HV_line_2') {
    equipments 'NHV1_NHV2_2'
}
```

```shell
$> itools security-analysis --case-file eurostag_example.xiidm --contingencies-file contingencies.groovy
Loading network 'eurostag_example.xiidm'
Pre-contingency violations:
+--------+---------------+-----+---------+--------------+----------------+----------------+-------+-------+------------------+----------------+
| Action | Equipment (0) | End | Country | Base voltage | Violation type | Violation name | Value | Limit | abs(value-limit) | Loading rate % |
+--------+---------------+-----+---------+--------------+----------------+----------------+-------+-------+------------------+----------------+
Post-contingency limit violations:
+-------------+----------+--------+---------------+-------+---------+--------------+----------------+-----------------+-----------+-----------+------------------+----------------+
| Contingency | Status   | Action | Equipment (4) | End   | Country | Base voltage | Violation type | Violation name  | Value     | Limit     | abs(value-limit) | Loading rate % |
+-------------+----------+--------+---------------+-------+---------+--------------+----------------+-----------------+-----------+-----------+------------------+----------------+
| HV_line_1   | converge |        | Equipment (2) |       |         |              |                |                 |           |           |                  |                |
|             |          |        | NHV1_NHV2_2   | VLHV1 | FR      |          380 | CURRENT        | Permanent limit | 1008.9289 |  500.0000 |         508.9289 |         201.79 |
|             |          |        | NHV1_NHV2_2   | VLHV2 | FR      |          380 | CURRENT        | Permanent limit | 1047.8260 |  500.0000 |         547.8260 |         209.57 |
| HV_line_2   | converge |        | Equipment (2) |       |         |              |                |                 |           |           |                  |                |
|             |          |        | NHV1_NHV2_1   | VLHV1 | FR      |          380 | CURRENT        | Permanent limit | 1008.9289 | 1000.0000 |           8.9289 |         100.89 |
|             |          |        | NHV1_NHV2_1   | VLHV2 | FR      |          380 | CURRENT        | Permanent limit | 1047.8260 | 1000.0000 |          47.8260 |         104.78 |
+-------------+----------+--------+---------------+-------+---------+--------------+----------------+-----------------+-----------+-----------+------------------+----------------+
```

# Maven configuration
To use the `security-analysis` command, add the following dependencies to the `pom.xml` file.
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-security-analysis-api</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```

# Further behaviour customization
The behaviour of the security analysis may be further customized by using a `SecurityAnalysisPreprocessor`. Such a preprocessor will have the possibility to programmatically transform the following objects before the security analysis is actually executed :
 - The `Network`
 - The `ContingenciesProvider`
 - The `LimitViolationDetector`
 - The `LimitViolationFilter`
 - The `SecurityAnalysisParameters`
 - The `SecurityAnalysisInterceptor`s

It enables, for example, to customize what should be considered a limit violation and what should not.

This preprocessing may us as an input the contingencies file provided to the command line tool.

In order to use a preprocessor, you will need to configure it in the [security-analysis](../configuration/security-analysis-config.md) configuration module.

# Security-analysis implementations

## Slow implementation
Read this [documentation](../loadflow/security-analysis.md) page to learn how to configure powsybl to use the
`SecurityAnalysisImpl` implementation, a load-flow based implementation for security limits detection.

## Hades2
Read this [documentation](http://rte-france.github.io/hades2/index.html) page to learn how to configure powsybl to use
Hades2, a RTE load-flow tool, for security analysis.
