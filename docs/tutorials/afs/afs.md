---
title: How to use AFS
layout: default
---


In this tutorial you'll learn how to use AFS APIs, in a java application and in a groovy script then you'll learn how to
use a remote AFS server.

# Using AFS in your java application

In order to use AFS in your application, you will first need to add some dependencies to your project:
 - `powsybl-afs-core` to use the core API in your code
 - an implementation ([local](../../afs/afs-local.md), [remote](../../afs/afs-remote.md), [MapDB](../../afs/afs-mapdb.md))
 - basic file types defined as extensions of the core: `powsybl-afs-ext-base`
 
For instance, if you use maven, in the dependencies section:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-afs-core</artifactId>
    <version>${powsybl.version}</version>
</dependency>
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-afs-ext-base</artifactId>
    <version>${powsybl.version}</version>
</dependency>
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-afs-mapdb</artifactId>
    <version>${powsybl.version}</version>
    <scope>runtime</scope>
</dependency>
```

Beside your previous maven dependencies you have to add an IIDM implementation, if not, you'll get the following exception: 
```
com.powsybl.commons.PowsyblException: No IIDM implementation found
```

To resolve this problem, add the following dependency to your `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-iidm-impl</artifactId>
    <version>${powsybl.version}</version>
    <scope>runtime</scope>
</dependency>
```

Note: 
By default, PowSyBl will load the drives defined in your [configuration](../../configuration/modules/index.md) file. To
configure an new MapDB drive, add the following lines in your configuration file:

**YAML**
```yml
mapdb-app-file-system:
    drive-name : my-first-fs
    db-file : /path/to/my/mapdb/file
```

**XML**
```xml
<mapdb-app-file-system>
    <drive-name>my-first-fs</drive-name>
    <db-file>/path/to/my/mapdb/file</db-file>
</mapdb-app-file-system>
```

Read this [page](../../configuration/modules/mapdb-app-file-system.md) to learn more about the configuration of MapDB
drives.

Here, we have defined a MapDB drive, named `my-first-fs`. The data will be stored in the file `/path/to/my/mapdb/file`.

Now, from your application, you will be able to interact with that file system. For example, you can create directories
and projects:
```java
// Build an instance of AppData
ComputationManager c = LocalComputationManager.getDefault(); // Do not pay attention to this part
AppData appData = new AppData(c, c);

// Get your file system
AppFileSystem myFirstFs = appData.getFileSystem("my-first-fs");

// Create a new folder at the root of you file system, and a new project in that folder.
Project myFirstProject = myFirstFs.getRootFolder()
         .createFolder("my-first-folder")
         .createProject("my-first-project");
```

Everything that we have just created will be persisted to your MapDB file. Your file system tree now looks like:
```
my-first-fs
  +-- my-first-folder
    +--my-first-project
```

# Using AFS from groovy scripts

Your configured AFS is also accessible from groovy. This comes in 2 flavours, either with an interactive console using
the powsybl shell `powsyblsh`:
```bash
powsyblsh
groovy:000> :register com.powsybl.scripting.groovy.Initpowsybl
groovy:000> :init_powsybl
groovy:000> import com.powsybl.contingency.*
groovy:000>
```

or using the `itools` command to execute a groovy script:
```bash
$> itools run-script --file my_script.groovy
```

From groovy code, PowSyBl provides a variable called `afs` which exposes base methods to access configured file systems.
You can then simply perform the same thing as in the java section this way:
```groovy
// Create a new folder at the root of you file system, and a new project in that folder.
myFirstProject = afs.getRootFolder("my-first-fs")
                    .createFolder("my-first-folder")
                    .createProject("my-first-project");
```


# Using business objects

All this is fine, but the primary goal of AFS is to manage your **business objects**, which we have not seen so far.

AFS is fully extendable with your own type of files, but it already comes with a few basic types for grid studies. The
most basic one may be the `ImportedCase` type, which expose a `Network` object to the API.

Such files may only be created inside a project. Projects may be seen as a kind of workspace for a particular study or
computation. Inside of a project, we can import a case from a file representing a network, for example a
[XIIDM](../../iidm/importer/iidm.md) file or a [UCTE](../../iidm/importer/ucte.md) file.

**Java**
```java
ImportedCase myImportedCase = myFirstProject.getRootFolder()
              .fileBuilder(ImportedCaseBuilder.class)
              .withName("my-imported-case")
              .withFile(Paths.get("path/to/network.xiidm"))
              .build();
```

**Groovy**
Groovy provides a nice and simplified syntax:
```groovy
myImportedCase = myFirstProject.getRootFolder().buildImportedCase {
    name "my-imported-case"
    file Paths.get("path/to/network.xiidm")
}
```

Now our tree looks like:
```
my-first-fs
  +-- my-first-folder
    +-- my-first-project
      +-- "my-imported-case"
```

You can then use the methods exposed by your imported case to carry out some business related logic:

```java
// use stored network
Network network = myImportedCase.getNetwork();

// Carry out some computations ...
...

// Query stored network to get all substations names
System.out.println(myImportedCase.queryNetwork(ScriptType.GROOVY, "network.substationStream.map {it.name} collect()"))
```

Of course, you can later retrieve your imported case from another execution or from another application, once it has been
persisted to the underlying storage:
```java
// From another application:
ImportedCase importedCase = appData.getFileSystem("my-first-fs")
                                   .getRootFolder()
                                   .getChild(Project.class, "my-first-folder/my-first-project").get()
                                   .getRootFolder().getChild("my-imported-case")
                                   .orElseThrow(() -> new RuntimeException("Not found"));

Network network = myImportedCase.getNetwork();
// Do some stuff with network
...
```

To delete importCase file from the project  you have to just call the delete method:
```java
importCase.delete();
```

# Using a remote file system

Powsybl provides a special implementation of application file system storage which forwards calls, through a REST API,
to a remote AFS server. The server may use any storage implementation itself, for example the MapDB implementation. That
feature makes it easy to store data on a remote server.

Read this documentation [page](../../afs/afs-remote.md) to learn more about remote implementation.

In order to use it you will need to:
- package in a war and deploy `powsybl-afs-ws-server` in a JEE server, like Wildfly
- configure the AFS drives to allow remote access, by setting the optional `remotely-accessible` property to `true`
 ```yml
mapdb-app-file-system:
    drive-name : my-first-fs
    db-file : /path/to/my/mapdb/file
    remotely-accessible: true
 ```
- add `powsybl-afs-ws-client` to the runtime dependencies of your client application
- configure in the PowSyBl configuration of your application the following rest file system:
```yml
remote-service:
    host-name: my-afs-server
    app-name: my-server-app
    port: 8080
    secure: false
```
For more information, see the documentation of the [remove-service](../../configuration/modules/remote-service.md) module.

Now all file systems defined in the server configurations will be transparently accessible from your client application,
without changing any of your code!

This allows for great flexibility in the deployment of your application, for instance to run the same application as
standalone or client/server.
