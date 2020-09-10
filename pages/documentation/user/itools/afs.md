---
layout: default
---

# iTools AFS

The `afs` command performs some basic actions on a [AFS]() drive:
- list the content of an AFS folder
- archive/restore an AFS content from/to a directory for backup purposes
- allow taking corrective actions on inconsistent nodes (remove/list inconsistent nodes ...). 

## Usage
```
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

### Available commands

**archive**  
The `--archive` command archives an AFS root not and all its children to a directory.

**deleteResults**  
The `--deleteResults` command deletes the results.

**dependencies**  
Use the `--dependencies` command to archive the dependencies of the selected file or folder.

**ls**  
The `--ls` command lists the content of the specified AFS node.

**ls-inconsistent-nodes**  
The `--ls-inconsistent-nodes` command lists all inconsistent nodes in a specified AFS.

**rm-inconsistent-nodes**  
The `--rm-inconsistent-nodes` command removes all inconsistent nodes in a specified AFS.

**set-inconsistent-nodes**  
The `--set-inconsistent-nodes` command marks all inconsistent nodes (or a specified node) as consistent in a specified AFS.

**unarchive**  
The `--unarchive` command restores an AFS root node from a backup directory.

**zip**  
The `--zip` command create a zipped archive file.

### Required parameters

**dir**  
The `--dir` defines the path the folder the `archive` or `unarchive` commands will used to save or load the archive.

## Examples
This example shows how to list the content of an AFS root folder:
```
$> itools afs --ls "my-first-fs"
my-first-folder
```

This example shows how to list the content of a specific folder:
```
$> itools afs --ls "my-first-fs:/my-first-folder"
my-first-project
```

This example shows how to backup an AFS node to a directory:
```
$> itools afs --archive my-first-fs --dir /tmp
```

This example shows how to restore an AFS node from a backup directory:
```
$> itools afs --unarchive my-first-fs --dir /tmp
```
