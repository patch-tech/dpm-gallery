export type Scalar = string | number | boolean | Date;
export type UnaryOperator = 'isNull' | 'isNotNull';
export type BooleanOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'and' | 'or' | 'not' | 'like' | 'in' | 'inPast';
export type ArithmeticOperator = '+' | '-' | '*' | '/';
export type AggregateOperator = 'min' | 'max' | 'sum' | 'count' | 'countDistinct' | 'avg' | 'avgDistinct';
export type DateOperator = 'day' | 'month' | 'year';
export type TimeOperator = 'hour' | 'minute' | 'second' | 'millisecond';
export type ProjectionOperator = DateOperator | TimeOperator;
export type DateGranularity = 'years' | 'months' | 'weeks' | 'days';
export type TimeGranularity = 'hours' | 'minutes' | 'seconds' | 'millis';
export type DateTimeGranularity = DateGranularity | TimeGranularity;
export type Operator = UnaryOperator | BooleanOperator | ArithmeticOperator | AggregateOperator | ProjectionOperator | 'ident';
export type Expr = FieldExpr | Scalar | Scalar[];
/**
 *  A tree of expressions, each of which has an associated name.
 */
export declare abstract class FieldExpr {
    name: string;
    alias?: string;
    constructor(name: string);
    toString(): string;
    abstract operator(): Operator;
    abstract operands(): Expr[];
}
/**
 * A binary boolean expression. Can be combined with other boolean expressions
 * using `and`, `or` methods.
 */
export declare class BooleanFieldExpr extends FieldExpr {
    field: FieldExpr;
    op: BooleanOperator;
    other: FieldExpr;
    constructor(field: FieldExpr, op: BooleanOperator, other: FieldExpr);
    operator(): Operator;
    operands(): Expr[];
    and(that: BooleanFieldExpr | UnaryBooleanFieldExpr): BooleanFieldExpr;
    or(that: BooleanFieldExpr | UnaryBooleanFieldExpr): BooleanFieldExpr;
}
/**
 * A unary boolean expression.
 * E.g., a null check on a field can be expressed using a UnaryBooleanFieldExpr:
 * ```
 * const nameField = new Field<string>('name');
 * const isNameNotNull = new UnaryBooleanFieldExpr(nameField, 'isNotNull');
 * ```
 */
export declare class UnaryBooleanFieldExpr extends FieldExpr {
    field: FieldExpr;
    op: UnaryOperator;
    constructor(field: FieldExpr, op: UnaryOperator);
    operator(): Operator;
    operands(): Expr[];
    and(that: BooleanFieldExpr | UnaryBooleanFieldExpr): BooleanFieldExpr;
    or(that: BooleanFieldExpr | UnaryBooleanFieldExpr): BooleanFieldExpr;
}
/**
 * A field expression to represent an aggregation applied on a field expression.
 * E.g., a sum of a field can be expressed as:
 * ```
 * const price = new Field<number>('price');
 * const totalPrice = new AggregateFieldExpr<number>(price, 'sum');
 * ```
 */
export declare class AggregateFieldExpr<T> extends FieldExpr {
    private field;
    private op;
    constructor(field: FieldExpr, op: AggregateOperator);
    operator(): Operator;
    operands(): Expr[];
    /**
     * Alias this expression. This method is useful when the aggregate expression
     * is defined in a `select` and must be referred to in a subsequent `orderBy`.
     * E.g.,
     * ```
     * let query = MyTable
     *    .select(name, price.sum().as('totalPrice'))
     *    .orderBy(['totalPrice', 'DESC'])
     *    .limit(10);
     * ```
     * @param alias
     * @returns
     */
    as(alias: string): AggregateFieldExpr<T>;
}
