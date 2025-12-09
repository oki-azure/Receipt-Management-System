import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const ProfileTab: React.FC = () => {
    const [user, setUser] = useState<{
        id: string;
        name: string;
        email: string;
        password: string;
        profilePic?: string;
    } | null>(null);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = React.useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { logout } = useAuth();

    // Load user from LocalStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Save user back to LocalStorage
    const persistUser = (updatedUser: typeof user) => {
        if (!updatedUser) return;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    // Handlers
    const handleSaveProfile = () => {
        if (!user) return;
        persistUser(user);
        alert("Profile updated!");
    };

    const handleRemovePic = () => {
        if (!user) return;
        persistUser({ ...user, profilePic: "" });
    };

    const handleUploadPic = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                if (!user) return;
                persistUser({ ...user, profilePic: reader.result as string });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleUpdatePassword = () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Update LocalStorage user object
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const updatedUser = { ...user, password: newPassword };
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        alert("Password updated!");

        // Clear fields after update
        setNewPassword("");
        setConfirmPassword("");
    };


    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            logout();
            alert("Account deleted.");
        }
    };

    return (
        <>
            {user && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
                    <div className="mt-4 space-y-4">
                        {/* Profile Picture */}
                        <div className="flex items-center gap-4">
                            <div
                                className="h-20 w-20 rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${user.profilePic || ""})` }}
                            ></div>
                            <div>
                                <p className="text-lg font-bold text-slate-900">Profile Picture</p>
                                <p className="text-sm text-gray-500">PNG, JPG or GIF. Max 2MB.</p>
                            </div>
                            <div className="ml-auto flex gap-3">
                                <button onClick={handleRemovePic} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50">
                                    Remove
                                </button>
                                <label className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer">
                                    Upload Image
                                    <input type="file" accept="image/*" onChange={handleUploadPic} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Name & Email */}
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) => persistUser({ ...user, name: e.target.value })}
                            className=" p-3 w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                        />
                        <input
                            type="email"
                            value={user.email}
                            onChange={(e) => persistUser({ ...user, email: e.target.value })}
                            className=" p-3 w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                        />

                        <button
                            onClick={handleSaveProfile}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Password update */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 mt-6">
                <h2 className="text-xl font-semibold text-slate-900">Change Password</h2>
                <div className="mt-4 space-y-4">
                    {/* New Password */}
                    <div className="relative w-full">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="p-3 w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-900"
                        >
                            <span className="material-symbols-outlined">
                                {showNewPassword ? "visibility" : "visibility_off"}
                            </span>
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative w-full">
                        <input
                            type={showConfirmNewPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="p-3 w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-900"
                        >
                            <span className="material-symbols-outlined">
                                {showConfirmNewPassword ? "visibility" : "visibility_off"}
                            </span>
                        </button>
                    </div>

                    {/* Update Button */}
                    <button
                        onClick={handleUpdatePassword}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                    >
                        Update Password
                    </button>
                </div>
            </div>

            {/* Delete account */}
            <div className="flex justify-between items-center rounded-xl border border-red-200 bg-white p-6 mt-6">
                <div>
                    <h2 className="text-lg font-bold text-danger">Delete Account</h2>
                    <p className="text-sm text-gray-500">Permanently delete your account and all associated data.</p>
                </div>
                <button
                    onClick={handleDeleteAccount}
                    className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90"
                >
                    Delete My Account
                </button>
            </div>
        </>
    );
};

export default ProfileTab;