---
title: SecurityAnalysisImpl
layout: default
---

The `com.powsybl.security.SecurityAnalysisImpl` class is an implementation of the `com.powsybl.security.SecurityAnalysis`
interface that detects security violations by running load-flows after applying each contingency. This implementation can be very
slow if the contingency list contains a lot of contingencies, thus triggering a lot of load-flow computations, but it has the advantages of only requiring a `com.powsybl.loadflow.LoadFlow`. The default loadflow implementation is used, see [loadFlow](../configuration/modules/loadflow.md) for details about how default implementation is determined.

# Configuration
In order to use the `SecurityAnalysisImpl` implementation, set the following properties of the [componentDefaultConfig](../configuration/modules/componentDefaultConfig.md)
module:
- `SecurityAnalysisFactory` to `com.powsybl.security.SecurityAnalysisImpl`
- `ContingenciesProviderFactory` to `com.powsybl.action.dsl.GroovyDslContingenciesProviderFactory`

**Note**: Powsybl provides no implementation of the LoadFlow API except the `com.powsybl.loadflow.mock.LoadFlowMock` that
does nothing.

Read this [documentation](../contingencies/index.md) page to learn more about the configuration of the contingency list.

Read this [documentation](../configuration/parameters/SecurityAnalysisParameters.md) page to learn more about
security analysis parameters file.
