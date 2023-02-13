This document aims to list the expected contributions for the website and propose potential writers (people or project).

**Guidelines:**  
- When someone asks a question to the community, send a link to the website. If the documentation is not ready yet, write the missing page instead of answering by email, even if it's not complete.
- When you write a new page, try to follow the plan used in the existing pages (specially for tutorials)
- Try to write functional pages understandable by everyone (avoid the references to the Java code) and document the code in the dedicated sections.

# General subjects
- Cosmetic:
    - Propose a better icon set for the features listed in the home page
    - Propose a better icon set for the documentation index.

# Home page
- Projects list
    - Write the presentation page of GridSuite (Geoffroy, Michaël, Christine)
    - Write the presentation page of Safe-T (Michaël, Mathieu, MHP)

# Overview
- Update the roadmap (Lucian, Anne)

# Documentation
- User documentation
    - remove the references to the java classes in the module configuration pages. Try to integrate this information in the functional pages (simulators, import/export...)
    - Write more user stories:
        - About forecast security-analysis (Sylvain, Anne)
        - About the merging (core-merging, GridSuite)
        - About network extraction (Mathieu, Stéphane F., Benjamin D., Antoine M.)
        - About long term planning studies (Paul B., Anne)
- Grid model
    - Explain the topology (Mathieu)
    - Connected/Synchronous components (Mathieu)
    - Add sketches (Florian)
    - IIDM Extensions (Miora)
    - Shunts (Miora)
    - Dangling Lines (Anne)
    - Merging (core-merging, GridSuite, and Silicom for the merging view)
- Grid formats
    - CGMES (AIA, Anne, Miora)
    - UCTE (Sébastien M, core-merging)
    - MatPower (TechRain)
    - IEEE (Geoffroy)
    - PSS/E (Geoffroy, Jean-Baptiste, AIA)
    - AMPL (Ringo)
- Simulators
    - Power Flow
        - OpenLF implementation
        - DynaFlow implementation
    - Security analysis (Sylvain, Anne, Geoffroy, Florian)
        - Slow implementation
        - OpenLF implementation
    - Sensitivity analysis
    - Dynawo (AIA, Mathieu, Agnès, Dynawo)
- HPC
    - Slurm (Sylvain, Yichen)
    - MPI (Geoffroy, Paul B.)
- Data management
    - AFS (Paul)
    - TimeSeries (AIA, Thomas)
- Microservices
    - Architecture (GridSuite)
    - Document each micro-service to explain its purpose and how it works (GridSuite)
- Developer documentation
    - Repositories: maintain the list and versions up-to-date. Add a description for all repositories (All)
    - Artifacts: maintain the list up-to-date (All)
    - Patterns
        - Define which patterns may have to be explained (configuration, simulation runner, importer, exporter, extensions, computation management, variants...)
        - Explain how to write a new importer (TechRain, AIA)
        - Explain how to write a new exporter (TechRain, AIA)
    - API Guide: explain how to use a specific API (Single line diagram, time series...)
    - Tutorials
        - Create a network from scratch based on FourSubstationsNodeBreakerFactory (Agnès)
        - How to create a new IIDM extension
        - How to play with the network topology
        - How to write a basic CSV importer/exporter

# Download
- Update the powsybl-distribution each time a new version is released and maintain the download link up-to-date

# Community
- Events: list the events to which PowSyBl participate (Lucian, Anne, Boris)
