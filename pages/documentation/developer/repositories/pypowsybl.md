# pypowsybl [![GitHub release](https://img.shields.io/github/release/powsybl/pypowsybl.svg?sort=semver)](https://github.com/powsybl/pypowsybl/releases/)
The PyPowSyBl project gives access to PowSyBl framework to Python developers. This Python integration relies on GraalVM to compile Java code to a native library.

## Features

The available features are:  

**Grid modelling**      
- We can load a network from a file. The supported formats are for the moment `CGMES`, `MATPOWER`, `IEEE-CDF`, `PSS/E`, `UCTE` and `XIIDM`.
- We can save a network to a file. The supported formats are for the moment `CGMES`, `UCTE`, and `XIIDM`.
- We can create and update network elements with a [Pandas](https://pandas.pydata.org/) data frame.  

**Network Visualization**
- We can create a single-line-diagram in SVG format from a substation or a voltage level.
- We can create a network area diagram in SVG format, either for the full network or for a part of the network.
- We can render these diagrams directly in the notebook if using a Jupyter notebook. 

**Simulation**      
- We can run a AC load flow with [OpenLoadFlow](../../simulation/powerflow/openlf.md) implementation.
- We can run a DC load flow with [OpenLoadFlow](../../simulation/powerflow/openlf.md) implementation. 
- We can run an AC sensitivity analysis with [OpenLoadFlow](../../simulation/sensitivity/openlf.md#ac-sensitivity-analysis) implementation, on the pre-contingency network and on the post-contingency networks.
- We can run a DC sensitivity analysis with [OpenLoadFlow](../../simulation/sensitivity/openlf.md#dc-sensitivity-analysis) implementation, on the pre-contingency network and on the post-contingency networks.
- We can run an AC post-contingency analysis with OpenLoadFlow, note that the DC security analysis based on OpenLoadFlow is not yet supported.
- We can run a compliance check of computed values to loadflow equations. 

## Getting started

- [Scripting with Python](../../developer/scripting/python.md) - A first introduction to learn how to use PyPowSyBl

## Releases

| Version | Release date | Release notes                                                              | API documentation                                             |
|---------|--------------|----------------------------------------------------------------------------|---------------------------------------------------------------|
| 0.20.0  | 2023-01-18   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.20.0) | -                                                             |
| 0.19.0  | 2022-10-26   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.19.0) | -                                                             |
| 0.18.0  | 2022-09-23   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.18.0) | [readthedocs.io](https://pypowsybl.readthedocs.io/en/stable/) |
| 0.17.0  | 2022-08-12   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.17.0) | -                                                             |
| 0.16.0  | 2022-05-31   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.16.0) | -                                                             |
| 0.15.0  | 2022-04-28   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.15.0) | -                                                             |
| 0.14.0  | 2022-03-23   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.14.0) | -                                                             |
| 0.13.0  | 2022-03-10   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.13.0) | -                                                             |
| 0.12.0  | 2022-01-19   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.12.0) | -                                                             |
| 0.11.0  | 2021-11-22   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.11.0) | -                                                             |
| 0.10.0  | 2021-10-04   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.10.0) | -                                                             |
| 0.9.0   | 2021-08-20   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.9.0)  | -                                                             |
| 0.8.0   | 2021-06-13   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.8.0)  | -                                                             |
| 0.7.0   | 2021-04-13   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.7.0)  | -                                                             |
| 0.6.0   | 2021-04-08   | [Release notes](https://github.com/powsybl/pypowsybl/releases/tag/v0.6.0)  | -                                                             |
