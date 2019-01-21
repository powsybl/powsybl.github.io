---
title: How to write an import post processor
layout: default
---

`ImportPostProcessor` is an interface that can be used to modify a network model, right after it's been read by an
[importer](../../iidm/importer). Powsybl provides [some implementations](../../iidm/importer/post-processor) of this
interface and allows to create new ones.

In this tutorial you will see how to write a new post processor, for increasing the loads' active power of a network by
a fixed percentage:
- through a Groovy script, using the [groovyScript](../../iidm/importer/post-processor/GroovyScriptPostProcessor.md)
post processor
- through a JavaScript script, using the [javaScript](../../iidm/importer/post-processor/JavaScriptPostProcessor.md)
post processor
- implementing a new import post processor, in a dedicated java module

Groovy script and java module post processor, will also run a loadflow.

# Groovy script (for the groovy script post processor)

The Groovy script can be found [here](https://github.com/powsybl/powsybl-tutorials).

You have to:

1. Write a `Groovy` script that implements the processor's business logic.

```groovy
package com.powsybl.samples.groovyScriptPostProcessor

import com.powsybl.iidm.network.Load
import com.powsybl.iidm.network.Network
import com.powsybl.loadflow.LoadFlowFactory
import com.powsybl.loadflow.LoadFlowParameters
import com.powsybl.commons.config.ComponentDefaultConfig

println "Imported Network's Data: Network Id: " + network.getId()
    + "    Generators: " + network.getGeneratorCount()
    + "    Lines: " + network.getLineCount()
    + "    Loads: " + network.getLoadCount()
println ""

// change the network
def percent = 1.01

println "Dump LOADS"
println "id\tp\tp+1%"
network.getLoads().each { load ->
    if (load.getTerminal != null) {
        def currentValue = load.getTerminal().getP()
    	load.getTerminal().setP(currentValue * percent)
    	def newVal = load.getTerminal().getP()
    	
    	println load.getId() + "\t" + currentValue + "\t" + newVal
    }
}
println ""

// execute a LF
println "Execute a LF"
def defaultConfig = ComponentDefaultConfig.load()
loadFlowFactory = defaultConfig.newFactoryImpl(LoadFlowFactory.class)
loadFlowParameters = new LoadFlowParameters(LoadFlowParameters.VoltageInitMode.UNIFORM_VALUES)
loadFlow = loadFlowFactory.create(network, computationManager, 0)
result = loadFlow.run(network.getVariantManager().getWorkingVariantId(),loadFlowParameters).join()

println "LF results - converge: " + result.ok + " ; metrics: " + result.getMetrics()
```

Note that this script uses the `network` variable, that is automatically binded to the network that has been previously
loaded. The `ComponentDefaultConfig` class provides configuration loaded from the
[powsybl configuration file](../../configuration/modules/componentDefaultConfig.md). In this example, we use the
configuration to get the loadflow implementation to use.

2. Declare the `groovyScript` post processor in your configuration file:

### YAML
```yaml
import:
        postProcessors: groovyScript
```

### XML
```xml
<import>
	<postProcessors>groovyScript</postProcessors>
</import>
```

and configure the groovy script's path to use in the [groovy-post-processor](../../configuration/modules/groovy-post-processor.md)
module section, also in the configuration file:

### YAML
```yaml
groovy-post-processor:
       script: /home/user/increase-active-power-postprocessor.groovy
```

### XML
```xml
<groovy-post-processor>
	<script>/home/user/increase-active-power-postprocessor.groovy</script>
</groovy-post-processor>
```

3. Configure the `loadFlow`

The configuration for the loadflow is also defined in [powsybl configuration file](../../configuration/modules/index.md).
The loadflow implementation to use is read from the `LoadFlowFactory` property of the `componentDefaultConfig` section.
Here is an example of a minimal configuration for a mock loadflow (i.e. an implementation that does nothing on the network).

### YAML
```yaml
componentDefaultConfig:
      LoadFlowFactory: com.powsybl.loadflow.mock.LoadFlowFactoryMock
```

### XML
```xml
<componentDefaultConfig>
    <LoadFlowFactory>com.powsybl.loadflow.mock.LoadFlowFactoryMock</LoadFlowFactory>
</componentDefaultConfig>
```

If you want to execute a true computation, you should configure a 'real' loadflow implementation. Please refer to this
documentation [page](https://rte-france.github.io/hades2/index.html) to learn how to configure powsybl to use RTE's
implementation.

# Java script (for the JavaScript post processor)

The JavaScript code can be found [here](https://github.com/powsybl/powsybl-tutorials).

1. Write a `JavaScript` code that implements the processor's business logic.

```javascript
var debug = true; 

function increaseLoadActivePower(load, percent) {
	if (load != null) {
		var p = load.getTerminal().getP();
		load.getTerminal().setP(p * percent);
		if (debug)
			print("Load id: "+load.getId() +" Increase load active power, from " + p + " to " +  load.getTerminal().getP());
	}
        
}

var percent = 1.01;

if (network == null) {
    throw new NullPointerException()
}

for each (load in network.getLoads()) {
    increaseLoadActivePower(load , percent); 
}
```

Note that this script uses the `network` variable, that is automatically binded to the network that has been previously
loaded.

2. Declare the javaScript post processor in your configuration file:

### YAML
```yaml
import:
    postProcessors: javaScript
```

### XML
```xml
<import>
    <postProcessors>javaScript</postProcessors>
</import>
```

and configure the javaScript code's path to use in the [javascript-post-processor](../../configuration/modules/javaScriptPostProcessor.md)
module section, also in the configuration file:

### YAML
```yaml
javaScriptPostProcessor:
       script: /home/user/increase-active-power-postprocessor.js
```

### XML
```xml
<javaScriptPostProcessor>
  <script>/home/user/increase-active-power-postprocessor.js</script>
</javaScriptPostProcessor>
```

# Java implementation

In order to implement a `PostProcessor` in Java, you have to:

1. Write an implementation of `com.powsybl.iidm.import_.ImportPostProcessor` interface and declare it as a service, using
the `@AutoService` annotation.
2. Compile your project, add the jar to your powsybl installation.
3. Add the new post processor to the configuration file.

Here is an empty class template that implements `com.powsybl.iidm.import_ImportPostProcessor` interface, where you will
put the code to increase loads active power of the network.

```java
import com.google.auto.service.AutoService;
import com.powsybl.computation.ComputationManager;
import com.powsybl.iidm.import_.ImportPostProcessor;
import com.powsybl.iidm.network.Network;

@AutoService(ImportPostProcessor.class)
public class IncreaseActivePowerPostProcessor implements ImportPostProcessor {

    @Override
    public String getName() {
        return null;
    }

    @Override
    public void process(Network network, ComputationManager computationManager) {
    }
}
```

You have to declare the class as a service implementation, using `@Autoservice` annotation. This will allow you to have
the new post processor available and recognized by the platform.

The methods of the `ImportPostProcessor` interface to override in your class are:
- the `getName` method, that returns the processor's name; it must be used to configure it.
- the `process` method, that executes the processing on the imported network

```java
@AutoService(ImportPostProcessor.class)
public class IncreaseActivePowerPostProcessor implements ImportPostProcessor {

    private static final Logger LOGGER = LoggerFactory.getLogger(IncreaseActivePowerPostProcessor.class);
    
    private static final String NAME = "increaseActivePower";
    
    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void process(Network network, ComputationManager computationManager) {
    	Objects.requireNonNull(network);
        LOGGER.info("Execute {} post processor on network {}", getName(), network.getId());
        
        double percent = 1.01;
        LOGGER.info("Dump LOADS");
        LOGGER.info("id\tp\tp+1%");
        network.getLoadStream().forEach(load -> {
        	if (load.getTerminal() != null) {
        		double p = load.getTerminal().getP();
        		load.getTerminal().setP(p * percent);
        		LOGGER.info("{}\t{}\t{}", load.getId(), p, load.getTerminal().getP());
        	}
        });
        
        LOGGER.info("Execute loadFlow");
        ComponentDefaultConfig defaultConfig = ComponentDefaultConfig.load();
        LoadFlowParameters loadFlowParameters = new LoadFlowParameters(LoadFlowParameters.VoltageInitMode.UNIFORM_VALUES);
        LoadFlow loadFlow = defaultConfig.newFactoryImpl(LoadFlowFactory.class).create(network, computationManager, 0);
        LoadFlowResult results = loadFlow.run(network.getVariantManager().getWorkingVariantId(), loadFlowParameters).join();
        LOGGER.info("LF results - converge: {} ; metrics {} ", results.isOk(), results.getMetrics().toString());
    }
}
```

The `process` method is in charge of executing your processing, implementing your business logic. The `network` parameter
provides access to the imported network (see `com.powsybl.iidm.network.Network` class), you can work on it using the IIDM
API. In the sample code we use it to get the list of all network loads, using the `network.getLoads()` method.

The `computationManager` parameter provides you access to the computation platform. It can be used to distribute the
computation (e.g. if you need to run a loadflow on the imported network, or some other kind of heavy computation).

The rest of the code in our sample class, increases of 1% the active power of each load, using the IIDM API, and log old
and updated values. For the logging we use the `org.slf4j.Logger` class.

JavaPostProcessor requires the following dependencies:
- `com.google.auto.service`: configuration/metadata generator for `java.util.ServiceLoader`-style service providers.
- `powsybl-iidm-converter-api`: API to import and export IIDM network.
- `powsybl-loadflow-api`: API to run loadflow.

If you use maven, add them to your `pom.xml` file:
```xml
<dependency>
    <groupId>com.google.auto.service</groupId>
    <artifactId>auto-service</artifactId>
    <version>1.0-rc2</version>
</dependency>
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-converter-api</artifactId>
    <version>${powsybl.version}</version>	
</dependency>
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-loadflow-api</artifactId>
    <version>${powsybl.version}</version>	
</dependency>
```

In your project you also need to add the other dependencies required by your post processor business logic implementation.

## Build and update your installation with the new post processor

To build your post processor, run the following command:
```bash
$> mvn package
```

The generated jar will be located under the target folder of your project. Copy the generated jar to `share/java/` folder
of your powsybl distribution (you might need to copy in this directory other dependencies jars, specific to your new post
processor).

In order to enable the post processor, you must declare its name in the [configuration file](../../configuration/modules/index.md):
add the NAME specified for your processor to the `postProcessors` property of the `import` module. In our example it will
be `increaseActivePower`.

### YAML
```yaml
import:
    postProcessors: increaseActivePower
```

```xml
<import>
    <postProcessors>increaseActivePower</postProcessors>
</import>
```

In the example above, there is just one post processor enabled. More processors names can be specified in the `postProcessors`
property, as a comma separated list.

Before testing your post processor `increaseActivePower`, you must configure a load flow implementation in [powsybl
configuration file](../../configuration/modules/index.md). The loadflow implementation to use is read from the `LoadFlowFactory`
property of the `componentDefaultConfig` section. Here is an example of a minimal configuration for a mock loadflow (i.e.
an implementation that does nothing on the network).

### YAML
```yaml
componentDefaultConfig:
      LoadFlowFactory: com.powsybl.loadflow.mock.LoadFlowFactoryMock
```

### XML
```xml
<componentDefaultConfig>
    <LoadFlowFactory>com.powsybl.loadflow.mock.LoadFlowFactoryMock</LoadFlowFactory>
</componentDefaultConfig>
```

If you want to execute a true computation, you should configure a 'real' loadflow implementation. Please refer to this
documentation [page](https://rte-france.github.io/hades2/index.html) to learn how to configure powsybl to use RTE's
implementation.

# Test
In order to execute the new post processor run a command that involve a network import, for instance run the
[convert-network](../../tools/convert-network.md) command:
```bash
$> cd <POWSYBL_HOME>/bin
$> ./itools convert-network --input-file network.xiidm --output-format XIIDM --output-file /tmp/network.xiidm
```

The log file will show:

```markdown
- Imported newtwork file: network.xiidm imported

- Network Id: (networkId) Generators: (numGenerators) Lines: (numLines) Loads: (numLoads)

- Dump LOADS: 

list of id | p | p+1%

- LF results - converge:true ; metrics: [:]
```

The converted network, will have the active power of all loads increased by 1%.

