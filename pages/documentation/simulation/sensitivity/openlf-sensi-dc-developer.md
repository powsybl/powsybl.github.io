---
layout: default
latex: true
---

# Developer documentation for the OpenLoadFlow DC sensitivity analysis

The aim of this page is to document the `analyse` method of class `DcSensitivityAnalysis`.

## First step: preparing the sensitivity computation

The beginning of the function is shared with the AC sensitivity analysis. An IIDM network is loaded and converted in a `LfNetwork`, which is the internal model of the OpenLoadFlow. Then, we check every contingency and the slack distribution parameters. An additional check is performed to be sure that all asked factors are supported in DC mode. For example, a `BusVoltagePerTargetV` factor is not supported, and we raise an exception. Once we are sure that all the factors are valid factors, we aggregate them into groups, where each group corresponds to the same sensitivity variable. The state of the network will be the same for all factors within the same group. Some additional grouping could be done. For example, injections from different generators connected to the same bus are grouped too.

In this page, the pre-contingency network is the network before any contingency simulation. The post-contingency network is the network after applying one contingency. There could be several post-contingency networks. After creating the factor groups, we compute the slack distribution on the pre-contingency network, and we create a `Map` that links each bus ID to the opposite of it's slack participation factor. This `Map` will be used later to apply slack distribution on each injection factor.

In DC sensitivity analysis, contrary to AC sensitivity analysis, a contingency is not managed by deactivating its related equations. The corresponding branch is virtually removed by injecting a given amount of MW on each side of the branch, and computing the corresponding sensitivity. To do that, we create a new class of object, called `ComputedContingencyElement`, that contains indexes, in order to extract easily some data from a matrix, and to compute the amount of MW to inject in order to virtually remove the branch. The next step is then to create those object, by iterating over the branches composing contingencies (excepted HVDC line as they are not considered as branches in the `LfNetwork` for the moment).

After building the Jacobian matrix, we run a load flow to compute the reference functions of the sensitivity factors, here the active power flows. We use this resolution to extract a state matrix, i.e. a matrix with an angle for every bus.

The next step is to compute the states for the sensitivities. We fill a right-hand-side matrix, following the given convention:
- For an injection on a bus, we write $$1$$ on the matrix line corresponding to this bus (more precisely, the line corresponding to the `BUS_P` equation of this bus), and then $$0$$ for all the other matrix lines. Then, we substitute to each matrix line the slack participation of the corresponding bus, to compensate the factor injection. For example, if you have a 3-buses network, with a generator on each bus, with the following participation factors: bus 1: 0.5, bus 2: 0.1 and bus 3: 0.4. Then the column corresponding to an injection on bus $$1$$ in the right-hand-side looks like this:
  $$
  \begin{pmatrix}
    1-0.5 \\
    -0.1 \\
    -0.4
  \end{pmatrix}
  $$
- For a sensitivity on a phase tap changer, the equation system contains an equation of type `ALPHA_1` corresponding to the phase tap changer (this is enforced by passing the parameter `forceA1var` during the equation system creation), and we just write $$1$$ on the matrix line corresponding to this equation.

We define the same type of right-hand-side matrix to represent the contingencies, by writing $$+1$$ on one side of the branch, and $$-1$$ on the other.

Once we define these two matrix, we solve the equation system using the Jacobian in the left-hand-side. This gives us the network state corresponding to each modification (a factor, or an injection on each side of a branch contingency). From the factor states, we extract the sensitivity value for each factor, on the pre-contingency network. We store this base sensitivity in each factor. Then, we use it to create some results for the pre-contingency network.

Once this is done, all that's left is to compute the sensitivities for each contingency. To do so, we need to distinguish several cases for each contingency:
- Whether or not we lost the connectivity of the network when applying a contingency (because then, the slack distribution may change).  
- Whether or not we apply the contingency on a transformer. In that case, we need to deactivate the `ALPHA_1` equation, and recompute the loadflow to obtain the reference functions.
- Whether or not we apply the contingency on an HVDC line. In that case, the slack distribution may change.

The next natural step is then to divide contingencies in two categories: 
- The contingencies that do not lead to a loss of connectivity
- The contingencies that lead to a loss of connectivity (and we will index them by their branches that are responsible for the loss of connectivity - meaning each side of the branch is in a different connected component of the network-)

## Second step: detecting the loss of connectivity

In fact, we will start this division by making an approximation (function `detectPotentialConnectivityLoss`). For each contingency, we iterate through the branches of the contingency, and look at how applying $$+1$$ and $$-1$$ on this branch impacts the other branches. If the sum of the flows passing on the other branches is less than one, then we are sure that the connectivity has not been lost. Otherwise, we may have lost the connectivity, and the elements responsible for the loss of connectivity are included in the set of elements that have a non-zero sensitivity. The good thing about this is that it's pretty fast, because the states for the $$+1$$ and $$-1$$ on branches have already been computed in the previous steps.

It is now time to refine the results a bit, and run a connectivity analysis on the contingencies that were _potentially_ breaking connectivity, to know precisely which ones break the connectivity, and which ones don't. This is also where we index the results by the branches losing connectivity. To do so, we iterate through every group of element potentially breaking connectivity. We cut their branches, and we check for each element whether its two sides are in different connected components or not. If this is the case, then this element is (partially) responsible for the loss of connectivity.

## Third step: cases management

### Computing sensitivities without loss of contingency

First, we have to divide in two cases, if the contingency is on a line or on a transformer as follow:
- In case of losing a line, we have to check if the line is an AC line segment or an HVDC line.
- In case of losing a transformer.

