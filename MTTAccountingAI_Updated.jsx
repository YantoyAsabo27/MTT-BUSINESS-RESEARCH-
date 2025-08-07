// MTT Accounting Services - GPT-like AI for Business Owners, Researchers & Entrepreneurs
// Technologies: React + Tailwind + Node.js + OpenAI + Firebase Auth + SQL

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function MTTAccountingAI() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are MTT, an AI expert in accounting, business strategy, and entrepreneurship. You must explain business concepts using established theories such as SWOT Analysis, Porter’s Five Forces, Maslow’s Hierarchy of Needs, the 4Ps of Marketing, Cost-Benefit Analysis, and more. Always include relevant theory names and real-world applications when giving advice." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);
    setInput("");

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
  };

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex bg-black text-white">
      <aside className="w-64 bg-black border-r border-gold p-4 space-y-4 hidden md:block">
        <h2 className="text-gold text-lg font-bold">MTT Tools</h2>
        <ul className="space-y-2">
          <li className="hover:text-gold cursor-pointer">Chat</li>
          <li className="hover:text-gold cursor-pointer">Business Ideas</li>
          <li className="hover:text-gold cursor-pointer">Feasibility Study</li>
          <li className="hover:text-gold cursor-pointer">Gross Profit Calc</li>
        </ul>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="p-4 bg-gold text-black text-xl font-bold">MTT Accounting Services</header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
          {messages.slice(1).map((msg, i) => (
            <div
              key={i}
              className={\`p-3 rounded-xl max-w-xl \${msg.role === "user" ? "ml-auto bg-gold text-black" : "mr-auto bg-white/10"}\`}
            >
              {msg.content}
            </div>
          ))}
        </main>

        <footer className="p-4 bg-black border-t border-gold">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type your business question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-black text-white border-gold"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              onClick={sendMessage}
              disabled={loading}
              className="bg-gold text-black font-bold hover:bg-gold/80"
            >
              {loading ? "..." : "Send"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Theme Notes:
// - Add gold color in tailwind.config.js: theme.extend.colors.gold = '#FFD700';
// - Backend should accept an array of messages and return GPT-style response.
// - Add Firebase Auth wrapper and SQL logic for saved chats.