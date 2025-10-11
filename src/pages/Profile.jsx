import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../lib/firebase";
import { updateProfile } from "firebase/auth";
import {
    RiLogoutCircleRLine,
    RiCheckboxCircleLine,
    RiArrowRightSLine,
    RiMedal2Line,
    RiWallet3Line,
    RiMapPinLine,
    RiSettings3Line,
    RiHeadphoneLine,
    RiShoppingBag3Line,
    RiErrorWarningLine,
    RiSaveLine,
    RiCameraLine,
    RiLoader4Line,
} from "react-icons/ri";

// --- Helper Data ---

const PROFILE_SHORTCUTS = [
    {
        title: "Your Orders",
        desc: "Track and manage your recent purchases",
        icon: <RiShoppingBag3Line className="text-2xl" />,
        to: "/orders",
    },
    {
        title: "Rewards & Wallet",
        desc: "View points, coupons, and account balance",
        icon: <RiWallet3Line className="text-2xl" />,
        to: "/wallet",
    },
    {
        title: "Delivery Addresses",
        desc: "Update shipping and billing locations",
        icon: <RiMapPinLine className="text-2xl" />,
        to: "/addresses",
    },
    {
        title: "Account Settings",
        desc: "Change password, email, and privacy options",
        icon: <RiSettings3Line className="text-2xl" />,
        to: "/account-settings",
    },
    {
        title: "Help & Support",
        desc: "Access FAQs or contact our team",
        icon: <RiHeadphoneLine className="text-2xl" />,
        to: "/support",
    },
];

// --- Sub-Components ---

const AvatarUploader = React.memo(({ uiUser, onAvatarUpdated, updateUserContext }) => {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const initial = (uiUser.displayName || uiUser.email || "?").charAt(0).toUpperCase();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        
        // Create a temporary URL for the selected file. This is the key for instant preview!
        const tempPhotoURL = URL.createObjectURL(file);
        
        // STEP 1: Update the local UI State Immediately (CRITICAL FIX)
        onAvatarUpdated(tempPhotoURL); 

        // Simulated delay for upload
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        try {
            // STEP 2: Update Firebase Profile
            if (auth.currentUser) {
                // In a real app, 'tempPhotoURL' would be the actual hosted storage URL.
                await updateProfile(auth.currentUser, { photoURL: tempPhotoURL });
                
                // CRITICAL FIX: Update the global Auth Context
                if (updateUserContext) {
                    updateUserContext({ photoURL: tempPhotoURL });
                }
            }

            // STEP 3: Update Local Storage (Optional, but good for persistence)
            const raw = localStorage.getItem("currentUser");
            if (raw) {
                const parsed = JSON.parse(raw);
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify({ ...parsed, photoURL: tempPhotoURL })
                );
            }
        } catch (error) {
            console.error("Avatar update failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 group">
            {/* Avatar Display */}
            <div className="w-full h-full rounded-full border-4 border-white ring-2 ring-emerald-500 overflow-hidden shadow-lg transition-shadow duration-200">
                {uiUser.photoURL ? (
                    <img
                        key={uiUser.photoURL} // Key forces re-render when the URL string changes
                        src={uiUser.photoURL}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white text-3xl font-bold">
                        {initial}
                    </div>
                )}
            </div>
            
            {/* Upload Button Overlay */}
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                aria-label="Change Avatar"
                className={`absolute inset-0 w-full h-full rounded-full flex items-center justify-center bg-black bg-opacity-40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isUploading ? 'opacity-100 cursor-wait' : 'cursor-pointer'}`}
            >
                {isUploading ? (
                    <RiLoader4Line className="text-3xl animate-spin" />
                ) : (
                    <RiCameraLine className="text-3xl" />
                )}
            </button>

            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*"
                className="hidden" 
            />

            {/* Admin Badge */}
            {uiUser.isAdmin && (
                <span className="absolute bottom-0 right-0 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-lg font-medium tracking-wider">
                    ADMIN
                </span>
            )}
        </div>
    );
});

