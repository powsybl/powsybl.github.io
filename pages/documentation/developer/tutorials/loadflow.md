---
layout: default
---

# Write the Java code to perform power flows
## What will you build?
## What will you need?
- About 1 hour
- A favorite text editor or IDE
- JDK 1.8 or later
- An installation of Hades2, a RTE load-flow tool available as a freeware
    - Please visit the [Hades2 documentation](https://rte-france.github.io/hades2/index.html) to learn how to install Hades2 on your computer. The installation should take you 15 minutes at most. 
    - Note that Hades2 only works on Linux and Windows at the moment.
- You can also import the code straight into your IDE:
    - [IntelliJ IDEA](intellij.md)

## How to complete this tutorial?
Like most tutorials, you can start from scratch and complete each step, or you can bypass basic setup steps that are already familiar to you. Either way, you end up with working code.

To start from scratch, move on to [Create a new project](#create-a-new-project-from-scratch).

To skip the basics, do the following:
- Download and unzip the [source repository](https://github.com/powsybl/powsybl-tutorials), or clone it using Git: `git clone https://github.com/powsybl/powsybl-tutorials`.
- Change directory to `loadflow/initial`
- Jump ahead to [Configure the pom file](#configure-the-maven-pom-file)

When you finish, you can check your results against the code in `loadflow/complete`.

## Create a new project from scratch
Create a new Maven's `pom.xml` file in `loadflow/initial` with the following content:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-parent</artifactId>
        <version>3</version>
        <relativePath/>
    </parent>

    <artifactId>powsybl-loadflow</artifactId>

    <properties>
        <maven.exec.version>1.6.0</maven.exec.version>
        <slf4j.version>1.7.22</slf4j.version>
        <powsybl.core.version>3.3.0</powsybl.core.version>
        <powsybl.rte-core.version>2.10.0</powsybl.rte-core.version>
    </properties>
</project>
```

## Configure the maven pom file

First, in the `pom.xml`, add the following lines in the `<properties>` section to make it possible to run the future main class through maven:
```xml
<exec.cleanupDaemonThreads>false</exec.cleanupDaemonThreads>
<exec.mainClass>powsybl.tutorials.loadflow.LoadflowTutorial</exec.mainClass>
```
When you'll have created the `LoadflowTutorial` class and its main function, you'll then be able to
execute your code through:
```
$> mvn clean package exec:java
```

Also, configure the pom file so as to use a configuration file taken in the classpath, instead of the one
that is global to your system:
```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>exec-maven-plugin</artifactId>
            <configuration>
                <systemProperties>
                    <systemProperty>
                        <key>powsybl.config.dirs</key>
                        <value>${project.build.directory}/classes</value>
                    </systemProperty>
                </systemProperties>
            </configuration>
        </plugin>
    </plugins>
</build>
```

Now, we'll add a few **required** maven dependencies:

## Configure PowSyBl
We have configured this tutorial so as to use a locally defined `config.yml` file.
Edit the file named `config.yml` at the location `loadflow/initial/src/main/resources`.
Start the configuration by writing:
```yaml
loadflow:
  default-impl-name: "hades2"
```
In this way, PowSyBl will be set to use the Hades2 implementation for the power flow.

Then, set the following Hades2 configuration parameters:
```yaml
hades2:
    homeDir: <PATH_TO_HADES2>
```
where the path to Hades2 should point to your installation directory. It is something of the kind `<PATH_TO_ROOT_DIRECTORY/hades2-V6.4.0.1.1/>`, where the path to the root directory points to where you extracted the Hades2 distribution, and the version of Hades2 will vary depending on your installation.

In order to configure the loadflow parameters, we need to fill two configuration sections:
```yaml
load-flow-default-parameters:
    voltageInitMode: DC_VALUES
    transformerVoltageControlOn: false
    specificCompatibility: true 
```
```yaml
hades2-default-parameters:
    dcMode: false
```
## Import the network from an XML IIDM file
## Run a power flow calculation
## Output the results in the terminal
## Overwrite the Hades2 load-flow parameters with a JSON file

## Check the files Hades2 generated for the calculation (optional)

In order to be able to check what files Hades2 itself generated for the calculation, you can set the following configuration options in your config file:
```yaml
computation-local:
    tmp-dir: /path/to/local/tmp
    availableCore: 1

hades2:
    homeDir: /path/to/hades2
    debug: true
```
where you can provide the path you wish for storing the temporary files generated by PowSyBl. By default, that path is set to </tmp> on Linux. Each PowSyBl run will generate a folder named `itesla_hades2_XXX` where `XXX` stands for random a series of numbers. In this folder, you will find several files:
- `adn_in`
- `adn_out`
- log
which can be useful to understand what happened during the Hades2 calculation in more details. The adn files contain the input and output network data, while the log files provide information about the run's behavior.

## Summary
## Going further
The following links could also be useful:
- [Run a power flow through an iTools command](../../user/itools/loadflow.md): Learn how to perform a power flow calculation from the command line 
- [Sensitivity analysis tutorial](loadflow.md): Learn how to write the Java code to perform sensitivity analyses
