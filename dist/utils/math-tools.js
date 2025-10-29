"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = add;
exports.sub = sub;
exports.min = min;
exports.max = max;
exports.eq = eq;
exports.mul = mul;
exports.div = div;
exports.pow = pow;
exports.calculateFrenchInstallment = calculateFrenchInstallment;
const mathjs_1 = require("mathjs");
const math = (0, mathjs_1.create)(mathjs_1.all, { number: 'BigNumber', precision: 20 });
function add(...numbers) {
    if (numbers.length === 0)
        return 0;
    if (numbers.length === 1)
        return numbers[0];
    let result = math.bignumber(numbers[0]);
    for (let i = 1; i < numbers.length; i++) {
        result = math.add(result, math.bignumber(numbers[i]));
    }
    return math.number(result);
}
function sub(minuend, ...subtrahends) {
    if (subtrahends.length === 0)
        return minuend;
    let result = math.bignumber(minuend);
    for (const subtrahend of subtrahends) {
        result = math.subtract(result, math.bignumber(subtrahend));
    }
    return math.number(result);
}
function min(...numbers) {
    if (numbers.length === 0)
        return 0;
    if (numbers.length === 1)
        return numbers[0];
    let result = math.bignumber(numbers[0]);
    for (let i = 1; i < numbers.length; i++) {
        result = math.min(result, math.bignumber(numbers[i]));
    }
    return math.number(result);
}
function max(...numbers) {
    if (numbers.length === 0)
        return 0;
    if (numbers.length === 1)
        return numbers[0];
    let result = math.bignumber(numbers[0]);
    for (let i = 1; i < numbers.length; i++) {
        result = math.max(result, math.bignumber(numbers[i]));
    }
    return math.number(result);
}
function eq(a, b) {
    const result = math.equal(math.bignumber(a), math.bignumber(b));
    return typeof result === 'boolean' ? result : false;
}
function mul(...numbers) {
    if (numbers.length === 0)
        return 0;
    if (numbers.length === 1)
        return numbers[0];
    let result = math.multiply(math.bignumber(numbers[0]), math.bignumber(numbers[1]));
    for (let i = 2; i < numbers.length; i++) {
        result = math.multiply(result, math.bignumber(numbers[i]));
    }
    return result instanceof math.bignumber(0).constructor
        ? result.toNumber()
        : Number(result);
}
function div(a, b) {
    const result = math.divide(math.bignumber(a), math.bignumber(b));
    return result instanceof math.bignumber(0).constructor
        ? result.toNumber()
        : Number(result);
}
function pow(a, b) {
    const result = math.pow(math.bignumber(a), math.bignumber(b));
    return result instanceof math.bignumber(0).constructor
        ? result.toNumber()
        : Number(result);
}
function calculateFrenchInstallment(principal, rate, periods) {
    const P = math.bignumber(principal);
    const r = math.bignumber(rate);
    const n = math.bignumber(periods);
    const onePlusR = math.add(1, math.divide(r, 100));
    const powOnePlusR = math.pow(onePlusR, n);
    const numerator = math.multiply(P, math.multiply(math.divide(r, 100), powOnePlusR));
    const denominator = math.subtract(powOnePlusR, 1);
    const cuota = math.divide(numerator, denominator);
    return cuota instanceof math.bignumber(0).constructor
        ? cuota.toNumber()
        : Number(cuota);
}
//# sourceMappingURL=math-tools.js.map