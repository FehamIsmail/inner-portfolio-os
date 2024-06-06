import { NextResponse } from 'next/server';
import axios from 'axios';

export const runtime = 'edge'; // or 'nodejs' which uses Serverless Functions
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const botId = process.env.COZE_BOT_ID as string;
const personalAccessToken = process.env.COZE_PERSONAL_ACCESS_TOKEN as string;

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { conversation_id, query } = data;

        const response = await axios.post('https://api.coze.com/open_api/v2/chat', {
            query,
            stream: true,
            bot_id: botId,
            user: 'Reader',
            conversation_id
        }, {
            headers: {
                Authorization: `Bearer ${personalAccessToken}`,
                'Content-Type': 'application/json',
                'Host': 'api.coze.com',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            },
            responseType: 'stream'
        });


        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            start(controller) {
                iterateData(response.data, controller, encoder);
            }
        });

        return new Response(readableStream, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });


        // console.log(readableStream);




    } catch (error) {
        console.error('Request error:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}

export async function GET() {
    // This encoder will stream your text
    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode('Basic Streaming Test'));
            controller.close();
        },
    });

    return new Response(customReadable, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}

async function iterateData(
    data: any,
    controller: ReadableStreamDefaultController<string>,
    encoder: TextEncoder
) {
    for await (const chunk of data) {
        console.log(chunk.toString());
        // @ts-ignore
        controller.enqueue(encoder.encode(chunk.toString()));
    }
    controller.close();
}
