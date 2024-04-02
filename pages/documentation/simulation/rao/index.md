---
layout: default
latex: true
---

# Remedial Action Optimization

* TOC
  {:toc}

## Introduction
The Remedial Action Optimization on an electrical network, aims at implementing the best actions that optimize the 
state of the network by reducing operational limits violations. These actions, commonly called "remedial actions", 
can be of different types: phase-shift transformers, HVDC links, switches, re-dispatching...  
A **R**emedial **A**ction **O**ptimizer is frequently abbreviated as **"RAO"**.

## Implementations
Currently, only one Remedial Action Optimizer, **OpenRAO**, is implemented on top of PowSyBl.  
You can find its documentation here: [**OpenRAO documentation**](https://powsybl.readthedocs.io/projects/openrao).  
Integration of a generic RAO API in PowSyBl is still in design phase.