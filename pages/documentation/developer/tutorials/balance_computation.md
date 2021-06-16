---
layout: default
latex: true
---

# Write the Java code to perform merging and balance adjustment

In this tutorial, you will learn how to merge multiple IGM and scale the CGM according to market data.
* TOC 
  {:toc}

## What will you build?
First, your CGMES files will be imported and merged. There is an option to compute a power flow on the single IGMs before merging. Then a loadlfow will be run on the CGM.
The loadflow simulator used in this tutorial is OpenLoadFlow.
After the loadflow on the merged area, the net positions of each country are computed. The algorithm used for the balance computation is in `powsybl-balances-adjustment` The PEVF gives the expected net positions, and the balance adjustment is computed.
Then the SV file of the CGM will be exported.

## What will you need?
- About one hour
- A favourite text editor or IDE
- JDK 1.11 or later
- Some IGMs that you want to merge and the corresponding PEVF, the CGMES boundary files (EQBD, TPBD) 
- You can also import the code straight into your IDE:
  - [IntelliJ IDEA](intellij.md)
  
## How to complete this tutorial?
You can start from scratch and complete each step. Or you can bypass basic setup steps that you are already familiar with. Either way, you end up with a working code.
To start from scratch, move on to [Create a new project](#create-a-new-project-from-scratch).

To skip the basics, do the following:
- Download and unzip the source repository or clone it using Git.
- Change directory to `merging-view/initial`
- Jump ahead to [Configure the pom file](#configure-the-maven-pom-file)

You will need the path to your IGMs and the PEVF. Each IGM needs to be in a zip file with the EQ, SSH, TP and SV files in it.
The PEVF needs to be a single file, unzipped. The EQBD and TPBD must also be in a folder, unzipped.

When you are done with the tutorial, you can compare your results with the code in `merging-view/complete`.

## Create a new project from scratch
To create a new project from scratch, you need to create a file called `pom.xml` in `merging-view/initial` with the following content:
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
        <powsybl.core.version>4.0.1</powsybl.core.version>
        <powsybl-open-loadflow.version>0.9.0</powsybl-open-loadflow.version>
    </properties>
</project>
```

## Configure the maven pom file
First, in the `pom.xml`, add the following lines in the `<properties>` section to make it possible to run the future main class through maven:
```xml
<exec.cleanupDaemonThreads>false</exec.cleanupDaemonThreads>
<exec.mainClass>powsybl.tutorials.mergingview.MergingViewTutorial</exec.mainClass>
```
When you'll have created the `MergingViewTutorial` class and its main function, you'll then be able to
execute your code through:
```
$> mvn clean package exec:exec
```

Also, configure the pom file so as to use a configuration file taken in the classpath, instead of the one
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

Now, we'll add all the **required** maven dependencies:
- `com.powsybl:powsybl-config-classic`: to provide a way to read the configuration
- `org.slf4j:slf4j-simple`: to provide an implementation of `slf4j`.
- `com.powsybl:powsybl-open-loadflow`: to provide an implementation for the loadflow calculation.
- `com.powsybl:powsybl-iidm-impl`: to load and work with networks.
- `com.powsybl:powsybl-action-util`: 
- `com.powsybl:powsybl-balances-adjustment` and `com.powsybl:powsybl-entsoe-cgmes-balances-adjustment`: to provide an implementation for the balance adjustment
- `com.powsybl:powsybl-cgmes-conversion`, `com.powsybl:powsybl-triple-store-impl-rdf4j`, `com.powsybl:powsybl-cgmes-extensions`, `com.powsybl:powsybl-iidm-converter-api`: to import/export the CGMES files and convert them into iidm
- `com.powsybl:powsybl-commons`
- `com.powsybl:powsybl-iidm-mergingview`

**Note:** PowSyBl uses [slf4j](http://www.slf4j.org/) as a facade for various logging framework, but some APIs we use in PowSyBl use [log4j](https://logging.apache.org/log4j), which is not compatible with slf4j, making it necessary to create a bridge between the two logging system.

Add the following dependencies to the `pom.xml` file:
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

## Configure Powsybl
The configuration file is in the folder `merging-view/initial/src/main/resources`. We have indeed configured this tutorial to use this file.
It gathers all of the default configuration parameters about the loadflow simulator, its parameters, the parameters for the import/export of CGMES files, the path to the CGMES files.

We need to configure PowSyBl to use the OpenLoadFlow implementation. To do that, you need to edit the `config.yml` file : 
```yaml
load-flow:
  default-impl-name: "OpenLoadFlow"
```

The parameters of the import/export of CGMES files are:
```yaml
import-export-parameters-default-value:
  iidm.import.cgmes.boundary-location: path-to-EQBD-TPBD
  iidm.import.cgmes.profile-used-for-initial-state-values: SSH
  iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension: true
  iidm.export.xml.version: "1.5"
  iidm.import.xml.version: "1.5"
  iidm.import.xml.skip-extensions: false
  iidm.export.adn.angle-perte: false
  iidm.export.adn.with-minimum-reactance: true
  iidm.export.adn.minimum-reactance-per-unit: 0.000625
  iidm.import.cgmes.ensure-id-alias-unicity: true
  iidm.import.cgmes.create-cgmes-export-mapping: true
```
You need to change the path to the file containing the boundary files. 

Then, the parameters for the path of the CGMES file have to be specified:
```yaml
balances-adjustment-validation-parameters:
  data-exchanges-path: path-to-PEVF

  igm-paths: 
    - IGM1-name, path-to-IGM1
    - IGM2-name, path-to-IGM2
    
  output-dir: path-to-directory
```
You need here to specify the path to your PEVF file, the name and path to each IGM on a different line and the path to the directory where you want the SV file and log file to be saved to be saved.

## Create `BalancesAdjustmentValidationParameters` class to load parameters from the configuration file

First, we will create a java class called `BalancesAdjustmentValidationParameters` containing the parameters that we want to use, such as the paths of the IGMs, the path to the PEVF file and the output directory.
All these parameters will come from the configuration file. This class will allow to read the code to load the parameters from the configuration file. 
You can start with adding the variables that we will need :
```java
private final Map<String, String> igmPaths = new HashMap<>();
private String dataExchangesPath = null;
private String outputDir = null;
```

The IGM paths will be stored in a HasMap and the output directory and PEVF in Strings.
You can also create the getter/setter associated with each variable:
```java
private void putIgmPath(String name, String path) { igmPaths.put(name, path); }

public Map<String, String> getIgmPaths() { return Collections.unmodifiableMap(igmPaths); }

private void setDataExchangesPath(String dataExchangesPath) { this.dataExchangesPath = Objects.requireNonNull(dataExchangesPath); }

public String getDataExchangesPath() { return dataExchangesPath; }

public Optional<String> getOutputDir() { return Optional.ofNullable(outputDir); }

private void setOutputDir(String outputDir) { this.outputDir = Objects.requireNonNull(outputDir); }
```

And then, you will create a method `load` that will read the input from the configuration file:
```java
public static BalancesAdjustmentValidationParameters load() {
    BalancesAdjustmentValidationParameters parameters = new BalancesAdjustmentValidationParameters();
    PlatformConfig platformConfig = PlatformConfig.defaultConfig();

    ModuleConfig config = platformConfig.getModuleConfig("balances-adjustment-validation-parameters");
    config.getStringListProperty("igm-paths").forEach(path -> {
        String[] pathArray = path.split(",");
        parameters.putIgmPath(pathArray[0].replaceAll("\\s+", ""), pathArray[1].replaceAll("\\s+", ""));
    });
    parameters.setDataExchangesPath(config.getStringProperty("data-exchanges-path"));
    config.getOptionalStringProperty("output-dir").ifPresent(parameters::setOutputDir);
    return parameters;
}
```

Now with this class, we will be able to read the extra parameters from the `config.yml` file. 
Now we will move on to create the `MergingViewTutorial` main class, that will perform the merging and computation.

## Create `MergingViewTutorial` class to run the computation

### Set the loadflow parameters
Once you have created the `MergingViewTutorial` class, outside of the main method, you will define the `LOAD_FLOW_PARAMETERS`. 
These parameters will be used in the loadflow preprocessing of the IGMs, in the loadflow calculation on the merged view and for the balance computation.

```java
private static final LoadFlowParameters LOAD_FLOW_PARAMETERS = new LoadFlowParameters()
        .setVoltageInitMode(LoadFlowParameters.VoltageInitMode.DC_VALUES)
        .setBalanceType(LoadFlowParameters.BalanceType.PROPORTIONAL_TO_GENERATION_P_MAX)
        .setReadSlackBus(true)
        .setPhaseShifterRegulationOn(true)
        .setTransformerVoltageControlOn(true)
        .setConnectedComponentMode(LoadFlowParameters.ConnectedComponentMode.ALL);
```
In this tutorial, we will set the initial voltage value to the DC values, the balance type to proportional to the maximum active power target, the `ReadSlackBus` to true. 
The tap changers regulation is also set to true, and the power flow must be computed over all connected component.

For more information on the power flow parameters available in OpenLoadFlow, you can visit this [page](pages/documentation/simulation/powerflow/openlf.md).

### Create parameters to add options to the calculation
Then we will define three parameters : a boolean indicating whether or not we will perform the loadflow preprocessing on the IGMs, a boolean indicating whether or not we want to prepare the balance computation and the name of the synchronous area will be hard coded:

```java
private static final boolean LOAD_FLOW_PREPROCESSING = true;
private static final boolean PREPARE_BALANCE_COMPUTATION = true;

private static final String SYNCHRONOUS_AREA_ID = "10YEU-CONT-SYNC0";
```

### Import the IGMs
Now we will move to the main method.
First, we will create the `BalancesAdjustmentValidationParameters` to read the paths to the IGMs, the PEVF and the output directory as well as the excluded Xnodes if any.
```java
BalancesAdjustmentValidationParameters validationParameters = BalancesAdjustmentValidationParameters.load();
log(validationParameters);
```

Then we will create a special method to import the IGMs:
```java
private static Map<String, Network> importNetworks(BalancesAdjustmentValidationParameters validationParameters) {
        Map<String, Network> networks = new HashMap<>();
        validationParameters.getIgmPaths().forEach((name, path) -> networks.put(name, Importers.loadNetwork(Paths.get(path))));
        for (Map.Entry<String, Network> entry : networks.entrySet()) {
            String name = entry.getKey();
            Network network = entry.getValue();
        return networks;
    }
```
The `log` method is defined as:

```java
private static void log(BalancesAdjustmentValidationParameters validationParameters) {
    validationParameters.getOutputDir().ifPresent(outputDir -> {
    try {
    System.setOut(new PrintStream(outputDir + "/output-balances-ajustement.log"));
    } catch (FileNotFoundException e) {
    e.printStackTrace();
    }
    });
}
```
The networks are stored in a HashMap. We will call this method in Main to import the networks through:

```java
Map<String, Network> networks = importNetworks(validationParameters);
```
### Power flow on the IGMs
Then we will compute a power flow on the networks and select the valid ones, those for which the loadflow is successful. 
We will thus create a new method for this loadflow preprocessing:

```java
private static void loadflowPreProcessing(Map<String, Network> networks, Map<String, Network> validNetworks) {
    // launch loadflow for each IGM
    networks.forEach((name, network) -> {
        LoadFlowResult result = LoadFlow.run(network, LOAD_FLOW_PARAMETERS);
        System.out.println(name + " loadflow: " + result.isOk());
        if (!result.isOk()) {
            validNetworks.remove(name);
        }
    });
}
```
Then we will add the corresponding code in the main method:
```java
Map<String, Network> validNetworks = new HashMap<>(networks);
if (LOAD_FLOW_PREPROCESSING) {
    loadflowPreProcessing(networks, validNetworks);
}
```
### Merge of the IGMs and power flow on the CGM
Finally, we will merge the IGMs to create the CGM:
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
Now we will start the balance computation. Indeed, the PEVF input gives the net position of each IGM that has been merged, it is the target net position.
After the loadflow, the net position of each IGM can be different from the target. The mismatch between what is expected and what is computed has to be balanced via a loop scaling the load until each net position matches the target one.
For that, we use the powsybl-balances-adjustment repository. 
First, we will create the targets and the scalable. There will be Loads and DanglingLines that will be scaled.
We import the PEVF file as `DataExchanges` object.
```java
List<BalanceComputationArea> balanceComputationAreas = new ArrayList<>();
DataExchanges dataExchanges;
try (InputStream is = Files.newInputStream(Paths.get(validationParameters.getDataExchangesPath()))) {
    dataExchanges = DataExchangesXml.parse(is);
}
```
We will now write a function that calculates the target net position and the actual net position post loadflow and before the balance adjustment.

```java
private static void igmPreprocessing(Network mergingView, Map<String, Network> networks, DataExchanges dataExchanges,
    BalancesAdjustmentValidationParameters validationParameters) {
    igmPreprocessing(mergingView, networks, dataExchanges, null, validationParameters);
    }
        
private static void igmPreprocessing(Network mergingView, Map<String, Network> networks, DataExchanges dataExchanges,
                                     List<BalanceComputationArea> balanceComputationAreas,
                                     BalancesAdjustmentValidationParameters validationParameters) {
    networks.forEach((name, network) -> {

        // Retrieve CGMES control area
        CgmesControlArea controlArea = network.getExtension(CgmesControlAreas.class).getCgmesControlAreas().iterator().next();

        // Retrieve target AC net position
        double target = dataExchanges.getNetPosition(SYNCHRONOUS_AREA_ID, controlArea.getEnergyIdentificationCodeEIC(), Instant.parse(network.getCaseDate().toString()));

        NetworkAreaFactory factory = createFactory(controlArea, network, validationParameters);
        NetworkArea area = factory.create(mergingView);
        Scalable scalable = NetworkAreaUtil.createConformLoadScalable(area);

        // Calculate AC net position
        double real = area.getNetPosition();

        if (balanceComputationAreas != null) {
            balanceComputationAreas.add(new BalanceComputationArea(controlArea.getId(), factory, scalable, target));
        }

        if (!PREPARE_BALANCE_COMPUTATION) {
            System.out.println(name + ": " + target + " (target AC net position) / " + real + " (calculated AC net position)");
        }
    });
}

private static NetworkAreaFactory createFactory(CgmesControlArea area, Network network, BalancesAdjustmentValidationParameters validationParameters) {
        return new CgmesVoltageLevelsAreaFactory(area, validationParameters.getExcludedXnodes(), network.getVoltageLevelStream().map(Identifiable::getId).collect(Collectors.toList()));
        }
```
You can specify whether you are preparing the balance computation or not. If you do, then for each network, a `BalanceComputationArea` is added to the list.
Otherwise, the target and actual net position are printed.

We also need a method to create the scalable, and we will also create a fictitious area representing the area outside the merged CGM.

```java
private static void prepareFictitiousArea(Network mergingView, Map<String, Network> validNetworks, DataExchanges dataExchanges) {
        prepareFictitiousArea(mergingView, validNetworks, dataExchanges, null);
}

private static void prepareFictitiousArea(Network mergingView, Map<String, Network> validNetworks, DataExchanges dataExchanges,
        List<BalanceComputationArea> balanceComputationAreas) {
        // Create scalable
        List<CgmesControlArea> cgmesControlAreas = validNetworks.values().stream()
        .map(n -> n.getExtension(CgmesControlAreas.class))
        .filter(Objects::nonNull)
        .map(cgmesControlAreaList -> ((CgmesControlAreas) cgmesControlAreaList).getCgmesControlAreas().iterator().next())
        .collect(Collectors.toList());
        Scalable scalable = createACDanglingLineScalable(mergingView, cgmesControlAreas);

        if (scalable == null) {
        return; // Synchronous area is complete
        }

        // Create fictitious CGMES control area
        NetworkAreaFactory factory = new CgmesBoundariesAreaFactory(cgmesControlAreas);
        NetworkArea fictitiousArea = factory.create(mergingView);

        // Retrieve target AC net position
        Map<String, Double> fictitiousTargets = dataExchanges.getNetPositionsWithInDomainId(SYNCHRONOUS_AREA_ID,
        Instant.parse(validNetworks.values().iterator().next().getCaseDate().toString()));
        double definedTargets = fictitiousTargets.entrySet().stream()
        .filter(entry -> cgmesControlAreas.stream().anyMatch(area -> area.getEnergyIdentificationCodeEIC().equals(entry.getKey())))
        .mapToDouble(Map.Entry::getValue)
        .sum();
        double target = 0.0 - definedTargets;

        if (balanceComputationAreas != null) {
        balanceComputationAreas.add(new BalanceComputationArea(SYNCHRONOUS_AREA_ID, factory, scalable, target));
        }

        if (!PREPARE_BALANCE_COMPUTATION) {
        System.out.println(SYNCHRONOUS_AREA_ID + ": " + target + " (target AC net position) / " + fictitiousArea.getNetPosition() + " (calculated AC net position)");
        }
}

private static Scalable createACDanglingLineScalable(Network mergingView, List<CgmesControlArea> areas) {
        List<DanglingLine> danglingLines = mergingView.getDanglingLineStream()
        .filter(dl -> dl.getExtension(CgmesDanglingLineBoundaryNode.class) == null || !dl.getExtension(CgmesDanglingLineBoundaryNode.class).isHvdc())
        .filter(dl -> dl.getTerminal().getBusView().getBus() != null && dl.getTerminal().getBusView().getBus().isInMainSynchronousComponent())
        .filter(dl -> areas.stream().anyMatch(area -> area.getTerminals().stream().anyMatch(t -> t.getConnectable().getId().equals(dl.getId()))
        || area.getBoundaries().stream().anyMatch(b -> b.getConnectable().getId().equals(dl.getId()))))
        .collect(Collectors.toList());
        if (danglingLines.isEmpty()) {
        return null; // there is no dangling line in the whole merging view
        }
        float totalP0 = (float) danglingLines.stream().mapToDouble(dl -> Math.abs(dl.getP0())).sum();
        if (totalP0 == 0.0) {
        throw new PowsyblException("The sum of all dangling lines' active power flows is null"); // ??????
        }
        List<Float> percentages = danglingLines.stream().map(dl -> (float) (100f * Math.abs(dl.getP0()) / totalP0)).collect(Collectors.toList());
        return Scalable.proportional(percentages, danglingLines.stream().map(dl -> Scalable.onDanglingLine(dl.getId(), Scalable.ScalingConvention.LOAD)).collect(Collectors.toList()));
        }
```
In the main method, we can now add the corresponding lines of code, depending on whether we are preparing or not the balance computation.
```java
if (PREPARE_BALANCE_COMPUTATION) {
    igmPreprocessing(mergingView, validNetworks, dataExchanges, balanceComputationAreas, validationParameters);
    prepareFictitiousArea(mergingView, validNetworks, dataExchanges, balanceComputationAreas);
} else {
    igmPreprocessing(mergingView, validNetworks, dataExchanges, validationParameters);
    prepareFictitiousArea(mergingView, validNetworks, dataExchanges);
}
```

Finally, we are going to create the `BalanceComputationParameters`, launch the balance computation and export the corresponding SV:
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
With the `createContext` method being:
```java
private static CgmesExportContext createContext(MergingView mergingView, Map<String, Network> validNetworks) {
    CgmesExportContext context = new CgmesExportContext();
    context.setScenarioTime(mergingView.getCaseDate());
    validNetworks.forEach((name, n) -> {
        context.addTopologicalNodeMappings(n);
        context.getSvModelDescription().addDependencies(n.getExtension(CgmesSvMetadata.class).getDependencies());
    });
    context.setTopologyKind(CgmesTopologyKind.MIXED_TOPOLOGY);
    return context;
}
```

## Summary
In this tutorial, you have learned how to import multiple CGMES IGMs, merge them and run a balance adjustment. 

## Going further
The following links can be also useful:
- [Run a power flow with OpenLoadFlow](./loadflow.md): Learn about how to compute a power flow on an IGM