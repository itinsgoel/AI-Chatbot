import { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, system: "You are a helpful assistant." }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2>🤖 AI Chat App</h2>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, minHeight: 300, maxHeight: 500, overflowY: "auto", marginBottom: 16, background: "#fafafa" }}>
        {messages.length === 0 && <p style={{ color: "#aaa", textAlign: "center" }}>Koi bhi message bhejo!</p>}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{
              background: msg.role === "user" ? "#6c63ff" : "#fff",
              color: msg.role === "user" ? "#fff" : "#111",
              border: msg.role === "assistant" ? "1px solid #eee" : "none",
              borderRadius: 12, padding: "10px 14px", maxWidth: "75%", fontSize: 14, lineHeight: 1.6
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "10px 14px", fontSize: 14 }}>
              Soch raha hoon...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          disabled={isLoading}
          rows={2}
          placeholder="Message likho... (Enter = send)"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd", fontSize: 14, resize: "none", boxSizing: "border-box" }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          style={{ padding: "0 20px", borderRadius: 8, background: "#6c63ff", color: "#fff", border: "none", fontSize: 14, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.6 : 1 }}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}