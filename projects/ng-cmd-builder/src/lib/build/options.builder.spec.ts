import { OptionsBuilder } from "./options.builder";
import { createMoqInjector, get } from "../../tests.components/createMoqInjector";
import { dataMock } from "../../tests.components/data-mock";
import { JsonObject } from "@angular-devkit/core";
import { Schema } from "./schema";

describe("Options builder", () => {
    beforeEach(() => {
        createMoqInjector(OptionsBuilder);
    });

    it("Returns empty options", () => {
        const cwd = undefined;
        const env = {};
        const shell = undefined;
        const windowsHide = undefined;
        const options = dataMock<JsonObject & Schema>({options: {cwd, env, shell, windowsHide}});

        const builder = get(OptionsBuilder);
        const actual = builder.build(options);

        expect(actual).toEqual({});
    });

    it("Returns cwd options", () => {
        const cwd = "value";
        const env = {};
        const shell = undefined;
        const windowsHide = undefined;
        const options = dataMock<JsonObject & Schema>({options: {cwd, env, shell, windowsHide}});

        const builder = get(OptionsBuilder);
        const actual = builder.build(options);

        expect(actual).toEqual({cwd});
    });

    it("Returns env options", () => {
        const cwd = undefined;
        const env = {key: "value"};
        const shell = undefined;
        const windowsHide = undefined;
        const options = dataMock<JsonObject & Schema>({options: {cwd, env, shell, windowsHide}});

        const builder = get(OptionsBuilder);
        const actual = builder.build(options);

        expect(actual).toEqual({env});
    });

    it("Returns shell options", () => {
        const cwd = undefined;
        const env = {};
        const shell = "bash";
        const windowsHide = undefined;
        const options = dataMock<JsonObject & Schema>({options: {cwd, env, shell, windowsHide}});

        const builder = get(OptionsBuilder);
        const actual = builder.build(options);

        expect(actual).toEqual({shell});
    });

    it("Returns windowsHide options", () => {
        const cwd = undefined;
        const env = {};
        const shell = undefined;
        const windowsHide = true;
        const options = dataMock<JsonObject & Schema>({options: {cwd, env, shell, windowsHide}});

        const builder = get(OptionsBuilder);
        const actual = builder.build(options);

        expect(actual).toEqual({windowsHide});
    });

});
