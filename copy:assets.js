const cpx = require("cpx");

const target = "./dist/ng-cmd-builder";
const source = "./projects/ng-cmd-builder";

cpx.copy(`README.md`, `${target}`);
cpx.copy(`${source}/package.json`, `${target}`);
cpx.copy(`${source}/builders.json`, `${target}`);
cpx.copy(`${source}/src/lib/build/schema.json`, `${target}/lib/build`);
cpx.copy(`${source}/src/lib/build/schema.d.ts`, `${target}/lib/build`);
