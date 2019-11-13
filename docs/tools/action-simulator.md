---
title: action-simulator
layout: default
todo:
    - add description of --apply-if-solved-violations optional parameter
---

The `action-simulator` command is used to test remedial actions to solve security violations.

# Usage
```shell
$> itools action-simulator --help
usage: itools [OPTIONS] action-simulator [--apply-if-solved-violations]
       --case-file <FILE> [--contingencies <CONTINGENCY1,CONTINGENCY2,...>]
       --dsl-file <FILE> [--export-after-each-round] [--help] [-I
       <property=value>] [--import-parameters <IMPORT_PARAMETERS>]
       [--output-case-folder <CASEFOLDER>] [--output-case-format <CASEFORMAT>]
       [--output-compression-format <COMPRESSION_FORMAT>] [--output-file <FILE>]
       [--output-format <FORMAT>] [--verbose]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name

Available arguments are:
    --apply-if-solved-violations                       apply the first tested
                                                       action which solves all
                                                       violations
    --case-file <FILE>                                 the case path
    --contingencies <CONTINGENCY1,CONTINGENCY2,...>    contingencies to test
    --dsl-file <FILE>                                  the Groovy DSL path
    --export-after-each-round                          export case after each
                                                       round
    --help                                             display the help and quit
-I <property=value>                                    use value for given
                                                       importer parameter
    --import-parameters <IMPORT_PARAMETERS>            the importer configuation
                                                       file
    --output-case-folder <CASEFOLDER>                  output case folder path
    --output-case-format <CASEFORMAT>                  output case format [CSV,
                                                       AMPL, XIIDM]
    --output-compression-format <COMPRESSION_FORMAT>   output compression format
                                                       [GZIP, BZIP2, ZIP]
    --output-file <FILE>                               the output file path
    --output-format <FORMAT>                           the output file format
                                                       [JSON]
    --verbose                                          verbose mode
```

## Required parameters

### case-file
Use the `--case-file` parameter to specify the path of the case file.

### dsl-file
Use the `--dsl-file` parameter to specify the path of the [action DSL](../todo.md) script that defines the strategy to simulate.

## Optional parameters

### contingencies
Use the `--contingencies` parameter to specify the list of contingencies to simulate.

### export-after-each-round
Use the `--export-after-each-round` parameter to export a case file after each round of the simulation. If this option
is not set, a single case file is exported at the end of simulation (e.g. once there is no more violations or matching
rules).

### import-parameters
Use the `--import-parameters` parameter to specify the path of the configuration file of the importer. It is possible to
overload one or many parameters using the `-I property=value` parameter. The properties depend on the input format.
Refer to the documentation page of each [importer](../iidm/importer/index.md) to know their specific configuration.

### output-case-folder
Use the `--output-case-folder` parameter to set the folder in which the case files are exported.

### output-case-format
Use the `--output-case-format` parameter to set the case exporter to use to export case files. Read the [exporter](../iidm/exporter/index.md)
documentation page to learn more about supported case formats.

### output-compression-format
Use the `--output-compression-format` parameter to set the compression format of the case files.

### output-file
Use the `--output-file` parameter to specify the path of the output file. If this option is not set, the results are
displayed in the console.

### output-format
Use the `--output-format` parameter to specify the format of the output file. This option is required if the `output-file`
parameter is defined.

### verbose
Use the `--verbose` parameter to activate the verbose mode.

# Configuration
Read the [configuration](../configuration/modules/load-flow-action-simulator.md) page to learn how to set up the
`load-flow-action-simulator` module.

# Examples
This example shows a small [action DSL](../todo.md) script:
```groovy
contingency('HV_line_1') {
    equipments 'NHV1_NHV2_1'
}

contingency('HV_line_2') {
    equipments 'NHV1_NHV2_2'
}

rule('apply_shedding_for_line_1') {
    description 'Test load sheddings when line 1 is overloaded'
    life 8
    when isOverloaded(['NHV1_NHV2_1'])
    apply 'load_shed_100'
}

rule('apply_shedding_for_line_2') {
    description 'Test load sheddings when line 2 is overloaded'
    life 8
    when isOverloaded(['NHV1_NHV2_2'])
    apply 'load_shed_100'
}

action('load_shed_100') {
    description 'load shedding 100 MW'
    tasks {
        script {
            load('LOAD').p0 -= 100
        }
    }
}
```


