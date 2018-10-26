---
title: CIM Importer
layout: default
---

ENTSO-E approved the first version of the CIM based data exchange specification for grid models in 2009, based on IEC
CIM14 (UML14v02) and known as ENTSO-E Profile 1.

Profile 1 is currently valid for ENTSO-E data exchanges until an approved version of the [CGMES](cgmes.md) is implemented
and comes into force. The ENTSO-E CIM Profile 1 defines how ENTSO-E members, using software from different vendors, will
exchange grid modelling information as required by ENTSO-E and TSO business activities.

To facilitate the implementation of this specification, in the period 2013-2014, the ENTSO-E CIM Profile 1 document was
revised to include the agreements reached in the intero​perability test 2013 which were published as separate annex to
the specification.

Please refers to the official [ENTSO-E COM Profile 1](https://www.entsoe.eu/digital/common-information-model/#entso-e-cim-profile-1)
website.


# Maven configuration
To support CIM files, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-cim1-converter</artifactId>
    <version>${powsybl.version}</version>
</dependency>
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-cim1-model</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
