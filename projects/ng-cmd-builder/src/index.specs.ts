import { EqualMatchingInjectorConfig, Mock } from "moq.ts";
import "reflect-metadata";

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/naming-convention */
const Jasmine = require("jasmine");
/* eslint-enable @typescript-eslint/no-require-imports */
/* eslint-enable @typescript-eslint/no-var-requires */
/* eslint-enable @typescript-eslint/naming-convention */

const jasmine = new Jasmine({}) as any;
jasmine.configureDefaultReporter({
    print: arg => {
        if (arg !== "[32m.[0m") {
            process.stdout.write(arg);
        }
    },
    showColors: true
});

jasmine.loadConfig({
    /* eslint-disable @typescript-eslint/naming-convention */
    spec_dir: "./",
    spec_files: [
        "**/*.[sS]pec.js"
    ]
    /* eslint-enable @typescript-eslint/naming-convention */
});

Mock.options = {injectorConfig: new EqualMatchingInjectorConfig()};
jasmine.execute();
