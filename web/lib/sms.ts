export const sendSMS = async (to: string, message: string) => {
    console.log(`[SMS_MOCK] Sending to ${to}: ${message}`);

    // In production, this would use Twilio or Gupshup
    // const client = require('twilio')(accountSid, authToken);
    // await client.messages.create({ body: message, from: '+1234567890', to });

    return { success: true, sid: "mock_sid_" + Date.now() };
};
