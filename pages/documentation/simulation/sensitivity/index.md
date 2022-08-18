---
layout: default
---

# Sensitivity analysis

* TOC
{:toc}

## Introduction

The sensitivity analysis module is dedicated to computing the linearized impact of small network 
variations on the state variables of some components.

A sensitivity value is the numerical estimation of the partial derivative of the observed function 
with respect to the variable of impact.
The sensitivity analysis can also be seen as the computation of partial derivatives on the network model.
For example, it may be used to know, among a group of selected lines, which are the most impacted by a change in a generator production or a change of tap on a phase tap changer.
The user story about [RSC capacity calculation](../../user/user-stories/capacity_calculation_rsc.md) provides an example of application of the sensitivity analysis.

## Sensitivity analysis inputs

### Network
The first input for the sensitivity analysis module is an IIDM network.

### Sensitivity factors
Aside from providing an input network, it is necessary to specify which equipments are going to be
studied:
- what impacted equipments are selected to be monitored (lines for example)
- according to a change on which component (a generator's production or a group of generator's production, or the tap position of a phase tap changer, etc.)

It is also necessary to specify which quantity is being observed: the active power or the intensity on the monitored equipments. 

This set of information constitutes the sensitivity factors. These factors correspond to the definition
of the expected partial derivatives to be extracted from the input network.
A standard sensitivity analysis input thus comprises of a list of sensitivity factors, each one constituted of:
- a sensitivity variable (the variable of impact) 
- a sensitivity function (the observed function).

The currently available sensitivity factors are:
- `BranchFlowPerInjectionIncrease` : calculates the linear impact of a specific injection increase on a specific branch's active flow (in MW/MW) 
- `BranchFlowPerLinearGlsk` : calculates the linear impact of a linear combination of injections (GLSK) increase on a specific branch's active flow (in MW/MW)
- `BranchFlowPerPSTAngle` : calculates the linear impact of a PST angle increase on a specific branch's active flow (in MW/°)
- `BranchIntensityPerPSTAngle` : calculates the linear impact of a PST angle increase on a specific branch's current (in A/°)

#### How to provide the sensitivity factors input

The sensitivity factors may be created directly through Java code, or be provided to PowSyBl 
via a JSON file. This file should contain a list of JSON objects, each one representing a 
sensitivity factor. The example below shows how to write a JSON file to perform a sensitivity 
analysis on the active power through a line, with respect to an injection on the network.
```json
[ {
  "@c" : ".factors.BranchFlowPerInjectionIncrease",
  "function" : {
    "@c" : ".BranchFlow",
    "id" : "BRANCH_FLOW_ID",
    "name" : "My monitored branch",
    "branchId" : "BRANCH_ID_IN_NETWORK"
  }
} ]
```

### Contingencies
The sensitivity analysis may also take, optionnally, a list of contingencies as an input. 
When contingencies are provided, the sensitivity values
shall be calculated on the network at state N, but also after the application of each contingency.
The contingencies are provided in the same way than for the [security analysis]().
This then constitutes a systematic sensitivity analysis.

Using Hades 2 as sensitivities computation simulator, the network is provided 
only once in state N, and then all the calculations are done successively by modifying the Jacobian 
matrix directly in the solver based on the contingencies input.
The network is thus loaded only once, which improves performance.

The same property is achieved using OpenLoadFlow ...

## Sensitivity analysis outputs

### Sensitivity values
The outputs of the sensitivity analysis are called sensitivity values. 
These values are a list of objects associated to each sensitivity factor, for each state of the network:
- The actual value of the partial derivative
- The reference value of the variable at linearization point
- The reference value of the function at linearization point 
These results may be serialized in JSON or CSV format.

### Example of interpretation
Let's imagine that one wants to compute the impact of an increase of active power generation of the 
generator `G` on the branch `B`.
The sensitivity analysis input will contain one sensitivity factor, 
of type `BranchFlowPerInjectionIncrease`, and we do not provide any input contingencies.

After the computation, let us consider that the values of the three elements of the sensitivity 
result are:
- a value of -0.05 for the partial derivative
- a variable reference value of 150
- a function reference value of 265

This can be interpreted in the following way:
- an increase of 100 MW on generator `G` may be approximated on branch `B` as a 5MW decrease of the 
active flow from side 1 to side 2 
- the initial generation on generator `G` is 150MW
- the initial active flow on branch `B` is 265MW from side 1 to side 2
 
## Implementations

The following sensitivity analysis implementations are supported:
- [PowSyBl OpenLoadFlow](openlf.md)
- [Hades2](hades2.md)

## Going further

To go further about the sensitivity analysis, check the following content:
- [Run a sensitivity analysis through an iTools command](../../user/itools/sensitivity-computation.md): Learn how to perform a sensitivity analysis from the command line 
- [Sensitivity analysis tutorial](/../../developer/tutorials/sensitivity-analysis.md): learn how to write the Java code to perform sensitivity analyses
