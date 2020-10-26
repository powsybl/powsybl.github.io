---
layout: default
---

# Write the Java code to perform power flows
This tutorial shows you how to write a Java code to perform load flow calculations on a network, just on its current state but also on an N-1 state by applying a contingencies. You'll see how to configure PowSyBl, through a YML file and overwriting it with a JSON file, how to provide the input network, and how to output the load flow results to the terminal.

* TOC
{:toc}

## What will you build?

The tutorial can be expressed in a short and easy workflow: all the input data is stored in an XIIDM file. This file is imported with the IIDM importer. Then, a load flow simulator is launched to get flows on all nodes. In this tutorial, the simulator is Hades2, but it could be an other load flow simulator, as long as the API contract is respected. A contingency is created and finally, the flows are computed again in order to get the final state.  

![Workflow](./img/loadflow/Workflow.svg){: width="75%" .center-image}

## What will you need?
- About 1/2 hour
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
        <powsybl.core.version>3.7.1</powsybl.core.version>
        <powsybl.rte-core.version>2.14.1</powsybl.rte-core.version>
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
- `com.powsybl:powsybl-config-classic`: to provide a way to read the configuration
- `com.rte-france.powsybl:powsybl-hades2-integration`: to provide an implementation of the sensitivity analysis
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
</dependencies>
```

## Configure PowSyBl
We have configured this tutorial so as to use a locally defined `config.yml` file.
Edit the file named `config.yml` at the location `loadflow/initial/src/main/resources`.
Start the configuration by writing:
```yaml
load-flow:
  default-impl-name: "Hades2"
```
In this way, PowSyBl will be set to use the Hades2 implementation for the power flow.

Then, set the following Hades2 configuration parameters:
```yaml
hades2:
    homeDir: <PATH_TO_HADES2>
```
where the path to Hades2 should point to your installation directory. It is something of the kind `<PATH_TO_ROOT_DIRECTORY/hades2-V6.6.0.1/>`, where the path to the root directory points to where you extracted the Hades2 distribution, and the version of Hades2 will vary depending on your installation.

## Import the network from an XML IIDM file

In this tutorial, the network is quite simple and made of two lines in parallel, with a generator on the left side and a load on the right side. 
The load consumes 600 MW and the generator produces 606.5 MW. 

![Initial simple network](./img/loadflow/Network_Simple_Initial.svg){: width="50%" .center-image}

<img src="./img/loadflow/File.svg" alt="" style="vertical-align: bottom"/>
The network is modeled in [IIDM](../../grid/formats/xiidm.md), which is the internal model of Powsybl. This model can be serialized in a XML format for experimental purposes.
```java
File file = new File("/path/to/file/eurostag-tutorial1-lf.xml");
```
<br />
<img src="./img/loadflow/Import.svg" alt="" style="vertical-align: bottom"/>
The file is imported through a gateway that converts the file in an in-memory model.
```java
Network network = Importers.loadNetwork(file.toString());
```
<br />

Let's just quickly scan the network.
In this tutorial it is composed of two substations. Each substation has two voltage
levels and one two-windings transformer.
```java
for (Substation substation : network.getSubstations()) {
  System.out.println("Substation " + substation.getName());
  System.out.println("Voltage levels: " + substation.getVoltageLevels());
  System.out.println("Two windings transformers: "
      + substation.getTwoWindingsTransformers());
  System.out.println("Three windings transformers: "
      + substation.getThreeWindingsTransformers());
}
```
There are two lines in the network.
```java
for (Line l : network.getLines()) {
  System.out.println("Line: " + l.getName());
  System.out.println("Line: " + l.getTerminal1().getP());
  System.out.println("Line: " + l.getTerminal2().getP());
}
```

## Run a power flow calculation

<img src="./img/loadflow/Compute_LF.svg" alt="" style="vertical-align: bottom"/>
Then, flows are computed with a load flow simulator. In this tutorial, we use Hades2, which is closed source software, but available under a freeware license for experimental purposes. For more details, please visit this [page](https://rte-france.github.io/hades2/features/loadflow.html) to learn about Hades2.

A loadflow is run on a variant of the network. 
A network variant is close to a state vector and gathers variables such as 
injections, productions, tap positions, states of buses, etc.
The computed flows are stored in the variant given in input. 
Defining the variant specifically is actually optional. 
If it is not the case, the computation will be run on the default initial variant created by PowSyBl by default.
Let us first define the variant:
```java
network.getVariantManager().cloneVariant(VariantManagerConstants.INITIAL_VARIANT_ID,
        "loadflowVariant");
