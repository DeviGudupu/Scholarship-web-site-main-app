import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Upload, X, CheckCircle, ArrowLeft, AlertCircle, FileText, Send, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';

type ApplicationFormInputs = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  gpa: string;
  major: string;
  year: string;
  statement: string;
};

const ApplicationFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { scholarships, user, addApplication } = useApp();
  const navigate = useNavigate();

  const scholarship = scholarships.find(s => s.id === id);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationFormInputs>({
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
    },
    mode: 'onChange'
  });

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-sm w-full mx-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Scholarship Not Found</h2>
          <p className="text-gray-500 mb-6">The scholarship you are looking for does not exist or has been removed.</p>
          <Link to="/scholarships" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Back to Scholarships
          </Link>
        </div>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map(f => f.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f !== fileName));
  };

  const onSubmit = async (data: ApplicationFormInputs) => {
    if (!id) return;
    try {
      await addApplication(id, data);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 transition-all duration-500">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-white">
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-25"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Success!</h2>
          <p className="text-gray-600 mb-10 leading-relaxed">
            Your application for <span className="font-bold text-blue-600 whitespace-nowrap">{scholarship.title}</span> has been successfully submitted. We'll notify you once it's reviewed.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all font-bold text-lg shadow-lg shadow-blue-200 active:scale-95"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/tracking"
              className="border-2 border-gray-100 text-gray-600 px-8 py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all font-bold"
            >
              Track My Progress
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to={`/scholarship/${id}`}
          className="group inline-flex items-center text-gray-500 hover:text-blue-600 font-bold mb-8 transition-colors"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 mr-3 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </div>
          Back to Scholarship Details
        </Link>

        {/* Form Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100/50">
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-8 md:p-12 text-white relative">
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 bg-blue-500/30 rounded-full text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">Application Form</span>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Apply for Scholarship</h1>
              <p className="text-blue-100 text-lg font-medium opacity-90">{scholarship.title}</p>
            </div>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full -mr-20 -mt-20 opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400 rounded-full -ml-16 -mb-16 opacity-30 blur-2xl"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-12">
            {/* Personal Information */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <User className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Personal Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <input
                    type="text"
                    {...register('fullName', { required: 'Full name is required' })}
                    className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${
                      errors.fullName ? 'border-red-200 focus:border-red-500 focus:bg-white' : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs font-bold ml-1">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    })}
                    className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${
                      errors.email ? 'border-red-200 focus:border-red-500 focus:bg-white' : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50'
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs font-bold ml-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone number is required' })}
                    className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${
                      errors.phone ? 'border-red-200 focus:border-red-500 focus:bg-white' : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50'
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone && <p className="text-red-500 text-xs font-bold ml-1">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-bold text-gray-700 ml-1">Current Address</label>
                  <input
                    type="text"
                    {...register('address', { required: 'Address is required' })}
                    className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${
                      errors.address ? 'border-red-200 focus:border-red-500 focus:bg-white' : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50'
                    }`}
                    placeholder="123 Education St, Success City"
                  />
                  {errors.address && <p className="text-red-500 text-xs font-bold ml-1">{errors.address.message}</p>}
                </div>
              </div>
            </section>

            {/* Academic Information */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FileText className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Academic Details</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label htmlFor="gpa" className="block text-sm font-bold text-gray-700 ml-1">Current GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('gpa', { 
                      required: 'GPA is required',
                      min: { value: 0, message: 'GPA cannot be negative' },
                      max: { value: 4, message: 'GPA cannot exceed 4.0' }
                    })}
                    className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${
                      errors.gpa ? 'border-red-200 focus:border-red-500 focus:bg-white' : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50'
                    }`}
                    placeholder="4.00"
                  />
                  {errors.gpa && <p className="text-red-500 text-xs font-bold ml-1">{errors.gpa.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="major" className="block text-sm font-bold text-gray-700 ml-1">Academic Major</label>
                  <input
                    type="text"
                    {...register('major', { required: 'Major is required' })}
                    className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${
                      errors.major ? 'border-red-200 focus:border-red-500 focus:bg-white' : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50'
                    }`}
                    placeholder="Computer Science"
                  />
                  {errors.major && <p className="text-red-500 text-xs font-bold ml-1">{errors.major.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="year" className="block text-sm font-bold text-gray-700 ml-1">Current Year</label>
                  <select
                    {...register('year', { required: 'Please select your year' })}
                    className={`w-full px-6 py-[1.125rem] bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all appearance-none cursor-pointer ${
                      errors.year ? 'border-red-200 focus:border-red-500 focus:bg-white' : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50'
                    }`}
                  >
                    <option value="">Select year</option>
                    <option value="freshman">Freshman</option>
                    <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    <option value="graduate">Graduate</option>
                  </select>
                  {errors.year && <p className="text-red-500 text-xs font-bold ml-1">{errors.year.message}</p>}
                </div>
              </div>
            </section>

            {/* Personal Statement */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <FileText className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Statement of Purpose</h2>
              </div>
              <p className="text-gray-500 mb-6 font-medium">Explain why you are a good candidate for this scholarship.</p>
              <textarea
                {...register('statement', { 
                  required: 'Statement is required',
                  minLength: { value: 100, message: 'Statement must be at least 100 characters' }
                })}
                rows={8}
                className={`w-full px-8 py-6 bg-gray-50 border-2 rounded-[2rem] focus:outline-none transition-all resize-none ${
                  errors.statement ? 'border-red-200 focus:border-red-500 focus:bg-white' : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50'
                }`}
                placeholder="Tell us about yourself, your goals, and why you deserve this scholarship..."
              />
              {errors.statement && <p className="text-red-500 text-xs font-bold mt-2 ml-2">{errors.statement.message}</p>}
            </section>

            {/* Document Upload */}
            <section className="bg-[#fbfeff] rounded-[2rem] p-8 md:p-10 border border-blue-100/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Required Documents</h2>
                  <p className="text-blue-600 text-sm font-bold">Please provide authentic digital copies</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scholarship.requiredDocuments.map((doc, index) => (
                    <span key={index} className="px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-extrabold rounded-full border border-blue-100">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="group border-4 border-dashed border-gray-100 rounded-[2rem] p-12 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-500">
                  <Upload className="h-10 w-10 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-xl font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2">Select files</span>
                  <span className="text-xl font-bold text-gray-400 ml-2">to upload</span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-400 mt-4 font-bold tracking-tight">PDF, DOC, DOCX up to 10MB each</p>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-8 space-y-3">
                  <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest">{uploadedFiles.length} File(s) Selected</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm animate-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-bold">{file}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file)}
                        className="p-2 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-lg transition-all"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Submission Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-10 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 bg-blue-600 text-white px-10 py-5 rounded-[1.5rem] hover:bg-blue-700 transition-all font-extrabold text-xl shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
              <Link
                to={`/scholarship/${id}`}
                className="w-full sm:w-auto px-10 py-5 text-gray-500 font-bold text-xl hover:text-gray-900 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormPage;

