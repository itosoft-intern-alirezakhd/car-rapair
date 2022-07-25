import Otp from "../models/otp-model.js"
import otpGenerator from 'otp-generator'
import bcrypt from 'bcrypt'


export const otpGenerate = async (number)=>{
    const OTPCode = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    })
    const otp = Otp({
        number: number,
        otp: OTPCode
    })
    const salt = await bcrypt.genSalt(10)
    otp.otp = await bcrypt.hash(otp.otp, salt)
    await otp.save()
    console.log(OTPCode)
    const data = {
        code: OTPCode,
        mobileNumber: number
    };

    return data
}