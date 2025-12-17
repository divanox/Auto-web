import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import { ComponentTemplate } from '../models/index.js';
import { componentTemplates } from '../services/componentTemplates.js';

// Load environment variables
dotenv.config();

const seedComponentTemplates = async (): Promise<void> => {
    try {
        // Connect to database
        await connectDB();

        console.log('🌱 Starting component template seeding...');

        // Clear existing templates
        await ComponentTemplate.deleteMany({});
        console.log('✅ Cleared existing component templates');

        // Insert component templates
        const templates = await ComponentTemplate.insertMany(componentTemplates);
        console.log(`✅ Seeded ${templates.length} component templates:`);
        templates.forEach(t => console.log(`   - ${t.name} (${t.slug})`));

        console.log('🎉 Component template seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding component templates:', error);
        process.exit(1);
    }
};

seedComponentTemplates();
