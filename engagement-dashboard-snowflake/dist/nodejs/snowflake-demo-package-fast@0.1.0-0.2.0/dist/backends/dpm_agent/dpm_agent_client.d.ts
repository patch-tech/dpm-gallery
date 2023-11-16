import { Table } from '../../table';
import { Backend } from '../interface';
import 'process';
import { DpmAgentClient as DpmAgentGrpcClient } from './dpm_agent_grpc_pb';
type ServiceAddress = string;
/**
 * DpmAgentClient uses a gRPC client to compile and execute queries by using the
 * `dpm-agent` which routes the queries to the specific source specified in the
 * query's package descriptor.
 */
export declare class DpmAgentClient implements Backend {
    private client;
    private dpmAuthToken;
    private metadata;
    /**
     * Makes a query message from the table expression to send to dpm-agent.
     * @param query Table expression
     * @returns Query RPC message to send to dpm-agent.
     */
    private makeDpmAgentQuery;
    constructor(client: DpmAgentGrpcClient, dpmAuthToken: string);
    /**
     * Compiles table expression using dpm-agent.
     * @param query Table expression to compile.
     * @returns Promise that resolves to the compiled query string obtained from
     * dpm-agent, or rejects on error.
     */
    compile(query: Table): Promise<string>;
    /**
     * Executes table expression using dpm-agent.
     * @param query Table expression to execute.
     * @returns Promise that resolves to the executed query results obtained from
     * dpm-agent, or rejects on error.
     */
    execute<Row extends object>(query: Table): Promise<Row[]>;
}
/**
 * A factory for creating DpmAgentClient instances that share a single gRPC client to a
 * given service address.
 *
 * @param dpmAgentServiceAddress A valid URL string pointing to a `dpm-agent` server,
 *    E.g., 'http://localhost:50051', 'https://agent.dpm.sh')
 * @param dpmAuthToken The token to authenticate with `dpm-agent`. Obtained using `dpm login`.
 * @returns A DpmAgentClient instance.
 */
export declare function makeClient({ dpmAgentServiceAddress, dpmAuthToken, }: {
    dpmAgentServiceAddress: ServiceAddress;
    dpmAuthToken: string;
}): DpmAgentClient;
export {};
