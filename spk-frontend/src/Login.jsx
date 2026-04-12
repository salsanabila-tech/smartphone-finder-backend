import { useState } from "react";
import axios from "axios";
import { Lock, User, Sparkles, Rocket, Eye, EyeOff } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'https://smartphone-finder-backend-production.up.railway.app';

export default function Login({ onLogin, isDark, onSwitchToRegister }) {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API_URL}/login`, form);
            localStorage.setItem("token", res.data.token);
            onLogin();
        } catch (err) {
            alert("Login gagal!");
        }
    };

    return (
        <div className={isDark ? "dark" : ""}>
            <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-slate-900 dark:to-black overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Large Orbs */}
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-blob"></div>
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-4000"></div>
                    <div className="absolute top-1/2 right-20 w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-15 animate-blob animation-delay-3000"></div>
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                    
                    {/* Floating Particles */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-float"></div>
                    <div className="absolute top-3/4 left-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-float animation-delay-1000"></div>
                    <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-float animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-float animation-delay-3000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                    <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Branding */}
                        <div className="hidden lg:block text-slate-800 dark:text-white space-y-6">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/40 dark:bg-white/10 backdrop-blur-sm rounded-full border border-white/60 dark:border-white/20">
                                <Sparkles className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium">AI-Powered Decision System</span>
                            </div>
                            
                            <h1 className="text-6xl font-bold leading-tight">
                                Find Your
                                <span className="block bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                    Perfect Phone
                                </span>
                            </h1>
                            
                            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                                Sistem rekomendasi smartphone berbasis SAW yang membantu Anda membuat keputusan terbaik dengan data yang akurat.
                            </p>
                            
                            <div className="flex items-center gap-8 pt-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-500">500+</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Smartphones</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-cyan-500">98%</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Accuracy</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-500">24/7</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Available</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="relative">
                            {/* Glow Effect Behind Card */}
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-500 rounded-3xl blur-2xl opacity-20 dark:opacity-30 animate-pulse-slow"></div>
                            
                            {/* Login Card */}
                            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                                {/* Logo/Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                                        <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-2xl">
                                            <Rocket className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                                        Welcome Back !
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Login untuk melanjutkan ke dashboard
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleLogin} className="space-y-5">
                                    {/* Username */}
                                    <div className="group">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-green-500 transition" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Masukkan username"
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                                onChange={(e) =>
                                                    setForm({ ...form, username: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="group">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-green-500 transition" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Masukkan password"
                                                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                                onChange={(e) =>
                                                    setForm({ ...form, password: e.target.value })
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="relative w-full py-4 rounded-xl font-semibold text-lg text-white overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-transform group-hover:scale-105"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                                        <span className="relative flex items-center justify-center gap-2">
                                            Login
                                            <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>
                                </form>

                                {/* Footer */}
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                        Belum punya akun?{" "}
                                        <button
                                            onClick={onSwitchToRegister}
                                            className="font-semibold text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 transition"
                                        >
                                            Daftar di sini
                                        </button>
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Powered by{" "}
                                        <span className="font-semibold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                            SAW Algorithm
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
