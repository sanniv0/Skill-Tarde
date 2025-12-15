import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Loader2, ArrowLeft, MapPin, X, Plus, Sparkles, Globe } from 'lucide-react';
import { enhanceDescription } from '../services/geminiService';

export const PostRequest: React.FC = () => {
  const navigate = useNavigate();
  
  // Form State
  const [type, setType] = useState<'NEED' | 'OFFER'>('NEED');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState<number>(5);
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  
  // Skill Tags State
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  // AI State
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!description) return;
    setIsEnhancing(true);
    const enhanced = await enhanceDescription(description);
    setDescription(enhanced);
    setIsEnhancing(false);
  };

  const handleAddSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title || !description || skills.length === 0) {
        alert("Please fill in all required fields and add at least one skill tag.");
        return;
    }

    if (!isRemote && !location) {
        alert("Please enter a location or select Remote.");
        return;
    }

    // In a real app, this would post to backend.
    const newRequest = {
        title,
        description,
        type,
        credits,
        skillTags: skills,
        location: isRemote ? 'Remote' : location,
    };

    console.log("Submitting:", newRequest);
    alert("Request posted successfully!");
    navigate('/');
  };

  const isNeed = type === 'NEED';
  const themeColor = isNeed ? 'indigo' : 'teal';

  return (
    <div className="min-h-screen bg-slate-50 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-4 md:pt-24">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center mb-6">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-900 ml-2">New Listing</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Type Toggle */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2">
                <button
                    type="button"
                    onClick={() => setType('NEED')}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                        isNeed 
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    I Need Help
                </button>
                <button
                    type="button"
                    onClick={() => setType('OFFER')}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                        !isNeed 
                            ? 'bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200' 
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    I Offer Skills
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className={`h-1.5 w-full ${isNeed ? 'bg-indigo-500' : 'bg-teal-500'}`} />
                
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Title
                        </label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={isNeed ? "e.g., Fix my leaky faucet" : "e.g., Teaching Guitar Basics"}
                            className="w-full text-lg font-semibold placeholder:text-slate-300 border-0 border-b-2 border-slate-100 focus:border-slate-400 focus:ring-0 px-0 py-2 bg-transparent transition-colors"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Description
                            </label>
                            <button 
                                type="button"
                                onClick={handleEnhance}
                                disabled={isEnhancing || !description}
                                className={`flex items-center text-xs font-medium px-2 py-1 rounded-md transition-colors ${
                                    isNeed 
                                    ? 'text-indigo-600 hover:bg-indigo-50' 
                                    : 'text-teal-600 hover:bg-teal-50'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isEnhancing ? <Loader2 size={12} className="animate-spin mr-1" /> : <Sparkles size={12} className="mr-1" />}
                                AI Polish
                            </button>
                        </div>
                        <div className="relative">
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Describe the details of the exchange..."
                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-slate-200 outline-none resize-none text-slate-700 leading-relaxed"
                                required
                            />
                        </div>
                    </div>

                    {/* Skill Tags */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Related Skills (Press Enter to Add)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {skills.map(skill => (
                                <span key={skill} className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                                    isNeed ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'
                                }`}>
                                    {skill}
                                    <button onClick={() => handleRemoveSkill(skill)} className="ml-1.5 hover:text-black">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={currentSkill}
                                onChange={(e) => setCurrentSkill(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add tags e.g. Plumbing, Spanish, React..."
                                className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                            />
                            <button 
                                type="button"
                                onClick={() => handleAddSkill()}
                                className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-600"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-slate-400">
                                    {isRemote ? <Globe size={18} /> : <MapPin size={18} />}
                                </div>
                                <input 
                                    type="text" 
                                    value={isRemote ? 'Remote / Online' : location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    disabled={isRemote}
                                    placeholder="City, Neighborhood"
                                    className={`w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 outline-none transition-all ${isRemote ? 'bg-slate-50 text-slate-500' : 'bg-white'}`}
                                />
                            </div>
                            <div className="mt-2 flex items-center">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={isRemote}
                                        onChange={(e) => setIsRemote(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className={`relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isNeed ? 'peer-checked:bg-indigo-600' : 'peer-checked:bg-teal-600'}`}></div>
                                    <span className="ms-2 text-sm font-medium text-slate-600">This is a remote task</span>
                                </label>
                            </div>
                        </div>

                        {/* Credits */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Credit Value
                            </label>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex justify-between items-end mb-4">
                                    <span className={`text-3xl font-bold ${isNeed ? 'text-indigo-700' : 'text-teal-700'}`}>
                                        {credits}
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium mb-1">
                                        approx. {credits} hour{credits > 1 ? 's' : ''} work
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="20" 
                                    step="1"
                                    value={credits}
                                    onChange={(e) => setCredits(parseInt(e.target.value))}
                                    className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${isNeed ? 'accent-indigo-600' : 'accent-teal-600'}`}
                                />
                                <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium uppercase">
                                    <span>Quick Task</span>
                                    <span>Major Project</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] ${
                    isNeed 
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' 
                    : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200'
                }`}
            >
                Post {isNeed ? 'Request' : 'Offer'}
            </button>

        </form>
      </div>
    </div>
  );
};