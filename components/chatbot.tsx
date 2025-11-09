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
        console.error("❌ API error", res.status, res.statusText);

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
    <>
      {/* 🔘 Floating chat button */}
      <Button
        size="icon"
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 rounded-full w-12 h-12 bg-orange-500 hover:bg-orange-600 shadow-lg"
      >
        {open ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <MessageCircle className="w-5 h-5 text-white" />
        )}
      </Button>

      {/* 💬 Chat window */}
      {open && (
        <Card className="fixed bottom-20 right-5 w-80 sm:w-96 max-h-[500px] flex flex-col border-gray-200 shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
          <CardContent className="flex flex-col flex-grow p-4 space-y-3 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-200"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-xs text-gray-500 animate-pulse">
                Đang trả lời...
              </div>
            )}

            <div ref={chatEndRef} />
          </CardContent>

          {/* ✍️ Input area */}
          <div className="p-3 border-t border-gray-200 dark:border-slate-700 flex gap-2">
            <Input
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 text-sm"
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
