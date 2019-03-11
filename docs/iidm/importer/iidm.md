---
title: IIDM Importer
layout: default
todo:
    - add support to JSON files
---

The IIDM (**i**Tesla **I**nternal **D**ata **M**odel) format was designed during the [iTesla project](http://www.itesla-project.eu).
IIDM is not only an exchange format, but also the internal format used in powsybl as it is designed for simulation purpose.
For more information about the IIDM model, see [here](../model/index.md).

IIDM networks can be serialized in XML files. The IIDM importer supports files with the following extensions: `*.xml`,
`*.xiidm` and `*.iidm`.

The IIDM importer has three importing modes:

- **First mode** : Imports the network and its extensions from a unique file.
    
- **Second mode** : Imports the network from a file and the extensions from another file. 
    
- **Third mode** : Imports the network from a file and each extension type from a separate file.

# Example
```xml
<?xml version="1.0" encoding="UTF-8"?>
<iidm:network xmlns:iidm="http://www.itesla_project.eu/schema/iidm/1_0" id="sim1" caseDate="2013-01-15T18:45:00.000+01:00" forecastDistance="0" sourceFormat="test">
    <iidm:substation id="P1" country="FR" tso="RTE" geographicalTags="A">
        <iidm:voltageLevel id="VLGEN" nominalV="24.0" topologyKind="BUS_BREAKER">
            <iidm:busBreakerTopology>
                <iidm:bus id="NGEN"/>
            </iidm:busBreakerTopology>
            <iidm:generator id="GEN" energySource="OTHER" minP="-9999.99" maxP="9999.99" voltageRegulatorOn="true" targetP="607.0" targetV="24.5" targetQ="301.0" bus="NGEN" connectableBus="NGEN">
                <iidm:minMaxReactiveLimits minQ="-9999.99" maxQ="9999.99"/>
            </iidm:generator>
        </iidm:voltageLevel>
        <iidm:voltageLevel id="VLHV1" nominalV="380.0" topologyKind="BUS_BREAKER">
            <iidm:busBreakerTopology>
                <iidm:bus id="NHV1"/>
            </iidm:busBreakerTopology>
        </iidm:voltageLevel>
        <iidm:twoWindingsTransformer id="NGEN_NHV1" r="0.26658461538461536" x="11.104492831516762" g="0.0" b="0.0" ratedU1="24.0" ratedU2="400.0" bus1="NGEN" connectableBus1="NGEN" voltageLevelId1="VLGEN" bus2="NHV1" connectableBus2="NHV1" voltageLevelId2="VLHV1"/>
    </iidm:substation>
    <iidm:substation id="P2" country="FR" tso="RTE" geographicalTags="B">
        <iidm:voltageLevel id="VLHV2" nominalV="380.0" topologyKind="BUS_BREAKER">
            <iidm:busBreakerTopology>
                <iidm:bus id="NHV2"/>
            </iidm:busBreakerTopology>
        </iidm:voltageLevel>
        <iidm:voltageLevel id="VLLOAD" nominalV="150.0" topologyKind="BUS_BREAKER">
            <iidm:busBreakerTopology>
                <iidm:bus id="NLOAD"/>
            </iidm:busBreakerTopology>
            <iidm:load id="LOAD" loadType="UNDEFINED" p0="600.0" q0="200.0" bus="NLOAD" connectableBus="NLOAD"/>
        </iidm:voltageLevel>
        <iidm:twoWindingsTransformer id="NHV2_NLOAD" r="0.04724999999999999" x="4.049724365620455" g="0.0" b="0.0" ratedU1="400.0" ratedU2="158.0" bus1="NHV2" connectableBus1="NHV2" voltageLevelId1="VLHV2" bus2="NLOAD" connectableBus2="NLOAD" voltageLevelId2="VLLOAD">
            <iidm:ratioTapChanger lowTapPosition="0" tapPosition="1" regulating="true" loadTapChangingCapabilities="true" targetV="158.0">
                <iidm:terminalRef id="NHV2_NLOAD" side="TWO"/>
                <iidm:step r="0.0" x="0.0" g="0.0" b="0.0" rho="0.8505666905244191"/>
                <iidm:step r="0.0" x="0.0" g="0.0" b="0.0" rho="1.0006666666666666"/>
                <iidm:step r="0.0" x="0.0" g="0.0" b="0.0" rho="1.150766642808914"/>
            </iidm:ratioTapChanger>
        </iidm:twoWindingsTransformer>
    </iidm:substation>
    <iidm:line id="NHV1_NHV2_1" r="3.0" x="33.0" g1="0.0" b1="1.93E-4" g2="0.0" b2="1.93E-4" bus1="NHV1" connectableBus1="NHV1" voltageLevelId1="VLHV1" bus2="NHV2" connectableBus2="NHV2" voltageLevelId2="VLHV2"/>
    <iidm:line id="NHV1_NHV2_2" r="3.0" x="33.0" g1="0.0" b1="1.93E-4" g2="0.0" b2="1.93E-4" bus1="NHV1" connectableBus1="NHV1" voltageLevelId1="VLHV1" bus2="NHV2" connectableBus2="NHV2" voltageLevelId2="VLHV2"/>
</iidm:network>
```

# Configuration properties for IIDM-XML importer

These properties can be defined in the configuration file in the [import-export-parameters-default-value](../../configuration/modules/import-export-parameters-default-value.md)
module.

## iidm.import.xml.throw-exception-if-extension-not-found
The `iidm.import.xml.throw-exception-if-extension-not-found` property is an optional property
that defines if the XIIDM importer throws an exception while trying to import an unknown or undeserializable extension or if
it just ignores it. Its default value is `false`.


## iidm.import.xml.import-mode
The `iidm.import.xml.import-mode` property is an optional property
that defines the import mode of the XIIDM importer. 

Its possible values are :

   - `IidmImportExportMode.UNIQUE_FILE`: Imports the network and its extensions from a unique file.
    
   - `IidmImportExportMode.EXTENSIONS_IN_ONE_SEPARATED_FILE`: Imports the network from a file and the extensions from another file. 
      In this case if the network file name is network.xiidm, the extensions file name must be network-ext.xiidm.
    
   - `IidmImportExportMode.ONE_SEPARATED_FILE_PER_EXTENSION_TYPE`: Imports the network from a file and each extension type from a separate file.
      In this mode each extension file name must be networkName-extensionName.xiidm.
      Example : if we have an extension file for the `loadFoo` extension type and our network name is `test`, the file name must be `test-loadFoo.xiidm`.
      
The default value of this parameter is `IidmImportExportMode.NO_SEPARATED_FILE_FOR_EXTENSIONS`.

## iidm.import.xml.extensions
The `iidm.import.xml.extensions` property is an optional property that defines the list of extensions that we want to import by the XIIDM importer. 
By default all extensions will be imported.

# Deprecated configuration properties for IIDM-XML importer

## throwExceptionIfExtensionNotFound
The `throwExceptionIfExtensionNotFound` property is deprecated since v2.0.0. Use the `iidm.import.xml.throw-exception-if-extension-not-found` property instead.


# Maven configuration
To support IIDM-XML files, add the following dependencies to the `pom.xml` file.
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-xml-converter</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
**NB**: In order to work, the IIDM-XML importer also need an IIDM implementation in the `pom.xml`. Powsybl
provides one so you can simply add it:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-impl</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
