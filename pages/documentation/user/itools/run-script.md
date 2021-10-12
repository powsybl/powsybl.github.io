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
The `run-script` command relies on a [plugin mechanism]() to load extensions. Those extensions provides utility functions to make the usage of PowSyBl easier through the scripts. It avoids the user to write boilerplate code hiding the technical complexity of framework into more user friendly functions. PowSyBl provides the following extensions to:
- [load a network from a file](#load-a-network) 
- [save a network to a file](#save-a-network)
- [run a power flow simulation](#run-a-power-flow)
- [access to AFS](#access-to-afs)

### Load a network
The `NetworkLoadSaveGroovyScriptExtension` extension adds a `loadNetwork` function to load a network from a file. This function has two parameters:
- the path of the file to load (mandatory)
- a list of properties to configure the [importer](../../glossary.md#importer) (optional). The list of supported properties depends on the [grid format](../../index.html#grid-formats).

In order to benefit from this feature, add `com.powsybl:powsybl-iidm-scripting` to your classpath.

**Example:**
```groovy
network = loadNetwork(filename, parameters)
```

### Save a network
The `NetworkLoadSave` extension adds a `saveNetwork` function to load a network from a file. This function has four parameters:
- the [format](../../index.html#grid-formats) of the output file (mandatory)
- the network object to save (mandatory)
- a list of properties to configure the [exporter](../../glossary.md#exporter) (optional). The list of supported properties depends on the [output grid format](../../index.html#grid-formats).
- the path of the output file (mandatory)

In order to benefit from this feature, add `com.powsybl:powsybl-iidm-scripting` to your classpath.

**Example:**
```groovy
saveNetwork(format, network, parameters, file)
```

### Run a power flow
The `LoadFlow` extension adds a `loadflow` function to run a [power flow](../../simulation/powerflow/index.md) simulation to a network. This function has two parameters:
- the network object (mandatory)
- the [load-flow parameters]() (optional). If this parameter is not set, the parameters are loaded from the the configuration.

In order to benefit from this feature, add `com.powsybl:powsybl-loadflow-scripting` to your classpath.  

**Example:**
```groovy
loadflow(network, parameters)
```

### Access to AFS
The `Afs` extension adds a `afs` variable to the groovy binding that offers a facade to access data stored in [AFS](). This facade has two methods:
- `getFileSystemNames`: this method returns the names of the file system declared in the configuration
- `getRootFolder`: this method returns the root [folder]() of the specified file system. From this root folder, it is possible to navigate in the different folders and open the different projects. 

In order to benefit from this feature, add `com.powsybl:powsybl-afs-scripting` to your classpath.

**Example**
```groovy
fileSystems = afs.getFileSystemNames()
for (String fs : fileSystems) {
    root = afs.getRootFolder(fs)
}
```

## Examples

### Example 1 - Hello World
The following example shows how to run a simple HelloWorld script. Note that the parameters pass to the command line can be accessed using the `args` array. 

**Content of the hello.groovy file:**
```groovy
print 'Hello ' + args[0]
```

To run this script, pass this file to the `--file` argument:
```
$> itools run-script hello.groovy John
Hello John
```

### Example 2 - Run a power flow
The following example shows how to load a network from a file, run a [power flow](../../simulation/powerflow/index.md) simulation and export the modified network to another file. This script is equivalent to the iTools [loadflow](loadflow.md) command.

**Content of the loadflow.groovy file:**
```groovy
import com.powsybl.loadflow.LoadFlowParameters.VoltageInitMode

input_file = args[1]
output_file = args[2]

// Load a network file
network = loadNetwork(input_file)

// Run a power flow, with custom parameters
parameters = new LoadFlowParameters()
parameters.voltageInitMode = VoltageInitMode.DC_VALUES
loadflow(network, parameters)

// Save the network to a file
saveNetwork("XIIDM", network, output_file)
```

To run the previous script, pass the input and output file names: 
```
$> itools run-script loadflow.groovy XIIDM /tmp/case.xiidm /tmp/case-lf.xiidm
```

## Going further
- [Create a Groovy extension](): Learn how to create a groovy extension to use it with the `run-script` command
