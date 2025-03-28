// components/MessageList.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Store/auth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const MessageList = ({ selectedConversation, setSelectedConversation }) => {
  const { user, authorizationToken } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/clients/conversations`, {
          headers: { Authorization: authorizationToken },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [authorizationToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-teal-700 mb-4">Conversations</h2>
      {conversations.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No conversations yet
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <motion.div
              key={conversation._id.toString()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg cursor-pointer flex items-center ${
                selectedConversation?._id === conversation._id 
                  ? 'bg-teal-100' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              {/* Conversation item content */}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;