---
layout: default
---

# remote-service

The `remote-service` module is used by [AFS]() to define a remote AFS server.

## Required properties

**host-name:**  
The `host-name` property is a required property that defines the name of the remote host.

**app-name:**  
The `app-name` property is a required property that defines the name of the remote application server.

## Optional properties

**secure:**  
The `secure` property is an optional property that defines whether SSL/TLS protocol should be used to connect to the remote server or not. The default value of this property is `true`.

**port:**  
The `port` property is an optional property that defines the connection port. By default, if SSL/TLS protocol is used, the default value of this property is `443`. Otherwise, it is `80`.

## Examples

**YAML configuration:**
```yaml
remote-service:
    host-name: my-afs-server
    app-name: my-server-app
    secure: false
    port: 8080
```

**XML configuration:**
```xml
<remote-service>
    <host-name>my-afs-server</host-name>
    <app-name>my-server-app</app-name>
    <secure>false</secure>
    <port>8080</port>
</remote-service>
```
