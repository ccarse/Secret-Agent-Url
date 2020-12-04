import * as nodemailer from 'nodemailer';

import { EmailConfig } from "ConfigTypes";

export function send_email(emailConfig: EmailConfig, subject: string, bodyText: string) {
  
  try {
    const emailTransporter = nodemailer.createTransport(emailConfig.smtp);

    const mailOptions = {
        from: emailConfig.options.fromEmailAddress,
        to: emailConfig.options.toEmailAddress,
        subject,
        text: bodyText
    };

    emailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email delivery error:" + error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
  } catch (error) {
      console.log("Unhandled email delivery error:" + error);
  }
}
