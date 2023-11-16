"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeField = exports.TimeField = exports.DateField = exports.DerivedField = exports.StringField = exports.LiteralField = exports.Field = void 0;
const field_expr_1 = require("./field_expr");
/**
 * A base class to represent a field in a `Table`. Identifies the underlying DB
 * table column by its name.
 */
class Field extends field_expr_1.FieldExpr {
    val;
    constructor(name) {
        super(name);
    }
    operator() {
        return 'ident';
    }
    operands() {
        return [this.name];
    }
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
    as(alias) {
        let copy = new Field(this.name);
        copy.alias = alias;
        return copy;
    }
    asBooleanExpr(op, that) {
        let that_ = that instanceof Field ? that : new LiteralField(that);
        return new field_expr_1.BooleanFieldExpr(this, op, that_);
    }
    /**
     * Returns an `max` aggregation applied on this field.
     */
    max() {
        return new field_expr_1.AggregateFieldExpr(this, 'max');
    }
    /**
     * Returns an `min` aggregation applied on this field.
     */
    min() {
        return new field_expr_1.AggregateFieldExpr(this, 'min');
    }
    /**
     * Returns a `sum` aggregation applied on this field.
     */
    sum() {
        return new field_expr_1.AggregateFieldExpr(this, 'sum');
    }
    /**
     * Returns an `count` aggregation applied on this field.
     */
    count() {
        return new field_expr_1.AggregateFieldExpr(this, 'count');
    }
    /**
     * Returns a distinct `count` aggregation applied on this field.
     */
    countDistinct() {
        return new field_expr_1.AggregateFieldExpr(this, 'countDistinct');
    }
    /**
     * Returns an `average` aggregation applied on this field.
     */
    avg() {
        return new field_expr_1.AggregateFieldExpr(this, 'avg');
    }
    /**
     * Returns a distinct `average` aggregation applied on this field.
     */
    avgDistinct() {
        return new field_expr_1.AggregateFieldExpr(this, 'avgDistinct');
    }
    /**
     * Returns a boolean expression with an equality check.
     */
    eq(that) {
        return this.asBooleanExpr('eq', that);
    }
    /**
     * Returns a boolean expression with a not equal check.
     */
    neq(that) {
        return this.asBooleanExpr('neq', that);
    }
    /**
     * Returns a boolean expression with greater than (>) check.
     */
    gt(that) {
        return this.asBooleanExpr('gt', that);
    }
    /**
     * Returns a boolean expression with greater than or equal (>=) check.
     */
    gte(that) {
        return this.asBooleanExpr('gte', that);
    }
    /**
     * Returns a boolean expression with lesser than (<) check.
     */
    lt(that) {
        return this.asBooleanExpr('lt', that);
    }
    /**
     * Returns a boolean expression with lesser than or equal (<=) check.
     */
    lte(that) {
        return this.asBooleanExpr('lte', that);
    }
    /**
     * Returns a boolean expression with an array membership check. The field's
     * value must exactly match at least one entry in `that` for the check to be
     * true.
     */
    in(that) {
        return this.asBooleanExpr('in', that);
    }
    /**
     * Returns a boolean expression that checks if the field's value is in between
     * a range (inclusive of bounds).
     */
    between(minVal, maxVal) {
        return this.gte(minVal).and(this.lte(maxVal));
    }
    /**
     * Returns a boolean expression that checks if the field is null.
     */
    isNull() {
        return new field_expr_1.UnaryBooleanFieldExpr(this, 'isNull');
    }
    /**
     * Returns a boolean expression that checks if the field is not null.
     */
    isNotNull() {
        return new field_expr_1.UnaryBooleanFieldExpr(this, 'isNotNull');
    }
}
exports.Field = Field;
/**
 * A literal field value. Used to represent constant RHS values in expressions.
 */
class LiteralField extends Field {
    value;
    constructor(value) {
        super(`lit(${value})`);
        this.value = value;
    }
    operator() {
        return 'ident';
    }
    operands() {
        if (Array.isArray(this.value)) {
            return this.value;
        }
        return [this.value];
    }
    max() {
        throw new SyntaxError('Cannot call max on literal field');
    }
    min() {
        throw new SyntaxError('Cannot call min on literal field');
    }
    sum() {
        throw new SyntaxError('Cannot call sum on literal field');
    }
    count() {
        throw new SyntaxError('Cannot call count on literal field');
    }
    countDistinct() {
        throw new SyntaxError('Cannot call countDistinct on literal field');
    }
    avg() {
        throw new SyntaxError('Cannot call avg on literal field');
    }
    avgDistinct() {
        throw new SyntaxError('Cannot call avgDistinct on literal field');
    }
}
exports.LiteralField = LiteralField;
/**
 * A string field. Defines additional operators that are specific to strings.
 */
