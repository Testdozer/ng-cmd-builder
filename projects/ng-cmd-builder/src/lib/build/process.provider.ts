import { SpawnOptions } from "child_process";
import { typeofInjectionToken } from "../injector/typeof-injection-token";
import { SPAWN } from "./injection-tokens/spawn.injection-token";
import { PROCESS } from "./injection-tokens/process.injection-token";
import { CONSOLE } from "./injection-tokens/console.injection-token";

export class ProcessProvider {
    constructor(private spawn: typeofInjectionToken<typeof SPAWN>,
                private process: typeofInjectionToken<typeof PROCESS>,
                private console: typeofInjectionToken<typeof CONSOLE>) {
    }

    create(command: string, args: string[], options: SpawnOptions) {
        const ps = this.spawn(command, args, options);

        this.process.on("SIGINT", () => ps.kill("SIGTERM"));
        this.process.on("SIGTERM", () => ps.kill("SIGTERM"));
        ps.on("error", error => this.console.error(error));
        return ps;
    }
}
