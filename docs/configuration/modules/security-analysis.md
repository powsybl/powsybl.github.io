---
title: security-analysis-config
layout: default
---

The `security-analysis` module is used to configure the execution of the
[security-analysis](../../tools/security-analysis.md) tool.

# Required properties

# Optional property

## preprocessor
The `preprocessor` property is an optional property which requires that the `SecurityAnalysisPreprocessor` with specified name is used to preprocess inputs, based on the contingencies file, before actually running the security analysis.

If absent, the default behaviour of the tool is used : the contingencies file is simply interpreted by the configured `ContingenciesProvider`.

# Examples

## YAML
```yaml
security-analysis:
    preprocessor: my_custom_preprocessor_name
```

## XML
```xml
<security-analysis>
    <preprocessor>my_custom_preprocessor_name</preprocessor>
</security-analysis>
```
