'use client';

import { useState, useEffect } from 'react';
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
    bio?: string;
  };
}

export default function CompanyTasksPage() {
  const { } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    domain: 'MARKETING',
    duration: '',
    deliverables: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/tasks/company/my-tasks');
      setTasks(response.data?.tasks || response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/tasks', newTask);
      setNewTask({
        title: '',
        description: '',
        domain: 'MARKETING',
        duration: '',
        deliverables: '',
        dueDate: '',
      });
      setShowCreateForm(false);
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await apiClient.put(`/applications/${applicationId}/status`, { status });
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error updating application status:', error);
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
      OPEN: 'bg-green-100 text-green-800',
      CLOSED: 'bg-red-100 text-red-800',
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link 
                  href="/company/dashboard"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  ← Back to Dashboard
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            </div>
            <div className="flex gap-3">
              <Link
                href="/company/tasks/create"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create New Task
              </Link>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showCreateForm ? 'Cancel' : 'Quick Create'}
              </button>
            </div>
          </div>

          {showCreateForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domain
                    </label>
                    <select
                      value={newTask.domain}
                      onChange={(e) => setNewTask({ ...newTask, domain: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MARKETING">Marketing</option>
                      <option value="CODING">Coding</option>
                      <option value="UIUX">UI/UX</option>
                      <option value="FINANCE">Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={newTask.duration}
                      onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                      placeholder="e.g., 2 weeks, 1 month"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deliverables
                  </label>
                  <textarea
                    value={newTask.deliverables}
                    onChange={(e) => setNewTask({ ...newTask, deliverables: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="grid gap-6">
          {tasks.map((task) => (
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span>Duration: {task.duration}</span>
                  </div>
                </div>
                <div className="text-right">
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

              {task.applications.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Applications ({task.applications.length})
                  </h4>
                  <div className="space-y-3">
                    {task.applications.map((application) => (
                      <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {application.student.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {application.student.university} • Year {application.student.yearOfStudy}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            application.status === 'ACCEPTED' 
                              ? 'bg-green-100 text-green-800'
                              : application.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                        
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

                        {application.student.bio && (
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
                </div>
              )}
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tasks created yet.</p>
            <p className="text-gray-400">Create your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
