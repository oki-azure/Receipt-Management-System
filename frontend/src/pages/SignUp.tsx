import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        const success = signup(name, email, password, confirmPassword);
        if (success) {
            navigate('/'); // redirect to dashboard
        } else {
            alert('Passwords do not match');
        }
    };


    return (
        <div className="flex w-full max-w-md flex-col gap-6 rounded-xl bg-white p-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary mb-1">
                    <span className="material-symbols-outlined text-2xl">receipt_long</span>
                    <span className="text-lg font-bold text-slate-900">ReceiptManager</span>
                </div>
                <h2 className="text-2xl font-bold leading-tight text-slate-900">
                    Create Your Account
                </h2>
                <p className="text-sm text-custom-gray">
                    Organize your receipts and expenses effortlessly.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="flex flex-col gap-3">
                <label className="flex flex-col">
                    <span className="mb-1 text-sm font-medium text-slate-900">Full Name</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="h-10 w-full rounded-lg border border-gray-700 bg-white px-3 text-sm text-slate-900 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black transition"
                    />
                </label>

                <label className="flex flex-col">
                    <span className="mb-1 text-sm font-medium text-slate-900">Email Address</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="h-10 w-full rounded-lg border border-gray-700 bg-white px-3 text-sm text-slate-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition"
                    />
                </label>

                <label className="flex flex-col">
                    <span className="mb-1 text-sm font-medium text-slate-900">Password</span>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                            className="h-10 w-full rounded-lg border border-gray-700 bg-white px-3 text-sm text-slate-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            <span className="material-symbols-outlined">
                                {showPassword ? "visibility" : "visibility_off"}
                            </span>
                        </button>
                    </div>
                </label>

                <label className="flex flex-col">
                    <span className="mb-1 text-sm font-medium text-slate-900">Confirm Password</span>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            required
                            className="h-10 w-full rounded-lg border border-gray-700 bg-white px-3 text-sm text-slate-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            <span className="material-symbols-outlined">
                                {showConfirmPassword ? "visibility" : "visibility_off"}
                            </span>
                        </button>
                    </div>
                </label>

                <label className="flex items-start gap-2">
                    <input
                        type="checkbox"
                        required
                        className="mt-0.5 h-4 w-4 rounded border border-gray-700 text-black focus:ring-1 focus:ring-black transition"
                    />
                    <span className="text-xs text-gray-500">
                        By creating an account, you agree to our{" "}
                        <a href="#" className="text-primary hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                            Privacy Policy
                        </a>.
                    </span>
                </label>

                <button className="h-10 rounded-lg bg-black px-4 font-bold text-sm text-white hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-black transition">
                    Create Account
                </button>
            </form>

            <p className="text-center text-xs text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
};

export default SignUp;