---
title: remote-service
layout: default
---

The `remote-service` module is used by [AFS](../../afs/index.md) to define a remote AFS server.

Read the [documentation](../../afs/afs-remote.md) page to learn more about the remote AFS server implementation.

# Properties

## Required properties

## host-name

The `host-name` property is a required property that defines the name of the remote host.

## app-name

The `app-name` property is a required property that defines the name of the remote application server.

## Optional properties

## secure

The `secure` property is an optional property that defines if SSL/TLS protocol should be used
to connect to the remote server. The default value of this property is `true`.

## port

The `port` property is an optional property that defines the connection port. By default, if SSL/TLS protocol
is used, the default value of this property is `443`. Otherwise, it is `80`.

# Examples

## YAML
```yaml
remote-service:
    host-name: my-afs-server
    app-name: my-server-app
    secure: false
    port: 8080
```

## XML
```xml
<remote-service>
    <host-name>my-afs-server</host-name>
    <app-name>my-server-app</app-name>
    <secure>false</secure>
    <port>8080</port>
</remote-service>
```
