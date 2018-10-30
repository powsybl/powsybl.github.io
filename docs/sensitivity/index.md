---
title: Sensitivity computation
layout: default
---

The sensitivity computation module is dedicated to compute linearized impact of network small variations on some elements state variables.

A sensitivity value is the numerical estimation of the partial derivative between the variable of impact and the function observed.
Sensitivity computation can also be seen as partial derivatives computation on the network model.  

# Sensitivity computation inputs

## Network
The main input for sensitivity computation module is an IIDM network.

## Sensitivity factors
Sensitivity factors are the expected partial derivatives to be extracted from the input network.

A standard sensitivity computation input is composed of a list of sensitivity factors, each one composed of a sensitivity variable (variable of impact) and a sensitivity function (function observed).

Currently available sensitivity factors are:
- *BranchFlowPerInjectionIncrease* : calculates the linear impact of a specific injection increase on a specific branch's active flow (in MW/MW) 
- *BranchFlowPerLinearGlsk* : calculates the linear impact of a linear combination of injections (GLSK) increase on a specific branch's active flow (in MW/MW)
- *BranchFlowPerPSTAngle* : calculates the linear impact of a PST angle increase on a specific branch's active flow (in MW/°)
- *BranchIntensityPerPSTAngle* : calculates the linear impact of a PST angle increase on a specific branch's current (in A/°)

**JSON format**

Sensitivity computation module provides a JSON mapping to sensitivity factors that can be used as a sensitivity factors provider.
The file is a list of JSON objects each one representing a sensitivity factor:
```json
[ {
  "@c" : ".factors.BranchFlowPerInjectionIncrease",
  "function" : {
    "@c" : ".BranchFlow",
    "id" : "BRANCH_FLOW_ID",
    "name" : "My monitored branch",
    "branchId" : "BRANCH_ID_IN_NETWORK"
  },
  "variable" : {
    "@c" : ".InjectionIncrease",
    "id" : "INJECTION_INCREASE_ID_1",
    "name" : "My impacting injection 1",
    "injectionId" : "INJECTION_1_ID_IN_NETWORK"
  }
}, {
  "@c" : ".factors.BranchFlowPerInjectionIncrease",
  "function" : {
    "@c" : ".BranchFlow",
    "id" : "BRANCH_FLOW_ID",
    "name" : "My monitored branch",
    "branchId" : "BRANCH_ID_IN_NETWORK"
  },
  "variable" : {
    "@c" : ".InjectionIncrease",
    "id" : "INJECTION_INCREASE_ID_2",
    "name" : "My impacting injection 2",
    "injectionId" : "INJECTION_2_ID_IN_NETWORK"
  }
} ]
```
# Sensisitivity computation outputs

## Sensitivity values
The outputs of sensitivity computation are sensitivity values. It is a list of objects associated to each sensitivity factors:
- The actual value of the partial derivative
- The reference value of the variable at linearization point
- The reference value of the function at linearization point 

## Example of interpretation
Let's imagine that one want to get the impact of an increase on active power generation on generator *G* on branch *B* active flow.
The sensitivity computation input will contain one sensitivity factor.

After computation, the result is a sensitivity value object composed of three elements:
- a value of -0.05 for the partial derivative
- a variable reference value of 150
- a function reference value of 265

That means that:
- initial generation on generator *G* is 150MW
- initial active flow on branch *B* is 265MW from side 1 to side 2
- an increase of 100 MW on generator *G* may be approximated on branch *B* as a 5MW decrease of the active flow from side 1 to side 2 
 