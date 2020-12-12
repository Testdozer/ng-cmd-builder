import { InjectionToken } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cpx = require("cpx");

export const COPY = new InjectionToken<typeof cpx.copySync>("copySync");
