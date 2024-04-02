---
layout: default
latex: true
---

# Remedial Action Optimization

* TOC
  {:toc}

## Introduction
The Remedial Action Optimization on an electrical network finds the best actions in order to reduce the
number of operational limits violations. These actions, commonly called "remedial actions", 
are of different types: 
- a change of tap position of a phase-shift transformer,
- a change of active power set-point of an HVDC line,
- a change of open/close status of a switch,
- generation re-dispatching, etc.  

A **R**emedial **A**ction **O**ptimizer is frequently abbreviated as **"RAO"**.

## Implementations
Currently, only one Remedial Action Optimizer, **OpenRAO**, is implemented on top of PowSyBl.  
You can find its documentation here: [**OpenRAO documentation**](https://powsybl.readthedocs.io/projects/openrao).  
Integration of a generic RAO API in PowSyBl is still in design phase.