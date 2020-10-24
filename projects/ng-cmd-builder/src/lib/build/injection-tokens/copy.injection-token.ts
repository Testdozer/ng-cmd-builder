import { InjectionToken } from "@angular/core";
import cpx from "cpx";

export const COPY = new InjectionToken<typeof cpx.copy>("cpx copy");
