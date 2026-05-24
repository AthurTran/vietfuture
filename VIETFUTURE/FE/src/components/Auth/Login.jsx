import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import axiosClient from "../../api/axiosClient";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🛠️ STATE QUẢN LÝ HIỆU ỨNG CHUYỂN TRANG
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Lên đầu trang
    const animationTimeout = setTimeout(() => {
      setIsAnimate(true); // Kích hoạt animation sau 50ms
    }, 50);
    return () => clearTimeout(animationTimeout);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-[#070b14] p-6 text-white font-sans antialiased bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0d1b33] via-[#070b14] to-[#070b14]">
      
      {/* 🛠️ WRAPPER ÁP DỤNG HIỆU ỨNG ANIMATION CHO TOÀN BỘ NỘI DUNG */}
      <div 
        className={`flex flex-col justify-between flex-1 w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Top Header Logo */}
        <div className="flex items-center gap-2 text-xl font-bold tracking-wide mb-8">
          <span className="text-white">DevPath</span>
          <span className="bg-[#00e5ff] bg-clip-text text-transparent">AI</span>
        </div>

        {/* Main Card Container */}
        <div className="mx-auto flex w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-800/50 bg-[#0d1527]/80 shadow-2xl backdrop-blur-md my-auto">
          
          {/* Left Side: Info */}
          <div className="hidden w-1/2 flex-col justify-center bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#112544] via-[#0d1527] to-[#0d1527] p-10 md:flex border-r border-gray-800/30">
            <div className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <span>DevPath</span>
              <span className="bg-[#00e5ff] bg-clip-text text-transparent">AI</span>
            </div>
            <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight">
              Lộ trình IT <span className="text-[#00e5ff]">cá nhân hoá</span> <br /> bắt đầu từ đây
            </h2>
            <p className="mb-8 text-sm text-gray-400">
              Đăng nhập để xem lộ trình học tập AI tạo riêng cho bạn.
            </p>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> AI phân tích CV trong vài giây
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Sơ đồ kỹ năng trực quan
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Theo dõi tiến độ realtime
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Hoàn toàn miễn phí
              </li>
            </ul>
          </div>

          {/* Right Side: Form Đăng Nhập */}
          <div className="w-full p-8 md:w-1/2 md:p-12">
            <h3 className="mb-1 text-2xl font-bold tracking-wide">Đăng nhập tài khoản</h3>
            <p className="mb-6 text-xs text-gray-400">Chào mừng bạn quay lại 👋</p>

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setError("");

              if (!email || !password) {
                setError("Vui lòng nhập đầy đủ email và mật khẩu.");
                return;
              }

              setLoading(true);
              try {
                const response = await axiosClient.post("/auth/login", {
                  email,
                  password,
                });

                // Save token & user to localStorage
                if (response.token) {
                  localStorage.setItem("token", response.token);
                }
                if (response.user) {
                  localStorage.setItem("user", JSON.stringify(response.user));
                  window.dispatchEvent(new Event("devpath_auth_change"));
                  
                  // Chuyển hướng theo vai trò (Role-based redirect)
                  if (response.user.role === "admin") {
                    navigate("/admin");
                  } else {
                    navigate("/");
                  }
                } else {
                  window.dispatchEvent(new Event("devpath_auth_change"));
                  navigate("/");
                }
              } catch (err) {
                console.error(err);
                setError(
                  err.response?.data?.message ||
                  "Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu."
                );
              } finally {
                setLoading(false);
              }
            }}>
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2.5 pl-3 pr-10 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                  <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2.5 pl-3 pr-10 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-gray-400 select-none">
                  <input type="checkbox" className="accent-[#00e5ff] rounded" />
                  Ghi nhớ đăng nhập
                </label>
                <a href="#" className="text-[#00e5ff] hover:underline">Quên mật khẩu?</a>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#00e5ff] py-2.5 text-sm font-bold text-black transition-all hover:bg-[#00b2cc] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center text-xs">
              <span className="absolute inset-x-0 top-1/2 h-px bg-gray-800"></span>
              <span className="relative bg-[#0d1527] px-3 text-gray-500 font-medium">hoặc</span>
            </div>

            {/* Google Login Button */}
            <button className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-700 bg-[#0a101f] py-2.5 text-sm font-medium transition-all hover:bg-[#121b30]">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.66 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.92 3.42-8.6z"/>
                <path fill="#FBBC05" d="M5.24 14.51c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.39 6.9C.5 8.71 0 10.74 0 12s.5 3.29 1.39 5.1l3.85-2.59z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.92 1.09-3.34 0-5.86-1.81-6.76-4.51L.7 16.39C2.69 20.29 6.67 23 12 23z"/>
              </svg>
              Đăng nhập với Google
            </button>

            {/* Redirect to Register */}
            <p className="mt-6 text-center text-xs text-gray-400">
              Bạn chưa có tài khoản?{" "}
              <button onClick={() => navigate("/register")} className="text-[#00e5ff] font-semibold hover:underline">
                Đăng ký
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Footer Logo */}
        <div className="flex items-center justify-between text-[10px] text-gray-600 mt-8">
          <span>DevPath AI</span>
          <span>Dự án sinh viên — EAUT · Đội DevPath AI - 2025</span>
        </div>
      </div>
    </div>
  );
}