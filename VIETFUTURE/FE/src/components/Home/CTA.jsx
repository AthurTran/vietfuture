import React from "react";
import { Upload } from "lucide-react";

function CTA({ onUploadClick }) {
  return (
    <div
      id="cta-section"
      className="mx-6 md:mx-10 my-28 bg-[#111927]/60 backdrop-blur-xl p-10 md:p-16 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden"
    >
      {/* Hiệu ứng ánh sáng nền (Glow) - Làm mạnh hơn một chút để thấy rõ sự khác biệt */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#00E5FF]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
          Sẵn sàng tìm lộ trình <br className="hidden md:block" /> của bạn chưa?
        </h2>
        <p className="text-white/40 mt-5 text-base md:text-lg font-medium">
          Upload CV ngay — AI sẽ phân tích và cho bạn kết quả trong vài giây.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 w-full md:w-auto">
        {/* Nút chính: Upload CV */}
        <button
          onClick={onUploadClick}
          className="group w-full sm:w-auto bg-[#00E5FF] text-[#080c10] px-8 py-4 rounded-2xl font-bold text-base 
                     hover:scale-105 active:scale-95 transition-all duration-300
                     shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_45px_rgba(0,229,255,0.6)]
                     flex items-center justify-center gap-2"
        >
          <Upload size={20} strokeWidth={2.5} />
          Upload CV ngay
        </button>

        {/* Nút phụ: Xem lộ trình */}
        <button
          className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white/70 border border-white/10 
                     bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300"
        >
          Xem lộ trình
        </button>
      </div>
    </div>
  );
}

export default CTA;