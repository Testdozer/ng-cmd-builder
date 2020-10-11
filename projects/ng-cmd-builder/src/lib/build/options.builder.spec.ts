import { createInjector, resolve } from "../../tests.components/resolve.builder";
import { OptionsBuilder } from "./options.builder";

describe("Options builder", () => {
    beforeEach(() => {
        createInjector([
            {provide: OptionsBuilder, useClass: OptionsBuilder, deps: []},
        ]);
    });

    it("Returns empty options", () => {
        const cwd = undefined;
        const env = {};
        const shell = undefined;
        const windowsHide = undefined;
        const options = {options: {cwd, env, shell, windowsHide}};

        const builder = resolve(OptionsBuilder);
        const actual = builder.build(options);

        expect(actual).toEqual({});
    });

    it("Returns cwd options", () => {
        const cwd = "value";
        const env = {};
        const shell = undefined;
        const windowsHide = undefined;
        const options = {options: {cwd, env, shell, windowsHide}};

        const builder = resolve(OptionsBuilder);
        const actual = builder.build(options);

        expect(actual).toEqual({cwd});
    });

    it("Returns env options", () => {
        const cwd = undefined;
        const env = {key: "value"};
        const shell = undefined;
        const windowsHide = undefined;
        const options = {options: {cwd, env, shell, windowsHide}};

        const builder = resolve(OptionsBuilder);
        const actual = builder.build(options);

        expect(actual).toEqual({env});
    });

    it("Returns shell options", () => {
        const cwd = undefined;
        const env = {};
        const shell = "bash";
        const windowsHide = undefined;
        const options = {options: {cwd, env, shell, windowsHide}};

        const builder = resolve(OptionsBuilder);
        const actual = builder.build(options);

        expect(actual).toEqual({shell});
    });

    it("Returns windowsHide options", () => {
        const cwd = undefined;
        const env = {};
        const shell = undefined;
        const windowsHide = true;
        const options = {options: {cwd, env, shell, windowsHide}};

        const builder = resolve(OptionsBuilder);
        const actual = builder.build(options);

        expect(actual).toEqual({windowsHide});
    });

});
