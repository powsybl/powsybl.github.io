---
title: GroovyScriptPostProcessor
layout: default
---

The `com.powsybl.iidm.import_.GroovyScriptPostProcessor` class is an implementation of the `com.powsybl.iidm.import_.ImportPostProcessor`
interface that runs a Groovy script after a IIDM network is loaded.

The groovy script has access to two variables:
- `network` : the IIDM network instance
- `computationManager` : a computation manager instance to use to run simulation

# Configuration
To activate the `GroovyScriptPostProcessor`, add `groovyScript` to the `postProcessors` property of the [import](../../../configuration/modules/import.md)
module.

Read the [groovy-post-processor](../../../configuration/modules/groovy-post-processor.md) documentation to learn how to
set the path of the groovy script.

### YAML
```yaml
import:
    postProcessors: groovyScript
    
groovy-post-processor:
    script: /tmp/script.groovy
```

```xml
<import>
    <postProcessors>groovyScript</postProcessors>
</import>

<groovy-post-processor>
    <script>/tmp/script.groovy</script>
</groovy-post-processor>
```

# Examples
The following example prints meta-information from the network:
```groovy
println "Network " + network.getId() + " (" + network.getSourceFormat()+ ") is imported"
```

Read this [tutorial](../../../todo.md) to learn how to write more complex groovy script.

# Maven configuration
To use the Groovy post processor, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-converter-api</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```