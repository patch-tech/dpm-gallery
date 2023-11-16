import { Backend } from './interface';
/**
 * Discovers the `dpm` authentication token by inspecting:
 * 1. Environment variable DPM_AUTH_TOKEN
  * 2. The session.json file stored by `dpm login`.
  * 3. ...
  */
export declare function getDpmAuthToken(): string | undefined;
/**
 * Makes an instance of the backend that can communicate with `dpm-agent` to
 * compile and execute queries.
 * @returns A Backend instance.
 */
export declare function makeBackend(): Backend;
