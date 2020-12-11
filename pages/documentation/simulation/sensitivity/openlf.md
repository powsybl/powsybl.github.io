---
layout: default
latex: true
---

# OpenLoadFlow

PowSyBl OpenLoadFlow is an open-source power flow implementation in Java provided by PowSyBl. The source code is hosted on [GitHub](https://github.com/powsybl/powsybl-open-loadflow). 

* TOC
{:toc}

## DC sensitivity analysis

A DC sensitivity analysis starts from the DC flows computing described in the [power flow section](../powerflow/openlf.md#dc-flows-computing). Simple sensitivity analyses are supported as:
- How an injection increase of 1 MW will impact the flow of a branch ;
- How a phase shifting of 1 degree of a phase tap changer will impact the flow of a branch.

This could be done in a set of branches given by the user.

### Sensitivities on the base network 

To get the sensitivity from injection increase in a given bus to a given branch, we compute the right-hand side \\(b\\) corresponding to an injection of 1 MW at this bus and 0 MW elsewhere. The LU decomposition gives the matrices \\(L\\) and \\(U\\) in order to compute the vector \\(\theta\\). Then it is easy to retrieve the power flow in the branch.

For example, to get the sensitivity from injection increase in bus \\(i\\) to branch \\((k,l)\\), we compute \\(b\\) satisfying:
- If \\(n=i\\):

	$$b_{n} = 1$$
- Else:

	$$ b_{n} = 0$$
	
Then, we retrieve the sensitivity with \\(\theta\\) calculating:

$$ s_{b,kl} = \frac{\theta_k-\theta_l}{X_{k,l}} $$

To get the sensitivity from phase-shifting angle in a given branch to a given branch, we compute the right-hand side \\(b\\) corresponding to an increase of one degree for the phase-shifting angle at this branch and 0 elsewhere. The LU decomposition gives the matrices \\(L\\) and \\(U\\) in order to compute the vector \\(\theta\\). Then it is easy to retrieve the power flow in the branch.

For example, to get the sensitivity from phase-shifting angle increase in branch \\((i,j)\\) to branch \\((k,l)\\), we compute \\(b\\) satisfying:
- If \\(n=i\\):

	$$b_{n} = -\frac{\pi}{180X_{i,j}}.$$
	
- If \\(n=j\\):

	$$b_{n} = \frac{\pi}{180X_{i,j}}.$$
- Else:

	$$b_{n} = 0.$$
	
Then, we retrieve the sensitivity with \\(\theta\\) calculating:

$$ s_{ij,kl} = \frac{\theta_k-\theta_l}{X_{k,l}} $$

In the special case where \\((i,j)=(k,l)\\), we retrieve the sensitivity calculating:

$$ s_{ij,kl} = \frac{\theta_k-\theta_l + \frac{\pi}{180}}{X_{k,l}} $$

### Sensitivities in case of compensation

In the case of a sensitivity from injection at bus \\(b\\) it is implied that the variation of power is compensated by the slack bus.
However, it is possible to perform a sensitivity analysis where the variation of injection is compensated by a list of participating units.
In this case, it is expected that the user provides a list of participating units,\\((g \in U)\\) in the compensation and their respective ratio \\((r^c_g)\\) of participation.
Therefore, the new sensitivity value is computed from sensitivity values in the slack compensated case, using following formula:

$$
s_{b,kl}^c = s_{b,kl} - \sum_{g \in U} r^c_g s_{g,kl}
$$

### Contingencies management

## Configuration

### Specific parameters

### Configuration file example
