'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { apiClient } from '@/lib/api';
import { Task } from '@/types';
import { formatDate, getDomainColor, getStatusColor } from '@/lib/utils';
import Link from 'next/link';

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = useCallback(async () => {
    try {
      const response = await apiClient.get(`/tasks/${params.id}`);
      setTask(response.data);
    } catch (error) {
      console.error('Error fetching task:', error);
      setTask(null); // Set null on error
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'COMPANY')) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchTask();
    }
  }, [user, authLoading, router, fetchTask]);

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await apiClient.put(`/applications/${applicationId}/status`, { status });
      fetchTask(); // Refresh task
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleUpdateTaskStatus = async (status: 'OPEN' | 'CLOSED') => {
    try {
      await apiClient.put(`/tasks/${params.id}`, { status });
      fetchTask(); // Refresh task
    } catch (error) {
      console.error('Error updating task status:', error);
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

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/company/tasks" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h1>
            <Link href="/company/tasks" className="text-blue-600 hover:text-blue-800">
              ← Back to Tasks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/company/tasks" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/company/tasks"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Back to Tasks
            </Link>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDomainColor(task.domain)}`}>
                  {task.domain}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span>Duration: {task.duration}</span>
                <span>Created: {formatDate(task.createdAt)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateTaskStatus(task.status === 'OPEN' ? 'CLOSED' : 'OPEN')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  task.status === 'OPEN'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {task.status === 'OPEN' ? 'Close Task' : 'Reopen Task'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Description</h2>
              <p className="text-gray-700 mb-6">{task.description}</p>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Deliverables</h3>
                <p className="text-gray-700">{task.deliverables}</p>
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Applications ({task.applications.length})
              </h2>
              
              {task.applications.length > 0 ? (
                <div className="space-y-4">
                  {task.applications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {application.student?.name || 'Student'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {application.student?.university || 'University'} • Year {application.student?.yearOfStudy || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Applied on {formatDate(application.createdAt)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      
                      {application.student?.skills && application.student.skills.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-2">
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
                        <p className="text-sm text-gray-700 mb-3">{application.student.bio}</p>
                      )}

                      {application.status === 'APPLIED' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateApplicationStatus(application.id, 'ACCEPTED')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateApplicationStatus(application.id, 'REJECTED')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No applications yet for this task.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Applications</span>
                  <span className="font-medium">{task.applications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Review</span>
                  <span className="font-medium">
                    {task.applications.filter(app => app.status === 'APPLIED').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accepted</span>
                  <span className="font-medium">
                    {task.applications.filter(app => app.status === 'ACCEPTED').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rejected</span>
                  <span className="font-medium">
                    {task.applications.filter(app => app.status === 'REJECTED').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/company/tasks/create"
                  className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create New Task
                </Link>
                <Link
                  href="/company/applications"
                  className="block w-full bg-gray-600 text-white text-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  View All Applications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
