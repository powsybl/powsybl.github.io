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

Available commands are:
...
```

## Options

### config-name
Use the `--config-name` parameter to set the configuration file's basename. This basename is used to find the configuration
file in the specified `iTools` configuration directory.

# Available commands
The `iTools` commands are discovered at runtime: depending of the jars present in the classpath, some commands could be
unavailable. The commands are classified in themes, to help identifying their purpose.
   
| Theme | Command | Description |
| ----- | ------- | ----------- |
| Application file system | [afs](afs.md) | Application File System CLI |
| Computation | [action-simulator](action-simulator.md) | Run a remedial actions simulation |
| Computation | [compare-security-analysis-results](compare-security-analysis-results.md) | Compare security analysis results |
| Computation | [loadflow](loadflow.md) | Run a loadflow computation |
| Computation | [loadflow-validation](loadflow-validation.md) | Validate the load-flow results of a network |
| Computation | [run-impact-analysis](run-impact-analysis.md) | Run an impact analysis |
| Computation | [security-analysis](security-analysis.md) | Run a security analysis |
| Computation | [sensitivity-computation](sensitivity-computation.md) | Run a sensitivity computation |
| Data conversion | [convert-network](convert-network.md) | Convert a network from one format to another |
| MPI statistics | [export-tasks-statistics](../todo.md) | Export the tasks statistics to CSV file |
| Script | [run-script](run-script.md) | Run a script |
| Misc | [plugins-info](plugins-info.md) | Displays the available plugins |

# Learn more
Read this [page](../configuration/itools.md) to learn how to configure the framework and this [page](../configuration/logback.md)
to learn how to set up the logging system used in powsybl.

Read this [tutorial](../tutorials/itools/extend-itools.md) to learn how to create a new `iTools` command.
