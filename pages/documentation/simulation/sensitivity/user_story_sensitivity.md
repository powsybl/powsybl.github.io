---
layout: default
latex: true
---

# Introduction
Security Constrained DCOPF

# DCOPF

## Data
Physical characteristics of lines and transformers (same as DCPF: X and A).
Some injectons (mostly consumptions).
Cost for variable injections.

For each line with a limited power flow, the PF limit value.

Parameter: using one slack or distributed slack.

## Variables
Variable injections (mostly productions).

## Objective function
Linear function of variable injections.

## Constraints
DCLF constraints (both Ohm law and bus balancing).
The power flow is limited on a bunch of lines.


## How to solve DCOPF using sensitivity values

### Compute sensitivity factor matrix

M matrix of size "number of constrained lines" x "number of buses + number of PST"
The coeff (i,j) is the sensitivity factor of elements j on line i.
Either standard coeff or distributed slack coeff depending on the param.

The computed linear problem to solve is then simply expressed from the sensitivity factor:
Ohm's law is discarded.

More precisely:

### Constraints
Two types:
	- Balancing: for each bus $$b$$: $$var_{bal,b} = \sum_i dat_{inj,b,i} + \sum_j var_{inj,b,j}
	- Limits on lines: for each watched line $$l$$: $$\sum_b dat_{sen,b,l} var_{bal,b} + \sum_p dat_{sen,p,l} dat_{ang,p} \leq dat_lim_l$$

### Remark
This is not very usefull thought because it is almost as difficult to solve DCOPF frontally
then to compute the sensitivity factors themselves.


# SCDCOPF

