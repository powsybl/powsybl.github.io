---
title: convert-network
layout: default
---

The `convert-network` command is used to import a network from a file and to export it to another file, in the specified
format. The format of the input file is automatically detected where as the format of the output file must be specified
in the command line.

After the network is loaded, a modification script can be applied, depending on the configuration file or if the
`--groovy-script` parameter is set.

# Usage
```shell
$> itools convert-network --help
usage: itools [OPTIONS] convert-network [-E <property=value>]
       [--export-parameters <EXPORT_PARAMETERS>] [--groovy-script <FILE>]
       [--help] [-I <property=value>] [--import-parameters <IMPORT_PARAMETERS>]
       --input-file <INPUT_FILE> --output-file <OUTPUT_FILE> --output-format
       <OUTPUT_FORMAT>

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name

Available arguments are:
 -E <property=value>                          use value for given exporter
                                              parameter
    --export-parameters <EXPORT_PARAMETERS>   the exporter configuration file
    --groovy-script <FILE>                    Groovy script to change the
                                              network
    --help                                    display the help and quit
 -I <property=value>                          use value for given importer
                                              parameter
    --import-parameters <IMPORT_PARAMETERS>   the importer configuation file
    --input-file <INPUT_FILE>                 the input file
    --output-file <OUTPUT_FILE>               the output file
    --output-format <OUTPUT_FORMAT>           the output file format

Where OUTPUT_FORMAT is one of [XIIDM, AMPL]
```

## Required parameters

### input-file
Use the `--input-file` parameter to specify the path of the input file. 

### output-file
Use the `--output-file` parameter to specify the path of the output file.

### output-format
Use the `--output-format` parameter to specify the exporter to use for the export 

## Optional parameters

### export-parameters
Use the `--export-parameters` parameter to specify the path of the configuration file of the exporter. It is possible to
overload one or many parameters using the `-E property=value` parameter. The properties depend on the output format.
Refer to the documentation page of each [exporter](../iidm/exporter/index.md) to know their specific configuration.

### groovy-script
Use the `--groovy-script` parameter to specify the path of the modification script to use after the loading of the network.

### import-parameters
Use the `--import-parameters` parameter to specify the path of the configuration file of the importer. It is possible to
overload one or many parameters using the `-I property=value` parameter. The properties depend on the input format.
Refer to the documentation page of each [importer](../iidm/importer/index.md) to know their specific configuration.

# Examples

This example shows how to convert a [UCTE-DEF](../iidm/importer/ucte.md) file to a [XIIDM](../iidm/exporter/iidm.md) file:
```shell
$> itools convert-network --input-file $HOME/case-file.uct --output-format XIIDM --output-file $HOME/case-file.xiidm
```

This example shows how to overload the exporter's configuration:
```shell
$> itools convert-network --input-file $HOME/case-file.uct --output-format XIIDM --output-file $HOME/case-file.xiidm --export-parameters $HOME/XIIDMExporter.properties -E iidm.export.xml.indent=false
```

This example shows how to modify a network with a groovy script:
```shell
$> itools convert-network --input-file $HOME/case-file.xiidm --output-format XIIDM --output-file $HOME/case-file.xiidm --groovy-script $HOME/script.groovy
```

# Maven configuration
To use the `convert-network` command, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-converter-api</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```

Read the [importer](../iidm/importer/index.md) and [exporter](../iidm/exporter/index.md) documentation pages to learn
more about supported formats and their configuration.

# Learn more
Read the [groovy](../iidm/importer/post-processor/GroovyScriptPostProcessor.md)  post processor documentation page to 
learn how to modify the imported network once it has been loaded.
