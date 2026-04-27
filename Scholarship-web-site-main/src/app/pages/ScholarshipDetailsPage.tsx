import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Building, CheckCircle, FileText, ArrowLeft, ShieldCheck, Bookmark, Share2, Sparkles, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

const ScholarshipDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { scholarships, applications, user } = useApp();
  const navigate = useNavigate();

  const scholarship = scholarships.find(s => s.id === id);
  const hasApplied = applications.some(
    app => app.scholarshipId === id && app.studentId === user?.id
  );

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
             <FileText className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Record Not Found</h2>
          <p className="text-gray-500 font-medium mb-8">The scholarship you're looking for might have expired or doesn't exist in our database.</p>
          <Link to="/scholarships" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            <ArrowLeft className="h-5 w-5" />
            Back to Catalog
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/apply/${scholarship.id}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-10"
        >
            <Link 
            to="/scholarships" 
            className="group inline-flex items-center gap-3 text-gray-500 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-all"
            >
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-blue-50 transition-colors">
                <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Results
            </Link>

            <div className="flex gap-2">
                <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 transition-all">
                    <Bookmark className="h-5 w-5" />
                </button>
                <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 transition-all">
                    <Share2 className="h-5 w-5" />
                </button>
            </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-10">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-2xl shadow-blue-100/20"
                >
                    {/* Visual Header */}
                    <div className="h-4 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                    <div className="p-10 md:p-14">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                {scholarship.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-green-600 font-black text-[10px] uppercase tracking-widest">
                                <ShieldCheck className="h-4 w-4" />
                                Verified Opportunity
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                            {scholarship.title}
                        </h1>

                        <div className="flex flex-wrap gap-8 items-center py-8 border-y border-gray-50 mb-10">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <Building className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Provider</p>
                                    <p className="font-bold text-gray-900">{scholarship.organization}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-orange-500">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Apply By</p>
                                    <p className="font-bold text-gray-900">{new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                             </div>
                        </div>

                        <div className="prose prose-blue max-w-none">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                Detailed Description
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                {scholarship.description}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-2 gap-10"
                >
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-blue-600" />
                            Eligibility
                        </h3>
                        <ul className="space-y-6">
                            {scholarship.eligibility.map((criterion, index) => (
                                <li key={index} className="flex gap-4 group">
                                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <CheckCircle className="h-4 w-4" />
                                    </div>
                                    <span className="text-gray-600 font-bold leading-tight">{criterion}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                         <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <FileText className="h-6 w-6 text-indigo-600" />
                            Supportive Documents
                        </h3>
                        <ul className="space-y-6">
                            {scholarship.requiredDocuments.map((doc, index) => (
                                <li key={index} className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <span className="text-gray-600 font-bold flex items-center">{doc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>

            {/* Right Column: CTA & Summary */}
            <div className="space-y-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden sticky top-24"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                    <div className="relative z-10 text-center">
                        <p className="text-blue-100 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Award Worth</p>
                        <div className="text-6xl font-black tracking-tighter mb-4 flex items-center justify-center">
                            <DollarSign className="h-10 w-10 text-blue-200" />
                            {scholarship.amount.toLocaleString()}
                        </div>
                        <p className="bg-white/10 backdrop-blur-md rounded-2xl py-2 px-4 inline-block text-sm font-bold border border-white/10 mb-12">
                            Single Disbursement
                        </p>

                        <div className="space-y-4">
                            {hasApplied ? (
                                <div className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl py-6 flex flex-col items-center gap-2">
                                    <CheckCircle className="h-8 w-8" />
                                    <span className="font-black text-lg">Application Sent</span>
                                    <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Reviewing Status</p>
                                </div>
                            ) : (
                                <button
                                    onClick={handleApply}
                                    className="w-full bg-white text-blue-600 py-6 rounded-[2rem] font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                                >
                                    <Send className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                                    Apply Now
                                </button>
                            )}

                            <Link
                                to="/scholarships"
                                className="block w-full py-5 rounded-[2rem] border-2 border-white/20 text-white font-black text-sm hover:bg-white/10 transition-all"
                            >
                                Browse Others
                            </Link>
                        </div>

                        {!user && (
                            <div className="mt-8 text-xs font-bold text-blue-100">
                                Please <Link to="/login" className="text-white hover:underline">sign in</Link> to start your application process.
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[2.5rem] p-8 border border-gray-100"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 leading-none mb-1">Scholarship Trust</h4>
                            <p className="text-xs font-bold text-gray-400">100% verified application</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetailsPage;

