"use client"

import { useState, useRef, useEffect, JSX } from "react";
import { IoSend, IoTrash } from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isTyping?: boolean;
  fullContent?: string;
}

interface AIResponseData {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
  content?: string;
}

export default function AskAI(): JSX.Element {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [typingSpeed] = useState<number>(20);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chat-messages");
    if (savedMessages) {
      try {
        // @ts-expect-error  ignoring the message type error
        const parsedMessages = JSON.parse(savedMessages).map((message: Array) => ({
          ...message,
          timestamp: new Date(message.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error parsing saved messages:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const messagesToSave = messages.map(msg => ({
        ...msg,
        content: msg.fullContent || msg.content,
        isTyping: undefined,
        fullContent: undefined
      }));
      localStorage.setItem("chat-messages", JSON.stringify(messagesToSave));
    }
  }, [messages]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearChat = (): void => {
    setMessages([]);
    localStorage.removeItem("chat-messages");
  };

  const formatAIResponse = (responseData: AIResponseData): string => {
    try {
      const text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || 
                  responseData?.content || 
                  "Sorry, I couldn't process your request.";
      
      const formattedText = text
        .replace(/```(\w*)\n([\s\S]*?)\n```/g, (_, language, code) => {
          return `<div class="code-block"><div class="code-header">${language || 'code'}</div><pre class="bg-zinc-900 p-4 rounded-md overflow-x-auto text-sm"><code>${escapeHtml(code)}</code></pre></div>`;
        })
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/\*(.*?)\*/g, '<em>$1</em>')            // Italic text
        .replace(/\n\n/g, '<br/><br/>')                  // Line breaks
        .replace(/\n/g, '<br/>');                        // Single line breaks
      
      return formattedText;
    } catch (error) {
      console.error("Error formatting AI response:", error);
      return "Sorry, I couldn't process this response format.";
    }
  };

  // Helper to escape HTML
  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  useEffect(() => {
    const typingMessage = messages.find(m => m.isTyping);
    
    if (typingMessage && typingMessage.fullContent) {
      if (typingMessage.content.length < typingMessage.fullContent.length) {
        const timer = setTimeout(() => {
          setMessages(prevMessages => 
            prevMessages.map(m => 
              m.id === typingMessage.id
                ? {
                    ...m,
                    content: m.fullContent!.substring(0, m.content.length + 1)
                  }
                : m
            )
          );
        }, typingSpeed);
        
        return () => clearTimeout(timer);
      } else {
        setMessages(prevMessages => 
          prevMessages.map(m => 
            m.id === typingMessage.id
              ? {
                  ...m,
                  isTyping: false
                }
              : m
          )
        );
      }
    }
  }, [messages, typingSpeed]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate response");
      }
      
      const data: AIResponseData = await response.json();
      
      const formattedContent = formatAIResponse(data);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: "", 
        fullContent: formattedContent, 
        role: "assistant",
        timestamp: new Date(),
        isTyping: true,
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I couldn't process your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex pt-20 items-center justify-center p-4">
      <Card className="w-full max-w-5xl h-[80vh]  bg-zinc-800/50 border-zinc-700 flex flex-col">
        <CardHeader className="space-y-2 text-center pb-4 border-b border-zinc-700 flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <BsChatDots className="text-2xl text-indigo-500" />
            Ask AI
          </CardTitle>
          
          {messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearChat}
              className="text-zinc-400 hover:text-white hover:bg-red-500/20"
              title="Clear chat"
            >
              <IoTrash className="h-5 w-5" />
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-full bg-zinc-700/50 p-6"
              >
                <BsChatDots className="text-4xl text-indigo-500" />
              </motion.div>
              <p className="text-center">Ask me anything! Type your question below to get started.</p>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-zinc-800 text-zinc-100"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div 
                          className="whitespace-pre-wrap" 
                          dangerouslySetInnerHTML={{ __html: message.content }}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                      <p className="text-xs opacity-70 text-right mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {message.isTyping && (
                          <span className="ml-2 text-indigo-300">typing...</span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </>
          )}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] p-4 rounded-lg bg-zinc-800 text-zinc-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
        
        <div className="p-4 border-t border-zinc-700">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message here..."
              className="resize-none bg-zinc-800 border-zinc-600 focus:border-indigo-500 text-zinc-100"
              rows={1}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
              disabled={isLoading || !prompt.trim()}
            >
              <IoSend className="text-white" />
            </Button>
          </form>
        </div>
      </Card>
      
      {/* CSS for code blocks */}
      <style jsx global>{`
        .code-block {
          margin: 1rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          
        }
        .code-header {
          background-color: #2d3748;
          color: #cbd5e0;
          font-family: monospace;
          font-size: 0.8rem;
          padding: 0.5rem 1rem;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        pre {
          margin: 0;
          padding: 1rem;
          overflow-x: auto;
        }
        code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          white-space: pre;
          font-size: 0.875rem;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(139, 92, 246, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
}