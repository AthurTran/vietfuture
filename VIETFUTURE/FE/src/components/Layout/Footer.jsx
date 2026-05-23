import React from "react";

function Footer() {
  return (
    <footer className="relative bg-[#05080f] border-t border-white/5 text-white/40 overflow-hidden font-sans">
      {/* 1. Hiệu ứng Grid Background - Nhạt hơn để không lấn át nội dung */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Glow nhẹ phía trên - Đồng bộ màu với CTA */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#00E5FF]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
        {/* Logo + mô tả */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Dev<span className="text-[#00E5FF]">Path</span> AI
          </h2>
          <p className="text-[15px] leading-relaxed max-w-[240px]">
            Nền tảng AI giúp bạn định hướng sự nghiệp IT và xây dựng lộ trình
            học tập cá nhân hóa.
          </p>
        </div>

        {/* Cột Sản phẩm */}
        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-[0.2em]">
            Sản phẩm
          </h3>
          <ul className="space-y-4 text-[14px]">
            <li>
              <a
                href="#"
                className="hover:text-[#00E5FF] transition-colors duration-300"
              >
                Phân tích CV
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#00E5FF] transition-colors duration-300"
              >
                Lộ trình
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#00E5FF] transition-colors duration-300"
              >
                Skill Tree
              </a>
            </li>
          </ul>
        </div>

        {/* Cột Tài nguyên */}
        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-[0.2em]">
            Tài nguyên
          </h3>
          <ul className="space-y-4 text-[14px]">
            <li>
              <a
                href="#"
                className="hover:text-[#00E5FF] transition-colors duration-300"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#00E5FF] transition-colors duration-300"
              >
                Hướng dẫn
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#00E5FF] transition-colors duration-300"
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Social - Kết nối */}
        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-[0.2em]">
            Kết nối
          </h3>
          <div className="flex gap-4">
            {[
              {
                icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                label: "Facebook",
              },
              {
                icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
                label: "GitHub",
              },
              {
                icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2",
                label: "LinkedIn",
              },
            ].map((social, idx) => (
              <div
                key={idx}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 text-white/40 hover:border-[#00E5FF]/50 hover:text-[#00E5FF] hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={social.icon}></path>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/50 py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm font-medium">
          <p>© 2025 DevPath AI — All rights reserved.</p>

          <div className="flex items-center gap-2 text-gray-500">
            <span>Dự án sinh viên — EAUT</span>
            <span className="text-gray-800">•</span>
            <span>Đội DevPath AI</span>
            <span className="text-gray-800">•</span>
            <span>2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
