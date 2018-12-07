---
title: local-app-file-system
layout: default
todo:
    - add links to missing pages
---

The `local-app-file-system` module is used by [AFS](../../afs/index.md) to define one or several drives
mapped to a local hard-drive.

Read the [documentation](../../afs/afs-local.md) page to learn more about the local AFS implementation.

# Properties

## Required properties

## drive-name
The `drive-name` property is a required property that defines the primary drive's name.

## root-dir
The `root-dir` property is a required property that defines the path to the root directory mapped to the primary
AFS drive. If the root directory does not exist, an `AfsException` is thrown.

## Optional properties

## drive-name-X
The `drive-name-X` property is an optional property that defines the Xth drive's name. This parameter is required
if the `root-dir-X` property is set.

## max-additional-drive-count
The `max-additional-drive-count` property is an optional property that defines the maximal number of secondary drives.

## remotely-accessible
The `remotely-accessible` property is an optional property that defines if the primary drive is remotely accessible. The
default value of this property is `false`.

## remotely-accessible-X
The `remotely-accessible-X` property is an optional property that defines if the Xth secondary drive is remotely
accessible. The default value of this property is `false`.

## root-dir-X
The `root-dir-X` property is an optional property that defines the root directory mapped to the Xth secondary MapDB drive.
This parameter is required if the `drive-name-X` property is set. If the root directory does not exist, an `AfsException`
is thrown.

# Examples

## YAML
```yaml
local-app-file-system:
    max-additional-drive-count: 2
    drive-name: drive1
    root-dir: /home/user/drive1
    drive-name-0: drive2
    root-dir-0: /home/user/drive2
    drive-name-1: drive3
    root-dir-1: /home/user/drive3
```

## XML
```xml
<local-app-file-system>
    <max-additional-drive-count>2</max-additional-drive-count>
    <drive-name>drive1</drive-name>
    <root-dir>/home/user/drive1</root-dir>
    <remotely-accessible>true</remotely-accessible>
    
    <!-- First secondary drive -->
    <drive-name-0>drive2</drive-name-0>
    <root-dir-0>/home/user/drive2</root-dir-0>
    
    <!-- Second secondary drive -->
    <drive-name-1>drive3</drive-name-1>
    <root-dir-1>/home/user/drive3</root-dir-1>
    <remotely-accessible-1>true</remotely-accessible-1>
</local-app-file-system>
```
