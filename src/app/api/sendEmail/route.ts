import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const personalEmail = "ismail.feham64@gmail.com";

export async function POST(request: Request) {
    console.log(process.env.SENDGRID_API_KEY)
    try {
        const data = await request.json();
        const { from, name, message, company } = data;
        const email = {
            to: personalEmail,
            from: personalEmail,
            subject: `New email from ${name} - ${company}`,
            text: message,
            html: `<p>${message}   ${from}</p>`
        };


        console.log(email);

        const response = await sgMail.send(email);
        console.log('response', response);
        return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: `Error sending email: ${error.message}` }, { status: 500 });
    }
}
