import { NextResponse } from 'next/server';
import axios from 'axios';

const personalAccessToken = process.env.COZE_PERSONAL_ACCESS_TOKEN as string;
const botId = process.env.COZE_BOT_ID as string;

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { conversation_id, query } = data;

        const response = await axios({
            method: 'post',
            url: 'https://api.coze.com/open_api/v2/chat',
            data: {
                bot_id: botId,
                conversation_id,
                user: 'Reader',
                query,
                stream: true,
            },
            headers: {
                Authorization: `Bearer ${personalAccessToken}`,
                'Content-Type': 'application/json',
                Accept: '*/*',
                Host: 'api.coze.com',
                Connection: 'keep-alive',
            },
            responseType: 'stream',
        });



        return new NextResponse(response.data,{ status: 200 });

    } catch (error) {
        console.error('Request error:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
