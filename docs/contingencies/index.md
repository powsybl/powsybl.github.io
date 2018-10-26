---
title: Contingencies
layout: default
---

The `com.powsybl.contingency.Contingency` class is used to model a set of equipments that are disconnected, because of a
maintenance work or a technical issue.

A `Contingency` is identified by its ID and can contain one or several `ContingencyElement`. These elements references an
equipment in the network. The supported type of equipements are:
- generators
- branches (lines, tie-lines or two windings transformers)
- HVDC lines
- Busbar sections

There are several types of contingencies:
- a N-1 contingency is a contingency that triggers a single equipement
- a N-k contingency is a contingency that triggers several equipements
- a busbar contingency is a contingency that triggers a busbar section. This a subtype of the N-k contingency because this
kind of contingencies will trigger every equipments connected to the specified busbar section. 

# ContingenciesProvider
The `com.powsybl.contingency.ContingenciesProvider` interface is used to provide a list of `Contingency` for the
[security-analysis](../tools/security-analysis.md) and [action-simulator](../tools/action-simulator.md) commands.

Powsybl provides several implementations of `ContingenciesProvider`:
- [EmptyContingencyListProvider](EmptyContingencyListProvider.md)
- [GroovyDslContingenciesProvider](GroovyDslContingenciesProvider.md)
