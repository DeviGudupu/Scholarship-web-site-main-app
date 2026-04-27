import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Calendar, DollarSign, ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

const ScholarshipSearchPage: React.FC = () => {
  const { scholarships } = useApp();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(scholarships.map(s => s.category)))];

  // Filter scholarships
  const filteredScholarships = useMemo(() => {
    return scholarships.filter(scholarship => {
      const matchesSearch = searchQuery === '' || 
        scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.organization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || scholarship.category === selectedCategory;

      const matchesMinAmount = minAmount === '' || scholarship.amount >= parseInt(minAmount);
      const matchesMaxAmount = maxAmount === '' || scholarship.amount <= parseInt(maxAmount);

      return matchesSearch && matchesCategory && matchesMinAmount && matchesMaxAmount;
    });
  }, [scholarships, searchQuery, selectedCategory, minAmount, maxAmount]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-blue-100">
              <Sparkles className="h-3 w-3" />
              <span>Discover Potential</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">Available Scholarships</h1>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4 py-1"
          >
            <p className="text-gray-400 font-bold uppercase tracking-tighter text-sm">
                Found <span className="text-blue-600">{filteredScholarships.length}</span> opportunities
            </p>
          </motion.div>
        </div>

        {/* Global Search & Filter Controls */}
        <div className="relative z-10 mb-12">
            <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl shadow-blue-100/30 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by keywords, tags, or organizations..."
                        className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-50/50 transition-all outline-none font-medium placeholder:text-gray-400"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-3 px-8 py-5 rounded-[2rem] font-black transition-all ${
                        showFilters ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                </button>
            </div>

            {/* Expandable Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] mt-4 p-8 border border-white shadow-xl grid md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Category Filter</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-6 py-4 bg-white border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-gray-700"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat === 'all' ? 'Every Academic Field' : cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Min Reward ($)</label>
                                <input
                                    type="number"
                                    value={minAmount}
                                    onChange={(e) => setMinAmount(e.target.value)}
                                    placeholder="Any"
                                    className="w-full px-6 py-4 bg-white border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-gray-700"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Max Reward ($)</label>
                                <input
                                    type="number"
                                    value={maxAmount}
                                    onChange={(e) => setMaxAmount(e.target.value)}
                                    placeholder="Unlimited"
                                    className="w-full px-6 py-4 bg-white border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-gray-700"
                                />
                            </div>

                            <div className="md:col-span-3 flex justify-end">
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('all');
                                        setMinAmount('');
                                        setMaxAmount('');
                                    }}
                                    className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Results Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredScholarships.map((s) => (
            <motion.div 
                key={s.id} 
                className="group relative bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden"
                variants={cardVariants}
                whileHover={{ y: -12 }}
            >
                {/* Floating Glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    {s.category}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-tighter">Value</p>
                    <div className="text-3xl font-black text-blue-600 tracking-tight group-hover:scale-110 transition-transform flex items-center gap-1">
                      <DollarSign className="h-6 w-6 stroke-[3px]" />
                      {s.amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                    {s.title}
                    </h3>
                    <p className="text-gray-500 mb-10 line-clamp-2 font-medium text-base">
                    {s.description}
                    </p>
                    
                    <div className="space-y-4 mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-600">{s.organization}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expires</span>
                    <div className="flex items-center text-gray-900 font-black text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        {new Date(s.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <Link
                    to={`/scholarship/${s.id}`}
                    className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all flex items-center gap-2 group/btn"
                  >
                    Details
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredScholarships.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-8 bg-white rounded-[3rem] border border-dashed border-gray-200"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <Search className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">No scholarships found</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10">
              We couldn't find anything matching your current filters. Try resetting or searching for different keywords.
            </p>
            <button
                onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setMinAmount('');
                setMaxAmount('');
                }}
                className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all"
            >
                Clear All Search Criteria
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipSearchPage;

