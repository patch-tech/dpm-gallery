export namespace DpmAgentService {
    namespace executeQuery {
        export let path: string;
        export let requestStream: boolean;
        export let responseStream: boolean;
        export let requestType: typeof dpm_agent_pb.Query;
        export let responseType: typeof dpm_agent_pb.QueryResult;
        export { serialize_dpm_agent_Query as requestSerialize };
        export { deserialize_dpm_agent_Query as requestDeserialize };
        export { serialize_dpm_agent_QueryResult as responseSerialize };
        export { deserialize_dpm_agent_QueryResult as responseDeserialize };
    }
}
export const DpmAgentClient: grpc.ServiceClientConstructor;
import dpm_agent_pb = require("./dpm_agent_pb.js");
declare function serialize_dpm_agent_Query(arg: any): Buffer;
declare function deserialize_dpm_agent_Query(buffer_arg: any): dpm_agent_pb.Query;
declare function serialize_dpm_agent_QueryResult(arg: any): Buffer;
declare function deserialize_dpm_agent_QueryResult(buffer_arg: any): dpm_agent_pb.QueryResult;
import grpc = require("@grpc/grpc-js");
export {};
