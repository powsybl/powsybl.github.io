---
layout: default
latex: true
---

# Time domain simulation

* TOC
{:toc}

## Introduction

The time domain simulation aims at capturing the transient response of the system, and not only to compute the steady state solution.
It may or not involve the activation of events like a line disconnection for example.

## Inputs

The inputs of a dynamic simulation are the following:
- a set of parameters for the simulator itself (simulation start and stop time, solver parameters, etc.)
- a set of dynamic models to be used (for example, provided by Dynawo through their preassembled models and CPP models)
- a set of parameters associated to each dynamic model, with carefully chosen values
- a static network
- a mapping between static components of the network and dynamic models
- optionally, a description of events occurring in the dynamic simulation (disconnection of a line, change of tap for a transformer, etc.)

## Outputs

The outputs of a dynamic simulation are:
- the updated static network (which may have been topologically modified depending on the events or automatons defined as inputs)
- a zipped file containing the different results of the dynamic simulation :
 - some curves, asked for by the user to track the evolution of specific variables throughout the simulation
 - some aggregated data regarding constraints, like a security analysis output
 - timelines, that contain the list of events that occurred during the dynamic simulation, be them planned beforehand through events, or not
 - logs about the execution of the dynamic simulator

## Implementations

At the moment the only available implementation of time domain simulation compatible with PowSyBl is the one provided by [Dynawo](dynawo.md).

## Configuration

The default dynamic simulator can be configured in the `config.yml` file:
```yml
dynamic-simulation:
    default-impl-name: dynawo
```
This module is optional. If only one implementation is found it’s used, otherwise if several are available but nothing is specified in the configuration file an exception is thrown.

### Available parameters

There are only two parameters common to all time domain simulators: the start and stop times of the simulation, in seconds. 
They should be set in a module named `dynamic-simulation-default-parameters`:
```yml
dynamic-simulation-default-parameters:
    startTime: 0
    stopTime: 3600
```

### Default configuration

By default the start time is 0s and the stop time is 3600s.

### Dynawo configuration

The `dynawo` module may be used to setup a Dynawo simulation: it defines the install directory of the dynawo simulator and whether the temporary folder where the inputs are generated should be kept after the simulation (for debug purposes).
```yml
dynawo:
    homeDir: /home/user/dynawo
    debug: false
```

To setup specific Dynawo parameters, the `dynawo-default-parameters` should be used:
```yml
dynawo-default-parameters:
    parametersFile: <PATH_TO_MAIN_PARAMETERS_FILE>  
    network.parametersFile: <PATH_TO_NETWORK_PARAMETERS_FILE> 
    network.parametersId: id
    solver.type: IDA
    solver.parametersFile: <PATH_TO_SOLVER_PARAMETERS_FILE>
    solver.parametersId: id
```


## Going further

- You may find extensive documentation of the Dynawo project [here](https://github.com/dynawo/dynawo/releases/download/v1.1.0/DynawoDocumentation.pdf).