class StringField extends Field {
    constructor(name) {
        super(name);
    }
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
    like(pattern) {
        return new field_expr_1.BooleanFieldExpr(this, 'like', new LiteralField(pattern));
    }
}
exports.StringField = StringField;
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
class DerivedField extends Field {
    op;
    field;
    constructor(field, op) {
        super(`(${op}(${field.name}))`);
        this.field = field;
        this.op = op;
    }
    operator() {
        return this.op;
    }
    operands() {
        return [this.field];
    }
    as(alias) {
        let copy = new DerivedField(this.field, this.op);
        copy.alias = alias;
        return copy;
    }
}
exports.DerivedField = DerivedField;
/**
 * Returns date formatted as YYYY-MM-DD.
 * See RFC3339 and https://www.w3.org/TR/NOTE-datetime
 * @param d
 * @returns The date formatted as YYYY-MM-DD
 */
function toISODateString(d) {
    // .toISOString() returns YYYY-MM-DDTHH:mm:ss.sssZ, extract the date from it.
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
    return d.toISOString().substring(0, 10);
}
/**
 * Returns whether t is a valid time string, i.e. matches HH:mm:ss[.sss]
 * @param t Time string.
 * @returns Whether t is a valid time string, i.e. matches HH:mm:ss[.sss]
 */
