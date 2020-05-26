---
layout: default
---

# Getting started

* TOC
{:toc}

## Installation from binaries

Start by downloading the [latest version of a PowSyBl distribution](../../download/index.#downloading-a-basic-powsybl-distribution).
Unzip the downloaded package. You can now add `${INSTALL_DIR}/powsybl/bin` to your environment variable `$PATH`.

You can now use itools commands in your terminal:

```
$> itools --help
usage: itools [OPTIONS] COMMAND [ARGS]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name

Available commands are:

Computation:
    compare-security-analysis-results        Compare security analysis results
    loadflow                                 Run loadflow
    loadflow-validation                      Validate load-flow results of a network
    security-analysis                        Run security analysis

Data conversion:
    convert-network                          convert a network from one format to another

Misc:
    plugins-info                             List the available plugins

Script:
    run-script                               run script (only groovy is supported)

```

## Installation from sources



## Run 1st iTools command

### Available features

After installing your powsybl distribution, you will be able to use the following itools commands:

**Computation**
- [`compare-security-analysis-results`](../404.md)
- [`loadflow`](itools/loadflow.md)
- [`loadflow-validation`](../404.md)
- [`security-analysis`](itools/security-analysis.md)


**Data conversion**
- [`convert-network`](itools/convert-network.md)

**Misc**
- [`plugins-info`](../404.md)

**Script**
- [`run-script`](itools/run-script.md)

### Examples

#### Converting an UCTE network file to XIIDM

#### Update an XIIDM network file after running a load-flow

## Going further
- [Itools commands](itools/index.md)
- [PowSyBl artifacts](../developer/artifacts.md)
- [Tutorial to create your own custom itools command](../developer/tutorials/itools-command.md)
- [Tutorial to create your own itools packager](../developer/tutorials/itools-packager.md)
