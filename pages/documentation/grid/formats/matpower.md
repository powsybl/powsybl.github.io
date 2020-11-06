---
layout: default
---

# Matpower

Matpower is a free and open-source Matlab toolbox for power system simulation and optimization. It is widely used 
by academics for research purposes. You will find more information on [Matpower web site](https://matpower.org/).

There is a lot of Matpower open source case available all over the internet. Most of the time those cases are provided 
as a ".m" file. This is Matlab code and only Matlab can interpret this kind of data. PowSyBl converter can only import
.mat file which is a binary serialization of Matlab case data structure created by loading a .m file. So before being 
able to import a Matpower case we have to convert it to ".mat". This can be done using Matlab of course but it is
also possible to do it using [GNU Octave](https://www.gnu.org/software/octave/). Octave is an open source scientific 
programming language which is mostly compatible which Matlab. Matpower tool box can be installed with Octave.

## Octave and Matpower installation 

Here is a link to [download and install Octave](https://www.gnu.org/software/octave/download). Once Octave has been 
installed we can [install Matpower toolbox](https://matpower.org/about/get-started/).

## Matpower case conversion

First we have to download a Matpower case like this one: [case6515rte.m](https://github.com/MATPOWER/matpower/blob/master/data/case6515rte.m).

Then have to start octave to "traditional" mode. This means in a way that has there is a maximal compatibility with 
Matlab especially on binary serialization compatibility.

```bash
octave --traditional
```

To convert the case6515rte.m to case6515rte.mat we just have to run these 2 lines of script: Notice that loadcase and savecase
are functions part of Matpower toolbox.

```matlab
mpc = loadcase('case6515rte.m');
savecase("case6515rte.mat", mpc);
```

And that's it, case6515rte.mat can be directly imported by PowSyBl. 
