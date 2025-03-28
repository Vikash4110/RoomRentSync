// components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../Store/auth';
import { useSocket } from '../context/SocketContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const ChatWindow = ({ conversation }) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/clients/messages/${user._id}/${conversation._id}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchMessages();
  }, [conversation, user._id]);

  useEffect(() => {
    if (!socket || !conversation) return;

    socket.emit('join-conversation', {
      userId: user._id,
      roommateId: conversation._id
    });

    const handleNewMessage = (message) => {
      if (
        (message.sender === user._id && message.receiver === conversation._id) ||
        (message.sender === conversation._id && message.receiver === user._id)
      ) {
        setMessages(prev => [...prev, message]);
      }
    };

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket, conversation, user._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      sender: user._id,
      receiver: conversation._id,
      content: newMessage.trim(),
      timestamp: new Date()
    };

    socket.emit('send-message', message);
    setNewMessage('');
  };

  if (!conversation) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          Select a conversation to start chatting
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800">{conversation.user.fullName}</h3>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.sender === user._id ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-4 py-2 rounded-lg ${
              message.sender === user._id 
                ? 'bg-teal-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-r-lg"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;