network.getVariantManager().setWorkingVariant("loadflowVariant");
```
Here we have copied the initial variant and set the new variant as the one to be used.

In order to run the load flow calculation, we also need to define the set of parameters to be used.
The default parameters are listed [here](../configuration/parameters/LoadFlowParameters.md). Here, angles are set to zero and voltages are set to one per unit. 

```java
LoadFlowParameters loadflowParameters = new LoadFlowParameters()
        .setVoltageInitMode(LoadFlowParameters.VoltageInitMode.UNIFORM_VALUES);
LoadFlow.run(network, loadflowParameters);
```

The flow through the upper line is of 302.4 MW at its entrance and of 300.4 MW at its exit. The flow through the lower line is the same. The power losses are of 2 MW on each line.   

If you wish to set the parameters in the config file and use them directly, you can write instead:
```java
LoadFlowParameters loadflowParameters = LoadFlowParameters.load();
LoadFlow.run(network, loadflowParameters);
```
You'll have to fill two configuration sections in the `config.yml` file, for example:
```yaml
load-flow-default-parameters:
    voltageInitMode: DC_VALUES
    transformerVoltageControlOn: false
    specificCompatibility: true 

hades2-default-parameters:
    dcMode: true
```

## Output the results in the terminal

Let us compare the voltages and angles before and after the calculation:

```java
double angle;
double v;
double angleInitial;
double vInitial;
for (Bus bus : network.getBusView().getBuses()) {
    network.getVariantManager().setWorkingVariant(VariantManagerConstants.INITIAL_VARIANT_ID);
    angleInitial = bus.getAngle();
    vInitial = bus.getV();
    network.getVariantManager().setWorkingVariant("loadflowVariant");
    angle = bus.getAngle();
    v = bus.getV();
    System.out.println("Angle difference: " + (angle - angleInitial));
    System.out.println("Tension difference: " + (v - vInitial));
}
```

## Apply a contingency on the network and run a load flow again

![Final simple network](./img/loadflow/Network_Simple_Final.svg){: width="50%" .center-image}

<br />
<img src="./img/loadflow/Modify_N-1.svg" alt="" style="vertical-align: bottom"/>
A contingency is simply simulated by disconnecting both terminals of the `NHV1_NHV2_1` line.

```java
network.getLine("NHV1_NHV2_1").getTerminal1().disconnect();
network.getLine("NHV1_NHV2_1").getTerminal2().disconnect();
```
<br />
<img src="./img/loadflow/Compute_LF.svg" alt="" style="vertical-align: bottom"/>
Once the continency is applied on the network, the post-contingency state of the network is computed through a loadflow in the same way as above.

A new load flow computes the flow on the lower line: it is now of 610.6 MW at its entrance and of 601 MW at its exit. The rest of the difference between load and generation represents the losses during the voltage transformation process.

```java
network.getVariantManager().cloneVariant("loadflowVariant",
        "contingencyLoadflowVariant");
network.getVariantManager().setWorkingVariant("contingencyLoadflowVariant");
LoadFlow.run(network, loadflowParameters);
```

Let's analyze the results. First we make some simple prints in the terminal: 
```java
for (Line l : network.getLines()) {
    System.out.println("Line: " + l.getName());
    System.out.println("Line: " + l.getTerminal1().getP());
    System.out.println("Line: " + l.getTerminal2().getP());
}
```

Here we'll also show how to define a visitor object, that may be used to loop over equipments. We'll use it to print the energy sources
and the loads of the network. Visitors are usually used to access
the network equipments efficiently, and modify their properties
for instance. Here we just print some data about the Generators and Loads.
```java
TopologyVisitor visitor = new DefaultTopologyVisitor() {
    @Override
    public void visitGenerator(Generator generator) {
        System.out.println("Generator " + generator.getName() + ": "
                + generator.getTerminal().getP() + " MW");
    }

    @Override
    public void visitLoad(Load load) {
        System.out.println("Load " + load.getName() + ": "
                + load.getTerminal().getP() + " MW");
    }
};

for (VoltageLevel vl : network.getVoltageLevels()) {
    vl.visitEquipments(visitor);
}

```
The power now flows only through the line `NHV1_NHV2_2`, as expected.

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
We have learnt how to write Java code to run power flows. 
We've shown how to load a network fie, how to create and use network variants, and how to set the load flow parameters. We've also seen how to output the results in the terminal.
Finally, we've also explained how to check what Hades2 itself generated during the calculation, which may be useful for debugging purposes.

## Going further
The following links could also be useful:
- [Run a power flow through an iTools command](../../user/itools/loadflow.md): Learn how to perform a power flow calculation from the command line 
- [Sensitivity analysis tutorial](loadflow.md): Learn how to write the Java code to perform sensitivity analyses
