const DECRYPTION_ERROR_NAME = "DecryptionError";
const DECRYPTION_ERROR_MESSAGE = "Decryption failed";
/**
 * Error that is thrown when decryption fails through the use of a wrong key
 * @author urnzq
 */
export class DecryptionError extends Error{
    constructor() {
        super(DECRYPTION_ERROR_MESSAGE);
        this.name = DECRYPTION_ERROR_NAME;
    }
}