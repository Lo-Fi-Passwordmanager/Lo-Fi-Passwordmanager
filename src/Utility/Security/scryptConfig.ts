/**
 * File that is used to define the parameters for scrypt.
 * Reduces load during testing.
 */
export const SCRYPT_PARAMS = {
    N: import.meta.env.MODE === 'test' ? 2 ** 10 : 2 ** 18,
    r: 8,
    p: 1,
}