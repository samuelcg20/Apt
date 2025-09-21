'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { apiClient } from '@/lib/api';
import { Application } from '@/types';
import { formatDate, getStatusColor } from '@/lib/utils';
import Link from 'next/link';

export default function CompanyApplicationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'COMPANY')) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchApplications();
    }
  }, [user, authLoading, router]);

  const fetchApplications = async () => {
    try {
      const response = await apiClient.get('/applications/my-applications');
      setApplications(response.data?.applications || response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await apiClient.put(`/applications/${applicationId}/status`, { status });
      fetchApplications(); // Refresh applications
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'COMPANY') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/company/applications" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/company/dashboard"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">All Applications</h1>
          <p className="text-gray-600 mt-2">Review and manage student applications for your tasks</p>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {applications.length > 0 ? (
            applications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {application.task?.title || 'Task Title'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Applied by: {application.student?.name || 'Student'}</span>
                      <span>•</span>
                      <span>{formatDate(application.createdAt)}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>

                {/* Student Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">University:</span>
                      <span className="ml-2 font-medium">{application.student?.university || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Year of Study:</span>
                      <span className="ml-2 font-medium">Year {application.student?.yearOfStudy || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {application.student?.skills && application.student.skills.length > 0 && (
                    <div className="mt-3">
                      <span className="text-gray-600 text-sm">Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {application.student.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {application.student?.bio && (
                    <div className="mt-3">
                      <span className="text-gray-600 text-sm">Bio:</span>
                      <p className="text-sm text-gray-700 mt-1">{application.student.bio}</p>
                    </div>
                  )}
                </div>

                {/* Task Information */}
                {application.task && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Task Details</h4>
                    <p className="text-sm text-gray-700 mb-2">{application.task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Domain: {application.task.domain}</span>
                      <span>•</span>
                      <span>Duration: {application.task.duration}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {application.status === 'APPLIED' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateApplicationStatus(application.id, 'ACCEPTED')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Accept Application
                    </button>
                    <button
                      onClick={() => handleUpdateApplicationStatus(application.id, 'REJECTED')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject Application
                    </button>
                  </div>
                )}

                {application.status !== 'APPLIED' && (
                  <div className="text-sm text-gray-600">
                    Status: {application.status} on {formatDate(application.updatedAt)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-6">You haven&apos;t received any applications for your tasks.</p>
              <Link
                href="/company/tasks/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Task
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
