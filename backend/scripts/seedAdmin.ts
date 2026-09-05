import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';


dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!mongoUri || !adminName || !adminEmail || !adminPassword) {
      console.error('❌ Missing required environment variables. Please check your .env file.');
      process.exit(1);
    }

    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`⚠️ Admin with email ${adminEmail} already exists. No action taken.`);
      await mongoose.connection.close();
      process.exit(0);
    }

    
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
    });

    console.log(`🎉 Administrator account created successfully: ${adminEmail}`);

    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};


seedAdmin();