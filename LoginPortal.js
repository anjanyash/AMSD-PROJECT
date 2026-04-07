import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaLock } from 'react-icons/fa';

const LoginPortal = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } catch (err) {
            setError(err.message || 'Invalid email or password. Please try admin@admin.com / admin123');
        }
    };

    return (
        <div className="min-h-screen bg-[#fcf9f6] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle light background circles for aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f5e6de] rounded-full blur-[100px] opacity-80"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#e8f0ed] rounded-full blur-[100px] opacity-80"></div>

            <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 transition-all duration-300">
                <div className="flex justify-center mb-8">
                    <FaUserCircle className="text-6xl text-gray-800" />
                </div>
                
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8 font-light text-sm">Please sign in to access the portal</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100">
                            {error}
                        </div>
                    )}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 transition-all"
                            placeholder="Email Address"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 transition-all"
                            placeholder="Password"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                            <input type="checkbox" className="mr-2 rounded border-gray-300 bg-white text-gray-900 focus:ring-gray-900" />
                            Remember me
                        </label>
                        <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Sign In
                    </button>
                    
                    <p className="text-center text-gray-500 text-sm mt-6">
                        Don't have an account? <Link to="/signup" className="text-gray-900 font-medium hover:underline transition-all">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPortal;
