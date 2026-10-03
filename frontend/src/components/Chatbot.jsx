import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/chatbot.css';
import api from '../utils/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatboxRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const { data } = await api.post('/api/chat', { message: userMessage.text });
      const botMessage = { text: data.reply || "I couldn't process that.", sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { text: 'Error: Unable to connect to the chatbot service.', sender: 'bot' }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <button id="chat-bubble" onClick={toggleChat} aria-label="Open chat" style={{ cursor: 'pointer', border: 'none' }}>
        💬
      </button>
      {isOpen && (
        <div id="chat-container" role="region" aria-label="Chat window">
          <div id="chatbox" ref={chatboxRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender === 'user' ? 'chat-user' : 'chat-bot'}`}>
                {msg.text}
              </div>
            ))}
            {sending && <div className="chat-message chat-bot">Typing...</div>}
          </div>
          <div id="input-container">
            <input
              type="text"
              id="userInput"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Chat message input"
              maxLength={1000}
            />
            <button id="sendButton" onClick={handleSend} disabled={sending} aria-label="Send message">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
