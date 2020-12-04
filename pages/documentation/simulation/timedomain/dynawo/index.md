---
layout: default
---

# Dynawo

PowSyBl provides an implementation to run dynamic simulations with [DynaWaltz](https://dynawo.github.io/about/dynawaltz), a tool for long-term stability simulation from the [Dynawo](https://dynawo.github.io) suite.

## Installation

Read this [documentation page](https://dynawo.github.io/install/) to learn how to install and configure Dynawo.

## Configuration

The `dynawo` module may be used to setup a Dynawo simulation: it defines the install directory of the Dynawo simulator and whether the temporary folder where the inputs are generated should be kept after the simulation (for debug purposes).
```yml
dynawo:
    homeDir: /home/user/dynawo
    debug: false
```

## Specific parameters
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

**parametersFile**  
This parameter defines the path of the main parameters file. This file is an XML file that provides, for each dynamic model the characteristics required that are not available in the static network.

**network.parametersFile**  
This parameter defines the path of the parameters file for the special dynamic model associated to the network.

**network.parametersId**  
As the `network.parametersFile` can contain several sets of parameters, the `network.parametersId` parameter defines the set to use among the available sets of parameters.

**solver.type**  
This parameter defines the type of solver. The allowed values are `IDA` or `SIM`. See [Dynawo documentation](https://github.com/dynawo/dynawo/releases/latest/download/DynawoDocumentation.pdf) for more details about the solvers.

**solver.parametersFile**  
This parameter defines the path of the parameters file for the solvers.

**solver.parametersId**  
As the `solver.parametersFile` can contain several sets of parameters, the `solver.parametersId` parameter defines the set to use among the available sets of parameters.

## Dynamic models DSL
The dynamic models domain specific language helps user to associate a dynamic model to each static components of the network. The following models are supported:
- LoadAlphaBeta
- GeneratorSynchronousThreeWindings
- GeneratorSynchronousThreeWindingsProportionalRegulations
- GeneratorSynchronousFourWindings
- GeneratorSynchronousFourWindingsProportionalRegulations
- OmegaRef

The following automatons models are supported:
- CurrentLimitAutomaton

To go further, you should read the [Dynamic Models DSL](dynamic-models-dsl.md) reference page.

## Event models DSL
The event models domain specific language helps user to simulate events during the simulation, such as equipment disconnection... The following models are supported:
- EventQuadripoleDisconnection
- EventSetPointBoolean

To go further, you should read the [Event Models DSL](event-models-dsl.md) reference page.

## Curves DSL
The curves domain specific language allow an user to configure the curves Dynawo will export at the end of the simulation. This DSL defines the `curve` and the `curves` keywords.

The `curve` keyword create a single curve for a dynamic model. One identifies a dynamic model by its ID, the same as the one used in the [Dynamic Models DSL](#dynamic-models-dsl). The variable to plot is identified by its name.
```groovy
curve {
    dynamicModelId load.id
    variable "load_PPu"
}
```

If you want to plot a static variable, the `dynamicModelId` parameter has to be replaced by the `staticId` keyword and refers to an ID present in the static network.
```groovy
curve {
    staticId bus.id
    variable "Upu_value"
}
```

If you want to plot several variables of the same dynamic model, you can use the `curves` keyword that permit limiting boilerplate code in the script.
```
// This:
curve {
    dynamicModelId load.id
    variable "load_PPu"
}
curve {
    dynamicModelId load.id
    variable "load_QPu"
}

// is equivalent to:
curves {
    dynamicModelId load.id
    variables "load_PPu", "load_QPu"
}
```

## Going further

- You may find an extensive documentation of the Dynawo project [here](https://github.com/dynawo/dynawo/releases/latest/download/DynawoDocumentation.pdf).
