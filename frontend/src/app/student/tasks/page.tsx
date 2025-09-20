'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  domain: string;
  duration: string;
  deliverables: string;
  status: string;
  createdAt: string;
  company: {
    id: string;
    email: string;
  };
  applications: Application[];
}

interface Application {
  id: string;
  status: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    university: string;
    yearOfStudy: number;
    skills: string[];
  };
}

export default function StudentTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filter !== 'ALL' && { domain: filter }),
      });
      
      const response = await apiClient.get(`/tasks?${params}`);
      setTasks(response.data.tasks);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleApply = async (taskId: string) => {
    try {
      await apiClient.post(`/applications/apply/${taskId}`);
      // Refresh tasks to show updated application status
      fetchTasks();
    } catch (error) {
      console.error('Error applying to task:', error);
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

  const getApplicationStatus = (task: Task) => {
    const userApplication = task.applications.find(app => 
      app.student.id === user?.studentProfile?.id
    );
    return userApplication?.status || null;
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/student/dashboard"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Tasks</h1>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'ALL' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter('MARKETING')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'MARKETING' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Marketing
            </button>
            <button
              onClick={() => setFilter('CODING')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'CODING' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Coding
            </button>
            <button
              onClick={() => setFilter('UIUX')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'UIUX' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              UI/UX
            </button>
            <button
              onClick={() => setFilter('FINANCE')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'FINANCE' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Finance
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {tasks.map((task) => {
            const applicationStatus = getApplicationStatus(task);
            
            return (
              <div key={task.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDomainColor(task.domain)}`}>
                        {task.domain}
                      </span>
                      <span>Duration: {task.duration}</span>
                      <span>Status: {task.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Posted by: {task.company.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{task.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Deliverables:</h4>
                  <p className="text-gray-700">{task.deliverables}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {task.applications.length} application{task.applications.length !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="flex gap-2">
                    {applicationStatus ? (
                      <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        applicationStatus === 'ACCEPTED' 
                          ? 'bg-green-100 text-green-800'
                          : applicationStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {applicationStatus}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(task.id)}
                        disabled={task.status !== 'OPEN'}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          task.status === 'OPEN'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {task.status === 'OPEN' ? 'Apply Now' : 'Closed'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 rounded-lg ${
                    page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
