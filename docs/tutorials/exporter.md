---
title: How to write an IIDM exporter
layout: default
---

# Tutorial - Writing an IIDM exporter

From PowSyBl's [Exporter](../iidm/exporter/index.md) interface, it is possible to add a new
data serialization format for a [IIDM](../iidm/model/index.md) network.

In order to do so, you will need to:
- Write an implementation of the `Exporter` interface and assign it a unique ID format
- Declare the new class as a service implementation with the `@AutoService` annotation
- Build your jar

## Configuring your module

In order to implement a new Exporter, add the following dependencies
- `auto-service (com.google.auto.service)`: Configuration/metadata generator for `ServiceLoader`-style providers
- `powsybl-iidm-converter-api`:  IIDM network import/export API
- `powsybl-iidm-impl`: IIDM network model implementation

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
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-iidm-impl</artifactId>
        <version>${powsybl.core.version}</version>
    </dependency>
</dependencies>
```

## Implementation

As said above, you will need to write your own implementation of the `Exporter` interface
and declare it as a service implementation.
Here is an empty class template of an `Exporter` implementation:

```java
import com.powsybl.commons.datasource.DataSource;
import com.powsybl.iidm.export.Exporter;
import com.powsybl.iidm.network.Network;

import java.util.Properties;

@AutoService(Exporter.class)
public class MyExporter implements Exporter {
    
    /**
     * @return the unique ID for the given format
     */
    @Override
    public String getFormat() { 
        return null; 
    }
    
    /**
     * @return information about the exporter
     */
    @Override
    public String getComment() { 
        return null; 
    }
    
    /**
     * @param network the IIDM network to export
     * @param parameters properties specific to this exporter
     * @param dataSource access to outputStream
     */
    @Override
    public void export(Network network, Properties parameters, DataSource dataSource) {
        // business logic to export a model to a given format
    }
    
}
```

## Deployment

### Generating jar

Once your implementation is ready, run the following command to create your project jar:
```
$ cd <PROJECT_HOME>
$ mvn clean install
```

The jar file will be generated in `<PROJECT_HOME>/target`.

### Adding the format in iTools

[iTools](../tools/index.md) allows the user to [convert a network from one format to another](../tools/convert-network.md)
via the `convert-network` command line.

You can add your custom export format to the available output formats of the command by
copying the generated jar in your powsybl distribution as explained [here](). <!-- This link
 will redirect to itools-packager tutorial--> 

## Examples

The code of a simple [CSV Exporter]() is provided in `powsybl-tutorials` as an example of this
tutorial.

To use it, clone the project and deploy as below:
```
$ git clone https://github.com/powsybl/powsybl-tutorials.git
$ cd powsybl-tutorials/csv-exporter
$ mvn clean install
```