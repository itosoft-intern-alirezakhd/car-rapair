import InitializeController from './initializeController.js'

export default new(class loginOTPController extends InitializeController {

    async loginWithOTP(req, res, next) {
        try {
            let {
                number,
                optionalLoginToken
            } = req.body;
            const data = await this.helper.otpGenerate(number);
            const {
                configToken,
                configVerify
            } = this.helper;
            const response = await this.helper.axios(configToken.method, configToken.url, configToken.headers, configToken.data)
            console.log(response);
            configVerify.headers["x-sms-ir-secure-token"] = response.data['TokenKey']
            const result = await this.helper.axios(configVerify.method, configVerify.url, configVerify.headers, data)
            console.log(result);
            await this.model.Otp.deleteMany({
                number: number
            })
            this.ok(res, null, result.data.Message, result.data.IsSuccessful)
        } catch (error) {
            next(error)
        }
    };


})()