import React from "react";
import { Upload, Cpu, LayoutGrid } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Upload CV của bạn",
    desc: "Tải lên file CV dạng PDF. AI sẽ đọc và trích xuất toàn bộ kỹ năng bạn đã có trong vài giây.",
    icon: <Upload size={22} />,
  },
  {
    id: "02",
    title: "AI phân tích kỹ năng",
    desc: "Hệ thống so sánh kỹ năng hiện tại với Skill Tree chuẩn và xác định chính xác những gì bạn còn thiếu.",
    icon: <Cpu size={22} />,
  },
  {
    id: "03",
    title: "Nhận lộ trình cá nhân hoá",
    desc: "Xem sơ đồ học tập dạng cây, biết chính xác học gì trước, học gì sau và tài nguyên phù hợp cho từng bước.",
    icon: <LayoutGrid size={22} />,
  },
];

function Steps() {
  return (
    <section
      id="how"
      className="px-6 py-28 max-w-7xl mx-auto bg-[#05080f] text-white"
    >
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <span className="text-[#00E5FF] text-[11px] font-semibold tracking-[0.35em] uppercase">
          Quy trình
        </span>

        <h2 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight leading-tight">
          Hoạt động như thế nào?
        </h2>

        <p className="text-white/50 mt-5 text-[15px] leading-relaxed">
          3 bước đơn giản để có lộ trình học tập được cá nhân hoá cho riêng bạn.
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid md:grid-cols-3 border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01] backdrop-blur-xl">
        {steps.map((s, index) => (
          <div
            key={s.id}
            className={`group relative p-10 lg:p-14 flex flex-col transition-all duration-500
              ${index !== steps.length - 1 ? "md:border-r border-white/5" : ""}
              ${index !== steps.length - 1 ? "border-b md:border-b-0 border-white/5" : ""}
              hover:bg-white/[0.02]`}
          >
            {/* Number Decor - To và mờ hơn sát mép */}
            <div className="absolute top-4 right-4 text-[120px] font-black text-white/[0.02] group-hover:text-[#00E5FF]/[0.04] transition-all duration-700 select-none leading-none">
              {s.id}
            </div>

            {/* Icon Box - Nền đậm hơn để nổi bật */}
            <div
              className="relative z-10 w-14 h-14 flex items-center justify-center rounded-2xl border border-white/10 bg-[#0a101a] mb-8
              group-hover:border-[#00E5FF]/50 group-hover:shadow-[0_0_25px_rgba(0,229,255,0.15)] transition-all duration-300"
            >
              <span className="text-[#00E5FF]">{s.icon}</span>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#00E5FF] transition-colors duration-300">
                {s.title}
              </h3>

              <p className="text-white/50 text-[15px] leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Steps;