The following example show the results of the simulation of the previous script:
```shell
$> itools action-simulator --case-file $HOME/eurostag-tutorial.xiidm --dsl-file $HOME/actions.groovy
Loading network '$HOME/eurostag-tutorial.xiidm'
Loading DSL 'file:$HOME/actions.groovy'
Using 'loadflow' rules engine
Starting pre-contingency analysis
    Round 0
        No more violation
Starting post-contingency 'HV_line_1' analysis
    Round 0
        Violations:
+---------------+-------+---------+--------------+----------------+-----------------+-----------+----------+------------------+----------------+
| Equipment (2) | End   | Country | Base voltage | Violation type | Violation name  | Value     | Limit    | abs(value-limit) | Loading rate % |
+---------------+-------+---------+--------------+----------------+-----------------+-----------+----------+------------------+----------------+
| NHV1_NHV2_2   | VLHV1 | FR      |          380 | CURRENT        | Permanent limit | 1008.9287 | 500.0000 |         508.9287 |         201.79 |
| NHV1_NHV2_2   | VLHV2 | FR      |          380 | CURRENT        | Permanent limit | 1047.8258 | 500.0000 |         547.8258 |         209.57 |
+---------------+-------+---------+--------------+----------------+-----------------+-----------+----------+------------------+----------------+
        Rule 'apply_shedding_for_line_2' evaluated to TRUE
        Applying action 'load_shed_100'
    Round 1
        Violations:
+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
| Equipment (2) | End   | Country | Base voltage | Violation type | Violation name  | Value    | Limit    | abs(value-limit) | Loading rate % |
+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
| NHV1_NHV2_2   | VLHV1 | FR      |          380 | CURRENT        | Permanent limit | 831.3489 | 500.0000 |         331.3489 |         166.27 |
| NHV1_NHV2_2   | VLHV2 | FR      |          380 | CURRENT        | Permanent limit | 871.7283 | 500.0000 |         371.7283 |         174.35 |
+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
        Rule 'apply_shedding_for_line_2' evaluated to TRUE
        Applying action 'load_shed_100'
    Round 2
        Violations:
+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
| Equipment (2) | End   | Country | Base voltage | Violation type | Violation name  | Value    | Limit    | abs(value-limit) | Loading rate % |
+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
| NHV1_NHV2_2   | VLHV1 | FR      |          380 | CURRENT        | Permanent limit | 667.6796 | 500.0000 |         167.6796 |         133.54 |
| NHV1_NHV2_2   | VLHV2 | FR      |          380 | CURRENT        | Permanent limit | 711.4252 | 500.0000 |         211.4252 |         142.29 |
+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
        Rule 'apply_shedding_for_line_2' evaluated to TRUE
        Applying action 'load_shed_100'
    Round 3
        Violations:
+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
| Equipment (2) | End   | Country | Base voltage | Violation type | Violation name  | Value    | Limit    | abs(value-limit) | Loading rate % |
+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
| NHV1_NHV2_2   | VLHV1 | FR      |          380 | CURRENT        | Permanent limit | 516.0706 | 500.0000 |          16.0706 |         103.21 |
| NHV1_NHV2_2   | VLHV2 | FR      |          380 | CURRENT        | Permanent limit | 566.1081 | 500.0000 |          66.1081 |         113.22 |
+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
        Max number of iterations reached
Starting post-contingency 'HV_line_2' analysis
    Round 0
        Violations:
+---------------+-------+---------+--------------+----------------+-----------------+-----------+-----------+------------------+----------------+
| Equipment (2) | End   | Country | Base voltage | Violation type | Violation name  | Value     | Limit     | abs(value-limit) | Loading rate % |
+---------------+-------+---------+--------------+----------------+-----------------+-----------+-----------+------------------+----------------+
| NHV1_NHV2_1   | VLHV1 | FR      |          380 | CURRENT        | Permanent limit | 1008.9287 | 1000.0000 |           8.9287 |         100.89 |
| NHV1_NHV2_1   | VLHV2 | FR      |          380 | CURRENT        | Permanent limit | 1047.8258 | 1000.0000 |          47.8258 |         104.78 |
+---------------+-------+---------+--------------+----------------+-----------------+-----------+-----------+------------------+----------------+
        Rule 'apply_shedding_for_line_1' evaluated to TRUE
        Applying action 'load_shed_100'
    Round 1
        No more violation
Final result
Pre-contingency violations:
+--------+---------------+-----+---------+--------------+----------------+----------------+-------+-------+------------------+----------------+
| Action | Equipment (0) | End | Country | Base voltage | Violation type | Violation name | Value | Limit | abs(value-limit) | Loading rate % |
+--------+---------------+-----+---------+--------------+----------------+----------------+-------+-------+------------------+----------------+
Post-contingency limit violations:
+-------------+----------+---------------+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
| Contingency | Status   | Action        | Equipment (2) | End   | Country | Base voltage | Violation type | Violation name  | Value    | Limit    | abs(value-limit) | Loading rate % |
+-------------+----------+---------------+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
| HV_line_1   | converge |               | Equipment (2) |       |         |              |                |                 |          |          |                  |                |
|             |          | load_shed_100 |               |       |         |              |                |                 |          |          |                  |                |
|             |          | load_shed_100 |               |       |         |              |                |                 |          |          |                  |                |
|             |          | load_shed_100 |               |       |         |              |                |                 |          |          |                  |                |
|             |          |               | NHV1_NHV2_2   | VLHV1 | FR      |          380 | CURRENT        | Permanent limit | 516.0706 | 500.0000 |          16.0706 |         103.21 |
|             |          |               | NHV1_NHV2_2   | VLHV2 | FR      |          380 | CURRENT        | Permanent limit | 566.1081 | 500.0000 |          66.1081 |         113.22 |
+-------------+----------+---------------+---------------+-------+---------+--------------+----------------+-----------------+----------+----------+------------------+----------------+
```

# Maven configuration
To use the `action-simulator` command, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-action-dsl</artifactId>
    <version>${powsybl.version}</version>
</dependency>
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-action-simulator</artifactId>
    <version>${powsybl.version}</version>
</dependency>
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-action-util</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```

# Load-flow implementations
Read this [documentation](http://rte-france.github.io/hades2/index.html) page to learn how to configure powsybl to use
Hades2, a RTE load-flow tool, for remedial action simulations.