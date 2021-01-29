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
- How an injection increase of 1 MW will impact the flow of a branch ;
- How a phase shifting of 1° of a phase tap changer will impact the flow of a branch.

This could be done in a set of branches given by the user.

### Sensitivities on the base network 

Injection increases could be either an active power increase of a generator $$targetP$$ or an active power increase of a load $$P0$$. To get the impact of an injection increase in a given bus into a given branch, we compute the right-hand side $$b$$ corresponding to an injection of 1 MW at this bus and 0 MW elsewhere. The LU decomposition gives the matrices $$L$$ and $$U$$ in order to compute the vector $$\theta$$. Then it is easy to retrieve the active power flow in the branch.

For example, to get the sensitivity from injection increase in bus $$i$$ to branch $$(k,l)$$, we compute $$b$$ satisfying:

$$
\begin{align}
\texttt{if}~n=i:&\\
&b_{n} = 1\\
\texttt{else}:&\\
&b_{n} = 0
\end{align}
$$

Then, we retrieve the sensitivity with $$\theta$$ calculating:

$$ s_{i,kl} = \frac{\theta_k-\theta_l}{X_{k,l}} $$

To get the sensitivity from phase-shifting angle in a given branch to a given branch, we compute the right-hand side $$b$$ corresponding to an increase of 1° for the phase-shifting angle at this branch and 0 elsewhere. The LU decomposition gives the matrices $$L$$ and $$U$$ in order to compute the vector $$\theta$$. Then it is easy to retrieve the active power flow in the branch.

For example, to get the sensitivity from phase-shifting angle increase in branch $$(i,j)$$ to branch $$(k,l)$$, we compute $$b$$ satisfying:

$$
\begin{align}
\texttt{if}~n=i:&\\
&b_{n} = -\frac{\pi}{180X_{i,j}}\\
\texttt{if}~n=j:&\\
&b_{n} = \frac{\pi}{180X_{i,j}}\\
\texttt{else}:&\\
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

### Contingency management

The contingency management consists in calculating the sensitivity values for post-contingency states of the network. A post-contingency state of the network is the state of the network after an outage (most of the time, the loss of a line). In the particular case of DC flows approximation, the post-contingency sensitivity values can be computed using the pre-contingency sensitivity values and some flow transfer factors. Thus, the same LU decomposition is used both for the pre-contingency analysis and for the post-contingency analysis.

#### Loss of a single branch

The most frequent event in the network is the loss of a single branch (including the loss of a transformer with or without tap changer).
 
Let's introduce $$s_{b,ij,mk}$$ the sensitivity of an increase of 1 MW at bus $$b$$ on branch $$(i,j)$$ where the branch $$(m,k)$$ represents the outage.
We want to compute this sensitivity.

We call $$b^1$$ the right-hand side vector corresponding to an increase of 1 MW at bus $$b$$. We call $$\theta^1$$ the state vector of voltage angles obtained by solving the equation system on the pre-contingency network that has as right-hand side $$b^1$$.

We call $$b^2$$ be the right-hand side vector corresponding to an increase of 1 MW at bus $$m$$ and a decrease of 1 MW at bus $$k$$. We call $$\theta^2$$ the state vector of voltage angles obtained by solving the equation system on the pre-contingency network that has as right-hand side $$b^2$$.

Note that both $$\theta^1$$ and $$\theta^2$$ are built using the same LU decomposition of the constraints matrix $$J$$.

Let $$s_{b,ij}$$ be the sensitivity of an increase of 1 MW at bus $$b$$ on branch $$(i,j)$$ on the pre-contingency network, we recall that:

$$
s_{b,ij} = \frac{\theta^1_i-\theta^1_j}{X_{i,j}}
$$

Let $$s_{mk,ij}$$ be the sensitivity of an increase of 1 MW at bus $$m$$ and a decrease of 1 MW at bus $$k$$, on the pre-contingency network.
It can be easily computed through the formula, valid for all buses:

$$
s_{mk,ij} = \frac{\theta^2_i-\theta^2_j}{X_{i,j}}
$$

Then, the post-contingency sensitivity $$s_{b,ij,mk}$$ satisfies:

$$
s_{b,ij,mk} = s_{b,ij} + \frac{\theta^1_m-\theta^1_k}{X_{m,k} - (\theta^2_m-\theta^2_k)}s_{mk,ij}
$$

#### Loss of more than one branch

Sometimes, an event in the network causes the loss of several buses and branches. Connected to these lost buses, we can have generators or loads.
 
Let's introduce $$s_{b,ij,E}$$ the sensitivity of an increase of 1 MW at bus $$b$$ on branch $$(i,j)$$ when the event $$E$$ occurs. The event $$E$$ corresponds to the loss of the $$n$$ branches indexed by $$(m_1,k_1), \cdots, (m_n,k_n)$$. We want to compute this sensitivity.

