'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

interface Application {
  id: string;
  status: string;
  createdAt: string;
  task: {
    id: string;
    title: string;
    description: string;
    domain: string;
    duration: string;
    company: {
      id: string;
      email: string;
    };
  };
}

export default function StudentApplicationsPage() {
  const { } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await apiClient.get('/applications/my-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDomainColor = (domain: string) => {
    const colors = {
      MARKETING: 'bg-pink-100 text-pink-800',
      CODING: 'bg-blue-100 text-blue-800',
      UIUX: 'bg-purple-100 text-purple-800',
      FINANCE: 'bg-green-100 text-green-800',
    };
    return colors[domain as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      APPLIED: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Link 
              href="/student/dashboard"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track the status of your task applications</p>
        </div>

        <div className="grid gap-6">
          {applications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {application.task.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDomainColor(application.task.domain)}`}>
                      {application.task.domain}
                    </span>
                    <span>Duration: {application.task.duration}</span>
                    <span>Company: {application.task.company.email}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Applied: {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{application.task.description}</p>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Application ID: {application.id}
                </div>
                
                {application.status === 'ACCEPTED' && (
                  <div className="text-green-600 font-medium">
                    🎉 Congratulations! You&apos;ve been accepted for this task.
                  </div>
                )}
                
                {application.status === 'REJECTED' && (
                  <div className="text-red-600 font-medium">
                    Unfortunately, your application was not selected this time.
                  </div>
                )}
                
                {application.status === 'APPLIED' && (
                  <div className="text-yellow-600 font-medium">
                    ⏳ Your application is under review.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No applications yet.</p>
            <p className="text-gray-400">Browse tasks and apply to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
