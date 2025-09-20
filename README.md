# APT Platform - Full-Stack Web Application

A full-stack web application that connects Singaporean students with startups and SMEs for project-based freelance opportunities.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Student Profiles**: Create and manage student profiles with portfolios
- **Task Management**: Companies can create and manage tasks, students can browse and apply
- **Application System**: Track application status and manage approvals
- **Review System**: Rate and review completed projects
- **Modern UI**: Clean, responsive design with TailwindCSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **TailwindCSS** for styling
- **React Query** for state management
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **Prisma ORM** for database management
- **JWT** for authentication
- **bcrypt** for password hashing
- **Zod** for validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Apt
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, backend, and frontend)
npm run install:all
```

### 3. Set Up PostgreSQL Database

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL with Docker
docker run --name postgres-apt -e POSTGRES_PASSWORD=password -e POSTGRES_DB=apt_db -p 5432:5432 -d postgres:15

# Wait a few seconds for the container to start
sleep 5
```

#### Option B: Local PostgreSQL Installation
1. Install PostgreSQL on your system
2. Create a database named `apt_db`
3. Note your database credentials

### 4. Configure Environment Variables

#### Backend Configuration
Create `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/apt_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
PORT=3001
NODE_ENV=development
```

#### Frontend Configuration
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### 5. Set Up Database
```bash
# Generate Prisma client
cd backend
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with test data
npm run db:seed
```

### 6. Start the Application
```bash
# From the root directory, start both frontend and backend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🔑 Test Accounts

### Students
- Email: `student1@example.com` to `student20@example.com`
- Password: `password123`

### Companies
- Email: `company1@example.com` to `company10@example.com`
- Password: `password123`

## 📁 Project Structure

```
Apt/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication middleware
│   │   ├── utils/          # JWT utilities
│   │   └── server.js       # Main server file
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utilities and API client
│   │   └── types/         # TypeScript types
│   └── package.json
└── package.json           # Root package.json
```

## 🗄️ Database Schema

The application uses the following main entities:
- **Users**: Authentication and role management
- **StudentProfiles**: Student information and skills
- **PortfolioProjects**: Student portfolio projects
- **Tasks**: Company-created tasks
- **Applications**: Student applications to tasks
- **Reviews**: Rating and review system

## 🚀 Available Scripts

### Root Directory
```bash
npm run install:all    # Install all dependencies
npm run dev           # Start both frontend and backend
npm run start         # Start production servers
npm run build         # Build frontend for production
```

### Backend
```bash
cd backend
npm run dev           # Start development server
npm run start         # Start production server
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run database migrations
npm run db:seed       # Seed database with test data
npm run db:reset      # Reset database
```

### Frontend
```bash
cd frontend
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
```

## 🔧 Development

### Adding New Features
1. Create database migrations in `backend/prisma/migrations/`
2. Update Prisma schema if needed
3. Add API routes in `backend/src/routes/`
4. Create frontend pages in `frontend/src/app/`
5. Update TypeScript types in `frontend/src/types/`

### Database Management
```bash
# Create a new migration
cd backend
npx prisma migrate dev --name your-migration-name

# Reset database (WARNING: This will delete all data)
npm run db:reset

# View database in Prisma Studio
npx prisma studio
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Make sure no other applications are using ports 3000 or 3001
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`

2. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in `backend/.env`
   - Ensure database `apt_db` exists

3. **Frontend Build Errors**
   - Clear Next.js cache: `rm -rf frontend/.next`
   - Reinstall dependencies: `cd frontend && rm -rf node_modules && npm install`

4. **Backend API Errors**
   - Check if backend is running on port 3001
   - Verify database connection
   - Check backend logs for detailed error messages

### Getting Help
- Check the console logs for detailed error messages
- Ensure all environment variables are set correctly
- Verify that PostgreSQL is running and accessible

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile/projects` - Add portfolio project

### Task Management
- `GET /api/tasks` - Browse tasks
- `POST /api/tasks` - Create task (Company)
- `GET /api/tasks/company/my-tasks` - Get company's tasks

### Applications
- `POST /api/applications/apply/:taskId` - Apply to task
- `GET /api/applications/my-applications` - Get user's applications
- `PUT /api/applications/:id/status` - Update application status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- Real-time messaging system
- Payment integration
- Advanced search and filtering
- Mobile app development
- Analytics dashboard
- Email notifications
- File upload system