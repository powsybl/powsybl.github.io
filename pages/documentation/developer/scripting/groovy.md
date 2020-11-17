---
layout: default
---

# Groovy scripting
[Apache Groovy](https://groovy-lang.org/) is an object-oriented programming language for the Java platform. This language is widely used in PowSyBl to implement domain specific languages such as the [contingency DSL](../../simulation/securityanalysis/contingency-dsl.md), the [action DSL](../../simulation/securityanalysis/action-dsl.md) or the DSLs for time-domain simulations. With Groovy, you have access to all features of the framework without any payload.

## iTools run-script
The first way to use Groovy scripts is to use the [iTools run-script](../../user/itools/run-script.md) command. It relies on a complete [iTools distribution](../../user/index.md#installation-from-binaries). To make it easier to write scripts, we provide a small DSL that allow:
- to load and save a case file
- to easily run power flow simulations.

It's possible to extend this DSL with user-friendly functions by writing [extensions]().

## powsyblsh
`powsyblsh` is a script for Linux, provided with a [iTools distribution](../../user/index.md#installation-from-binaries) that run the interactive command line [Groovy Shell](). At start-up, it loads the classes of jars found in the `share/java` folder of the iTools distribution. You should consider this option during implementation phase. Once your script is ready for production, run it with the [iTools run-script](../../user/itools/run-script.md) command.

## Example
This small example shows how to load a case file and run a power simulation in Groovy:
```groovy
import com.powsybl.loadflow.LoadFlow

# Load a case file
network = loadNetwork("eurostag-tutorial-example1.xml")

# Run a power flow with OpenLF implementation
result = LoadFlow.find("OpenLoadFlow").run(network)
println "Computation OK? " + result.isOk()
println "Metrics: " + result.getMetrics()

# Save the network
saveNetwork("XIIDM", network, null, "eurostag-tutorial-example1-after-lf.xml")
```
