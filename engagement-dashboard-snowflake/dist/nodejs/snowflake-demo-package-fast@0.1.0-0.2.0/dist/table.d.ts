import { Backend } from './backends/interface';
import { BooleanFieldExpr, FieldExpr, UnaryBooleanFieldExpr } from './field_expr';
export type Ordering = [FieldExpr, 'ASC' | 'DESC'];
export type Selector = string | FieldExpr;
/**
 * The entry point to query building. The flow:
 *   1. Starting with an instance of `Table`, `select` columns.
 *   2. Optionally, `filter`, `orderBy`, `limit`.
 *   3. Compile and/or execute the formulated query against an execution backend.
 * N.B.: Avoid a direct instantiation of `Table`! select from one of the
 * generated table classes to obtain a Table.
 */
export declare class Table {
    readonly packageId: string;
    readonly datasetName: string;
    readonly datasetVersion: string;
    readonly source?: string;
    readonly name: string;
    private fields;
    private backend?;
    readonly filterExpr?: BooleanFieldExpr | UnaryBooleanFieldExpr;
    readonly selection?: FieldExpr[];
    readonly ordering?: Ordering[];
    readonly limitTo: number;
    private nameToField;
    constructor({ backend, packageId, datasetName, datasetVersion, source, name, fields, filterExpr, selection, ordering, limitTo, }: {
        backend?: Backend;
        packageId: string;
        datasetName: string;
        datasetVersion: string;
        source?: string;
        name: string;
        fields: FieldExpr[];
        filterExpr?: BooleanFieldExpr | UnaryBooleanFieldExpr;
        selection?: FieldExpr[];
        ordering?: Ordering[];
        limitTo?: number;
    });
    private copy;
    private selectedFieldExpr;
    private findSelectionByAlias;
    private getOrMakeBackend;
    /**
     * Sets the filter expression for the table.
     * @param expr Boolean expression to filter by.
     * @returns Copy of table with filter set.
     */
    filter(expr: BooleanFieldExpr | UnaryBooleanFieldExpr): Table;
    /**
     * Sets the fields to select from the table. Accepts a mix of field
     * expressions, and field name strings. One may specify a mix of fields,
     * derived fields, and aggregate field expressions.
     * E.g.,
     * ```
     * let query = MyTable.select(
     *   name,
     *   'CATEGORY',
     *   saleDate.month.as('saleMonth'),
     *   price.avg().as('meanPrice')
     * ).limit(10);
     * ```
     * @param selection Fields to select. Accepts both field expressions, or field name strings.
     * @returns Copy of table with field selection set.
     */
    select(...selection: Selector[]): Table;
    /**
     * Set the tables ordering columns with their sort direction. The column
     * selectors can be field expressions or strings that refer to table fields
     * aliases of selected fields.
     * E.g.,
     * ```
     * let query = MyTable.select(
     *   name,
     *   'CATEGORY',
     *   saleDate.month.as('saleMonth'),
     *   price.avg().as('meanPrice')
     * ).orderBy(['meanPrice', 'DESC'], [saleDate.month, 'ASC'])
     * .limit(10);
     * ```
     * @param ordering (selector, direction) pairs.
     * @returns Copy of table with ordering set.
     */
    orderBy(...ordering: [Selector, 'ASC' | 'DESC'][]): Table;
    /**
     * Sets the row limit on the table.
     * @param n limit value.
     * @returns Copy of table with limit set to 'n'.
     */
    limit(n: number): Table;
    /**
     * Compiles the table expression into a query string on its execution backend.
     * E.g., returns a Snowsql string for a table expression with a Snowflake
     * execution backend.
     * @returns Compiled query string.
     */
    compile(): Promise<string>;
    /**
     * Executes the table expression on its execution backend and returns a
     * promise that resolves to the results.
     * @returns Result of executing the table expression on its execution backend.
     */
    execute<Row extends object>(): Promise<Row[]>;
}
