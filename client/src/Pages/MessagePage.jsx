// pages/MessagesPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MessageList from '../Components/MessageList';
import ChatWindow from '../Components/ChatWindow';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <motion.div
      className="container mx-auto p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-teal-700 mb-8">Messages</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <MessageList
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
        <ChatWindow conversation={selectedConversation} />
      </div>
    </motion.div>
  );
};

export default MessagesPage;