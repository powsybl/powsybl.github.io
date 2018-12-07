---
title: AFS Local implementation
layout: default
---

Powsybl provides an implementation of the AFS storage API that exposes a folder of the local hard-drive, in read-only.

# Configuration
To learn how to configure a local AFS drive, read this documentation [page](../configuration/modules/local-app-file-system.md).

# Maven configuration
To use the AFS local implementation, add the following dependencies to your `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-afs-local</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
