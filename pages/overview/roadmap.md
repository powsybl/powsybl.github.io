---
layout: default
---

# Roadmap
## Documentation
- [Expected contributions](https://github.com/powsybl/powsybl.github.io/blob/main/pages/todo/expected-contributions.md) for next months
- Improve our functional documentation
- More and more user stories
- More and more tutorials

## Converters
### CIM-CGMES
#### Importer
- End of basic importer of static information, only improvements remain: improve the support of transformers at boundary, support of conversion of remote reactive power control, refactoring of TieLine in order to access directly to the underlying DanglingLines.
- CIM-CGMES 3.0: test configurations for CGMES 3.0 support expected mid 2021.
- EQ profile only: work in progress [here](https://github.com/powsybl/powsybl-core/pull/1680).
- Improvement of HVDC modelling: the ENTSO-E WG implementation guide for DC part is available, but we are waiting for test or real cases to start. If you have some, please let us know or join the community to contribute.
- Merging through the read-only merging view of the network: a complete implementation will be available end of 2021.
- Generation and Load Shift Keys (GLSK) and Contingency list, Remedial Actions and additional Constraints (CRAC) management: end of 2021.

Pending subjects: short circuit (waiting for an engine) and operation stereotypes, dynamics profile.

#### Exporter
- Incremental export: export back to a CIM-CGMES file, a network that has been imported from a CIM-CGMES file.
  - The export of the SV (bus/branch and node/breaker) and the SSH profiles are available.
  - TP export: 2022.
- Full export: export to a CIM-CGMES file, a network imported from any supported format. The EQ profile export will be available mid 2021.

### XIIDM
#### Importer
- Current IIDM version for the Java implementation: 1.5
- Current IIDM version for the C++ implementation: 1.5

#### Exporter
- Current IIDM version for the Java implementation: 1.5
- Current IIDM version for the C++ implementation: 1.5

### UCTE
#### Exporter
- Functional logs: work in progress in order to be compatible with a micro-services architecture. Expected end of 2021.

### JSON
#### Importer
- to be done

#### Exporter
- to be done

## Grid modeling
The backward compatibility management is robust. We have now a strong basis to change the core network model:
- DC line modelling improvement and DC network modelling: 2022.
- Extensions for monitoring: work in progress.
- Merging view when several networks are merged: refactoring of TieLine expected end of 2021.

## Simulators
### Dynawo
The integration of [Dynawo](https://dynawo.github.io/) is working: feature available on a IEEE14 network. We aim to work on:
- Support of more dynamics models.
- Support of automatons and events: the difficulty is that they have no place in the static grid modelling and they can involved several equipments of the network.
- Support modifications on the network by the simulator.
-  Groovy: improve the user experience.
-  DynaFlow: support of security analysis implementation.
-  Support of DSA, dynamic security analysis: 2022.
-  Support of margin calculation: 2022.

### OpenLoadFlow
Improving our open load flow used for tests, experimental and collaboration purposes. For more information, please read the [README file](https://github.com/powsybl/powsybl-open-loadflow/blob/main/README.md). We are still working on:
- A faster security analysis: work in progress and expected before the end of 2021. 
- Support of DC security analysis based on the DC sensitivity analysis implementation: work in progress.
- Voltage control:
    - Transformer voltage control will be improved before the end of 2021
    - Shunt local control is already available in a [branch](https://github.com/powsybl/powsybl-open-loadflow/pull/191)
    - Support of the static var compensator slope is already available as a beta-feature in a [branch](https://github.com/powsybl/powsybl-open-loadflow/pull/304)
- Remote reactive power control: work in progress in this [branch](https://github.com/powsybl/powsybl-open-loadflow/pull/266).
- Support of Ward Injection reduction: expected before the end of 2021.
- Sensitivity analysis: support for users. Do not hesitate to ask us for more features!
- Refactoring: we want to increase our network listener that updates automatically the equation system. It is needed to better manage controls.
- Increase security analysis and sensitivity analysis: support of all type of contingencies, support of all kind of operational limits, etc.

### Security Analysis API
The security analysis API will evolve to:
- be consistent with other, renewed, computations API (loadflow for example)
- provide the possibility to retrieve more information than just violations: currents and flow on specified branches, voltages on specified voltage levels

### Pypowsybl
The PyPowSyBl project gives access PowSyBl Java framework to Python developers. This Python integration relies on GraalVM to compile Java code to a native library.
Ongoing and foreseen improvements include:
- improve the [documentation](https://pypowsybl.readthedocs.io/en/latest/) and provide notebooks examples
- access to more equipments data (batteries ...)
- add core IIDM extensions handling
- access to voltage level topology views
- improve computation parameters management (initialize from config, extensions, split AC and DC parameters)
- network variants management
- possibility to include private plugins in the build process
- add factors specific to one contingency to sensitivity analysis
- add zone to slack and zone to zone factors to sensitivity analysis
- GLSK (UCTE and CGMES) file support
- add dynamic simulation API (DynaWaltz integration)
- support network reduction with equivalent
- improve load flow performance (better integration)
- network elements creation
- network diagram generation

### Balances adjustment
Support of a constant power factor on loads during scaling, required for the European Merging Function: mid 2021.

### ENTSOE
We have created a repository dedicated to components specific to ENTSO-E-orientated processes. We support here CIM-CGMES oriented control areas through CgmesVoltageLevelsArea object and CgmesBoundariesArea object useful for partial merging.
We are also working on:
- A CNE export of security analysis results ;
- A PEVF and CGMA importer: already available. Tests are performed through our involvement in interoperability tests.

## Data management
### Network store
- A persistent implementation of the network grid model (IIDM) based on [Apache Cassandra](http://cassandra.apache.org/)
- A Persistent implementation of the extensions

### AFS
- Storing nodes data as plain files 
- Mixed app storage implementation (files for data, cassandra for tree structure ...)

### Time series
We are working on a time series store for an efficient storing and requesting of time series we need for our use cases:
- In long-term studies, we store and request load and production stochastic forecasts over a complete year (see [Metrix simulation](https://www.powsybl.org/pages/documentation/simulation/metrix/)).
- In dynamic simulation, we have to store the time-domain results.

## Viewing
- Voltage level view: display clean, pretty and interactive drawings of voltage levels
- Substation view: display clean, pretty and interactive drawings of substations
- Improvement of the graphical charter of electro-technical components
- A geographical web view of the network: done
- A zonal view of the network to ease operations

## High level services
- Package and distribute computation services based on spring, as docker images

## Tutorials
We plan to create a CIM-CGMES based tutorial that implements the European Merging Function. The CIM-CGMES workflow consists in importing networks (also called Individual Grid Model), running a power flow, merging the networks (topologically at least), running a power flow on the merged network (also called Common Grid Model), computing a balances adjustment based on PEVF and CGMA files containing the AC positions, applying modifications and exporting the updated network(s). It can be noted that only AC positions are considered since no PEVF with valid DC positions has been received on our end. If you have access to one, please let us know or join the community to contribute. This tutorial will be used during interoperability tests.

## Grid Study Environment
Archived.
