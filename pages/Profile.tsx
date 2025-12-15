import React from 'react';
import { MOCK_USERS, CURRENT_USER_ID } from '../services/mockData';
import { Star, MapPin, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { SkillBadge } from '../components/SkillBadge';
import { useParams, useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  // Use the ID from URL if present, otherwise default to current user
  const targetUserId = userId || CURRENT_USER_ID;
  const user = MOCK_USERS[targetUserId];

  if (!user) {
    return (
      <div className="pt-24 text-center">
        <p className="text-slate-500">User not found.</p>
        <button onClick={() => navigate('/')} className="text-indigo-600 font-medium mt-2">Go Home</button>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-0 md:pt-16 min-h-screen">
      {/* Cover / Header */}
      <div className="bg-indigo-600 h-32 md:h-48 relative">
        {/* Mobile Back Button */}
        {userId && (
           <button 
             onClick={() => navigate(-1)} 
             className="absolute top-4 left-4 z-10 text-white bg-black/20 hover:bg-black/30 p-2 rounded-full backdrop-blur-md transition-all active:scale-95 md:hidden"
             aria-label="Go back"
           >
             <ArrowLeft size={20} />
           </button>
        )}
        <div className="absolute -bottom-12 left-4 md:left-8">
             <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg bg-white"
             />
        </div>
      </div>

      <div className="mt-14 px-4 md:px-8 max-w-4xl mx-auto">
        {/* Basic Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{user.name}</h1>
                <div className="flex items-center text-slate-500 text-sm mt-1">
                    <MapPin size={14} className="mr-1" />
                    {user.location}
                </div>
            </div>
            <div className="flex items-center gap-3 sm:text-right sm:block">
                <div className="flex items-center justify-start sm:justify-end text-amber-500 font-bold">
                    <span className="text-xl mr-1">{user.rating}</span>
                    <Star size={20} fill="currentColor" />
                </div>
                <div className="text-xs text-slate-400 font-medium">{user.reviewCount} Reviews</div>
            </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-slate-600 leading-relaxed text-sm md:text-base">{user.bio}</p>

        {/* Stats Card */}
        <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col items-center shadow-sm">
                <span className="text-2xl md:text-3xl font-bold text-indigo-700">{user.credits}</span>
                <span className="text-[10px] md:text-xs font-medium text-indigo-600 uppercase tracking-wide mt-1">Credits Earned</span>
            </div>
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 flex flex-col items-center shadow-sm">
                <span className="text-2xl md:text-3xl font-bold text-teal-700">{user.skillsOffered.length}</span>
                <span className="text-[10px] md:text-xs font-medium text-teal-600 uppercase tracking-wide mt-1">Skills Listed</span>
            </div>
        </div>

        {/* Skills Section */}
        <div className="mt-8 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                    <Award size={16} className="mr-2 text-indigo-600" />
                    Skills Offered
                </h3>
                <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.map(skill => (
                        <SkillBadge key={skill} skill={skill} variant="primary" />
                    ))}
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                    <ArrowRight size={16} className="mr-2 text-rose-500" />
                    Skills Needed
                </h3>
                <div className="flex flex-wrap gap-2">
                    {user.skillsNeeded.map(skill => (
                        <SkillBadge key={skill} skill={skill} variant="outline" />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};