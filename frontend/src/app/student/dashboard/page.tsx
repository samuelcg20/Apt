'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import apiClient from '@/lib/api';
import { StudentProfile, Task, Application } from '@/types';
import { formatDate, getDomainColor, getStatusColor } from '@/lib/utils';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, tasksRes, applicationsRes] = await Promise.all([
        apiClient.get('/users/profile'),
        apiClient.get('/tasks?limit=5'),
        apiClient.get('/applications/my-applications?limit=5')
      ]);

      setProfile(profileRes.data.profile);
      setRecentTasks(tasksRes.data.tasks);
      setApplications(applicationsRes.data.applications);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'STUDENT') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/student/dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.name || 'Student'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s what&apos;s happening with your applications and opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Status */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h2>
              {profile ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Profile Complete</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>{profile.university}</p>
                    <p>Year {profile.yearOfStudy}</p>
                    <p>{profile.skills.length} skills listed</p>
                    <p>{profile.projects.length} portfolio projects</p>
                  </div>
                  <Link
                    href="/student/profile"
                    className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Update Profile →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Profile Incomplete</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Complete your profile to start applying for tasks.
                  </p>
                  <Link
                    href="/student/profile"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Complete Profile
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                <Link
                  href="/student/applications"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {application.task?.title || 'Task Title'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Applied on {formatDate(application.createdAt)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No applications yet</p>
                  <Link
                    href="/student/tasks"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Browse Tasks →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Tasks */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Available Tasks</h2>
              <Link
                href="/student/tasks"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            {recentTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDomainColor(task.domain)}`}>
                        {task.domain}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{task.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{task.duration}</span>
                      <span>{formatDate(task.createdAt)}</span>
                    </div>
                    <Link
                      href={`/student/tasks/${task.id}`}
                      className="block mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No tasks available at the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
