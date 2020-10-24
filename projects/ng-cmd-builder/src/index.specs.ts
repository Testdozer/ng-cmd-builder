/* tslint:disable:no-var-requires */
/* tslint:disable: no-require-imports */
import { EqualMatchingInjectorConfig, Mock } from "moq.ts";
import "reflect-metadata";

const Jasmine = require("jasmine");
/* tslint:enable: no-require-imports */
/* tslint:enable:no-var-requires */

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
    spec_dir: "./",
    spec_files: [
        "**/*.[sS]pec.js"
    ]
});

Mock.options = {injectorConfig: new EqualMatchingInjectorConfig()};
jasmine.execute();
