import { BuilderContext, BuilderOutput } from "@angular-devkit/architect";
import { JsonObject } from "@angular-devkit/core";
import { Schema } from "./schema";
import { injectorFactory } from "../injector/injector.factory";
import { BUILDER_OPTIONS } from "./injection-tokens/options.injection-token";
import { BUILDER_CONTEXT } from "../injector/builder-context.injection-token";
import { BuilderFactory } from "./builder.factory";
import { ProcessProvider } from "./process.provider";
import { SPAWN } from "./injection-tokens/spawn.injection-token";
import { spawn } from "child_process";
import { PROCESS } from "./injection-tokens/process.injection-token";
import { CONSOLE } from "./injection-tokens/console.injection-token";
import { OptionsBuilder } from "./options.builder";
import { AssetsHandler } from "./assets.handler";
import { COPY } from "./injection-tokens/copy.injection-token";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cpx = require("cpx");

export default (
    options: JsonObject & Schema,
    context: BuilderContext,
): Promise<BuilderOutput> => {
    const injector = injectorFactory([
        {provide: BUILDER_OPTIONS, useValue: options, deps: []},
        {provide: BUILDER_CONTEXT, useValue: context, deps: []},
        {provide: SPAWN, useValue: spawn, deps: []},
        {provide: PROCESS, useValue: process, deps: []},
        {provide: CONSOLE, useValue: console, deps: []},
        {provide: COPY, useValue: cpx.copySync, deps: []},
        {provide: ProcessProvider, useClass: ProcessProvider, deps: [SPAWN, PROCESS, CONSOLE]},
        {provide: OptionsBuilder, useClass: OptionsBuilder, deps: []},
        {provide: BuilderFactory, useClass: BuilderFactory, deps: [BUILDER_OPTIONS, BUILDER_CONTEXT, ProcessProvider, OptionsBuilder]},
        {provide: AssetsHandler, useClass: AssetsHandler, deps: [BUILDER_OPTIONS, BUILDER_CONTEXT, COPY]},
    ]);
    const factory = injector.get(BuilderFactory);
    const assetsHandler = injector.get(AssetsHandler);
    return factory.create().then((output) => assetsHandler.handle(output));
};
