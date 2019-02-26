---
title: CGMES Importer
layout: default
todo:
    - add configuration properties (when the PR is done)
---

The CMGES (**C**ommon **G**rid **M**odel **E**xchange **S**pecification) is an IEC technical specification (TS) based
on the IEC CIM (**C**ommon **I**nformation **M**odel) family of standards.​ It was developed to meet necessary requirements
for TSO data exchanges in the areas of system development and system operation.

Current supported version of CGMES is 2.4.15, that is based on CIM 16.

To learn more about CGMES files, read the complete [CMGES format specification](https://www.entsoe.eu/digital/common-information-model/#common-grid-model-exchange-specification-cgmes).

# Examples
Have a look to the [CGMES sample files](https://docstore.entsoe.eu/Documents/CIM_documents/Grid_Model_CIM/TestConfigurations_packageCASv2.0.zip)
from ENTSO-E Test Configurations for Conformity Assessment Scheme v2.0.

# Maven configuration
To support CGMES files, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-cgmes-conversion</artifactId>
    <version>${powsybl.version}</version>
</dependency>
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-cgmes-model</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
**NB**: In order to work, the CGMES importer also need an IIDM implementation in the `pom.xml`. Powsybl
provides one so you can simply add it:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-impl</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
