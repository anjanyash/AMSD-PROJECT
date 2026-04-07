const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@admin.com',
            password: hashedPassword,
            role: 'admin'
        });

        // Create sample users
        const users = await User.insertMany([
            {
                name: 'Alice Smith',
                email: 'alice@example.com',
                password: await bcrypt.hash('password123', salt),
                role: 'user'
            },
            {
                name: 'Bob Jones',
                email: 'bob@example.com',
                password: await bcrypt.hash('password123', salt),
                role: 'user'
            },
            {
                name: 'Charlie Davis',
                email: 'charlie@example.com',
                password: await bcrypt.hash('password123', salt),
                role: 'user'
            },
            {
                name: 'Diana Ross',
                email: 'diana@example.com',
                password: await bcrypt.hash('password123', salt),
                role: 'user'
            },
            {
                name: 'Eve Adams',
                email: 'eve@example.com',
                password: await bcrypt.hash('password123', salt),
                role: 'user'
            }
        ]);

        // Create sample products
        const products = await Product.insertMany([
            {
                name: 'Rose Gold Facial',
                description: 'Luxurious rose gold facial mask for glowing skin',
                price: 61.00,
                category: 'Face Care',
                stock: 45,
                image: 'https://via.placeholder.com/300?text=Rose+Gold+Facial',
                rating: 4.5,
                reviews: 128
            },
            {
                name: 'Avocado Cream',
                description: 'Natural avocado cream moisturizer',
                price: 157.00,
                category: 'Moisturizers',
                stock: 30,
                image: 'https://via.placeholder.com/300?text=Avocado+Cream',
                rating: 4.8,
                reviews: 95
            },
            {
                name: 'Revital Face Wash',
                description: 'Gentle revitalizing face wash for all skin types',
                price: 22.00,
                category: 'Cleansers',
                stock: 60,
                image: 'https://via.placeholder.com/300?text=Revital+Face+Wash',
                rating: 4.2,
                reviews: 156
            },
            {
                name: 'Mist Toner',
                description: 'Hydrating mist toner spray',
                price: 21.00,
                category: 'Toners',
                stock: 50,
                image: 'https://via.placeholder.com/300?text=Mist+Toner',
                rating: 4.6,
                reviews: 82
            },
            {
                name: 'Antioxidant Facemask',
                description: 'Deep cleansing antioxidant face mask',
                price: 75.00,
                category: 'Masks',
                stock: 25,
                image: 'https://via.placeholder.com/300?text=Antioxidant+Facemask',
                rating: 4.7,
                reviews: 73
            },
            {
                name: 'Strawberry Moisturiser',
                description: 'Fresh strawberry moisturizing cream',
                price: 57.00,
                category: 'Moisturizers',
                stock: 35,
                image: 'https://via.placeholder.com/300?text=Strawberry+Moisturiser',
                rating: 4.4,
                reviews: 104
            },
            {
                name: 'Coffee Body Scrub',
                description: 'Energizing coffee body scrub',
                price: 11.00,
                category: 'Body Care',
                stock: 55,
                image: 'https://via.placeholder.com/300?text=Coffee+Body+Scrub',
                rating: 4.3,
                reviews: 67
            },
            {
                name: 'Natural Kiwi Body Lotion',
                description: 'Light and refreshing kiwi body lotion',
                price: 19.00,
                category: 'Body Care',
                stock: 40,
                image: 'https://via.placeholder.com/300?text=Kiwi+Body+Lotion',
                rating: 4.5,
                reviews: 89
            }
        ]);

        // Create sample orders
        const orders = await Order.insertMany([
            {
                orderId: '#1024',
                userId: users[0]._id,
                customerName: 'Alice Smith',
                customerEmail: 'alice@example.com',
                items: [{
                    productId: products[0]._id,
                    productName: 'Rose Gold Facial',
                    quantity: 1,
                    price: 61.00
                }],
                totalAmount: 61.00,
                status: 'Delivered',
                paymentStatus: 'Completed',
                shippingAddress: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA'
                }
            },
            {
                orderId: '#1025',
                userId: users[1]._id,
                customerName: 'Bob Jones',
                customerEmail: 'bob@example.com',
                items: [{
                    productId: products[1]._id,
                    productName: 'Avocado Cream',
                    quantity: 1,
                    price: 157.00
                }],
                totalAmount: 157.00,
                status: 'Pending',
                paymentStatus: 'Pending',
                shippingAddress: {
                    street: '456 Oak Ave',
                    city: 'Los Angeles',
                    state: 'CA',
                    zipCode: '90001',
                    country: 'USA'
                }
            },
            {
                orderId: '#1026',
                userId: users[2]._id,
                customerName: 'Charlie Davis',
                customerEmail: 'charlie@example.com',
                items: [{
                    productId: products[2]._id,
                    productName: 'Revital Face Wash',
                    quantity: 1,
                    price: 22.00
                }],
                totalAmount: 22.00,
                status: 'Shipped',
                paymentStatus: 'Completed',
                shippingAddress: {
                    street: '789 Pine Rd',
                    city: 'Chicago',
                    state: 'IL',
                    zipCode: '60601',
                    country: 'USA'
                }
            },
            {
                orderId: '#1027',
                userId: users[3]._id,
                customerName: 'Diana Ross',
                customerEmail: 'diana@example.com',
                items: [{
                    productId: products[3]._id,
                    productName: 'Mist Toner',
                    quantity: 1,
                    price: 21.00
                }],
                totalAmount: 21.00,
                status: 'Delivered',
                paymentStatus: 'Completed',
                shippingAddress: {
                    street: '321 Elm St',
                    city: 'Houston',
                    state: 'TX',
                    zipCode: '77001',
                    country: 'USA'
                }
            },
            {
                orderId: '#1028',
                userId: users[4]._id,
                customerName: 'Eve Adams',
                customerEmail: 'eve@example.com',
                items: [{
                    productId: products[4]._id,
                    productName: 'Antioxidant Facemask',
                    quantity: 1,
                    price: 75.00
                }],
                totalAmount: 75.00,
                status: 'Processing',
                paymentStatus: 'Completed',
                shippingAddress: {
                    street: '654 Maple Dr',
                    city: 'Phoenix',
                    state: 'AZ',
                    zipCode: '85001',
                    country: 'USA'
                }
            }
        ]);

        console.log('✅ Database seeded successfully!');
        console.log(`✅ Admin created: admin@admin.com / admin123`);
        console.log(`✅ ${users.length} users created`);
        console.log(`✅ ${products.length} products created`);
        console.log(`✅ ${orders.length} orders created`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
