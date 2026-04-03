const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const FinancialRecord = require('./src/models/FinancialRecord');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await FinancialRecord.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
    });

    // Create analyst user
    const analyst = await User.create({
      name: 'Analyst User',
      email: 'analyst@example.com',
      password: 'analyst123',
      role: 'analyst',
      status: 'active',
    });

    // Create viewer user
    const viewer = await User.create({
      name: 'Viewer User',
      email: 'viewer@example.com',
      password: 'viewer123',
      role: 'viewer',
      status: 'active',
    });

    console.log('Users created:', {
      admin: { email: admin.email, role: admin.role },
      analyst: { email: analyst.email, role: analyst.role },
      viewer: { email: viewer.email, role: viewer.role },
    });

    // Create sample financial records
    const sampleRecords = [
      {
        amount: 5000,
        type: 'income',
        category: 'Salary',
        date: new Date('2024-01-15'),
        description: 'Monthly salary',
        createdBy: admin._id,
      },
      {
        amount: 1200,
        type: 'expense',
        category: 'Rent',
        date: new Date('2024-01-05'),
        description: 'Apartment rent',
        createdBy: admin._id,
      },
      {
        amount: 300,
        type: 'expense',
        category: 'Groceries',
        date: new Date('2024-01-10'),
        description: 'Weekly groceries',
        createdBy: admin._id,
      },
      {
        amount: 150,
        type: 'expense',
        category: 'Utilities',
        date: new Date('2024-01-12'),
        description: 'Electricity bill',
        createdBy: admin._id,
      },
      {
        amount: 200,
        type: 'income',
        category: 'Freelance',
        date: new Date('2024-01-20'),
        description: 'Website development',
        createdBy: admin._id,
      },
      {
        amount: 6000,
        type: 'income',
        category: 'Salary',
        date: new Date('2024-02-15'),
        description: 'Monthly salary',
        createdBy: admin._id,
      },
      {
        amount: 1200,
        type: 'expense',
        category: 'Rent',
        date: new Date('2024-02-05'),
        description: 'Apartment rent',
        createdBy: admin._id,
      },
      {
        amount: 350,
        type: 'expense',
        category: 'Groceries',
        date: new Date('2024-02-10'),
        description: 'Monthly groceries',
        createdBy: admin._id,
      },
      {
        amount: 80,
        type: 'expense',
        category: 'Entertainment',
        date: new Date('2024-02-18'),
        description: 'Movie tickets',
        createdBy: admin._id,
      },
      {
        amount: 5500,
        type: 'income',
        category: 'Salary',
        date: new Date('2024-03-15'),
        description: 'Monthly salary',
        createdBy: admin._id,
      },
      {
        amount: 1200,
        type: 'expense',
        category: 'Rent',
        date: new Date('2024-03-05'),
        description: 'Apartment rent',
        createdBy: admin._id,
      },
      {
        amount: 400,
        type: 'expense',
        category: 'Groceries',
        date: new Date('2024-03-12'),
        description: 'Monthly groceries',
        createdBy: admin._id,
      },
    ];

    await FinancialRecord.insertMany(sampleRecords);
    console.log(`Created ${sampleRecords.length} sample financial records`);

    console.log('\n✅ Database seeding completed!');
    console.log('\nTest Credentials:');
    console.log('Admin:   admin@example.com / admin123');
    console.log('Analyst: analyst@example.com / analyst123');
    console.log('Viewer:  viewer@example.com / viewer123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();