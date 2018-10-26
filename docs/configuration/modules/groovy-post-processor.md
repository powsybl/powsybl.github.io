---
title: groovy-post-processor
layout: default
---

The `groovy-post-processor` module is used by the [GroovyScriptPostProcessor](../../iidm/importer/post-processor/GroovyScriptPostProcessor.md)
which is an implementation of the [ImportPostProcessor](../../iidm/importer/post-processor/index.md) interface that runs
a groovy script after an IIDM network is loaded.

# Optional properties

## script
The `script` property is an optional property that defines the groovy script to apply to the imported IIDM network. This
path must be an absolute path. If this property is not set, the first `import-post-processor.groovy` found in the
[configuration folders](../itools.md#powsybl_config_dirs) will be used.

# Examples

## YAML
```yaml
groovy-post-processor:
    script: /tmp/my-script.groovy
```

## XML
```xml
<groovy-post-processor>
    <script>/tmp/my-script.groovy</script>
</groovy-post-processor>
```
