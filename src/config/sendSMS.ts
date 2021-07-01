import { Twilio } from 'twilio';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';
import { twilio } from './config';

const client = new Twilio(twilio.accountSid, twilio.authToken);

export const sendSms = (to: string, body: string, txt: string): void => {
  try {
    client.messages
      .create({
        body: `BlogDev ${txt} - ${body}`,
        from: twilio.from,
        to,
      })
      .then((message) => {
        throw new Error(message.sid);
      });
  } catch (error) {
    throw new Error(error);
  }
};

export const smsOTP = async (to: string, channel: string): Promise<VerificationInstance> => {
  try {
    const data = await client.verify
      .services(twilio.serviceID)
      .verifications.create({ to, channel });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const smsVerify = async (to: string, code: string): Promise<VerificationCheckInstance> => {
  try {
    const data = await client.verify
      .services(twilio.serviceID)
      .verificationChecks.create({ to, code });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
