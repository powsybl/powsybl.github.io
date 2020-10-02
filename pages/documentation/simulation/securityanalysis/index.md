---
layout: default
---

# Security analysis

* TOC
{:toc}

## Introduction
The security analysis is a simulation that check violations on a network. These checks can be done on the base case or after a contingency, with or without remedial actions.

There is a violation if the computed value is greater than the maximum allowed value. Depending on the equipments, the violations can have different types:
- Current: this kind of violations can be detected on a [branch](../../grid/model/index.md#branches), if the computed intensity is greater than its [permanent limit](../../grid/model/index.md#current-limits) or one of its [temporary limits](../../grid/model/index.md#current-limits).
- Voltage: this kind of violations can be detected on a bus or a [busbar section](), if the computed voltage is out of the voltage limits bounds of a [voltage level](../../grid/model/index.md#busbar-section).

## Inputs

### Network
The first input of the security analysis is a network. As this simulation is basically [power flow](../powerflow/index.md) simulations for a list of contingencies, this network should converge.

### Contingencies
The security analysis may also take, optionally, a list of contingencies as an input. When contingencies are provided, the violations are detected on the network at state N, but also after the application of each contingency. At the moment, the only way to provide contingencies is to use the [Contingency Domain Specific Language](contingency-dsl.md), written in Groovy.

At the moment, it is possible to trigger generators, static VAR compensators, shunts, power lines or two windings transformers, HVDC lines, busbar sections and dangling lines. Equipments can be triggered one at a time (N-1 contingency) or several at a time (N-K contingency). Busbar contingency are special N-K contingency as it triggers all the equipments connected to a given busbar section.

### Remedial actions
Remedial actions are actions that are applied automatically when exploitation rules are violated. For example, this is used to model automatons that can open [switches](../../grid/model/index.md#nb-switch) or change the tap position of a [phase tap changer](../../grid/model/index.md#phase-tap-changer). The remedial actions should be provided using the [Action Domain Specific Language](action-dsl.md) written in Groovy.

The action DSL, provides 3 different inputs:
- the contingencies
- the remedial actions
- the application rules to define when a remedial action is applied

Remedial actions can be *preventive* or *curative*:
- preventive: these actions are implemented before the violation occurs, for example if the flow of a monitored line is between `90%` and `100%`.
- curative: these actions are implemented after a violation occurs, for example if the flow of the monitored line is greater than `100%`.

## Outputs

### Pre-contingency results
The violations are detected on the network at state N, meaning before a contingency occurred. This determine a reference for the simulation. For each violations, we get the ID of the overloaded equipment, the limit type (`CURRENT`, `LOW_VOLTAGE` or `HIGH_VOLTAGE`), the acceptable value and the computed value. For branches, we also have the side where the violation has been detected.

For a simulation with remedial actions, the list of actions that have been applied (the preventive ones) are also given. 

### Post-contingency results
The post-contingency results contains the complete list of the contingencies that have been simulated, and for each of them the violations detected. To limit the size of the results, only new violations or worsened violations are listed. 

For a simulation with remedial actions, the list of curative actions that have been applied are given. 

### Extensions
The results of a security analysis are extendable, meaning you can have additional information attached to the network, the contingencies or the violations.

### Example
The following example is a result of a security analysis with remedial action, exported in JSON:
```json
{
  "version" : "1.0",
  "network" : {
    "id" : "sim1",
    "sourceFormat" : "test",
    "caseDate" : "2018-01-01T11:00:00.000+01:00",
    "forecastDistance" : 0
  },
  "preContingencyResult" : {
    "computationOk" : true,
    "limitViolations" : [ {
      "subjectId" : "NHV1_NHV2_1",
      "limitType" : "CURRENT",
      "limit" : 100.0,
      "limitReduction" : 0.95,
      "value" : 110.0,
      "side" : "ONE",
      "extensions" : {
        "ActivePower" : {
          "value" : 220.0
        }
      }
    } ],
    "actionsTaken" : [ ]
  },
  "postContingencyResults" : [ {
    "contingency" : {
      "id" : "contingency",
      "elements" : [ {
        "id" : "NHV1_NHV2_2",
        "type" : "BRANCH",
        "voltageLevelId" : "VLNHV1"
      }, {
        "id" : "NHV1_NHV2_1",
        "type" : "BRANCH"
      }, {
        "id" : "GEN",
        "type" : "GENERATOR"
      }, {
        "id" : "BBS1",
        "type" : "BUSBAR_SECTION"
      } ]
    },
    "limitViolationsResult" : {
      "computationOk" : true,
      "limitViolations" : [ {
        "subjectId" : "NHV1_NHV2_2",
        "limitType" : "CURRENT",
        "limitName" : "20'",
        "acceptableDuration" : 1200,
        "limit" : 100.0,
        "limitReduction" : 1.0,
        "value" : 110.0,
        "side" : "TWO",
        "extensions" : {
          "ActivePower" : {
            "preContingencyValue" : 220.0,
            "postContingencyValue" : 230.0
          },
          "Current" : {
            "preContingencyValue" : 95.0
          }
        }
      }, {
        "subjectId" : "GEN",
        "limitType" : "HIGH_VOLTAGE",
        "limit" : 100.0,
        "limitReduction" : 0.9,
        "value" : 110.0
      }, {
        "subjectId" : "GEN2",
        "limitType" : "LOW_VOLTAGE",
        "limit" : 100.0,
        "limitReduction" : 0.7,
        "value" : 115.0
      } ],
      "actionsTaken" : [ "action1", "action2" ]
    }
  } ]
}
```

## Implementations

Different implementations are available to run security analyses:
- [Load flow based](security-analysis-impl.md#load-flow-based-implementation): a security analysis implementation based on a power flow simulator 
- [Hades2](security-analysis-impl.md#hades2): a security analysis provided by RTE as a freeware

For remedial actions simulation, only a [load flow based]() implementation is supported at the moment.

## Configuration
<span style="color: red">TODO</span>
- <span style="color: red">Contingencies provider</span>
- <span style="color: red">Simulator</span>

### Violations filtering
The violations listed in the results can be filtered to consider only certain type of violations, to consider only few voltage levels or to limit the geographical area by filtering equipments by countries. Check out the documentation of the [limit-violation-default-filter](../../user/configuration/limit-violation-default-filter.md) configuration module.

**Example**
Using the following configuration, the results will contains only voltage violations for equipments in France or Belgium: 
```yaml
limit-violation-default-filter:
    countries:
        - FR
        - BE
    violationTypes:
        - LOW_VOLTAGE
        - HIGH_VOLTAGE
```

## Going further
To go further about the sensitivity analysis, check the following content:
- [Run a security analysis through an iTools command](../../user/itools/security-analysis.md): Learn how to perform a security analysis from the command line 
