import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Login: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(email, password)) {
            navigate('/');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="flex w-full max-w-md flex-col gap-8 rounded-2xl bg-white p-8 shadow-lg overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-black leading-tight text-slate-900">Welcome Back!</h2>
                <p className="text-base text-custom-gray">Sign in to your account to continue.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex w-full flex-col gap-6">
                <div className="flex flex-col gap-4">
                    {/* Email */}
                    <label className="flex flex-col">
                        <span className="mb-2 text-base font-medium text-slate-900">Email Address</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="h-12 w-full rounded-xl border-2 border-gray-700 bg-white px-4 text-slate-900 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-1 transition"
                        />
                    </label>

                    {/* Password */}
                    <label className="flex flex-col">
                        <span className="mb-2 text-base font-medium text-slate-900">Password</span>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="h-12 w-full rounded-xl border-2 border-gray-700 bg-white px-4 pr-12 text-slate-900 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-1 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                <span className="material-symbols-outlined">
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                    </label>
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded-md border-2 border-gray-700 text-black focus:ring-2 focus:ring-black focus:outline-none transition"
                        />
                        <span className="text-sm font-medium text-slate-900">Remember me</span>
                    </label>
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                    </a>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="h-12 rounded-lg bg-black px-6 font-bold text-white shadow-md hover:bg-gray-900 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-transform"
                >
                    Log In
                </button>
            </form>

            {/* Footer */}
            <div className="text-center text-sm text-custom-gray">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="font-semibold text-primary hover:underline">
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

export default Login;