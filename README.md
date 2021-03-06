[![Build Status](https://travis-ci.com/testdozer/ng-cmd-builder.svg?branch=master)](https://travis-ci.com/testdozer/ng-cmd-builder)
[![NPM version:latest](https://img.shields.io/npm/v/@testdozer/ng-cmd-builder/latest.svg?style=flat-square)](https://www.npmjs.com/package/@testdozer/ng-cmd-builder)
[![NPM version:next](https://img.shields.io/npm/v/@testdozer/ng-cmd-builder/next.svg?style=flat-square)](https://www.npmjs.com/package/@testdozer/ng-cmd-builder)
[![npm downloads](https://img.shields.io/npm/dt/@testdozer/ng-cmd-builder.svg?style=flat-square)](https://www.npmjs.com/package/@testdozer/ng-cmd-builder)
[![Dependency Status](http://img.shields.io/david/testdozer/ng-cmd-builder.svg?style=flat-square)](https://david-dm.org/testdozer/ng-cmd-builder)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@testdozer/ng-cmd-builder.svg)](https://www.npmjs.com/package/@testdozer/ng-cmd-builder)
[![License](https://img.shields.io/npm/l/@testdozer/ng-cmd-builder.svg)](https://www.npmjs.com/package/@testdozer/ng-cmd-builder)

This is an angular [CLI builder](https://angular.io/guide/cli-builder) that executes a cmd command. 
It runs the command with nodejs [spawn](https://nodejs.org/docs/latest/api/child_process.html#child_process_child_process_spawn_command_args_options).

At the moment schematics projects and another nodejs projects are not supported by the [angular workspace](https://angular.io/cli#workspaces-and-project-files) 
due the lack of available builders.

```bash
npm install @testdozer/ng-cmd-builder -D
```

in angular.json
```json
  "architect": {
        "build": {
          "builder": "@testdozer/ng-cmd-builder:build",
          "options": {
            "command": "npm run build:builder",
            "args": ["param"],
            "options":{
              "env": {"ENVIRONMENT_PARAM": "value"}
            },
            "assets": [
              {
                "source": "./projects/ng-cmd-builder/package.json",
                "dest": "./dist/ng-cmd-builder"
              }
            ]
          }
        }
  }
```

The builder supports options that reflect subset of [spawn](https://nodejs.org/docs/latest/api/child_process.html#child_process_child_process_spawn_command_args_options) options, and they have the same meaning.
Assets handling is implemented with [cpx](https://github.com/mysticatea/cpx) and supports the same options.
Supported [schema.json](https://github.com/Testdozer/ng-cmd-builder/blob/master/projects/ng-cmd-builder/src/lib/build/schema.json)

```typescript
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
```

> [Sponsored by 2BIT GmbH](https://www.2bit.ch)
