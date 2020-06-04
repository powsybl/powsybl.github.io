---
layout: default
---

# Security analysis
The security analysis is a simulation that check violations on a network. These checks can be done on the base case or after a [contingency](contingencies.md), with or without remedial actions.

There is a violation if the computed value is greater than the maximum allowed value. Depending on the equipments, the violations can have different types:
- Current: this kind of violations can be detected on a [branch](), if the computed intensity is greater than its [permanent limit]() or one of its [temporary limits]().
- Voltage: this kind of violations can be detected on a bus or a [busbar section](), if the computed voltage is out of the voltage limits bounds of a [voltage level]().

## Inputs

### Network
The first input of the security analysis is a network. As this simulation is basically [power flow]() simulations for a list of contingencies, this network should converge.

### Contingencies
The security analysis may also take, optionally, a list of contingencies as an input. When contingencies are provided, the violations are detected on the network at state N, but also after the application of each contingency. At the moment, the only way to provide contingencies is to use the [Contingency Domain Specific Language](), written in Groovy.

### Remedial actions
Remedial actions are actions that are applied automatically when exploitation rules are violated. For example, this is used to model automatons that can open [switches]() or change the tap position of a [tap changer](). The remedial actions should be provided using the [Action Domain Specific Language]() written in Groovy.

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

## Configuration
- contingency provider
- security analysis provider
- action simulator
- limit violation filter

## Implementations
- Slow
- Hades2
- LoadFlowActionSimulator

## Going further
- itools security-analysis
