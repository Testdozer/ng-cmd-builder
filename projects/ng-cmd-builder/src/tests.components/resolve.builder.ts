// @ts-ignore
import { Spy, SpyObj } from "jasmine";
import { InjectionToken, Injector, StaticProvider, Type } from "@angular/core";
// @ts-ignore

export type SpiedObject<T> = T & {
    [K in keyof T]: T[K] extends Function ? T[K] & SpiedObject<T> & Spy : SpiedObject<T[K]>;
};

let injector: Injector;

export function createInjector(providers: StaticProvider[]) {
    injector = Injector.create({providers});
    return injector;
}

export function resolve<T>(token: Type<T> | InjectionToken<T>): SpyObj<T> & Spy {
    return injector.get(token) as any;
}
