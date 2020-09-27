import { InjectionToken } from "@angular/core";
import { spawn } from "child_process";

export const SPAWN = new InjectionToken<typeof spawn>("nodejs spawn");
