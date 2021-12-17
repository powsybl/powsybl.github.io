# powsybl-network-store
The PowSyBl Network store [repository](https://github.com/powsybl/powsybl-network-store) provides a persistent IIDM implementation, that is exposed as a web service. Almost all the features developed in PowSyBl rely on the IIDM API for accessing network data. The idea of this service is to re-implement the IIDM API for a better integration in a 
typical microservice architecture. Instead of an in-memory implementation like in the PowSyBl core repository, this implementation is backed by a Cassandra database. The network model is stored in the database in a structured way 
(one table per equipment type and with indexes), so that we can query only the needed data and ensure good performance for common operations. Examples of common operations are a simple switch position change (only a few values), a single line diagram rendering (substation wide data) or a loadflow run (network wide data). The REST interface exposed by this service is very low-level for performance reasons. In particular, the write operations do not prevent inconsistent modifications. Therefore, network data should usually be accessed from this service using the provided Java client (the one which implements the IIDM API) and not directly from the REST interface because the Java client is safe and prevents inconsistent modifications.

## Features

- a persistent IIDM implementation in a Cassandra database

## Getting started

- [Guide 1]() - TODO

## Releases

| Version | Release date | Release notes | API documentation |
| ------- | ------------ | ------------- | ----------------- |
| TODO | TODO | TODO | TODO |

