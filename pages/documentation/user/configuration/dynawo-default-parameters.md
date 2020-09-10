---
layout: default
--- 

# dynawo-default-parameters
The `dynawo-default-parameters` module defines the default values for all specific parameters of a dynamic simulation run with Dynawo. 

## Required properties

**parametersFile**  
The `parametersFile` property is a required property that defines the path of the main parameters file.

**network.parametersFile**  
The `network.parametersFile` property is a required property that defines the path of the network parameters file

**solver.parametersFile**  
The `solver.parametersFile` property is a required property that defines the path of the solver parameters file

## Optional properties

**network.parametersId**  
The `network.parametersId` property is an optional property that defines the set of network parameters. The default value for this property is `NETWORK`.

**solver.type**  
The `solver.type` property is an optional property that defines the solver used in the simulation. The default value for this property is `SIM`. The available `com.powsybl.dynawo.simulator.DynawoSimulationParameters.SolverType`
values are:
- `SIM`: the simplified solver (fixed time step solver)
- `IDA`: the IDA solver (variable time step solver)

**solver.parametersId**  
The `solver.parametersId` property is an optional property that defines the set of solver parameters. The default value for this property is `SIM`.

## Examples

**YAML configuration:**
```yaml
dynawo-default-parameters:
  parametersFile: /home/user/parametersFile
  network.parametersFile: /home/user/networkParametersFile
  network.parametersId: NETWORK
  solver.type: SIM
  solver.parametersFile: /home/user/solverParametersFile
  solver.parametersId: SIM
```

**XML configuration:**
```xml
<dynawo-default-parameters>
  <parametersFile>/home/user/parametersFile</parametersFile>
  <network.parametersFile>/home/user/networkParametersFile</network.parametersFile>
  <network.parametersId>NETWORK</network.parametersId>
  <solver.type>SIM</solver.type>
  <solver.parametersFile>/home/user/solverParametersFile</solver.parametersFile>
  <solver.parametersId>SIM</solver.parametersId>
</dynawo-default-parameters>
```
