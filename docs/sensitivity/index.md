---
title: Sensitivity computation
layout: default
---

The sensitivity computation module is dedicated to compute the linearized impact of small network variations on the state variables of some elements.

A sensitivity value is the numerical estimation of the partial derivative of the observed function with respect to the variable of impact.
The sensitivity computation can also be seen as the computation of partial derivatives on the network model.  

# Sensitivity computation inputs

## Network
The main input for the sensitivity computation module is an IIDM network.

## Sensitivity factors
Sensitivity factors are the expected partial derivatives to be extracted from the input network.

A standard sensitivity computation input is composed of a list of sensitivity factors, each one composed of a sensitivity variable (the variable of impact) and a sensitivity function (the observed function).

Currently available sensitivity factors are:
- *BranchFlowPerInjectionIncrease* : calculates the linear impact of a specific injection increase on a specific branch's active flow (in MW/MW) 
- *BranchFlowPerLinearGlsk* : calculates the linear impact of a linear combination of injections (GLSK) increase on a specific branch's active flow (in MW/MW)
- *BranchFlowPerPSTAngle* : calculates the linear impact of a PST angle increase on a specific branch's active flow (in MW/°)
- *BranchIntensityPerPSTAngle* : calculates the linear impact of a PST angle increase on a specific branch's current (in A/°)

**JSON format**

The sensitivity computation module provides a JSON mapping to sensitivity factors that can be used as a sensitivity factors provider.
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
The outputs of the sensitivity computation are sensitivity values. It is a list of objects associated to each sensitivity factors:
- The actual value of the partial derivative
- The reference value of the variable at linearization point
- The reference value of the function at linearization point 

## Example of interpretation
Let's imagine that one wants to get the impact of an increase of active power generation of the generator *G* on the branch *B*.
The sensitivity computation input will contain one sensitivity factor.

After the computation, imagine that the values of the three elements of the resulting sensitivity object are:
- a value of -0.05 for the partial derivative
- a variable reference value of 150
- a function reference value of 265

The results mean that:
- the initial generation on generator *G* is 150MW
- the initial active flow on branch *B* is 265MW from side 1 to side 2
- an increase of 100 MW on generator *G* may be approximated on branch *B* as a 5MW decrease of the active flow from side 1 to side 2 
 
