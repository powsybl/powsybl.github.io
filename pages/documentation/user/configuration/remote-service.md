---
layout: default
---

# remote-service

The `remote-service` module is used by [AFS](../../data/afs.md) to define a remote AFS server.

## Required properties

**host-name**  
The `host-name` property is a required property that defines the name of the remote host.

**app-name**  
The `app-name` property is a required property that defines the name of the remote application server.

## Optional properties

**secure**  
The `secure` property is an optional property that defines whether SSL/TLS protocol should be used to connect to the remote server or not. The default value of this property is `true`.

**port**  
The `port` property is an optional property that defines the connection port. By default, if SSL/TLS protocol is used, the default value of this property is `443`. Otherwise, it is `80`.

**auto-reconnection**
The `auto-reconnection` is an optional boolean property, set to `false` by default. If set to `true`, when the client loses the websocket connection to the server (which allows to receive AFS events from the server), it will try to reconnect every X seconds. X is defined by the `reconnection-delay` property.

**reconnection-delay**
If `auto-reconnection` is set to `true`, the `reconnection-delay` property defines the number of seconds the client will wait between 2 attempts to reconnect to the server.
This property is optional, with a default value of `60` seconds (1 minute). Note that this value should be a tradeoff between the quantity (or duration) of lost messages, and the frequency of requests to the server.


## Examples

**YAML configuration:**
```yaml
remote-service:
    host-name: my-afs-server
    app-name: my-server-app
    secure: false
    port: 8080
    auto-reconnection: true
    reconnection-delay: 300
```

**XML configuration:**
```xml
<remote-service>
    <host-name>my-afs-server</host-name>
    <app-name>my-server-app</app-name>
    <secure>false</secure>
    <port>8080</port>
    <auto-reconnection>true</auto-reconnection>
    <reconnection-delay>300</reconnection-delay>
</remote-service>
```
