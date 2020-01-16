---
title: Technical documentation
category: Technical documentation
---

# Architecture

## Micro-services architecture

Here is an overview of PowSyBl's microservice architecture and corresponding repositories:

<object type="image/svg+xml" data="./architecture/images/micro-services-architecture.svg" >
</object>

### Case server

This service is responsible for raw network data storage. It relies on a file system to store its data and allows uploading and fetching networks in any format supported by PowSyBl (CGMES, UCTE, XIIDM, etc).

### Network store server

Almost all the features developed in PowSyBl rely on the IIDM API for accessing network data. The idea of this service is to re-implement the IIDM API to be better integrated in a typical microservice architecture. Instead of an in-memory implementation like in the PowSyBl core repository, this implementation is backed by a Cassandra database. The network model is stored in the database in a structured way (one table per equipment type and with indexes), so that we can query only the needed data and ensure good performance for common operations. Examples of common operations are a simple switch position change (only a few values), a single line diagram rendering (substation wide data) or a loadflow run (network wide data). The REST interface exposed by this service is very low-level for performance reasons. In particular, the write operations do not prevent inconsistent modifications. Therefore, network data should usually be accessed from this service using the provided Java client (the one which implements the IIDM API) and not directly from the REST interface because the java client is safe and prevents inconsistent modifications.

### Geographical data server

Substations and line paths positions can be stored and queried using this geographical data server. A Cassandra database is used to store the data. Data can be indexed by countries and nominal voltages. This service is typically used to display a network on a map. This service abstracts away the different sources of geographical data.

### Network conversion server

This service can convert a network stored in a case server to an IIDM network stored in the network store server.

### CGMES geographical data import server

The CGMES-GL profile contains substations and lines geographical positions. This service can take a CGMES network containing a GL profile from a case server and upload its content to the geographical data server.

### Single line diagram server

This service can generate a voltage level single line diagram (in SVG) for a given voltage level in an IIDM network from a network store server.

### Network map server

This service is used to extract network data from a network store server and reshape the data to feed a UI network map component.

### Network modification server

This is a high level network modification service. It can apply a list of predefined network modifications (switch position, setpoint, tap position, etc) or execute a Groovy script when a more generic and powerful way to modify the network is needed.

### Loadflow server

The load flow server is able to run a load flow on a network from a network store server and update the state variables.

### Study server

This is the unique entry point for the front end. This service is responsible for study management (creation, opening, removal) and also exposes all operations from other services needed for the front end.

### Study front-end

Study tool front end developped in React.js.

