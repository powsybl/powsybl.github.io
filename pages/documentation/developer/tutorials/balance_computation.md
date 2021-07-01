---
layout: default
latex: true
---

# Write the Java code to perform merging and balance adjustment

This tutorial shows how to merge multiple IGMs from different TSOs and scale the resulting CGM according to actual market data. It implements the [European Merging Function](https://eepublicdownloads.entsoe.eu/clean-documents/Network%20codes%20documents/Implementation/cacm/cgmm/European_Merging_Function_Requirements_Specification.pdf) whose requirements can be found on the website of ENTSOE. 
The forecast net positions of the IGMs are computed with the [Pan European Verification Function](https://eepublicdownloads.entsoe.eu/clean-documents/EDI/Library/cim_based/schema/PEVF%20Implementation%20Guide_V1.0.pdf).

* TOC 
{:toc}

## What will you build?
First, your CGMES files will be imported and merged. There is an option to compute a power flow on the single IGMs before merging. Then a loadlfow will be run on the CGM.
The loadflow simulator used in this tutorial is [OpenLoadFlow](../../simulation/powerflow/openlf.md).
After the loadflow on the merged area, the net positions of each TSO perimeter will be computed. The algorithm used for the balance computation is in the `powsybl-balances-adjustment` API. The PEVF gives the expected net positions, and the balance adjustment is computed.
Then the SV file of the CGM will be exported.

## What will you need?
- About one hour
- A favourite text editor or IDE
- JDK 1.11 or later
- Some IGMs that you want to merge and the corresponding PEVF and CGMES boundary files (EQBD, TPBD) 
- You can also import the code straight into your IDE:
  - [IntelliJ IDEA](intellij.md)
  
## How to complete this tutorial?
You can start from scratch and complete each step. Or you can bypass basic setup steps that you are already familiar with. Either way, you end up with a working code.
To start from scratch, move on to [Create a new project](#create-a-new-project-from-scratch).

To skip the basics, do the following:
- Download and unzip the source repository or clone it using Git.
- Change directory to `merging-view/initial`
- Jump ahead to [Configure the pom file](#configure-the-maven-pom-file)

For the input data, you will need to have:
- A folder containing your IGMs in CIM-CGMES format. Each IGM needs to be zipped with the EQ, TP, SSH and SV
- A PEVF file corresponding to the AC net positions of the IGMs and the DC net position of the cross-border HVDC lines. It should not be zipped.
- A folder containing the CGMES boundary files, EQBD and TPBD, unzipped as well.

When you are done with the tutorial, you can compare your results with the code in `emf/complete`.

## Create a new project from scratch
To start from scratch, you need to create a file called `pom.xml` in `emf/initial` with the following content:
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

    <artifactId>emf</artifactId>

    <properties>
        <maven.exec.version>1.6.0</maven.exec.version>
        <slf4j.version>1.7.22</slf4j.version>
        <powsybl.core.version>4.2.0</powsybl.core.version>
        <powsybl-open-loadflow.version>0.9.0</powsybl-open-loadflow.version>
        <powsybl_ba.version>1.5.0</powsybl_ba.version>
        <powsybl-entsoe.version>1.0.0</powsybl-entsoe.version>
    </properties>
</project>
```
This file is creating your project and setting the versions of the API that are used, as well as the properties and dependencies of the project.

## Configure the maven pom file
First, in the `pom.xml`, add the following lines in the `<properties>` section to make it possible to run the future main class through Maven:
```xml
<exec.cleanupDaemonThreads>false</exec.cleanupDaemonThreads>
<exec.mainClass>powsybl.tutorials.emf.EmfTutorial</exec.mainClass>
```
When you will have created the `EmfTutorial` class and its main function, you will then be able to
execute your code through:
```
$> mvn clean package exec:java
```
You also need to configure the pom file in order to use a configuration file taken in the classpath, instead of the one
that is global to your system:
```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>exec-maven-plugin</artifactId>
            <version>1.6.0</version>
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
Now, we add all the **required** maven dependencies:
- `com.powsybl:powsybl-config-classic`: to provide a way to read the configuration.
- `org.slf4j:slf4j-simple`: to provide an implementation of `slf4j`.
- `com.powsybl:powsybl-open-loadflow`: to provide an [implementation](../simulation/powerflow/openlf.md) for the loadflow calculation.
- `com.powsybl:powsybl-iidm-impl`: to work with network core model API.
- `com.powsybl:powsybl-action-util`: to provide a set of common actions such as scaling.
- `com.powsybl:powsybl-balances-adjustment` and `com.powsybl:powsybl-entsoe-cgmes-balances-adjustment`: to provide an implementation in order to run an active power balance adjustment computation over several network areas. Through this API, it is possible to keep the power factor constant during the process by readjusting the reactive power as well.
- `com.powsybl:powsybl-cgmes-conversion`, `com.powsybl:powsybl-triple-store-impl-rdf4j`, `com.powsybl:powsybl-cgmes-extensions`, `com.powsybl:powsybl-iidm-converter-api`: to import/export the CGMES files and convert them into the iidm core network model.
- `com.powsybl:powsybl-commons`: to provide a lot of really basic and technical utilities used everywhere in PowSyBl such as XML or JSON helpers, configuration, exceptions...
- `com.powsybl:powsybl-iidm-mergingview`: to provide a way to merge several networks, keeping the underlying networks unchanged.

**Note:** PowSyBl uses [slf4j](http://www.slf4j.org/) as a facade for various logging framework, but some APIs we use in PowSyBl use [log4j](https://logging.apache.org/log4j), which is not compatible with slf4j, making it necessary to create a bridge between the two logging system.

You can add the following dependencies to the `pom.xml` file, with their corresponding versions:
```xml
<dependencies>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-action-util</artifactId>
    <version>${powsyblcore.version}</version>
  </dependency>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-balances-adjustment</artifactId>
    <version>${powsyblba.version}</version>
  </dependency>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-cgmes-conversion</artifactId>
    <version>${powsyblcore.version}</version>
  </dependency>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-cgmes-extensions</artifactId>
    <version>${powsyblcore.version}</version>
  </dependency>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-commons</artifactId>
    <version>${powsyblcore.version}</version>
  </dependency>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-converter-api</artifactId>
    <version>${powsyblcore.version}</version>
  </dependency>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-mergingview</artifactId>
    <version>${powsyblcore.version}</version>
  </dependency>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-open-loadflow</artifactId>
    <version>${powsyblolf.version}</version>
  </dependency>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-config-classic</artifactId>
    <version>${powsyblcore.version}</version>
    <scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-impl</artifactId>
    <version>${powsyblcore.version}</version>
    <scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-triple-store-impl-rdf4j</artifactId>
    <version>${powsyblcore.version}</version>
  </dependency>
  <dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-entsoe-cgmes-balances-adjustment</artifactId>
    <version>${powsyblentsoe.version}</version>
    <scope>compile</scope>
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
The configuration file for PowSyBl is in the folder `emf/initial/src/main/resources`. 
It gathers all the default configuration parameters about the loadflow simulator, its parameters, the parameters for the import/export of CGMES files, the path to the CGMES files.

We need to configure PowSyBl to use the OpenLoadFlow implementation. To do that, you need to edit the `config.yml` file: 
```yaml
load-flow:
  default-impl-name: "OpenLoadFlow"
```
The parameters for the import and export of CGMES files are, with the proper path to the folder containing the boundary files:
```yaml
import-export-parameters-default-value:
  iidm.import.cgmes.boundary-location: path-to-EQBD-TPBD
  iidm.import.cgmes.profile-used-for-initial-state-values: SSH
  iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension: true
  iidm.export.xml.version: "1.5"
  iidm.import.cgmes.ensure-id-alias-unicity: true
  iidm.import.cgmes.create-cgmes-export-mapping: true
```
Then, you can add the paths of the CGMES file (IGMs and PEVF):
```yaml
balances-adjustment-validation-parameters:
  data-exchanges-path: path-to-PEVF

  igm-paths: 
    - IGM1-name, path-to-IGM1
    - IGM2-name, path-to-IGM2
    
  output-dir: path-to-directory
```
Here, the path to your PEVF file, the name and path to each IGM on a different line and the path to the directory where you want the SV file and log file to be saved have to be specified.

## Create `BalancesAdjustmentValidationParameters` class to load parameters from the configuration file
First, we create a java class called `BalancesAdjustmentValidationParameters` containing the parameters that we want to use, such as the paths of the IGMs, the path to the PEVF file and the output directory.
All these parameters will be read from the configuration file. This class will also have a method to load the parameters from the configuration file. 

The IGM paths will be stored in a HashMap and the output directory and PEVF in Strings.
You can also create the getter/setter associated with each variable. Then, you need create a method `load` that will read the input from the configuration file and store the data in each variable.
If you have difficulties creating this class, you can check the result in `emf/complete`.

Now with this class, we will be able to read the extra parameters from the `config.yml` file. 
We will move on to create the `EmfTutorial` main class, that will perform the merging and balance computation.

## Create `EmfTutorial` class to run the computation

### Set the loadflow parameters
Once you have created the `EmfTutorial` class, just before the main method, define the variable `LOAD_FLOW_PARAMETERS`. 
These parameters will be used in the loadflow preprocessing of the IGMs, in the loadflow calculation on the merged view and for the balance computation.
In this tutorial, we set the initial voltage value to the DC values, the balance type to proportional to the maximum active power target, the `ReadSlackBus` to true. 
The tap changers regulation is also set to true, and the power flow must be computed over all connected components.
These parameters are chosen to comply with the European merging function.
For more information on the power flow parameters available, you can visit this [page](pages/documentation/simulation/powerflow/openlf.md).

### Create parameters to add options to the calculation
Then we define three parameters: a boolean indicating whether or not we want to perform the loadflow preprocessing on the IGMs, a boolean indicating whether we want to prepare the balance computation  or not and the name of the synchronous area will be hard coded to `10YEU-CONT-SYNC0`.

### Import the CIM-CGMES IGMs
Now we move to the main method.
First, we create the `BalancesAdjustmentValidationParameters`, from the class you have created before, to read the paths to the IGMs, the PEVF and the output directory. 
You can now start logging into the output directory by creating a method checking if the output directory exists and setting it as the output path.

```java
BalancesAdjustmentValidationParameters validationParameters = BalancesAdjustmentValidationParameters.load();
log(validationParameters);
```
Then we create a special method to import the IGMs outside the Main method. In this method, a HashMap of networks is created and for each IGM path in the validation parameters, the corresponding IGM is loaded through `Importers`. 
We call this method in Main to import the networks through:
```java
Map<String, Network> networks = importNetworks(validationParameters);
```

### Power flow on the IGMs
Then we compute a power flow on the networks and select the valid ones, those for which the loadflow is successful. 
We create a new method `loadflowPreProcessing`, that runs the loadflow via OpenLoadFlow and we add the corresponding code in the main method:
```java
Map<String, Network> validNetworks = new HashMap<>(networks);
if (LOAD_FLOW_PREPROCESSING) {
    loadflowPreProcessing(networks, validNetworks);
}
```

### Merge of the IGMs and power flow on the CGM
Finally, we merge the IGMs to create the CGM:
```java
MergingView mergingView = MergingView.create("merged", "validation"); 
mergingView.merge(validNetworks.values().toArray(Network[]::new));
```
And run a loadflow on the CGM:
```java
if (!PREPARE_BALANCE_COMPUTATION) {
    LOAD_FLOW_PARAMETERS.setReadSlackBus(false);
    LOAD_FLOW_PARAMETERS.setDistributedSlack(true);
    LoadFlowResult result = LoadFlow.run(mergingView, LOAD_FLOW_PARAMETERS);
    for (Generator gen : mergingView.getGenerators()) {
        gen.setTargetP(-gen.getTerminal().getP()); // optional?
    }
    System.out.println(result.isOk());
    System.out.println(result.getMetrics());
}
```

### Balance computation
Now we start the balance computation. Indeed, the PEVF input gives the forecast net position of each IGM that has been merged. As it it is market data, this net position is the one we should obtain after the lodflow, it is the target net position.
However, after the loadflow, the net position of each IGM can be different from the target. The mismatch between what is expected and what is computed has to be balanced via a loop scaling the loads until each net position matches the target one.
For that, we use the `powsybl-balances-adjustment` API. 

First, we create the targets and the `scalables`. There will be `Loads` and `DanglingLines` that will be scaled as we want the balance to be computed both between the countries inside the merged area and with the outside of the CGM.
We import the PEVF file as a `DataExchanges` object. The balances adjustment is done with constant power factor, the reactive power of the loads is adjusted as well.
```java
List<BalanceComputationArea> balanceComputationAreas = new ArrayList<>();
DataExchanges dataExchanges;
try (InputStream is = Files.newInputStream(Paths.get(validationParameters.getDataExchangesPath()))) {
    dataExchanges = DataExchangesXml.parse(is);
}
```
We now write a method that calculates the target net position and the actual net position after the loadflow and before the balance adjustment. To do that, you need first to retrieve the control area of each network. After that, you can retrieve the target AC net position from the PEVF file with the method `getNetPosition`. Then, you can create the scalables from a `NetworkAreaFactory` created based on the `ControlArea`.
Once you have the scalables, you can calculate the AC net position of the TSO perimeter. For that, call the method `getNetPosition`. 
You can specify whether you are preparing the balance computation or not. If you do, then for each network, a `BalanceComputationArea` is added to the list.
Otherwise, the target and actual net position are printed.

We also need a method to create the scalable, and we also create a fictitious area representing the area outside the merged CGM for the adjustment. The method creates the dangling lines scalables first and the ficitiout CGMES control area through the method `CgmesBouncariesAreaFactory` and `create` based on the merging view. The AC net position can be calculated for the synchronous area from this object.

Finally, we are create the `BalanceComputationParameters`, launch the balance computation and export the corresponding SV:
```java
if (PREPARE_BALANCE_COMPUTATION) {
    // Create Balance computation parameters
    BalanceComputationParameters parameters = new BalanceComputationParameters(1, 10);
    LOAD_FLOW_PARAMETERS.setReadSlackBus(false);
    LOAD_FLOW_PARAMETERS.setDistributedSlack(true);
    LOAD_FLOW_PARAMETERS.setBalanceType(LoadFlowParameters.BalanceType.PROPORTIONAL_TO_GENERATION_P_MAX);
    parameters.setLoadFlowParameters(LOAD_FLOW_PARAMETERS);

    // Launch Balance computation
    BalanceComputation balanceComputation = new BalanceComputationFactoryImpl()
            .create(balanceComputationAreas, new LoadFlow.Runner(new OpenLoadFlowProvider()), LocalComputationManager.getDefault());
    BalanceComputationResult result = balanceComputation.run(mergingView, mergingView.getVariantManager().getWorkingVariantId(), parameters).join();
    System.out.println(result.getStatus());

    // Generate merged SV file (for the whole CGM)
    validationParameters.getOutputDir().ifPresent(outputDir -> {
        try (OutputStream os = Files.newOutputStream(Paths.get(outputDir + "/SV.xml"))) {
            XMLStreamWriter writer = XmlUtil.initializeWriter(true, "   ", os);
            StateVariablesExport.write(mergingView, writer, createContext(mergingView, validNetworks));
        } catch (XMLStreamException e) {
            throw new UncheckedXmlStreamException(e);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    });
}
```
With the `createContext` method being a method creating a `CgmesExportContext` , then setting the scenario time and for each IGM from `networks` adding the topological nodes and dependencies.

Now, if you run the code and check the output directory, you should get the logs of your merge and the SV.

## Summary
In this tutorial, you have learned how to import multiple CIM-CGMES IGMs and then run a loadflow on them. Your IGMs were then merged and a loadflow on the whole CGM was computed. Then you ran a balance adjustment based on market data and exported the SV result file. 

## Going further
The following link can be also useful:
- [Run a power flow with OpenLoadFlow](./loadflow.md): Learn about how to compute a power flow on an IGM