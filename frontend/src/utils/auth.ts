const API_URL = import.meta.env.VITE_API_URL;

export const login = async (
    email: string,
    password: string
): Promise<{ token: string; user: { id: number; name: string; email: string } } | null> => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) return null;

        const data = await res.json();

        if (data?.token && data?.user) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            return { token: data.token, user: data.user };
        }

        return null;
    } catch (err) {
        console.error("Login error:", err);
        return null;
    }
};

export const logout = async (token: string): Promise<boolean> => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) return false;

        const data = await res.json();
        console.log(data.message); // "You are logged out"
        return true;
    } catch (err) {
        console.error("Logout error:", err);
        return false;
    }
};

export const deleteAccount = (): void => {  };

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return Boolean(localStorage.getItem('token'));
};