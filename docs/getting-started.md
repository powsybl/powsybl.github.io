---
title: Getting started
category: Getting started
---

# Installation

Thus, there are three different ways to package an application based on the Powsybl framework:

- The first one is to use Powsybl as a plain Java library to develop your own application. The Powsybl artifacts are available in Maven Central under the `com.powsybl` groupId: [Powsybl Artifacts](https://repo.maven.apache.org/maven2/com/powsybl/). Browse this site to discover which artifacts contain the functionalities you want to include in your application. The [Tutorials](tutorials/index.md) are a good start to see Powsybl used as a library.

- The second one aims to create a command line bundle, based on the `iTools` script, using the [itools-packager-maven-plugin](installation/itools-packager.md).

- The third one aims to create a JavaFX desktop application based on the Grid Study Environment, using the [javafx-packager](installation/javafx-packager.md) to create an installable bundle for Linux (rpm or deb), Windows (exe or msi) or MacOS (pkg or dmg).

# Configuration

Most features of Powsybl can be configured by editing the corresponding configuration's module in the configuration files.
Read this [documentation](configuration/modules/index.md) page to learn more about Powsybl's configuration and have an
overview of all the existing modules.
