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

### Contingency management

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

#### N-k case
For the N-k case, the incident causes several outages on the network.
As for the N-1 case, an outage is the loss of a network line (this includes the special case of the loss of a transformer).
 
Let $$s_{b,ij,I}$$ be the sensitivity of an increase of $$1MW$$ at bus $$b$$ on branch $$(i,j)$$ when the incident $$I$$ occurs.
Incident $$I$$ corresponds to the loss of the $$k$$ branches $$(m_1,n_1), \cdots, (m_k,n_k)$$.
We want to compute this sensitivity.

Let $$b^1$$ be the right-hand side vector corresponding with an increase of $$1MW$$ at bus $$b$$.

Let $$b^{p+1}$$ be the right-hand side vector corresponding with an increase of $$1MW$$ at bus $$m_p$$ plus a decrease of $$1MW$$ at bus $$n_p$$.

Let $$\theta^p$$ be the vector of voltage angles obtained solving the network contraints system on the base network with right-hand side $$b^p$$.

The post contingency sensitivity $$s_{b,ij,I}$$ satisfied:

$$
s_{b,ij,I} = s_{b,ij} + \sum_{p} \alpha_p s_{m_pn_p,ij}
$$

Where:

$$
s_{m_pn_p,ij} = \frac{\theta^{p+1}_i-\theta^{p+1}_j}{X_{i,j}}
$$

The vector of coefficients $$\alpha$$ is computed as the solution of a linear system of size $$k$$:

$$
Mx = c
$$

Where $$M$$ is the $$k \times k$$ matrix defined by:

$$
\begin{align}
M_{p,q} =& -(\theta^{q+1}_{m_p} - \theta^{q+1}_{n_p}) & \texttt{If}~p \neq q,\\
M_{p,q} =& X_{m_p,n_p} - (\theta^{p+1}_{m_p} - \theta^{p+1}_{n_p})& \texttt{else}.
\end{align}
$$

And $$c$$ the vector of size $$k$$ defined by:

$$
c_p = \theta^1_{m_p} - \theta^1_{n_p}
$$

#### Special case: loss of network connectivity
It is possible that the matrix $$M$$ of the N-k case is not inversible.
In the N-1 case it happens when the factor $$X_{m,k} - (\theta^2_m-\theta^2_k)$$ equals $$0$$.
In this special case, above computations cannot be performed and used to assess post contingency sensitivities.
This special case arrives when the N-k network is non connected.
However, it is possible to get sensitivity values for components in the largest connected part of the N-k network containing the slack bus.

In realistic cases of post contingency sensitivity value computations, the post contingency network might be non connected,
but the original network should only have lost tiny portions and those should not contain the slack bus.
Therefore, the part of the post contingency network containing the slack bus is only a little smaller than the original network,
and most of the sensitivities can be computed.

Following sections explain how to compute sensitivity from an injection, or a phase shifting angle, at a bus, or a line,
on a given line. Both components must be in the connected part of the slack bus in the post contingency network.
If the two components of the sensitivity are not in the same connected part, the sensitivity trivially equals $$0$$.
In the non probable case where both components lies in the same connected part which is not the part containing the slack bus,
OpenLoadFlow will assign the $$\text{NaN}$$ value to the sensitivity. 

##### Loss of connexity management in N-1 case
The N-1 case where connectivity is lost is quite simple.
Sensitivities computed on the N network are valid for the N-1 network as long as they concern components
in the connected part of the N-1 network containing the slack bus.

##### Loss of connexity management in N-k case
If the post contingency network of a N-k study is not connected, it can be divided into several largest connected parts.
Let $$t$$ be the number of those parts.

Obviously: $$t \leq k+1$$

One of this part contains the slack bus and should be the largest.
All sensitivities involving only components in this part can be computed.
To do this, one must put back some disconnected lines to the network to obtain a connected network.
OpenLoadFlow seek to find $$t-1$$ lines to put back such as a connected network is obtained.
This provides a N-k+t-1 connected network.

We know that sensitivities computed on the N-k+t-1 network are valid for the N-k network as long as they concern components
in the connected part of the N-k network containing the slack bus.

##### How to detect a loss of connectivity
It might be quite time consuming to assess the connectivity of the N-k network using classic graph theory tools.
Here we propose another way to detect a loss of connectivity in the N-k network that is used in OpenLoadFlow.
If the N-k network is connected (which is a realistic assessment for real world computations),
we need to compute the $$\theta^p$$ vectors as described in the N-k case section.
Hence, our method uses those vectors as tools to detect a loss of connectivity.

First, we define and compute:

$$
\forall p \in \{1,\dots,k\}, \quad \sigma_p = \sum_{q \in \{1,\dots,k\}} \left|\frac{\theta^{p+1}_{m_q}-\theta^{p+1}_{n_q}}{X_{m_q,n_q}}\right|
$$

If there exists $$p \in \{1,\dots,k\}$$ such as $$\sigma_p \geq 1$$, then, may be there is a loss of connectivity in the N-k network.
Else, there is no loss of connectivity in the N-k network.

OpenLoadFlow computes sequentially the $$\sigma_p$$ coefficients and, as soon as one of them is found greater or equal to $$1$$,
stops the process and go back to classic graph theory tools to assess
if there is a loss of connectivity by computing the set of larger connected parts in the N-k network.

Since in a general case there is no loss of connectivity and the $$\sigma_p$$ coefficients are lesser than 1,
the process is run to its end.
But it is fast and efficient specially for N-1 case, where if $$\sigma_1$$ is equal to $$1$$, then the N-1 network is proven disconnected.

##### Slack distribution in case of connectivity loss
In case of connectivity loss, units that are not connected to the main part containing the slack bus are removed from the list of participating units.
Moreover, the participating coefficient of remaining units is increased such as their sum remains equal to one.
In this case each coefficient is multiplied by the same factor.


## Configuration

### Specific parameters

**useBaseCaseVoltage**  
The `useBaseCaseVoltage` property is an optional property that defines to init the voltages in case of DC flows computation. If this property is set to `true`, the voltages present in the initial network are used, otherwise an uniform voltage plan is computed.

### Configuration file example
