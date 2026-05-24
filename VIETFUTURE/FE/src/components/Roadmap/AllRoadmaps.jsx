import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Terminal,
  Layout,
  Database,
  Server,
  Smartphone,
  ArrowRight,
  Shield,
  Cpu,
  Bug,
  PenTool,
  LogOut,
  User,
  FileText,
  Map,
  ChevronDown,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";

function AllRoadmaps() {
  const navigate = useNavigate();
  const [isAnimate, setIsAnimate] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const animationTimeout = setTimeout(() => {
      setIsAnimate(true);
    }, 50);

    const syncAuthState = () => {
      const token = localStorage.getItem("token");
      const storedUser =
        localStorage.getItem("user") || localStorage.getItem("devpath_user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      setCurrentUser(user);
      setIsAuthenticated(Boolean(token && user));
    };

    const fetchCareers = async () => {
      try {
        const res = await axiosClient.get("/careers");
        if (res.data && res.data.length > 0) {
          setData(
            res.data.map((c) => ({
              title: c.career_name,
              time: c.demand_level || "6 tháng",
              skills: parseInt(c.salary_range) || 10,
              desc: c.description || "",
            })),
          );
        }
      } catch (err) {
        console.error("Failed to fetch careers", err);
      } finally {
        setLoading(false);
      }
    };

    syncAuthState();
    fetchCareers();

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("devpath_auth_change", syncAuthState);

    return () => {
      clearTimeout(animationTimeout);
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("devpath_auth_change", syncAuthState);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── ĐIỀU HƯỚNG CHUẨN ĐỒNG BỘ VỚI APP.JSX ──
  const goToHowItWorks = () => navigate("/");
  const goToUploadCV = () => navigate("/upload"); // ✅ Đã sửa thành /upload để khớp chuẩn với hệ thống
  const goToLogin = () => navigate("/login");
  const goToRegister = () => navigate("/register");

  const getDisplayName = () =>
    currentUser?.full_name ||
    currentUser?.name ||
    currentUser?.email ||
    "Người dùng";

  const getFirstName = (name) => {
    if (!name) return "User";
    const parts = name.trim().split(" ");
    return parts[parts.length - 1];
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("devpath_user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setIsAuthenticated(false);
    setDropdownOpen(false);
    window.dispatchEvent(new Event("devpath_auth_change"));
    navigate("/");
  };

  const handleRoadmapClick = (roleTitle) => {
    const mockData = {
      role: roleTitle,
      hasCV: false, // Thêm cờ nhận diện CV
      skills: [],
      missing: [
        "internet",
        "linux",
        "git",
        "nodejs",
        "restapi",
        "sql",
        "nosql",
        "auth",
        "docker",
        "redis",
        "html",
        "css",
        "react",
        "python",
        "figma",
      ],
    };
    localStorage.setItem("devpath_analysis_result", JSON.stringify(mockData));
    navigate("/roadmap");
  };

  const getIcon = (title) => {
    if (title.includes("Backend")) return <Server size={24} />;
    if (title.includes("Frontend")) return <Layout size={24} />;
    if (title.includes("Data")) return <Database size={24} />;
    if (title.includes("DevOps")) return <Terminal size={24} />;
    if (title.includes("Mobile")) return <Smartphone size={24} />;
    if (title.includes("AI")) return <Cpu size={24} />;
    if (title.includes("Security")) return <Shield size={24} />;
    if (title.includes("QA")) return <Bug size={24} />;
    if (title.includes("UI")) return <PenTool size={24} />;
    return <Layout size={24} />;
  };

  return (
    <div className="bg-[#0b0e14] min-h-screen flex flex-col text-white font-sans selection:bg-[#00E5FF]/30">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-[#0b0e14]/90 backdrop-blur-md border-b border-white/[0.02]">
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={goToHowItWorks}
          >
            <span className="text-[26px] font-bold tracking-tight text-white">
              DevPath
            </span>
            <span className="text-[26px] font-bold tracking-tight text-[#00E5FF]">
              AI
            </span>
          </div>

          <div className="flex items-center gap-8 md:gap-10">
            <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-white/50">
              <span
                onClick={goToHowItWorks}
                className="hover:text-white cursor-pointer transition-colors"
              >
                Cách hoạt động
              </span>
              <span className="text-white cursor-pointer font-semibold">
                Lộ trình
              </span>
              <span
                onClick={goToUploadCV}
                className="hover:text-white cursor-pointer transition-colors"
              >
                Phân tích CV
              </span>
            </nav>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((value) => !value)}
                  className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#00E5FF]/40 shrink-0">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#00e5ff]/20 to-[#7c3aed]/30 flex items-center justify-center text-[11px] font-bold text-[#00e5ff]">
                        {getInitials(getDisplayName())}
                      </div>
                    )}
                  </div>

                  <span className="text-sm font-semibold text-white max-w-[100px] truncate">
                    {getFirstName(getDisplayName())}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`text-[#6b7a95] transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-[#0d1527]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#00E5FF]/30 shrink-0">
                          {currentUser?.avatar ? (
                            <img
                              src={currentUser.avatar}
                              alt="avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#00e5ff]/20 to-[#7c3aed]/30 flex items-center justify-center text-xs font-bold text-[#00e5ff]">
                              {getInitials(getDisplayName())}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-white truncate">
                            {getDisplayName()}
                          </div>
                          <div className="text-[11px] text-[#6b7a95] truncate">
                            {currentUser?.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-1.5">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#c4d0e3] hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User size={15} className="text-[#00e5ff]" />
                        Trang cá nhân
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/upload");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#c4d0e3] hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <FileText size={15} className="text-[#7c3aed]" />
                        Upload CV
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/roadmap");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#c4d0e3] hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Map size={15} className="text-[#a78bfa]" />
                        Lộ trình của tôi
                      </button>
                    </div>

                    <div className="border-t border-white/5 py-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/8 hover:text-red-300 transition-colors"
                      >
                        <LogOut size={15} />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={goToLogin}
                className="px-6 py-2.5 bg-[#00E5FF] text-black text-[15px] font-bold rounded-lg hover:bg-[#00E5FF]/90 transition-colors"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main
        className={`flex-grow w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-14">
            <h1 className="text-[40px] md:text-[48px] font-bold tracking-tight mb-4">
              Khám phá <span className="text-[#00E5FF]">Tất Cả Lộ Trình</span>
            </h1>
            <p className="text-white/40 text-[15px] max-w-2xl leading-relaxed">
              Hệ thống lộ trình phát triển năng lực IT toàn diện từ DevPath,
              được tinh chỉnh dựa trên dữ liệu tuyển dụng thực tế.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-cyan-400/20 border-t-[#00E5FF] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((r, i) => (
                <div
                  key={i}
                  onClick={() => handleRoadmapClick(r.title)}
                  className="group bg-[#11141c] p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer relative flex flex-col min-h-[320px]"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/40 mb-6 group-hover:text-[#00E5FF] group-hover:border-[#00E5FF]/30 transition-all">
                    {getIcon(r.title)}
                  </div>
                  <h3 className="font-bold text-[22px] mb-3 text-white">
                    {r.title}
                  </h3>
                  <p className="text-white/40 text-[15px] leading-relaxed mb-8 flex-grow">
                    {r.desc}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 text-[#00E5FF] text-[12px] font-semibold rounded-full border border-[#00E5FF]/30">
                      {r.skills} kỹ năng
                    </span>
                    <span className="px-4 py-1.5 text-[#ff2e93] text-[12px] font-semibold rounded-full border border-[#ff2e93]/30">
                      {r.time}
                    </span>
                  </div>
                  <div className="absolute top-8 right-8 text-white/20 group-hover:text-white/60 transition-colors">
                    <ArrowRight size={18} className="-rotate-45" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.02] bg-[#0b0e14] pt-16 pb-8 mt-auto">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-1 mb-4">
                <span className="text-2xl font-bold tracking-tight text-white">
                  DevPath
                </span>
                <span className="text-2xl font-bold tracking-tight text-[#00E5FF]">
                  AI
                </span>
              </div>
              <p className="text-white/40 text-[14px] leading-relaxed">
                Định hình sự nghiệp IT của bạn thông qua AI.
              </p>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-5">
                Hệ sinh thái
              </h4>
              <ul className="space-y-3 text-[14px] text-white/40">
                <li
                  onClick={goToHowItWorks}
                  className="hover:text-white cursor-pointer transition-colors w-fit"
                >
                  Cách hoạt động
                </li>
                <li className="text-white font-medium cursor-default w-fit">
                  Lộ trình
                </li>
                <li
                  onClick={goToUploadCV}
                  className="hover:text-white cursor-pointer transition-colors w-fit"
                >
                  Phân tích CV
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-5">
                Tài khoản
              </h4>
              <ul className="space-y-3 text-[14px] text-white/40">
                <li
                  onClick={goToLogin}
                  className="hover:text-white cursor-pointer transition-colors w-fit"
                >
                  Đăng nhập
                </li>
                <li
                  onClick={goToRegister}
                  className="hover:text-white cursor-pointer transition-colors w-fit"
                >
                  Đăng ký thành viên
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-5">Kết nối</h4>
              <ul className="space-y-3 text-[14px] text-white/40">
                <li className="hover:text-white cursor-pointer transition-colors w-fit">
                  Về chúng tôi
                </li>
                <li className="hover:text-white cursor-pointer transition-colors w-fit">
                  Liên hệ
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.02] pt-8 flex flex-col md:flex-row items-center justify-between text-[13px] text-white/30">
            <p>© {new Date().getFullYear()} DevPath AI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:text-white cursor-pointer transition-colors">
                Điều khoản sử dụng
              </span>
              <span className="hover:text-white cursor-pointer transition-colors">
                Chính sách bảo mật
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AllRoadmaps;
