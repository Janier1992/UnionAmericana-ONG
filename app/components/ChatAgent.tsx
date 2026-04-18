"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getChatResponse } from "../actions/chat";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsPending(true);

    try {
      const result = await getChatResponse(input, messages);
      if (result.success && result.text) {
        setMessages((prev) => [...prev, { role: "model", parts: [{ text: result.text! }] }]);
      } else {
        setMessages((prev) => [...prev, { role: "model", parts: [{ text: result.error || "Hubo un error." }] }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: "Error de conexión." }] }]);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {/* Botón Flotante */}
      <motion.button
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        <span className="chat-toggle__status"></span>
      </motion.button>

      {/* Ventana de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="chat-window"
          >
            <div className="chat-window__header">
              <div className="chat-window__info">
                <div className="chat-window__avatar">IA</div>
                <div>
                  <h3 className="chat-window__title">Agente Unión Americana</h3>
                  <span className="chat-window__subtitle">Especialista en Integración LatAm</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="chat-window__close">×</button>
            </div>

            <div className="chat-window__messages">
              {messages.length === 0 && (
                <div className="chat-welcome">
                  <p>¡Hola! Soy el Agente de La Unión Americana. Una sola fuerza. Cien naciones.</p>
                  <p>¿En qué puedo ayudarte hoy?</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.role}`}>
                  {m.parts[0].text}
                </div>
              ))}
              {isPending && (
                <div className="chat-bubble model typing">
                  <span></span><span></span><span></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-window__input">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" disabled={isPending || !input.trim()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
