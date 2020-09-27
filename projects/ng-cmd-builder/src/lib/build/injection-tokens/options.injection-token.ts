import { InjectionToken } from "@angular/core";
import { JsonObject } from "@angular-devkit/core";
import { Schema } from "../schema";

export const BUILDER_OPTIONS = new InjectionToken<JsonObject & Schema>("Builder options");
