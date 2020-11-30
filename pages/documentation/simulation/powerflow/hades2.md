---
layout: default
---

# Hades2

Hades2 is a software edited by [RTE](https://www.rte-france.com), the french TSO. This simulator is distributed as a freeware (see the [license agreement](https://rte-france.github.io/hades2/license.html)).

* TOC
{:toc}

## Installation
Hades2 is available for GNU Linux and Windows. See the [installation guide](https://rte-france.github.io/hades2/index.html#installation-guide) to learn how install the software and use it with PowSyBl.

## Configuration
To use Hades2 with PowSyBl, you have to configure the `load-flow` module in your configuration file:
```yaml
load-flow:
  default-impl-name: "Hades2"
```

You also have to configure the `hades2` module to indicate where Hades2 software is installed. 
```yaml
hades2:
    homeDir: <PATH_TO_HADES_2>
```

In this section, you may also choose the option `debug: true` to tell PowSyBl not to erase the temporary folder created by Hades2 for the calculation.
This makes it possible to check what happened on the Hades2 side for debugging purposes.

### Specific parameters

#### Import export parameters

**computedLossAngle**  
The `computedLossAngle` property is an optional property that defines if the ADN `computedLossAngle` attribute is exported during ADN export for tap changers or not.
The default value of this parameter is `true`.

**hvdcAcEmulation**  
The `hvdcAcEmulation` property is an optional property that defines if AC emulation is simulated. The default value of
this parameter is `true`.

**minimumReactancePerUnit**    
The `minimumReactancePerUnit` property is an optional property that defines the minimal threshold for reactance per unit during ADN export. 
When the resistance **and** reactance of a quad both equal to zero, the reactance per unit of this quad is cut to this `minimumReactancePerUnit`. 
If the reactance per unit of a quad is lower than `minimumReactancePerUnit` **and** if the `withMinimumReactance` property is set to `true`, 
the reactance per unit of this quad is cut to this `minimumReactancePerUnit`. The default value of this parameter is `0.000625`.

**withMinimumReactance**   
The `withMinimumReactance` property is an optional property that defines if there should be a minimal threshold for reactance during
ADN export or not (please see `minimumReactancePerUnit` for more details). The default value of this parameter is `true`.

Then, you need to configure the import export parameters. For example:
```yaml
import-export-parameters-default-value:
  iidm.export.adn.angle-perte: false
  iidm.export.adn.with-minimum-reactance: true
  iidm.export.adn.minimum-reactance-per-unit: 0.0007
```

#### Hades2 default parameters

**balanceNormEpsilon**  
The `balanceNormEpsilon` property is an optional property that defines the epsilon on production-consumption balance. The
default value of this parameter is `-1`.

**bilanPV**  
The `bilanPV` property is an optional property that defines if the slack bus should be a voltage controlled bus. The default value of this parameter is `false`.  

**computedConnectedComponentNumber**  
The `computedConnectedComponentNumber` property is an optional property that defines the number of the connected
components to simulate. If `computedConnectedComponentNumber` is 0, the calculation is done on all the calculable connected components.
The default value of this parameter is `1`.

**countriesToBalance**  
The `countriesToBalance` property is an optional property that defines the list of [ISO-3166](https://en.wikipedia.org/wiki/ISO_3166-1)
country codes used for unbalance redistribution. If this parameter is not set, there is no redistribution.

**dcCosphi**  
The `dcCosphi` property is an optional property that defines the `cos(φ)` used during simulation. The default value of
this parameter is `1`.

**dcUseTransformerRatio**  
The `dcUseTransformerRatio` property is an optional property that defines if ratio of transformers should be used in the
flow equations. The default value of this parameter is `false`.

**dcVoltageCoeff225**  
The `dcVoltageCoeff225` property is an optional property that defines the multiplication factor of the nominal voltage
for 225 kV voltage level. The default value of this parameter is `1.0`. If this parameter is set to `-1`, the nominal
voltages are used.

**dcVoltageCoeff400**  
The `dcVoltageCoeff400` property is an optional property that defines the multiplication factor of the nominal voltage
for 400 kV voltage level. The default value of this parameter is `1.0`. If this parameter is set to `-1`, the nominal
voltages are used.

**dcVoltageInitMode**  
The `dcVoltageInitMode` property is an optional property that defines the voltage initialization mode. The default value
of this parameter is `V_NORMALISE_NDC`. The supported values for this parameter are:
- `V_CALCULE`: active/reactive load-flow
- `V_NORMALISE_NAC`: flat with reintegration of losses
- `V_NORMALISE_NDC`: flat

**debugMode**  
The `debugMode` property is an optional property that defines the level of debug. The default value of this parameter is
`NO_DEBUG`. The supported values for this parameter are:
- `NO_DEBUG`: no debug information
- `ES_LF`: debug for load-flow
- `ES_AS`: debug for security analysis
- `ETATS_INTERMEDIAIRES`: debug the intermediate states

**detectPermanentLimitViolation**  
The `detectPermanentLimitViolation` property is an optional property that defines if Hades has to detect current violations
for permanent limit if the equipments has temporary limits. The default value of this parameter is `false`.

**distributeSlackAtBoundaries**  
The `distributeSlackAtBoundaries` property is an optional property that says if boundaries should be adjusted during slack distribution. The default value of this parameter is `false`.

**logLevel**  
The `logLevel` property is an optional property that defines the log level. The default value of this parameter is `DEBUG`.
The supported values for this parameter are:
- `PAS`: minimal logging level
- `EXPERT`: expert logging level
- `DEBUG`: debug logging level

**luFactorizationMode**  
The `luFactorizationMode` property is an optional property that defines the LU factorization implementation to use. The
default value of this parameter is `RLU`. The supported values for this parameter are:
- `RLU`: RTE LU factorization implementation
- `KLU`: SuiteSparse LU factorization implementation

**maxRealisticVoltage**  
The `maxRealisticVoltage` property is an optional property that defines percentage of maximum realistic voltage regarding
the nominal voltage. The default value of this parameter is `150`.

**minBusesNbInConnectedComponent**  
The `minBusesNbInConnectedComponent` property is an optional property that defines the minimum number of buses in a
connected component to be computed. The default value of this parameter is `1`.

**minRealisticVoltage**  
The `minRealisticVoltage` property is an optional property that defines percentage of minimum realistic voltage regarding
the nominal voltage. The default value of this parameter is `50`.

**nbMaxIterations**  
The `nbMaxIterations` property is an optional property that defines the maximum number of iterations in the load flow. The
default value of this parameter is `-1`.

**nbMaxVoltageRegulationSwitch**  
The `nbMaxVoltageRegulationSwitch` property is an optional property that defines the maximal number of allowed PV-PQ
switches. The default value of this parameter is `-1`.

**nbThreads**  
The `nbThreads` property is an optional property that defines the number of threads used during simulation. The default
value of this parameter is `1`.

**normEpsilon**  
The `normEpsilon` property is an optional property that defines the criterion of Newton-Raphson convergence. The default
value of this parameter is `-1`.

**oldJacobian**  
The `oldJacobian` property is an optional property that defines the way to generate the Jacobian matrix. Use `false` to
have a human readable Jacobian matrix or `true` to increase performances. The default value of this parameter is `false`.

**remoteVoltageGenerators**  
The `remoteVoltageGenerators` property is an optional property that defines if remote voltage regulation for generators is rendered as such
during ADN export or transformed into local voltage regulation using cross products. The default value of this parameter is `true`.

**slackNodeDeterminationMode**  
The `slackNodeDeterminationMode` property is an optional property that defines the voltage range in which the slack node
can be chosen. The default value of this parameter is `BILAN_400`. The supported values for this parameter are:
- `BILAN_400`: the slack node can be chosen on 360-450 kV
- `BILAN_225_400`: the slack node can be chosen on 180-420 kV

**svcRegulation**  
The `svcRegulation` property is an optional property that defines if the SVCs are simulated. The default value of this
parameter is `true`.

**transformerVoltageControlSimulationMode**  
The `transformerVoltageControlSimulationMode` property is an optional property that defines the method of simulation of
tap changers in the load flow. The default value of this parameter is `SIMU_REG_HORS_NR`. The supported values for this
parameter are:
- `SIMU_REG_HORS_NR`: SVCs are simulated outside the Jacobian
- `SIMU_REG_DANS_NR`: SVCs are simulated in the Jacobian (experimental)
- `SIMU_REG_HORS_LF`: SVCs are simulated in an external loop (experimental)

**writeState**  
The `writeState` property is an optional property that defines if debug files should be exported. The default value of
this parameter is `false`.

Then, you need to configure the load flow calculation itself. For example:
```yaml
hades2-default-parameters:
    computedConnectedComponentNumber: 0
    remoteVoltageGenerators: true
    svcRegulationOn: true
    maxRealisticVoltage: 120
    minRealisticVoltage: 80
    detectPermanentLimitViolation: true
```

#### Hades2 limit reductions parameters

**limitReductions**  
The `limitReductions` property is an optional property that defines the limit reductions for permanent and temporary
limits for a given range of voltage. See the [ADNLimitReductionsParameters](https://rte-france.github.io/hades2/configuration/ADNLimitReductionsParameters.html) page for
more details.