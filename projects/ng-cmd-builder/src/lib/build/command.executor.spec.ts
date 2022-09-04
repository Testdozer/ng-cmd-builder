import { ProcessProvider } from "./process.provider";
import { ChildProcess, StdioOptions } from "child_process";
import { createMoqInjector, resolve, resolveMock } from "../../tests.components/createMoqInjector";
import { It, Mock } from "moq.ts";
import { OptionsBuilder } from "./options.builder";
import { CommandExecutor } from "./command.executor";
import { dataMock } from "../../tests.components/data-mock";
import { CommandOptions } from "./schema";

describe("Command executor", () => {
    beforeEach(() => {
        createMoqInjector(CommandExecutor);
    });

    it("Returns resolved promise", async () => {
        const command = "command";
        const args = [];
        const commandOptions = dataMock<CommandOptions>({command, args});
        const options = {argv0: "any"};

        const process = new Mock<ChildProcess>()
            .setup(instance => instance.on("close", It.IsAny()))
            .callback(({args: [, listener]}) => listener(0))
            .object();
        resolveMock(OptionsBuilder)
            .setup(instance => instance.build(commandOptions))
            .returns(options);
        resolveMock(ProcessProvider)
            .setup(instance => instance.create(command, args, {...options, stdio: "inherit" as StdioOptions}))
            .returns(process);


        const factory = resolve(CommandExecutor);
        const actual = factory.run(commandOptions);

        await expectAsync(actual).toBeResolved();
    });

    it("Returns rejected promise", async () => {
        const command = "command";
        const args = ["param"];
        const commandOptions = dataMock<CommandOptions>({command, args});
        const options = {argv0: "any"};

        let close: (code: number) => void;
        const process = new Mock<ChildProcess>()
            .setup(instance => instance.on("close", It.IsAny()))
            .callback(({args: [, listener]}) => listener(1))
            .object();
        resolveMock(OptionsBuilder)
            .setup(instance => instance.build(commandOptions))
            .returns(options);
        resolveMock(ProcessProvider)
            .setup(instance => instance.create(command, args, {...options, stdio: "inherit" as StdioOptions}))
            .returns(process);

        const factory = resolve(CommandExecutor);
        const actual = factory.run(commandOptions);
        await expectAsync(actual).toBeRejected();
    });
});
