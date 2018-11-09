---
title: loadflow-results-completion-parameters
layout: default
---

The `loadflow-results-completion-parameters` module is used by the [loadflow-validation](../../tools/loadflow-validation.md)
command and the [LoadFlowResultsCompletion](../../iidm/importer/post-processor/LoadFlowResultsCompletionPostProcessor.md)
post processor.

# Optional properties

## apply-reactance-correction
The `apply-reactance-correction` property is an optional property that defines if the too small reactance values have
to be fixed to `epsilon-x` value. To solve numeric issues with very small reactance values, it's necessary to set the too
small values to a minimal value. The default value of this property is `false`.

## epsilon-x
The `epsilon-x` property is an optional property that defines the reactance value used for fixing. The default value of
this property is `0.1`.
 
# Examples

## YAML
```yaml
loadflow-results-completion-parameters:
    apply-reactance-correction: true
    epsilon-x: 0.1
```

## XML
```xml
<loadflow-results-completion-parameters>
    <apply-reactance-correction>true</apply-reactance-correction>
    <epsilon-x>0.1</epsilon-x>
</loadflow-results-completion-parameters>
```
