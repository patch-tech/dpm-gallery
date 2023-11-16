"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBackend = exports.getDpmAuthToken = void 0;
/**
 * Factory to create an execution backend instance.
 */
const env_1 = require("./env");
const fs = __importStar(require("fs"));
const os_1 = __importDefault(require("os"));
const node_path_1 = __importDefault(require("node:path"));
const dpm_agent_client_1 = require("./dpm_agent/dpm_agent_client");
/**
 * Discovers the `dpm` authentication token by inspecting:
 * 1. Environment variable DPM_AUTH_TOKEN
  * 2. The session.json file stored by `dpm login`.
  * 3. ...
  */
function getDpmAuthToken() {
    try {
        let dpmAuthToken = (0, env_1.getEnv)('DPM_AUTH_TOKEN', undefined);
        if (dpmAuthToken !== undefined) {
            return dpmAuthToken;
        }
    }
    catch {
        let rootDir = os_1.default.homedir();
        let sessionPath = '';
        if (process.platform == 'darwin') {
            sessionPath = node_path_1.default.join(rootDir, 'Library', 'Application Support', 'tech.patch.dpm', 'session.json');
        }
        else if (process.platform == 'win32') {
            sessionPath = node_path_1.default.join(rootDir, 'AppData', 'Roaming', 'patch', 'session.json');
        }
        else if (process.platform == 'linux') {
            sessionPath = node_path_1.default.join(rootDir, '.config', 'dpm', 'session.json');
        }
        try {
            const sessionString = fs.readFileSync(sessionPath, 'utf-8');
            const sessionData = JSON.parse(sessionString);
            return sessionData.access_token;
        }
        catch (err) {
            console.error("error recieving access token from project directory:", err);
        }
    }
}
exports.getDpmAuthToken = getDpmAuthToken;
/**
 * Makes an instance of the backend that can communicate with `dpm-agent` to
 * compile and execute queries.
 * @returns A Backend instance.
 */
function makeBackend() {
    const dpmAuthToken = getDpmAuthToken();
    if (dpmAuthToken === undefined) {
        throw new Error('Failed to find DPM authentication token. Please run `dpm login`');
    }
    const dpmAgentServiceAddress = (0, env_1.getEnv)('DPM_AGENT_URL', 'https://agent.dpm.sh');
    return (0, dpm_agent_client_1.makeClient)({ dpmAgentServiceAddress, dpmAuthToken });
}
exports.makeBackend = makeBackend;
