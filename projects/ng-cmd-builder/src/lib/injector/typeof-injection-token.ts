import { InjectionToken } from "@angular/core";

export type TypeOfInjectionToken<Type> = Type extends InjectionToken<infer X> ? X : never;
