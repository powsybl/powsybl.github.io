---
title: How to use PowSyBl as a custom desktop application
layout: default
---

# Tutorial - Using PowSyBl as a custom desktop application

It is possible to use PowSyBl as a complete desktop application based on the [GSE (Grid Study 
Environment) project](https://github.com/powsybl/powsybl-gse). In order to write their own native
application using PowSyBl, developers can based their maven project on it using the adequate
maven project template available on [powsybl-tutorials](https://github.com/powsybl/powsybl-tutorials).

## Setting up your project

Start by cloning the `powsybl-tutorials` github project:
```
$ git clone https://github.com/powsybl/powsybl-tutorials.git
```

You will then be able to base your project on the `javafx-packager` maven module and extend it to your
needs.

## Configuration

To use this application, you will need to configure the `mapdb-app-file-system` module as explained 
[here](../configuration/modules/mapdb-app-file-system.md) since it uses a mapdb based file system.
A default configuration `config.yml` is available in the resources of the maven project template.

If you wish to run loadflow or security-analysis on your networks, you will also need to configure the used implementations
in the `componentDefaultConfig` module as explained [here](../configuration/modules/componentDefaultConfig.md).

## Deploying your project

The maven project can now be deployed:
``` 
$ cd javafx-packager/
$ mvn clean package
```
Please note that you will need a Java distribution supporting JavaFX in order to deploy the project.

It can then be installed as a native application on your machine:
``` 
$ sudo dnf install target/jfx/native/gse-demo-1.0.0-1.x86_64.rpm
```
or directly run as a desktop application from your terminal:
``` 
$ ./target/jfx/native/gse-demo/gse-demo
```