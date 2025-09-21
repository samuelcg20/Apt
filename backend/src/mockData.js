// Mock data for demonstration purposes
const mockUsers = [
  {
    id: 'user_1',
    email: 'john.doe@nus.edu.sg',
    role: 'STUDENT',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'user_2',
    email: 'sarah.wong@ntu.edu.sg',
    role: 'STUDENT',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 'user_3',
    email: 'mike.chen@company.com',
    role: 'COMPANY',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 'user_4',
    email: 'lisa.tan@startup.sg',
    role: 'COMPANY',
    createdAt: '2024-01-25T16:45:00Z'
  }
];

const mockStudentProfiles = [
  {
    id: 'profile_1',
    name: 'John Doe',
    university: 'National University of Singapore',
    yearOfStudy: 3,
    skills: ['React', 'Node.js', 'Python', 'UI/UX Design'],
    bio: 'Passionate computer science student with experience in full-stack development and design.',
    userId: 'user_1',
    createdAt: '2024-01-15T10:35:00Z',
    projects: [
      {
        id: 'project_1',
        title: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform using React and Node.js',
        link: 'https://github.com/johndoe/ecommerce',
        studentId: 'profile_1',
        createdAt: '2024-01-16T10:00:00Z'
      },
      {
        id: 'project_2',
        title: 'Mobile App Design',
        description: 'Designed a mobile app interface for food delivery service',
        link: 'https://figma.com/design/foodapp',
        studentId: 'profile_1',
        createdAt: '2024-01-20T14:00:00Z'
      }
    ]
  },
  {
    id: 'profile_2',
    name: 'Sarah Wong',
    university: 'Nanyang Technological University',
    yearOfStudy: 2,
    skills: ['JavaScript', 'Vue.js', 'Data Analysis', 'Marketing'],
    bio: 'Business student with strong technical skills and marketing experience.',
    userId: 'user_2',
    createdAt: '2024-01-20T14:20:00Z',
    projects: [
      {
        id: 'project_3',
        title: 'Data Visualization Dashboard',
        description: 'Created interactive dashboards for business analytics using Vue.js',
        link: 'https://github.com/sarahwong/dashboard',
        studentId: 'profile_2',
        createdAt: '2024-01-22T09:00:00Z'
      }
    ]
  }
];

const mockTasks = [
  {
    id: 'task_1',
    title: 'Develop Mobile App Landing Page',
    description: 'We need a modern, responsive landing page for our new mobile app. The page should showcase key features, include a signup form, and be optimized for conversion.',
    domain: 'UIUX',
    duration: '2 weeks',
    deliverables: 'Complete landing page with responsive design, contact form, and analytics integration',
    status: 'OPEN',
    companyId: 'user_3',
    createdAt: '2024-01-28T10:00:00Z',
    company: {
      id: 'user_3',
      email: 'mike.chen@company.com'
    },
    applications: [
      {
        id: 'app_1',
        taskId: 'task_1',
        studentId: 'profile_1',
        status: 'APPLIED',
        createdAt: '2024-01-29T11:00:00Z',
        student: {
          id: 'profile_1',
          name: 'John Doe',
          university: 'National University of Singapore',
          yearOfStudy: 3,
          skills: ['React', 'Node.js', 'Python', 'UI/UX Design'],
          user: {
            id: 'user_1',
            email: 'john.doe@nus.edu.sg'
          },
          projects: mockStudentProfiles[0].projects
        }
      }
    ]
  },
  {
    id: 'task_2',
    title: 'Social Media Marketing Campaign',
    description: 'Create and execute a 4-week social media marketing campaign for our new product launch. Need content creation, scheduling, and performance tracking.',
    domain: 'MARKETING',
    duration: '4 weeks',
    deliverables: 'Complete marketing strategy, content calendar, and performance report',
    status: 'OPEN',
    companyId: 'user_4',
    createdAt: '2024-01-30T14:30:00Z',
    company: {
      id: 'user_4',
      email: 'lisa.tan@startup.sg'
    },
    applications: [
      {
        id: 'app_2',
        taskId: 'task_2',
        studentId: 'profile_2',
        status: 'ACCEPTED',
        createdAt: '2024-01-31T09:15:00Z',
        student: {
          id: 'profile_2',
          name: 'Sarah Wong',
          university: 'Nanyang Technological University',
          yearOfStudy: 2,
          skills: ['JavaScript', 'Vue.js', 'Data Analysis', 'Marketing'],
          user: {
            id: 'user_2',
            email: 'sarah.wong@ntu.edu.sg'
          },
          projects: mockStudentProfiles[1].projects
        }
      }
    ]
  },
  {
    id: 'task_3',
    title: 'Financial Analysis Dashboard',
    description: 'Build a comprehensive financial dashboard that tracks revenue, expenses, and key metrics. Should include data visualization and export capabilities.',
    domain: 'FINANCE',
    duration: '3 weeks',
    deliverables: 'Interactive dashboard with real-time data, export functionality, and user documentation',
    status: 'CLOSED',
    companyId: 'user_3',
    createdAt: '2024-01-15T08:00:00Z',
    company: {
      id: 'user_3',
      email: 'mike.chen@company.com'
    },
    applications: []
  }
];

const mockApplications = [
  {
    id: 'app_1',
    taskId: 'task_1',
    studentId: 'profile_1',
    status: 'APPLIED',
    createdAt: '2024-01-29T11:00:00Z',
    task: {
      id: 'task_1',
      title: 'Develop Mobile App Landing Page',
      domain: 'UIUX',
      company: {
        id: 'user_3',
        email: 'mike.chen@company.com'
      }
    }
  },
  {
    id: 'app_2',
    taskId: 'task_2',
    studentId: 'profile_2',
    status: 'ACCEPTED',
    createdAt: '2024-01-31T09:15:00Z',
    task: {
      id: 'task_2',
      title: 'Social Media Marketing Campaign',
      domain: 'MARKETING',
      company: {
        id: 'user_4',
        email: 'lisa.tan@startup.sg'
      }
    }
  }
];

const mockReviews = [
  {
    id: 'review_1',
    reviewerId: 'user_3',
    revieweeId: 'user_1',
    rating: 5,
    comment: 'Excellent work! John delivered high-quality code and was very responsive to feedback.',
    createdAt: '2024-02-15T10:00:00Z',
    reviewer: {
      id: 'user_3',
      email: 'mike.chen@company.com',
      role: 'COMPANY'
    },
    reviewee: {
      id: 'user_1',
      email: 'john.doe@nus.edu.sg',
      role: 'STUDENT'
    }
  },
  {
    id: 'review_2',
    reviewerId: 'user_4',
    revieweeId: 'user_2',
    rating: 4,
    comment: 'Great marketing campaign! Sarah was creative and met all deadlines.',
    createdAt: '2024-02-20T14:30:00Z',
    reviewer: {
      id: 'user_4',
      email: 'lisa.tan@startup.sg',
      role: 'COMPANY'
    },
    reviewee: {
      id: 'user_2',
      email: 'sarah.wong@ntu.edu.sg',
      role: 'STUDENT'
    }
  }
];

// Helper functions to get mock data
const getMockUser = (userId) => {
  return mockUsers.find(user => user.id === userId) || mockUsers[0];
};

const getMockStudentProfile = (userId) => {
  return mockStudentProfiles.find(profile => profile.userId === userId);
};

const getMockTasks = (filters = {}) => {
  let filteredTasks = [...mockTasks];
  
  if (filters.domain) {
    filteredTasks = filteredTasks.filter(task => task.domain === filters.domain);
  }
  
  if (filters.status) {
    filteredTasks = filteredTasks.filter(task => task.status === filters.status);
  }
  
  return filteredTasks;
};

const getMockTask = (taskId) => {
  return mockTasks.find(task => task.id === taskId);
};

const getMockApplications = (filters = {}) => {
  let filteredApplications = [...mockApplications];
  
  if (filters.studentId) {
    filteredApplications = filteredApplications.filter(app => app.studentId === filters.studentId);
  }
  
  if (filters.taskId) {
    filteredApplications = filteredApplications.filter(app => app.taskId === filters.taskId);
  }
  
  return filteredApplications;
};

const getMockReviews = (filters = {}) => {
  let filteredReviews = [...mockReviews];
  
  if (filters.revieweeId) {
    filteredReviews = filteredReviews.filter(review => review.revieweeId === filters.revieweeId);
  }
  
  if (filters.reviewerId) {
    filteredReviews = filteredReviews.filter(review => review.reviewerId === filters.reviewerId);
  }
  
  return filteredReviews;
};

module.exports = {
  mockUsers,
  mockStudentProfiles,
  mockTasks,
  mockApplications,
  mockReviews,
  getMockUser,
  getMockStudentProfile,
  getMockTasks,
  getMockTask,
  getMockApplications,
  getMockReviews
};
