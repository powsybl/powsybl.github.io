---
title: groovy-dsl-contingencies
layout: default
todo:
    - add link to missing page
---

The `groovy-dsl-contingencies` module is used by the `com.powsybl.action.dsl.GroovyDslContingenciesProviderFactory`,
which is a implementation of the `com.powsybl.contingency.ContingenciesProviderFactory` used by the
[security-analysis](../../tools/security-analysis.md) command.

# Required properties

## dsl-file
The `dsl-file` property is a required property that defines the path of the groovy script defining the list of
contingencies to simulate. Read the [documentation](../../contingencies/GroovyDslContingenciesProvider.md) page to
learn more about the syntax of the `GroovyDslContingenciesProvider`.

# Examples

## YAML
```yaml
groovy-dsl-contingencies:
    dsl-file: /home/user/contingencies.groovy
```

## XML
```xml
<groovy-dsl-contingencies>
    <dsl-file>/home/user/contingencies.groovy</dsl-file>
</groovy-dsl-contingencies>
```
