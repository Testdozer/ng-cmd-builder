import { BuilderFactory } from "./builder.factory";
import { BUILDER_OPTIONS } from "./injection-tokens/options.injection-token";
import { createMoqInjector, resolve, resolveMock } from "../../tests.components/createMoqInjector";
import { CommandExecutor } from "./command.executor";
import { dataMock } from "../../tests.components/data-mock";
import { CommandOptions } from "./schema";

describe("Builder factory", () => {
    beforeEach(() => {
        createMoqInjector(BuilderFactory);
    });

    it("Returns success true", async () => {
        const command = dataMock<CommandOptions>({});

        resolveMock(BUILDER_OPTIONS)
            .setup(instance => instance.commands)
            .returns([command]);
        resolveMock(CommandExecutor)
            .setup(instance => instance.run(command))
            .returnsAsync(undefined);

        const factory = resolve(BuilderFactory);
        const actual = await factory.create();

        expect(actual).toEqual({success: true});
    });

    it("Returns success false when command executor returns a rejected promise", async () => {
        const command = dataMock<CommandOptions>({});

        resolveMock(BUILDER_OPTIONS)
            .setup(instance => instance.commands)
            .returns([command]);
        resolveMock(CommandExecutor)
            .setup(instance => instance.run(command))
            .throwsAsync(undefined);

        const factory = resolve(BuilderFactory);
        const actual = await factory.create();

        expect(actual).toEqual({success: false});
    });
});
