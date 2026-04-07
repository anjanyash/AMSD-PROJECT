const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Get dashboard stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'user' });
        
        const revenueData = await Order.aggregate([
            { $match: { paymentStatus: 'Completed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        res.json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

// Get all orders
router.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('items.productId', 'name price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Update order status
router.put('/orders/:orderId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
});

// Get all products
router.get('/products', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Create product
router.post('/products', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description, price, category, stock, image, rating, reviews } = req.body;
        
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            image,
            rating: rating || 0,
            reviews: reviews || 0
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

// Update product
router.put('/products/:productId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new: true }
        );
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// Delete product
router.delete('/products/:productId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.productId);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// Get all customers
router.get('/customers', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const customers = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
});

// Get customer details with orders
router.get('/customers/:customerId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const customer = await User.findById(req.params.customerId).select('-password');
        const orders = await Order.find({ userId: req.params.customerId });
        
        res.json({
            customer,
            orders,
            totalOrders: orders.length,
            totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer details', error: error.message });
    }
});

module.exports = router;
