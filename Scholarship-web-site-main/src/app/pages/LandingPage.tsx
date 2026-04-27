import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, DollarSign, Calendar, TrendingUp, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { scholarships } = useApp();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/scholarships?search=${encodeURIComponent(searchQuery)}`);
  };

  const featuredScholarships = scholarships.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-6 border border-blue-100">
                <Sparkles className="h-4 w-4" />
                <span>Over $50M in Scholarships Found</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-8 leading-[1.1] tracking-tight">
                Unlock Your <span className="text-blue-600 relative">Academic<div className="absolute bottom-2 left-0 w-full h-3 bg-blue-100 -z-10"></div></span> Potential
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium">
                The most advanced platform to discover, apply, and manage scholarships. Empowering students since 2024.
              </p>

              {/* Enhanced Search Form */}
              <motion.form 
                onSubmit={handleSearch} 
                className="flex items-center p-2 bg-white rounded-3xl shadow-2xl shadow-blue-100 border border-gray-100 mb-8 max-w-lg focus-within:ring-4 focus-within:ring-blue-50 transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Major, university, or keyword..."
                    className="w-full pl-12 pr-4 py-4 focus:outline-none text-gray-700 font-medium placeholder:text-gray-400"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 active:scale-95"
                >
                  Explore
                </button>
              </motion.form>

              <div className="flex flex-wrap items-center gap-6">
                <Link
                  to="/scholarships"
                  className="flex items-center gap-2 text-gray-900 font-bold hover:text-blue-600 transition-colors group"
                >
                  Browse Categories
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="flex items-center ml-4">
                    <span className="text-sm font-bold text-gray-500">+12k students joined</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="relative z-10 glass-card p-4 rounded-[3rem] shadow-premium">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1523240715634-941d99d19d27?auto=format&fit=crop&q=80&w=1000"
                  alt="Happy students"
                  className="rounded-[2.5rem] w-full aspect-[4/5] object-cover shadow-inner"
                />
              </div>
              {/* Floating Widgets */}
              <motion.div 
                className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-50 z-20 hidden md:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Application Status</p>
                    <p className="text-lg font-extrabold text-gray-900">Approved!</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-6 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-50 z-20 hidden md:block"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <div className="text-center">
                  <p className="text-3xl font-black text-blue-600">$12,500</p>
                  <p className="text-sm font-bold text-gray-500">Average Aid Won</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with Scroll Animation */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: DollarSign, label: "Total Funding", value: "$50M+", color: "bg-blue-100 text-blue-600" },
              { icon: TrendingUp, label: "Students Helped", value: "12,000+", color: "bg-indigo-100 text-indigo-600" },
              { icon: Calendar, label: "Daily Deadlines", value: "50+", color: "bg-purple-100 text-purple-600" },
              { icon: Sparkles, label: "Success Rate", value: "85%", color: "bg-teal-100 text-teal-600" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center p-8 bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-transform group-hover:scale-110 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Scholarships Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Featured <span className="text-blue-600 underline">Opportunities</span></h2>
              <p className="text-lg font-medium text-gray-500">Pick the best fit for your academic journey</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/scholarships"
                className="btn-primary flex items-center gap-2"
              >
                View All Scholarships
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            className="grid lg:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredScholarships.map((scholarship) => (
              <motion.div 
                key={scholarship.id} 
                className="group relative bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-premium transition-all duration-500 overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -12 }}
              >
                {/* Hover Background Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 transition-all opacity-0 group-hover:opacity-100"></div>
                
                <div className="flex items-start justify-between mb-8">
                  <div className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {scholarship.category}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-tighter">Award</p>
                    <div className="text-3xl font-black text-blue-600 tracking-tight group-hover:scale-110 transition-transform">
                      ${scholarship.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                  {scholarship.title}
                </h3>
                <p className="text-gray-500 mb-8 line-clamp-3 font-medium text-base">
                  {scholarship.description}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-bold">{new Date(scholarship.deadline).toLocaleDateString()}</span>
                  </div>
                  <Link
                    to={`/scholarship/${scholarship.id}`}
                    className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight className="h-6 w-6" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-20 px-4">
        <motion.div 
          className="max-w-6xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Abstract circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-400/20 rounded-full -ml-20 -mb-20 blur-2xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]"> Ready to fund your <br className="hidden md:block" /> future? </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-bold opacity-90"> Join thousands of students already achieving their dreams with EduFund Scholarships. </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-white text-blue-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                Get Started Now
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-10 py-5 text-blue-50 font-black text-xl hover:text-white transition-all underline underline-offset-8 decoration-2 border border-white/20 rounded-2xl"
              >
                Member Log In
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;

