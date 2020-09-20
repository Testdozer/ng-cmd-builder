import { BuilderContext, BuilderOutput, createBuilder } from "@angular-devkit/architect";
import { JsonObject } from "@angular-devkit/core";
import { spawn } from "child_process";
import { Schema } from "./schema";

async function _builder(
    options: JsonObject & Schema,
    context: BuilderContext,
): Promise<BuilderOutput> {
    const {command, args} = options;
    try {
        const ps = spawn(command, args ?? [], {...options.options, stdio: "inherit"});

        function shutdown() {
            ps.kill("SIGTERM");
        }

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
        return new Promise(resolve => {
            ps.on("close", e => resolve({success: e === 0}));
        });
    } catch (err) {
        context.logger.error(err.message);
        return {success: false};
    }
}

export default createBuilder(_builder);
