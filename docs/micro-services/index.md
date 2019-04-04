---
title: Micro-services
layout: default
---

# Getting started  with micro-services

Micro-services are implemented using [Spring Boot](https://spring.io/projects/spring-boot) and [Spring Cloud](https://spring.io/projects/spring-cloud), packaged as [Docker](https://www.docker.com/) images using [JIB Maven plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin).

## Building docker images

Clone git repository.

```bash
git clone https://github.com/powsybl/powsybl-spring.git
```

Compile and build docker images.

```bash
mvn -Pdocker install
```

Docker images should be available in your local registry.

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
 - Config service which is responsible for centralizing configuration of all others services. It is implemented using [Spring Cloud Config](https://spring.io/projects/spring-cloud-config).
 - Discovery service which is responsible for service registry. It is implemented using [Netflix Eureka](https://github.com/Netflix/eureka).
 - Storage service, is a low level web service responsible for file system like data storage.
 - Network service rely on Storage service and allow network data query.

## Services configuration

### AFS configuration

Create `$HOME/.itools/config.yml` and add following configuration to add MapDB storage named 'test':

```yaml
mapdb-app-file-system:
        drive-name: test
        db-file: /storage/db
        remotely-accessible: true
```

This file is be shared with server storage container.

Create `$HOME/storage` directory. This directory is also be shared with server storage container and contains MapDB data.

### Spring config service configuration

Create `$HOME/config` directory and copy all Spring Boot service configuration files.

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

Storage and Network services are documented using [Swagger](https://swagger.io/) and are available once container have been started (replace localhost with the docker host IP if you are using a remote docker host)
 - [Storage service documentation](http://localhost:8090/swagger-ui.html)
 - [Network service documentation](http://localhost:8091/swagger-ui.html)
