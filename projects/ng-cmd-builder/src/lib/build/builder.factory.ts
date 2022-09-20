import { BuilderOutput } from "@angular-devkit/architect";
import { CommandExecutor } from "./command.executor";
import { Inject } from "@angular/core";
import { BUILDER_OPTIONS } from "./injection-tokens/options.injection-token";
import { BUILDER_CONTEXT } from "./injection-tokens/builder-context.injection-token";
import { TypeofInjectionToken } from "@testdozer/ng-injector-types";

export class BuilderFactory {
    constructor(
        @Inject(BUILDER_OPTIONS)
        private readonly options: TypeofInjectionToken<typeof BUILDER_OPTIONS>,
        @Inject(BUILDER_CONTEXT)
        private readonly context: TypeofInjectionToken<typeof BUILDER_CONTEXT>,
        private readonly executor: CommandExecutor) {
    }

    async create(): Promise<BuilderOutput> {
        const {commands} = this.options;
        try {
            for (const command of commands) {
                this.context.logger.info(`Executing: ${command.command}`);
                await this.executor.run(command);
            }
        } catch {
            return {success: false};
        }
        return {success: true};
    }
}
