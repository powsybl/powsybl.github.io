---
layout: default
---

# Dynawo - Event Models DSL

The Event Models DSL is a domain specific language written in groovy for the simulation of events that occurs during the simulation.

* TOC
{:toc}

## BlackBoxModel
Most of the event models supported are `BlackBoxModels`. This kind of dynamic models have three attributes:
- `staticId` refers to the ID of the load in the network.
- `eventModelId` is an optional attribute to identify this model. By default, it is equal to the `staticId`.
- `parameterSetId` refers a set of parameters for this model in one of the network parameters file.

## EventQuadripoleDisconnection
Use this event to disconnect a line or a two windings transformer during the simulation. The `EventQuadripoleDisconnection` is a [BlackBoxModel](#blackboxmodel) of which the `staticId` refers to a line or a two windings transformer of the network.

**Example**
```groovy
EventQuadripoleDisconnection {
    staticId '<BRANCH_ID>'
    eventModelId '<EVENT_MODEL_ID>'
    parameterSetId '<PARAMETER_ID>'
}
```

## EventSetPointBoolean
Use this event to set or unset a boolean field of a dynamic model. At the moment, only generator disconnection is supported. The `EventSetPointBoolean` model is a [BlackBoxModel](#blackboxmodel) of which the `staticId` refers to a generator of the network.

**Example**
```groovy
EventSetPointBoolean {
    staticId '<GENERATOR_ID>'
    eventModelId '<EVENT_MODEL_ID>'
    parameterSetId '<PARAMETER_ID>'
}
```
