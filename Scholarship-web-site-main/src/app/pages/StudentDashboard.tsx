import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, Calendar, TrendingUp, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

const StudentDashboard: React.FC = () => {
  const { user, scholarships, applications } = useApp();
  const myApplications = applications.filter(app => app.studentId === user?.id);

  // Calculate stats
  const totalApplied = myApplications.length;
  const approved = myApplications.filter(app => app.status === 'approved').length;
  const pending = myApplications.filter(app => app.status === 'pending').length;
  
  // Get upcoming deadlines (next 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcomingDeadlines = scholarships
    .filter(s => {
      const deadline = new Date(s.deadline);
      return deadline >= today && deadline <= thirtyDaysFromNow;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  // Recent applications
  const recentApplications = myApplications
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Here's an overview of your scholarship applications</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalApplied}</div>
            <p className="text-gray-600 text-sm">Total Applications</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{approved}</div>
            <p className="text-gray-600 text-sm">Approved</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{pending}</div>
            <p className="text-gray-600 text-sm">Pending Review</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{upcomingDeadlines.length}</div>
            <p className="text-gray-600 text-sm">Upcoming Deadlines</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              <Link to="/tracking" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {recentApplications.length > 0 ? (
                recentApplications.map(app => {
                  const scholarship = scholarships.find(s => s.id === app.scholarshipId);
                  return (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{scholarship?.title}</h3>
                        <p className="text-sm text-gray-500">
                          Submitted: {new Date(app.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === 'approved' ? 'bg-green-100 text-green-700' :
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No applications yet</p>
                  <Link to="/scholarships" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block">
                    Browse Scholarships
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Deadlines</h2>
              <Link to="/scholarships" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map(scholarship => {
                  const daysUntilDeadline = Math.ceil(
                    (new Date(scholarship.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div key={scholarship.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{scholarship.title}</h3>
                        <span className="text-blue-600 font-semibold">${scholarship.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(scholarship.deadline).toLocaleDateString()}</span>
                        <span className="ml-2 text-red-600">({daysUntilDeadline} days left)</span>
                      </div>
                      <Link
                        to={`/scholarship/${scholarship.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                      >
                        View Details →
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No upcoming deadlines</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to apply for more scholarships?</h2>
          <p className="mb-6 text-blue-100">Explore hundreds of scholarship opportunities tailored to your profile.</p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/scholarships"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Browse Scholarships
            </Link>
            <Link
              to="/tracking"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-400 transition-colors font-medium"
            >
              Track Applications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
