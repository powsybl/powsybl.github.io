---
title: network
layout: default
---

The `network` module is used to configure the network default implementation name. The network implementation is the set of classes implementing all the network elements, such as VoltageLevel or Generator. The implementation named "Default" is the classic powsybl in-memory implementation.

# Properties

## default-impl-name
Use the `default-impl-name` property to specify the name of the default network implementation.

# Examples

## YAML
```yaml
network:
    default-impl-name: Default
```

## XML
```xml
<network>
    <default-impl-name>Default</default-impl-name>
</network>
```
