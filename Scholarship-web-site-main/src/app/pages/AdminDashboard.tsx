import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Users, FileText, DollarSign, TrendingUp, X, 
  Search, CheckCircle, Clock, AlertCircle, MoreVertical, LayoutGrid, List,
  Filter, Download, ArrowUpRight, Send
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, Scholarship, Application } from '../context/AppContext';

type ScholarshipFormInputs = {
  title: string;
  amount: string;
  deadline: string;
  category: string;
  description: string;
  eligibility: string;
  requiredDocuments: string;
  organization: string;
};

const AdminDashboard: React.FC = () => {
  const { scholarships, applications, addScholarship, updateScholarship, deleteScholarship, updateApplicationStatus } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [activeTab, setActiveTab] = useState<'scholarships' | 'applications'>('scholarships');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ScholarshipFormInputs>();

  const totalApplications = applications.length;
  const totalAmount = scholarships.reduce((sum, s) => sum + s.amount, 0);
  const activeScholarships = scholarships.filter(s => new Date(s.deadline) > new Date()).length;

  const onSubmit = async (data: ScholarshipFormInputs) => {
    const scholarshipData = {
      ...data,
      amount: parseInt(data.amount),
      eligibility: data.eligibility.split('\n').filter(e => e.trim()),
      requiredDocuments: data.requiredDocuments.split('\n').filter(d => d.trim()),
    };

    try {
      if (editingScholarship) {
        await updateScholarship(editingScholarship.id, scholarshipData);
      } else {
        await addScholarship(scholarshipData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save scholarship', error);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingScholarship(null);
    reset();
  };

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setValue('title', scholarship.title);
    setValue('amount', scholarship.amount.toString());
    setValue('deadline', scholarship.deadline);
    setValue('category', scholarship.category);
    setValue('description', scholarship.description);
    setValue('eligibility', scholarship.eligibility.join('\n'));
    setValue('requiredDocuments', scholarship.requiredDocuments.join('\n'));
    setValue('organization', scholarship.organization);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this scholarship? This action cannot be undone.')) {
      setIsDeleting(id);
      try {
        await deleteScholarship(id);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Admin Control</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">System Live & Operational</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center gap-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 transition-all shadow-sm">
              <Download className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              New Scholarship
            </button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: FileText, label: "Listed", value: scholarships.length, color: "bg-blue-50 text-blue-600", trend: "+2 this week" },
            { icon: Users, label: "Active Applications", value: totalApplications, color: "bg-purple-50 text-purple-600", trend: "+12% growth" },
            { icon: DollarSign, label: "Total Fund", value: `$${(totalAmount / 1000).toFixed(0)}k`, color: "bg-green-50 text-green-600", trend: "High budget" },
            { icon: Clock, label: "Active Programs", value: activeScholarships, color: "bg-orange-50 text-orange-600", trend: "Normal status" }
          ].map((stat, i) => (
            <motion.div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm" variants={itemVariants}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="px-2 py-1 bg-gray-50 text-[10px] font-black text-gray-400 uppercase rounded-lg border border-gray-100">
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-2 border-b border-gray-50">
            <div className="flex p-2 gap-2">
              <button
                onClick={() => setActiveTab('scholarships')}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === 'scholarships' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Scholarships
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === 'applications' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Applications
              </button>
            </div>
            <div className="flex items-center gap-4 p-2 px-6">
              <div className="relative group flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Fast search..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium"
                />
              </div>
              <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:text-blue-600 transition-all">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'scholarships' ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Scholarship Details</th>
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Award Amount</th>
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Deadline</th>
                    <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <AnimatePresence mode="popLayout">
                    {scholarships.map((s) => (
                      <motion.tr 
                        key={s.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-blue-50/20 group transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{s.title}</div>
                          <div className="text-xs font-bold text-gray-400 mt-1">{s.organization}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-100">
                            {s.category}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-lg font-black text-gray-900 tracking-tight">${s.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 font-bold text-gray-500 text-sm">
                            <Clock className="h-4 w-4 text-orange-400" />
                            {new Date(s.deadline).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(s)}
                              className="p-2 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(s.id)}
                              disabled={isDeleting === s.id}
                              className="p-2 hover:bg-red-100 text-red-500 rounded-xl transition-all disabled:opacity-50"
                            >
                              {isDeleting === s.id ? <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="h-5 w-5" />}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Scholarship & Student</th>
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Applied Date</th>
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Current Status</th>
                    <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Update Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map((app) => {
                    const scholarship = scholarships.find(s => s.id === app.scholarshipId);
                    return (
                      <tr key={app.id} className="hover:bg-indigo-50/20 group transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-bold text-gray-900">{scholarship?.title || 'Unknown Program'}</div>
                          <div className="text-xs font-bold text-gray-400 mt-1 flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            ID: {app.studentId.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="px-8 py-6">
                            <div className="text-sm font-bold text-gray-500">
                                {new Date(app.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                            app.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                            app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                            app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {app.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                            {app.status === 'pending' && <Clock className="h-3 w-3" />}
                            {app.status === 'rejected' && <AlertCircle className="h-3 w-3" />}
                            {app.status}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end">
                            <select
                                value={app.status}
                                onChange={(e) => updateApplicationStatus(app.id, e.target.value as Application['status'])}
                                className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
                            >
                                <option value="submitted">Submitted</option>
                                <option value="pending">Processing</option>
                                <option value="approved">Approve</option>
                                <option value="rejected">Reject</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Improved Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-[2.5rem] shadow-2xl relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100"
              >
                <div className="sticky top-0 bg-white border-b border-gray-50 px-8 py-6 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        {editingScholarship ? 'Update Program' : 'New Scholarship'}
                    </h2>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Educational Funding Form</p>
                  </div>
                  <button onClick={handleCloseModal} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                    <X className="h-7 w-7 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Title</label>
                            <input
                                {...register('title', { required: 'Title is required' })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium"
                                placeholder="Global Science Academic Award 2024"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Award Amount ($)</label>
                            <input
                                type="number"
                                {...register('amount', { required: 'Amount is required' })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium"
                                placeholder="5000"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Application Deadline</label>
                            <input
                                type="date"
                                {...register('deadline', { required: 'Deadline is required' })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
                            <input
                                {...register('category', { required: 'Category is required' })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium"
                                placeholder="Academic, STEM, Arts..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Organization</label>
                            <input
                                {...register('organization', { required: 'Organization is required' })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium"
                                placeholder="Tech Future Foundation"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Full Description</label>
                      <textarea
                        {...register('description', { required: 'Description is required' })}
                        rows={4}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium resize-none"
                        placeholder="Detail about the scholarship, goals, and history..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Eligibility (Line by line)</label>
                            <textarea
                                {...register('eligibility', { required: 'Eligibility is required' })}
                                rows={4}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium resize-none text-sm"
                                placeholder="Minimum 3.5 GPA&#10;Full-time student"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Required Papers (Line by line)</label>
                            <textarea
                                {...register('requiredDocuments', { required: 'Documents are required' })}
                                rows={4}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium resize-none text-sm"
                                placeholder="Official Transcript&#10;Essay"
                            />
                        </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white px-8 py-5 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="h-6 w-6" />}
                      {editingScholarship ? 'Update Package' : 'Publish Scholarship'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-8 py-5 border-2 border-gray-100 text-gray-400 rounded-[1.5rem] font-bold hover:bg-gray-50 hover:text-gray-600 transition-all"
                    >
                      Discard
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;

