import React, { useState, useEffect } from 'react';
import { MOCK_REQUESTS, MOCK_USERS, CURRENT_USER_ID } from '../services/mockData';
import { User, TradeRequest, TabView } from '../types';
import { SkillBadge } from '../components/SkillBadge';
import { MapPin, Coins, Sparkles, Search, SlidersHorizontal, Clock, User as UserIcon, MessageCircle } from 'lucide-react';
import { getSmartMatchReasoning } from '../services/geminiService';
import { Link, useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabView>(TabView.DISCOVER);
  const [requests, setRequests] = useState<TradeRequest[]>(MOCK_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser] = useState<User>(MOCK_USERS[CURRENT_USER_ID]);
  const [smartTips, setSmartTips] = useState<Record<string, string>>({});
  const [searchRadius, setSearchRadius] = useState<number>(10);

  // Filter Logic
  const filteredRequests = requests.filter(req => {
    // Basic Search
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.skillTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Distance Filter
    // Treat 'Remote' or undefined distance as always matches (0 distance)
    const withinDistance = (req.distance ?? 0) <= searchRadius;

    // Tab Logic
    if (activeTab === TabView.DISCOVER) {
      // Show NEEDS from others
      return matchesSearch && withinDistance && req.type === 'NEED' && req.authorId !== currentUser.id;
    } 
    if (activeTab === TabView.REVERSE_MATCH) {
        // Show people who NEED what I OFFER
        // Or people who OFFER what I NEED
        const iHaveSkill = currentUser.skillsOffered.some(mySkill => 
            req.skillTags.some(tag => tag.toLowerCase().includes(mySkill.toLowerCase()))
        );
        return matchesSearch && withinDistance && req.type === 'NEED' && iHaveSkill && req.authorId !== currentUser.id;
    }
    if (activeTab === TabView.MY_REQUESTS) {
        return matchesSearch && req.authorId === currentUser.id;
    }
    return false;
  });

  // Gemini Smart Match Effect
  useEffect(() => {
    const fetchReasoning = async () => {
      if (activeTab === TabView.REVERSE_MATCH && filteredRequests.length > 0) {
        const tips: Record<string, string> = {};
        for (const req of filteredRequests) {
           if (!smartTips[req.id]) {
               const reason = await getSmartMatchReasoning(currentUser.skillsOffered, req.title, req.description);
               tips[req.id] = reason;
           }
        }
        setSmartTips(prev => ({ ...prev, ...tips }));
      }
    };
    
    // Debounce slightly to avoid spamming API on rapid filter changes
    const timer = setTimeout(() => {
        fetchReasoning();
    }, 500);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filteredRequests.length]); // Dependencies tailored to only trigger on meaningful list changes

  const handleContact = (req: TradeRequest) => {
    const initialMessage = req.type === 'NEED'
        ? `Hi, I saw your request for "${req.title}" and I'd love to help!`
        : `Hi, I'm interested in your offer: "${req.title}".`;

    navigate('/messages', {
        state: {
            recipientId: req.authorId,
            initialMessage
        }
    });
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="pb-24 pt-4 md:pt-24 px-4 max-w-3xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-6 mt-2 md:mt-0">
        <h1 className="text-2xl font-bold text-slate-900">Exchange Skills</h1>
        <p className="text-slate-500 text-sm md:text-base">Find help or offer your expertise locally.</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col gap-3">
        {/* Search Bar */}
        <div className="relative">
            <input
                type="text"
                placeholder="Search by skill or keyword..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
        </div>

        {/* Distance Slider */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 min-w-fit">
                <SlidersHorizontal size={18} />
                <span className="text-sm font-medium">Max Distance:</span>
            </div>
            <div className="flex-1 flex items-center gap-3">
                <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-sm font-bold text-indigo-600 min-w-[3rem] text-right">{searchRadius} mi</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 bg-slate-100 p-1.5 rounded-xl shadow-inner overflow-x-auto no-scrollbar">
        <button 
            onClick={() => setActiveTab(TabView.DISCOVER)}
            className={`flex-1 py-2 px-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === TabView.DISCOVER ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            Find Tasks
        </button>
        <button 
            onClick={() => setActiveTab(TabView.REVERSE_MATCH)}
            className={`flex-1 py-2 px-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === TabView.REVERSE_MATCH ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            Smart Matches
        </button>
        <button 
            onClick={() => setActiveTab(TabView.MY_REQUESTS)}
            className={`flex-1 py-2 px-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === TabView.MY_REQUESTS ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            My Posts
        </button>
      </div>

      {/* List */}
      <div className="space-y-6">
        {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
                <p>No requests found matching your filters.</p>
                {(searchRadius < 50) && (
                    <button 
                        onClick={() => setSearchRadius(50)}
                        className="text-indigo-600 text-sm font-medium mt-2 hover:underline"
                    >
                        Try increasing search radius
                    </button>
                )}
            </div>
        ) : (
            filteredRequests.map(req => {
                const author = MOCK_USERS[req.authorId];
                return (
                    <div key={req.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 overflow-hidden">
                        <div className="p-5 sm:p-6">
                            {/* Header: User & Meta */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <Link to={`/profile/${req.authorId}`} className="relative shrink-0">
                                        <img src={author.avatar} alt={author.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:ring-indigo-100 transition-all" />
                                    </Link>
                                    <div className="min-w-0">
                                        <Link to={`/profile/${req.authorId}`} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-sm sm:text-base truncate block">
                                            {author.name}
                                        </Link>
                                        <div className="flex flex-wrap items-center text-xs font-medium text-slate-500 mt-0.5 gap-x-2 gap-y-1">
                                             <div className="flex items-center shrink-0">
                                                <MapPin size={12} className="mr-1 text-slate-400" />
                                                <span className="truncate max-w-[100px] sm:max-w-none">{req.location}</span>
                                             </div>
                                             {req.distance !== undefined && req.distance > 0 && (
                                                <span className="text-slate-400 shrink-0">• {req.distance} mi</span>
                                             )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                     <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-sm">
                                        <Coins size={12} className="text-amber-500 sm:w-3.5 sm:h-3.5" />
                                        <span>{req.credits} Cr</span>
                                    </div>
                                    <div className="flex items-center text-[10px] text-slate-400 font-medium">
                                        <Clock size={10} className="mr-1" />
                                        {timeAgo(req.createdAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mb-4">
                                 <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${req.type === 'NEED' ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'}`}>
                                        {req.type === 'NEED' ? 'Request' : 'Offer'}
                                    </span>
                                 </div>
                                 <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-1">{req.title}</h2>
                                 <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{req.description}</p>
                            </div>

                            {/* Smart Tip */}
                            {activeTab === TabView.REVERSE_MATCH && smartTips[req.id] && (
                                <div className="mb-4 bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 p-3 rounded-xl flex gap-3 items-start animate-fade-in">
                                    <div className="bg-white p-1.5 rounded-full shadow-sm shrink-0">
                                        <Sparkles className="text-indigo-600" size={14} />
                                    </div>
                                    <p className="text-xs text-indigo-900 italic leading-snug mt-0.5">{smartTips[req.id]}</p>
                                </div>
                            )}

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {req.skillTags.map(tag => (
                                    <SkillBadge key={tag} skill={tag} variant="secondary" />
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                                 <Link 
                                    to={`/profile/${req.authorId}`}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                                 >
                                    <UserIcon size={18} />
                                    Profile
                                 </Link>
                                 <button 
                                    onClick={() => handleContact(req)}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg active:scale-95 transition-all ${
                                        req.type === 'NEED' 
                                        ? 'bg-indigo-600 hover:bg-indigo-700' 
                                        : 'bg-teal-600 hover:bg-teal-700'
                                    }`}
                                 >
                                    <MessageCircle size={18} />
                                    {req.type === 'NEED' ? 'Offer Help' : 'Request Help'}
                                 </button>
                            </div>
                        </div>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
};