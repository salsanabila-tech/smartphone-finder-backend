import { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Calendar, Shield, ArrowLeft, Sparkles, Award, Clock, Loader } from "lucide-react";

export default function Profile({ onBack, isDark }) {
    const [userData, setUserData] = useState(null);
    const [userStats, setUserStats] = useState({
        totalAnalyses: 0,
        savedItems: 0,
        comparisons: 0,
        thisWeek: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserProfile();
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token) return;

            const response = await axios.get("http://localhost:3001/user-stats", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUserStats(response.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                setError("Token tidak ditemukan. Silakan login kembali.");
                setLoading(false);
                return;
            }

            console.log("Fetching profile with token:", token);

            const response = await axios.get("http://localhost:3001/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Profile data received:", response.data);
            setUserData(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching profile:", err);
            console.error("Error response:", err.response);
            setError(err.response?.data?.message || err.message || "Gagal memuat data profile");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={isDark ? "dark" : ""}>
                <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-slate-900 dark:to-black flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={isDark ? "dark" : ""}>
                <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-slate-900 dark:to-black flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={onBack}
                            className="px-6 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition"
                        >
                            Kembali
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={isDark ? "dark" : ""}>
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-slate-900 dark:to-black relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-blob"></div>
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="mb-8 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all hover:scale-105 text-slate-700 dark:text-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </button>

                    {/* Profile Header Card */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-500 rounded-3xl blur-2xl opacity-20 dark:opacity-30"></div>
                        
                        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                                        <User className="w-14 h-14 text-white" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                                        {userData.username}
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                                        {userData.email}
                                    </p>
                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                                            <Shield className="w-4 h-4" />
                                            {userData.role}
                                        </span>
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                                            <Award className="w-4 h-4" />
                                            Verified
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-6 md:gap-4 md:flex-col">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-500">{userStats.totalAnalyses}</div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">Analyses</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-cyan-500">{userStats.savedItems}</div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">Saved</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-10"></div>
                            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-green-500" />
                                    Personal Information
                                </h2>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                            <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Username</p>
                                            <p className="text-base font-semibold text-slate-800 dark:text-white">
                                                {userData.username}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Email Address</p>
                                            <p className="text-base font-semibold text-slate-800 dark:text-white break-all">
                                                {userData.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-xl opacity-10"></div>
                            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-cyan-500" />
                                    Account Information
                                </h2>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Role</p>
                                            <p className="text-base font-semibold text-slate-800 dark:text-white">
                                                {userData.role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Member Since</p>
                                            <p className="text-base font-semibold text-slate-800 dark:text-white">
                                                {userData.joinDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Summary */}
                    <div className="relative mt-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur-xl opacity-10"></div>
                        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-500" />
                                Recent Activity
                            </h2>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{userStats.totalAnalyses}</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Total Analyses</div>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{userStats.savedItems}</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Saved Items</div>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{userStats.comparisons}</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Comparisons</div>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800">
                                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{userStats.thisWeek}</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">This Week</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
