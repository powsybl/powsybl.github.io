---
title: Importers
layout: default
---

The `com.powsybl.iidm.import_.Importer` class is used to create a IIDM network instance from a case. Powsybl supports
natively several implementations:
- [IIDM](iidm.md)
- [CGMES](cgmes.md)
- [UCTE-DEF](ucte.md)

After a network is imported, the [post processors](post-processor/index.md) provides a mechanism that allows to
perform operation on it.

Read the [tutorial](../../tutorials/iidm/importer.md) to learn how to write an IIDM importer.
