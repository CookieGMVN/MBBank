export interface CaptchaResponse {
    refNo: string,
    result: {
        message: string,
        responseCode: string,
        ok: boolean
    },
    imageString: string
}