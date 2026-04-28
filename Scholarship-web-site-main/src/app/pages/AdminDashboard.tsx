import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Users, FileText, DollarSign, Clock, AlertCircle, X, 
  Search, CheckCircle, Filter, Download, Send, Eye, Phone, MapPin, GraduationCap, Calendar, TrendingUp, User
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
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);
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

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingScholarship(null);
    reset();
  };

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

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Admin Control</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">System Live & Operational</p>
            </div>
          </motion.div>

          <motion.div className="flex items-center gap-3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: FileText, label: "Listed", value: scholarships.length, color: "bg-blue-50 text-blue-600" },
            { icon: Users, label: "Active Applications", value: totalApplications, color: "bg-purple-50 text-purple-600" },
            { icon: DollarSign, label: "Total Fund", value: `$${(totalAmount / 1000).toFixed(0)}k`, color: "bg-green-50 text-green-600" },
            { icon: Clock, label: "Active Programs", value: activeScholarships, color: "bg-orange-50 text-orange-600" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className={`p-3 w-max rounded-2xl mb-4 ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-2 border-b border-gray-50">
            <div className="flex p-2 gap-2">
              <button
                onClick={() => setActiveTab('scholarships')}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === 'scholarships' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Scholarships
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === 'applications' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Applications
              </button>
            </div>
            <div className="relative group p-2 px-6">
              <Search className="absolute left-9 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search..." className="w-full md:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'scholarships' ? (
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase">Scholarship</th>
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase">Award</th>
                    <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {scholarships.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900">{s.title}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-black">{s.organization}</div>
                      </td>
                      <td className="px-8 py-6 font-black text-blue-600">${s.amount.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={() => handleEdit(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="h-4 w-4"/></button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg ml-2"><Trash2 className="h-4 w-4"/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase">Student Name</th>
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase">Status</th>
                    <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="px-8 py-6 font-bold text-gray-900">{app.fullName || 'External Application'}</td>
                      <td className="px-8 py-6">
                         <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                          app.status === 'approved' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}> {app.status} </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={() => setViewingApplication(app)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-2 ml-auto">
                            <Eye className="h-3 w-3" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Info Modal */}
        <AnimatePresence>
          {viewingApplication && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
                <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
                    <h2 className="text-xl font-black">Application Review</h2>
                    <button onClick={() => setViewingApplication(null)}><X className="h-6 w-6"/></button>
                </div>
                <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                            <p className="font-bold text-gray-900">{viewingApplication.fullName || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                            <p className="font-bold text-gray-900 truncate">{viewingApplication.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                            <p className="font-bold text-gray-900">{viewingApplication.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Academic Year</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-blue-600" />
                                <p className="font-bold text-gray-900">{viewingApplication.year || 'N/A'}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current GPA</p>
                            <p className="font-black text-green-600 text-lg">{viewingApplication.gpa || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Major / Course</p>
                            <p className="font-bold text-gray-900">{viewingApplication.major || 'N/A'}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Residential Address</p>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-3 w-3 text-blue-600 mt-1" />
                                <p className="font-bold text-gray-900">{viewingApplication.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Personal Statement</p>
                        <p className="text-sm italic text-gray-600 leading-relaxed break-words whitespace-pre-wrap">
                            "{viewingApplication.statement || 'No statement provided.'}"
                        </p>
                    </div>

                    {viewingApplication.documents && viewingApplication.documents.length > 0 && (
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Submitted Documents</p>
                            <div className="flex flex-wrap gap-2">
                                {viewingApplication.documents.map((doc, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100">
                                        <FileText className="h-3 w-3" />
                                        {doc.split('/').pop() || `Document ${idx + 1}`}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-6 bg-gray-50 flex gap-4 border-t border-gray-100">
                    <button 
                        onClick={() => { updateApplicationStatus(viewingApplication.id, 'approved'); setViewingApplication(null); }} 
                        className="flex-1 bg-green-600 text-white py-4 rounded-xl font-black text-sm shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
                    >
                        APPROVE APPLICATION
                    </button>
                    <button 
                        onClick={() => { updateApplicationStatus(viewingApplication.id, 'rejected'); setViewingApplication(null); }} 
                        className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black text-sm shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
                    >
                        REJECT APPLICATION
                    </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Scholarship Form Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] w-full max-w-xl p-8 shadow-2xl">
                <div className="flex justify-between mb-6"><h2 className="text-2xl font-black tracking-tight">{editingScholarship ? 'Edit Scholarship' : 'New Scholarship'}</h2><button onClick={handleCloseModal}><X className="h-6 w-6 text-gray-400" /></button></div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <input {...register('title', { required: true })} placeholder="Title" className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" {...register('amount', { required: true })} placeholder="Amount ($)" className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
                    <input type="date" {...register('deadline', { required: true })} className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
                  </div>
                  <textarea {...register('description', { required: true })} placeholder="Description" rows={3} className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-medium" />
                  <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all"> {editingScholarship ? 'Update' : 'Publish'} </button>
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
