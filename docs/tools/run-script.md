---
title: run-script
layout: default
todo:
    - create a tutorial to show a groovy script example
---

The `run-script` command is used to run scripts based on powsybl. So far, only Groovy is supported.
 
# Usage
```shell
$> itools run-script --help
usage: itools [OPTIONS] run-script --file <FILE> [--help]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name

Available arguments are:
    --file <FILE>   the script file
    --help          display the help and quit
```

## Required parameters

### file
Use the `--file` parameter to specify the path of the script.

# Example
The following example shows how to run a simple HelloWorld script:
```shell
$> cat hello.groovy
print 'Hello ' + args[0]
```

```shell
$> itools run-script hello.groovy John
Hello John
```

# Maven configuration
To use `run-script` command, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-scripting</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
