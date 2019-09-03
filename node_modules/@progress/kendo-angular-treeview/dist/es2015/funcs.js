/**
 * @hidden
 * Performs the right-to-left function composition. Functions must have a unary.
 */
export const compose = (...args) => (data) => args.reduceRight((acc, curr) => curr(acc), data);
