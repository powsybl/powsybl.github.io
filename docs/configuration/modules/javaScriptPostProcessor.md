---
title: javaScriptPostProcessor
layout: default
---

The `javaScriptPostProcessor` module is used by the `com.powsybl.iidm.import_.JavaScriptPostProcessor` class, which is
an implementation of the `com.powsybl.iidm.import_.ImportPostProcessor` that runs a javascript script after a case is
converted to an IIDM network.

# Optional properties

## printToStdOut
The `printToStdOut` is an optional property that defines if the output of the script ot the standard output stream. The
default value of this property is `true`.

## script
The `script` property is an optional property that defines the absolute path of the javascript script to apply to use.
The default value of this property is `import-post-processors.js`. This file is read from the
[powsybl configuration folder](../itools.md#powsybl_config_dirs).

# Examples

## YAML
```yaml
javaScriptPostProcessor:
    printToStdOut: true
    script: /tmp/my-script.js
```

## XML
```xml
<javaScriptPostProcessor>
    <printToStdOut>true</printToStdOut>
    <script>/tmp/my-script.js</script>
</javaScriptPostProcessor>
```
