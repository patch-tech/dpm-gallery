import { AggregateFieldExpr, BooleanFieldExpr, DateGranularity, DateTimeGranularity, Expr, FieldExpr, Operator, ProjectionOperator, Scalar, TimeGranularity, UnaryBooleanFieldExpr } from './field_expr';
/**
 * A base class to represent a field in a `Table`. Identifies the underlying DB
 * table column by its name.
 */
export declare class Field<T extends Scalar> extends FieldExpr {
    private val?;
    constructor(name: string);
    operator(): Operator;
    operands(): Expr[];
    /**
     * Alias this field.
     * E.g.,
     * ```
     * let query = MyTable
     *    .select(fieldWithLongName.as('shortName'), price)
     *    .orderBy(['shortName', 'DESC'])
     *    .limit(10);
     * ```
     * @param alias
     * @returns
     */
    as(alias: string): Field<T>;
    private asBooleanExpr;
    /**
     * Returns an `max` aggregation applied on this field.
     */
    max(): AggregateFieldExpr<T>;
    /**
     * Returns an `min` aggregation applied on this field.
     */
    min(): AggregateFieldExpr<T>;
    /**
     * Returns a `sum` aggregation applied on this field.
     */
    sum(): AggregateFieldExpr<number>;
    /**
     * Returns an `count` aggregation applied on this field.
     */
    count(): AggregateFieldExpr<number>;
    /**
     * Returns a distinct `count` aggregation applied on this field.
     */
    countDistinct(): AggregateFieldExpr<number>;
    /**
     * Returns an `average` aggregation applied on this field.
     */
    avg(): AggregateFieldExpr<number>;
    /**
     * Returns a distinct `average` aggregation applied on this field.
     */
    avgDistinct(): AggregateFieldExpr<number>;
    /**
     * Returns a boolean expression with an equality check.
     */
    eq(that: T | Field<T>): BooleanFieldExpr;
    /**
     * Returns a boolean expression with a not equal check.
     */
    neq(that: T | Field<T>): BooleanFieldExpr;
    /**
     * Returns a boolean expression with greater than (>) check.
     */
    gt(that: T | Field<T>): BooleanFieldExpr;
    /**
     * Returns a boolean expression with greater than or equal (>=) check.
     */
    gte(that: T | Field<T>): BooleanFieldExpr;
    /**
     * Returns a boolean expression with lesser than (<) check.
     */
    lt(that: T | Field<T>): BooleanFieldExpr;
    /**
     * Returns a boolean expression with lesser than or equal (<=) check.
     */
    lte(that: T | Field<T>): BooleanFieldExpr;
    /**
     * Returns a boolean expression with an array membership check. The field's
     * value must exactly match at least one entry in `that` for the check to be
     * true.
     */
    in(that: T[]): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if the field's value is in between
     * a range (inclusive of bounds).
     */
    between(minVal: T, maxVal: T): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if the field is null.
     */
    isNull(): UnaryBooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if the field is not null.
     */
    isNotNull(): UnaryBooleanFieldExpr;
}
/**
 * A literal field value. Used to represent constant RHS values in expressions.
 */
export declare class LiteralField<T extends Scalar> extends Field<T> {
    value: T | T[];
    constructor(value: T | T[]);
    operator(): Operator;
    operands(): Expr[];
    max(): never;
    min(): never;
    sum(): never;
    count(): never;
    countDistinct(): never;
    avg(): never;
    avgDistinct(): never;
}
/**
 * A string field. Defines additional operators that are specific to strings.
 */
export declare class StringField extends Field<string> {
    constructor(name: string);
    /**
     * Returns a boolean expression for a string `like` check.
     * See: https://en.wikibooks.org/wiki/Structured_Query_Language/Like_Predicate#LIKE
     * E.g.,
     * ```
     * let query = MyTable
     *    .select(name, price)
     *    .filter(name.like('%shirt%'))
     *    .limit(10);
     * ```
     * @param pattern The like pattern with wildcards: % (one or more) and _ (exactly one).
     * @returns
     */
    like(pattern: string): BooleanFieldExpr;
}
/**
 * A derived field obtained by applying a projection operator.
 * E.g.
 * ```
 * const startDateTime = new DateTimeField('started_at');
 * const startYear = new DerivedField<number, Date>(startDateTime, 'year');
 * ```
 *
 * @see {@link DateField#year}, {@link DateField#month}, {@link DateField#day}
 * for getters that return derived fields.
 */
