"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateFieldExpr = exports.UnaryBooleanFieldExpr = exports.BooleanFieldExpr = exports.FieldExpr = void 0;
/**
 *  A tree of expressions, each of which has an associated name.
 */
class FieldExpr {
    // A human-readable representation of the expression. Use this to refer to the
    // expression in a `select` or `orderBy`.
    name;
    // User-specified alias for expression. Can be used in a `select` and then in
    // a subsequent `orderBy`.
    alias;
    constructor(name) {
        this.name = name;
    }
    toString() {
        return this.name;
    }
}
exports.FieldExpr = FieldExpr;
/**
 * A binary boolean expression. Can be combined with other boolean expressions
 * using `and`, `or` methods.
 */
class BooleanFieldExpr extends FieldExpr {
    field;
    op;
    other;
    constructor(field, op, other) {
        super(`(${field.name} ${op} ${other.name})`);
        this.field = field;
        this.op = op;
        this.other = other;
    }
    operator() {
        return this.op;
    }
    operands() {
        return [this.field, this.other];
    }
    and(that) {
        return new BooleanFieldExpr(this, 'and', that);
    }
    or(that) {
        return new BooleanFieldExpr(this, 'or', that);
    }
}
exports.BooleanFieldExpr = BooleanFieldExpr;
/**
 * A unary boolean expression.
 * E.g., a null check on a field can be expressed using a UnaryBooleanFieldExpr:
 * ```
 * const nameField = new Field<string>('name');
 * const isNameNotNull = new UnaryBooleanFieldExpr(nameField, 'isNotNull');
 * ```
 */
class UnaryBooleanFieldExpr extends FieldExpr {
    field;
    op;
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
    and(that) {
        return new BooleanFieldExpr(this, 'and', that);
    }
    or(that) {
        return new BooleanFieldExpr(this, 'or', that);
    }
}
exports.UnaryBooleanFieldExpr = UnaryBooleanFieldExpr;
/**
 * A field expression to represent an aggregation applied on a field expression.
 * E.g., a sum of a field can be expressed as:
 * ```
 * const price = new Field<number>('price');
 * const totalPrice = new AggregateFieldExpr<number>(price, 'sum');
 * ```
 */
class AggregateFieldExpr extends FieldExpr {
    field;
    op;
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
    as(alias) {
        let copy = new AggregateFieldExpr(this.field, this.op);
        copy.alias = alias;
        return copy;
    }
}
exports.AggregateFieldExpr = AggregateFieldExpr;
// TODO(PAT-3177): Define ArithmeticFieldExpr?
