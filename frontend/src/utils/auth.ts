import { type User } from '../types';

// Simulate signup: store user info + token
export const signup = (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
): boolean => {
    if (password !== confirmPassword) {
        return false;
    }

    const user: User = {
        id: crypto.randomUUID(),
        name: fullName,
        email,
        password,
    };

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', crypto.randomUUID());
    return true;
};

// Simulate login: check stored user and set token
export const login = (email: string, password: string): boolean => {
    const storedUser: User = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.email === email && storedUser.password === password) {
        localStorage.setItem('authToken', crypto.randomUUID());
        return true;
    }
    return false;
};

// Simulate logout: clear token
export const logout = () => {
    localStorage.removeItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return Boolean(localStorage.getItem('authToken'));
};