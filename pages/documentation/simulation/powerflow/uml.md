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

[Grid model known as ITesla Internal Data Model](https://www.powsybl.org/pages/documentation/grid/model/)

## Involved classes when running loadflow with itools

| Maven&nbsp;dependency&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Usage |
| -------------------------- | - |
| powsybl-tools              | provide a **main** method in order to run a tool (this current documentation is about **loadflow** tool) |
| powsybl-computation        | load all **module** parameters from global config file into a ***PlatformConfig.java*** object. User define config file by providing these two VM parameters : **powsybl.config.dirs** and **powsybl.config.name** |
| powsybl-loadflow-api       | this dependency provide an implementation of ***Tool*** interface named ***RunLoadFlowTool.java***. ***RunLoadFlowTool*** proceed with initialization before running the loadflow simulation on a network. First, It loads the network from a xiidm file given with parameter **--case-file**. Second, It inits ***LoadFlowParameters.java*** with ***PlatformConfig.java*** previously loaded (module **load-flow-default-parameters**). Third, It loads extensions of ***LoadFlowParameters*** : in case of running loadflow, it uses ***ExtensionConfigLoader*** implementation in ***OpenLoadFlowParameters*** (module **open-loadflow-default-parameters**) |
| powsybl-iidm-converter-api | used to load ***Network.java*** object from the **xiidm** file (xml format) |
| powsybl-open-loadflow      | this dependency is the one we discuss about in this documentation. Network simulation is run in this dependency. It starts by creating sub-network list (objects ***LfNetwork.java*** from **powsybl-open-loadflow** dependency) from the ***Network*** object. It builds an **equation system** from the ***Network*** object before calling **Newton-Raphson** with a **Jacobian Matrix** filled with sum of variable derivatives from each term of equations. It adjusts network parameters in **outer loop** (reactive and active power) and run again Newton-Raphson until getting stability for each **outer loop**. At the end, it returns **CONVERGED** if equation system can be solved with a minimal ending mismatch on **slacked bus**.|

![Slack](img/uml/loadflow - dependencies involved.png){: width="100%" style="margin-top: 2rem;" .center-image}

## Network modelisation in powsybl-iidm-api
This is the **Network.java** object (from **powsybl-iidm-api** dependency) loaded by **Importer.java** in **powsybl-iidm-xml-converter** dependency.
![Slack](img/uml/powsybl-iidm-api - network classes.png){: width="100%" style="margin-top: 2rem;" .center-image}

## Load flow basics
1. creation of sub-network list from network loaded from xiidm file,
2. creation of an equation system for each sub-network : we have to valuate V and θ for each of nodes (= buses),
3. first run of Newton Raphson method. If iteration count exceed maximum, process is terminated with an MAX_ITERATION_REACHED error, 
4. ajust reactive power on nodes,
5. loop over OuterLoop in order to adjust network parameters like active and reactive power on generators and loads. In each OuterLoop, if sub-network is UNSTABLE, it runs again Newton Raphson method (exit process if MAX_ITERATION_REACHED), 
6. loop over OuterLoop until reaching stability over network,
7. if all calls to Newton Raphson method succeeded with CONVERGED, process is fully completed with CONVERGED and iteration count as resume.

### Equations
The network is described by the 2N equations Pi and Qi. In each node of the network, these equations involve four quantities: the modulus Vi and the phase θi of the voltage, the active powers Pi and reactive Qi.
As variable and equations count have to be the same, we must initialize two of these variables (become constants) at each node.

### Node PQ (variables V and θ)
In a busbar with a connected load, the active and reactive power consumed by the load are initialized, as these information are generally available at the start of measurements.
The equations relating to such a node correspond to the calculation of Pi and Qi (consumptions changed by sign).
In such a node, the varibles are therefore Vi and θi. These nodes where P and Q are initialized are often called "PQ nodes".

### Node PV (variables θ)
The generators of large power plants are equipped with voltage regulators which keep the voltages at their terminals (almost) constant.
In such a busbar it is more natural to specify voltage than reactive power. The data are therefore Pi and Vi.
The modulus of the voltage being directly initialized, only θi remains as variable.
These nodes where P and V are specified are called "PV nodes".

### Phase node aka "Slack bus"
One of the busbars in the network is designated as an angular reference (the slack bus or phase node) and the phase of its voltage θ is initialized with a zero phase.
In this node, active power is free and is used to store the "active power mismatch" after NewtonRaphson execution.
In OpenLoadFlow, this node is the most meshed node in the network.

## powsybl-open-loadflow
### Sub-network modelisation in powsybl-open-loadflow
The list of **LfNetwork.java** objects is build from **Network.java** Object in **LfNetworkLoaderImpl.java** from **powsybl-open-loadflow** dependency.
![Slack](img/uml/openloadflow - network classes.png){: width="100%" style="margin-top: 2rem;" .center-image}

### Equations
An equation is defined by:
- his bus number,
- its type: BUS_P, BUS_Q, BUS_V, BUS_PHI, BRANCH_P, BRANCH_I, BRANCH_ALPHA1, ZERO_Q, ZERO_V, ZERO_PHI or ZERO_RHO1,
- a list of terms,
- a method for summing evaluation of the terms,
- the index in the target vector given by column (= column in the Jacobian matrix),

### Terms
A term is a class extending ***EquationTerm.java*** and defining :
- its bus, branch or shunt number,
- its type: BUS, BRANCH or SHUNT_COMPENSATOR,
- a list of variables,
- a method for evaluating the term,
- a method to calculate the derivative for each variables (used to fill in the Jacobian matrix).

Hierarchy class : *EquationTerm > AbstractEquationTerm > AbstractNamedEquationTerm > AbstractBranchAcFlowEquationTerm > AbstractClosedBranchAcFlowEquationTerm*

| Class | Type | Variables |
| ------------------------------------------- | -------- | ------------------------------------------- |
| ClosedBranchSide1ActiveFlowEquationTerm | BRANCH | V1, V2, θ1, θ2 |
| ClosedBranchSide1ReactiveFlowEquationTerm | BRANCH | V1, V2, θ1, θ2 |
| ClosedBranchSide2ActiveFlowEquationTerm | BRANCH | V1, V2, θ1, θ2 |
| ClosedBranchSide2ReactiveFlowEquationTerm | BRANCH | V1, V2, θ1, θ2 |

Hierarchy class : *EquationTerm > AbstractEquationTerm > AbstractNamedEquationTerm > AbstractBranchAcFlowEquationTerm > AbstractOpenBranchAcFlowEquationTerm*

| Class | Type | Variables |
| ------------------------------------------- | -------- | ------------------------------------------- |
| OpenBranchSide1ActiveFlowEquationTerm.java | BRANCH | V2 |
| OpenBranchSide1ReactiveFlowEquationTerm.java | BRANCH | V2 |
| OpenBranchSide2ActiveFlowEquationTerm.java | BRANCH | V1 |
| OpenBranchSide2ReactiveFlowEquationTerm.java | BRANCH | V1 |

Hierarchy class : *EquationTerm > AbstractEquationTerm > AbstractTargetEquationTerm*

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
