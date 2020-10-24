import { InjectionToken } from "@angular/core";
// tslint:disable-next-line:no-require-imports
const cpx = require("cpx");

export const COPY = new InjectionToken<typeof cpx.copySync>("copySync");
