// One file per register component. Each renders that part on its own; COMPONENT_VIEWS maps IDs to them.
import { C01OuterCase } from "./C01OuterCase";
import { C02Chassis } from "./C02Chassis";
import { C03Casters } from "./C03Casters";
import { C04PushHandle } from "./C04PushHandle";
import { C05Oxygenator } from "./C05Oxygenator";
import { C06PumpHead } from "./C06PumpHead";
import { C07PumpDrive } from "./C07PumpDrive";
import { C08SensorInterface } from "./C08SensorInterface";
import { C09SensorPods } from "./C09SensorPods";
import { C10FlowBubbleSensor } from "./C10FlowBubbleSensor";
import { C11OxygenCylinder } from "./C11OxygenCylinder";
import { C12CylinderRestraint } from "./C12CylinderRestraint";
import { C13GasControl } from "./C13GasControl";
import { C14GasLines } from "./C14GasLines";
import { C15ThermalModule } from "./C15ThermalModule";
import { C16ThermalHoses } from "./C16ThermalHoses";
import { C17Battery } from "./C17Battery";
import { C18PowerConversion } from "./C18PowerConversion";
import { C19Compute } from "./C19Compute";
import { C20Display } from "./C20Display";
import { C21Alarm } from "./C21Alarm";
import { C22LinePanel } from "./C22LinePanel";
import { C23BloodLines } from "./C23BloodLines";
import { C24ServiceKit } from "./C24ServiceKit";
import { C25FluidAllowance } from "./C25FluidAllowance";
import { C26CablesHardware } from "./C26CablesHardware";
import { C27Stabilisers } from "./C27Stabilisers";

export { C01OuterCase, C02Chassis, C03Casters, C04PushHandle, C05Oxygenator, C06PumpHead, C07PumpDrive, C08SensorInterface, C09SensorPods, C10FlowBubbleSensor, C11OxygenCylinder, C12CylinderRestraint, C13GasControl, C14GasLines, C15ThermalModule, C16ThermalHoses, C17Battery, C18PowerConversion, C19Compute, C20Display, C21Alarm, C22LinePanel, C23BloodLines, C24ServiceKit, C25FluidAllowance, C26CablesHardware, C27Stabilisers };

export const COMPONENT_VIEWS = { C01: C01OuterCase, C02: C02Chassis, C03: C03Casters, C04: C04PushHandle, C05: C05Oxygenator, C06: C06PumpHead, C07: C07PumpDrive, C08: C08SensorInterface, C09: C09SensorPods, C10: C10FlowBubbleSensor, C11: C11OxygenCylinder, C12: C12CylinderRestraint, C13: C13GasControl, C14: C14GasLines, C15: C15ThermalModule, C16: C16ThermalHoses, C17: C17Battery, C18: C18PowerConversion, C19: C19Compute, C20: C20Display, C21: C21Alarm, C22: C22LinePanel, C23: C23BloodLines, C24: C24ServiceKit, C25: C25FluidAllowance, C26: C26CablesHardware, C27: C27Stabilisers } as const;
