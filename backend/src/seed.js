const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const universities = [
  'National University of Singapore',
  'Nanyang Technological University',
  'Singapore Management University',
  'Singapore University of Technology and Design',
  'Singapore Institute of Technology'
];

const skills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++',
  'UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Web Design', 'Mobile Design',
  'Digital Marketing', 'Social Media Marketing', 'Content Creation', 'SEO',
  'Financial Analysis', 'Excel', 'PowerBI', 'Accounting', 'Data Analysis',
  'Project Management', 'Agile', 'Scrum', 'Communication', 'Leadership'
];

const domains = ['MARKETING', 'CODING', 'UIUX', 'FINANCE'];

const taskTitles = {
  MARKETING: [
    'Social Media Strategy Development',
    'Content Marketing Campaign',
    'SEO Optimization Project',
    'Brand Identity Design',
    'Digital Marketing Analytics'
  ],
  CODING: [
    'Web Application Development',
    'Mobile App Development',
    'Database Design and Implementation',
    'API Development',
    'Frontend Development'
  ],
  UIUX: [
    'User Interface Design',
    'User Experience Research',
    'Prototype Development',
    'Design System Creation',
    'Usability Testing'
  ],
  FINANCE: [
    'Financial Model Development',
    'Budget Analysis and Planning',
    'Investment Research',
    'Financial Reporting',
    'Risk Assessment'
  ]
};

const taskDescriptions = {
  MARKETING: [
    'Develop a comprehensive social media strategy for our startup to increase brand awareness and engagement.',
    'Create compelling content marketing materials to attract and retain customers.',
    'Optimize our website and content for better search engine rankings.',
    'Design a cohesive brand identity that reflects our company values.',
    'Analyze digital marketing performance and provide actionable insights.'
  ],
  CODING: [
    'Build a modern web application using React and Node.js with responsive design.',
    'Develop a cross-platform mobile application with intuitive user interface.',
    'Design and implement a scalable database architecture for our growing platform.',
    'Create RESTful APIs to support our frontend applications.',
    'Build responsive frontend components using modern web technologies.'
  ],
  UIUX: [
    'Design intuitive user interfaces that enhance user experience and engagement.',
    'Conduct user research to understand customer needs and pain points.',
    'Create interactive prototypes to test design concepts and user flows.',
    'Develop a comprehensive design system for consistent brand experience.',
    'Perform usability testing to identify and resolve user experience issues.'
  ],
  FINANCE: [
    'Develop financial models to support business planning and decision making.',
    'Analyze budgets and create detailed financial reports for stakeholders.',
    'Research investment opportunities and provide comprehensive analysis.',
    'Prepare accurate financial reports in compliance with regulations.',
    'Assess financial risks and develop mitigation strategies.'
  ]
};

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.review.deleteMany();
    await prisma.application.deleteMany();
    await prisma.task.deleteMany();
    await prisma.portfolioProject.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    // Create companies
    const companies = [];
    for (let i = 1; i <= 10; i++) {
      const passwordHash = await bcrypt.hash('password123', 12);
      const company = await prisma.user.create({
        data: {
          email: `company${i}@example.com`,
          passwordHash,
          role: 'COMPANY'
        }
      });
      companies.push(company);
    }

    console.log('✅ Created companies');

    // Create students with profiles
    const students = [];
    for (let i = 1; i <= 20; i++) {
      const passwordHash = await bcrypt.hash('password123', 12);
      const user = await prisma.user.create({
        data: {
          email: `student${i}@example.com`,
          passwordHash,
          role: 'STUDENT'
        }
      });

      const studentSkills = skills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 3);
      
      const profile = await prisma.studentProfile.create({
        data: {
          name: `Student ${i}`,
          university: universities[Math.floor(Math.random() * universities.length)],
          yearOfStudy: Math.floor(Math.random() * 4) + 1,
          skills: studentSkills,
          bio: `Passionate student with expertise in ${studentSkills.slice(0, 3).join(', ')}. Looking for opportunities to apply my skills in real-world projects.`,
          userId: user.id
        }
      });

      // Create portfolio projects for each student
      const projectCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < projectCount; j++) {
        await prisma.portfolioProject.create({
          data: {
            title: `Project ${j + 1}`,
            description: `A comprehensive project showcasing my skills in ${studentSkills[Math.floor(Math.random() * studentSkills.length)]}.`,
            link: `https://github.com/student${i}/project${j + 1}`,
            studentId: profile.id
          }
        });
      }

      students.push({ user, profile });
    }

    console.log('✅ Created students with profiles and projects');

    // Create tasks
    const tasks = [];
    for (let i = 0; i < 30; i++) {
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const titles = taskTitles[domain];
      const descriptions = taskDescriptions[domain];
      
      const task = await prisma.task.create({
        data: {
          title: titles[Math.floor(Math.random() * titles.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          domain,
          duration: `${Math.floor(Math.random() * 8) + 2} weeks`,
          deliverables: 'Complete project documentation, source code, and presentation',
          status: Math.random() > 0.2 ? 'OPEN' : 'CLOSED',
          companyId: companies[Math.floor(Math.random() * companies.length)].id
        }
      });
      tasks.push(task);
    }

    console.log('✅ Created tasks');

    // Create applications
    for (let i = 0; i < 50; i++) {
      const task = tasks[Math.floor(Math.random() * tasks.length)];
      const student = students[Math.floor(Math.random() * students.length)];
      
      // Check if application already exists
      const existingApplication = await prisma.application.findUnique({
        where: {
          taskId_studentId: {
            taskId: task.id,
            studentId: student.profile.id
          }
        }
      });

      if (!existingApplication && task.status === 'OPEN') {
        const statuses = ['APPLIED', 'ACCEPTED', 'REJECTED'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        await prisma.application.create({
          data: {
            taskId: task.id,
            studentId: student.profile.id,
            status
          }
        });
      }
    }

    console.log('✅ Created applications');

    // Create reviews
    for (let i = 0; i < 30; i++) {
      const reviewer = students[Math.floor(Math.random() * students.length)].user;
      const reviewee = companies[Math.floor(Math.random() * companies.length)];
      
      // Check if review already exists
      const existingReview = await prisma.review.findUnique({
        where: {
          reviewerId_revieweeId: {
            reviewerId: reviewer.id,
            revieweeId: reviewee.id
          }
        }
      });

      if (!existingReview) {
        await prisma.review.create({
          data: {
            reviewerId: reviewer.id,
            revieweeId: reviewee.id,
            rating: Math.floor(Math.random() * 5) + 1,
            comment: 'Great collaboration experience! The project was well-managed and the team was very supportive.'
          }
        });
      }
    }

    console.log('✅ Created reviews');

    console.log('🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${companies.length} companies created`);
    console.log(`- ${students.length} students created`);
    console.log(`- ${tasks.length} tasks created`);
    console.log(`- Multiple applications and reviews created`);
    console.log('\n🔑 Test credentials:');
    console.log('Companies: company1@example.com to company10@example.com (password: password123)');
    console.log('Students: student1@example.com to student20@example.com (password: password123)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
