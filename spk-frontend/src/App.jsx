import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import {
    Trash2,
    Rocket,
    PlusCircle,
    BarChart3,
    Smartphone,
    Cpu,
    Camera,
    Weight,
    Banknote,
    Sparkles,
    Sun,
    Moon,
    LogOut,
    User,
    TrendingUp,
    X,
    Info,
    Award,
    CheckCircle,
} from "lucide-react";
import { FaMedal } from "react-icons/fa";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || 'https://smartphone-finder-backend-production.up.railway.app';

console.log('API_URL:', API_URL); // Debug: cek apakah env terbaca

export default function App() {
    const [isLogin, setIsLogin] = useState(!!localStorage.getItem("token"));
    const [smartphones, setSmartphones] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("theme");
        return saved ? saved === "dark" : true;
    });
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [showRegister, setShowRegister] = useState(false);
    
    // Modal state untuk detail ranking
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPhone, setSelectedPhone] = useState(null);

    const [form, setForm] = useState({
        nama_hp: "",
        harga: "",
        ram: "",
        kamera: "",
        berat: "",
        keunikan: "",
    });

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/smartphones`);
            // Pastikan response adalah array
            if (Array.isArray(res.data)) {
                setSmartphones(res.data);
            } else {
                console.error('Response bukan array:', res.data);
                setSmartphones([]);
            }
        } catch (err) {
            console.error("ERROR FETCH:", err);
            setSmartphones([]); // Set empty array kalau error
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Track comparison ketika ranking muncul
    useEffect(() => {
        if (ranking.length > 0) {
            const token = localStorage.getItem("token");
            if (token) {
                // Track comparison activity
                axios.post(
                    `${API_URL}/track-activity`,
                    { activityType: "comparison" },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ).catch(err => {
                    console.error("Error tracking comparison:", err);
                });
            }
        }
    }, [ranking]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/smartphones/${id}`);
            fetchData();
        } catch (err) {
            console.error("DELETE ERROR:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLogin(false);
    };

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.nama_hp ||
            !form.harga ||
            !form.ram ||
            !form.kamera ||
            !form.berat ||
            !form.keunikan
        ) {
            alert("Semua field harus diisi!");
            return;
        }

        if (
            form.harga <= 0 ||
            form.ram <= 0 ||
            form.kamera <= 0 ||
            form.berat <= 0 ||
            form.keunikan <= 0
        ) {
            alert("Nilai tidak boleh 0 atau negatif!");
            return;
        }

        try {
            await axios.post(`${API_URL}/smartphones`, form);

            setForm({
                nama_hp: "",
                harga: "",
                ram: "",
                kamera: "",
                berat: "",
                keunikan: "",
            });

            fetchData();
            
            // Track activity: saved item
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    await axios.post(
                        `${API_URL}/track-activity`,
                        { activityType: "saved_item" },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                } catch (err) {
                    console.error("Error tracking saved item:", err);
                }
            }
        } catch (err) {
            console.error("CREATE ERROR:", err);
            alert("Gagal menambahkan data");
        }
    };

    const getRanking = async () => {
        try {
            const res = await axios.get(`${API_URL}/saw`);
            
            // Pastikan response adalah array
            if (Array.isArray(res.data)) {
                setRanking(res.data);
            } else {
                console.error('SAW response bukan array:', res.data);
                setRanking([]);
                alert('Gagal mendapatkan ranking. Pastikan ada data smartphone terlebih dahulu.');
                return;
            }
            
            // Track activity
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    await axios.post(
                        `${API_URL}/track-activity`,
                        { activityType: "analysis" },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                } catch (err) {
                    console.error("Error tracking activity:", err);
                }
            }
        } catch (err) {
            console.error("ERROR SAW:", err);
            setRanking([]);
            alert("Backend error / belum jalan!");
        }
    };

    const handleShowDetail = (phone) => {
        setSelectedPhone(phone);
        setShowDetailModal(true);
    };

    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setSelectedPhone(null);
    };

    const chartTextColor = isDark ? "#d1d5db" : "#374151";
    const chartGridColor = isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(15,23,42,0.08)";

    const chartData = {
        labels: Array.isArray(ranking) ? ranking.map((r) => r.nama_hp) : [],
        datasets: [
            {
                label: "Score",
                data: Array.isArray(ranking) ? ranking.map((r) => r.score) : [],
                backgroundColor: [
                    "#22c55e",
                    "#3b82f6",
                    "#a855f7",
                    "#f59e0b",
                    "#ef4444",
                ],
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                labels: { color: chartTextColor },
            },
        },
        scales: {
            x: {
                ticks: { color: chartTextColor },
                grid: { color: chartGridColor },
            },
            y: {
                ticks: { color: chartTextColor },
                grid: { color: chartGridColor },
            },
        },
    };

    if (!isLogin) {
        if (showRegister) {
            return (
                <Register
                    onSwitchToLogin={() => setShowRegister(false)}
                    isDark={isDark}
                />
            );
        }
        return (
            <Login
                onLogin={() => setIsLogin(true)}
                isDark={isDark}
                onSwitchToRegister={() => setShowRegister(true)}
            />
        );
    }

    if (currentPage === "profile") {
        return (
            <Profile
                onBack={() => setCurrentPage("dashboard")}
                isDark={isDark}
            />
        );
    }

    return (
        <div className={isDark ? "dark" : ""}>
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-slate-900 dark:to-black text-slate-900 dark:text-white relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-40 left-20 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
                    <div className="absolute top-1/2 right-20 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-15 dark:opacity-10 animate-blob animation-delay-3000"></div>
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                </div>

                {/* Sidebar */}
                {isSidebarOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                        />

                        <div className="fixed top-0 left-0 w-72 h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 z-50 p-6 flex flex-col justify-between shadow-2xl">
                            <div>
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-green-500" />
                                    Menu
                                </h2>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            setCurrentPage("profile");
                                            setIsSidebarOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-all"
                                    >
                                        <User className="w-5 h-5" />
                                        Profile
                                    </button>

                                    <button
                                        onClick={toggleTheme}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-all"
                                    >
                                        {isDark ? (
                                            <>
                                                <Sun className="w-5 h-5" />
                                                Light Mode
                                            </>
                                        ) : (
                                            <>
                                                <Moon className="w-5 h-5" />
                                                Dark Mode
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </>
                )}

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-16">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                        <div className="flex-1 space-y-6">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="mb-6 p-3 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:scale-110 transition-all shadow-lg"
                                aria-label="Open menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-white/10 backdrop-blur-sm rounded-full border border-white/60 dark:border-white/20 mb-6">
                                <Sparkles className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI-Powered Decision System</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                <span className="flex items-center gap-3 mb-2">
                                    <Rocket className="text-green-400 animate-pulse" />
                                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                                        Smartphone
                                    </span>
                                </span>
                                <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                    Finder
                                </span>
                            </h1>

                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl leading-relaxed">
                                Sistem SPK berbasis SAW untuk memilih HP terbaik dengan analisis data yang akurat dan objektif.
                            </p>

                            <button
                                onClick={getRanking}
                                className="group relative px-8 py-4 rounded-xl font-semibold text-lg text-white overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-transform group-hover:scale-105"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                                <span className="relative flex items-center justify-center gap-2">
                                    <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    Mulai Analisis
                                </span>
                            </button>
                        </div>

                        <div className="w-full lg:w-[600px] lg:sticky lg:top-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-500 rounded-2xl blur-xl opacity-20 dark:opacity-30 animate-pulse-slow"></div>
                                
                                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl p-8 shadow-2xl">
                                    <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
                                        <BarChart3 className="text-green-400 w-6 h-6" />
                                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                            Top Ranking
                                        </span>
                                    </h2>

                                    {ranking.length > 0 ? (
                                        <div className="space-y-4">
                                            {ranking.slice(0, 3).map((item, index) => (
                                                <div
                                                    key={item.id ?? item.nama_hp ?? index}
                                                    onClick={() => handleShowDetail(item)}
                                                    className="group flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-500 transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                                                            index === 0
                                                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/50"
                                                                : index === 1
                                                                  ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-lg shadow-gray-400/50"
                                                                  : "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/50"
                                                        }`}>
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <p className="text-base font-semibold text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition">
                                                                {item.nama_hp}
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                Rank #{index + 1}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">Score</p>
                                                            <p className="text-lg font-bold text-green-500 dark:text-green-400">
                                                                {Number(item.score).toFixed(3)}
                                                            </p>
                                                        </div>

                                                        <FaMedal
                                                            className={`text-2xl ${
                                                                index === 0
                                                                    ? "text-yellow-400 drop-shadow-[0_0_8px_gold]"
                                                                    : index === 1
                                                                      ? "text-gray-300 drop-shadow-[0_0_8px_silver]"
                                                                      : "text-amber-600 drop-shadow-[0_0_8px_orange]"
                                                            }`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <BarChart3 className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-500 dark:text-gray-500 text-sm">
                                                Klik "Mulai Analisis" untuk melihat ranking
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur-xl opacity-10"></div>
                        
                        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/60 dark:border-white/10 shadow-2xl">
                            <h2 className="text-2xl mb-6 flex items-center gap-3 font-bold">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500">
                                    <PlusCircle className="text-white w-6 h-6" />
                                </div>
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                    Tambah Smartphone
                                </span>
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {Object.keys(form).map((key) => (
                                    <div key={key} className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize flex items-center gap-2">
                                            {key === "nama_hp" && <Smartphone className="w-4 h-4 text-green-500" />}
                                            {key === "harga" && <Banknote className="w-4 h-4 text-green-500" />}
                                            {key === "ram" && <Cpu className="w-4 h-4 text-green-500" />}
                                            {key === "kamera" && <Camera className="w-4 h-4 text-green-500" />}
                                            {key === "berat" && <Weight className="w-4 h-4 text-green-500" />}
                                            {key === "keunikan" && <Sparkles className="w-4 h-4 text-green-500" />}
                                            {key.replace("_", " ")}
                                        </label>

                                        <input
                                            type={
                                                key === "nama_hp"
                                                    ? "text"
                                                    : "number"
                                            }
                                            value={form[key]}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    [key]: e.target.value,
                                                })
                                            }
                                            className="p-3.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                                            placeholder={`Masukkan ${key.replace("_", " ")}`}
                                        />
                                    </div>
                                ))}

                                <button
                                    type="submit"
                                    className="md:col-span-2 xl:col-span-3 mt-4 group relative py-4 rounded-xl font-semibold text-lg text-white overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-transform group-hover:scale-105"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                                    <span className="relative flex items-center justify-center gap-2">
                                        <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                        Simpan Data
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {smartphones.map((hp) => (
                            <div
                                key={hp.id}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                
                                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/60 dark:border-white/10 hover:border-green-400 dark:hover:border-green-500 hover:scale-[1.03] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                                            <Smartphone className="w-6 h-6 text-white" />
                                        </div>
                                        <button
                                            onClick={() => handleDelete(hp.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition">
                                        {hp.nama_hp}
                                    </h3>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                                                <Banknote className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-sm">Rp {hp.harga.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-sm">{hp.ram} GB RAM</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                <Camera className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <span className="text-sm">{hp.kamera} MP</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                                <Weight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <span className="text-sm">{hp.berat} gram</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-xl opacity-10"></div>
                        
                        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/60 dark:border-white/10 shadow-2xl">
                            <h2 className="text-2xl mb-6 flex items-center gap-3 font-bold">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
                                    <BarChart3 className="text-white w-6 h-6" />
                                </div>
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                    Grafik Ranking
                                </span>
                            </h2>

                            {ranking.length > 0 ? (
                                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl">
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <BarChart3 className="w-10 h-10 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 dark:text-gray-500 text-lg">
                                        Klik "Mulai Analisis" untuk melihat grafik
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Detail Ranking */}
                {showDetailModal && selectedPhone && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={handleCloseDetail}>
                        <div 
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-t-2xl">
                                <button
                                    onClick={handleCloseDetail}
                                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                                
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                        <Smartphone className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedPhone.nama_hp}</h2>
                                        <p className="text-white/80 text-sm mt-1">Detail Analisis & Breakdown Score</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Total Score */}
                                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                                    <Award className="w-12 h-12 mx-auto mb-3 text-green-500" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Score</p>
                                    <p className="text-5xl font-bold text-green-500">{Number(selectedPhone.score).toFixed(3)}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                        Ranking: #{ranking.findIndex(r => r.id === selectedPhone.id) + 1} dari {ranking.length}
                                    </p>
                                </div>

                                {/* Spesifikasi */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                                        <Info className="w-5 h-5 text-green-500" />
                                        Spesifikasi
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Banknote className="w-4 h-4 text-green-500" />
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Harga</p>
                                            </div>
                                            <p className="text-lg font-bold text-slate-800 dark:text-white">
                                                Rp {selectedPhone.data.harga.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Cpu className="w-4 h-4 text-blue-500" />
                                                <p className="text-xs text-slate-500 dark:text-slate-400">RAM</p>
                                            </div>
                                            <p className="text-lg font-bold text-slate-800 dark:text-white">
                                                {selectedPhone.data.ram} GB
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Camera className="w-4 h-4 text-purple-500" />
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Kamera</p>
                                            </div>
                                            <p className="text-lg font-bold text-slate-800 dark:text-white">
                                                {selectedPhone.data.kamera} MP
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Weight className="w-4 h-4 text-orange-500" />
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Berat</p>
                                            </div>
                                            <p className="text-lg font-bold text-slate-800 dark:text-white">
                                                {selectedPhone.data.berat} gram
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Breakdown Score */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                                        <BarChart3 className="w-5 h-5 text-green-500" />
                                        Breakdown Score per Kriteria
                                    </h3>
                                    <div className="space-y-3">
                                        {/* Harga */}
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Banknote className="w-4 h-4 text-green-500" />
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">Harga (30%)</span>
                                                </div>
                                                <span className="font-bold text-green-500">{Number(selectedPhone.breakdown.harga).toFixed(3)}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${(selectedPhone.breakdown.harga / 0.3) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                                {selectedPhone.data.harga === selectedPhone.reference.minHarga 
                                                    ? "✓ Harga termurah! Nilai maksimal." 
                                                    : `Harga lebih tinggi ${((selectedPhone.data.harga / selectedPhone.reference.minHarga - 1) * 100).toFixed(0)}% dari termurah.`}
                                            </p>
                                        </div>

                                        {/* RAM */}
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Cpu className="w-4 h-4 text-blue-500" />
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">RAM (20%)</span>
                                                </div>
                                                <span className="font-bold text-blue-500">{Number(selectedPhone.breakdown.ram).toFixed(3)}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${(selectedPhone.breakdown.ram / 0.2) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                                {selectedPhone.data.ram === selectedPhone.reference.maxRam 
                                                    ? "✓ RAM terbesar! Nilai maksimal." 
                                                    : `RAM ${((1 - selectedPhone.data.ram / selectedPhone.reference.maxRam) * 100).toFixed(0)}% lebih kecil dari terbesar.`}
                                            </p>
                                        </div>

                                        {/* Kamera */}
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Camera className="w-4 h-4 text-purple-500" />
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">Kamera (25%)</span>
                                                </div>
                                                <span className="font-bold text-purple-500">{Number(selectedPhone.breakdown.kamera).toFixed(3)}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div 
                                                    className="bg-purple-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${(selectedPhone.breakdown.kamera / 0.25) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                                {selectedPhone.data.kamera === selectedPhone.reference.maxKamera 
                                                    ? "✓ Kamera terbaik! Nilai maksimal." 
                                                    : `Kamera ${((1 - selectedPhone.data.kamera / selectedPhone.reference.maxKamera) * 100).toFixed(0)}% lebih rendah dari terbaik.`}
                                            </p>
                                        </div>

                                        {/* Berat */}
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Weight className="w-4 h-4 text-orange-500" />
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">Berat (15%)</span>
                                                </div>
                                                <span className="font-bold text-orange-500">{Number(selectedPhone.breakdown.berat).toFixed(3)}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div 
                                                    className="bg-orange-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${(selectedPhone.breakdown.berat / 0.15) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                                {selectedPhone.data.berat === selectedPhone.reference.minBerat 
                                                    ? "✓ Paling ringan! Nilai maksimal." 
                                                    : `Berat ${((selectedPhone.data.berat / selectedPhone.reference.minBerat - 1) * 100).toFixed(0)}% lebih berat dari teringan.`}
                                            </p>
                                        </div>

                                        {/* Keunikan */}
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">Keunikan (10%)</span>
                                                </div>
                                                <span className="font-bold text-yellow-500">{Number(selectedPhone.breakdown.keunikan).toFixed(3)}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div 
                                                    className="bg-yellow-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${(selectedPhone.breakdown.keunikan / 0.1) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                                Nilai keunikan: {selectedPhone.data.keunikan}/10
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Kesimpulan */}
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Kesimpulan</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {selectedPhone.nama_hp} mendapat score <span className="font-bold text-green-500">{Number(selectedPhone.score).toFixed(3)}</span> berdasarkan perhitungan SAW dengan bobot: Harga (30%), Kamera (25%), RAM (20%), Berat (15%), dan Keunikan (10%). 
                                                {ranking.findIndex(r => r.id === selectedPhone.id) === 0 && " Smartphone ini merupakan pilihan terbaik berdasarkan kriteria yang ada!"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
