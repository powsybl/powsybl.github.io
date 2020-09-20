# Reactive limits

This example shows how to use the `MinMaxReactiveLimits` and `ReactiveCapabilityCurve` classes:
```java
Generator generator = network.getGenerator("G");
if (generator.getReactiveLimits().getKind() == ReactiveLimitsKind.MIN_MAX) {
    MinMaxReactiveLimits limits = generator.getReactiveLimits(MinMaxReactiveLimits.class);
    System.out.println("MinMaxReactiveLimits: [" + limits.getMinQ() + ", " + limits.getMaxQ() + "]");
} else {
    ReactiveCapabilityCurve limits = generator.getReactiveLimits(ReactiveCapabilityCurve.class);
    System.out.println("ReactiveCapabilityCurve:");
    limits.getPoints().forEach(p -> System.out.println("\t" + p.getP() + " -> [" + p.getMinQ() + ", " + p.getMaxQ() + "]"));
}
```

This example shows how to create a new `MinMaxReactiveLimits` object:
```java
Generator generator = network.getGenerator("G");
generator.newMinMaxReactiveLimits()
    .setMinQ(-100.0)
    .setMaxQ(100.0)
    .add();
```

This example shows how to create a new `ReactiveCapabilityCurve` object:
```java
Generator generator = network.getGenerator("G");
generator.newReactiveCapabilityCurve()
    .beginPoint()
        .setP(-10)
        .setMinQ(-10)
        .setMaxQ(10)
    .endPoint()
    .beginPoint()
        .setP(0)
        .setMinQ(-20)
        .setMaxQ(20)
    .endPoint()
    .beginPoint()
        .setP(10)
        .setMinQ(-15)
        .setMaxQ(-15)
    .endPoint()
    .add();
```
