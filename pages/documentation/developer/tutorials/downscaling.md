---
layout: default
---

# Write the Java code to perform downscaling
This tutorial shows how you write Java code to perform **downscaling** : the mapping of numeric quantities on a set of nodes in a network. For instance, if you know the global power consumption of a given network, downscaling allows you to map it to each of its contained loads and know precisely their p0.

In this tutorial, we will import networks in CGMES format, map timeseries representing their power generation to their generators and power consumption to their loads. This mapping will be performed using a mapping script in the powsybl DSL format. Then, we will output the results of this mapping in CSV files.

* TOC
{:toc}

## What will you build?

Workflow of this tutorial is quite simple : input data is stored in three files:

- A folder containing zip archives for CGMES networks.
- A CSV file for timeseries.
- A Groovy file for the DSL script.

These files are imported to load a set of networks, a timeseries store and a DSL loader. All of these objects are then used in the downscaling process to map timeseries on networks nodes. You will also note that output generation is performed at the same time as the mapping to allow for better performances.

![](D:\projects\powsybl\powsybl.github.io\pages\documentation\developer\tutorials\img\downscaling\downscaling.png)

## What will you need?

- About 1 hour
- A favorite text editor or IDE
- JDK 1.11 or later
- You can also import the code straight into your IDE:
    - [IntelliJ IDEA](intellij.md)

## How to complete this tutorial?
Like most tutorials, you can start from scratch and complete each step, or you can bypass basic setup steps that are already familiar to you. Either way, you end up with working code.

