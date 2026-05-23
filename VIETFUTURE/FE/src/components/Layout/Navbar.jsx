import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, FileText, Map, ChevronDown } from "lucide-react";

function Navbar({ onUploadClick, onLoginClick }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đọc user từ localStorage mỗi khi render
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user") || localStorage.getItem("devpath_user");
      setCurrentUser(stored ? JSON.parse(stored) : null);
    };
    syncUser();
    window.addEventListener("storage", syncUser);
    // Custom event để cập nhật khi login/logout trong cùng tab
    window.addEventListener("devpath_auth_change", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("devpath_auth_change", syncUser);
    };
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("devpath_user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event("devpath_auth_change"));
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getFirstName = (name) => {
    if (!name) return "User";
    const parts = name.trim().split(" ");
    return parts[parts.length - 1]; // Lấy tên (phần cuối)
  };

  const userName = currentUser?.full_name || currentUser?.name || "Người dùng";

  return (
    <nav
      className={`sticky top-0 w-full flex justify-between items-center px-12 transition-all duration-300 z-50 ${
        scrolled
          ? "py-4 bg-[#080c10]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
          : "py-6 bg-transparent"
      }`}
    >
      {/* Logo */}
      <div
        className="text-2xl cursor-pointer flex items-center gap-1"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <span className="font-extrabold text-white tracking-tight">Dev</span>
        <span className="font-extrabold text-[#00E5FF] tracking-tight">Path</span>
        <span className="font-medium text-white/70 ml-1">AI</span>
      </div>

      {/* Menu */}
      <div className="hidden md:flex gap-10 text-[14px] items-center font-medium">
        <button
          onClick={() => scrollToSection("how")}
          className="text-[#6b7a95] hover:text-white transition-colors"
        >
          Cách hoạt động
        </button>

        <button
          onClick={() => scrollToSection("roadmaps")}
          className="text-[#6b7a95] hover:text-white transition-colors"
        >
          Lộ trình
        </button>

        <button
          onClick={onUploadClick}
          className="text-[#6b7a95] hover:text-white transition-colors"
        >
          Phân tích CV
        </button>

        {/* ─── AUTH SECTION ─── */}
        {currentUser ? (
          /* Avatar + Username Dropdown */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all group"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#00E5FF]/40 shadow-[0_0_10px_rgba(0,229,255,0.15)] shrink-0">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#00e5ff]/20 to-[#7c3aed]/30 flex items-center justify-center text-[11px] font-bold text-[#00e5ff]">
                    {getInitials(userName)}
                  </div>
                )}
              </div>

              {/* Username */}
              <span className="text-sm font-semibold text-white max-w-[100px] truncate">
                {getFirstName(userName)}
              </span>

              {/* Chevron */}
              <ChevronDown
                size={14}
                className={`text-[#6b7a95] transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-[#0d1527]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#00E5FF]/30 shrink-0">
                      {currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#00e5ff]/20 to-[#7c3aed]/30 flex items-center justify-center text-xs font-bold text-[#00e5ff]">
                          {getInitials(userName)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-white truncate">
                        {userName}
                      </div>
                      <div className="text-[11px] text-[#6b7a95] truncate">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1.5">
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/profile"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#c4d0e3] hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <User size={15} className="text-[#00e5ff]" />
                    Trang cá nhân
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/upload"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#c4d0e3] hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <FileText size={15} className="text-[#7c3aed]" />
                    Upload CV
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/roadmap"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#c4d0e3] hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Map size={15} className="text-[#a78bfa]" />
                    Lộ trình của tôi
                  </button>
                </div>

                {/* Divider + Logout */}
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
          /* Nút Đăng nhập khi chưa login */
          <button
            onClick={onLoginClick}
            className="bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-[#080c10] px-8 py-3 rounded-[10px] font-bold text-[15px] transition-all transform hover:scale-105 active:scale-95 shadow-[0_8px_20px_rgba(0,207,232,0.2)]"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;