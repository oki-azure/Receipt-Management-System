// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as authLogin, signup as authSignup, logout as authLogout, deleteAccount as authDeleteAccount } from '../utils/auth';
import { type AuthContextType, type User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isHydrating, setIsHydrating] = useState<boolean>(true);

    useEffect(() => {
        // Hydrate on first mount BEFORE router guards run
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setIsLoggedIn(true);
        }
        setIsHydrating(false);
    }, []);

    const login = (email: string, password: string) => {
        const success = authLogin(email, password);
        if (success) {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('authToken');
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                setIsLoggedIn(true);
            }
        }
        return success;
    };

    const signup = (fullName: string, email: string, password: string, confirmPassword: string) => {
        const success = authSignup(fullName, email, password, confirmPassword);
        if (success) {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('authToken');
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                setIsLoggedIn(true);
            }
        }
        return success;
    };

    const logout = () => {
        authLogout();
        setToken(null);
        setIsLoggedIn(false);
    };

    const deleteAccount = () => {
        authDeleteAccount(); // clears user + token
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn, isHydrating, login, signup, logout, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};