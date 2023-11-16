/**
 * Returns the value of the environment variable `name`, if found. Else, returns
 * `defaultValue` if provided, undefined otherwise.
 * @param name Name of environment variable.
 * @param defaultValue
 * @returns Value of environment variable, else specified defaultValue or undefined.
 */
export declare function getEnv(name: string, defaultValue?: string): string;