export declare class DerivedField<T extends Scalar, U extends Scalar> extends Field<T> {
    private op;
    private field;
    constructor(field: Field<U>, op: ProjectionOperator);
    operator(): Operator;
    operands(): Expr[];
    as(alias: string): DerivedField<T, U>;
}
export declare class DateField extends Field<Date> {
    constructor(name: string);
    /**
     * Projects the date to its month.
     */
    get month(): DerivedField<number, Date>;
    /**
     * Projects the date to its day.
     */
    get day(): DerivedField<number, Date>;
    /**
     * Projects the date to its year.
     */
    get year(): DerivedField<number, Date>;
    /**
     * Returns a boolean expression that checks if this date is before `d`.
     * @param d
     */
    before(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this date is after `d`.
     * @param d
     */
    after(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this date is less than `d`.
     * @param d
     */
    lt(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this date is greater than `d`.
     * @param d
     */
    gt(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this date is equal to `d`.
     * @param d
     */
    eq(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this date is not equal to `d`.
     * @param d
     */
    neq(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this date is less than or equal to `t`.
     * @param d
     */
    lte(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this date is greater than `t` or equal to `t`.
     * @param d
     */
    gte(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that performs a relative range check of this date.
     * The range is specified by its two bounds and a granularity.
     * E.g., the filter expression below checks if the value of `startDate` lies
     * in the past 2 to 3 weeks, inclusive of bounds.
     * ```
     * let query = MyTable
     *    .select(startDate, name)
     *    .filter(startDate.inPast(2, 3, 'weeks'))
     *
     * ```
     * @param olderThan
     * @param newerThan
     * @param granularity
     */
    inPast(olderThan: number, newerThan: number, granularity: DateGranularity): BooleanFieldExpr;
}
export declare class TimeField extends Field<string> {
    constructor(name: string);
    private asValidatedBooleanExpr;
    /**
     * Projects the time to its hour.
     */
    get hour(): DerivedField<number, string>;
    /**
     * Projects the time to its minute.
     */
    get minute(): DerivedField<number, string>;
    /**
     * Projects the time to its second.
     */
    get second(): DerivedField<number, string>;
    /**
     * Returns a boolean expression that checks if this time is before `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    before(t: string): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this time is after `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    after(t: string): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this time is less than `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    lt(t: string): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this time is greater than `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    gt(t: string): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this time is equal to `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    eq(t: string): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this time is not equal to `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    neq(t: string): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this time is less than or equal
     * to `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    lte(t: string): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this time is greater than `t`
     * or equal to `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    gte(t: string): BooleanFieldExpr;
    /**
     * Returns a boolean expression that performs a relative range check of this time.
     * The range is specified by its two bounds and a granularity.
     * E.g., the filter expression below checks if the value of `startTime` lies
     * in the past 2 to 3 hours, inclusive of bounds.
     * ```
     * let query = MyTable
     *    .select(startTime, name)
     *    .filter(startTime.inPast(2, 3, 'hours'))
     *
     * ```
     * @param olderThan
     * @param newerThan
     * @param granularity
     */
    inPast(olderThan: number, newerThan: number, granularity: TimeGranularity): BooleanFieldExpr;
}
export declare class DateTimeField extends DateField {
    constructor(name: string);
    /**
     * Projects the time to its hour.
     */
    get hour(): DerivedField<number, Date>;
    /**
     * Projects the time to its minute.
     */
    get minute(): DerivedField<number, Date>;
    /**
     * Projects the time to its second.
     */
    get second(): DerivedField<number, Date>;
    /**
     * Returns a boolean expression that checks if this datetime is before `d`.
     * @param d
     */
    before(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this datetime is after `d`.
     * @param d
     */
    after(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this datetime is equal to `d`.
     * @param d
     */
    eq(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this datetime is not equal to `d`.
     * @param d
     */
    neq(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this datetime is less than or
     * equal to `t`.
     * @param d
     */
    lte(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that checks if this datetime is greater than
     * `t` or equal to `t`.
     * @param d
     */
    gte(d: Date): BooleanFieldExpr;
    /**
     * Returns a boolean expression that performs a relative range check of this datetime.
     * The range is specified by its two bounds and a granularity.
     * E.g., the filter expression below checks if the value of `startDateTime` lies
     * in the past 2 to 3 hours, inclusive of bounds.
     * ```
     * let query = MyTable
     *    .select(startDateTime, name)
     *    .filter(startDateTime.inPast(2, 3, 'hours'))
     *
     * ```
     * @param olderThan
     * @param newerThan
     * @param granularity
     */
    inPast(olderThan: number, newerThan: number, granularity: DateTimeGranularity): BooleanFieldExpr;
}
