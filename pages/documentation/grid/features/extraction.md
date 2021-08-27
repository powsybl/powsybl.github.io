---
layout: default
latex: true
---

# Network extraction

The extraction module is used to extract a sub part of a network on an area of interest defined by the user. The border lines, transformers and HVDC lines are replaced by injections at the boundary of the area of interest. 
It is required to run a load-flow computation before the extraction to compute the flows on the border lines beforehand, so that the replacement is possible (otherwise, the extracted network won't be electrically equivalent to the original one).

The area of interest is defined by a list of [substations](../model/index.md#substation) or [voltage levels](../model/index.md#voltage-level).
In case the area of interest is defined as a list of substations, PowSyBl ends up selecting the voltage levels to be kept for the extraction. Then, the following is done:
- the equipments connected between voltage levels inside the area of interest are kept
- the equipments connected between voltage levels outside the area of interest are removed
- the remaining equipments located at the border are replaced by injections.

It is possible to choose whether the injections are placed as [loads](../model/index.md#load) or [dangling lines](../model/index/md#dangling-line).

## Replacements by loads

The load created in place of a branch has the same ID and name as the replaced branch. The type of the load is set as `FICTITIOUS` and its $$P_0$$ and $$Q_0$$ are set to the $$P$$ and $$Q$$ of the relevant terminal, depending on which side is kept in the network. If the branch is disconnected, $$P_0$$ and $$Q_0$$ are set to `NaN`. The connectivity information (node or bus depending on the voltage level topology) is conserved.

## Replacements by dangling lines

The dangling line created in place of a line has the same ID and name as the replaced line. The resistance and reactance of the dangling line are equals to half of the resistance and reactance of the replaced line (we consider that the line is cut in the middle). The conductance and susceptance are set to the $$G_1$$ and $$B_1$$ or to $$G_2$$ and $$B_2$$ depending on which side is kept in the network. 

The $$P_0$$ and $$Q_0$$ are set to the $$P$$ and $$Q$$ of the corresponding terminal, depending on which side is kept in the network. If the line is disconnected, $$P_0$$ and $$Q_0$$ are set to `NaN`. The connectivity information (node or bus depending on the voltage level topology) is conserved.
