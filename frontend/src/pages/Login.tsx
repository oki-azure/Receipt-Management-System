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
        <div className="flex w-full max-w-md flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-black leading-tight text-slate-900">Welcome Back!</h2>
                <p className="text-base text-custom-gray">Sign in to your account to continue.</p>
            </div>

            <form onSubmit={handleLogin} className="flex w-full flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        <span className="mb-2 text-base font-medium text-slate-900">Email Address</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="h-14 rounded-lg border-gray-300 px-4 text-base focus:border-primary focus:ring-primary"
                        />
                    </label>
                    <label className="flex flex-col">
                        <span className="mb-2 text-base font-medium text-slate-900">Password</span>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="h-14 w-full rounded-lg border-gray-300 px-4 pr-12 text-base focus:border-primary focus:ring-primary"
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

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-slate-900">Remember me</span>
                    </label>
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="h-14 rounded-lg bg-primary text-base font-bold text-white hover:bg-primary/90"
                >
                    Log In
                </button>
            </form>

            <div className="text-center text-sm text-custom-gray">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-primary hover:underline">
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

export default Login;