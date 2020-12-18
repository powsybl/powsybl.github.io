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

$$ s_{i,kl} = \frac{\theta_k-\theta_l}{X_{k,l}} $$

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

The contingency management needs to compute sensitivity coefficients for post-contingency states of the network, that is to say,
states of the network after some outages have occured.
Those outages consist in the loss of different branches. 
It is possible to compute a sensitivity analysis on a post-contingency state of the network using the sensitivities computed on the base network.
Hence, the same LU decomposition is used both for the base network and for the post-contingency one, saving many computational time.

#### N-1 case
Let us start with the most classic case, where a single branch was lost by the network.
 
Let $$s_{b,ij,mk}$$ be the sensitivity of an increase of $$1MW$$ at bus $$b$$ on branch $$(i,j)$$ when the branch $$(m,k)$$ has been disconnected from the network.
We want to compute this sensitivity.

Let $$b^1$$ be the right-hand side vector corresponding with an increase of $$1MW$$ at bus $$b$$.

Let $$b^2$$ be the right-hand side vector corresponding with an increase of $$1MW$$ at bus $$m$$ plus a decrease of $$1MW$$ at bus $$k$$.

Let $$\theta^1$$ be the vector of voltage angles obtained solving the network contraints system on the base network with right-hand side $$b^1$$.

Let $$\theta^2$$ be the vector of voltage angles obtained solving the network contraints system on the base network with right-hand side $$b^2$$.
Notice that $$\theta^1$$ and $$\theta^2$$ are built using the same LU decomposition of the constraints matrix $$J$$.

Let $$s_{b,ij}$$ be the sensitivity of an increase of $$1MW$$ at bus $$b$$ on branch $$(i,j)$$ on the base network, we recall that:

$$
s_{b,ij} = \frac{\theta^1_i-\theta^1_j}{X_{i,j}}
$$

Let $$s_{mk,ij}$$ be the sensitivity of an increase of $$1MW$$ at bus $$m$$ plus a decrease of $$1MW$$ at bus $$k$$, on the base network.
This can be easily computed with the formula:

$$
s_{mk,ij} = \frac{\theta^2_i-\theta^2_j}{X_{i,j}}
$$

Then, The post contingency sensitivity $$s_{b,ij,mk}$$ satisfied:

$$
s_{b,ij,mk} = s_{b,ij} + \frac{\theta^1_m-\theta^1_k}{X_{m,k} - (\theta^2_m-\theta^2_k)}s_{mk,ij}
$$


## Configuration

### Specific parameters

**useBaseCaseVoltage**  
The `useBaseCaseVoltage` property is an optional property that defines to init the voltages in case of DC flows computation. If this property is set to `true`, the voltages present in the initial network are used, otherwise an uniform voltage plan is computed.

### Configuration file example