#### Computing sensitivities for a classical contingency
The documented equations show that the sensitivity after a given contingency is obtained from the sensitivity on the pre-contingency network, computed previously, and from the virtual removal of the branches that compose the contingency. To remove the branch, we need to have the states for making $$+1$$ and $$-1$$ on each branch (we have computed this previously). We then need to compute what is called _alpha_ in the equation of the documentation, for each element (branch) of the contingency. The value of the _alpha_ will be different for the function reference and the sensitivities. We store this alpha inside the object of the `ComputedContingencyElement` that we mentioned earlier. Once _alpha_ is computed, we can apply the formula given in the documentation to get the function reference and the sensitivity value with respect to the contingency. (sensitivity = base sensitivity + sum_over_elements(alpha_element * sensitivity of $$+1$$ $$-1$$ on the element)).

#### Computing sensitivities for an HVDC contingency
If we lost an HVDC line, we need to apply some network modifications and recompute the load flow. The modifications consist in setting the generator $$targetP$$ to $$0$$ if the converter station was a VSC converter station, or substitute an amount of active power from the buses' `loadTargetP` field if we have a LCC converter station. Then if the slack is distributed, and the balance type is relative to the load, we need to recompute the distribution of the slack, and thus the right-hand-side matrix. Once this is done, we compute the new load flow (after modifications), and we are able to compute then the new contingency values, as we have done in [Computing sensitivities for a classical contingency](#computing-sensitivities-for-a-classical-contingency). Be careful, as the network has been updated to model the looses of converter stations, we need to restore the network as it was before, in order to preserve the next computations. 

Then we iterate on contingencies for which we did not lost the connectivity, but contain a transformer.

#### Computing sensitivities for a phase tap changer contingency
If some phase tap changers are lost, we need to deactivate all the `ALPHA_1` equations and recompute the load flow. This is done by passing a of `disabledBranches` to the `setReferenceActivePowerFlows` method. This set of `disabledBranches` has been computed when calling the `PhaseTapChangerContingenciesIndexing` class, and our contingencies have been indexed by set of transformers, to optimize the performances and compute as few load flows as possible. You may notice that we override the `flowStates` variable, but this does not matter, because the previous value of this variable was only useful for contingencies for which we did not loose the connectivity, and no transformers (and no HVDC). Then, once we have our new load flow, we can compute the contingencies, distinguishing between a loss of HVDC line and no loss of HVDC line, as we have done previously. Note that the load flow that we just ran will be used for every contingency without HVDC line, but will be computed again for every contingency with an HVDC line.

After that steps, we compute sensitivity values for contingencies that break the connectivity of the network.

### Computing sensitivities with loss of connectivity
Just as we have done to optimize the number of load flows computed in case of the loss of a transformer, we have done some indexing to optimize this.

Some branches are _responsible_ for the loss of connectivity. Meaning, their two sides are in different connected components. Different contingencies may have the same elements responsible for the loss of connectivity, so we would need to do some computation twice. For example, if losing a branch $$l1$$ breaks the connectivity, but losing branches $$l2$$, $$l3$$ and $$l4$$ does not affect connectivity, then the contingencies {$$l1$$, $$l2$$}, {$$l1$$, $$l3$$} and {$$l1$$, $$l4$$} will have the same connectivity, the same distribution of slack, and the same GLSKs, and we do not need to compute those multiple times. So, we have a set of element responsible for the loss of connectivity, and a list of contingency containing these elements. The first thing we do is to check for predefined results. For example, the function and the variable of a factor may be in different connected components, in that case, the sensitivity will obviously be $$0$$. If the function and the variable are in a connected component which is not the one containing the slack bus, we do not know what happens in this connected component, so we return _NaN_.

So, we lost connectivity, and we may have lost some buses that were involved in the slack distribution. This is the first thing we check. In the lost buses (i.e. that are not part of the main connected component anymore), if some were involved in the slack distribution, we recompute the slack distribution from scratch, we change the right-hand-side matrix and compute new states for the factors. So, we check if we need to do so, and store the result in the boolean `rhsChanged`.  The same thing goes for GLSK (and all multi variables). If we lost some generators that were part of the GLSK, we need to recompute the new distribution of the GLSK (the total injection must always be $$1$$), and recompute the right-hand-side matrix. Again, we store the result in `rhsChanged`.

If one of the two previous condition is met, we recompute the factor states. We also compute the associated slack distribution, and we create a new matrix to hold the new states, and use it to compute some new "base sensitivities". These base case sensitivity values do not represent the value on the base network anymore, but the value of the sensitivities in the main connected component.

Then, according to the [functional documentation section](openlf.md#loss-of-connectivity-by-more-than-one-branch), we need to find a set of branches that reconnects all the connected components without creating any cycle between them. For performances' sake, this was done at the same time than computing the branches responsible for the loss of connectivity.

We also need to recompute the new flow states, and we do this by passing the list of disabled buses.

Now, we have brand new flow states, brand new factor states, brand new base case sensitivities and a list of branches to reconnect. We can now compute the sensitivities, exactly as we have done for the sensitivities. The only difference is that the branches that will be reconnected should not be taken into account when using the formula of the documentation (when using the $$+1$$ $$-1$$ sensitivities), so we filter them out.

Once we have computed all the contingencies for this connectivity, we need to reset the base case sensitivities if we changed them, because some next iterations may use it. For example, some contingencies may change the distribution, and thus will use the base case sensitivity.