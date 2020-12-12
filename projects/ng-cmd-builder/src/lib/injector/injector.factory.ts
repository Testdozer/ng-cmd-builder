import { Injector, StaticProvider } from "@angular/core";

export const injectorFactory = <T>(...providers: StaticProvider[]) => Injector.create({providers});

