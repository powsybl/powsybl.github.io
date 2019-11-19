---
title: load-flow
layout: default
---

The `load-flow` module is used to configure the loadflow default implementation name. Each loadflow implementation provides a subclass of `com.powsybl.loadflow.LoadFlowProvider` correctly configured to be found by `java.util.ServiceLoader`. A loadflow provider exposes a name that can be used in the Loadflow Java API to find a specific loadflow implementation. It can also be used to specify a default implementation in this platform config module. If only one `com.powsybl.loadflow.LoadFlowProvider` is present in the classpath, there is no need to specify a default loadflow implementation name. In the case where more than one `com.powsybl.loadflow.LoadFlowProvider` is present in the classpath, specifying the default implementation name allows loadflow API user to use LoadFlow.run(...) and  LoadFlow.runAsync(...) methods to run a loadflow. Using these methods when no default loadflow name is configured and multiple implementations are in the classpath will throw an exception. An exception is also thrown if no implementation at all is present in the classpath, or if specifying a loadflow name that is not present on the classpath.

# Properties

## default
Use the `default` property to specify the name of the default loadflow implementation.

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
