---
layout: default
---

# Python scripting

The [pypowsybl](../repositories/pypowsybl.md) provides a way to use all the features of PowSyBl in python scripts. This Python integration relies on the [JPype](https://www.py4j.org) project that provides full access to Java from Python. This is achieved not through re-implementing Python, as [Jython](https://www.jython.org/) has done, but rather through interfacing at the native level in both virtual machines.

This shared memory based approach achieves decent computing performance, while providing the access to the entirety of CPython and Java libraries. For optimal performance, we recommend to use [Groovy scripts](groovy.md) or implement part of your script directly in Java.

To make it easier to write Python scripts that use PowSyBL, we also provide a small DSL to:
- to load and save a case file
- to easily run power flow simulations with [OpenLoadFlow](../../simulation/powerflow/openlf.md)

## Example
This small example shows how to load a case file and run a power simulation in Python:
```python
import jpype
import jpype.imports
import pypowsybl

# Start the JVM before importing java classes
pypowsybl.start()

from pypowsybl import Network, LoadFlow

# Load a case file
network = Network.load("eurostag-tutorial-example1.xml")

# Run a power flow with OpenLF implementation
result = LoadFlow.run(network, implementation="OpenLoadFlow")
print("Computation OK? {}".format(result.isOk()))
print("Metrics: {}".format(result.getMetrics()))

# Save the network
Network.save(network, "eurostag-tutorial-example1-after-lf.xml", "XIIDM")

# Shutdown the JVM.
pypowsybl.stop()
```
