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
         * Hide the subprocess console window that would normally be created on Windows systems.
         */
        windowsHide?: boolean;
    };
}
