import React, { useState } from 'react';
import { FaBox, FaUsers, FaChartLine, FaShoppingBag, FaSignOutAlt, FaTachometerAlt, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { store } from '../productsStore/Store';
import roseGoldFacial from '../assets/rose_gold_facial.png';

const AdminPortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [message, setMessage] = useState('');

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Skincare',
        price: '',
        stock: '',
        type: 'ourBestSellers',
    });

    const [newOrder, setNewOrder] = useState({
        customer: '',
        product: '',
        date: '',
        amount: '',
        status: 'Pending',
    });

    const [productsState, setProductsState] = useState([
        { id: 'P001', name: 'Rose Gold Facial', category: 'Skincare', stock: 24, price: '₹199' },
        { id: 'P002', name: 'Avocado Cream', category: 'Haircare', stock: 18, price: '₹299' },
        { id: 'P003', name: 'Revital Face Wash', category: 'Cleansers', stock: 12, price: '₹149' },
        { id: 'P004', name: 'Mist Toner', category: 'Toners', stock: 31, price: '₹179' },
    ]);

    const [ordersState, setOrdersState] = useState([
        { id: '#1024', customer: 'Alice Smith', product: 'Rose Gold Facial', date: '2026-04-06', amount: '₹61.00', status: 'Delivered' },
        { id: '#1025', customer: 'Bob Jones', product: 'Avocado Cream', date: '2026-04-05', amount: '₹157.00', status: 'Pending' },
        { id: '#1026', customer: 'Charlie Davis', product: 'Revital Face Wash', date: '2026-04-05', amount: '₹22.00', status: 'Shipped' },
        { id: '#1027', customer: 'Diana Ross', product: 'Mist Toner', date: '2026-04-04', amount: '₹21.00', status: 'Delivered' },
        { id: '#1028', customer: 'Eve Adams', product: 'Antioxidant Facemask', date: '2026-04-04', amount: '₹75.00', status: 'Processing' },
        { id: '#1029', customer: 'Frank Miller', product: 'Strawberry Moisturiser', date: '2026-04-03', amount: '₹57.00', status: 'Delivered' },
        { id: '#1030', customer: 'Grace Lee', product: 'Coffee Body Scrub', date: '2026-04-03', amount: '₹11.00', status: 'Shipped' },
        { id: '#1031', customer: 'Henry Wilson', product: 'Natural Kiwi Body Lotion', date: '2026-04-02', amount: '₹19.00', status: 'Delivered' },
    ]);

    const handleLogout = () => {
        navigate('/login');
    };

    const stats = [
        { title: 'Total Revenue', value: '₹2,847', change: '+12.5%', isPositive: true, icon: <FaChartLine /> },
        { title: 'Active Users', value: '38', change: '+5.2%', isPositive: true, icon: <FaUsers /> },
        { title: 'Total Orders', value: ordersState.length.toString(), change: '-1.4%', isPositive: false, icon: <FaShoppingBag /> },
        { title: 'Products', value: productsState.length.toString(), change: '+18.1%', isPositive: true, icon: <FaBox /> },
    ];

    const getStatusColor = (status) => {
        switch(status) {
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Processing': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const placeholderImage = roseGoldFacial;

    const generateProductId = () => `P${Math.floor(1000 + Math.random() * 9000)}`;
    const generateOrderId = () => `#${Math.floor(1000 + Math.random() * 9000)}`;

    const handleAddProduct = () => {
        if (!newProduct.name.trim() || !newProduct.price.trim() || !newProduct.stock.trim()) {
            setMessage('Please fill product name, price, and stock.');
            return;
        }

        const id = generateProductId();
        const stockValue = parseInt(newProduct.stock, 10) || 0;
        const priceValue = Number(newProduct.price.replace(/[₹,\s]/g, '')) || 0;
        const productItem = {
            id,
            name: newProduct.name.trim(),
            category: newProduct.category.trim(),
            stock: stockValue,
            price: `₹${priceValue}`,
        };

        setProductsState(prev => [...prev, productItem]);
        store.push({
            id,
            name: productItem.name,
            price: priceValue,
            type: newProduct.type,
            primaryImage: placeholderImage,
            hoverImg: placeholderImage,
        });
        setMessage(`Product "${productItem.name}" added and now available on the client page.`);
        setNewProduct({ name: '', category: 'Skincare', price: '', stock: '', type: 'ourBestSellers' });
    };

    const handleAddOrder = () => {
        if (!newOrder.customer.trim() || !newOrder.product.trim() || !newOrder.amount.trim() || !newOrder.date.trim()) {
            setMessage('Please fill all order details.');
            return;
        }

        const id = generateOrderId();
        const amountText = newOrder.amount.startsWith('₹') ? newOrder.amount : `₹${newOrder.amount}`;
        const orderItem = {
            id,
            customer: newOrder.customer.trim(),
            product: newOrder.product.trim(),
            date: newOrder.date,
            amount: amountText,
            status: newOrder.status,
        };

        setOrdersState(prev => [orderItem, ...prev]);
        setMessage(`Order ${id} added.`);
        setNewOrder({ customer: '', product: '', date: '', amount: '', status: 'Pending' });
    };

    const customers = [
        { id: 'C001', name: 'Alice Smith', email: 'alice@example.com', orders: 4, lifetimeValue: '₹1,520' },
        { id: 'C002', name: 'Bob Jones', email: 'bob@example.com', orders: 3, lifetimeValue: '₹1,140' },
        { id: 'C003', name: 'Charlie Davis', email: 'charlie@example.com', orders: 2, lifetimeValue: '₹520' },
        { id: 'C004', name: 'Diana Ross', email: 'diana@example.com', orders: 5, lifetimeValue: '₹1,715' },
    ];

    const renderContent = () => {
        switch(activeTab) {
            case 'Products':
                return (
                    <div>
                        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Product Name</label>
                                    <input
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter name"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <input
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                                        placeholder="Category"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Price</label>
                                    <input
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                                        placeholder="e.g. 299"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Stock</label>
                                    <input
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                                        placeholder="Stock qty"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>
                                <button
                                    onClick={handleAddProduct}
                                    className="bg-purple-600 text-white px-6 py-3 rounded-2xl shadow hover:bg-purple-700 transition"
                                >
                                    Add Product
                                </button>
                            </div>
                            {message && <p className="text-sm text-green-700 mt-4">{message}</p>}
                        </div>

                        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 font-medium">Product ID</th>
                                            <th className="p-4 font-medium">Name</th>
                                            <th className="p-4 font-medium">Category</th>
                                            <th className="p-4 font-medium">Stock</th>
                                            <th className="p-4 font-medium">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {productsState.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4 text-sm font-medium text-gray-900">{item.id}</td>
                                                <td className="p-4 text-sm text-gray-600">{item.name}</td>
                                                <td className="p-4 text-sm text-gray-600">{item.category}</td>
                                                <td className="p-4 text-sm text-gray-600">{item.stock}</td>
                                                <td className="p-4 text-sm font-semibold text-gray-900">{item.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'Orders':
                return (
                    <div>
                        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Customer Name</label>
                                    <input
                                        value={newOrder.customer}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, customer: e.target.value }))}
                                        placeholder="Customer"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Product</label>
                                    <input
                                        value={newOrder.product}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, product: e.target.value }))}
                                        placeholder="Product"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Order Date</label>
                                    <input
                                        type="date"
                                        value={newOrder.date}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, date: e.target.value }))}
                                        className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Amount</label>
                                    <input
                                        value={newOrder.amount}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, amount: e.target.value }))}
                                        placeholder="e.g. 299"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>
                                <button
                                    onClick={handleAddOrder}
                                    className="bg-purple-600 text-white px-6 py-3 rounded-2xl shadow hover:bg-purple-700 transition"
                                >
                                    Add Order
                                </button>
                            </div>
                            {message && <p className="text-sm text-green-700 mt-4">{message}</p>}
                        </div>

                        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 font-medium">Order ID</th>
                                            <th className="p-4 font-medium">Customer</th>
                                            <th className="p-4 font-medium">Product</th>
                                            <th className="p-4 font-medium">Date</th>
                                            <th className="p-4 font-medium">Amount</th>
                                            <th className="p-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {ordersState.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4 text-sm font-medium text-gray-900">{order.id}</td>
                                                <td className="p-4 text-sm text-gray-600">{order.customer}</td>
                                                <td className="p-4 text-sm text-gray-600">{order.product}</td>
                                                <td className="p-4 text-sm text-gray-500">{order.date}</td>
                                                <td className="p-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'Customers':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {customers.map((customer) => (
                            <div key={customer.id} className="bg-white rounded-3xl p-6 shadow border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{customer.name}</h2>
                                        <p className="text-sm text-gray-500">{customer.email}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{customer.id}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <p className="font-semibold text-gray-900">Orders</p>
                                        <p>{customer.orders}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Lifetime Value</p>
                                        <p>{customer.lifetimeValue}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'Settings':
                return (
                    <div className="bg-white rounded-3xl p-8 shadow border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                                <p className="text-sm text-gray-500">Enable or disable admin alerts.</p>
                            </div>
                            <button className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">Enabled</button>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                                <p className="text-sm text-gray-500">Update account security settings.</p>
                            </div>
                            <button className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">Manage</button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div>
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                            <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${idx === 0 ? 'bg-purple-100 text-purple-600' : idx === 1 ? 'bg-blue-100 text-blue-600' : idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                            {stat.icon}
                                        </div>
                                        <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${stat.isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                                            {stat.isPositive ? '↑' : '↓'} {stat.change}
                                        </span>
                                    </div>
                                    <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                                    <div className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                                <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                            <th className="p-4 font-medium">Order ID</th>
                                            <th className="p-4 font-medium">Customer</th>
                                            <th className="p-4 font-medium">Product</th>
                                            <th className="p-4 font-medium">Date</th>
                                            <th className="p-4 font-medium">Amount</th>
                                            <th className="p-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {ordersState.map((order, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4 text-sm font-medium text-gray-900">{order.id}</td>
                                                <td className="p-4 text-sm text-gray-600">{order.customer}</td>
                                                <td className="p-4 text-sm text-gray-600">{order.product}</td>
                                                <td className="p-4 text-sm text-gray-500">{order.date}</td>
                                                <td className="p-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-10 sticky top-0 h-screen">
                <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg shadow-lg flex items-center justify-center font-bold text-lg">A</div>
                    <span className="text-xl font-bold tracking-wider">ADMIN</span>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {['Dashboard', 'Products', 'Orders', 'Customers', 'Settings'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveTab(item)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                activeTab === item 
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            {item === 'Dashboard' && <FaTachometerAlt />}
                            {item === 'Products' && <FaBox />}
                            {item === 'Orders' && <FaShoppingBag />}
                            {item === 'Customers' && <FaUsers />}
                            {item === 'Settings' && <FaCog />}
                            <span className="font-medium">{item}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
                    >
                        <FaSignOutAlt />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{activeTab}</h1>
                        <p className="text-gray-500 mt-1">{activeTab === 'Dashboard' ? "Welcome back, Admin. Here's what's happening today." : activeTab === 'Products' ? 'Manage your product catalog and inventory.' : activeTab === 'Orders' ? 'View and manage incoming orders.' : activeTab === 'Customers' ? 'Browse and manage customer profiles.' : 'Adjust your admin portal preferences.'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="bg-white p-2 rounded-full shadow-sm text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 shadow-md border-2 border-white cursor-pointer"></div>
                    </div>
                </div>
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminPortal;
