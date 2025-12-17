import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import { Module } from '../models/index.js';
import { moduleDefinitions } from '../services/moduleDefinitions.js';

// Load environment variables
dotenv.config();

const seedModules = async (): Promise<void> => {
    try {
        // Connect to database
        await connectDB();

        console.log('🌱 Starting module seeding...');

        // Clear existing modules
        await Module.deleteMany({});
        console.log('✅ Cleared existing modules');

        // Insert predefined modules
        const modules = await Module.insertMany(moduleDefinitions);
        console.log(`✅ Seeded ${modules.length} modules:`);
        modules.forEach(m => console.log(`   - ${m.name} (${m.slug})`));

        console.log('🎉 Module seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding modules:', error);
        process.exit(1);
    }
};

seedModules();
