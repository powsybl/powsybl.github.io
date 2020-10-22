---
layout: default
---

# Write the Java code to perform sensitivity analysis
This tutorial shows you how to write a Java code to perform sensitivity analysis on a network, just on its current state but also on N-1 states by providing a set of contingencies. You'll see how to configure PowSyBl, through a YML file and overwriting it with a JSON file, how to provide input sensitivity factors, and how to output the sensitivity results to a CSV file.

* TOC
{:toc}

## What will you build?
You will create a Java code to run a single sensitivity analysis on a network, and also a sensitivity analysis on various network states by providing a set of contingencies. You will use a small fictive network constituted of 12 buses, considering schematic exchanges between France, Belgium, Germany and the Netherlands. The setup is the following:
- 3 buses per country
- one phase-shift transformer in Belgium
- 4 lines to be monitored
  - Belgium - France
  - France - Germany
  - Germany - the Netherlands
  - the Netherlands - Belgium
- they will be monitored with respect to the phase-shift transformer's tap position, or to the generators' injections.

A standard sensitivity analysis input comprises a list of sensitivity factors, each one composed of a sensitivity variable (the variable of impact) and a sensitivity function (the observed function). They correspond to partial derivatives measuring the sensitivity of the observed function (for example the flow through a line) with respect to the variable of impact (for example a phase-shift transformer (PST) tap position or an injection). There are four types of factors available, check the [sensitivity analysis documentation](/pages/documentation/simulation/sensitivity/index.html#sensitivity-factors) for more information. Here we study the effect of the Belgian phase shift transformer on the flow through each of the lines connecting the countries. We thus define these lines as monitoredBranch, and create one factor of type BranchFlowPerPSTAngle for each monitoredBranch. We create the factors twice in order to show different ways to do it:
- once directly with Java code
- once by reading a JSON factors file

You will first run one sensitivity analysis, and write the results in a JSON file. Then, you will define contingencies on each of the lines that are not monitored, and compute a sensitivity analysis for each of them. The factors' values will be printed in the terminal for this second case.

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
        <powsybl.core.version>3.7.1</powsybl.core.version>
        <powsybl.rte-core.version>2.14.1</powsybl.rte-core.version>
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
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>log4j-over-slf4j</artifactId>
        <version>${slf4j.version}</version>
    </dependency>
</dependencies>
```
## Configure PowSyBl
We have configured this tutorial so as to use a locally defined `config.yml` file.
Edit the file named `config.yml` at the location `sensitivity/initial/src/main/resources`.
Start the configuration by writing:
```yaml
load-flow:
  default-impl-name: "Hades2"
```
In this way, PowSyBl will be set to use the Hades2 implementation of the loadflow.

You can also add:
```yaml
sensitivity-analysis:
  default-impl-name: "Sensi2"
```
In this way, PowSyBl will be set to use the Sensi2 implementation of a sensitivity analysis.

Then, set the following general Hades2 configuration parameters:
```yaml
hades2:
    homeDir: <PATH_TO_HADES2>
```
where the path to Hades2 should point to your installation directory. It is something of the kind `<PATH_TO_ROOT_DIRECTORY/hades2-V6.6.0.1/>`, where the path to the root directory points to where you extracted the Hades2 distribution, and the version of Hades2 will vary depending on your installation.

In order to configure the sensitivity analysis parameters, we need to fill also two sections relative 
to the loadflow calculations:
```yaml
load-flow-default-parameters:
    voltageInitMode: DC_VALUES
    transformerVoltageControlOn: false
    specificCompatibility: true 

hades2-default-parameters:
    dcMode: false
```
These parameters will be used by the sensitivity solver: in order to compute the sensitivity values themselves Hades2 has to perform a load flow calculation. You can use the `dcMode` parameter to switch between AC and DC modes sensitivity calculations.

Some specific sensitivity parameters should also be set. Check the 
[sensitivity analysis documentation](/pages/documentation/simulation/sensitivity/index.html#sensitivity-analysis-implementations)
for more information about the parameters:
```yaml
hades2-default-sensitivity-parameters:
    computeInitialLoadflow: true
    computeSensitivityToPsts: true
    computeSensitivityToInjections: false
    resultsThreshold: 0
```
Here we activate `computeSensitivityToPsts` so as to output sensitivity results for factors involving phase tap changers. On the other hand, we first set `computeSensitivityToInjections` to false so as to avoid getting sensitivity results with respect to the injections on the network. Since our network is small wand we'll have few factors, we'll just set `resultsThreshold` to 0 to keep all the sensitivity values in the results.

## Import the network from an XML IIDM file

The network we use here is available in the tutorial's resources and is described in the iTesla Internal Data Model format.
Start by adding the following lines in the main function of the tutorial:
```java
Path networkPath = Paths.get(SensitivityTutorialComplete.class.getResource("/sensi_network_12_nodes.xml").getPath());
Network network = Importers.loadNetwork(networkPath.toString());
```
The first line defines the path to the network file in the resources, while the second line performs the import of the data. We now have an IIDM network in memory.

## Create sensitivity factors through Java code

In order to show how the factors creation work in Java, we start by creating them directly from within the Java code, without using the resource file for factors available in the resources. We'll see how to create factors by directly loading this file [further on](#create-sensitivity-factors-by-reading-a-json-file).

First, we need to define which branches (in our case lines) will be monitored. We'll just create a list of `Line`,
and add the ones we wish to monitor in the list by using their IDs:
```java
 List<Line> monitoredLines = new ArrayList<>();
 monitoredLines.add(network.getLine("BBE2AA1  FFR3AA1  1"));
 monitoredLines.add(network.getLine("FFR2AA1  DDE3AA1  1"));
 monitoredLines.add(network.getLine("DDE2AA1  NNL3AA1  1"));
 monitoredLines.add(network.getLine("NNL2AA1  BBE3AA1  1"));
```
Here we will monitor all the lines that link countries together.
The initial flow through each of the monitored lines constitutes the `function reference` values in the
sensitivity analysis results. Here, since we did not run a load flow calculation on the newtork, these flows are not set yet.
If you wish to display them, add the following lines in the file (optional):
```java
LoadFlow.run(network, LoadFlowParameters.load());
LOGGER.info("Initial active power through the four monitored lines");
for (Line line : monitoredLines) {
    LOGGER.info("LINE {} - P: {} MW", line.getId(), line.getTerminal1().getP());
}
```

To create the factors themselves, we need to create a `Provider` for them in the following way:
```java
SensitivityFactorsProvider factorsProvider = net -> {
    List<SensitivityFactor> factors = new ArrayList<>();
    monitoredLines.forEach(l -> {
        String monitoredBranchId = l.getId();
        String monitoredBranchName = l.getName();
        BranchFlow branchFlow = new BranchFlow(monitoredBranchId, monitoredBranchName, l.getId());
        String twtId = network.getTwoWindingsTransformer("BBE2AA1  BBE3AA1  1").getId();
        factors.add(new BranchFlowPerPSTAngle(branchFlow,
                new PhaseTapChangerAngle(twtId, twtId, twtId)));
    });
    return factors;
};
```
In this provider, we first define the variable of interest: here the branch flow (we may also choose intensity) on the monitored lines. Then we choose to monitor the branch flow with respect to a PST angle, with the Belgian phase shift transformer's angle as the varying function.

## Run a single sensitivity analysis

Now the sensitivity inputs are prepared, we can run a sensitivity analysis. This is done in the following way:
```java
SensitivityAnalysisResult sensiResults = SensitivityAnalysis.run(network, factorsProvider, new EmptyContingencyListProvider());
```
When no variants are explicitly specified, the analysis will be performed on network working variant.
Here we directly load the sensitivity analysis parameters from the YML configuration file in the resources. We also pass an `EmptyContingencyListProvider` to run a simulation without contingencies.

## Output the results in the terminal

We can now print the results in the terminal:
```java
LOGGER.info("Initial sensitivity results");
sensiResults.getSensitivityValues().forEach(value ->
    LOGGER.info("Value: {} MW/°", value.getValue()));
```
The values of the four factors are expressed in MW/°, which means that for a 1° phase change introduced by the PST, the flow through a given monitored line is modified by the value of the factor (in MW). Here we see that each line will undergo a variation of 25MW for a phase change of 1° introduced by the PST (and -25MW for a -1° change). The four monitored lines are affected identically, because in this very simple network all lines have the same reactance.

## Output the results in a JSON file

It is also possible to output the results to a JSON file. First we will define the path to the file
where we want to write the results. Here the result files will be stored in the `target` folder.
```java
Path resultsPath = networkPath.getParent().getParent();
Path jsonSensiResultPath = resultsPath.resolve("sensi_result.json");
```
Then, we can export the results to that file in JSON format:
```java
SensitivityAnalysisResultExporter jsonExporter = new JsonSensitivityAnalysisResultExporter();
try (OutputStream os = Files.newOutputStream(jsonSensiResultPath)) {
    jsonExporter.export(sensiResults, new OutputStreamWriter(os));
} catch (IOException e) {
    throw new UncheckedIOException(e);
}
```

## Create a set of contingencies 

We now reach the last part of this tutorial, where we'll run a series of sensitivity calculations on a network, given a list of contingencies and sensitivity factors. Here we use the systematic sensitivity feature of Hades2, creating one variant on which all the calculations are done successively, without re-loading the network each time, by modifying the Jacobian matrix directly in the solver.

First, we need to implement a contingencies provider.
Here the list of contingencies is composed of the lines that are not monitored
in the sensitivity analysis.
```java
ContingenciesProvider contingenciesProvider = n -> n.getLineStream()
  .filter(l -> {
      final boolean[] isContingency = {true};
      monitoredLines.forEach(monitoredLine -> {
          if (l.equals(monitoredLine)) {
            isContingency[0] = false;
            return;
          }
      });
      return isContingency[0];
  })
  .map(l -> new Contingency(l.getId(), new BranchContingency(l.getId())))
  .collect(Collectors.toList());
```
This makes a total of 11 contingencies, which you can check through:
```java
LOGGER.info("Number of contingencies: {}", contingenciesProvider.getContingencies(network).size());
```

## Create sensitivity factors by reading a JSON file

Now, we'll read factors from a JSON file (this is the second example of how to create factors, actually we created the same twice).
```java
Path factorsFile = Paths.get(SensitivityTutorialComplete.class.getResource("/factors.json").getPath());
SensitivityFactorsProvider jsonFactorsProvider = net -> {
  try (InputStream is = Files.newInputStream(factorsFile)) {
    return SensitivityFactorsJsonSerializer.read(new InputStreamReader(is));
  } catch (IOException e) {
    throw new UncheckedIOException(e);
  }
};
```
You can check the content of the file `src/main/resources/factors.json` to verify which factors were created.

## Overwrite the Hades2 sensitivity parameters with a JSON file

It is possible to overwrite the Hades2 sensitivity parameters with a JSON file, which we'll do now:
```java
Path parametersFile = Paths.get(SensitivityTutorialComplete.class.getResource("/sensi_parameters.json").getPath());
SensitivityAnalysisParameters params = SensitivityAnalysisParameters.load();
JsonSensitivityAnalysisParameters.update(params, parametersFile);
```
We first create sensitivity analysis parameters by loading the YML configuration file, and then update them based on the provided JSON file for sensitivity parameters.

## Run a set of sensitivity analyses on all network states

We can now run all the sensitivity analyses at once, through:
```java
SensitivityAnalysisResult systematicSensiResults = SensitivityAnalysis.run(network, jsonFactorsProvider, contingenciesProvider, params);
```

## Output the results to a CSV file

Finally, we can export the results in CSV format:
```java
Path csvResultPath = resultsPath.resolve("sensi_syst_result.csv");
SensitivityAnalysisResultExporter csvExporter = new CsvSensitivityAnalysisResultExporter();
try (OutputStream os = Files.newOutputStream(csvResultPath)) {
    csvExporter.export(systematicSensiResults, new OutputStreamWriter(os));
} catch (IOException e) {
    throw new UncheckedIOException(e);
}
```
The output will contain the sensitivity results on all considered network states, for all the factors (hence it is more convenient to use the CSV format instead of JSON to analyze them).

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
We have learnt how to write Java code to run sensitivity analysis in single mode or in a systematic way, by providing contingencies to the `run` call. We've seen how to create sensitivity factors, in Java directly but also by reading a JSON file. We've shown how to set the sensitivity parameters, and how to overwrite them using a JSON file. We've also seen how to output the results, in the terminal but also into JSON or CSV files.
Finally, we've also explained how to check what Hades2 itself generated during the calculation, which may be useful for debugging purposes.

## Going further
The following links could also be useful:
- [Run a sensitivity analysis through an iTools command](../../user/itools/sensitivity-analysis.md): Learn how to perform a sensitivity analysis from the command line 
