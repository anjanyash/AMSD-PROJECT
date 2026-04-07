const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
        console.log('Connected to MongoDB');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const result = await User.findOneAndUpdate(
            { email: 'admin@admin.com' },
            { name: 'Admin', email: 'admin@admin.com', password: hashedPassword, role: 'admin' },
            { upsert: true, new: true }
        );

        console.log('Admin account created successfully!');
        console.log('Email:', result.email);
        console.log('Role:', result.role);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

seedAdmin();
