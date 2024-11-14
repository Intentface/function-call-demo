"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";
import { Send, Bot, User } from "lucide-react";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Weather = ({
  city,
  temperature,
  unit,
}: {
  city: string;
  temperature: number;
  unit: "C" | "F";
}) => {
  return (
    <div className="bg-slate-300 p-3 rounded-sm">
      It is currently {temperature}°{unit} in {city}!
    </div>
  );
};

const useScrollToBottom = (dependency: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dependency]);

  return scrollRef;
};

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 10,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "getWeather") {
        const args = toolCall.args as { city: string };
        const sleep = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));
        await sleep(1000);
        console.log("on the frontend");
        return {
          city: args.city,
          // random number between 0 and 10
          temperature: Math.floor(Math.random() * 11),
          unit: "C",
        };
      }
    },
  });

  const scrollRef = useScrollToBottom(messages);

  return (
    <div className="font-[family-name:var(--font-geist-sans)] bg-[#faf7ec]">
      <div className="container mx-auto relative">
        <div className="flex flex-col h-screen py-4">
          <Card className="flex flex-grow flex-col max-h-full overflow-hidden">
            <ScrollArea className="flex-1 h-[calc(100%-100px)] p-4 py-8">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {message.role === "user" ? (
                      <Avatar>
                        <AvatarFallback>
                          <User size={24} />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarFallback>
                          <Bot size={24} />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : message.role === "function"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message?.toolInvocations?.map((tool) => (
                        <div key={tool.toolCallId}>
                          <p className="font-semibold font-mono text-xs mb-3">
                            Function: {tool.toolName}{" "}
                            {tool.state === "result" ? "✅" : "⏳"}
                          </p>
                          <p className="font-semibold font-mono text-xs">
                            Input:
                          </p>
                          <pre className="mt-2 overflow-x-auto text-xs mb-3">
                            {JSON.stringify(tool.args, null, 2)}
                          </pre>

                          <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                              <AccordionTrigger className="font-semibold font-mono text-xs mb-3">
                                Output
                              </AccordionTrigger>
                              <AccordionContent>
                                {tool.state === "result" && (
                                  <>
                                    <pre className="mt-2 overflow-x-auto text-xs">
                                      {JSON.stringify(tool?.result, null, 2)}
                                    </pre>
                                  </>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          {/* {tool.state === "call" && (
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            addToolResult({
                              toolCallId: tool.toolCallId,
                              result: {
                                city: "Turku",
                                temperature: 24,
                                unit: "C",
                              },
                            });
                          }}
                        >
                          call function
                        </Button>
                      )} */}
                        </div>
                      ))}

                      <div className="prose prose-xs">
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mb-20">
                <div ref={scrollRef} className="h-0 w-0"></div>
              </div>
              {/* <pre>{JSON.stringify(messages, null, 2)}</pre> */}
            </ScrollArea>
            <form
              onSubmit={handleSubmit}
              className="border-t rounded-b-md bg-slate-50/90 backdrop-blur-md flex gap-2 h-[100px]"
            >
              <div className="p-4 w-full flex gap-3">
                <Textarea
                  placeholder="Type your message..."
                  value={input}
                  className="bg-white"
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button type="submit" size="icon">
                  <Send size={18} />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
