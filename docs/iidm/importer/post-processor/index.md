---
title: Import post processors
layout: default
---

Powsybl, using import post processors, provides a mechanism that allows to perform operations on networks after they
have been imported.  The goal of a post processor is to work on the imported network, possibly changing data.

The list of post processors currently implemented and available in powsybl-core is:
- [Groovy](GroovyScriptPostProcessor.md)
- [JavaScript](JavaScriptPostProcessor.md)
- [LoadFlowResultsCompletion](LoadFlowResultsCompletionPostProcessor.md)

# Configuration
To enable an import post processor, add its name to the `postProcessors` property of the [import](../../../configuration/modules/import.md)
module.
