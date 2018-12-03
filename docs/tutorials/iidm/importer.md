---
title: How to write an IIDM importer
layout: default
todo:
    - add an example in powsybl-tutorials and put the link on this page
---

From PowSyBl's [Importer](../../iidm/importer/index.md) interface, it is possible to add a new file format from which
an [IIDM](../../iidm/model/index.md) data model can be loaded.

In order to do so, you will need to:
- Write an implementation of the `Importer` interface
- Declare the new class as a service implementation with the `@AutoService` annotation
- Build your jar

# Configuring your module

In order to implement a new `Importer`, add the following dependencies
- `auto-service (com.google.auto.service)`: Configuration/metadata generator for `ServiceLoader`-style providers
- `powsybl-iidm-converter-api`:  IIDM network import/export API

in your `pom.xml` file:

```xml
<dependencies>
    <dependency>
        <groupId>com.google.auto.service</groupId>
        <artifactId>auto-service</artifactId>
        <version>1.0-rc2</version>
    </dependency>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-iidm-converter-api</artifactId>
        <version>${powsybl.core.version}</version>
    </dependency>
</dependencies>
```

# Implementation

As said above, you will need to write your own implementation of the `Importer` interface and declare it as a service
implementation. Here is an empty class template of an `Importer` implementation:

```java
import com.powsybl.commons.datasource.DataSource;
import com.powsybl.iidm.export.Exporter;
import com.powsybl.iidm.network.Network;

import java.util.Properties;

@AutoService(Importer.class)
public class MyExporter implements Exporter {
    
    /**
     * @return the unique ID for the given format
     */
    @Override
    public String getFormat() { 
        return null; 
    }
    
    /**
     * This override is optional. By default, it returns Collections.emptyList()
     * 
     * @return description of import parameters
     */
     @Override
     public String getParameters() { 
        return Collections.emptyList(); 
     }
    
    /**
     * @return information about the exporter
     */
    @Override
    public String getComment() { 
        return null; 
    }
    
    /**
     * Checks if the data source is importable (i.e. if it describes a network)
     * 
     * @param dataSource the dataSource one wants to import
     * @return  true if the data source is importable, false otherwise
     */
    @Override
    public boolean exists(ReadOnlyDataSource dataSource) {
        return false;
    }
    
    /**
     * Load IIDM model from data source
     * 
     * @param dataSource the data source from which the IIDM model will be loaded
     * @param parameters properties specific to this importer
     */
    @Override
    public void importData(ReadOnlyDataSource dataSource, Properties parameters) {
        // business logic to import a network from a data source in a given format
    }
    
    /**
     * This override is optional. By default, it returns an UnsupportedOperationException.
     * Copy data from one data source to another.
     * 
     * @param fromDataSource origin data source
     * @param toDataSource destination data source
     */
    @Override
    public void copy(ReadOnlyDataSource fromDataSource, DataSource toDataSource) {
        // business logic to copy a network from a data source to another file in a given format
    }
}
```

# Deployment

## Generating jar

Once your implementation is ready, run the following command to create your project jar:
```
$ cd <PROJECT_HOME>
$ mvn clean package
```

The jar file will be generated in `<PROJECT_HOME>/target`.

## Adding the format in iTools

[iTools](../../tools/index.md) allows the user to convert a network from one format to another via the
[convert-network](../../tools/convert-network.md) command line.

You can add your custom import format, allowing files in this format to be converted using the command,
by copying the generated jar in your powsybl distribution:
```
$> cp target/my-exporter.jar <POWYSBL_HOME>/share/java
``` 

# Examples

The code of a simple CSV Importer is available in [powsybl-tutorials](https://github.com/powsybl/powsybl-tutorials) as a
complete example of this tutorial.

To try it, clone the project and deploy as below:
```
$ git clone https://github.com/powsybl/powsybl-tutorials.git
$ cd powsybl-tutorials/csv-importer
$ mvn clean package
```