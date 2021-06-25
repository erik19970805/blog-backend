import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { google } from './config';

// send email
const sendEmail = async (
  to: string,
  url: string,
  txt: string,
): Promise<SMTPTransport.SentMessageInfo | undefined> => {
  const oAuth2Client = new OAuth2Client(
    google.clientID,
    google.clientSecret,
    google.oauthPlayground,
  );
  oAuth2Client.setCredentials({ refresh_token: google.refreshToken });
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: google.senderEmailAddress,
        clientId: google.clientID,
        clientSecret: google.clientSecret,
        refreshToken: google.refreshToken,
        accessToken: accessToken as string,
      },
    });

    const mailOptions = {
      from: google.senderEmailAddress,
      to,
      subject: 'BlogDev',
      html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Aqui esta su verificacion de correo electrónico</h2>
        <p>¡Felicidades! Ya casi está listo para comenzar a usar BlogDEV.
        Simplemente haga clic en el botón de abajo para validar su dirección de correo electrónico.
        </p>
        
        <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
    
        <p>Si el botón no funciona por algún motivo, también puede hacer clic en el enlace a continuación:</p>
    
        <div>${url}</div>
        </div>
      `,
    };
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return undefined;
  }
};

export default sendEmail;
