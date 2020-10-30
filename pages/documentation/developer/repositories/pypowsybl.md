# pypowsybl
The PyPowSyBl project gives access to PowSyBl framework to Python developers. This Python integration relies on [JPype](https://github.com/jpype-project/jpype). This is not a **native** implementation of PowSyBl features: internally a JVM is started to run the java code, and the Python code access to the Java objects through JNI.

**Reviewers:** [mathbagu](https://github.com/mathbagu), [sylvlecl](https://github.com/sylvlecl)  
**Committers:** [mathbagu](https://github.com/mathbagu), [sylvlecl](https://github.com/sylvlecl)

## Features
- Load and Save case file (Supported formats are: [XIIDM](../../grid/formats/xiidm.md))
- Run power flows with [PowSyBl OpenLoadFlow](../../simulation/powerflow/openlf.md)

## Getting started

- [Scripting with Python](../../developer/scripting/python.md) - A first introduction to learn how to use PyPowSyBl

## Releases

| Version | Release date | Release notes | API documentation |
| ------- | ------------ | ------------- | ----------------- |
