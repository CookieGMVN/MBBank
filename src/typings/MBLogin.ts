/**
 * Typing for login captcha response.
 */
export interface CaptchaResponse {
    /** Request reference number. */
    refNo: string,
    /** Request result. */
    result: {
        /** The message of the result. */
        message: string,
        /** Response code of the result. */
        responseCode: string,
        /** If the status OK. */
        ok: boolean
    },
    /** The image string, encoded in Base64. */
    imageString: string
}