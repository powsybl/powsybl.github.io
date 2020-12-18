---
layout: default
---

# Open Load Flow : functional specification with UML 

* TOC
{:toc}

## Purpose
Give a summary view about **Open Load Flow** and its integration with **powsybl-tools**.

## Bibliography
[Web page from Thierry Van Cutsem](https://people.montefiore.uliege.be/vct/courses) :
- [Introduction to electric power and energy systems](https://people.montefiore.uliege.be/vct/elec0014/elec0014.pdf)
- [Le calcul de repartition de charge (ou load flow)](https://people.montefiore.uliege.be/vct/elec0029/lf.pdf)

[Grid model](https://www.powsybl.org/pages/documentation/grid/model/)

## Classes involved when running loadflow with itools

| Maven&nbsp;dependency&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Usage |
| -------------------------- | - |
| powsybl-tools              | provide a main method to run a tool (this current documentation is about **loadflow** tool) |
| powsybl-computation        | load all **module** configuration from config file into ***PlatformConfig*** object. User can specify config file with these two VM parameters : **powsybl.config.dirs** and **powsybl.config.name** |
| powsybl-loadflow-api       | this dependency provide the implementation of ***Tool*** interface : ***RunLoadFlowTool***. ***RunLoadFlowTool*** proceed in initialization before running the loadflow simulation on a network. First, load the network from file given with parameter **--case-file**. Second, init ***LoadFlowParameters*** with ***PlatformConfig*** previously loaded (module **load-flow-default-parameters**). Third, load extensions of ***LoadFlowParameters*** : in case of running loadflow, it uses ***ExtensionConfigLoader*** implementation in ***OpenLoadFlowParameters*** (module **open-loadflow-default-parameters**) |
| powsybl-iidm-converter-api | used to load ***Network*** object from **xiidm** file (xml format) |
| powsybl-open-loadflow      | this dependency is the one we discuss about in this documentation. Network simulation is run in this dependency. It builds an **equation system** before calling **Newton-Raphson** with a **Jacobian Matrix**. It adjusts network parameters in **outer loop** and run again Newton-Raphson until getting minimal **iteration** count and lower **mismatch**. At the end, it returns **CONVERGED** if equation system can be solved with a minimal ending mismatch on **slacked bus**.|

![Slack](img/uml/loadflow - dependencies involved.png){: width="100%" style="margin-top: 2rem;" .center-image}

## Network modelisation in powsybl-iidm-api
This is the **Network** object from **powsybl-iidm-api** dependency loaded by **Importer** in **powsybl-iidm-xml-converter** dependency.
![Slack](img/uml/powsybl-iidm-api - network classes.png){: width="100%" style="margin-top: 2rem;" .center-image}

## Load flow basics
Considering a sub-network with nodes (= buses), we have to valuate V and θ for each of them.
During process, if any call to Newton Raphson method failed, process is terminated with an MAX_ITERATION_REACHED error.
If all calls to Newton Raphson method succeeded with CONVERGED, process is fully completed with CONVERGED and iteration count.  

1. creation of equation system
2. first run of Newton Raphson method
3. ajust reactive power on nodes
4. loop over OuterLoop used to adjust network parameters like active power on generators and loads.
In each of OuterLoop, if sub-network is UNSTABLE, it runs again Newton Raphson method. 

### Equations
The network is described by the 2N equations Pi and Qi. In each node of the network, these equations involve four quantities: the modulus Vi and the phase θi of the voltage, the active powers Pi and reactive Qi. For unknowns and equations to be equal in number, we must therefore specify two of these four quantities at each node.

### Node PQ (variables V and θ)
In a busbar where a load is connected, the active and reactive power consumed by the latter is specified, because this information is generally available at the start of measurements. The equations relating to such a node correspond to the calculation of Pi and Qi (consumptions changed by sign). In such a node, the unknowns are therefore Vi and θi. These nodes where P and Q are specified are often referred to as "PQ nodes".

### Node PV (variables θ)
The generators of large power plants are equipped with voltage regulators which keep the voltages at their terminals (almost) constant. In such a busbar it is more natural to specify voltage than reactive power. The data are therefore Pi and Vi. The modulus of the voltage being directly specified, only θi remains as unknown. These nodes where P and V are specified are referred to as "PV nodes".

### Phase node aka "Slack bus"
One of the busbars in the network is designated as an angular reference (the slack bus or phase node) and is imposed the phase of its voltage θ, rather than the active power. It is customary to specify a zero phase, but this is arbitrary. In OpenLoadFlow, this is the most meshed node in the network.

## powsybl-open-loadflow
### Equations
An equation is defined by:
- his bus number,
- its type: BUS_P, BUS_Q, BUS_V, BUS_PHI, BRANCH_P, BRANCH_I, BRANCH_ALPHA1, ZERO_Q, ZERO_V, ZERO_PHI or ZERO_RHO1,
- a list of terms,
- a method for adding up the evaluation of the terms,
- the index in the target vector given by column (= column in the Jacobian matrix),

### Terms
A term is modeled by a class which extends EquationTerm and which defines:
- its bus, branch or shunt number,
- its type: BUS, BRANCH or SHUNT_COMPENSATOR,
- a list of variables,
- a method for evaluating the end of the equation,
- a method to calculate the derivative of each of the variables (used to fill in the Jacobian matrix).

The list of terms in OpenLoadFlow :

EquationTerm > AbstractEquationTerm > AbstractNamedEquationTerm > AbstractBranchAcFlowEquationTerm > AbstractClosedBranchAcFlowEquationTerm

| Class | Type | Variables |
| ------------------------------------------- | -------- | ------------------------------------------- |
| ClosedBranchSide1ActiveFlowEquationTerm | BRANCH | V1, V2, θ1, θ2 |
| ClosedBranchSide1ReactiveFlowEquationTerm | BRANCH | V1, V2, θ1, θ2 |
| ClosedBranchSide2ActiveFlowEquationTerm | BRANCH | V1, V2, θ1, θ2 |
| ClosedBranchSide2ReactiveFlowEquationTerm | BRANCH | V1, V2, θ1, θ2 |

EquationTerm > AbstractEquationTerm > AbstractNamedEquationTerm > AbstractBranchAcFlowEquationTerm > AbstractOpenBranchAcFlowEquationTerm

| Class | Type | Variables |
| ------------------------------------------- | -------- | ------------------------------------------- |
| OpenBranchSide1ActiveFlowEquationTerm.java | BRANCH | V2 |
| OpenBranchSide1ReactiveFlowEquationTerm.java | BRANCH | V2 |
| OpenBranchSide2ActiveFlowEquationTerm.java | BRANCH | V1 |
| OpenBranchSide2ReactiveFlowEquationTerm.java | BRANCH | V1 |

EquationTerm > AbstractEquationTerm > AbstractTargetEquationTerm

| Class | Type | Variables |
| ------------------------------------------- | -------- | ------------------------------------------- |
| DummyReactivePowerEquationTerm | BRANCH | Q |
| BranchRho1EquationTerm | BRANCH | RHO1 |
| BranchA1EquationTerm | BRANCH | ALPHA1 |
| DummyActivePowerEquationTerm | BRANCH | P |
| BusPhaseEquationTerm | BUS | θ |
| BusVoltageEquationTerm | BUS | V |


### Variables
A variable is defined by:
- its bus or branch number,
- its type: BUS_V, BUS_PHI, BRANCH_ALPHA1, BRANCH_RHO1, DUMMY_P or DUMMY_Q,
- the index in the vector x given by row (= row in the Jacobian matrix).


### Sub-network modelisation in powsybl-open-loadflow
The list of **LfNetwork** objects is build from **Network** Object in **LfNetworkLoaderImpl** from **powsybl-open-loadflow** dependency.
![Slack](img/uml/openloadflow - network classes.png){: width="100%" style="margin-top: 2rem;" .center-image}

### Activities diagrams about powsybl-open-loadflow internal process
#### 1. RunLoadFlowTool.run (Tool interface implementation)
![Slack](img/uml/openloadflow - RunLoadFlowTool.run.png){: width="100%" style="margin-top: 2rem;" .center-image}

#### 2. OpenLoadFlowProvider.runAc (run on AC Network)
![Slack](img/uml/openloadflow - OpenLoadFlowProvider.runAc.png){: width="100%" style="margin-top: 2rem;" .center-image}

#### 3. AcloadFlowEngine.run (internal openloadflow engine)
![Slack](img/uml/openloadflow - AcloadFlowEngine.run.png){: width="100%" style="margin-top: 2rem;" .center-image}

#### 4. AcloadFlowEngine.runOuterLoop (detail about OuterLoop usage)
![Slack](img/uml/openloadflow - AcloadFlowEngine.runOuterLoop.png){: width="100%" style="margin-top: 2rem;" .center-image}

#### 5. NewtonRaphson.run (NewtonRaphson implementation)
![Slack](img/uml/openloadflow - NewtonRaphson.run.png){: width="100%" style="margin-top: 2rem;" .center-image}

### Details about all OuterLoop implementations
#### PhaseControlOuterLoop

#### ReactiveLimitsOuterLoop

#### DistributedSlackOuterLoop

#### TransformerVoltageControlOuterLoop
