import { createInjector, resolve } from "../../tests.components/resolve.builder";
import { SPAWN } from "./injection-tokens/spawn.injection-token";
import { PROCESS } from "./injection-tokens/process.injection-token";
import { ProcessProvider } from "./process.provider";
import { ChildProcess } from "child_process";
import { CONSOLE } from "./injection-tokens/console.injection-token";

describe("Process provider", () => {
    beforeEach(() => {
        const spawn = jasmine.createSpy();
        const process = jasmine.createSpyObj<NodeJS.Process>(["on"]);
        const console = jasmine.createSpyObj<Console>(["error"]);

        createInjector([
            {provide: SPAWN, useValue: spawn, deps: []},
            {provide: PROCESS, useValue: process, deps: []},
            {provide: CONSOLE, useValue: console, deps: []},
            {provide: ProcessProvider, useClass: ProcessProvider, deps: [SPAWN, PROCESS, CONSOLE]},
        ]);
    });

    it("Returns child process", () => {
        const command = "command";
        const args = [];
        const options = {};
        const process = jasmine.createSpyObj<ChildProcess>(["on"]);

        resolve(SPAWN)
            .withArgs(command, args, options)
            .and.returnValue(process);

        const provider = resolve(ProcessProvider);
        const actual = provider.create(command, args, options);

        expect(actual).toBe(process);
    });

    it("Kills process on SIGINT", () => {
        const command = "command";
        const args = [];
        const options = {};
        const process = jasmine.createSpyObj<ChildProcess>(["on", "kill"]);

        resolve(SPAWN)
            .withArgs(command, args, options)
            .and.returnValue(process);

        resolve(PROCESS)
            .on
            .and.callFake((event, listener) => {
            if (event === "SIGINT") {
                listener();
            }
        });

        const provider = resolve(ProcessProvider);
        provider.create(command, args, options);

        expect(process.kill).toHaveBeenCalledWith("SIGTERM");
    });

    it("Logs errors with console", () => {
        const command = "command";
        const args = [];
        const options = {};
        const error = new Error();
        const process = jasmine.createSpyObj<ChildProcess>(["on", "kill"]);

        resolve(SPAWN)
            .withArgs(command, args, options)
            .and.returnValue(process);

        process
            .on
            .and.callFake((event: string, listener: (...args) => void) => {
            if (event === "error") {
                listener(error);
            }
            return process as ChildProcess;
        });

        const provider = resolve(ProcessProvider);
        provider.create(command, args, options);

        const console = resolve(CONSOLE);
        expect(console.error).toHaveBeenCalledWith(error);
    });

});
