import { Injector, StaticProvider } from "@angular/core";

export function injectorFactory<T>(...providers: StaticProvider[]) {
    return Injector.create({providers});
}

