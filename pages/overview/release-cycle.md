---
layout: default
---

# Release Cycle

A new release train of the framework occurs roughly every 6 to 8 weeks.

In case of structural issues, corrective releases can also be published for some repositories.
These corrective releases are motivated by users' demand so don't hesitate to [contact us](../community/index.md#contact).

There is also always a possibility to release a module outside this agenda if necessary,
please [contact us](../community/index.md#contact) for further discussion.

A few weeks before the release train, one or two release candidates of [powsybl-core](https://github.com/powsybl/powsybl-core) are
usually published and available for testing and migration of dependent repositories.

Our release train consists in the release of:
- [powsybl-core and its sub-modules](https://github.com/powsybl/powsybl-core)
- [powsybl-open-loadflow](https://github.com/powsybl/powsybl-open-loadflow)
- [powsybl-single-line-diagram and its sub-modules](https://github.com/powsybl/powsybl-single-line-diagram)
- [powsybl-network-area-diagram](https://github.com/powsybl/powsybl-network-area-diagram)
- [powsybl-dynawo and its sub-modules](https://github.com/powsybl/powsybl-dynawo)
- [pypowsybl](https://github.com/powsybl/pypowsybl)

**At users' request**, these modules can also be released in the release train:
- [powsybl-balances-adjustment](https://github.com/powsybl/powsybl-balances-adjustment)
- [powsybl-entsoe and its sub-modules](https://github.com/powsybl/powsybl-entsoe)

For each released repository:
- a release note is written by one of the repository's committer
- in case of breaking changes, a migration guide is written by one or several of the repository's developers
- a communication on the LFE mailing list [powsybl-announce](https://lists.lfenergy.org/g/powsybl-announce/)
is done by one of the repository's committers.
- its latest version is updated in [powsybl-starter](https://github.com/powsybl/powsybl-starter) and on the [repositories' pages](../documentation/developer/repositories/index.md)
- its latest version is updated in [powsybl-distribution](https://github.com/powsybl/powsybl-distribution)

If at some point, you are interested in the release of one of our other repositories,
don't hesitate to [contact us](../community/index.md#contact) to discuss it. We ensure the release of our most
used components but this check list can evolve as users' demand does.

You can also participate in our [TSC meetings](https://lists.lfenergy.org/g/powsybl-tsc/) for your voice to be heard.
