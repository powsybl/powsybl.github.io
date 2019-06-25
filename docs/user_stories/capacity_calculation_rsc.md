---
title: User story Remedial Action Optimiser
layout: default
---

This user story speaks to Regional Security Coordinators (RSCs). A efficient and safe management of the European electricity system requires coordination at regional level. This is the role of RSCs, which objectives are the coordinated security of the electricity system, the integration of large-scale renewable energy generation and the development of the European electricity market. They perform five core services for TSOs :

- Coordinated security analysis,
- Outage planning coordination,
- Coordinated capacity allocation,
- Short-term and very short-term adequacy forecast,
- Individual and common grid modelling and data set delivery


 We are here going to explain how to perform a coordinated capacity computation using PowSyBl and some specific developments. We want to ensure that flows across borders respect given maximum admissible values, while ensuring electricity security of supply. If some overloads are reported, a remedial actions optimisation is called to find the cheaper solution for solving the constraints. Remedial actions can be either changing the tap of a PST (it modifies the impedance of the network and so the load flows) or generator redispatching.

# Workflow

The first input data of this process is the network model, coming from UCTE or CIM-CGMES European exchange formats. We also need an object to define the security domain of the network, build from a CRAC file (for "Contingency list, Remedial Actions and additional Constraints") : it contains a contingencies list, the constraints to monitor and the available remedial actions to get rid of the constraints.   

In this process, we also need two computation engines :
- A loadflow calculation is launched before and after contingency to identify overloads.
- A sensitivity calculation : for each border, a sensitivity analysis determines the impact on the flow of a small variation of the PST angle, and that for all PSTs, and determines the impact on the flow of a small variation of the generation, and that for all generators.

A cost function is build from the previous results of the sensitivity computation. It is then sent to a solver to find the remedial actions avoiding constraints at a minimal cost.

A secruity analysis is performend at the end of the process to validate the set of remedial actions, found by the optimisation.

All PowSybl features used in this workflow are described below with some implementation examples.

# Identification of the power system blocks

This user story involves several features from P framework and some other features that are specific:

<p>
<img src="./images/File.svg" alt=""/>
The studied network can be provided in a common TSO format exchange as UCTE or CIM-CGMES.
</p>

<p>
<img src="./images/Import.svg" alt=""/>
The input file is imported with a gateway that transforms the input file in an in-memory object representing the network.
</p>

<p>
<img src="./images/Compute_LF.svg" alt=""/>
Loadflows are computed through the loadflow simulator API. In this user story case, the implementation used is the Hades2 loadflow, provied by RTE. Note that Hades2 is a non open source tool, but available in a freeware mode for experimental purposes.
</p>

<p>
<img src="./images/Compute_Sensitivity.svg" alt=""/>
Sensitivity computation is provided by the sensitivity analysis simulator. It also uses Hades2.
</p>

<p>
<img src="./images/Modify_N-1.svg" alt=""/>
Contingencies are defined using the built-in format defined in PowSyBl called a DSL.
</p>

<p>
<img src="./images/Modify_iAL.svg" alt=""/>
Remedial actions are also defined using the format defined in PowSyBl.
</p>

Note that the data management is handled by the PowSyBl feature called Application File System (AFS).

# External features are:

The cost function builder is in fact a big toolbox using some power system blocks from PowSyBl framework. For more details about this builder, please refer to [FARAO website](https://farao-community.github.io/). The optimization is based on a OR-Tools solution.
