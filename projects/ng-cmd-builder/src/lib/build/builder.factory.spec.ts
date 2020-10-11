import { createInjector, resolve } from "../../tests.components/resolve.builder";
import { ProcessProvider } from "./process.provider";
import { ChildProcess, StdioOptions } from "child_process";
import { BuilderFactory } from "./builder.factory";
import { BUILDER_OPTIONS } from "./injection-tokens/options.injection-token";
import { BUILDER_CONTEXT } from "../injector/builder-context.injection-token";
import { OptionsBuilder } from "./options.builder";
import { then } from "../../tests.components/promise";
import { logging } from "@angular-devkit/core";

describe("Builder factory", () => {
    beforeEach(() => {
        const processProvider = jasmine.createSpyObj<ProcessProvider>(["create"]);
        const optionsBuilder = jasmine.createSpyObj<OptionsBuilder>(["build"]);
        const logger = jasmine.createSpyObj<logging.LoggerApi>(["error"]);

        createInjector([
            {provide: BUILDER_OPTIONS, useValue: {}, deps: []},
            {provide: BUILDER_CONTEXT, useValue: {logger}, deps: []},
            {provide: ProcessProvider, useValue: processProvider, deps: []},
            {provide: OptionsBuilder, useValue: optionsBuilder, deps: []},
            {provide: BuilderFactory, useClass: BuilderFactory, deps: [BUILDER_OPTIONS, BUILDER_CONTEXT, ProcessProvider, OptionsBuilder]},
        ]);
    });

    it("Returns success true", async () => {
        const command = "command";
        const args = [];
        const options = {};
        const process = jasmine.createSpyObj<ChildProcess>(["on"]);

        Object.defineProperty(resolve(BUILDER_OPTIONS), "command", {value: command});
        Object.defineProperty(resolve(BUILDER_OPTIONS), "args", {value: args});

        resolve(OptionsBuilder)
            .build.withArgs(resolve(BUILDER_OPTIONS))
            .and.returnValue(options);

        resolve(ProcessProvider)
            .create.withArgs(command, args, {...options, stdio: "inherit" as StdioOptions})
            .and.returnValue(process);

        let close: (code: number) => void;
        process
            .on
            .and.callFake((event: string, listener: (...args) => void) => {
            if (event === "close") {
                close = listener;
            }
            return process as ChildProcess;
        });

        const factory = resolve(BuilderFactory);
        const actual = factory.create();
        const {success} = then(actual);
        close(0);
        await actual;

        expect(success).toHaveBeenCalledWith({success: true});
    });

    it("Returns success false", async () => {
        const command = "command";
        const args = [];
        const options = {};
        const process = jasmine.createSpyObj<ChildProcess>(["on"]);

        Object.defineProperty(resolve(BUILDER_OPTIONS), "command", {value: command});
        Object.defineProperty(resolve(BUILDER_OPTIONS), "args", {value: args});

        resolve(OptionsBuilder)
            .build.withArgs(resolve(BUILDER_OPTIONS))
            .and.returnValue(options);

        resolve(ProcessProvider)
            .create.withArgs(command, args, {...options, stdio: "inherit" as StdioOptions})
            .and.returnValue(process);

        let close: (code: number) => void;
        process
            .on
            .and.callFake((event: string, listener: (...args) => void) => {
            if (event === "close") {
                close = listener;
            }
            return process as ChildProcess;
        });

        const factory = resolve(BuilderFactory);
        const actual = factory.create();
        const {success} = then(actual);
        close(1);
        await actual;

        expect(success).toHaveBeenCalledWith({success: false});
    });

    it("Logs an exception", async () => {
        const command = "command";
        const args = [];
        const options = {};
        const errorMessage = "error message";
        const error = new Error(errorMessage);

        Object.defineProperty(resolve(BUILDER_OPTIONS), "command", {value: command});
        Object.defineProperty(resolve(BUILDER_OPTIONS), "args", {value: args});

        resolve(OptionsBuilder)
            .build.withArgs(resolve(BUILDER_OPTIONS))
            .and.returnValue(options);

        resolve(ProcessProvider)
            .create.withArgs(command, args, {...options, stdio: "inherit" as StdioOptions})
            .and.throwError(error);

        const factory = resolve(BuilderFactory);
        await factory.create();

        const {logger} = resolve(BUILDER_CONTEXT);
        expect(logger.error).toHaveBeenCalledWith(errorMessage);
    });

    it("Returns success false when an exception has happened", async () => {
        const command = "command";
        const args = [];
        const options = {};
        const errorMessage = "error message";
        const error = new Error(errorMessage);

        Object.defineProperty(resolve(BUILDER_OPTIONS), "command", {value: command});
        Object.defineProperty(resolve(BUILDER_OPTIONS), "args", {value: args});

        resolve(OptionsBuilder)
            .build.withArgs(resolve(BUILDER_OPTIONS))
            .and.returnValue(options);

        resolve(ProcessProvider)
            .create.withArgs(command, args, {...options, stdio: "inherit" as StdioOptions})
            .and.throwError(error);

        const factory = resolve(BuilderFactory);
        const actual = await factory.create();

        expect(actual).toEqual({success: false});
    });

});
