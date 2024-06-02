import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendEmailWithSendGrid =
    async (to: string = 'ismail.feham64@gmail.com,',
           from: string,
           name: string,
           message: string,
           company?: string,
           ) =>
    {
        const msg = {
            to,
            from,
            subject: `New message from ${name} at ${company || 'Unknown'}`,
            text: message,
        };
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent');
            })
            .catch((error) => {
                console.error(error);
            });
    }
