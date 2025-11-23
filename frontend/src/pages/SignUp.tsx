import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const SignUp: React.FC = () => {
    return (
        <AuthLayout>
            <div className="flex w-full max-w-md flex-col gap-8">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <span className="material-symbols-outlined text-3xl">receipt_long</span>
                        <span className="text-xl font-bold text-slate-900">Receiptify</span>
                    </div>
                    <h2 className="text-3xl font-black leading-tight text-slate-900">Create Your Account</h2>
                    <p className="text-base text-custom-gray">Organize your receipts and expenses effortlessly.</p>
                </div>

                <form className="flex flex-col gap-4">
                    <label>
                        <span className="mb-2 block text-sm font-medium text-slate-900">Full Name</span>
                        <input type="text" placeholder="Enter your full name" className="h-12 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary" />
                    </label>
                    <label>
                        <span className="mb-2 block text-sm font-medium text-slate-900">Email Address</span>
                        <input type="email" placeholder="Enter your email address" className="h-12 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary" />
                    </label>
                    <label>
                        <span className="mb-2 block text-sm font-medium text-slate-900">Password</span>
                        <input type="password" placeholder="Create a password" className="h-12 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary" />
                    </label>
                    <label>
                        <span className="mb-2 block text-sm font-medium text-slate-900">Confirm Password</span>
                        <input type="password" placeholder="Confirm your password" className="h-12 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary" />
                    </label>

                    <label className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm text-gray-500">
                            By creating an account, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                        </span>
                    </label>

                    <button className="mt-2 h-12 rounded-lg bg-primary font-bold text-white hover:bg-primary/90">Create Account</button>
                </form>

                <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative bg-white px-4 text-sm text-gray-500">OR</div>
                </div>

                <button className="flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 font-medium text-slate-900 hover:bg-gray-50">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                    Sign up with Google
                </button>

                <p className="text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link></p>
            </div>
        </AuthLayout>
    );
};

export default SignUp;
