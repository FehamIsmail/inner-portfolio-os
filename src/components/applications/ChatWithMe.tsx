"use client"
import React, {forwardRef} from 'react';
import Button from "@/components/common/Button";
import axios from "axios";
import {useAlert} from "@/components/utils/AlertProvider";

interface Message {
    content: string;
    from: 'user' | 'bot';
}

const botId = process.env.COZE_BOT_ID as string;
const personalAccessToken = process.env.COZE_PERSONAL_ACCESS_TOKEN as string;

const ChatWithMe = forwardRef<HTMLDivElement, {}>((props, ref) => {
    const [conversationId, setConversationId] = React.useState<string | undefined>(undefined)
    const [messages, setMessages] = React.useState<Message[]>([])
    const [input, setInput] = React.useState<string>("")
    const {alert} = useAlert()
    const sendMessage = async () => {
        const response = await axios.post('/api/chatWithMe', {
            query: input,
            conversation_id: conversationId
        },
            {
                responseType: 'stream',
            }
        );

        const reader = response.data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        let message = "";
        while (!done) {
            const { value, done: readerDone } = await reader.read();
            console.log(value, readerDone)
            if (readerDone) {
                done = true;
                break;
            }
            message += decoder.decode(value);
        }
    };

    return (
        <div className={"w-[500px] h-[600px] overflow-hidden font-pixolde text-retro-dark flex flex-col items-center justify-center "}
             ref={ref}>
              <h1 className={"mt-0 py-3 text-3xl bg-retro-medium w-full  flex items-center justify-center leading-relaxed "}>Chat with me</h1>
            <h1>
                Application is under construction
            </h1>
              <div className={"flex-grow "}>

              </div>
              <div className={"w-full flex flex-row border-t-3 border-0 border-retro-dark"}>
                  <input
                      className={"h-full flex-1 border-r-3 border-retro-dark outline-none text-[24px] px-2 bg-retro-white text-retro-dark"}
                      type={"text"}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                  />
                  <button className={"h-full pl-[14px] pr-[16px] text-[24px] font-bold ml-auto max-w-[70px] border-0 outline-none"} onClick={
                      (e: any) => {
                          e.preventDefault()
                         sendMessage()
                     }
                 }>Send
                 </button>
            </div>
        </div>
    );
})

interface ChatBubbleProps {
    message: Message;
}

const ChatBubble = (props: ChatBubbleProps) => {

}

ChatWithMe.displayName = 'ChatWithMe';



export default ChatWithMe;