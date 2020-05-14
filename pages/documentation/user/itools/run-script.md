---
layout: default
---

# iTools run-script

The `run-script` command is used to run scripts based on PowSyBl.
 
## Usage
```
$> itools run-script --help
usage: itools [OPTIONS] run-script --file <FILE> [--help]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name

Available arguments are:
    --file <FILE>   the script file
    --help          display the help and quit
```

### Required arguments

**\-\-file**  
This option defines the path of the script to execute. Current, only Groovy scripts are supported.

## Groovy extensions
<span style="color: red">TODO</span>

## Examples
The following example shows how to run a simple HelloWorld script

**Content of the hello.groovy file:**
```
$> cat hello.groovy
print 'Hello ' + args[0]
```

To run this script, pass this file to the `--file` argument:
```
$> itools run-script hello.groovy John
Hello John
```

# See also
- [Create a Groovy extension](): Learn how to create a groovy extension to use it with the `run-script` command
