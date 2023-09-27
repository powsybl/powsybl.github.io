#SVG writing

## Single-line diagram

These examples show how to write a single-line diagram into an SVG file.

* Generate a single-line diagram for the voltage level `N` of the network `network`

```java
SingleLineDiagram.draw(network, "N", "/tmp/n.svg");
```

* Generate a single-line diagram for the substation `A` of the network `network`, with customized `SvgParameters`

```java
SldParameters sldParameters = new SldParameters().setSvgParameters(new SvgParameters().setUseName(true));
SingleLineDiagram.draw(network, "A", Paths.get("/tmp/a.svg"), sldParameters);
```

## Network-area diagram

These examples show how to write a network-area diagram into an SVG file.

* Generate a network-area diagram for the network `network`

```java
NetworkAreaDiagram.draw(network, Path.of("/tmp/diagram.svg"));
```

* Generate a network-area diagram for the network `network`, with customized `SvgParameters` and `LayoutParameters`

```java
SvgParameters svgParameters = new SvgParameters().setFixedHeight(1000);
LayoutParameters layoutParameters = new LayoutParameters().setSpringRepulsionFactorForceLayout(0.2);
NadParameters nadParameters = new NadParameters().setSvgParameters(svgParameters).setLayoutParameters(layoutParameters);
NetworkAreaDiagram.draw(network, Path.of("/tmp/diagram2.svg"), nadParameters, VoltageLevelFilter.NO_FILTER);
```
