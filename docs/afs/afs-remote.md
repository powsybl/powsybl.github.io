---
title: AFS remote implementation
layout: default
---

Powsybl provides a way to expose remotely some of the configured drives, in a client/server application. 

# Configuration
To configure AFS drives that are remotely accessible, set the optional `remotely-accessible` property to `true` of a drive
in the [configuration](../configuration/modules/index.md) file of the server. This drive can either be a [local](afs-local.md)
drive or a [MapDB](afs-mapdb.md) drive.

On the client side, configure the [remote-service](../configuration/modules/remote-service.md) module to set the connection
settings.

# Maven dependencies
To use remote drives in your application, add the following dependencies to the `pom.xml` file on the server side.
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-afs-ws-server</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```

and the following dependencies to the `pom.xml` file on the client side:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-afs-ws-client</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
