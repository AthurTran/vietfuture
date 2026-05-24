import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import axiosClient from "../../api/axiosClient";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    terms: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🛠️ STATE QUẢN LÝ HIỆU ỨNG CHUYỂN TRANG
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Lên đầu trang
    const animationTimeout = setTimeout(() => {
      setIsAnimate(true); // Kích hoạt animation sau 50ms
    }, 50);
    return () => clearTimeout(animationTimeout);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { firstName, lastName, email, password, confirmPassword, role, terms } = formData;

    if (!firstName || !lastName || !email || !password) {
      setError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!terms) {
      setError("Bạn phải đồng ý với Điều khoản & Bảo mật.");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/auth/register", {
        full_name: `${lastName} ${firstName}`.trim(),
        email,
        password,
        role
      });

      // Hiển thị thông báo thành công
      setSuccess(true);

      // Chờ 2 giây rồi chuyển sang trang đăng nhập
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin hoặc thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-[#070b14] p-6 text-white font-sans antialiased bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0d1b33] via-[#070b14] to-[#070b14]">
      
      {/* WRAPPER ÁP DỤNG HIỆU ỨNG ANIMATION CHO TOÀN BỘ NỘI DUNG */}
      <div 
        className={`flex flex-col justify-between flex-1 w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Top Header Logo */}
        <div className="flex items-center gap-2 text-xl font-bold tracking-wide mb-6">
          <span className="text-white">DevPath</span>
          <span className="bg-[#00e5ff] bg-clip-text text-transparent">AI</span>
        </div>

        {/* 🛠️ Main Card Container: Cố định md:h-[600px] để bằng khít kích thước trang login */}
        <div className="mx-auto flex w-full max-w-4xl md:h-[600px] overflow-hidden rounded-2xl border border-gray-800/50 bg-[#0d1527]/80 shadow-2xl backdrop-blur-md my-auto">
          
          {/* Left Side: Info */}
          <div className="hidden w-1/2 flex-col justify-center bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#112544] via-[#0d1527] to-[#0d1527] p-10 md:flex border-r border-gray-800/30">
            <div className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <span>DevPath</span>
              <span className="bg-[#00e5ff] bg-clip-text text-transparent">AI</span>
            </div>
            <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight">
              Bắt đầu hành trình <span className="text-[#00e5ff]">IT của bạn</span>
            </h2>
            <p className="mb-8 text-sm text-gray-400">
              Tạo tài khoản miễn phí và nhận ngay lộ trình học tập được AI cá nhân hoá cho riêng bạn.
            </p>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Đăng ký trong 30 giây
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Không cần thẻ tín dụng
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Upload CV và phân tích ngay
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Hoàn toàn miễn phí mãi mãi
              </li>
            </ul>
          </div>

          {/* 🛠️ Right Side: Form Đăng Ký (p-8 md:p-10 flex flex-col justify-center để tối ưu không gian) */}
          <div className="w-full p-8 md:w-1/2 md:p-10 flex flex-col justify-center">
            <h3 className="mb-0.5 text-2xl font-bold tracking-wide">Tạo tài khoản mới</h3>
            <p className="mb-4 text-xs text-gray-400">Điền thông tin bên dưới để bắt đầu</p>

            {/* ✅ Thông báo đăng ký thành công */}
            {success && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                <div>
                  <div className="font-bold">Tạo tài khoản thành công! 🎉</div>
                  <div className="text-xs text-green-400/80 mt-0.5">Đang chuyển bạn tới trang đăng nhập...</div>
                </div>
              </div>
            )}

            {/* Error Message Box */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* space-y-3 để các trường nhập thắt chặt, không bị tràn chiều cao */}
            <form className="space-y-3" onSubmit={handleSubmit}>
              
              {/* Họ và Tên (Flex row) */}
              <div className="flex gap-4">
                <div className="w-1/2 space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Họ</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Họ của bạn"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 px-3 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                </div>
                <div className="w-1/2 space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Tên</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Tên của bạn"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 px-3 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 pl-3 pr-10 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                  <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Ít nhất 8 ký tự"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 pl-3 pr-10 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
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

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 pl-3 pr-10 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Tôi muốn đăng ký làm</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 px-3 text-sm text-white focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff] cursor-pointer"
                >
                  <option value="student">Học sinh / Sinh viên (Student)</option>
                  <option value="professional">Người đi làm (Professional)</option>
                  <option value="career_switcher">Người chuyển ngành (Career Switcher)</option>
                </select>
              </div>

              {/* Terms Agreement */}
              <div className="text-xs pt-0.5">
                <label className="flex items-start gap-2.5 cursor-pointer text-gray-400 select-none leading-relaxed">
                  <input 
                    type="checkbox" 
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className="accent-[#00e5ff] rounded mt-0.5" 
                  />
                  <span>
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-[#00e5ff] hover:underline">Điều khoản</a> &{" "}
                    <a href="#" className="text-[#00e5ff] hover:underline">Bảo mật</a>
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#00e5ff] py-2.5 text-sm font-bold text-black transition-all hover:bg-[#00b2cc] active:scale-[0.99] mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4 text-center text-xs">
              <span className="absolute inset-x-0 top-1/2 h-px bg-gray-800"></span>
              <span className="relative bg-[#0d1527] px-3 text-gray-500 font-medium">hoặc</span>
            </div>

            {/* Google Register Button */}
            <button className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-700 bg-[#0a101f] py-2.5 text-sm font-medium transition-all hover:bg-[#121b30]">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.66 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.92 3.42-8.6z"/>
                <path fill="#FBBC05" d="M5.24 14.51c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.39 6.9C.5 8.71 0 10.74 0 12s.5 3.29 1.39 5.1l3.85-2.59z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.92 1.09-3.34 0-5.86-1.81-6.76-4.51L.7 16.39C2.69 20.29 6.67 23 12 23z"/>
              </svg>
              Đăng ký với Google
            </button>

            {/* Redirect to Login */}
            <p className="mt-4 text-center text-xs text-gray-400">
              Đã có tài khoản?{" "}
              <button onClick={() => navigate("/login")} className="text-[#00e5ff] font-semibold hover:underline">
                Đăng nhập
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Footer Logo */}
        <div className="flex items-center justify-between text-[10px] text-gray-600 mt-6">
          <span>DevPath AI</span>
          <span>Dự án sinh viên — EAUT · Đội DevPath AI - 2025</span>
        </div>
      </div>
    </div>
  );
}