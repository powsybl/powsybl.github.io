---
title: User story Capacity calculation for RSC
layout: default
---

This user story concerns Regional Security Coordinators (RSCs). An efficient and safe management of the European electricity system requires coordination at regional level. This is the role of RSCs, whose objectives are the coordinated security of the electricity system, the integration of large-scale renewable energy generation and the development of the European electricity market. They perform five core services for TSOs:

- Coordinated security analysis,
- Outage planning coordination,
- Coordinated capacity allocation,
- Short-term and very short-term adequacy forecast,
- Individual and common grid modelling and data set delivery


We are going to explain how to perform a coordinated capacity computation using PowSyBl and some specific developments. We want to ensure that flows across borders respect given maximum admissible values, while ensuring electricity security of supply. If some overloads are reported, a remedial actions optimization is called to find the cheaper solution to solve the constraints. Remedial actions can be either changing the tap of a PST (it modifies the impedance of the network and so the load flows) or generator redispatching.

# Workflow

The first input data of this process is the network model, coming from UCTE or CIM-CGMES European exchange formats. We also need an object to define the security domain of the network, built from a CRAC file (for "Contingency list, Remedial Actions and additional Constraints"): it contains a contingencies list, the constraints to monitor and the available remedial actions to get rid of the constraints.   

In this process, we also need two computation engines:
- A loadflow calculation is launched before and after each contingency to identify overloads.
- A sensitivity calculation: for each border, a sensitivity analysis determines the impact on the flow of a small variation of the PST angle, and that for all PSTs, and determines the impact on the flow of a small variation of the generation, and that for all generators.

A cost function is built from the previous results of the sensitivity computation. It is then sent to a solver to find the remedial actions avoiding constraints at a minimal cost.

A secruity analysis is performed at the end of the process to validate the set of remedial actions, found by the optimization.

All PowSybl features used in this workflow are described below with some implementation examples.

![Workflow](./images/Workflow_Capacity_Calculation_RSC.svg){: width="100%" .center-image}

# Identification of the power system blocks

This user story involves several features from PowSyBl framework and some other features that are specific:

<img src="./images/File.svg" alt="" style="vertical-align: bottom"/>
The studied network comes from a set of TSOs' networks. The TSOs' networks can be provided in a common TSO exchange format such as UCTE or CIM-CGMES formats. The following lines of code come format from [powsybl-tutorials](https://github.com/powsybl/powsybl-tutorials/tree/master/cgmes) and illustrated this functionality.

```java
File fileBe = new File("/path/to/file/MicroGridTestConfiguration_T4_BE_BB_Complete_v2.zip");
File fileNl = new File("/path/to/file/MicroGridTestConfiguration_T4_NL_BB_Complete_v2.zip");
```

<br />

<img src="./images/Import.svg" style="vertical-align: bottom"/>
Each input file is imported with a gateway that transforms the input file in an in-memory object representing the network. The studied network results from the merge of all TSOs' networks.

```java
Network networkBe = Importers.loadNetwork(fileBe.toString());
Network networkNl = Importers.loadNetwork(fileNl.toString());
networkBe.merge(networkNl);
```

<br />

<img src="./images/Network_merging.svg" style="vertical-align: bottom"/>
A topological merge of the TSOs' networks is done. The following lines of code come from [powsybl-tutorials](https://github.com/powsybl/powsybl-tutorials/tree/master/cgmes) and illustrated this functionality.

```java
networkBe.merge(networkNl);
```

<br />

<img src="./images/Compute_LF.svg" style="vertical-align: bottom"/>
Then, flows are computed with a load flow simulator. Since there is no fully functional open source load flow simulator integrated to powsybl for the time being, we use Hades2 for the purpose of the tutorial, which is a non open source software, but available in a freeware mode for experimental purposes. For more details, please visit this [page](https://rte-france.github.io/hades2/features/loadflow.html) to learn about Hades2. A `LoadFlow` object is created by an implementation of a `LoadFlowFactory` (here a `Hades2Factory` in fact), which needs as input arguments an on-memory network and a computation manager `computationManager` (here defined locally by default).

```java
ComputationManager computationManager = LocalComputationManager.getDefault();
LoadFlow loadFlow = new Hades2Factory().create(networkBe, computationManager, 0);
```

A loadflow is run on the working variant of the network with a set of parameters. The default parameters are listed [here](../configuration/parameters/LoadFlowParameters.md). Here angles are set to zero and voltages are set to one per unit. We also create a new variant to store the calculated flows. Note that a network variant is close to a state vector and gathers variables such as injections, productions, tap positions, states of buses, etc.

```java
LoadFlowParameters loadFlowParameters = new LoadFlowParameters().setVoltageInitMode(LoadFlowParameters.VoltageInitMode.DC_VALUES);
LoadFlowResult result = loadFlow.run(VariantManagerConstants.INITIAL_VARIANT_ID, loadFlowParameters).join();
```
<br />

<img src="./images/Compute_Sensitivity.svg" style="vertical-align: bottom"/>
The sensitivity computation module is dedicated to compute linearized impact of network small variations on some elements state variables. The sensivity computation is fully described [here](../sensitivity/index.md). In this user story, we use this module to compute all coefficients of the cost function. Since there is no fully functional open source sensitivity computation module integrated to powsybl for the time being, we use Hades2 for the purpose of the tutorial, which is a non open source software, but available in a freeware mode for experimental purposes. For more details, please visit this [page](https://rte-france.github.io/hades2/features/loadflow.html) to learn about Hades2.

<br />

<img src="./images/Modify_iAL.svg" style="vertical-align: bottom"/>
Remedial actions are read from the CRAC file and given to the optimizer which is a specific module. The best set of remedial actions is converted in actions understandable by PowSyBl framework. The CRAC file provides also the contingency list, which is also converted in an understandable object for PowSyBl framework called [Contingency](../contingencies/index.md).

```java
ContingenciesProvider contingenciesProvider = new ContingenciesProvider() {
            @Override
            public List<Contingency> getContingencies(Network network) {
                  // Code here how you want to fill/map the list of contingencies.
            }
        };
```

<br />

<img src="./images/Compute_SA.svg" style="vertical-align: bottom"/>
The final set of remedial actions is validated through a security analysis. A security analysis needs an input variant, a set of parameters as a `securityAnalysisParameters` object and a set of contingencies as a `contingenciesProvider` object.

```java
SecurityAnalysis securityAnalysis = new Hades2SecurityAnalysisFactory().create(networkBe, computationManager, 0);
SecurityAnalysisParameters securityAnalysisParameters = new SecurityAnalysisParameters(); // Default parameters.
network.getVariantManager().cloneVariant(VariantManagerConstants.INITIAL_VARIANT_ID, "saVariant");
SecurityAnalysisResult securityAnalysisResult = securityAnalysis.run("saVariant", securityAnalysisParameters, contingenciesProvider).join();
```

# External features

<img src="./images/Compute_Optimizer.svg" style="vertical-align: bottom"/>
The cost function builder is in fact a big toolbox using some power system blocks from PowSyBl framework. For more details about this builder, please refer to [FARAO website](https://farao-community.github.io/). Google OR-Tools open source library is used to perform the optimization: please visit this [page for more details](https://developers.google.com/optimization/).
