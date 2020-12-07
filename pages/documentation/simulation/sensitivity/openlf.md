---
layout: default
latex: true
---

# OpenLoadFlow

PowSyBl OpenLoadFlow is an open-source power flow implementation in Java provided by PowSyBl. The source code is hosted on [GitHub](https://github.com/powsybl/powsybl-open-loadflow). 

* TOC
{:toc}

## DC sensitivity analysis

A DC sensitivity analysis starts from the DC flows computing described in the [power flow section](../powerflow/openlf.md#dc-flows-computing). Simple sensitivity analyses are supported as:
- How an injection increase of 1 MW will impact the flow of a branch ;
- How a phase shifting of 1 degree of a phase tap changer will impact the flow of a branch.

This could be done in a set of branches given by the user.

### Sensitivities on the base network 

To get the sensitivity from injection increase in a given bus to a given branch, we compute the right-hand side \\(b\\) corresponding to an injection of 1 MW at this bus and 0 MW elsewhere. The LU decomposition gives the matrices \\(L\\) and \\(U\\) in order to compute the vector \\(\theta\\). Then it is easy to retrieve the power flow in the branch.

To get the sensitivity from phase-shifting angle in a given branch to a given branch, we compute the right-hand side \\(b\\) corresponding to an increase of one degree for the phase-shifting angle at this branch and 0 elsewhere. he LU decomposition gives the matrices \\(L\\) and \\(U\\) in order to compute the vector \\(\theta\\). Then it is easy to retrieve the power flow in the branch.

### Contingencies management

## Configuration

### Specific parameters

### Configuration file example
