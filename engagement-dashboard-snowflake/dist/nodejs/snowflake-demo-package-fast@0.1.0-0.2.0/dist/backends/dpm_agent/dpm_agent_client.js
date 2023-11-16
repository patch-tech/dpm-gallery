"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeClient = exports.DpmAgentClient = void 0;
const grpc_js_1 = require("@grpc/grpc-js");
require("process");
const field_1 = require("../../field");
const field_expr_1 = require("../../field_expr");
const version_1 = require("../../version");
const dpm_agent_grpc_pb_1 = require("./dpm_agent_grpc_pb");
const dpm_agent_pb_1 = require("./dpm_agent_pb");
function makeDpmLiteral(literal) {
    let makeLiteral = (x) => {
        const dpmLit = new dpm_agent_pb_1.Query.Literal();
        if (typeof x === 'string') {
            return dpmLit.setString(x);
        }
        else if (typeof x === 'number') {
            return Number.isInteger(x) ? dpmLit.setI64(x) : dpmLit.setF64(x);
        }
        else if (typeof x === 'boolean') {
            return dpmLit.setBoolean(x);
        }
        // Must be a Date type.
        return dpmLit.setTimestamp(+x);
    };
    if (Array.isArray(literal.value)) {
        return new dpm_agent_pb_1.Query.Literal().setList(new dpm_agent_pb_1.Query.Literal.List().setValuesList(literal.value.map(makeLiteral)));
    }
    return makeLiteral(literal.value);
}
function makeDpmFieldReference(field) {
    return new dpm_agent_pb_1.Query.FieldReference().setFieldname(field.operands()[0].toString());
}
const aggregateOperatorMap = {
    min: dpm_agent_pb_1.Query.AggregateExpression.AggregateOperator.MIN,
    max: dpm_agent_pb_1.Query.AggregateExpression.AggregateOperator.MAX,
    sum: dpm_agent_pb_1.Query.AggregateExpression.AggregateOperator.SUM,
    count: dpm_agent_pb_1.Query.AggregateExpression.AggregateOperator.COUNT,
    countDistinct: dpm_agent_pb_1.Query.AggregateExpression.AggregateOperator.COUNT_DISTINCT,
    avg: dpm_agent_pb_1.Query.AggregateExpression.AggregateOperator.MEAN,
    avgDistinct: dpm_agent_pb_1.Query.AggregateExpression.AggregateOperator.MEAN, // dpm-agent uses Ibis, which does not support distinct mean.
};
function makeDpmAggregateExpression(aggExpr) {
    const baseField = aggExpr.operands()[0];
    const baseDpmExpr = makeDpmExpression(baseField);
    const aggOp = aggExpr.operator();
    const dpmAggOp = aggregateOperatorMap[aggOp];
    if (dpmAggOp === undefined) {
        throw new Error(`Unsupported aggregate operation ${aggOp}`);
    }
    return new dpm_agent_pb_1.Query.AggregateExpression()
        .setArgument(baseDpmExpr)
        .setOp(dpmAggOp);
}
const projectionOperatorMap = {
    day: dpm_agent_pb_1.Query.DerivedExpression.ProjectionOperator.DAY,
    month: dpm_agent_pb_1.Query.DerivedExpression.ProjectionOperator.MONTH,
    year: dpm_agent_pb_1.Query.DerivedExpression.ProjectionOperator.YEAR,
    hour: dpm_agent_pb_1.Query.DerivedExpression.ProjectionOperator.HOUR,
    minute: dpm_agent_pb_1.Query.DerivedExpression.ProjectionOperator.MINUTE,
    second: dpm_agent_pb_1.Query.DerivedExpression.ProjectionOperator.SECOND,
    millisecond: dpm_agent_pb_1.Query.DerivedExpression.ProjectionOperator.MILLISECOND,
};
function makeDpmDerivedExpression(derivedField) {
    const baseField = derivedField.operands()[0];
    const baseDpmExpr = makeDpmExpression(baseField);
    const projectionOp = derivedField.operator();
    const dpmProjectionOp = projectionOperatorMap[projectionOp];
    if (projectionOp === undefined) {
        throw new Error(`Unsupported projection operation ${projectionOp}`);
    }
    return new dpm_agent_pb_1.Query.DerivedExpression()
        .setArgument(baseDpmExpr)
        .setOp(dpmProjectionOp);
}
function makeDpmExpression(field) {
    if (field instanceof field_1.LiteralField) {
        return new dpm_agent_pb_1.Query.Expression().setLiteral(makeDpmLiteral(field));
    }
    else if (field instanceof field_expr_1.AggregateFieldExpr) {
        return new dpm_agent_pb_1.Query.Expression().setAggregate(makeDpmAggregateExpression(field));
    }
    else if (field instanceof field_1.DerivedField) {
        return new dpm_agent_pb_1.Query.Expression().setDerived(makeDpmDerivedExpression(field));
    }
    else if (field.operator() !== 'ident') {
        throw new Error(`Unexpected field expression ${field}`);
    }
    return new dpm_agent_pb_1.Query.Expression().setField(makeDpmFieldReference(field));
}
function makeDpmGroupByExpression(field) {
    if (field instanceof field_1.DerivedField) {
        return new dpm_agent_pb_1.Query.GroupByExpression().setDerived(makeDpmDerivedExpression(field));
    }
    else if (field.operator() !== 'ident') {
        throw new Error(`Unexpected field expression in groupBy: ${field}`);
    }
    return new dpm_agent_pb_1.Query.GroupByExpression().setField(makeDpmFieldReference(field));
}
function makeDpmSelectExpression(field) {
    const selectExpr = new dpm_agent_pb_1.Query.SelectExpression().setArgument(makeDpmExpression(field));
    if (field.alias !== undefined) {
        return selectExpr.setAlias(field.alias);
    }
    return selectExpr;
}
const booleanOperatorMap = {
    and: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.AND,
    or: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.OR,
    eq: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.EQ,
    neq: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.NEQ,
    gt: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.GT,
    gte: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.GTE,
    lt: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.LT,
    lte: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.LTE,
    like: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.LIKE,
    between: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.BETWEEN,
    in: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.IN,
    // TODO(PAT-3175, PAT-3176): Define once we support unary not.
    not: undefined,
    // TODO(PAT-3355): Remove `inPast` once we redefine it in terms of a `between` check.
    inPast: undefined,
    isNull: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.IS_NULL,
    isNotNull: dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator.IS_NOT_NULL,
};
function makeDpmBooleanExpression(filter) {
    const BooleanOperator = dpm_agent_pb_1.Query.BooleanExpression.BooleanOperator;
    let op = filter.operator();
    if (op === 'and' || op === 'or') {
        const args = filter.operands().map((expr) => {
            const boolExpr = makeDpmBooleanExpression(expr);
            return new dpm_agent_pb_1.Query.Expression().setCondition(boolExpr);
        });
        return new dpm_agent_pb_1.Query.BooleanExpression()
            .setOp(booleanOperatorMap[op])
            .setArgumentsList(args);
    }
    const dpmBooleanOp = booleanOperatorMap[op];
    if (dpmBooleanOp === undefined) {
        throw new Error(`Unhandled boolean operator ${op}`);
    }
    const args = filter
        .operands()
        .map((expr) => makeDpmExpression(expr));
    return new dpm_agent_pb_1.Query.BooleanExpression()
        .setOp(dpmBooleanOp)
        .setArgumentsList(args);
}
function makeDpmOrderByExpression(ordering) {
    const [fieldExpr, direction] = ordering;
    return new dpm_agent_pb_1.Query.OrderByExpression()
        .setArgument(makeDpmExpression(fieldExpr))
        .setDirection(direction === 'ASC'
        ? dpm_agent_pb_1.Query.OrderByExpression.Direction.ASC
        : dpm_agent_pb_1.Query.OrderByExpression.Direction.DESC);
}
/**
 * DpmAgentClient uses a gRPC client to compile and execute queries by using the
 * `dpm-agent` which routes the queries to the specific source specified in the
 * query's package descriptor.
 */
