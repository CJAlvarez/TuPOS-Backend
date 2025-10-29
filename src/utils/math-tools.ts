import { create, all, BigNumber } from 'mathjs';
/**
 * High-precision math utilities using mathjs and BigNumber.
 * All functions return number for easy use in business logic.
 */
const math = create(all, { number: 'BigNumber', precision: 20 });

/**
 * Adds multiple numbers with high precision.
 * @param numbers Numbers to add
 * @returns Sum of all numbers
 */
export function add(...numbers: number[]): number {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return numbers[0];
  
  let result = math.bignumber(numbers[0]);
  for (let i = 1; i < numbers.length; i++) {
    result = math.add(result, math.bignumber(numbers[i]));
  }
  return math.number(result);
}

/**
 * Subtracts multiple numbers with high precision.
 * @param minuend The number to subtract from
 * @param subtrahends Numbers to subtract
 * @returns Result of minuend - sum(subtrahends)
 */
export function sub(minuend: number, ...subtrahends: number[]): number {
  if (subtrahends.length === 0) return minuend;
  
  let result = math.bignumber(minuend);
  for (const subtrahend of subtrahends) {
    result = math.subtract(result, math.bignumber(subtrahend));
  }
  return math.number(result);
}

/**
 * Returns the minimum of multiple numbers with high precision.
 * @param numbers Numbers to compare
 * @returns The smallest value among all numbers
 */
export function min(...numbers: number[]): number {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return numbers[0];
  
  let result = math.bignumber(numbers[0]);
  for (let i = 1; i < numbers.length; i++) {
    result = math.min(result, math.bignumber(numbers[i]));
  }
  return math.number(result);
}

/**
 * Returns the maximum of multiple numbers with high precision.
 * @param numbers Numbers to compare
 * @returns The largest value among all numbers
 */
export function max(...numbers: number[]): number {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return numbers[0];
  
  let result = math.bignumber(numbers[0]);
  for (let i = 1; i < numbers.length; i++) {
    result = math.max(result, math.bignumber(numbers[i]));
  }
  return math.number(result);
}

/**
 * Compares two numbers for equality with high precision.
 * @param a First number
 * @param b Second number
 * @returns true if equal, false otherwise
 */
export function eq(a: number, b: number): boolean {
  const result = math.equal(math.bignumber(a), math.bignumber(b));
  return typeof result === 'boolean' ? result : false;
}

/**
 * Multiplies multiple numbers with high precision.
 * @param numbers Numbers to multiply
 * @returns Product of all numbers
 */
export function mul(...numbers: number[]): number {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return numbers[0];
  
  let result = math.multiply(math.bignumber(numbers[0]), math.bignumber(numbers[1]));
  for (let i = 2; i < numbers.length; i++) {
    result = math.multiply(result, math.bignumber(numbers[i]));
  }
  return result instanceof math.bignumber(0).constructor
    ? (result as BigNumber).toNumber()
    : Number(result);
}

/**
 * Divides two numbers with high precision.
 * @param a Dividend
 * @param b Divisor
 * @returns Quotient of a / b
 */
export function div(a: number, b: number): number {
  const result = math.divide(math.bignumber(a), math.bignumber(b));
  return result instanceof math.bignumber(0).constructor
    ? (result as BigNumber).toNumber()
    : Number(result);
}

/**
 * Calculates a^b with high precision.
 * @param a Base
 * @param b Exponent
 * @returns a raised to the power of b
 */
export function pow(a: number, b: number): number {
  const result = math.pow(math.bignumber(a), math.bignumber(b));
  return result instanceof math.bignumber(0).constructor
    ? (result as BigNumber).toNumber()
    : Number(result);
}

/**
 * Calcula la cuota fija del método francés de amortización.
 * cuota = P * [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]
 * Donde:
 * @param principal Monto del préstamo (P)
 * @param rate Tasa de interés por periodo (r)
 * @param periods Número total de periodos (n)
 * @returns Cuota periódica
 */
export function calculateFrenchInstallment(
  principal: number,
  rate: number,
  periods: number,
): number {
  const P = math.bignumber(principal);
  const r = math.bignumber(rate);
  const n = math.bignumber(periods);
  const onePlusR = math.add(1, math.divide(r, 100));
  const powOnePlusR = math.pow(onePlusR, n);
  const numerator = math.multiply(
    P,
    math.multiply(math.divide(r, 100), powOnePlusR),
  );
  const denominator = math.subtract(powOnePlusR, 1);
  const cuota = math.divide(numerator, denominator);
  return cuota instanceof math.bignumber(0).constructor
    ? (cuota as BigNumber).toNumber()
    : Number(cuota);
}
