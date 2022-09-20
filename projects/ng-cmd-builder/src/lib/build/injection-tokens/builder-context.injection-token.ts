import { InjectionToken } from "@angular/core";
import { BuilderContext } from "@angular-devkit/architect";

export const BUILDER_CONTEXT = new InjectionToken<BuilderContext>("Builder context");
