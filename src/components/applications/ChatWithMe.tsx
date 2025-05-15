"use client";
import React, { forwardRef, useCallback, useEffect } from "react";
import { Message, useChat } from "ai/react";
import { motion } from "framer-motion";
import useResizeObserver from "@react-hook/resize-observer";
import { useAlert } from "@/components/alerts/AlertProvider";

const ChatWithMe = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "../api/chatWithMe",
      initialMessages: [
        {
          id: "0",
          role: "assistant",
          content:
            "Hello! I am [BOT] Ismail Feham and I am here to help you with anything you need. How can I help you today?",
        },
      ],
    });
  const messageContainerRef = React.useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const scrollBarBorderRef = React.useRef<HTMLDivElement>(null);
  const scrollBarClassNames =
    "scrollbar scrollbar-thumb-retro-dark scrollbar-track-transparent scrollbar-corner-retro-dark scrollbar-track-rounded-none";
  const { alert } = useAlert();

  const checkOverflow = useCallback(() => {
    if (!messageContainerRef || !messageContainerRef.current) return;
    const cont = messageContainerRef.current;
    const scrollBarBorder = scrollBarBorderRef.current;
    setIsOverflowing(cont.scrollHeight > cont.clientHeight);
  }, []);

  useResizeObserver(messageContainerRef, checkOverflow);

  useEffect(() => {
    if (isLoading) {
      messageContainerRef.current?.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "auto",
      });
    }
  }, [isLoading, messages]);

  useEffect(() => {
    if (error) {
      alert(
        error.name,
        "Uncaught OpenAI error. Please try again later.",
        "error",
      ).catch(console.error);
    }
  }, [error]);

  return (
    <div
      className={
        "w-[600px] h-[650px] overflow-hidden font-pixolde text-retro-dark flex flex-col items-center justify-center "
      }
      ref={ref}
    >
      <div
        className={
          "w-full flex h-[78px] py-4 items-center justify-center bg-retro-medium border-retro-dark border-b-3"
        }
      >
        <h1 className={"mt-0 py-3 text-3xl w-fit -mb-4 "}>Chat with me 🤖</h1>
      </div>
      <div
        className={`flex-grow flex-row overflow-y-auto overflow-x-hidden ${scrollBarClassNames} py-1 w-full ${isOverflowing ? "pl-[2px] pr-2" : ""}`}
        ref={messageContainerRef}
      >
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            message={message}
            role={message.role === "user" ? "user" : "bot"}
            isLoading={isLoading && index === messages.length - 1}
          />
        ))}
        {isOverflowing && (
          <div
            className={
              "absolute z-200 h-[calc(100%-160px)] top-[104px] right-[16px] bg-retro-dark w-[3px] scrollbar-right-border"
            }
            ref={scrollBarBorderRef}
          />
        )}
      </div>
      <form
        className={"w-full flex flex-row border-t-3 border-0 border-retro-dark"}
        onSubmit={handleSubmit}
      >
        <input
          className={
            "h-full flex-1 border-r-3 border-retro-dark outline-none text-[24px] px-2 bg-retro-white text-retro-dark"
          }
          type={"text"}
          name={"prompt"}
          value={input}
          onChange={handleInputChange}
        />
        <button
          className={
            "h-full pl-[14px] pr-[16px] text-[24px] font-bold ml-auto max-w-[70px] border-0 outline-none"
          }
          type={"submit"}
        >
          Send
        </button>
      </form>
    </div>
  );
});

interface ChatBubbleProps {
  message: Message;
  role: "user" | "bot";
  isLoading: boolean;
}

const ChatBubble = (props: ChatBubbleProps) => {
  const { message, role, isLoading } = props;

  const symbols = ["|", "/", "-", "\\"];
  const [symbolIndex, setSymbolIndex] = React.useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSymbolIndex((prevIndex) => (prevIndex + 1) % symbols.length);
    }, 200); // Change symbol every 200ms

    return () => clearInterval(intervalId);
  }, [symbols.length]);

  return (
    <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }}>
      <div
        className={`w-full flex flex-row ${role === "user" ? "justify-end" : "justify-start"} p-2`}
      >
        <div
          className={`flex flex-row gap-2 ${role === "user" ? "flex-row-reverse" : "flex-row"}`}
        >
          <div
            className={`mt-[1px] flex items-center justify-center min-h-8 max-h-8 min-w-8 max-w-8 rounded-full p-1 bg-retro-dark`}
          >
            <span className={"mt-[4px]"}>{role === "user" ? "👤" : "🤖"}</span>
          </div>
          <div
            className={`bg-retro-${role === "user" ? "medium-dark" : "medium"} rounded-lg py-2 px-3`}
          >
            <p
              className={`mt-1 text-[24px] text-retro-${role === "user" ? "light" : "dark"}`}
            >
              {message.content}{" "}
              {isLoading && role !== "user" && symbols[symbolIndex]}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

ChatWithMe.displayName = "ChatWithMe";

export default ChatWithMe;
