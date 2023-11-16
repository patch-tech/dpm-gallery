"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
const process_1 = require("process");
/**
 * Returns the value of the environment variable `name`, if found. Else, returns
 * `defaultValue` if provided, undefined otherwise.
 * @param name Name of environment variable.
 * @param defaultValue
 * @returns Value of environment variable, else specified defaultValue or undefined.
 */
function getEnv(name, defaultValue) {
    const value = process_1.env[name];
    if (value === undefined) {
        if (defaultValue) {
            return defaultValue;
        }
        else {
            throw new Error(`Undefined env variable: ${name}`);
        }
    }
    return value;
}
exports.getEnv = getEnv;
