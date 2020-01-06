---
title: Technical documentation
category: Technical documentation
---

# Architecture

## Micro-services architecture

Here is an overview of PowSyBl micro-services architecture and corresponding repositories:

<object type="image/svg+xml" data="./architecture/images/micro-services-architecture.svg" >
</object>

### Case server

This service is responsible from raw network data storage. It relies on a file system to store its data and allows uploading and fetching network for any format supported by PowSyBl (CGMES, UCTE, XIIDM, etc).

### Network store server

Almost all of the feature developed in PowSyBl relies on IIDM API for accessing network data, the idea of the service is to re-implement the IIDM API to be better integrated in a micro-services typical architecture. Instead of an in-memory implementation like in PowSyBl core repository, this implementation is backed by a Cassandra database. Network model is stored in the database in a detailed way (one table per equipment), so that we can query only the amount of needed data and ensure a good performance for a simple switch position change (few data), a single line diagram rendering (substation wide data) or a loadflow run (network wide data). Network data should only be accessed from this REST Web service using the provided Java client (the one which implement IIDM API) and never directly from the REST interface.

### Geographical data server

Substations and lines path positions can be stored and queried using this geographical data server. A Cassandra database is used to store the data. Data can be indexed by countries and nominal voltages. This Web service is typically used to display a network on a map.

### Network conversion server

This Web service is responsible for the connection between a case server and a network store server. It allows converting a case whatever the format it is stored to an IIDM network in the network store server.

### CGMES geographical data import server

CGMES-GL profile contains substations and lines geographical position. This Web service can take a CGMES containing GL profile from a case server and upload its content to the geographical data server.

### Single line diagram server

Using an IIDM network from a network store server, we can, thanks to this Web service, generate a voltage level single line diagram (in SVG) from a given voltage level.

### Network map server

This Web service is used to extract network data from a network store server and reshape the data to feed a UI network map component. 

### Network modification server

This is a high level network modification service. Thanks to this Web service, we can apply a list of predefined network modifications (switch position, setpoint, tap position, etc) or we can also execute a Groovy script if we need a more generic and powerful way to modify the network.

### Loadflow server

Load flow server is able to run a load flow on a network from a network store server and update state variables.

### Study server

This is the unique entry point for the front end. This Web service is responsible for study management (creation, opening, removal) and also exposes all operations from other web services needed for the front end. 

### Study front-end

Study tool front end developped in React.js.