class DpmAgentClient {
    client;
    dpmAuthToken;
    metadata;
    /**
     * Makes a query message from the table expression to send to dpm-agent.
     * @param query Table expression
     * @returns Query RPC message to send to dpm-agent.
     */
    async makeDpmAgentQuery(query) {
        const dpmAgentQuery = new dpm_agent_pb_1.Query();
        const id = new dpm_agent_pb_1.Query.Id().setPackageid(query.packageId);
        dpmAgentQuery.setId(id);
        const clientVersion = new dpm_agent_pb_1.ClientVersion()
            .setClient(dpm_agent_pb_1.ClientVersion.Client.NODE_JS)
            .setDatasetversion(query.datasetVersion)
            .setCodeversion(version_1.codeVersion);
        dpmAgentQuery.setClientversion(clientVersion);
        dpmAgentQuery.setSelectfrom(query.name);
        const { filterExpr: filter, selection, ordering: orderBy, limitTo: limit, } = query;
        const selections = selection?.map(makeDpmSelectExpression);
        if (selections) {
            dpmAgentQuery.setSelectList(selections);
        }
        // Process filter.
        if (filter) {
            dpmAgentQuery.setFilter(makeDpmBooleanExpression(filter));
        }
        // Process any groupings defined in selection.
        if (selection?.findIndex((fieldExpr) => fieldExpr instanceof field_expr_1.AggregateFieldExpr) !== -1) {
            const grouping = selection?.filter((fieldExpr) => !(fieldExpr instanceof field_expr_1.AggregateFieldExpr));
            if (grouping) {
                dpmAgentQuery.setGroupbyList(grouping.map(makeDpmGroupByExpression));
            }
        }
        // Process orderBy.
        if (orderBy !== undefined && orderBy.length > 0) {
            const dpmOrderings = orderBy.map(makeDpmOrderByExpression);
            dpmAgentQuery.setOrderbyList(dpmOrderings);
        }
        if (limit > 0) {
            dpmAgentQuery.setLimit(limit);
        }
        return Promise.resolve(dpmAgentQuery);
    }
    constructor(client, dpmAuthToken) {
        this.client = client;
        this.dpmAuthToken = dpmAuthToken;
        this.metadata = new grpc_js_1.Metadata();
        this.metadata.set('dpm-auth-token', this.dpmAuthToken);
    }
    /**
     * Compiles table expression using dpm-agent.
     * @param query Table expression to compile.
     * @returns Promise that resolves to the compiled query string obtained from
     * dpm-agent, or rejects on error.
     */
    async compile(query) {
        const dpmAgentQuery = await this.makeDpmAgentQuery(query);
        dpmAgentQuery.setDryrun(true);
        return new Promise((resolve, reject) => {
            this.client.executeQuery(dpmAgentQuery, this.metadata, (error, response) => {
                if (error) {
                    console.log('dpm-agent client: Error compiling query...', error);
                    reject(new Error('Error compiling query', { cause: error }));
                }
                else {
                    resolve(response.getQuerystring());
                }
            });
        });
    }
    /**
     * Executes table expression using dpm-agent.
     * @param query Table expression to execute.
     * @returns Promise that resolves to the executed query results obtained from
     * dpm-agent, or rejects on error.
     */
    async execute(query) {
        const dpmAgentQuery = await this.makeDpmAgentQuery(query);
        return new Promise((resolve, reject) => {
            this.client.executeQuery(dpmAgentQuery, this.metadata, (error, response) => {
                if (error) {
                    console.log('dpm-agent client: Error executing query...', error);
                    reject(new Error('Error executing query', { cause: error }));
                }
                else {
                    let jsonData = [];
                    try {
                        jsonData = JSON.parse(response.getJsondata());
                    }
                    catch (e) {
                        console.log('dpm-agent: Error parsing results', e);
                        reject(new Error('Error parsing JSON', { cause: e }));
                    }
                    resolve(jsonData);
                }
            });
        });
    }
}
exports.DpmAgentClient = DpmAgentClient;
// A cache of gRPC client containers keyed by service address so we create a
// single client per service address.
let grpcClientForAddress = {};
/**
 * A factory for creating DpmAgentClient instances that share a single gRPC client to a
 * given service address.
 *
 * @param dpmAgentServiceAddress A valid URL string pointing to a `dpm-agent` server,
 *    E.g., 'http://localhost:50051', 'https://agent.dpm.sh')
 * @param dpmAuthToken The token to authenticate with `dpm-agent`. Obtained using `dpm login`.
 * @returns A DpmAgentClient instance.
 */
function makeClient({ dpmAgentServiceAddress, dpmAuthToken, }) {
    let grpcClient;
    if (dpmAgentServiceAddress in grpcClientForAddress) {
        grpcClient = grpcClientForAddress[dpmAgentServiceAddress];
    }
    else {
        console.log('Attempting to connect to', dpmAgentServiceAddress);
        let channelCreds = grpc_js_1.credentials.createInsecure();
        let dpmAgentUrl = new URL(dpmAgentServiceAddress);
        // If the service address has an `https` scheme, or has port 443, use a secure channel.
        if (dpmAgentUrl.protocol === 'https:' || dpmAgentUrl.port === '443') {
            channelCreds = grpc_js_1.credentials.createSsl();
        }
        grpcClient = new dpm_agent_grpc_pb_1.DpmAgentClient(dpmAgentUrl.host, // Must use the n/w location (i.e. {hostname}[:{port}] only).
        channelCreds);
        grpcClientForAddress[dpmAgentServiceAddress] = grpcClient;
    }
    return new DpmAgentClient(grpcClient, dpmAuthToken);
}
exports.makeClient = makeClient;
