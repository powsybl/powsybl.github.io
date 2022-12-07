#SVG writing

## Single-line diagram

These examples show how to write a single-line diagram into an SVG file.

* Generate a single-line diagram for the voltage level `N` of the network `network`

```java
SingleLineDiagram.draw(network, "N", "/tmp/n.svg");
```

* Generate a single-line diagram for the substation `A` of the network `network`, with customized `LayoutParameters`

```java
LayoutParameters layoutParametersSld = new LayoutParameters().setUseName(true);
SingleLineDiagram.draw(network, "A", "/tmp/a.svg", layoutParametersSld);
```

## Network-area diagram

These examples show how to write a network-area diagram into an SVG file.

* Generate a network-area diagram for the network `network`

```java
new NetworkAreaDiagram(network).draw(Path.of("/tmp/diagram.svg"));
```

* Generate a network-area diagram for the network `network`, with customized `SvgParameters` and `LayoutParameters`

```java
SvgParameters svgParameters = new SvgParameters().setFixedHeight(1000);
LayoutParameters layoutParametersNad = new LayoutParameters().setSpringRepulsionFactorForceLayout(0.2);
new NetworkAreaDiagram(network).draw(Path.of("/tmp/diagram2.svg"), svgParameters, layoutParametersNad);
```
