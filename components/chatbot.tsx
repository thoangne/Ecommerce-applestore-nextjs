"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, X } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Xin chào 👋! Tôi có thể giúp bạn chọn sản phẩm Apple nào hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMsg = { role: "user", content: input };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ API response:", text);

        setMessages([
          ...updated,
          { role: "assistant", content: "Lỗi máy chủ, vui lòng thử lại." },
        ]);
        return;
      }

      const data = await res.json();
      setMessages([...updated, data.reply]);
    } catch (err) {
      console.error("❌ JSON parse error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="z-[9999]">
      {/* 🔘 Floating chat button */}
      <Button
        size="icon"
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[9999] rounded-full 
        w-12 h-12 bg-black hover:bg-neutral-800 text-white shadow-xl
        transition-colors"
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
      </Button>

      {/* 💬 Chat window */}
      {open && (
        <Card
          className="
            fixed bottom-20 right-5 w-80 sm:w-96 max-h-[500px]
            flex flex-col overflow-hidden rounded-2xl shadow-2xl
            bg-white dark:bg-neutral-950 dark:border-neutral-800
            border border-neutral-200 z-[9999]
          "
        >
          <CardContent className="flex flex-col flex-grow p-4 space-y-3 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    px-3 py-2 rounded-xl text-sm whitespace-pre-wrap
                    ${
                      m.role === "user"
                        ? "bg-black text-white"
                        : "bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white"
                    }
                  `}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-xs text-neutral-500 animate-pulse">
                Đang trả lời...
              </div>
            )}

            <div ref={chatEndRef} />
          </CardContent>

          {/* ✍️ Input area */}
          <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
            <Input
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="
                flex-1 text-sm 
                bg-white dark:bg-neutral-950
                border-neutral-300 dark:border-neutral-700
                focus:ring-0 focus:border-black dark:focus:border-white
              "
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={loading}
              className="
                bg-black hover:bg-neutral-800 text-white
                transition-colors
              "
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
