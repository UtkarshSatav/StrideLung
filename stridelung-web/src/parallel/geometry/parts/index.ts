// Every part file of the parallel-oxygenator figure, in build order (cartridges before the stubs seated on them).
import { part as shell } from "./shell.ts";
import { part as display } from "./display.ts";
import { part as wheels } from "./wheels.ts";
import { part as handle } from "./handle.ts";
import { part as frame } from "./frame.ts";
import { part as carrier } from "./carrier.ts";
import { part as cartridges } from "./cartridges.ts";
import { part as stubs } from "./stubs.ts";
import { part as manifolds } from "./manifolds.ts";
import { part as lines } from "./lines.ts";
import { part as markers } from "./markers.ts";
import { part as boundary } from "./boundary.ts";

export const PARTS = [shell, display, wheels, handle, frame, carrier, cartridges, stubs, manifolds, lines, markers, boundary];
