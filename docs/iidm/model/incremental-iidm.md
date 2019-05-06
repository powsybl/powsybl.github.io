---
title: Incremental IIDM
layout: default
---
Elements in `incremental IIDM` are exported into three separated files (by default):
 
   - `base-STATE.xiidm` file: contains only network elements having state attributes.
 
   - `base-TOPO.xiidm` file: contains only network elements having topology attributes.
   
   - `base-CONTROL.xiidm` file: contains only network elements having control attributes.
 

The following table summarize the variables exported in each file for each network element.

|                        | TOPO       | STATE          | CONTROL                                                                                                                                                                                                     |
|------------------------|------------|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Generator              | bus        | p, q           | voltageRegulatorOn,  targetP,  targetQ,  targetV                                                                                                                                                            |
| Load                   | bus        | p, q           | -                                                                                                                                                                                                           |
| DanglingLine           | bus        | p, q           | -                                                                                                                                                                                                           |
| Line                   | bus1, bus2 | p1, q1, p2, q2 | -                                                                                                                                                                                                            |
| TwoWindingsTransformer | bus1, bus2 | p1, q1, p2, q2 | ratioTapChanger.tapPosition, ratioTapChanger.regulating, ratioTapChanger.targetV, phaseTapChanger.tapPosition, phaseTapChanger.regulating, phaseTapChanger.regulatingMode, phaseTapChanger.regulatingValue, |
| Switch                 | open       | -              | -                                                                                                                                                                                                           |
| ShuntCompensator       | bus        | p, q           | currentSectionCount                                                                                                                                                                                         |
| BusbarSection          | -          | v, angle       | -                                                                                                                                                                                                           |
| Bus                    | -          | v, angle       | -                                                                                                                                                                                                           |
| StaticVarCompensator   | bus        | p, q           |  voltageSetPoint, reactivePowerSetPoint, regulationMode                                                                                                                                                     |
| VscConvertionStation   | bus        | p, q           |  voltageRegulatorOn, voltageSetpoint,  reactivePowerSetpoint                                                                                                                                                |
| LccConvertionStation   | bus        | p, q           | -                                                                                                                                                                                                           |
| HvdcLine               | -          | -              | activePowerSetpoint                                                                                                                                                                                         |
| TieLine                | bus1, bus2 | p1, q1, p2, q2 | -                                                                                                                                                                                                           |
