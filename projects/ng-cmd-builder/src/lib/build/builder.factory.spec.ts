import { ProcessProvider } from "./process.provider";
import { ChildProcess, StdioOptions } from "child_process";
import { BuilderFactory } from "./builder.factory";
import { BUILDER_OPTIONS } from "./injection-tokens/options.injection-token";
import { BUILDER_CONTEXT } from "../injector/builder-context.injection-token";
import { then } from "../../tests.components/promise";
import { createMoqInjector, get, resolve } from "../../tests.components/createMoqInjector";
import { It, Mock } from "moq.ts";
import { logging } from "@angular-devkit/core";
import { OptionsBuilder } from "./options.builder";

describe("Builder factory", () => {
    beforeEach(() => {
        createMoqInjector(BuilderFactory);
    });

    it("Returns success true", async () => {
        const command = "command";
        const args = [];
        const options = {argv0: "any"};

        let close: (code: number) => void;
        const process = new Mock<ChildProcess>()
            .setup(instance => instance.on("close", It.IsAny()))
            .callback(({args: [, listener]}) => close = listener)
            .object();
        resolve(BUILDER_OPTIONS)
            .setup(instance => instance.command)
            .returns(command)
            .setup(instance => instance.args)
            .returns(args);
        resolve(OptionsBuilder)
            .setup(instance => instance.build(get(BUILDER_OPTIONS)))
            .returns(options);
        resolve(ProcessProvider)
            .setup(instance => instance.create(command, args, {...options, stdio: "inherit" as StdioOptions}))
            .returns(process);


        const factory = get(BuilderFactory);
        const actual = factory.create();
        const {success} = then(actual);
        close(0);
        await actual;

        expect(success).toHaveBeenCalledWith({success: true});
    });

    it("Returns success false", async () => {
        const command = "command";
        const args = [];
        const options = {argv0: "any"};

        let close: (code: number) => void;
        const process = new Mock<ChildProcess>()
            .setup(instance => instance.on("close", It.IsAny()))
            .callback(({args: [, listener]}) => {
                close = listener;
            })
            .object();
        resolve(BUILDER_OPTIONS)
            .setup(instance => instance.command)
            .returns(command)
            .setup(instance => instance.args)
            .returns(args);
        resolve(OptionsBuilder)
            .setup(instance => instance.build(get(BUILDER_OPTIONS)))
            .returns(options);
        resolve(ProcessProvider)
            .setup(instance => instance.create(command, args, {...options, stdio: "inherit" as StdioOptions}))
            .returns(process);

        const factory = get(BuilderFactory);
        const actual = factory.create();
        const {success} = then(actual);
        close(1);
        await actual;

        expect(success).toHaveBeenCalledWith({success: false});
    });

    it("Logs an exception", async () => {
        const command = "command";
        const args = [];
        const errorMessage = "error message";
        const error = new Error(errorMessage);

        const loggerApiIMock = new Mock<logging.LoggerApi>()
            .setup(instance => instance.error(It.IsAny()))
            .returns(undefined);
        resolve(BUILDER_OPTIONS)
            .setup(instance => instance.command)
            .returns(command)
            .setup(instance => instance.args)
            .returns(args);
        resolve(BUILDER_CONTEXT)
            .setup(instance => instance.logger)
            .returns(loggerApiIMock.object());
        resolve(ProcessProvider)
            .setup(instance => instance.create(command, args, {stdio: "inherit" as StdioOptions}))
            .throws(error);

        const factory = get(BuilderFactory);
        await factory.create();

        loggerApiIMock.verify(instance => instance.error(errorMessage));
    });

    it("Returns success false when an exception has happened", async () => {
        const command = "command";
        const args = [];
        const errorMessage = "error message";
        const error = new Error(errorMessage);

        const loggerApiIMock = new Mock<logging.LoggerApi>()
            .setup(instance => instance.error(It.IsAny()))
            .returns(undefined);
        resolve(BUILDER_OPTIONS)
            .setup(instance => instance.command)
            .returns(command)
            .setup(instance => instance.args)
            .returns(args);
        resolve(BUILDER_CONTEXT)
            .setup(instance => instance.logger)
            .returns(loggerApiIMock.object());
        resolve(ProcessProvider)
            .setup(instance => instance.create(command, args, {stdio: "inherit" as StdioOptions}))
            .throws(error);

        const factory = get(BuilderFactory);
        const actual = await factory.create();

        expect(actual).toEqual({success: false});
    });

})
;
