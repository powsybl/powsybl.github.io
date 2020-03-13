---
title: afs
layout: default
todo:
    - add links to missing pages
---

The `afs` command performs some basic actions on a [AFS](../afs/index.md) drive:
- list the content of an AFS folder
- archive/restore an AFS content from/to a directory for backup purposes
- allow taking corrective actions on inconsistent nodes (remove/list inconsistent nodes ...).

Read this [tutorial](../tutorials/afs/afs.md) to learn how to configure an AFS drive. 

# Usage
```shell
$> itools afs --help
usage: itools [OPTIONS] afs [--archive <FILE_SYSTEM_NAME>] [--dir <DIR>]
       [--help] [--ls <PATH>] [--unarchive <FILE_SYSTEM_NAME>] [--rm-inconsistent-nodes  <FILE_SYSTEM_NAME>  <NODE_ID>]
       [--set-inconsistent-nodes  <FILE_SYSTEM_NAME> <NODE_ID>] [--ls-inconsistent-nodes  <FILE_SYSTEM_NAME>]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name

Available arguments are:
    --archive <FILE_SYSTEM_NAME>                           archive file system
    --dir <DIR>                                            directory
    --help                                                 display the help and quit
    --ls <PATH>                                            list files
    --unarchive <FILE_SYSTEM_NAME>                         unarchive file system
    --rm-inconsistent-nodes  <FILE_SYSTEM_NAME>  <NODE_ID> remove inconsistent nodes
    --set-inconsistent-nodes  <FILE_SYSTEM_NAME> <NODE_ID> mark inconsistent nodes as consistent
    --ls-inconsistent-nodes  <FILE_SYSTEM_NAME>            list the inconsistent nodes
    --zip                                                  zip archive file
    --dependencies                                         archive dependencies
    --deleteResults                                        delete results
```

## Commands

### archive
Use the `--archive` command to archive an AFS root node and all its children to a directory.

### ls
Use the `--ls` command to list the content of the specified AFS node.

### unarchive
Use the `--unarchive` command to restore an AFS root node from a backup directory.

### ls-inconsistent-nodes
Use the `--ls-inconsistent-nodes` to list all inconsistent nodes in a specified AFS.

### rm-inconsistent-nodes
Use the `--rm-inconsistent-nodes` to remove all inconsistent nodes in a specified AFS.

### set-inconsistent-nodes
Use the `--set-inconsistent-nodes` to mark all inconsistent nodes (or a specified node) as consistent in a specified AFS.

### zip
Use the `--zip` command to create a zipped archive file.

### dependencies
Use the `--dependencies` command to archive the dependencies of the selected file or folder.

### deleteResults
Use the `--deleteResults` command to not archive the results.

## Required parameters

### dir
Use the `--dir` parameter to specify the directory. This parameter is required by the `archive` and `unarchive` commands.

# Examples
This example shows how to list the content of an AFS root folder:
```shell
$> itools afs --ls "my-first-fs"
my-first-folder
```

This example shows how to list the content of a specific folder:
```shell
$> itools afs --ls "my-first-fs:/my-first-folder"
my-first-project
```

This example shows how to backup an AFS node to a directory:
```shell
$> itools afs --archive my-first-fs --dir /tmp
```

This example shows how to restore an AFS node from a backup directory:
```shell
$> itools afs --unarchive my-first-fs --dir /tmp
```

# Maven configuration
To use the `afs` command, add the following dependencies to the `pom.xml` file:
```xml
<dependency>
    <groupId>com.powsybl</groupId>
    <artifactId>powsybl-afs-core</artifactId>
    <version>${powsybl.version}</version>
</dependency>
```

Read the [documentation](../afs/index.md) page to learn more about the AFS implementations.
