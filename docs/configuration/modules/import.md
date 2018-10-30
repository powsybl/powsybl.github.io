---
title: import
layout: default
---

The `import` module is used by the `com.powsybl.iidm.import_.Importers` class, after a case is loaded. A
[post processor](../../iidm/importer/post-processor/index.md) is a class used to modify a network after its loading:
- [GroovyPostProcessor](../../iidm/importer/post-processor/GroovyScriptPostProcessor.md): to run a groovy script 
- [JavaScriptPostProcessor](../../iidm/importer/post-processor/JavaScriptPostProcessor.md) to run a javascript script
- [LoadFlowResultsCompletion](../../iidm/importer/post-processor/LoadFlowResultsCompletionPostProcessor.md) to complete
missing P, Q, V and angle values

Other post-processors might be available in the platform: the [plugins-info](../../tools/plugins-info.md) command can be
used to list the available implementations. 

# Optional properties

## postProcessors
The `postProcessors` property is an optional property that defines the list of `com.powsybl.iidm.import_.ImportPostProcessor`
names. The default value of this property is an empty list.

# Examples

## YAML
```yaml
import:
    postProcessors:
        - groovyScript
        - javaScript
```

## XML
```xml
<import>
    <postProcessors>groovyScript,javaScript</postProcessors>
</import>
```
