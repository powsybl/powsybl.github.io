---
title: JavaScriptPostProcessor
layout: default
---

The `com.powsybl.iidm.import_.JavaScriptPostProcessor` class is an implementation of the `com.powsybl.iidm.import_.ImportPostProcessor`
interface that runs a JS script after a IIDM network is loaded.

The JS script has access to two variables:
- `network` : the IIDM network instance
- `computationManager` : a computation manager instance to use to run simulation


# Configuration
To activate the `JavaScriptPostProcessor`, add `javaScript` to the `postProcessors` property of the [import](../../../configuration/modules/import.md)
module.

Read the [javaScriptPostProcessor](../../../configuration/modules/javaScriptPostProcessor.md) documentation to learn how to
set the path of the JS script.

### YAML
```yaml
import:
    postProcessors: javaScript
    
groovy-post-processor:
    script: /tmp/script.js
```

```xml
<import>
    <postProcessors>javaScript</postProcessors>
</import>

<groovy-post-processor>
    <script>/tmp/script.js</script>
</groovy-post-processor>
```

# Examples
The following example prints meta-information from the network:
```javascript
print("Network " + network.getId() + " (" + network.getSourceFormat()+ ") is imported");
```

Read this [tutorial](../../../todo.md) to learn how to write more complex JS script.

# Maven configuration
To use the Groovy post processor, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-converter-api</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
