/**
 * Options for CMD Builder
 */
export interface Schema {
    /**
     * The command to run.
     */
    command: string;
    /**
     * List of string arguments.
     */
    args?: string[];
    /**
     * Environment key-value pairs.
     */
    options?: {
        env?: { [name: string]: string; };
        /**
         * Current working directory
         */
        cwd?: string;
        /**
         * <boolean> | <string> If true, runs command inside of a shell. Uses '/bin/sh' on Unix, and process.env.ComSpec on Windows.
         * A different shell can be specified as a string. See Shell requirements and Default Windows shell. Default: true.
         */
        shell: string;
        /**
         * Hide the subprocess console window that would normally be created on Windows systems.
         */
        windowsHide?: boolean;
    };
}
