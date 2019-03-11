---
title: Line
layout: default
---

The `com.powsybl.iidm.network.Line` interface is used to model an AC line. A line can also be a [TieLine](tieLine.md).

# Characteristics

| Attribute | Type | Unit | Required | Default value | Description |
| --------- | ---- | ---- | -------- | ------------- | ----------- |
| id | string | - | yes | - | Unique identifier of the line|
| name | string | - | no | "" | Humanly readable name of the line|
| $$r$$ | double | $$\Omega\$$ | yes | - | The series resistance |
| $$x$$ | double | $$\Omega\$$ | yes | - | The series reactance |
| $$g_1$$ | double | S | yes | - | The first side shunt conductance |
| $$b_1$$ | double | S | yes | - | The first side shunt susceptance |
| $$g_2$$ | double | S | yes | - | The second side shunt conductance |
| $$b_2$$ | double | S | yes | - | The second side shunt susceptance |

Lines can also have [current limits](currentLimits.md) defined for each end.

# Model
Power lines are modelled using a standard $$\pi$$ model with distributed parameters.

![Power line model](./images/line-model.svg){: width="50%" .center-image}

With series impedance $$z$$ and the shunt admittance on each side $$y_1$$ and $$y_2$$:

$$
\begin{align*}
    & z=r+j.x\\
    & y_1 = g_1 +j. b_1\\
    & y_2 = g_2 +j. b_2
\end{align*}
$$

the equations of the power line, in complex notations, are as follow:

$$
\begin{align*}
    & \left(\begin{array}{c}
    I_{1}\\
    I_{2}
    \end{array}\right)=\left(\begin{array}{cc}
    y_{1}+\frac{1}{z} & -\frac{1}{z}\\
    -\frac{1}{z} & y_{2}+\frac{1}{z}
    \end{array}\right)\left(\begin{array}{c}
    V_{1}\\
    V_{2}
    \end{array}\right)
\end{align*}
$$

# Examples
This example shows how to create a new line in the network:
```java
Line line = network.newLine()
    .setId("L")
    .setName("My line")
    .setVoltageLevel1("VL1")
    .setVoltageLevel2("VL2")
    .setNode1(1)
    .setNode2(2)
    .setR(4.0)
    .setX(200.0)
    .setG1(0.0)
    .setB1(0.0)
    .setG2(0.0)
    .setB2(0.0)
    .add();
```
