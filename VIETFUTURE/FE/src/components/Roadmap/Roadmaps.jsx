import React, { useState, useEffect } from 'react';
import { Terminal, Layout, Database, Server, Smartphone, ArrowRight, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

function Roadmaps() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await axiosClient.get("/careers");
        if (res.data && res.data.length > 0) {
          setData(res.data.map(c => ({
            title: c.career_name,
            time: c.demand_level || "6 tháng",
            skills: parseInt(c.salary_range) || 10,
            desc: c.description || "",
          })));
        }
      } catch (err) {
        console.error("Failed to fetch careers", err);
      }
    };
    fetchCareers();
  }, []);

  const handleRoadmapClick = (roleTitle) => {
    const mockData = {
      role: roleTitle,
      hasCV: false, // Flag để báo Roadmap biết không có CV
      skills: [], 
      missing: [
        "internet", "linux", "git", "nodejs", "restapi", 
        "sql", "nosql", "auth", "docker", "redis",
        "html", "css", "react", "python", "figma"
      ]
    };
    localStorage.setItem("devpath_analysis_result", JSON.stringify(mockData));
    navigate("/roadmap");
  };

  // 🛠️ Xử lý hiệu ứng khi bấm nút "Xem tất cả"
  const handleViewAll = () => {
    setTimeout(() => {
      navigate('/all-roadmaps');
    }, 50); // Delay 50ms tạo cảm giác mượt mà (haptic feedback giả lập)
  };

  return (
    <section id="roadmaps" className="px-6 py-15 max-w-7xl mx-auto bg-[#05080f] text-white">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <p className="text-[#00E5FF] text-[11px] font-semibold uppercase tracking-[0.35em] mb-4">Lộ trình</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight relative inline-block">
            <span className="relative z-10">Chọn hướng đi của bạn</span>
            <span className="absolute bottom-1 left-0 w-full h-4 bg-blue-600/30 -z-0"></span>
          </h2>
          <p className="text-white/40 mt-5 max-w-md text-[15px] leading-relaxed">
            Mỗi lộ trình được thiết kế theo yêu cầu thực tế của nhà tuyển dụng IT Việt Nam.
          </p>
        </div>

        {/* 🛠️ Nút "Xem tất cả" được cấu hình lại với hiệu ứng hover/active mượt mà */}
        <button 
          onClick={handleViewAll}
          className="group px-6 py-3 rounded-xl border border-[#00E5FF]/20 text-[#00E5FF] bg-[#00E5FF]/10 text-sm font-bold transition-all duration-300 ease-out transform hover:bg-[#00E5FF]/20 hover:scale-[1.03] active:scale-95 flex items-center gap-2"
        >
          Xem tất cả <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid Section */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {data.map((r, i) => (
          <div 
            key={i} 
            onClick={() => handleRoadmapClick(r.title)} 
            className="group bg-white/[0.02] p-10 rounded-[2rem] border border-white/5 
                       hover:border-[#00E5FF]/30 hover:bg-white/[0.04]
                       transition-all duration-500 cursor-pointer relative flex flex-col min-h-[380px]
                       transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,229,255,0.05)]"
          >
            {/* Icon Box */}
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#00E5FF] group-hover:border-[#00E5FF]/30 mb-8 transition-all duration-300">
              {r.title.includes("Backend") ? <Server size={24} /> :
               r.title.includes("Frontend") ? <Layout size={24} /> :
               r.title.includes("Data") ? <Database size={24} /> :
               r.title.includes("DevOps") ? <Terminal size={24} /> :
               r.title.includes("Mobile") ? <Smartphone size={24} /> :
               <Briefcase size={24} />}
            </div>

            <h3 className="font-bold text-2xl mb-4 group-hover:text-white transition-colors">
              {r.title}
            </h3>

            <p className="text-white/40 text-[15px] leading-relaxed mb-8 flex-grow group-hover:text-white/60 transition-colors">
              {r.desc}
            </p>

            {/* Tags Section */}
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-[#00E5FF]/10 text-[#00E5FF] text-[11px] font-bold rounded-full border border-[#00E5FF]/20">
                {r.skills} kỹ năng
              </span>
              <span className="px-4 py-1.5 bg-pink-500/10 text-pink-400 text-[11px] font-bold rounded-full border border-pink-500/20">
                {r.time}
              </span>
            </div>

            {/* Icon mũi tên góc trên */}
            <div className="absolute top-10 right-10 text-white/20 group-hover:text-[#00E5FF] transition-all duration-300">
              <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0" />
            </div>
          </div>
        ))}

        {/* Card Sắp ra mắt */}
        <div className="border-2 border-dashed border-white/5 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center bg-transparent cursor-default">
          <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/20 mb-4 font-light text-2xl group-hover:scale-110 transition-transform">
            +
          </div>
          <h3 className="font-bold text-xl text-white/30">Sắp ra mắt</h3>
          <p className="text-white/10 text-xs mt-2 font-medium tracking-wide">
            Game Developer, Cloud Architect...
          </p>
        </div>
      </div>
    </section>
  );
}

export default Roadmaps;