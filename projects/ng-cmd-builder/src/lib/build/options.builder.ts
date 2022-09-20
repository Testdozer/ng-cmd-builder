import { CommandOptions } from "./schema";
import { SpawnOptions } from "child_process";

export class OptionsBuilder {
    build({options: {shell, env, windowsHide, cwd}}: CommandOptions) {

        const options = {} as SpawnOptions;
        if (cwd !== undefined) {
            options.cwd = cwd;
        }
        if (Reflect.ownKeys(env).length > 0) {
            options.env = env;
        }
        if (shell !== undefined) {
            options.shell = shell;
        }
        if (windowsHide !== undefined) {
            options.windowsHide = windowsHide;
        }
        return options;
    }
}

