import { Twilio } from 'twilio';
import { twilio } from './config';

const client = new Twilio(twilio.accountSid, twilio.authToken);

// eslint-disable-next-line import/prefer-default-export
export const sendSms = (to: string, body: string, txt: string): void => {
  try {
    client.messages
      .create({
        body: `BlogDev ${txt} - ${body}`,
        from: twilio.from,
        to,
      })
      // eslint-disable-next-line no-console
      .then((message) => console.log(message.sid));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
