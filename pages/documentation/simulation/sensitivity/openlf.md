---
layout: default
latex: true
---

# OpenLoadFlow

PowSyBl OpenLoadFlow is an open-source power flow implementation in Java provided by PowSyBl.
It also allows to perform sensitivity analyses.
The source code is hosted on [GitHub](https://github.com/powsybl/powsybl-open-loadflow). 

* TOC
{:toc}

## DC sensitivity analysis

A DC sensitivity analysis starts from the DC flows computing described in the [power flow section](../powerflow/openlf.md#dc-flows-computing). Simple sensitivity analyses are supported as:
- How an injection increase of $$1 MW$$ will impact the flow of a branch ;
- How a phase shifting of $$1°$$  of a phase tap changer will impact the flow of a branch.

This could be done in a set of branches given by the user.

### Sensitivities on the base network 

Injection increases could be either an active power increase of a generator $$targetP$$ or an active power increase of a load $$P0$$. To get the impact of an injection increase in a given bus into a given branch, we compute the right-hand side $$b$$ corresponding to an injection of $$1 MW$$ at this bus and $$0 MW$$ elsewhere. The LU decomposition gives the matrices $$L$$ and $$U$$ in order to compute the vector $$\theta$$. Then it is easy to retrieve the active power flow in the branch.

For example, to get the sensitivity from injection increase in bus $$i$$ to branch $$(k,l)$$, we compute $$b$$ satisfying:

$$
\begin{align}
\texttt{If}~n=i:&\\
&b_{n} = 1\\
\texttt{Else}:&\\
&b_{n} = 0
\end{align}
$$

Then, we retrieve the sensitivity with $$\theta$$ calculating:

$$ s_{b,kl} = \frac{\theta_k-\theta_l}{X_{k,l}} $$

To get the sensitivity from phase-shifting angle in a given branch to a given branch, we compute the right-hand side $$b$$ corresponding to an increase of $$1°$$ for the phase-shifting angle at this branch and 0 elsewhere. The LU decomposition gives the matrices $$L$$ and $$U$$ in order to compute the vector $$\theta$$. Then it is easy to retrieve the active power flow in the branch.

For example, to get the sensitivity from phase-shifting angle increase in branch $$(i,j)$$ to branch $$(k,l)$$, we compute $$b$$ satisfying:

$$
\begin{align}
\texttt{If}~n=i:&\\
&b_{n} = -\frac{\pi}{180X_{i,j}}\\
\texttt{If}~n=j:&\\
&b_{n} = \frac{\pi}{180X_{i,j}}\\
\texttt{Else}:&\\
&b_{n} = 0
\end{align}
$$
	
Then, we retrieve the sensitivity with $$\theta$$ calculating:

$$ s_{ij,kl} = \frac{\theta_k-\theta_l}{X_{k,l}} $$

In the special case where $$(i,j)=(k,l)$$, we retrieve the sensitivity calculating:

$$ s_{ij,kl} = \frac{\theta_k-\theta_l + \frac{\pi}{180}}{X_{k,l}} $$

### Sensitivities in case of slack distribution

If active power mismatch is distributed on loads or on generators, an injection increase at bus $$b$$ will be distorted by slack distribution. Thus, the sensitivity analysis must include the sensitivity value correction linked to the effects of the participation units to the slack distribution. Let's introduce the list of participating units $$(g \in U)$$ involved in the slack distribution and their respective participation factor $$(r^c_g)$$. Note that at this stage, this list of participating elements is computed from the initial network state and not from its state after the DC flows computation. The new sensitivity values are computed from the base case sensitivity values through the following formula:

$$
s_{b,kl}^c = s_{b,kl} - \sum_{g \in U} r^c_g s_{g,kl}
$$

We only support for the moment balance type `PROPORTIONAL_TO_GENERATION_P_MAX` and `PROPORTIONAL_TO_LOAD`.

### Contingencies management

## Configuration

### Specific parameters

**useBaseCaseVoltage**  
The `useBaseCaseVoltage` property is an optional property that defines to init the voltages in case of DC flows computation. If this property is set to `true`, the voltages present in the initial network are used, otherwise an uniform voltage plan is computed.

### Configuration file example
