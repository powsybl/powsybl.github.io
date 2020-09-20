---
layout: default
---

# AFS

<span style="color: red">TODO</span>

* TOC
{:toc}

## Storage
AFS provides an API for the data storage that must be implemented to support a new way to store data. PowSyBl provides three implementation of that API.

### Local storage
This implementation exposes a folder of the local hard-drive in read-only. It's used to import/export data from the user computer to AFS.

#### Configuration
In order to access to the local drive, you have to configure the [local-app-file-system](../user/configuration/local-app-file-system.md) module in the configuration file. A local AFS drive has a name and a path to a folder. 

**YAML configuration**
```yaml
local-app-file-system:
    drive-name: my-local-drive
    root-dir: /home/user/drive
```

### MapDB storage
This implementation relies on [MapDB](http://www.mapdb.org/) database. This is a simple but functional implementation used for prototyping or standalone applications. Note that this implementation cannot been shared between several application.

#### Configuration
In order to access to a MapDB drive, you have to configure the [mapdb-app-file-system](../user/configuration/mapdb-app-file-system.md) module in the configuration file. A MapDB drive has a name and a path to a MapDB file, where the data will be stored.

**YAML configuration**
```yaml
mapdb-app-file-system:
    drive-name: drive1
    db-file: /home/user/drive1.db
```

### Cassandra storage
<span style="color: red">TODO</span>

### Remote storage
This is a special implementation of the storage API that allows to create a relay to another AFS storage instance, exposing the API through a web-service.

To make a drive remotely accessible, set the `remotely-accessible` property of this drive to `true`:
```yaml
mapdb-app-file-system:
    drive-name: drive1
    db-file: /home/user/drive1.db
    remotely-accessible: true
```

On the client side, you have to configure the [remote-service](../user/configuration/remote-service.md) module in the configuration file, to give the URL of the server and the name of the drive.

**YAML configuration**
```yaml
remote-service:
    host-name: my-afs-server
    app-name: my-server-app
    secure: false
    port: 8080
```

## Going further
To go further with AFS, check out the following content
- [AFS API guide](../developer/api_guide/afs.md): learn how to use AFS in your java project
- [AFS in run-script](../user/itools/run-script.md#access-to-afs): learn how to access to AFS using the `run-script` iTools command 
