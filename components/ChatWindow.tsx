'use client';

import { useChat } from '@ai-sdk/react';
import { Send, User, Bot, X, MessageSquare, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';

export default function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        onError: (err) => {
            console.error("Chat Window Error (Full):", err);
        }
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (mounted) scrollToBottom();
    }, [messages, mounted]);

    if (!mounted) return null;

    return (
        <div className={`chat-container ${isOpen ? 'open' : 'closed'}`}>
            {!isOpen && (
                <button
                    className="chat-toggle-btn ai-chat-trigger"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open chat"
                >
                    <MessageSquare size={24} />
                    <span className="toggle-badge">AI</span>
                </button>
            )}

            {isOpen && (
                <div className="chat-window shadow-premium">
                    <header className="chat-header">
                        <div className="header-info">
                            <div className="bot-avatar">
                                <Bot size={20} />
                            </div>
                            <div className="header-text">
                                <h3>Gemini Assistant</h3>
                                <span className="status-indicator">Online</span>
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </header>

                    <div className="messages-area">
                        {messages.length === 0 && (
                            <div className="welcome-message">
                                <Bot size={40} className="welcome-icon" />
                                <h4>How can I help you?</h4>
                                <p>I'm trained on ASP.NET Core Chapter 5: Binding, Routing, and Validation.</p>
                            </div>
                        )}

                        {messages.map(m => (
                            <div key={m.id} className={`message-wrapper ${m.role}`}>
                                <div className="message-icon">
                                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className="message-bubble">
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="message-wrapper assistant">
                                <div className="message-icon">
                                    <Bot size={16} />
                                </div>
                                <div className="message-bubble loading">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                <strong>Chat Error:</strong> {error.message}
                                <br />
                                {error.message.includes("fetch") && (
                                    <small>Network error detected. Check your internet or Vercel logs.</small>
                                )}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="chat-input-form">
                        <input
                            className="chat-input"
                            value={input}
                            placeholder="Ask about ASP.NET Core..."
                            onChange={handleInputChange}
                        />
                        <button
                            type="submit"
                            className="send-btn"
                            disabled={isLoading || !input.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
