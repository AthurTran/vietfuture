import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Award,
  Star,
  ChevronLeft,
  GraduationCap,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";

// Ánh xạ cấp độ sang màu badge
const levelColors = {
  "Cơ bản": "bg-green-500/10 border-green-500/20 text-green-400",
  "Trung cấp": "bg-blue-500/10 border-blue-500/20 text-blue-400",
  "Nâng cao": "bg-purple-500/10 border-purple-500/20 text-purple-400",
};

// Ánh xạ emoji theo level
const levelEmoji = {
  "Cơ bản": "🟢",
  "Trung cấp": "🔵",
  "Nâng cao": "🟣",
};

function Courses() {
  const navigate = useNavigate();
  const [isAnimate, setIsAnimate] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [roleName, setRoleName] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsAnimate(true);

    // Đọc role name từ localStorage nếu có
    const recommendedRole = localStorage.getItem("courses_recommended_role");
    const localGapData = localStorage.getItem("skill_gap_result");
    if (recommendedRole) {
      setRoleName(recommendedRole);
    } else if (localGapData) {
      try {
        const parsed = JSON.parse(localGapData);
        if (parsed.role) setRoleName(parsed.role);
      } catch (_) {}
    }

    // Tải khóa học thật từ API backend (MySQL)
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await axiosClient.get("/courses");
        // data là mảng trả về từ prisma.course.findMany()
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Lấy danh sách cấp độ duy nhất từ dữ liệu thực tế
  const levels = [
    "all",
    ...new Set(courses.map((c) => c.level).filter(Boolean)),
  ];

  const filteredCourses =
    selectedFilter === "all"
      ? courses
      : courses.filter((c) => c.level === selectedFilter);

  return (
    <div className="relative min-h-screen bg-[#070b14] p-6 text-white font-sans antialiased bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0d1b33] via-[#070b14] to-[#070b14]">
      <div
        className={`mx-auto max-w-5xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Header trang */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00e5ff] uppercase tracking-wider mb-2">
            <GraduationCap size={14} />
            <span>Kho khóa học VietFuture</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Khóa Học{" "}
            <span className="bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] bg-clip-text text-transparent">
              Gợi Ý Từ AI
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {roleName ? (
              <>
                Các khóa học được đề xuất cho vị trí{" "}
                <span className="text-white font-semibold">{roleName}</span>.
              </>
            ) : (
              "Tất cả khóa học hiện có trong hệ thống VietFuture."
            )}
          </p>
        </div>

        {/* Breadcrumb luồng */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-6 pb-4 border-b border-gray-800/40">
          <span className="opacity-40">1. Làm bài đánh giá</span>
          <ArrowRight size={10} className="text-gray-600" />
          <span className="opacity-40">2. Đề xuất lộ trình nghề nghiệp</span>
          <ArrowRight size={10} className="text-gray-600" />
          <span className="opacity-40">3. Phân tích Khoảng cách kỹ năng</span>
          <ArrowRight size={10} className="text-gray-600" />
          <span className="text-[#00e5ff]">4. Gợi ý khóa học</span>
        </div>

        {/* Bộ lọc theo cấp độ */}
        {!loading && !error && courses.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedFilter(level)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedFilter === level
                      ? "bg-[#00e5ff] text-black shadow-[0_0_12px_rgba(0,229,255,0.2)]"
                      : "bg-[#0d1527] border border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {level === "all" ? "Tất cả" : level}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-gray-400 bg-gray-900/40 border border-gray-800 px-3 py-1 rounded-lg">
              🎓{" "}
              <span className="text-[#00e5ff] font-bold">
                {filteredCourses.length}
              </span>{" "}
              khóa học
            </div>
          </div>
        )}

        {/* Trạng thái tải */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-[#00e5ff] mb-4" />
            <p className="text-sm">Đang tải khóa học từ cơ sở dữ liệu...</p>
          </div>
        )}

        {/* Lỗi tải */}
        {!loading && error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <div className="font-bold text-sm">Lỗi kết nối</div>
              <div className="text-xs mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {/* Không có dữ liệu */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-bold mb-2">Chưa có khóa học nào</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Hãy thêm khóa học vào cơ sở dữ liệu MySQL của bạn để hiển thị tại
              đây.
            </p>
          </div>
        )}

        {/* Danh sách khóa học dưới dạng Grid Cards */}
        {!loading && !error && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.course_id}
                className="group relative rounded-xl border border-gray-800/60 bg-[#0d1527]/50 p-5 backdrop-blur-sm shadow-md hover:border-[#00e5ff]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Header card */}
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${levelColors[course.level] || "bg-gray-700/30 border-gray-700 text-gray-400"}`}
                    >
                      {levelEmoji[course.level] || "📘"} {course.level || "N/A"}
                    </span>
                    {course.duration_hours && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                        <BookOpen size={11} />
                        <span>{course.duration_hours} giờ</span>
                      </div>
                    )}
                  </div>

                  {/* Tiêu đề & Provider */}
                  <div className="mb-3">
                    <h3 className="text-sm font-bold leading-snug text-gray-100 group-hover:text-white transition-colors line-clamp-2 mb-1">
                      {course.course_name}
                    </h3>
                    {course.provider && (
                      <p className="text-[11px] text-[#00e5ff]/70 font-medium">
                        {course.provider}
                      </p>
                    )}
                    {course.description && (
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer card */}
                <div className="border-t border-gray-900 pt-3 mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Award size={12} className="text-amber-400" />
                      {course.level || "Chưa phân loại"}
                    </span>
                  </div>
                  {course.course_url && (
                    <a
                      href={course.course_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] text-[#00e5ff] hover:underline font-bold"
                    >
                      Xem khóa học <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Điều hướng cuối trang */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800/40 pt-4">
          <button
            onClick={() => navigate("/skill-gap")}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-semibold py-2 px-3 border border-gray-800 rounded-lg hover:bg-gray-800/40 w-full sm:w-auto justify-center"
          >
            <ChevronLeft size={14} /> Quay lại Khoảng cách kỹ năng
          </button>

          <button
            onClick={() => navigate("/progress")}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.15)] active:scale-[0.98]"
          >
            Theo dõi tiến độ học tập
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Courses;
