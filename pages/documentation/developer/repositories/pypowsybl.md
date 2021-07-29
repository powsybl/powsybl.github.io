# pypowsybl [![GitHub release](https://img.shields.io/github/release/powsybl/pypowsybl.svg)](https://github.com/powsybl/pypowsybl/releases/)
The PyPowSyBl project gives access to PowSyBl framework to Python developers. This Python integration relies on GraalVM to compile Java code to a native library.

**Reviewers:** [geofjamg](https://github.com/geofjamg), [sylvlecl](https://github.com/sylvlecl)  
**Committers:** [geofjamg](https://github.com/geofjamg), [sylvlecl](https://github.com/sylvlecl)

## Features

The available features are:  

**Grid modelling**      
- We can create an empty network ;
- We can load a network from a file. The supported formats are for the moment `CGMES`, `MATPOWER`, `IEEE-CDF`, `PSS/E`, `UCTE` and `XIIDM`.
- We can save a network to a file. The supported formats are for the moment `CGMES`, `UCTE`, and `XIIDM`.
- We can create and update network elements with a [Pandas](https://pandas.pydata.org/) data frame.  
  
**Simulation**      
- We can run a AC load flow with [OpenLoadFlow](../../simulation/powerflow/openlf.md) implementation ;
- We can run a DC load flow with [OpenLoadFlow](../../simulation/powerflow/openlf.md) implementation ; 
- We can run an AC sensitivity analysis with [OpenLoadFlow](../../simulation/sensitivity/openlf.md#ac-sensitivity-analysis) implementation, on the pre-contingency network and on the post-contingency networks ;
- We can run a DC sensitivity analysis with [OpenLoadFlow](../../simulation/sensitivity/openlf.md#dc-sensitivity-analysis) implementation, , on the pre-contingency network and on the post-contingency networks ;
- We can run an AC post-contingency analysis with OpenLoadFlow, note that the DC security analysis based on OpenLoadFlow is not yet supported.

## Getting started

- [Scripting with Python](../../developer/scripting/python.md) - A first introduction to learn how to use PyPowSyBl

## Releases

| Version | Release date | Release notes | API documentation |
| ------- | ------------ | ------------- | ----------------- |
| 0.8.0 | 2021-06-13 | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.8.0) | [readthedocs.io](https://pypowsybl.readthedocs.io/en/latest/) |
| 0.7.0 | 2021-04-13 | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.7.0) | - |
| 0.6.0 | 2021-04-08 | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.6.0) | - |
