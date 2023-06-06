"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
function setEnvValue(key, value) {
    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs_1.default.readFileSync(".env", "utf8").split(os_1.default.EOL);
    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        // (?<!#\s*)   Negative lookbehind to avoid matching comments (lines that starts with #).
        //             There is a double slash in the RegExp constructor to escape it.
        // (?==)       Positive lookahead to check if there is an equal sign right after the key.
        //             This is to prevent matching keys prefixed with the key of the env var to update.
        const keyValRegex = new RegExp(`(?<!#\\s*)${key}(?==)`);
        return line.match(keyValRegex);
    }));
    // if key-value pair exists in the .env file,
    if (target !== -1) {
        // replace the key/value with the new value
        ENV_VARS.splice(target, 1, `${key}=${value}`);
    }
    else {
        // if it doesn't exist, add it instead
        ENV_VARS.push(`${key}=${value}`);
    }
    // write everything back to the file system
    fs_1.default.writeFileSync(".env", ENV_VARS.join(os_1.default.EOL));
}
exports.default = setEnvValue;
//# sourceMappingURL=updateEnv.js.map