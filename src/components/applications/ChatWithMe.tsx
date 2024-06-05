import React, {forwardRef} from 'react';
import Button from "@/components/common/Button";
import axios from "axios";
import {useAlert} from "@/components/utils/AlertProvider";

interface Message {
    content: string;
    from: 'user' | 'bot';
}

const ChatWithMe = forwardRef<HTMLDivElement, {}>((props, ref) => {
    const [conversationId, setConversationId] = React.useState<string | undefined>(undefined)
    const [messages, setMessages] = React.useState<Message[]>([])
    const [input, setInput] = React.useState<string>("")
    const { alert } = useAlert()
    const sendMessage = async () => {
        const response = await axios.post('/api/chatWithMe', {
            conversation_id: conversationId,
            query: input
        })

        const readerResponse = response.data;
        let accumulator = "";
        for await (const chunk of readerResponse) {
            accumulator += chunk;
            console.log(accumulator);
        }
    }

    return (
        <div className={" w-full h-[500px] font-pixolde text-retro-dark flex flex-col items-center justify-center overflow-hidden"} ref={ref}>
            <h1 className={"text-3xl"}>Chat with me</h1>
            <div className={"flex-grow "}>

            </div>
            <div className={"h-[30px] w-full flex flex-row border-t-3 border-retro-dark"}>
                <input
                    type={"text"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={"h-full flex-1 border-r-3 border-retro-dark outline-none px-2 bg-retro-white text-retro-dark font-bold"}
                />
                <Button className={"h-full ml-auto w-[70px] border-0"} label={"Test"} onClick={
                    (e:any) => {
                        e.preventDefault()
                        sendMessage()
                    }
                }/>
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