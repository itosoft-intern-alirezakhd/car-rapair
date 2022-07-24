export const configVerify = {
    method: 'post',
    url: 'https://RestfulSms.com/api/VerificationCode',
    headers: {
        'Content-Type': 'application/json'
    }
};

export const configToken = {
    method: 'post',
    url: 'https://RestfulSms.com/api/Token',
    headers: {
        'Content-Type': 'application/json'
    },
    data: {
        UserApiKey: "53db357b34e813bc49e9357b",
        SecretKey: "123456789"
    }
};

export const  DATABASE_URL = `mongodb://localhost/salamatKhodro`