const ProfileHeader = React.memo(({ uiUser, onLogout, onAvatarUpdated, updateUserContext }) => {
    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-center md:items-start transition-all duration-300">
            
            {/* Avatar & Info Container */}
            <div className="flex flex-col sm:flex-row gap-6 items-center w-full md:w-auto">
                {/* Passed updateUserContext to AvatarUploader */}
                <AvatarUploader uiUser={uiUser} onAvatarUpdated={onAvatarUpdated} updateUserContext={updateUserContext} />

                {/* Basic info and Stats - Left-aligned */}
                <div className="flex-1 text-left w-full sm:w-auto">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-1">
                        {uiUser.displayName || "Welcome, User"}
                    </h1>
                    <p className="text-sm text-gray-600 font-medium mb-2">{uiUser.email}</p>
                    {uiUser.phoneNumber && (
                        <p className="text-sm text-gray-500">{uiUser.phoneNumber}</p>
                    )}
                    
                    {/* Highlighted Stats */}
                    <div className="mt-3 flex flex-wrap gap-3 justify-start">
                        <span className="flex items-center gap-1 text-sm bg-emerald-50 text-emerald-800 font-semibold px-4 py-1.5 rounded-full shadow-sm">
                            <RiMedal2Line className="text-base" /> {uiUser.points.toLocaleString()} Points
                        </span>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <button
                onClick={onLogout}
                className="w-full md:w-auto md:ml-auto md:mt-0 inline-flex items-center justify-center gap-2 text-sm font-semibold text-red-600 hover:text-white border border-red-200 hover:bg-red-600 px-5 py-2.5 rounded-full transition-colors duration-200 shadow-md flex-shrink-0"
            >
                <RiLogoutCircleRLine className="text-lg" /> Sign Out
            </button>
        </div>
    );
});

