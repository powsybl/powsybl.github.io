---
title: import-export-parameters-default-value
layout: default
---

The `import-export-parameters-default-value` module is an optional module used by the `com.powsybl.iidm.import_.Importers`
class to initialize the parameters passed to configure the importer. This module support 3 different types of properties:
- Boolean
- String
- List of String

As the parameters are different from an importer to another, it is impossible to give an exhaustive list of supported
properties. Please refer to the documentation of each [importer](../../iidm/importer/index.md) and of each [exporter](../../iidm/exporter/index.md) to know their specific
configuration.

# Examples

## YAML
```yaml
import-export-parameters-default-value:
    iidm.import.xml.throw-exception-if-extension-not-found: true
```

## XML
```xml
<import-export-parameters-default-value>
    <iidm.import.xml.throw-exception-if-extension-not-found>true</iidm.import.xml.throw-exception-if-extension-not-found>
</import-export-parameters-default-value>
```
