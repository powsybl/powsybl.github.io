---
layout: default
---

# Write the Java code to perform sensitivity analyses
This tutorial shows you how to write a Java code to perform sensitivity analyses on a network, just on its 
current state but also on N-1 states by providing a set of contingencies. You'll see how to configure 
PowSyBl, through a YML file and overwriting it with a JSON file, how to provide
input sensitivity factors, and how to output the sensitivity results to a CSV file.

## What will you build?
You will create a Java code to run a single sensitivity analysis on a network, and
also a sensitivity analysis on various network states by providing a set of contingencies.
You will use a small fictive network constituted of 12 buses, considering schematic exchanges 
between France, Belgium, Germany and the Netherlands. The setup is the following:
- 3 buses per country
- one phase-shift transformer in Belgium
- 4 lines to be monitored
  - Belgium - France
  - France - Germany
  - Germany - the Netherlands
  - the Netherlands - Belgium
- they will be monitored with respect to the phase-shift transformer's tap position, or to the generators' injections.

A standard sensitivity analysis input comprises a list of sensitivity factors,
each one composed of a sensitivity variable (the variable of impact) and 
a sensitivity function (the observed function). 
They correspond to partial derivatives measuring the sensitivity of the observed function 
(for example the flow through a line) with respect to the
variable of impact (for example a phase-shift transformer (PST) tap position or an injection).
There are four types of factors available, check the [sensitivity analysis documentation](/pages/documentation/simulation/sensitivity/index.html#sensitivity-factors) for more information.
Here we study the effect of the Belgian phase shift transformer on the flow through each of
the lines connecting the countries. We thus define these lines as monitoredBranch,
and create one factor of type BranchFlowPerPSTAngle for each monitoredBranch.
We create the factors twice in order to show different ways to do it:
- once directly with Java code
- once by reading a JSON factors file

You will first run one sensitivity analysis, and write the results in a JSON file.
Then, you will define contingencies on each of the lines that are not monitored,
and compute a sensitivity analysis for each of them. The factors' values will be printed
in the terminal for this second case.

## What will you need?
- About 1 hour and a half
- A favorite text editor or IDE
- JDK 1.8 or later
- An installation of Hades2, a RTE load-flow tool available as a freeware
    - Please visit the [Hades2 documentation](https://rte-france.github.io/hades2/index.html) to learn how to install Hades2 on your computer. The installation should take you 15 minutes at most. 
    - Note that Hades2 only works on Linux and Windows at the moment.
- You can also import the code straight into your IDE:
    - [IntelliJ IDEA](intellij.md)

## How to complete this tutorial?
Like most tutorials, you can start from scratch and complete each step, 
or you can bypass basic setup steps that are already familiar to you. 
Either way, you end up with working code.

To start from scratch, move on to [Create a new project](#create-a-new-project-from-scratch).

To skip the basics, do the following:
- Download and unzip the [source repository](https://github.com/powsybl/powsybl-tutorials), or clone it using Git: `git clone https://github.com/powsybl/powsybl-tutorials`.
- Change directory to `sensitivity/initial`
- Jump ahead to [Configure the pom file](#configure-the-maven-pom-file)

When you finish, you can check your results against the code in `sensitivity/complete`.

## Create a new project from scratch
Create a new Maven's `pom.xml` file in `sensitivity/initial` with the following content:
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

    <artifactId>powsybl-sensitivity</artifactId>

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
    <exec.mainClass>powsybl.tutorials.sensitivity.SensitivityTutorial</exec.mainClass>
```
When you'll have created the `SensitivityTutorial` class and its main function, you'll then be able to
execute your code through:
```
mvn clean package exec:java
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
- `com.powsybl:powsybl-config-classic`: to provide a way to read the configuration
- `com.rte-france.powsybl:powsybl-hades2-integration`: to provide an implementation of the sensitivity analysis
- `com.powsybl:powsybl-iidm-impl`: to provide an IIDM implementation
- `org.slf4j:slf4j-simple`: to provide an implementation of `slf4j` 
- `org.slf4j:log4j-over-slf4j`: to create a bridge between `log4j` and `slf4j` 

**Note:** PowSyBl uses [slf4j](http://www.slf4j.org/) as a facade for various logging framework, but some APIs we use in PowSyBl use [log4j](https://logging.apache.org/log4j), which is not compatible with slf4j, making it necessary to create a bridge between the two logging system.

Add the following dependencies to the `pom.xml` file:
```xml
<dependencies>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-config-classic</artifactId>
        <version>${powsybl.core.version}</version>
    </dependency>
    <dependency>
        <groupId>com.rte-france.powsybl</groupId>
        <artifactId>powsybl-hades2-integration</artifactId>
        <version>${powsybl.rte-core.version}</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>${slf4j.version}</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>log4j-over-slf4j</artifactId>
        <version>${slf4j.version}</version>
    </dependency>
</dependencies>
```
## Configure PowSyBl
We have configured this tutorial so as to use a locally defined `config.yml` file.
Create a file named `config.yml` at the location `sensitivity/initial/src/main/resources`.
Start the configuration by writing:
```
componentDefaultConfig:
    LoadFlowFactory: com.rte_france.powsybl.hades2.Hades2Factory
```
In this way, PowSyBl will be set to use the Hades2 implementation of the loadflow and sensitivity analysis.

You can then set some computation configuration options:
```
computation-local:
    tmp-dir: <path_to_local_tmp>
    availableCore: 1
```
where you can provide the path you wish for storing the temporary files generated by PowSyBl.
By default, that path is set to `/tmp`.

Then, set the following general Hades2 configuration parameters:
```
hades2:
    homeDir: <path_to_hades_2>
    debug: true
```
where the path to Hades2 should point to your installation directory.
It is something of the kind `$PATH_TO_ROOT_DIRECTORY/hades2-V6.4.0.1.1/`,
where the path to the root directory points to where you extracted the Hades2 distribution,
and the version of Hades2 will vary depending on your installation.

In order to configure the sensitivity analysis parameters, we need to fill also two sections relative 
to the loadflow calculations:
```
load-flow-default-parameters:
    voltageInitMode: DC_VALUES
    transformerVoltageControlOn: false
    specificCompatibility: true 

hades2-default-parameters:
    dcMode: false
```
These parameters will be used by the sensitivity solver: in order to compute the
sensitivity values themselves Hades2 has to perform a load flow calculation. 
You can use the `dcMode` parameter to switch between AC and DC modes sensitivity calculations.

Some specific sensitivity parameters should also be set. Check the 
[sensitivity analysis documentation](/pages/documentation/simulation/sensitivity/index.html#sensitivity-analysis-implementations)
for more information about the parameters:
```
hades2-default-sensitivity-parameters:
    computeSensitivityToPsts: true
    computeSensitivityToInjections: false
    resultsThreshold: 0
```
Here we activate `computeSensitivityToPsts` so as to output sensitivity results for factors 
involving phase tap changers.
On the other hand, we first set `computeSensitivityToInjections` to false so as to avoid getting
sensitivity results with respect to the injections on the network.
Since our network is small wand we'll have few factors, we'll just set `resultsThreshold` to 0 to
keep all the sensitivity values in the results.

## Import the network from an XML IIDM file

## Create sensitivity factors through Java code

## Run a single sensitivity analysis

## Output the results to a CSV file

## Create a set of contingencies 

## Create sensitivity factors by reading a JSON file

## Overwrite the Hades2 sensitivity parameters with a JSON file

## Run a set of sensitivity analyses on all network states

## Summary
You have learnt to create a redistribuable `iTools` package, and to configure the `itools-packager` plugin. Refer to the [iTools manual](../../user/itools/index.md#available-commands) to know the list of available commands, and the [itools-packager manual](../itools-packager.md) to configure more deeply your `iTools` distribution.  

## Going further
The following links could also be useful:
- [iTools manual](../../user/itools/index.md): Learn how to use `iTools`, and which commands are available
- [itools-packager manual](../itools-packager.md): Learn all the features of the maven plugin
- [Create an iTools command](itools-command.md): Learn how to create your own `iTools` command

