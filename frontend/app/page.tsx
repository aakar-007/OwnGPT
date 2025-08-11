"use client";

import { useState, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const ownKey = process.env.NEXT_PUBLIC_OWN_KEY || "";

  const sendMessage = async () => {
    if (!input) return;
    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    const res = await fetch(`${apiUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-own-key": ownKey,
      },
      body: JSON.stringify({ messages: newMessages }),
      signal: controller.signal,
    });

    if (!res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let assistant = "";
    setMessages([...newMessages, { role: "assistant", content: "" } as Message]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "").trim();
          if (data === "[DONE]") {
            setLoading(false);
            return;
          }
          try {
            const json = JSON.parse(data);
            const token = json.choices?.[0]?.delta?.content || "";
            assistant += token;
            setMessages([...newMessages, { role: "assistant", content: assistant } as Message]);
          } catch (e) {
            console.error("Bad JSON", data);
          }
        }
      }
    }
    setLoading(false);
  };

  const stop = () => {
    controllerRef.current?.abort();
    setLoading(false);
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">OwnGPT Chat</h1>
      <div className="border p-2 h-96 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <strong>{m.role === "user" ? "You" : "Bot"}:</strong> {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border flex-1 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="bg-blue-500 text-white px-4" onClick={sendMessage} disabled={loading}>
          Send
        </button>
        <button className="bg-red-500 text-white px-4" onClick={stop} disabled={!loading}>
          Stop
        </button>
      </div>
    </main>
  );
}
