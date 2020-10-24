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
    /**
     *  List of assets are copied with cpx
     */
    assets?: {
        /**
         * A file glob of copy targets.
         */
        source: string;
        /**
         * A file path of a destination directory.
         */
        dest: string;
        options?: {
            /**
             * The flag to remove files that copied on past before copy.
             */
            clean?: boolean;
            /**
             * The flag to follow symbolic links when copying from them.
             */
            dereference?: boolean;
            /**
             * The flag to copy empty directories which is matched with the glob.
             */
            includeEmptyDirs?: boolean;
            /**
             * The flag to not copy at the initial time of watch.
             */
            initialCopy?: boolean;
            /**
             * The flag to copy uid, gid, atime, and mtime of files.
             */
            preserve?: boolean;
            /**
             * The flag to not overwrite files on destination if the source file is older.
             */
            update?: boolean;
        };
    }[];
}
