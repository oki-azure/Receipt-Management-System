import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Input } from "@/components/ui/input";

const ProfileTab: React.FC = () => {
    const { user, /* setUser */ } = useAuth(); // <-- get user from context
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Handlers
    /* const handleSaveProfile = () => {
        if (!user) return;
        // Here you’d call backend PUT /user to persist changes
        alert("Profile updated!");
    };

    const handleRemovePic = () => {
        if (!user) return;
        setUser({ ...user, profilePic: "" });
    };

    const handleUploadPic = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                if (!user) return;
                setUser({ ...user, profilePic: reader.result as string });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleUpdatePassword = () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Call backend endpoint to update password
        alert("Password updated!");
        setNewPassword("");
        setConfirmPassword("");
    }; */

    return (
        <>
            {user && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
                    <div className="mt-4 space-y-4">
                        {/* Profile Picture */}
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full flex items-center justify-center bg-gray-200 text-slate-700 font-semibold">
                                {user?.profilePic ? (
                                    <div
                                        className="h-20 w-20 rounded-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${user.profilePic})` }}
                                    ></div>
                                ) : (
                                    <span className="text-xl">
                                        {user?.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-slate-900">Profile Picture</p>
                                <p className="text-sm text-gray-500">PNG, JPG or GIF. Max 2MB.</p>
                            </div>
                            <div className="ml-auto flex gap-3">
                                {/* <button
                                    onClick={handleRemovePic}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 cursor-pointer"
                                >
                                    Remove
                                </button>
                                <label className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer">
                                    Upload Image
                                    <input type="file" accept="image/*" onChange={handleUploadPic} className="hidden" />
                                </label> */}
                            </div>
                        </div>

                        {/* Name & Email */}
                        <Input
                            type="text"
                            value={user.name}
                            /* onChange={(e) => setUser({ ...user, name: e.target.value })} */
                            className=" border-gray-700"
                            disabled
                        />
                        <Input
                            type="email"
                            value={user.email}
                            /* onChange={(e) => setUser({ ...user, email: e.target.value })} */
                            className="border-gray-800"
                            disabled
                        />

                        {/* <button
                            onClick={handleSaveProfile}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer"
                        >
                            Save Changes
                        </button> */}
                    </div>
                </div>
            )}

            {/* Password update */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 mt-6">
                <h2 className="text-xl font-semibold text-slate-900">Change Password</h2>
                <div className="mt-4 space-y-4">
                    {/* New Password */}
                    <div className="relative w-full">
                        <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border-gray-700"
                        ></Input>
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                        >
                            <span className="material-symbols-outlined">
                                {showNewPassword ? "visibility" : "visibility_off"}
                            </span>
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative w-full">
                        <Input
                            type={showConfirmNewPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border-gray-700"
                        ></Input>
                        <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                        >
                            <span className="material-symbols-outlined">
                                {showConfirmNewPassword ? "visibility" : "visibility_off"}
                            </span>
                        </button>
                    </div>

                    {/* Update Button */}
                    <button
                        /* onClick={handleUpdatePassword} */
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer"
                    >
                        Update Password
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProfileTab;