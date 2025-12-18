// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as authLogin, logout as authLogout, deleteAccount as authDeleteAccount } from '../utils/auth';
import { type AuthContextType, type User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isHydrating, setIsHydrating] = useState<boolean>(true);

    useEffect(() => {
        // Hydrate on first mount BEFORE router guards run
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem("user");
        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(true);
        }
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsHydrating(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const result = await authLogin(email, password);

        if (result) {
            setToken(result.token);
            setUser(result.user); // <-- hydrate with backend user object
            setIsLoggedIn(true);
            return true;
        }

        return false;
    };

    const logout = async () => {
        if (token) {
            await authLogout(token); // call backend logout
        }

        // clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // reset context state
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
    };

    const deleteAccount = () => {
        authDeleteAccount(); // clears user + token
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn, isHydrating, login, logout, deleteAccount, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};