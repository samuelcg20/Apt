'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  currentPath: string;
}

export default function Navbar({ currentPath }: NavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/landing');
  };

  if (!user) return null;

  const isStudent = user.role === 'STUDENT';
  const basePath = isStudent ? '/student' : '/company';

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={basePath + '/dashboard'} className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">APT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">APT</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              href={basePath + '/dashboard'}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPath === basePath + '/dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            
            <Link
              href={basePath + '/tasks'}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPath.startsWith(basePath + '/tasks')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isStudent ? 'Browse Tasks' : 'My Tasks'}
            </Link>

            <Link
              href={basePath + '/profile'}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPath === basePath + '/profile'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Profile
            </Link>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user.email}</div>
                  <div className="text-gray-500 capitalize">{user.role.toLowerCase()}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
