---
title: security
layout: default
---

The `security` module is used by the AFS web-server to define the authentication token validity.

# Optional properties

## skip-token-validity-check
The `skip-token-validity-check` property defines if the check of the token validity is skipped. The default value of this
property is `true`.

## token-validity
The `token-validity` property defines the validity of the connection token in minutes. The default value of this property
is `3600` minutes.
 
## Examples

### YAML
```yaml
security:
    skip-token-validity-check: true
    token-validity: 3600
```

### XML
```xml
<security>
    <skip-token-validity-check>true</skip-token-validity-check>
    <token-validity>3600</token-validity>
</security>
```
