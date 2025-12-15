import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_CHATS, MOCK_USERS, CURRENT_USER_ID } from '../services/mockData';
import { Chat, ChatMessage } from '../types';
import { Send, Circle, Loader2, Search, ArrowLeft } from 'lucide-react';

export const Messages: React.FC = () => {
  const location = useLocation();
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, activeChatId, isTyping]);

  // Handle navigation from Home page "Offer Help"
  useEffect(() => {
    if (location.state) {
        const { recipientId, initialMessage } = location.state as { recipientId: string, initialMessage: string };
        if (recipientId) {
            setChats(prevChats => {
                let existingChat = prevChats.find(c =>
                    c.participantIds.includes(recipientId) &&
                    c.participantIds.includes(CURRENT_USER_ID)
                );

                if (existingChat) {
                    setActiveChatId(existingChat.id);
                    return prevChats;
                }

                const newChat: Chat = {
                    id: `chat_new_${Date.now()}`,
                    participantIds: [CURRENT_USER_ID, recipientId],
                    lastMessage: '',
                    lastMessageTime: 'New',
                    messages: []
                };
                setActiveChatId(newChat.id);
                return [newChat, ...prevChats];
            });

            if (initialMessage) {
                setReplyText(initialMessage);
            }
            
            window.history.replaceState({}, document.title);
        }
    }
  }, [location.state]);

  const activeChat = activeChatId ? chats.find(c => c.id === activeChatId) : null;

  const getOtherParticipant = (participantIds: string[]) => {
    const otherId = participantIds.find(id => id !== CURRENT_USER_ID);
    return otherId ? MOCK_USERS[otherId] : MOCK_USERS['user_2']; // Fallback
  };

  // ------------------------------------------------------------
  // Real-time Simulation (Mock WebSocket)
  // ------------------------------------------------------------
  
  const handleIncomingMessage = (chatId: string, message: ChatMessage) => {
    setChats(prevChats => {
        const newChats = prevChats.map(chat => {
            if (chat.id === chatId) {
                return {
                    ...chat,
                    messages: [...chat.messages, message],
                    lastMessage: message.text,
                    lastMessageTime: message.timestamp
                };
            }
            return chat;
        });

        // Re-sort: Move updated chat to top
        const updatedChat = newChats.find(c => c.id === chatId);
        const otherChats = newChats.filter(c => c.id !== chatId);
        
        return updatedChat ? [updatedChat, ...otherChats] : newChats;
    });
  };

  // Simulate random incoming messages from the "network"
  useEffect(() => {
    const interval = setInterval(() => {
        // 30% chance to receive a random background message if we have chats
        if (chats.length > 0 && Math.random() > 0.7) {
            const randomChat = chats[Math.floor(Math.random() * chats.length)];
            const otherUser = getOtherParticipant(randomChat.participantIds);
            
            // Don't disturb the active chat with random noise for this demo, 
            // unless we want to show it's "live". Let's only update background chats.
            if (randomChat.id !== activeChatId) {
                const randomPhrases = [
                    "Are you still available?",
                    "Thanks!",
                    "I can help with that.",
                    "Let me check my schedule.",
                    "Sounds good to me."
                ];
                const text = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
                
                const msg: ChatMessage = {
                    id: `msg_inc_${Date.now()}`,
                    senderId: otherUser.id,
                    text: text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                handleIncomingMessage(randomChat.id, msg);
            }
        }
    }, 5000);

    return () => clearInterval(interval);
  }, [chats, activeChatId]);


  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if(!replyText.trim() || !activeChatId) return;
    
    const userMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        senderId: CURRENT_USER_ID,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Add user message immediately (Optimistic update)
    handleIncomingMessage(activeChatId, userMsg);
    setReplyText('');

    // 2. Simulate "Other user is typing..."
    setTimeout(() => {
        setIsTyping(true);
    }, 800);

    // 3. Simulate Reply received via WebSocket
    setTimeout(() => {
        setIsTyping(false);
        const chat = chats.find(c => c.id === activeChatId);
        if (chat) {
            const otherId = chat.participantIds.find(pid => pid !== CURRENT_USER_ID);
            if (otherId) {
                const replyMsg: ChatMessage = {
                    id: `msg_reply_${Date.now()}`,
                    senderId: otherId,
                    text: "That sounds great! I'll send over the details shortly.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                handleIncomingMessage(activeChatId, replyMsg);
            }
        }
    }, 3500);
  };

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => {
    const otherUser = getOtherParticipant(chat.participantIds);
    const term = searchTerm.toLowerCase();
    return (
        otherUser.name.toLowerCase().includes(term) ||
        chat.lastMessage.toLowerCase().includes(term)
    );
  });

  return (
    // Height Calculation: 
    // Mobile: 100dvh (full screen) - 64px (bottom nav)
    // Desktop: 100vh (full screen) - 0px (nav is top, handled by padding)
    // We use a container that handles the pt-16 on desktop.
    <div className="h-[calc(100dvh-64px)] md:h-screen md:pt-16 flex flex-col md:flex-row bg-slate-50">
      
      {/* Chat List */}
      <div className={`w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-full ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-xl text-slate-800">Messages</h2>
            <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full animate-pulse">
                <Circle size={8} fill="currentColor" />
                Live
            </div>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pt-3 pb-1">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-xl text-sm transition-all outline-none"
                />
            </div>
        </div>

        <div className="overflow-y-auto flex-1 mt-2">
            {filteredChats.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-sm">
                    No conversations found.
                </div>
            ) : (
                filteredChats.map(chat => {
                    const otherUser = getOtherParticipant(chat.participantIds);
                    const isActive = activeChatId === chat.id;
                    return (
                        <div 
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors border-l-4 ${
                                isActive 
                                ? 'bg-indigo-50 border-indigo-600' 
                                : 'border-transparent'
                            }`}
                        >
                            <div className="relative">
                                <img src={otherUser.avatar} alt={otherUser.name} className="w-12 h-12 rounded-full object-cover" />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`font-semibold truncate ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>{otherUser.name}</h3>
                                    <span className="text-xs text-slate-400">{chat.lastMessageTime}</span>
                                </div>
                                <p className={`text-sm truncate ${isActive ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>
                                    {chat.lastMessage || 'Start a conversation'}
                                </p>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col h-full bg-slate-50 ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
            <>
                {/* Header */}
                <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3 shadow-sm z-10 shrink-0">
                    <button onClick={() => setActiveChatId(null)} className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="relative">
                        <img 
                            src={getOtherParticipant(activeChat.participantIds).avatar} 
                            alt="User" 
                            className="w-10 h-10 rounded-full object-cover" 
                        />
                         <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{getOtherParticipant(activeChat.participantIds).name}</h3>
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            Online now
                        </p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeChat.messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                             <p>This is the start of your conversation.</p>
                        </div>
                    )}
                    {activeChat.messages.map(msg => {
                        const isMe = msg.senderId === CURRENT_USER_ID;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                <div className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                    isMe 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                                }`}>
                                    <p className="leading-relaxed">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors text-sm sm:text-base"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={!replyText.trim()}
                            className="w-10 h-10 sm:w-11 sm:h-11 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 shrink-0"
                        >
                            <Send size={18} className={replyText.trim() ? "ml-0.5" : ""} />
                        </button>
                    </form>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 p-6 text-center">
                <div className="w-20 h-20 bg-slate-200/50 rounded-full flex items-center justify-center mb-4">
                    <Send size={32} className="text-slate-400/70 ml-1" />
                </div>
                <h3 className="text-lg font-medium text-slate-600">Your Messages</h3>
                <p className="text-sm mt-1">Select a conversation from the list to start messaging.</p>
            </div>
        )}
      </div>
    </div>
  );
};