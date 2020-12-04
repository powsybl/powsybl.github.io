---
layout: default
---

# Dynawo - Dynamic Models DSL

The Dynamic Models DSL is a domain specific language written in groovy for the association of dynamic models to each static equipment present in the network. If some equipment are not configured, Dynawo would use a default model and set of parameters.

* TOC
{:toc}

## BlackBoxModel
Most of the models supported are `BlackBoxModels`. This kind of dynamic models have three attributes:
- `staticId` refers to the ID of the load in the network.
- `dynamicModelId` is an optional attribute to identify this model. By default, it is equal to the `staticId`.
- `parameterSetId` refers a set of parameters for this model in one of the network parameters file.

## Generators
All the following models are [BlackBoxModels](#blackboxmodel) you can associate to an IIDM generator. To do so, you have to use their name as a keyword and define at least a `staticId` and a `parameterSetId`. Like every other `BlackBoxModel`, the `dynamicModelId` is optional and would be equal to the `staticId` if not set.

Supported models are:
- GeneratorSynchronousThreeWindings
- GeneratorSynchronousThreeWindingsProportionalRegulations
- GeneratorSynchronousFourWindings
- GeneratorSynchronousFourWindingsProportionalRegulations

**Example**
```groovy
GeneratorSynchronousThreeWindings {
    staticId '<GENERATOR_ID>'
    dynamicModelId '<DYNAMIC_MODEL_ID>'
    parameterSetId '<PARAMETER_ID>'
}
GeneratorSynchronousThreeWindingsProportionalRegulations {
    staticId '<GENERATOR_ID>'
    dynamicModelId '<DYNAMIC_MODEL_ID>'
    parameterSetId '<PARAMETER_ID>'
}
GeneratorSynchronousFourWindings {
    staticId '<GENERATOR_ID>'
    dynamicModelId '<DYNAMIC_MODEL_ID>'
    parameterSetId '<PARAMETER_ID>'
}
GeneratorSynchronousFourWindingsProportionalRegulations {
    staticId '<GENERATOR_ID>'
    dynamicModelId '<DYNAMIC_MODEL_ID>'
    parameterSetId '<PARAMETER_ID>'
}
```

## Loads

### LoadAlphaBeta
This is a [BlackBoxModel](#blackboxmodel) you can associate to an IIDM load. To do so, you have to use the `LoadAlphaBeta` keyword and define at least a `staticId` and a `parameterSetId`. Like every other `BlackBoxModel`, the `dynamicModelId` is optional and would be equal to the `staticId` if not set.

**Example**
```groovy
LoadAlphaBeta {
    staticId '<LOAD_ID>'
    dynamicModelId '<DYNAMIC_MODEL_ID>'
    parameterSetId '<PARAMETER_ID>'
}
```

## Frequency models

### OmegaRef
This is a model shared by generators with the same frequency reference. To link a generator to the `OmegaRef` model, use the `OmegaRef` keyword and assign the `generatorModelId` attribute to its `dynamicModelId` value.

**Example**
```groovy
OmegaRef {
    generatorModelId '<DYNAMIC_MODEL_ID>'
}
```

## Automatons

### CurrentLimitAutomaton
This is a [BlackBoxModel](#blackboxmodel) you can associate to an IIDM line or two windings transformer. To do so, you have to use the `CurrentLimitAutomaton` keyword and define at least a `staticId` and a `parameterSetId`. Like every other `BlackBoxModel`, the `dynamicModelId` is optional and would be equal to the `staticId` if not set.

This model has also another required attribute to define which side is monitored.

**Example**
```groovy
CurrentLimitAutomaton {
    staticId '<BRANCH_ID>'
    dynamicModelId '<DYNAMIC_MODEL_ID>'
    parameterSetId '<PARAMETER_ID>'
    side '<SIDE>'
}
```
