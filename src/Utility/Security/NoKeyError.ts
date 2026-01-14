
const NO_KEY_NAME = "NoKeyError";
/**
 * Error that is thrown when the key is null while an encryption or decryption is attempted.
 * @author urnzq
 */
export class NoKeyError extends Error{
    constructor(message: string) {
        super(message);
        this.name = NO_KEY_NAME;
    }
}