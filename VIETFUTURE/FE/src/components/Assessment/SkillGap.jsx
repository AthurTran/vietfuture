import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Đã sửa lỗi: Khai báo đầy đủ các icon được sử dụng trong giao diện từ lucide-react
import { CheckCircle2, ArrowRight, ShieldAlert, Award, RefreshCw, BrainCircuit, ChevronLeft } from 'lucide-react';

function SkillGap() {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Kích hoạt hiệu ứng mượt khi vào trang
    const animationTimeout = setTimeout(() => {
      setIsAnimate(true);
    }, 50);

    // Đọc dữ liệu từ Form giả lập đã lưu ở trang trước
    const localData = localStorage.getItem("skill_gap_result");
    if (localData) {
      const parsedData = JSON.parse(localData);
      setAnalysisData(parsedData);
      
      // Tự động lưu chức danh công việc để trang "Gợi ý khóa học (Courses.jsx)" kế tiếp có thể đọc được
      localStorage.setItem("courses_recommended_role", parsedData.role || "");
    }

    return () => clearTimeout(animationTimeout);
  }, []);

  // Nếu người dùng chưa làm bài đánh giá mà truy cập thẳng vào trang này
  if (!analysisData) {
    return (
      <div className="bg-[#070b14] min-h-screen text-white flex flex-col items-center justify-center gap-4 font-sans">
        <p className="text-gray-400 text-sm">Bạn chưa thực hiện bài đánh giá kỹ năng chuyên môn.</p>
        <button 
          onClick={() => navigate('/assessment')} 
          className="px-5 py-2.5 bg-[#00e5ff] text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#00b2cc] transition-all"
        >
          Làm bài đánh giá ngay
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070b14] p-6 text-white font-sans antialiased bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0d1b33] via-[#070b14] to-[#070b14]">
      
      <div className={`mx-auto max-w-5xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}>
        
        {/* Header trang */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00e5ff] uppercase tracking-wider mb-2">
            <BrainCircuit size={14} />
            <span>AI Skill Gap Report</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Phân Tích <span className="bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] bg-clip-text text-transparent">Khoảng Cách Kỹ Năng</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Báo cáo chi tiết dựa trên kết quả bài đánh giá năng lực thực tế vị trí <span className="text-white font-semibold">{analysisData.role}</span>.
          </p>
        </div>

        {/* ── THANH LUỒNG TRẠNG THÁI ỨNG DỤNG (BƯỚC 3 ĐANG SÁNG) ── */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-6 pb-4 border-b border-gray-800/40">
          <span className="opacity-40">1. Làm bài đánh giá</span>
          <ArrowRight size={10} className="text-gray-600" />
          <span className="opacity-40">2. Đề xuất lộ trình nghề nghiệp</span>
          <ArrowRight size={10} className="text-gray-600" />
          <span className="text-[#00e5ff]">3. Phân tích Khoảng cách kỹ năng</span>
          <ArrowRight size={10} className="text-gray-600" />
          <span className="opacity-40">4. Gợi ý khóa học</span>
        </div>

        {/* Khối Banner tổng quan điểm số tương thích */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-800/40 bg-[#0d1527]/70 p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-lg font-bold">Chỉ số tương thích nghề nghiệp hiện tại</h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
              Bạn đạt độ tương thích <span className="text-[#00e5ff] font-semibold">{analysisData.matchPercentage}%</span> so với bộ khung năng lực chuẩn của thị trường tuyển dụng. Hãy tập trung lấp đầy các khoảng trống màu hổ phách phía dưới.
            </p>
          </div>

          {/* Vòng tròn phần trăm đồ họa */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#111e38" strokeWidth="8" fill="transparent" />
              <circle 
                cx="48" 
                cy="48" 
                r="40" 
                stroke="url(#cyan-purple-gradient)" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - analysisData.matchPercentage / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="cyan-purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00e5ff" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute font-mono text-xl font-black text-white">
              {analysisData.matchPercentage}%
            </div>
          </div>
        </div>

        {/* Grid chứa 2 vùng nội dung chính */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CỘT TRÁI: CÁC KỸ NĂNG CÒN THIẾU (MISSING SKILLS) */}
          <div className="rounded-2xl border border-gray-800/50 bg-[#0d1527]/50 p-5 backdrop-blur-sm shadow-md">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-800/30">
              <ShieldAlert size={16} />
              <h3>Kỹ năng cần bổ sung ({analysisData.missingSkills.length})</h3>
            </div>
            
            <div className="space-y-3">
              {analysisData.missingSkills.map((skill, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl bg-[#070c16]/80 border border-gray-800/60 hover:border-amber-500/30 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{skill.name}</h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      skill.priority === "Chủ chốt" 
                        ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {skill.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: CÁC KỸ NĂNG ĐÃ ĐẠT (MATCHED SKILLS) */}
          <div className="rounded-2xl border border-gray-800/50 bg-[#0d1527]/50 p-5 backdrop-blur-sm shadow-md">
            <div className="flex items-center gap-2 text-sm font-bold text-green-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-800/30">
              <Award size={16} />
              <h3>Điểm mạnh đã ghi nhận ({analysisData.matchedSkills.length})</h3>
            </div>

            <div className="space-y-4">
              {analysisData.matchedSkills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                      <span className="font-semibold text-gray-300">{skill.name}</span>
                    </div>
                    <span className="font-mono text-green-400 font-bold">{skill.level}%</span>
                  </div>
                  {/* Thanh tiến trình bar */}
                  <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800/40">
                    <div className="h-full bg-gradient-to-r from-[#00e5ff] to-[#7c3aed]" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Nút hành động cuối trang */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800/40 pt-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/roadmap')}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-semibold py-2 px-3 border border-gray-800 rounded-lg hover:bg-gray-800/40"
            >
              <ChevronLeft size={14} /> Quay lại xem Lộ trình
            </button>
            <button 
              onClick={() => navigate('/assessment')}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors font-semibold py-2"
            >
              <RefreshCw size={12} /> Thử thách lại bộ đề
            </button>
          </div>
          
          <button 
            onClick={() => navigate('/courses')} 
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 bg-[#00e5ff] text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#00b2cc] transition-all shadow-[0_0_20px_rgba(0,229,255,0.15)] active:scale-[0.98]"
          >
            Nhận gợi ý khóa học
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default SkillGap;