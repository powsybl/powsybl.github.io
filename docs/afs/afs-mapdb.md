---
title: AFS MapDB implementation
layout: default
---

Powsybl provides a simple implementation of the AFS storage API, based on [MapDB](http://www.mapdb.org/). Use this implementation
for prototyping or standalone applications.

# Configuration
To learn how to configure a MapDB AFS drive, read this documentation [page](../configuration/modules/mapdb-app-file-system.md).

# Maven configuration
To use the AFS local implementation, add the following dependencies to your `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-afs-mapdb</artifactId>
    <version>${powsybl.version}</version>
</dependency>
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-afs-mapdb-storage</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
