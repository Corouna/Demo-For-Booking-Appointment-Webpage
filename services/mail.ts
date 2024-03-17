import nodemailer from 'nodemailer';

interface EmailProps {
    to: string;
    subject: string;
    text: string;
    html?: string;
    icsContent?: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, text, html, icsContent }: EmailProps) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, 
    to, 
    subject, 
    text,
    html,
    ...(icsContent && {
      attachments: [
        {
          filename: 'appointment.ics',
          content: icsContent,
          contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
        },
      ],
    }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
