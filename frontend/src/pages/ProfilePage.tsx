import React from "react";
import ProfileTab from "../components/settings/ProfileTab";

const ProfilePage: React.FC = () => {
    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
                <p className="text-custom-gray">
                    View your profile information.
                </p>
            </div>

            {/* Render ProfileTab directly */}
            <ProfileTab />
        </div>
    );
};

export default ProfilePage;