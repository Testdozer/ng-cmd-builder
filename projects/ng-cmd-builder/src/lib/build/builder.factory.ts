import { BuilderOutput } from "@angular-devkit/architect";
import { BUILDER_OPTIONS } from "./injection-tokens/options.injection-token";
import { typeofInjectionToken } from "../injector/typeof-injection-token";
import { BUILDER_CONTEXT } from "../injector/builder-context.injection-token";
import { OptionsBuilder } from "./options.builder";
import { ProcessProvider } from "./process.provider";
import { StdioOptions } from "child_process";

export class BuilderFactory {
    constructor(private readonly options: typeofInjectionToken<typeof BUILDER_OPTIONS>,
                private readonly context: typeofInjectionToken<typeof BUILDER_CONTEXT>,
                private readonly processProvider: ProcessProvider,
                private readonly optionsBuilder: OptionsBuilder) {
    }

    async create(): Promise<BuilderOutput> {
        const {command, args} = this.options;
        try {
            const options = {...this.optionsBuilder.build(this.options), stdio: "inherit" as StdioOptions};
            const ps = this.processProvider.create(command, args ?? [], options);

            return new Promise(resolve => {
                ps.on("close", e => resolve({success: e === 0}));
            });
        } catch (err) {
            this.context.logger.error(err.message);
            return {success: false};
        }
    }
}
