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
} from "lucide-react";
import { FaMedal } from "react-icons/fa";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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
            const res = await axios.get("http://localhost:3001/smartphones");
            setSmartphones(res.data);
        } catch (err) {
            console.error("ERROR FETCH:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/smartphones/${id}`);
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
            await axios.post("http://localhost:3001/smartphones", form);

            setForm({
                nama_hp: "",
                harga: "",
                ram: "",
                kamera: "",
                berat: "",
                keunikan: "",
            });

            fetchData();
        } catch (err) {
            console.error("CREATE ERROR:", err);
            alert("Gagal menambahkan data");
        }
    };

    const getRanking = async () => {
        try {
            const res = await axios.get("http://localhost:3001/saw");
            setRanking(res.data);
            
            // Track activity
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    await axios.post(
                        "http://localhost:3001/track-activity",
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
            alert("Backend error / belum jalan!");
        }
    };

    const chartTextColor = isDark ? "#d1d5db" : "#374151";
    const chartGridColor = isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(15,23,42,0.08)";

    const chartData = {
        labels: ranking.map((r) => r.nama_hp),
        datasets: [
            {
                label: "Score",
                data: ranking.map((r) => r.score),
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
                                                    className="group flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-500 transition-all hover:scale-[1.02] hover:shadow-lg"
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
            </div>
        </div>
    );
}
