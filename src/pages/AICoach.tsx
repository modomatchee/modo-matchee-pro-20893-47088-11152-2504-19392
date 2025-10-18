import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Mic, Smile, Image, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/modomatchee-logo.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AICoach = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const streamChat = async (userMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;
    
    try {
      // Get current session for JWT
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please log in to use AI Coach');
        navigate('/');
        return;
      }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: userMessage }] }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
          return;
        }
        if (resp.status === 402) {
          toast.error("AI credits exhausted. Please add credits to continue.");
          return;
        }
        throw new Error("Failed to get response");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantMessage = "";

      // Add empty assistant message that we'll update
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: "assistant", content: assistantMessage };
                return newMessages;
              });
            }
          } catch {
            continue;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get AI response");
      setMessages(prev => prev.slice(0, -1)); // Remove the empty assistant message
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    await streamChat(userMessage);
    setIsLoading(false);
  };

  const suggestedPrompts = [
    "Give me my daily/weekly overview",
    "What can I improve on",
    "Pre-match tips",
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-8 right-8 text-white text-4xl font-bold"
      >
        <ChevronLeft size={40} />
      </button>

      {/* Logo/Avatar Area */}
      <div className="flex justify-center pt-11 mb-8">
        <div className="w-[310px] h-[310px] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-8 transition-transform hover:scale-105 duration-300">
          <img 
            src={logoImage} 
            alt="ModoMatchee Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 px-14 pb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="max-w-[527px]">
            <p className="text-xl font-bold text-white mb-4">
              Hi, I'm your tennis AI and you can ask me things like:
            </p>
            <ul className="text-xl font-bold text-white space-y-2">
              {suggestedPrompts.map((prompt, i) => (
                <li key={i} className="cursor-pointer hover:text-primary" onClick={() => {
                  setMessage(prompt);
                }}>
                  • {prompt}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-[600px] ${
                    msg.role === "user" ? "" : "bg-white rounded-[20px] p-6"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="absolute -bottom-2 left-14 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-white" />
                  )}
                  <p className={`text-base ${msg.role === "user" ? "text-white" : "text-black"}`}>
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 pb-6">
        <div className="flex items-center gap-4 px-4 py-3 rounded-[20px] bg-white border border-black max-w-[1480px] mx-auto">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 border-0 text-sm text-[#4e4e4e] focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
          />
          <button className="text-[#4e4e4e] hover:text-black transition-colors">
            <Mic size={24} />
          </button>
          <button className="text-[#4e4e4e] hover:text-black transition-colors">
            <Smile size={24} />
          </button>
          <button className="text-[#4e4e4e] hover:text-black transition-colors">
            <Image size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