To start from scratch, move on to [Create a new project](#create-a-new-project-from-scratch).

To skip the basics, do the following:
- Download and unzip the [source repository](https://github.com/powsybl/powsybl-tutorials), or clone it using Git: `git clone https://github.com/powsybl/powsybl-tutorials`.
- Change directory to `downscaling/initial`
- Jump ahead to [Configure the pom file](#configure-the-maven-pom-file)

When you finish, you can check your results against the code in `loadflow/complete`.

## Create a new project from scratch
Create a new Maven's `pom.xml` file in `downscaling/initial` with the following content:
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
        <powsybl.core.version>4.1.0-SNAPSHOT</powsybl.core.version>
        <powsybl-open-loadflow.version>0.9.0</powsybl-open-loadflow.version>
    </properties>
</project>
```

## Configure the maven pom file

First, in the `pom.xml`, add the following lines in the `<properties>` section to make it possible to run the future main class through maven:
```xml
<exec.cleanupDaemonThreads>false</exec.cleanupDaemonThreads>
<exec.mainClass>powsybl.tutorials.downscaling.Downscaling</exec.mainClass>
```
When you'll have created the `LoadflowTutorial` class and its main function, you'll then be able to
execute your code through:

```
$> mvn clean install exec:java
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
                <classpathScope>compile</classpathScope>
            </configuration>
        </plugin>
    </plugins>
</build>
```

Now, we'll add a few **required** maven dependencies:

- `com.powsybl:powsybl-config-classic`: to provide a way to read the configuration

- `org.slf4j:slf4j-simple`: to provide an implementation of `slf4j`.
- `com.powsybl:powsybl-iidm-api` to work with networks.
- `powsybl-iidm-converter-api`, `powsybl-cgmes-conversion` and `powsybl-triple-store-impl-rdf4j` to load CGMES networks.
- `powsybl-time-series-api` to work with timeseries.
- `powsybl-metrix-mapping` and `powsybl-entsoe-util` to perform downscaling.

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
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>${slf4j.version}</version>
    </dependency>

    <!-- Network + CGMES -->
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-iidm-api</artifactId>
        <version>${powsybl.core.version}</version>
    </dependency>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-iidm-impl</artifactId>
        <version>${powsybl.core.version}</version>
    </dependency>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-iidm-converter-api</artifactId>
        <version>${powsybl.core.version}</version>
    </dependency>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-cgmes-conversion</artifactId>
        <version>${powsybl.core.version}</version>
    </dependency>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-triple-store-impl-rdf4j</artifactId>
        <version>${powsybl.core.version}</version>
        <exclusions>
            <exclusion>
                <artifactId>logback-classic</artifactId>
                <groupId>ch.qos.logback</groupId>
            </exclusion>
        </exclusions>
    </dependency>

    <!-- Mapping -->
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-time-series-api</artifactId>
        <version>${powsybl.core.version}</version>
    </dependency>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-metrix-mapping</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-entsoe-util</artifactId>
        <version>${powsybl.core.version}</version>
    </dependency>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-iidm-mergingview</artifactId>
        <version>${powsybl.core.version}</version>
    </dependency>
</dependencies>
```

## Configure Metrix
We have configured this tutorial so as to use a locally defined `config.yml` file.
Edit the file named `config.yml` at the location `downscaling/initial/src/main/resources`.
Start the configuration by writing:

```yaml
metrix:
  ignoreEmptyFilter: true
```
The `metrix` configuration namespace will allow you to setup mapping behavior. The `ignoreEmptyFilter` option allows to continue without crashing when a filter in the DSL script returns an empty result (more on this later).

## Import the networks from CGMES archives

In this tutorial, the provided networks are in the CGMES format. Each one of the networks is loaded from a Zip archive containing all its related data. We provided you with two example archives in the `downscaling/complete/src/main/resources/networks` directory. Both are open-source, theoretical networks.

- `CGMES_smaller.zip` is the smaller archive theoretically representing Great Britain's network.
- `CGMES_bigger.zip` is the bigger archive and theoretically represents France's network.

First, create `Downscaling` class, with a main method and a logger.

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Downscaling {

    private static final Logger LOG = LoggerFactory.getLogger(Downscaling.class);
    
    public static void main(String[] args) {
        
    }
    
    /**
     * Private constructor
     */
    private Downscaling() {}
}

```

### Prepare the networks directory

Create the `downscaling/initial/src/main/resources/networks` directory. You must deposit all the CGMES archives you want to manipulate inside.

### Write network import code

Create a `Set<Network>` loaded with each zip file contained in the networks directory :

```java
Set<Network> networks = new HashSet<>();
final URL networksDir = Downscaling.class.getClassLoader().getResource("networks");
Files.walk(Paths.get(networksDir.toURI()))
    .filter(Files::isRegularFile)
    .filter(f -> f.toString().endsWith(".zip"))
    .forEach(zipFile -> {
        try {
            final Network network = Importers.loadNetwork(zipFile.toFile().toString());
            networks.add(network);
        } catch (Exception e) {
            LOGGER.error("Could not load network from file [" + zipFile.getFileName().toString() + "]", e);
        }
    });
```

Since we logged any error occurring with networks loading, you should be able to troubleshout import problems more easily.

## Import the timeseries from CSV file

We will load timeseries from a simple CSV file. While other, more reliable and shareable formats are supported by Powsybl, the CSV format allows you to have a direct insight into the raw data you manipulate.

The `downscaling/complete/src/main/resources/ts-test.csv` file contains test timeseries data you can use to run this tutorial. You can copy it to  `downscaling/initial/src/main/resources`.

In the provided timeseries store, we will use the timeseries names to map them to networks equipments. The timeseries will be identified by their names (column header in the CSV file):

- Production timeseries : Each timeseries has a named formed with its country code and its energy production type. For instance, french nuclear power will be referenced by the **NUCLEAR_FR** timeseries.
- Consumption timeseries : Only one timeseries is needed to represent power consumption in each country. For instance, british power load will be referenced by **LOAD_GB** timeseries.

If mapping process cannot find a timeseries for a given equipment, code will crash!

### Write timeseries import code

In Powsybl, timeseries are grouped and accessed in data-structures called `TimeSeriesStore`. Create an `InMemoryTimeSeriesStore` (timeseries data will be actually present directly in JVM memory) and populate it with the `ts-test.csv` file.

```java
final InMemoryTimeSeriesStore store = new InMemoryTimeSeriesStore();
InputStreamReader isr = new InputStreamReader(Downscaling.class.getClassLoader().getResourceAsStream("ts-test.csv"));
final BufferedReader reader = new BufferedReader(isr);
store.importTimeSeries(reader);
```

## Load mapping DSL script

Poswybl Metrix mapping defines a DSL in groovy language allowing to script actions to execute during Metrix operations. Please refer to  [mapping DSL documentation](../../simulation/simulation/metrix/mapping.md) for further information.

A `TimeSeriesDslLoader` data structure needs to be built to load the DSL script:

```java
final Path mappingFilePath = Paths.get(Downscaling.class.getClassLoader().getResource("mapping.groovy").toURI());
TimeSeriesDslLoader dslLoader;
try (Reader reader = Files.newBufferedReader(mappingFilePath)) {
    dslLoader = new TimeSeriesDslLoader(reader, mappingFilePath.getFileName().toString());
}
```

### A look at the DSL loading script

The DSL loading script is in groovy format. It will be executed by the mapping operation and its content defines what will be actually done.

On top of groovy language, Powsybl-metrix defines a Domain Specific Language or DSL that allows you to quickly define operations relative to networks mapping. The script will be run once per network, here is its content script explained:

```groovy
import com.powsybl.iidm.network.EnergySource

// Retrieve the current network country
country = network.getCountries().iterator()[0]

// Iterate over all possible energy sources
for (eSource in EnergySource.values()) {
    // Run the mapToGenerators function : allows to visit all generators
    // and to define the specifics of the mapping operation to perform
    mapToGenerators {
        timeSeriesName eSource.toString() + '_' + country.toString() // name of the timeseries to map
        distributionKey { 
            generator.maxP // Distribution key : what value should be used to ponderate the global value repartition on generators
        }
        filter {
            generator.energySource == eSource // Filter : only map on selected generators
        }
    }
}

// Run the mapToLoads function : allows to visit all loads
mapToLoads {
    timeSeriesName 'LOAD_' + country.toString()
    distributionKey {
        load.p0
    }
}

```

 





 

 ## Perform mapping on each network

Next, we will iterate over each network to map the matching timeseries on its generators and loads. The code to come will be comprised into the following loop:

```java
for (final Network network : networks) {
    // ...
}
```

### Prepare timeseries to map

We make the hypothesis that each network expands on one and only one country. Using this information (and the Powsybl IIDM API) we can prepare the names of all the timeseries in the storer that will be used in the mapping.

```java
Country country = network.getCountries().iterator().next();
Set<String> tsNames = new HashSet<>();
Streams.stream(network.getGenerators())
    .map(Generator::getEnergySource)
    .distinct()
    .forEach(eSource -> tsNames.add(eSource.toString() + "_" + country.toString()));
tsNames.add("LOAD_" + country.toString());
```

### Prepare mapping parameters

Metrix mapping is highly parametrizable. Prepare inputs for the mapping execution :

```java
final MappingParameters mappingParameters = MappingParameters.load();
final ComputationRange computationRange = new ComputationRange(tsStore.getTimeSeriesDataVersions(), 1, 1);
final TimeSeriesMappingConfig mappingConfig = dslLoader.load(network, mappingParameters, tsStore, computationRange);
mappingConfig.setMappedTimeSeriesNames(tsNames);

// Initialize mapping parameters
final Range<Integer> pointRange = Range.closed(0, mappingConfig.checkIndexUnicity(tsStore).getPointCount() - 1);
final TimeSeriesMapperParameters tsMappingParams = new TimeSeriesMapperParameters(
    new TreeSet<>(tsStore.getTimeSeriesDataVersions()),
    pointRange,
    true,
    true,
    mappingParameters.getToleranceThreshold()
);
```

- Computation range defines all the versions of the timeseries that need to be mapped. In this tutorial, we only handle single-versioned timeseries.
- Point range defines the number of timesteps that need to be mapped. Here, we use the whole horizon for all timeseries (provided timeseries have the same horizon). 
- Mapping parameters object allows to load general mapping behavior parameters, from the `config.yml` file. 

### Prepare output

We would like to export output CSV files to an output directory. In this tutorial, we define output path as configurable by the main method caller (in main args).

```java
final Path outputPath = Paths.get(args[0]);
```

Each network downscaling will produce an output file and a log file, stored in a separate directory named after the network's country.

```java
final Path networkOutputDir = outputPath.resolve(country.getName());
Files.createDirectories(networkOutputDir);
```

### Mapping observers

Performing mapping will require to iterate over (visit) all network equipments.  Actually, this operation can be very expensive in processor time and we would prefer to perform it as little as possible. A naive approach would do the following :

- Visit each equipment to map values on it.
- Visit each equipment again to output the mapped value.

Metrix mapping allows for a far better strategy, using the Observer pattern. Register observers in the mapping process, they will execute custom code each time a node gets visited. This way, network gets visited only once and all useful operations are performed at the same time.

Here, we will use an `EquipmentTimeSeriesWriter` : writes a new line in a CSV output file each time an equipment gets mapped. Note that each timeseries version is mapped independently : an output file for each version (named `<version_name>.csv`) is created. In our case, only a `version_1.csv` file will be produced for each country.

```java
TimeSeriesMapperObserver equipmentWriter = new EquipmentTimeSeriesWriter(networkOutputDir);
```

 ### Execute mapping

Prepare mapping logs and perform actual mapping with a simple call:

```java
TimeSeriesMappingLogger logger = new TimeSeriesMappingLogger();
mapper.mapToNetwork(tsStore, tsMappingParams, Collections.singletonList(equipmentWriter));
logger.writeCsv(networkOutputDir.resolve("mapping.log"));
```

 ## Going further : Output networks

You can use another type of mapping observer to export the network in addition to the equipments mapped values.

We will export to a `network.xml` file in the country output directory. Both equipments values export and network export will be performed at the same time.

```java
// Prepare observers
final TimeSeriesMapperObserver equipmentWriter = new EquipmentTimeSeriesWriter(networkOutputDir);
final DataSource dataSource = DataSourceUtil.createDataSource(networkOutputDir, "network", null);
final TimeSeriesMapperObserver networkPointWriter = new NetworkPointWriter(network, dataSource);
final ArrayList<TimeSeriesMapperObserver> observers = Lists.newArrayList(equipmentWriter, networkPointWriter);
// Perform mapping
mapper.mapToNetwork(tsStore, tsMappingParams, observers);            
```

## Summary

We have learnt how to write Java code to run mapping in a downscaling context. 
We've shown how to load network files in CGMES format, how to load local CSV timseries files, and how to define a mapping DSL script. We have defined what are mapping observers and how to use them to output mapping results in files.

## Going further
The following links could also be useful:
- [Run a power flow through an iTools command](../../user/itools/loadflow.md): Learn how to perform a power flow calculation from the command line 
- [Sensitivity analysis tutorial](./sensitivity-analysis.md): Learn how to write the Java code to perform sensitivity analyses