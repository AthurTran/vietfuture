import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ChevronLeft, LayoutDashboard, Calendar, 
  CheckCircle2, Circle, Flame, Hourglass, Trophy, BarChart3 
} from 'lucide-react';

function ProgressTracking() {
  const navigate = useNavigate();
  const [isAnimate, setIsAnimate] = useState(false);
  const [roleName, setRoleName] = useState('Chuyên viên Công nghệ');
  
  // 1. Giả lập dữ liệu tiến độ học tập (Mock Data)
  const [learningStats, setLearningStats] = useState({
    overallProgress: 35, // Phần trăm hoàn thành lộ trình tổng thể
    streakDays: 5,       // Số ngày học liên tục
    hoursLearned: 14.5,  // Tổng số giờ đã học
    badgesCount: 2,      // Số danh hiệu đã đạt
  });

  // 2. Giả lập danh sách các mục tiêu/khóa học đang phân bổ theo tuần
  const [weeklyTasks, setWeeklyTasks] = useState([
    {
      id: 1,
      title: "Cơ sở dữ liệu SQL: Hoàn thành chương 'Tối ưu Index & Query'",
      duration: "4 giờ",
      status: "completed", // completed | in_progress | todo
      category: "Database"
    },
    {
      id: 2,
      title: "Docker Containerization: Đóng gói ứng dụng thực tế với Dockerfile",
      duration: "5 giờ",
      status: "in_progress",
      category: "DevOps"
    },
    {
      id: 3,
      title: "Bảo mật hệ thống: Tìm hiểu cơ chế mã hóa JWT và băm mật khẩu",
      duration: "3 giờ",
      status: "todo",
      category: "Security"
    },
    {
      id: 4,
      title: "RESTful API: Thực hành chuẩn hóa mã lỗi HTTP Status Code",
      duration: "2.5 giờ",
      status: "todo",
      category: "API Design"
    }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsAnimate(true);

    // ĐỒNG BỘ DỮ LIỆU: Đọc chức danh công việc đã lưu từ các bước trước để cá nhân hóa lộ trình học
    const recommendedRole = localStorage.getItem("courses_recommended_role");
    if (recommendedRole) {
      setRoleName(recommendedRole);
    }
  }, []);

  // Hàm xử lý khi người dùng tích chọn hoàn thành nhanh một task (Tăng tính tương tác UI)
  const toggleTaskStatus = (id) => {
    setWeeklyTasks(prev => prev.map(task => {
      if (task.id === id) {
        const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
        return { ...task, status: nextStatus };
      }
      return task;
    }));

    // Giả lập cập nhật lại thanh phần trăm tổng thể khi tương tác nút bấm
    setLearningStats(prev => ({
      ...prev,
      overallProgress: prev.overallProgress + 5 <= 100 ? prev.overallProgress + 2 : 100
    }));
  };

  return (
    <div className="relative min-h-screen bg-[#070b14] p-6 text-white font-sans antialiased bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0d1b33] via-[#070b14] to-[#070b14]">
      
      <div className={`mx-auto max-w-5xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}>
        
        {/* Header trang */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00e5ff] uppercase tracking-wider mb-2">
            <LayoutDashboard size={14} />
            <span>AI Learning Dashboard & Analytics</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Theo Dõi <span className="bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] bg-clip-text text-transparent">Tiến Độ Học Tập</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Quản lý kế hoạch rèn luyện hàng tuần nhằm thu hẹp khoảng cách năng lực cho vị trí <span className="text-white font-semibold">{roleName}</span>.
          </p>
        </div>

        {/* ── THANH LUỒNG TRẠNG THÁI HỆ THỐNG (BƯỚC CHÍNH ĐANG ĐỒNG BỘ) ── */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-8 pb-4 border-b border-gray-800/40">
          <span className="opacity-30">1. Đánh giá kỹ năng</span>
          <ArrowRight size={10} className="text-gray-600" />
          <span className="opacity-30">2. Lộ trình nghề nghiệp</span>
          <ArrowRight size={10} className="text-gray-600" />
          <span className="opacity-30">3. Khoảng cách kỹ năng</span>
          <ArrowRight size={10} className="text-gray-600" />
          <span className="opacity-30">4. Gợi ý khóa học</span>
          <ArrowRight size={10} className="text-gray-600" />
          <span className="text-[#00e5ff]">5. Tiến độ học tập</span>
        </div>

        {/* BẢNG THỐNG KÊ CHỈ SỐ (STATS GRID CARD) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Card 1: Tiến trình tổng thể */}
          <div className="rounded-xl border border-gray-800/60 bg-[#0d1527]/40 p-4 backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
              <span>Tiến độ tổng thể</span>
              <BarChart3 size={16} className="text-[#00e5ff]" />
            </div>
            <div className="text-xl font-black font-mono text-white mb-2">
              {learningStats.overallProgress}%
            </div>
            <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00e5ff] to-[#7c3aed]" style={{ width: `${learningStats.overallProgress}%` }}></div>
            </div>
          </div>

          {/* Card 2: Chuỗi ngày liên tục */}
          <div className="rounded-xl border border-gray-800/60 bg-[#0d1527]/40 p-4 backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
              <span>Chuỗi học (Streak)</span>
              <Flame size={16} className="text-orange-500 animate-pulse" />
            </div>
            <div className="text-xl font-black font-mono text-orange-400 mb-1">
              {learningStats.streakDays} Ngày
            </div>
            <p className="text-[10px] text-gray-500">Giữ ngọn lửa rèn luyện đều đặn!</p>
          </div>

          {/* Card 3: Giờ học tích lũy */}
          <div className="rounded-xl border border-gray-800/60 bg-[#0d1527]/40 p-4 backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
              <span>Thời gian học</span>
              <Hourglass size={16} className="text-purple-400" />
            </div>
            <div className="text-xl font-black font-mono text-white mb-1">
              {learningStats.hoursLearned} Giờ
            </div>
            <p className="text-[10px] text-gray-500">Tích lũy trong tuần này</p>
          </div>

          {/* Card 4: Danh hiệu đạt được */}
          <div className="rounded-xl border border-gray-800/60 bg-[#0d1527]/40 p-4 backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
              <span>Danh hiệu AI</span>
              <Trophy size={16} className="text-amber-400" />
            </div>
            <div className="text-xl font-black font-mono text-amber-400 mb-1">
              {learningStats.badgesCount} Đạt được
            </div>
            <p className="text-[10px] text-gray-500">Đã mở khóa chứng nhận</p>
          </div>

        </div>

        {/* DANH SÁCH MỤC TIÊU / NHIỆM VỤ CHI TIẾT */}
        <div className="rounded-2xl border border-gray-800/50 bg-[#0d1527]/50 p-5 backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-gray-800/30">
            <div className="flex items-center gap-2 text-[#00e5ff]">
              <Calendar size={16} />
              <h3>Kế hoạch học tập tuần này</h3>
            </div>
            <span className="text-[11px] text-gray-500 font-mono normal-case">Tích chọn để cập nhật tiến độ</span>
          </div>

          <div className="space-y-3">
            {weeklyTasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => toggleTaskStatus(task.id)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group ${
                  task.status === 'completed'
                    ? 'bg-gray-950/40 border-gray-800/30 opacity-60'
                    : 'bg-[#070c16]/80 border-gray-800/60 hover:border-[#00e5ff]/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon Tích chọn trạng thái */}
                  <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                    {task.status === 'completed' ? (
                      <CheckCircle2 size={18} className="text-green-500" />
                    ) : task.status === 'in_progress' ? (
                      <Circle size={18} className="text-[#00e5ff] stroke-[2.5]" />
                    ) : (
                      <Circle size={18} className="text-gray-600" />
                    )}
                  </div>

                  <div>
                    {/* Tiêu đề nhiệm vụ */}
                    <h4 className={`text-sm font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-1 ${
                      task.status === 'completed' ? 'line-through text-gray-500 group-hover:text-gray-500' : ''
                    }`}>
                      {task.title}
                    </h4>
                    
                    {/* Metadata nhiệm vụ */}
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                      <span className="bg-gray-900 border border-gray-800 px-2 py-0.2 rounded text-[10px] text-gray-400">
                        {task.category}
                      </span>
                      <span>•</span>
                      <span>Dự kiến: {task.duration}</span>
                      {task.status === 'in_progress' && (
                        <>
                          <span>•</span>
                          <span className="text-[#00e5ff] font-semibold animate-pulse">Đang trong tiến trình học</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badge trạng thái bên phải */}
                <div className="hidden sm:block">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    task.status === 'completed' 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : task.status === 'in_progress'
                      ? 'bg-cyan-500/10 text-[#00e5ff] border border-cyan-500/20'
                      : 'bg-gray-800 text-gray-400 border border-gray-700/50'
                  }`}>
                    {task.status === 'completed' ? 'Xong' : task.status === 'in_progress' ? 'Học tiếp' : 'Chờ học'}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* KHU VỰC ĐIỀU HƯỚNG CHÂN TRANG (FLOW NAVIGATION) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800/40 pt-4">
          <button 
            onClick={() => navigate('/courses')}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-semibold py-2 px-3 border border-gray-800 rounded-lg hover:bg-gray-800/40 w-full sm:w-auto justify-center"
          >
            <ChevronLeft size={14} /> Quay lại Gợi ý khóa học
          </button>
          
          <button 
            onClick={() => navigate('/ai-consultant')} // Điều hướng thẳng tới trang cuối cùng trong luồng
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.15)] active:scale-[0.98]"
          >
            Chat với AI tư vấn nghề nghiệp
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProgressTracking;