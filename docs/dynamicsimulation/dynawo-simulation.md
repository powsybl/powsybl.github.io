---
title: Dynawo Simulation implementation
layout: default
---

Powsybl provides an implementation to run dynamic simulations with [Dynawo](https://dynawo.github.io/).

# Configuration
See [Dynawo Configuration](../../pages/documentation/user/configuration/dynawo.md) to configure the default dynawo.

To set the default configuration of the dynawo simulator, one has to configure the
[dynawo-default-parameters](../../pages/documentation/user/configuration/dynawo-default-parameters.md) module.

To learn more about configuration files, read the [DynawoSimulationParameters](../configuration/parameters/DynawoSimulationParameters.md) documentation
page.

# Maven configuration
To use the Dynawo Simulation implementation, add the following dependencies to your `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-dynawo</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```