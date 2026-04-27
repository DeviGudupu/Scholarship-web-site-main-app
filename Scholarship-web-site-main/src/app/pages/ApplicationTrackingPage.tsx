import React, { useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle, Clock, XCircle, FileText, Calendar, Search, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ApplicationTrackingPage: React.FC = () => {
  const { scholarships, applications, user, deleteApplication } = useApp();
  const [filter, setFilter] = useState<'all' | 'submitted' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const myApplications = applications.filter(app => app.studentId === user?.id);

  // Filter applications
  const filteredApplications = myApplications.filter(app => {
    const scholarship = scholarships.find(s => s.id === app.scholarshipId);
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = searchQuery === '' || 
      scholarship?.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Count by status
  const statusCounts = {
    all: myApplications.length,
    submitted: myApplications.filter(a => a.status === 'submitted').length,
    pending: myApplications.filter(a => a.status === 'pending').length,
    approved: myApplications.filter(a => a.status === 'approved').length,
    rejected: myApplications.filter(a => a.status === 'rejected').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <FileText className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Tracking</h1>
          <p className="text-gray-600">Monitor the status of all your scholarship applications</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setFilter('submitted')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'submitted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Submitted ({statusCounts.submitted})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({statusCounts.approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({statusCounts.rejected})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map(app => {
              const scholarship = scholarships.find(s => s.id === app.scholarshipId);
              if (!scholarship) return null;

              return (
                <div key={app.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(app.status)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {scholarship.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">{scholarship.organization}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Submitted: {new Date(app.submittedDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium">Amount: ${scholarship.amount.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        <div className="flex items-center gap-4">
                          <Link
                            to={`/scholarship/${scholarship.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View Details →
                          </Link>
                          <button
                            type="button"
                            onClick={async () => await deleteApplication(app.id)}
                            className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              app.status === 'submitted' || app.status === 'pending' || app.status === 'approved' || app.status === 'rejected'
                                ? 'bg-blue-600'
                                : 'bg-gray-300'
                            }`}>
                              <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xs text-gray-600 mt-1">Submitted</span>
                          </div>

                          <div className={`h-0.5 w-16 ${
                            app.status === 'pending' || app.status === 'approved' || app.status === 'rejected'
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`} />

                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              app.status === 'pending' || app.status === 'approved' || app.status === 'rejected'
                                ? 'bg-blue-600'
                                : 'bg-gray-300'
                            }`}>
                              <Clock className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xs text-gray-600 mt-1">Under Review</span>
                          </div>

                          <div className={`h-0.5 w-16 ${
                            app.status === 'approved' || app.status === 'rejected'
                              ? app.status === 'approved' ? 'bg-green-600' : 'bg-red-600'
                              : 'bg-gray-300'
                          }`} />

                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              app.status === 'approved'
                                ? 'bg-green-600'
                                : app.status === 'rejected'
                                ? 'bg-red-600'
                                : 'bg-gray-300'
                            }`}>
                              {app.status === 'approved' ? (
                                <CheckCircle className="h-5 w-5 text-white" />
                              ) : app.status === 'rejected' ? (
                                <XCircle className="h-5 w-5 text-white" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-white" />
                              )}
                            </div>
                            <span className="text-xs text-gray-600 mt-1">
                              {app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Decision'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-6">
                {filter !== 'all' 
                  ? `You don't have any ${filter} applications yet.`
                  : "You haven't applied to any scholarships yet."
                }
              </p>
              <Link
                to="/scholarships"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse Scholarships
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTrackingPage;
