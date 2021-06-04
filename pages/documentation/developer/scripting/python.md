---
layout: default
---

# Python scripting <img src="./img/python-logo.png" alt="" style="vertical-align: bottom" height="40"/>

The PyPowSyBl project gives access to PowSyBl framework to Python developers. This Python integration relies on GraalVM to compile Java code to a native library.

Please see below a short documentation of how to script in Python using PyPowSyBl, but please rely our up-to-date and automatic [PyPowSyBl’s user documentation](https://pypowsybl.readthedocs.io/en/latest/index.html) if you want to got deeper.

# Features

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
- We can run a DC sensitivity analysis with [OpenLoadFlow](../../simulation/sensitivity/openlf.md#dc-sensitivity-analysis) implementation, on the pre-contingency network and on the post-contingency networks ;
- We can run an AC post-contingency analysis with OpenLoadFlow, note that the DC security analysis based on OpenLoadFlow is not yet supported.

## Example
```python
import pypowsybl as pp

# Load a case file
n = pp.network.create_ieee14()
results = pp.loadflow.run_ac(n)
for result in results:
    print(result)

# Run a power flow with OpenLF implementation
parameters = pp.loadflow.Parameters(distributed_slack=False)
results = pp.loadflow.run_ac(n, parameters)

# Print the network
df = n.create_buses_data_frame()
print(df)

# Save the network
n.dump('result.xiidm', 'XIIDM')
```
