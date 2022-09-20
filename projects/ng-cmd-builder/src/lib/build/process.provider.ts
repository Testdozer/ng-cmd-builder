import { SpawnOptions } from "child_process";
import { SPAWN } from "./injection-tokens/spawn.injection-token";
import { PROCESS } from "./injection-tokens/process.injection-token";
import { CONSOLE } from "./injection-tokens/console.injection-token";
import { Inject } from "@angular/core";
import { TypeofInjectionToken } from "@testdozer/ng-injector-types";

export class ProcessProvider {
    constructor(
        @Inject(SPAWN)
        private readonly spawn: TypeofInjectionToken<typeof SPAWN>,
        @Inject(PROCESS)
        private readonly process: TypeofInjectionToken<typeof PROCESS>,
        @Inject(CONSOLE)
        private readonly console: TypeofInjectionToken<typeof CONSOLE>) {
    }

    create(command: string, args: string[], options: SpawnOptions) {
        const ps = this.spawn(command, args, options);

        this.process.on("SIGINT", () => ps.kill("SIGTERM"));
        this.process.on("SIGTERM", () => ps.kill("SIGTERM"));
        ps.on("error", error => this.console.error(error));
        return ps;
    }
}
