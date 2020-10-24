import { BUILDER_OPTIONS } from "./injection-tokens/options.injection-token";
import { COPY } from "./injection-tokens/copy.injection-token";
import { AssetsHandler } from "./assets.handler";
import { createMoqInjector, get, resolve } from "../../tests.components/createMoqInjector";
import { It, Mock } from "moq.ts";
import { logging } from "@angular-devkit/core";
import { BUILDER_CONTEXT } from "../injector/builder-context.injection-token";

describe("Assets handler", () => {
    beforeEach(() => {
        createMoqInjector(AssetsHandler);
    });

    it("Returns success false when the previous step is failed", async () => {
        const handler = get(AssetsHandler);
        const actual = await handler.handle({success: false});

        expect(actual).toEqual({success: false});
    });

    it("Returns success true when assets are empty", async () => {
        const handler = get(AssetsHandler);
        const actual = await handler.handle({success: true});

        expect(actual).toEqual({success: true});
    });

    it("Returns success true when all assets are handled without issues", async () => {
        const source = "source";
        const dest = "dest";
        const options = {};

        resolve(BUILDER_OPTIONS)
            .setup(instance => instance.assets)
            .returns([{source, dest, options}]);

        const handler = get(AssetsHandler);
        const actual = await handler.handle({success: true});

        resolve(COPY)
            .verify(instance => instance(source, dest, options));
        expect(actual).toEqual({success: true});
    });

    it("Returns success false when any asset is handled with an issue", async () => {
        const source = "source";
        const dest = "dest";
        const options = {};
        const message = "message";
        const error = new Error(message);

        const loggerApiIMock = new Mock<logging.LoggerApi>()
            .setup(instance => instance.error(It.IsAny()))
            .returns(undefined);
        resolve(BUILDER_CONTEXT)
            .setup(instance => instance.logger)
            .returns(loggerApiIMock.object());
        resolve(BUILDER_OPTIONS)
            .setup(instance => instance.assets)
            .returns([{source, dest, options}]);
        resolve(COPY)
            .setup(instance => instance(source, dest, options))
            .throws(error);

        const handler = get(AssetsHandler);
        const actual = await handler.handle({success: true});

        expect(actual).toEqual({success: false});
        loggerApiIMock.verify(instance => instance.error(message));
    });
});
