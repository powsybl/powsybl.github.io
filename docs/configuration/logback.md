---
title: logback-itools.xml
layout: default
---

The `iTools` script uses [logback](https://logback.qos.ch/) for logging. There are two different ways to configure the
logging levels:
- a system-wide configuration
- an user-wide configuration

Please refer to the [logback manual](https://logback.qos.ch/manual/index.html) for the available logging options.

## System-wide configuration
The logging configuration file is `POWSYBL_HOME/etc/logback-itools.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <Pattern>%d{yyyy-MM-dd_HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</Pattern>
        </encoder>
    </appender>
    <root level="ERROR">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

## User-wide configuration
An user could have its own logging configuration by creating a `logback-itools.xml` file in the [configuration](itools.md)
folder. This file is used in priority if it exists and the system-wide configuration is used otherwise.