function isValidTimeString(t) {
    return t.match(/^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d\d\d)?$/) !== null;
}
class DateField extends Field {
    constructor(name) {
        super(name);
    }
    /**
     * Projects the date to its month.
     */
    get month() {
        return new DerivedField(this, 'month');
    }
    /**
     * Projects the date to its day.
     */
    get day() {
        return new DerivedField(this, 'day');
    }
    /**
     * Projects the date to its year.
     */
    get year() {
        return new DerivedField(this, 'year');
    }
    /**
     * Returns a boolean expression that checks if this date is before `d`.
     * @param d
     */
    before(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'lt', new LiteralField(toISODateString(d)));
    }
    /**
     * Returns a boolean expression that checks if this date is after `d`.
     * @param d
     */
    after(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'gt', new LiteralField(toISODateString(d)));
    }
    /**
     * Returns a boolean expression that checks if this date is less than `d`.
     * @param d
     */
    lt(d) {
        return this.before(d);
    }
    /**
     * Returns a boolean expression that checks if this date is greater than `d`.
     * @param d
     */
    gt(d) {
        return this.after(d);
    }
    /**
     * Returns a boolean expression that checks if this date is equal to `d`.
     * @param d
     */
    eq(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'eq', new LiteralField(toISODateString(d)));
    }
    /**
     * Returns a boolean expression that checks if this date is not equal to `d`.
     * @param d
     */
    neq(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'neq', new LiteralField(toISODateString(d)));
    }
    /**
     * Returns a boolean expression that checks if this date is less than or equal to `t`.
     * @param d
     */
    lte(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'lte', new LiteralField(toISODateString(d)));
    }
    /**
     * Returns a boolean expression that checks if this date is greater than `t` or equal to `t`.
     * @param d
     */
    gte(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'gte', new LiteralField(toISODateString(d)));
    }
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
    inPast(olderThan, newerThan, granularity) {
        if (olderThan > newerThan) {
            console.warn(`inPast specified with olderThan(${olderThan}) > newerThan(${newerThan}), swapped arguments.`);
            [olderThan, newerThan] = [newerThan, olderThan];
        }
        // TODO(PAT-3355): Generate the relative datetime ranges and use the `between` operation.
        return new field_expr_1.BooleanFieldExpr(this, 'inPast', new LiteralField([olderThan, newerThan, granularity]));
    }
}
exports.DateField = DateField;
class TimeField extends Field {
    constructor(name) {
        super(name);
    }
    asValidatedBooleanExpr(op, that) {
        if (!isValidTimeString(that)) {
            throw new Error(`Input ${that} must be in format HH:mm:ss[.sss]`);
        }
        return new field_expr_1.BooleanFieldExpr(this, op, new LiteralField(that));
    }
    /**
     * Projects the time to its hour.
     */
    get hour() {
        return new DerivedField(this, 'hour');
    }
    /**
     * Projects the time to its minute.
     */
    get minute() {
        return new DerivedField(this, 'minute');
    }
    /**
     * Projects the time to its second.
     */
    get second() {
        return new DerivedField(this, 'second');
    }
    // TODO(PAT-3291): Enable millisecond granularity once its available in the Dataset API.
    /**
     * Returns a boolean expression that checks if this time is before `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    before(t) {
        return this.asValidatedBooleanExpr('lt', t);
    }
    /**
     * Returns a boolean expression that checks if this time is after `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    after(t) {
        return this.asValidatedBooleanExpr('gt', t);
    }
    /**
     * Returns a boolean expression that checks if this time is less than `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    lt(t) {
        return this.before(t);
    }
    /**
     * Returns a boolean expression that checks if this time is greater than `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    gt(t) {
        return this.after(t);
    }
    /**
     * Returns a boolean expression that checks if this time is equal to `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    eq(t) {
        return this.asValidatedBooleanExpr('eq', t);
    }
    /**
     * Returns a boolean expression that checks if this time is not equal to `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    neq(t) {
        return this.asValidatedBooleanExpr('neq', t);
    }
    /**
     * Returns a boolean expression that checks if this time is less than or equal
     * to `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    lte(t) {
        return this.asValidatedBooleanExpr('lte', t);
    }
    /**
     * Returns a boolean expression that checks if this time is greater than `t`
     * or equal to `t`.
     * @param t Time string formatted as "HH:mm:ss[.sss]"
     */
    gte(t) {
        return this.asValidatedBooleanExpr('gte', t);
    }
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
    inPast(olderThan, newerThan, granularity) {
        if (olderThan > newerThan) {
            console.warn(`inPast specified with olderThan(${olderThan}) > newerThan(${newerThan}), swapped arguments.`);
            [olderThan, newerThan] = [newerThan, olderThan];
        }
        // TODO(PAT-3355): Generate the relative datetime ranges and use the `between` operation.
        return new field_expr_1.BooleanFieldExpr(this, 'inPast', new LiteralField([olderThan, newerThan, granularity]));
    }
}
exports.TimeField = TimeField;
class DateTimeField extends DateField {
    constructor(name) {
        super(name);
    }
    /**
     * Projects the time to its hour.
     */
    get hour() {
        return new DerivedField(this, 'hour');
    }
    /**
     * Projects the time to its minute.
     */
    get minute() {
        return new DerivedField(this, 'minute');
    }
    /**
     * Projects the time to its second.
     */
    get second() {
        return new DerivedField(this, 'second');
    }
    // TODO(PAT-3291): Enable millisecond granularity once its available in the Dataset API.
    /**
     * Returns a boolean expression that checks if this datetime is before `d`.
     * @param d
     */
    before(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'lt', new LiteralField(d.toISOString()));
    }
    /**
     * Returns a boolean expression that checks if this datetime is after `d`.
     * @param d
     */
    after(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'gt', new LiteralField(d.toISOString()));
    }
    /**
     * Returns a boolean expression that checks if this datetime is equal to `d`.
     * @param d
     */
    eq(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'eq', new LiteralField(d.toISOString()));
    }
    /**
     * Returns a boolean expression that checks if this datetime is not equal to `d`.
     * @param d
     */
    neq(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'neq', new LiteralField(d.toISOString()));
    }
    /**
     * Returns a boolean expression that checks if this datetime is less than or
     * equal to `t`.
     * @param d
     */
    lte(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'lte', new LiteralField(d.toISOString()));
    }
    /**
     * Returns a boolean expression that checks if this datetime is greater than
     * `t` or equal to `t`.
     * @param d
     */
    gte(d) {
        return new field_expr_1.BooleanFieldExpr(this, 'gte', new LiteralField(d.toISOString()));
    }
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
    inPast(olderThan, newerThan, granularity) {
        if (olderThan > newerThan) {
            console.warn(`inPast specified with olderThan(${olderThan}) > newerThan(${newerThan}), swapped arguments.`);
            [olderThan, newerThan] = [newerThan, olderThan];
        }
        // TODO(PAT-3355): Generate the relative datetime ranges and use the `between` operation.
        return new field_expr_1.BooleanFieldExpr(this, 'inPast', new LiteralField([olderThan, newerThan, granularity]));
    }
}
exports.DateTimeField = DateTimeField;
