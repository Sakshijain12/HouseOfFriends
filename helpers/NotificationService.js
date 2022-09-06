const config = require('../common/common');
const client = require('twilio')(config.twilo.TWILIO_SID, config.twilo.TWILIO_AUTH);


exports.sentMessageViaTwilio = async (msg, country_code, phone_number) => {
    try {
        let response =    await client.messages.create({
            body: msg,
            messagingServiceSid: config.twilo.MessagingServiceSid,
            to: country_code + phone_number,
        })

        console.log(response , " twilio response")

    } catch (e) {
        throw new Error(e.message)
    }
}