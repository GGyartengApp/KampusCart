import React, { useState } from 'react';
import { X, Send, ShieldCheck } from 'lucide-react';

export default function ChatDrawer({ chatState, messages, onClose, onSendMessage }) {
  const [text, setText] = useState('');

  if (!chatState.isOpen || !chatState.seller) return null;

  const threadKey = chatState.seller.id;
  const threadMessages = messages[threadKey] || [
    {
      id: 'init-1',
      sender: 'seller',
      text: `Hey! Thanks for checking out ${chatState.product ? chatState.product.title : chatState.seller.name}. Let me know if you want to meet at ${chatState.seller.hall} or Main Library Lobby!`,
      time: 'Just now',
    },
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(threadKey, text.trim());
    setText('');
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#133c31', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <strong>{chatState.seller.name}</strong>
              <ShieldCheck size={14} color="#4ade80" />
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>
              {chatState.seller.owner} • {chatState.seller.hall}
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: '#f8fafc' }}>
          {threadMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'buyer' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                background: msg.sender === 'buyer' ? '#0b462d' : '#ffffff',
                color: msg.sender === 'buyer' ? '#ffffff' : '#18181b',
                padding: '10px 14px',
                borderRadius: 14,
                fontSize: 13,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <div>{msg.text}</div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>{msg.time}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} style={{ padding: 14, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Message seller about meet-up or item..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: 999, border: '1px solid #cbd5e1', fontSize: 13 }}
          />
          <button type="submit" className="btn-primary btn-sm" aria-label="Send message">
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
