---
title: remote-service
layout: default
---

The `remote-service` module is used by [AFS]() to define a remote AFS server.

Read the [documentation]() page to learn more about the remote AFS server implementation.

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

## autoreconnect-enabled

The `autoreconnect-enabled` property is an optional property that defines if the server should be automatically reconnected when the connection is lost. The default value of this property is `false`.

## reconnection-initial-interval

The `reconnection-initial-interval` property is an optional property that defines the initial interval (in seconds) before the first reconnection. Its default value is `5`.

## reconnection-interval-mutiplier

The `reconnection-interval-mutiplier` property is an optional property that is used to increase the waiting interval between two reconnection attempts, for example if we wait 5 seconds for the first retry, we will then wait 5*reconnection-interval-mutiplier seconds before the second retry. Its default value is `2`.

## reconnection-timeout

The `reconnection-timeout` property is an optional property that that defines the max interval in seconds between two reconnections. Its default value is `3600`.
With the default parameters, there would be no reconnection attempt.
With `autoreconnect-enabled` set to `true` and the other parameters set to default values, in the case of a disconnection, the reconnection attempts would occur after 5", then 10", 20", 40", 1'20", 2'40" .... etc incresing until a maximum of one hour interval. after reconnection timeout, the reconnection will be re-attempted every hour.

## reconnection-max

The `reconnection-max` property is an optional property that that defines the maximum times in seconds before abandoning the attempts to reconnect. Its default value is `Integer.MAX_VALUE`.
   
# Examples

## YAML
```yaml
remote-service:
    host-name: my-afs-server
    app-name: my-server-app
    secure: false
    port: 8080
    autoreconnect-enabled: false
    reconnection-initial-interval: 5
    reconnection-interval-mutiplier: 2
    reconnection-timeout: 3600
    reconnection-max: 2147483647
```

## XML
```xml
<remote-service>
    <host-name>my-afs-server</host-name>
    <app-name>my-server-app</app-name>
    <secure>false</secure>
    <port>8080</port>
    <autoreconnect-enabled>false</autoreconnect-enabled>
    <reconnection-initial-interval>5</reconnection-initial-interval>
    <reconnection-interval-mutiplier>2</reconnection-interval-mutiplier>
    <reconnection-max-interval>3600</reconnection-timeout>
    <reconnection-max>2147483647</reconnection-max>
</remote-service>
```
