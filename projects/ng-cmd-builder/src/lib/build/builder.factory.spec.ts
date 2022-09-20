import { BuilderFactory } from "./builder.factory";
import { BUILDER_OPTIONS } from "./injection-tokens/options.injection-token";
import { createMoqInjector, resolve, resolveMock } from "../../tests.components/createMoqInjector";
import { CommandExecutor } from "./command.executor";
import { dataMock } from "../../tests.components/data-mock";
import { CommandOptions } from "./schema";
import { BUILDER_CONTEXT } from "./injection-tokens/builder-context.injection-token";
import { LoggerApi } from "@angular-devkit/core/src/logger";
import { It, Mock } from "moq.ts";

describe("Builder factory", () => {
    beforeEach(() => {
        createMoqInjector(BuilderFactory);
    });

    it("Returns success true", async () => {
        const command = "ng-packagr";
        const options = dataMock<CommandOptions>({command});
        const loggerMock = new Mock<LoggerApi>()
            .setup(instance => instance.info(It.IsAny()))
            .returns(undefined);

        resolveMock(BUILDER_OPTIONS)
            .setup(instance => instance.commands)
            .returns([options]);
        resolveMock(BUILDER_CONTEXT)
            .setup(instance => instance.logger)
            .returns(loggerMock.object());
        resolveMock(CommandExecutor)
            .setup(instance => instance.run(options))
            .returnsAsync(undefined);

        const factory = resolve(BuilderFactory);
        const actual = await factory.create();

        expect(actual).toEqual({success: true});
        loggerMock.verify(instance => instance.info(`Executing: ${command}`));
    });

    it("Returns success false when command executor returns a rejected promise", async () => {
        const command = dataMock<CommandOptions>({});
        const loggerMock = new Mock<LoggerApi>()
            .setup(instance => instance.info(It.IsAny()))
            .returns(undefined);

        resolveMock(BUILDER_OPTIONS)
            .setup(instance => instance.commands)
            .returns([command]);
        resolveMock(BUILDER_CONTEXT)
            .setup(instance => instance.logger)
            .returns(loggerMock.object());
        resolveMock(CommandExecutor)
            .setup(instance => instance.run(command))
            .throwsAsync(undefined);

        const factory = resolve(BuilderFactory);
        const actual = await factory.create();

        expect(actual).toEqual({success: false});
    });
});
