#!/bin/bash

echo "🚀 Setting up APT Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL."
    echo "   You can use Docker: docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres"
fi

echo "📦 Installing dependencies..."
npm run install:all

echo "🗄️  Setting up database..."
echo "Please make sure PostgreSQL is running and create a database named 'apt_db'"
echo "Then update the DATABASE_URL in backend/.env with your credentials"

read -p "Press Enter when you've set up the database..."

echo "🔧 Running database migrations..."
cd backend
npm run db:generate
npm run db:migrate

echo "🌱 Seeding database with test data..."
npm run db:seed

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update backend/.env with your database credentials"
echo "2. Run 'npm run dev' to start both frontend and backend"
echo "3. Visit http://localhost:3000 to see the application"
echo ""
echo "🔑 Test accounts:"
echo "Companies: company1@example.com to company10@example.com (password: password123)"
echo "Students: student1@example.com to student20@example.com (password: password123)"
