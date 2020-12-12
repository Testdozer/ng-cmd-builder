import { BuilderOutput } from "@angular-devkit/architect";
import { TypeOfInjectionToken } from "../injector/typeof-injection-token";
import { BUILDER_OPTIONS } from "./injection-tokens/options.injection-token";
import { BUILDER_CONTEXT } from "../injector/builder-context.injection-token";
import { COPY } from "./injection-tokens/copy.injection-token";
import { Inject } from "@angular/core";

export class AssetsHandler {
    constructor(
        @Inject(BUILDER_OPTIONS)
        private readonly options: TypeOfInjectionToken<typeof BUILDER_OPTIONS>,
        @Inject(BUILDER_CONTEXT)
        private readonly context: TypeOfInjectionToken<typeof BUILDER_CONTEXT>,
        @Inject(COPY)
        private readonly cpx: TypeOfInjectionToken<typeof COPY>) {
    }

    handle({success}: BuilderOutput): Promise<BuilderOutput> {
        if (success === false) {
            return Promise.resolve<BuilderOutput>({success});
        }
        const assets = this.options.assets ?? [];
        return new Promise<BuilderOutput>(resolve => {
            for (const asset of assets) {
                const {source, dest, options} = asset;
                try {
                    this.cpx(source, dest, options);
                } catch (error) {
                    this.context.logger.error(error.message);
                    resolve({success: false});
                }
            }

            resolve({success});
        });
    }
}