We call $$b^1$$ the right-hand side vector corresponding to an increase of 1 MW at bus $$b$$. We call $$\theta^1$$ the state vector of voltage angles obtained by solving the equation system on the pre-contingency network that has as right-hand side $$b^1$$.

We call $$b^{p+1}$$ be the right-hand side vector corresponding to an increase of 1 MW at bus $$m_p$$ and a decrease of 1 MW at bus $$k_p$$. We call $$\theta^{p+1}$$ the state vector of voltage angles obtained by solving the equation system on the pre-contingency network that has as right-hand side $$b^{p+1}$$.

Then, the post-contingency sensitivity $$s_{b,ij,E}$$ satisfies:

$$
s_{b,ij,E} = s_{b,ij} + \sum_{p=1}^n \alpha_p s_{m_pk_p,ij}
$$

Where, valid for all buses:

$$
s_{m_pk_p,ij} = \frac{\theta^{p+1}_i-\theta^{p+1}_j}{X_{i,j}}
$$

The vector of coefficients $$\alpha$$ is computed as the solution of a linear system of size $$n$$:

$$
Mx = c
$$

Where $$M$$ is the $$n \times n$$ matrix defined by:

$$
\begin{align}
M_{p,q} =& -(\theta^{q+1}_{m_p} - \theta^{q+1}_{k_p}) & \texttt{if}~p \neq q,\\
M_{p,q} =& X_{m_p,k_p} - (\theta^{p+1}_{m_p} - \theta^{p+1}_{k_p})& \texttt{else}.
\end{align}
$$

And $$c$$ the vector of size $$n$$ defined by:

$$
c_p = \theta^1_{m_p} - \theta^1_{k_p}
$$

#### Loss of network connectivity management

An event can create one or more new synchronous component. In case of the loss of a single branch (when n = 1), it means, mathematically, that the factor $$X_{m,k} - (\theta^2_m-\theta^2_k)$$ equals to $$0$$. In case of the loss of more than one branch (when n > 1), it means, mathematically, that the matrix $$M$$ previously defines is not invertible. In that special configuration, previously described coefficients $$\alpha$$ cannot be computed and used to assess post-contingency sensitivities. Most of the time, the secondary networks are out of voltage, but it is still possible to get the sensitivity values in the largest network containing the slack bus. In real world, it is like the initial network has lost small parts that not contain the slack bus. Thus, the sensitivity values can still be computed.
 
A sensitivity involves two equipments in the network: a load or a generator, etc. connected to a bus, or a phase tap changer and a monitored branch. These two equipments should be in the same connected component. If the two equipments are not in the same connected component, the sensitivity trivially equals to $$0$$. In the configuration where both equipments are in the same secondary connected component, which does not contain slack bus, we have arbitrary decided to assign the $$\text{NaN}$$ value to the sensitivity.

##### Loss of connectivity by a single branch

This case is quite simple to support. Sensitivities computed on the base network are still valid for the post-contingency network as long as they refer to equipments in the connected component containing the slack bus.

##### Loss of connectivity by more than one branch

A post-contingency network can be divided into several largest connected components. Let's introduce $$t$$ be the number of those components.

Obviously: $$t \leq n+1$$

One of this component contains the slack bus and should be the largest. Only sensitivities involving equipments of that component can be computed. A easy way to compute them is to connect lines that have been disconnected during the contingency. More precisely, we have find $$t-1$$ lines to reconnect in order to obtain an single connected component without creating any loop. It does not modify the sensitivities, but it creates an invertible problem.

##### How to detect a loss of connectivity?

It might be quite time consuming to assess the connectivity of the post-contingency network using classic graph theory tools. Here we propose another way to detect a loss of connectivity in the post-contingency network. We need to compute the $$\theta^p$$ vectors as described in the section describing the loss of more than one branch. Our method uses those vectors to detect a loss of connectivity.

First, we define and compute:

$$
\forall p \in \{1,\dots,n\}, \quad \sigma_p = \sum_{q \in \{1,\dots,n\}} \left|\frac{\theta^{p+1}_{m_q}-\theta^{p+1}_{k_q}}{X_{m_q,k_q}}\right|
$$

If we can find $$p \in \{1,\dots,n\}$$ such as $$\sigma_p \geq 1$$, then, there is probably a loss of connectivity in the post-contingency network. Else, we are sure that there is no connectivity loss in the post-contingency network.

We compute sequentially the $$\sigma_p$$ coefficients and, as soon as one of them is found greater or equal to $$1$$, we stop the process and a classic graph analysis is performed. Most of the time, connectivity is not lost, especially when we loose a single branch ($$\sigma_1$$ is equal to $$1$$).

##### Slack distribution in case of connectivity loss

In case of connectivity loss, participating elements that are not connected to slack bus are removed from the list of initial participating elements.
Then, the participating factor of remaining elements is increased such as their sum remains equal to one.

## Configuration

### Specific parameters

### Configuration file example
