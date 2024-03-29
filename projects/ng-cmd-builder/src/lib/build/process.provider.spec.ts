import { SPAWN } from "./injection-tokens/spawn.injection-token";
import { PROCESS } from "./injection-tokens/process.injection-token";
import { ProcessProvider } from "./process.provider";
import { ChildProcess } from "child_process";
import { CONSOLE } from "./injection-tokens/console.injection-token";
import { createMoqInjector, resolve, resolveMock } from "../../tests.components/createMoqInjector";
import { It, Mock } from "moq.ts";

describe("Process provider", () => {
    beforeEach(() => {
        createMoqInjector(ProcessProvider);
    });

    it("Returns child process", () => {
        const command = "command";
        const args = [];
        const options = {};
        const process = new Mock<ChildProcess>()
            .setup(instance => instance.on(It.IsAny(), It.IsAny()))
            .returns(undefined)
            .object();

        resolveMock(SPAWN)
            .setup(instance => instance(command, args, options))
            .returns(process);
        resolveMock(PROCESS)
            .setup(instance => instance.on(It.IsAny(), It.IsAny()))
            .returns(undefined);

        const provider = resolve(ProcessProvider);
        const actual = provider.create(command, args, options);

        expect(actual).toBe(process);
    });

    it("Kills process on SIGINT", () => {
        const command = "command";
        const args = [];
        const options = {};
        const processMock = new Mock<ChildProcess>()
            .setup(instance => instance.on(It.IsAny(), It.IsAny()))
            .returns(undefined)
            .setup(instance => instance.kill())
            .returns(undefined);

        resolveMock(SPAWN)
            .setup(instance => instance(command, args, options))
            .returns(processMock.object());

        resolveMock(PROCESS)
            .setup(instance => instance.on("SIGINT", It.IsAny()))
            .callback(({args: [, listener]}) => listener());

        const provider = resolve(ProcessProvider);
        provider.create(command, args, options);

        processMock.verify(instance => instance.kill("SIGTERM"));
    });

    it("Kills process on SIGTERM", () => {
        const command = "command";
        const args = [];
        const options = {};
        const processMock = new Mock<ChildProcess>()
            .setup(instance => instance.on(It.IsAny(), It.IsAny()))
            .returns(undefined)
            .setup(instance => instance.kill())
            .returns(undefined);

        resolveMock(SPAWN)
            .setup(instance => instance(command, args, options))
            .returns(processMock.object());

        resolveMock(PROCESS)
            .setup(instance => instance.on("SIGTERM", It.IsAny()))
            .callback(({args: [, listener]}) => listener());

        const provider = resolve(ProcessProvider);
        provider.create(command, args, options);

        processMock.verify(instance => instance.kill("SIGTERM"));
    });

    it("Logs errors with console", () => {
        const command = "command";
        const args = [];
        const options = {};
        const error = new Error();

        const process = new Mock<ChildProcess>()
            .setup(instance => instance.on("error", It.IsAny()))
            .callback(({args: [, listener]}) => listener(error))
            .object();
        resolveMock(SPAWN)
            .setup(instance => instance(command, args, options))
            .returns(process);
        resolveMock(PROCESS)
            .setup(instance => instance.on(It.IsAny(), It.IsAny()))
            .returns(undefined);
        resolveMock(CONSOLE)
            .setup(instance => instance.error())
            .returns(undefined);

        const provider = resolve(ProcessProvider);
        provider.create(command, args, options);

        resolveMock(CONSOLE)
            .verify(instance => instance.error(error));
    });

});
