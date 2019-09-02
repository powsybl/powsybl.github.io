---
title: load-flow
layout: default
---

The `load-flow` module is used to specify configure loadflow default implementation name. Each loadflow implementation provides a subclass of `com.powsybl.loadflow.LoadFlowProvider` correctly configured to be found by `java.util.ServiceLoader`. A loadflow provider exposes a name that is used in the Java API to find a loadflow by its implementation name but also to specify a default implementation in this platform config module. If only one `com.powsybl.loadflow.LoadFlowProvider` is present in the classpath, there is no need to specify a default loadflow implementation name. In the case where more that one `com.powsybl.loadflow.LoadFlowProvider` is present in the classpath, specifying the default implementation name allows loadflow API user to use LoadFlow.run(...) and  LoadFlow.runAsync(...) methods to run a loadflow.

# Properties

## default
Use the `default` to specify the name of the default loadflow implementation.

# Examples

## YAML
```yaml
load-flow:
    default: Mock
```

## XML
```xml
<load-flow>
    <default>Mock</default>
</load-flow>
```
