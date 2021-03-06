import { InjectionToken, Injector, StaticProvider, Type } from "@angular/core";
import { IMock, Mock, MoqAPI } from "moq.ts";
import { IOptions, IParameter, moqInjectorProviders } from "ng-auto-moq";

export let injector: Injector;
export let testedToken: Type<any>;

export interface IMoqInjectorOptions<T> extends IOptions<T> {
    providers?: StaticProvider[];
}

export const createMoqInjector = <T>(constructor: Type<T>, options: IMoqInjectorOptions<T> = {}): Injector => {
    testedToken = constructor;
    options.mockFactory = options.mockFactory ? options.mockFactory : mockFactory;
    const customProvider = options.providers ? options.providers : [];
    const providers = [...moqInjectorProviders(constructor, options), ...customProvider];
    injector = Injector.create({providers});
    return injector;
};

export const resolve = <T>(token: Type<T> | InjectionToken<T>): IMock<T> => {
    const object = injector.get(token) as unknown;
    return object[MoqAPI];
};

export const get = <T>(token: Type<T> | InjectionToken<T> = testedToken): T => injector.get(token) as any;

const mockFactory = ({token, displayName}: IParameter) => {
    if (typeof token === "function") {
        const target = {};
        return new Mock<any>({name: displayName, target})
            .prototypeof(token.prototype);
    }

    return new Mock<any>({name: displayName});
};
