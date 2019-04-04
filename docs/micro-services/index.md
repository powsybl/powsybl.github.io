---
title: Micro-services
layout: default
---

# Getting started with micro-services

Micro-services are implemented using [Spring Boot](https://spring.io/projects/spring-boot) and [Spring Cloud](https://spring.io/projects/spring-cloud), packaged as [Docker](https://www.docker.com/) images using [JIB Maven plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin).

## Building docker images

Clone and install powsybl-core snapshots:
```bash
git clone https://github.com/powsybl/powsybl-core.git
cd powsybl-core
mvn install
```

Clone the git repository.

```bash
git clone https://github.com/powsybl/powsybl-spring.git
```

Compile and build the docker images.

```bash
mvn -Pdocker install
```

The Docker images should be available in your local registry.

```bash
$ docker images
powsybl/powsybl-server-discovery                 1.0.0-SNAPSHOT                   b4aa78912a87        49 years ago        163.7 MB
powsybl/powsybl-server-discovery                 latest                           b4aa78912a87        49 years ago        163.7 MB
powsybl/powsybl-server-storage                   1.0.0-SNAPSHOT                   5d5dfdc64985        49 years ago        170.9 MB
powsybl/powsybl-server-storage                   latest                           5d5dfdc64985        49 years ago        170.9 MB
powsybl/powsybl-server-config                    1.0.0-SNAPSHOT                   33056b76b8a1        49 years ago        145.8 MB
powsybl/powsybl-server-config                    latest                           33056b76b8a1        49 years ago        145.8 MB
powsybl/powsybl-server-network                   1.0.0-SNAPSHOT                   c6d5501e3af9        49 years ago        188.1 MB
powsybl/powsybl-server-network                   latest                           c6d5501e3af9        49 years ago        188.1 MB
```

Four services have been built:
 - The Config service. It centralizes configuration of all other services. It is implemented using [Spring Cloud Config](https://spring.io/projects/spring-cloud-config).
 - The Discovery service. It is a service registry. It is implemented using [Netflix Eureka](https://github.com/Netflix/eureka).
 - The Storage service. It is a low-level web service responsible for file system like data storage.
 - The Network service. It holds the main API that allows querying network data and relies on the Storage service.

## Services configuration

### AFS configuration

Create `$HOME/.itools/config.yml` and add the following configuration to add a MapDB storage drive named 'test' (for more documentation on this configuration, please visit the [MapDB storage](../afs/afs-mapdb.md) page):

```yaml
mapdb-app-file-system:
        drive-name: test
        db-file: /storage/db
        remotely-accessible: true
```

This file will be shared with the Storage service container.

Create the `$HOME/storage` directory. This directory will also be shared with the Storage service container and contains the MapDB data.

### Spring config service configuration

Create the `$HOME/config` directory and copy all the Spring Boot service configuration files.

```bash
mkdir $HOME/config
cp powsybl-spring/config/* $HOME/config/
```

## Starting containers

To start docker containers using docker compose:

```bash
docker-compose up
```

## Getting Swagger documentation

Storage and Network services are documented using [Swagger](https://swagger.io/) and are available once the containers have started (replace localhost with the docker host IP if you are using a remote docker host)
 - [Storage service documentation](http://localhost:8090/swagger-ui.html)
 - [Network service documentation](http://localhost:8091/swagger-ui.html)
