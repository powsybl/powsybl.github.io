---
title: afs
layout: default
todo:
    - add links to missing pages
---

The `afs` command performs some basic actions on a [AFS](../afs/index.md) drive:
- list the content of an AFS folder
- archive/restore an AFS content from/to a directory for backup purposes

Read this [tutorial](../tutorials/afs/afs.md) to learn how to configure an AFS drive. 

# Usage
```shell
$> itools afs --help
usage: itools [OPTIONS] afs [--archive <FILE_SYSTEM_NAME>] [--dir <DIR>]
       [--help] [--ls <PATH>] [--unarchive <FILE_SYSTEM_NAME>]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name

Available arguments are:
    --archive <FILE_SYSTEM_NAME>     archive file system
    --dir <DIR>                      directory
    --help                           display the help and quit
    --ls <PATH>                      list files
    --unarchive <FILE_SYSTEM_NAME>   unarchive file system
```

## Commands

### archive
Use the `--archive` command to archive an AFS root node and all its children to a directory.

### ls
Use the `--ls` command to list the content of the specified AFS node.

### unarchive
Use the `--unarchive` command to restore an AFS root node from a backup directory.

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
