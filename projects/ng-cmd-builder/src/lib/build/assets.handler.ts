import { BuilderOutput } from "@angular-devkit/architect";
import { typeofInjectionToken } from "../injector/typeof-injection-token";
import { BUILDER_OPTIONS } from "./injection-tokens/options.injection-token";
import { BUILDER_CONTEXT } from "../injector/builder-context.injection-token";
import { COPY } from "./injection-tokens/copy.injection-token";
import { Inject } from "@angular/core";

export class AssetsHandler {
    constructor(
        @Inject(BUILDER_OPTIONS)
        private readonly options: typeofInjectionToken<typeof BUILDER_OPTIONS>,
        @Inject(BUILDER_CONTEXT)
        private readonly context: typeofInjectionToken<typeof BUILDER_CONTEXT>,
        @Inject(COPY)
        private readonly cpx: typeofInjectionToken<typeof COPY>) {
    }

    handle({success}: BuilderOutput): Promise<BuilderOutput> {
        if (success === false) {
            return Promise.resolve<BuilderOutput>({success});
        }
        const assets = this.options.assets ?? [];
        return new Promise<BuilderOutput>(resolve => {
            for (const asset of assets) {
                const {source, dest, options} = asset;
                this.cpx(source, dest, options, ((error: Error | null) => {
                    if (error) {
                        this.context.logger.error(error.message);
                        resolve({success: false});
                    }
                }));
            }

            resolve({success});
        });

    }
}

