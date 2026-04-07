import React from 'react';

const OrderTracking = () => {
    const orders = [
        { id: '#1024', product: 'Rose Gold Facial', date: '2026-04-06', amount: '₹61.00', status: 'Delivered', tracking: 'Delivered on 2026-04-07' },
        { id: '#1025', product: 'Avocado Cream', date: '2026-04-05', amount: '₹157.00', status: 'Shipped', tracking: 'Shipped on 2026-04-06, expected delivery 2026-04-08' },
        { id: '#1026', product: 'Revital Face Wash', date: '2026-04-05', amount: '₹22.00', status: 'Processing', tracking: 'Order processed, preparing for shipment' },
        { id: '#1027', product: 'Mist Toner', date: '2026-04-04', amount: '₹21.00', status: 'Delivered', tracking: 'Delivered on 2026-04-05' },
    ];

    const getStatusColor = (status) => {
        switch(status) {
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Processing': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Orders</h1>
                <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 font-medium">Order ID</th>
                                    <th className="p-4 font-medium">Product</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Amount</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Tracking Info</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-gray-900">{order.id}</td>
                                        <td className="p-4 text-sm text-gray-600">{order.product}</td>
                                        <td className="p-4 text-sm text-gray-500">{order.date}</td>
                                        <td className="p-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{order.tracking}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;