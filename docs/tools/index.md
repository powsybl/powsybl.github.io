---
title: iTools
layout: default
---

The `iTools` script provides a common way to interact with powsybl, using the command line.

# Usage
```shell
itools
usage: itools [OPTIONS] COMMAND [ARGS]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name
    --parallel                    Run command in parallel mode

Available commands are:
...
```

## Options

### config-name
Use the `--config-name` parameter to set the configuration file's basename. This basename is used to find the configuration
file in the specified `iTools` configuration directory.

### parallel
Use the `--parallel` parameter to run the command in parallel. This option is supported by only few commands.

# Available commands
The `iTools` commands are discovered at runtime: depending of the jars present in the classpath, some commands could be
unavailable. The commands are classified in themes, to help identifying their purpose.
   
| Theme | Command | Description |
| ----- | ------- | ----------- |
| Application file system | [afs]() | Application File System CLI |
| Computation | [action-simulator]() | Run a remedial actions simulation |
| Computation | [loadflow]() | Run a loadflow computation |
| Computation | [loadflow-validation]() | Validate the load-flow results of a network |
| Computation | [run-impact-analysis]() | Run an impact analysis |
| Computation | [security-analysis]() | Run a security analysis |
| Computation | [sensitivity-computation]() | Run a sensitivity computation |
| Data conversion | [convert-network](convert-network.html) | Convert a network from one format to another |
| MPI statistics | [export-tasks-statistics]() | Export the tasks statistics to CSV file |
| Script | [run-script]() | Run a script |
| Misc | [plugins-info]() | Displays the available plugins |

# Learn more
Read this [page](../configuration/itools.html) to learn how to configure the framework and this [page](../configuration/logback.md)
to learn how to set up the logging system used in powsybl.

Read this [tutorial](../../tutorials/itools/howto-extend-itools.html) to learn how to create a new `iTools` command.
