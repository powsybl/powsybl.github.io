---
title: GroovyDslContingenciesProvider
layout: default
---

The `com.powsybl.action.dsl.GroovyDslContingenciesProvider` is an implementation of the
[ContingenciesProvider](index.md#ContingenciesProvider) interface that loads a list of contingencies from a groovy script.

# Syntax

## N-1 contingency
This list contains one contingency.
```groovy
contingency('contingency-id') {
    equipments 'equipment-id'
}
```

## N-k contingency
This list contains one contingency on both "equipment1" and "equipment2".
```groovy
contingency('contingency-id') {
    equipments 'equipment1-id', 'equipement2-id'
}
```

## Manual contingency list
This list contains two contingencies. The first one on "equipment1" and the second one on "equipment2".

```groovy
contingency('contingency1-id') {
    equipments 'equipment1-id'
}

contingency('contingency2-id') {
    equipments 'equipment2-id'
}
```

## Automatic contingency list

The DSL part only covers the code described above (the "contingency" part). In the examples below, the DSL part is
wrapped in Groovy code in order to perform more complex tasks.  In order to adapt these examples, it may be necessary to
read the JavaDoc or the Java code for the [IIDM](../iidm/model/index.md) itself. 

The following example create a list of contingencies with only tie lines:
```groovy
import com.powsybl.iidm.network.Country

for (l in network.lines) {
    s1 = l.terminal1.voltageLevel.substation
    s2 = l.terminal2.voltageLevel.substation
    if (s1.country != s2.country) {
        contingency(l.id) {
            equipments l.id
        }
    }
}
```

The following example creates a list of contingencies with only 380 kV lines:
```groovy
for (l in network.lines) {
    s1 = l.terminal1.voltageLevel
    s2 = l.terminal2.voltageLevel
    if (s1.nominalV == 380 || s2.nominalV == 380) {
        contingency(l.id) {
            equipments l.id
        }
    }
}
```

The following example creates a list of contingencies with the 3 first 225 kV lines in France, using the Stream API.  
```groovy
import com.powsybl.iidm.network.Country

network.lineStream
    .filter({l -> l.terminal1.voltageLevel.substation.country == Country.FR})
    .filter({l -> l.terminal2.voltageLevel.substation.country == Country.FR})
    .filter({l -> l.terminal1.voltageLevel.nominalV == 225.0})
    .filter({l -> l.terminal2.voltageLevel.nominalV == 225.0})
    .limit(3)
    .sorted({l1,l2 -> l1.id.compareTo(l2.id)})
    .forEach({l ->
        contingency(l.id) {
            equipments l.id
        }
    })
```

The following example creates a list of contingencies with the 3 first French nuclear generators with a maximum power
superior to 1000 MW.
```groovy
import com.powsybl.iidm.network.Country
import com.powsybl.iidm.network.EnergySource

network.generatorStream
    .filter({g -> g.terminal.voltageLevel.substation.country == Country.FR})
    .filter({g -> g.energySource == EnergySource.NUCLEAR})
    .filter({g -> g.maxP > 1000})
    .limit(3)
    .sorted({g1,g2 -> g1.id.compareTo(g2.id)})
    .forEach({g ->
        contingency(g.id) {
            equipments g.id
        }
    })
```

# Configuration
To use the `GroovyDslContingenciesProvider`, configure the `ContingenciesProviderFactory` property of the
[componentDefaultConfig](../configuration/modules/componentDefaultConfig.md) module and configure the 
[groovy-dsl-contingencies](../configuration/modules/groovy-dsl-contingencies.md) module.

### YAML
```yaml
componentDefaultConfig:
    ContingenciesProviderFactory: com.powsybl.action.dsl.GroovyDslContingenciesProviderFactory
    
groovy-dsl-contingencies:
    dsl-file: /home/user/contingencies.groovy
```

### XML
```xml
<componentDefaultConfig>
    <ContingenciesProviderFactory>com.powsybl.action.dsl.GroovyDslContingenciesProviderFactory</ContingenciesProviderFactory>
</componentDefaultConfig>

<groovy-dsl-contingencies>
    <dsl-file>/home/user/contingencies.groovy</dsl-file>
</groovy-dsl-contingencies>
```

## Maven configuration
To use the `GroovyDslContingenciesProvider`, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-action-dsl</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```
