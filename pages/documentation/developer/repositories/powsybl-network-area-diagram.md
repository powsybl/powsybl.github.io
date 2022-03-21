# powsybl-network-area-diagram [![GitHub release](https://img.shields.io/github/release/powsybl/powsybl-network-area-diagram.svg?sort=semver)](https://github.com/powsybl/powsybl-network-area-diagram/releases/)
This [repository](https://github.com/powsybl/powsybl-network-area-diagram) provides modules to generate diagrams of a network area.

![nad-example](./img/powsybl-network-area-diagram/diagram-example.png){: width="35%" .center-image}

## Features
- Generate concise diagrams displaying the graph whose nodes are the network voltage levels, and whose edges are the lines and transformers between those voltage levels. 
- Generate diagrams of the whole network or of a part of the network, given a voltage level and a depth, or a list of voltage levels and a (unique) depth.
- Graph layout default implementation using a basic force layout algorithm, taken from [springy](https://github.com/dhotson/springy)
- Diagrams customization:
     - use your own graph layout implementation,
     - use your own label provider to display custom directed values on the graph edges (default label provider displays the active power),
     - use your own style provider to have a custom style for nodes and edges (default style provider gives the nodes and edges a class corresponding to their voltage level, and give disconnected lines a specific class),
     - use custom layout parameters and svg rendering parameters.

## Getting started

- [Guide 1]() - TODO


## Releases

| Version | Release date | Release notes | API documentation |
| ------- | ------------ | ------------- | ----------------- |
| 0.3.0 | 2022-03-02 | [Release notes](https://github.com/powsybl/powsybl-network-area-diagram/releases/tag/v0.3.0) | [Javadoc](https://javadoc.io/doc/com.powsybl/powsybl-network-area-diagram/0.3.0/index.html) |
| 0.2.0 | 2022-01-17 | [Release notes](https://github.com/powsybl/powsybl-network-area-diagram/releases/tag/v0.2.0) | [Javadoc](https://javadoc.io/doc/com.powsybl/powsybl-network-area-diagram/0.2.0/index.html) |
| 0.1.0 | 2021-12-03 | [Release notes](https://github.com/powsybl/powsybl-network-area-diagram/releases/tag/v0.1.0) | [Javadoc](https://javadoc.io/doc/com.powsybl/powsybl-network-area-diagram/0.1.0/index.html) |
