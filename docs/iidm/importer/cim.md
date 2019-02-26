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

# Configuration properties for CIM1 importer

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../configuration/modules/import-export-parameters-default-value.md)
module.

## iidm.import.cim1.invert-voltage-step-increment-out-of-phase
The `iidm.import.cim1.invert-voltage-step-increment-out-of-phase` property is an optional property that defines if the CIM1 Importer
inverts the `voltageStepIncrementOutOfPhase` attribute. Its default value is `false`.

## iidm.import.cim1.default-country
The `iidm.import.cim1.default-country` property is an optional property that defines the country the substation belongs to
by default if it is not indicated in the file. Its default value is `AFGHANISTAN`.

## iidm.import.cim1.use-psse-naming-strategy
The `iidm.import.cim1.use-psse-naming-strategy` property is an optional property that defines if the CIM1 Importer uses
the PSS/E naming strategy or not. Its default value is `true`.

## iidm.import.cim1.substation-id-excluded-from-mapping
The `iidm.import.cim1.substation-id-excluded-from-mapping` property is an optional property that defines the IDs of the
substations excluded from the network during the import of the CIM1 file. Its default value
is an empty list.

# Deprecated configuration properties for CIM1 importer

## invertVoltageStepIncrementOutOfPhase
The `invertVoltageStepIncrementOutOfPhase` is deprecated since V2.4.0. Use `iidm.import.cim1.invert-voltage-step-increment-out-of-phase` instead.

## defaultCountry
The `defaultCountry` is deprecated since V2.4.0. Use `iidm.import.cim1.default-country` instead.

## usePsseNamingStrategy
The `usePsseNamingStrategy` is deprecated since V2.4.0. Use `iidm.import.cim1.use-psse-naming-strategy` instead.

## substationIdExcludedFromMapping
The `substationIdExcludedFromMapping` is deprecated since V2.4.0. Use `iidm.import.cim1.substation-id-excluded-from-mapping` instead.

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
**NB**: In order to work, the CIM1 importer also need an IIDM implementation in the `pom.xml`. Powsybl
provides one so you can simply add it:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-impl</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