const EditableProfileDetails = React.memo(({ uiUser, updateUserContext }) => {
    const [name, setName] = useState(uiUser.displayName || "");
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setName(uiUser.displayName || "");
    }, [uiUser.displayName]);

    const onSave = useCallback(async () => {
        if (!auth.currentUser || name.trim() === uiUser.displayName.trim() || !name.trim()) return;

        setSaving(true);
        setStatus("");
        setIsError(false);

        try {
            await updateProfile(auth.currentUser, { displayName: name.trim() });
            
            // CRITICAL FIX: Update the global Auth Context for display name
            if (updateUserContext) {
                updateUserContext({ displayName: name.trim() });
            }

            const raw = localStorage.getItem("currentUser");
            if (raw) {
                const parsed = JSON.parse(raw);
                localStorage.setItem(
                    "currentUser",
                    // Note: Firebase uses displayName, but localStorage uses 'name' in your code
                    JSON.stringify({ ...parsed, name: name.trim() }) 
                );
            }
            
            setStatus("Display name updated successfully!");
        } catch (e) {
            console.error("Profile update error:", e);
            setStatus("Failed to save. Please try again.");
            setIsError(true);
        } finally {
            setSaving(false);
            setTimeout(() => {
                setStatus("");
                setIsError(false);
            }, 3000);
        }
    }, [name, uiUser.displayName, updateUserContext]);

    const isNameDifferent = name.trim() !== uiUser.displayName.trim();

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 text-left">Profile Details</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
                {/* Display Name */}
                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Display Name
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            id="displayName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 transition duration-150"
                            placeholder="Enter your full name"
                            aria-label="Display Name"
                        />
                        <button
                            onClick={onSave}
                            disabled={saving || !name.trim() || !isNameDifferent}
                            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                saving || !name.trim() || !isNameDifferent
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                            }`}
                        >
                            {saving ? "Saving..." : <><RiSaveLine /> Save</>}
                        </button>
                    </div>
                    {!!status && (
                        <p className={`mt-2 text-sm flex items-center gap-1 font-medium text-left ${isError ? 'text-red-600' : 'text-emerald-600'}`}>
                            {isError ? <RiErrorWarningLine /> : <RiCheckboxCircleLine />} {status}
                        </p>
                    )}
                </div>

                {/* Email (Read-only) */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Email Address
                    </label>
                    <input
                        id="email"
                        value={uiUser.email}
                        readOnly
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-600 cursor-default"
                        aria-label="Email Address"
                    />
                </div>
            </div>
        </div>
    );
});

const AccountShortcuts = React.memo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {PROFILE_SHORTCUTS.map((item) => (
            <Link
                key={item.title}
                to={item.to}
                className="group flex items-center justify-between border border-gray-200 rounded-2xl bg-white p-4 sm:p-5 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-200"
            >
                <div className="flex items-start gap-4 text-left">
                    <div className="text-emerald-600 flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                        <p className="font-bold text-lg text-gray-900 leading-snug">{item.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                </div>
                <RiArrowRightSLine className="text-2xl text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </Link>
        ))}
    </div>
));


// --- Main Component (UserProfile) ---

export default function UserProfile() {
    const navigate = useNavigate();
    // CRITICAL: Pulling the new function from useAuth
    const { user, logout, updateUserContext } = useAuth(); 
    
    // NEW STATE: Holds the dynamically updated photo URL
    const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || null);

    // Function to update the avatar URL from a child component
    const onAvatarUpdated = useCallback((newPhotoURL) => {
        setAvatarUrl(newPhotoURL);
    }, []);

    // Set the initial avatarUrl when the component mounts or the user object loads
    useEffect(() => {
        if (user?.photoURL) {
            setAvatarUrl(user.photoURL);
        }
    }, [user?.photoURL]);


    const uiUser = useMemo(() => {
        try {
            const raw = localStorage.getItem("currentUser");
            const storedUser = raw ? JSON.parse(raw) : null;
            
            // Prioritize the locally updated avatarUrl state, then Firebase, then localStorage
            const finalPhotoURL = avatarUrl || user?.photoURL || storedUser?.photoURL || "";

            if (user || storedUser) {
                return {
                    uid: user?.uid || storedUser?.uid || "",
                    email: user?.email || storedUser?.email || "",
                    // IMPORTANT: The AuthContext user object takes precedence for displayName
                    displayName: user?.displayName || storedUser?.name || "", 
                    phoneNumber: user?.phoneNumber || storedUser?.phone || "",
                    photoURL: finalPhotoURL, 
                    isAdmin:
                        (user?.email || "").toLowerCase() === "admin@medilab.com" ||
                        !!storedUser?.isAdmin,
                    points: storedUser?.points ?? 0,
                };
            }
        } catch (error) {
            console.error("Error parsing stored user data:", error);
        }
        return null;
    }, [user, avatarUrl]); // Rerun when user object or avatarUrl state changes

    const onLogout = async () => {
        try {
            await logout(); 
        } finally {
            localStorage.removeItem("currentUser"); 
            navigate("/login");
        }
    };

    if (!uiUser) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-6 text-center max-w-md w-full">
                    <RiErrorWarningLine className="text-5xl text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-8">
                        It looks like you're not logged in. Please sign in to view your profile.
                    </p>
                    <div className="flex flex-col gap-4"> 
                        <Link
                            to="/login"
                            className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
                        >
                            Login Now
                        </Link>
                        <Link
                            to="/register"
                            className="px-6 py-3 rounded-full border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Authenticated User Profile
    return (
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 p-4 sm:p-6 pt-20 sm:pt-24 pb-12">
            <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
                {/* Profile Header (User Info & Logout) */}
                <ProfileHeader 
                    uiUser={uiUser} 
                    onLogout={onLogout} 
                    onAvatarUpdated={onAvatarUpdated}
                    updateUserContext={updateUserContext} // Passed the context update function
                />

                {/* Profile Details (Editable Info) */}
                <EditableProfileDetails uiUser={uiUser} updateUserContext={updateUserContext} />

                {/* Account Shortcuts */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left">Quick Access</h2>
                    <AccountShortcuts />
                </div>
            </div>
        </main>
    );
}
