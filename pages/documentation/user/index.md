---
layout: default
---

# Getting started

* TOC
{:toc}

## Introduction

Follow these simple steps to get familiar with the PowSyBl environment. Below are instructions to install a 
basic PowSyBl distribution and to start running iTools commands.

Please note that this PowSyBl distribution is functional on Windows and Linux but
is not supported for MacOS yet.

## Installation from binaries

Start by downloading the [latest version of a PowSyBl distribution](../../download/index.md).
Unzip the downloaded package. You can now add `<INSTALL_DIR>/powsybl-distribution-<LATEST_VERSION>/bin` to your environment variable `PATH`.

You can now use iTools commands in your terminal:

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
**Optional**: You can set a default configuration by copying the provided configuration file in the `.itools` repository
in your `HOME` (note that you will need to create this repository if it does not exist):
```
$ mkdir <HOME>/.itools
$ cp <INSTALL_DIR>/resources/config/config.yml <HOME>/.itools/config.yml
```
This step is not mandatory **if you already have a custom configuration file and the necessary configuration modules are filled**.
For more information, go to the [documentation page of the configuration](configuration/index.md).

## Installation from sources

It is also possible to install PowSyBl distribution from sources.

First download the sources of [`powsybl-distribution` repository](https://github.com/powsybl/powsybl-distribution):
```
$ git clone https://github.com/powsybl/powsybl-distribution.git
```
If you want to work on a stable version, go to [the latest release tag](https://github.com/powsybl/powsybl-distribution/releases/latest):
```
$ git checkout tags/<LATEST_RELEASE_TAG> -b latest-release
```

Generate a basic PowSyBl distribution by launching from the root repository:
```
$ cd <PROJECT_ROOT_PATH>
$ mvn clean package
```

The distribution is generated in `<PROJECT_ROOT_PATH>/target`. You can then add `<PROJECT_ROOT_PATH>/target/powsybl-distribution-<powsybldistribution.version>/bin`
to your environment variable `PATH`.

You can now use iTools commands in your terminal:

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
**Optional**: You can set a default configuration by copying the provided configuration file in the `.itools` repository
in your `HOME` (note that you will need to create this repository if it does not exist):
```
$ mkdir <HOME>/.itools
$ cp <PROJECT_ROOT_PATH>/resources/config/config.yml <HOME>/.itools/config.yml
```
This step is not mandatory **if you already have a custom configuration file and the necessary configuration modules are filled**.
For more information, go to the [documentation page of the configuration](configuration/index.md).

**NB**: The pom file used to generate a basic PowSyBl distribution from the sources can be extended in order for the distribution to
allow for more features (even custom features). For more information about how to do it,
go to the [tutorial to create your own iTools packager](../developer/tutorials/itools-packager.md).

## Run 1st iTools command

Once your PowSyBl distribution is installed, you will be able to run iTools commands. The `iTools` script provides a command-line interface to interact with PowSyBl.
In other words, you will be able to run command lines from your terminal to use some features from PowSyBl. For more information,
go to the [documentation page of iTools command](itools/index.md).

### Available features

The available iTools commands in a basic PowSyBl distribution (installation guide described above) are the following:


- [`compare-security-analysis-results`](itools/compare-security-analysis-results.md): Compare results of two security analyses (their violations pre and post contingencies)
- [`convert-network`](itools/convert-network.md): Convert a file describing a network in a given format into another format
- [`loadflow`](itools/loadflow.md): Run a load-flow on a network imported from a file
- [`loadflow-validation`](itools/loadflow-validation.md): Check if a load-flow's results (voltages, angles, flows...) are valid
- [`security-analysis`](itools/security-analysis.md): Run a security analysis on a network imported from a file
- [`plugins-info`](): List the available implementations for each plugins
- [`run-script`](itools/run-script.md): Run a script based on PowSyBl

### Examples

#### Converting a UCTE network file to XIIDM

In this example, you will convert a UCTE file describing the Belgian network to XIIDM format.
The `beTestGridForMerging.uct` file available in `<INSTALL_DIR>/resources/UCTE` repository will be used.

Run the following command:
```
$ itools convert-network --input-file <INSTALL_DIR>/resources/UCTE/beTestGridForMerging.uct --output-file <HOME>/beTestGridForMerging --output-format XIIDM
Loading network '<INSTALL_DIR>/resources/UCTE/beTestGridForMerging.uct'
Generating file <HOME>/beTestGridForMerging.xiidm...
```

Once the command is completed, the XIIDM file describing the Belgian network will be present as `beTestGridForMerging.xiidm` in your `HOME` repository.

#### Update an XIIDM network file after running a load-flow

In this example, you will update an XIIDM file describing the example Eurostag network after running a load-flow using `powsybl-open-loadflow`.
The `eurostag-tutorial-example1.xml` file available in `<INSTALL_DIR>/resources/XIIDM` repository. Please note that this will permanently
change the file. In order to keep it, you can start by copying it:
```
$ cp <INSTALL_DIR>/resources/XIIDM/eurostag-tutorial-example1.xml <INSTALL_DIR>/resources/XIIDM/eurostag-tutorial-example1.xiidm
```

Run the following command:
```
$ itools loadflow --case-file <INSTALL_DIR>/resources/XIIDM/eurostag-tutorial-example1.xiidm --output-case-file <INSTALL_DIR>/resources/XIIDM/eurostag-tutorial-example1.xiidm --output-case-format XIIDM
Loading network '<INSTALL_DIR>/resources/XIIDM/eurostag-tutorial-example1.xiidm'
loadflow results:
+--------+----------------------------------------------------------------------------------------+
| Result | Metrics                                                                                |
+--------+----------------------------------------------------------------------------------------+
| true   | {nbIter=5, dureeCalcul=9.25E-4, cause=0, contraintes=0, statut=OK, csprMarcheForcee=0} |
+--------+----------------------------------------------------------------------------------------+
```

Once the command is completed, the `eurostag-tutorial-example1.xiidm` file will be updated to contain post load-flow results, including calculated bus voltage, calculated bus angles and calculated flows.

## Going further
- [About Configuration](configuration/index.md)
- [About iTools commands](itools/index.md)
- [About PowSyBl artifacts](../developer/artifacts.md)
- [Tutorial to create your own custom iTools command](../developer/tutorials/itools-command.md)
- [Tutorial to create your own iTools packager](../developer/tutorials/itools-packager.md)
