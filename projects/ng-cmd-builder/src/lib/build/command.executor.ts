import { BuilderOutput } from "@angular-devkit/architect";
import { OptionsBuilder } from "./options.builder";
import { ProcessProvider } from "./process.provider";
import { StdioOptions } from "child_process";
import { CommandOptions } from "./schema";
import { Injectable } from "@angular/core";

@Injectable()
export class CommandExecutor {
    constructor(
        private readonly processProvider: ProcessProvider,
        private readonly optionsBuilder: OptionsBuilder) {
    }

    async run(commandOptions: CommandOptions): Promise<BuilderOutput> {
        const {command, args} = commandOptions;
        const options = {...this.optionsBuilder.build(commandOptions), stdio: "inherit" as StdioOptions};
        const ps = this.processProvider.create(command, args ?? [], options);

        return new Promise((resolve, reject) => {
            ps.on("close", e => e === 0 ? resolve(undefined) : reject(undefined));
        });
    }
}
