---
layout: default
---

# dynawo
The `dynawo` module defines the required parameters to run with Dynawo.

## Properties

**homeDir**  
Use the `homeDir` property to defines the install directory of the dynawo simulator.

**debug**  
Use the `debug` property to specify if the temporary folder where the inputs are generated should be kept after the simulation.

## Examples

**YAML configuration:**
```yaml
dynawo:
  homeDir: /home/user/dynawo
  debug: false
```

**XML configuration:**
```xml
<dynawo>
  <homeDir>/home/user/dynawo</homeDir>
  <debug>false</debug>
</dynawo>
```
